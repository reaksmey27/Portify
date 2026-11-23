function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return difference === 0
}

async function verifySignature(rawBody: string, signatureHeader: string, secret: string) {
  const parts = Object.fromEntries(signatureHeader.split(';').map(part => {
    const separator = part.indexOf('=')
    return separator < 0 ? [part.trim(), ''] : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()]
  }))
  const timestamp = Number(parts.ts)
  const signatures = signatureHeader.split(';').map(part => part.trim()).filter(part => part.startsWith('h1=')).map(part => part.slice(3))
  if (!Number.isFinite(timestamp) || !signatures.length || Math.abs(Date.now() / 1000 - timestamp) > 5) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}:${rawBody}`))
  const expected = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('')
  return signatures.some(signature => constantTimeEqual(signature, expected))
}

Deno.serve(async request => {
  if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405)

  try {
    const webhookSecret = Deno.env.get('PADDLE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const signature = request.headers.get('Paddle-Signature') || ''
    if (!webhookSecret || !supabaseUrl || !serviceRoleKey) {
      console.error('Webhook function is missing required server configuration.')
      return response({ error: 'Webhook is not configured.' }, 503)
    }

    const rawBody = await request.text()
    if (!await verifySignature(rawBody, signature, webhookSecret)) return response({ error: 'Invalid webhook signature.' }, 401)

    const event = JSON.parse(rawBody)
    const data = event?.data
    const allowedEvents = new Set([
      'subscription.created',
      'subscription.updated',
      'subscription.activated',
      'subscription.trialing',
      'subscription.past_due',
      'subscription.paused',
      'subscription.canceled',
    ])
    if (!allowedEvents.has(event.event_type)) return response({ received: true })
    if (!data || !/^evt_[a-z0-9]{26}$/i.test(event.event_id || '')) return response({ error: 'Invalid subscription event.' }, 400)

    let userId = data.custom_data?.portify_user_id || data.custom_data?.user_id
    if (userId && !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(userId)) return response({ error: 'Invalid Portify user ID.' }, 400)

    if (!userId && data.id) {
      const ownerResponse = await fetch(
        `${supabaseUrl}/rest/v1/portify_subscriptions?select=user_id&paddle_subscription_id=eq.${encodeURIComponent(data.id)}`,
        { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } },
      )
      if (!ownerResponse.ok) return response({ error: 'Could not find subscription owner.' }, 500)
      const ownerRows = await ownerResponse.json()
      userId = ownerRows[0]?.user_id
    }
    if (!userId) return response({ error: 'Could not identify subscription owner.' }, 500)

    const paddleStatus = data.status
    const status = paddleStatus === 'active' || paddleStatus === 'trialing'
      ? 'active'
      : paddleStatus === 'past_due'
        ? 'past_due'
        : paddleStatus === 'canceled'
          ? 'cancelled'
          : 'inactive'
    const billingInterval = data.items?.[0]?.price?.billing_cycle?.interval
    const occurredAt = event.occurred_at
    if (!occurredAt || Number.isNaN(Date.parse(occurredAt))) return response({ error: 'Invalid event timestamp.' }, 400)

    const update = await fetch(`${supabaseUrl}/rest/v1/rpc/apply_portify_paddle_subscription_event`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        p_event_id: event.event_id,
        p_occurred_at: occurredAt,
        p_user_id: userId,
        p_plan: status === 'active' || status === 'past_due' ? 'pro' : 'free',
        p_status: status,
        p_customer_id: data.customer_id || null,
        p_subscription_id: data.id,
        p_billing_interval: billingInterval === 'year' ? 'year' : billingInterval === 'month' ? 'month' : null,
        p_current_period_end: data.current_billing_period?.ends_at || null,
      }),
    })
    if (!update.ok) {
      console.error('Could not apply subscription event:', update.status, await update.text())
      return response({ error: 'Could not save subscription state.' }, 500)
    }

    const outcome = await update.json()
    return response({ received: true, outcome })
  } catch (error) {
    console.error('Webhook processing failed:', error?.message || error)
    return response({ error: 'Webhook processing failed.' }, 400)
  }
})
