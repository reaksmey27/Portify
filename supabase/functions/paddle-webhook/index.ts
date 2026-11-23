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
  const parts = Object.fromEntries(signatureHeader.split(';').map(part => part.trim().split('=')))
  const timestamp = Number(parts.ts)
  const signatures = signatureHeader.split(';').map(part => part.trim()).filter(part => part.startsWith('h1=')).map(part => part.slice(3))
  if (!timestamp || !signatures.length || Math.abs(Date.now() / 1000 - timestamp) > 300) return false

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
    if (!data || !String(event.event_type || '').startsWith('subscription.')) return response({ received: true })

    const userId = data.custom_data?.portify_user_id
    if (!userId || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(userId)) {
      console.error('Verified subscription event does not include a valid Portify user ID.', event.event_id)
      return response({ received: true, ignored: true })
    }

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

    const existingResponse = await fetch(
      `${supabaseUrl}/rest/v1/portify_subscriptions?select=paddle_event_occurred_at&user_id=eq.${encodeURIComponent(userId)}`,
      { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } },
    )
    if (!existingResponse.ok) return response({ error: 'Could not verify current subscription state.' }, 500)
    const existingRows = await existingResponse.json()
    const previousTime = existingRows[0]?.paddle_event_occurred_at
    if (previousTime && Date.parse(previousTime) > Date.parse(occurredAt)) return response({ received: true, ignored: true })

    const row = {
      user_id: userId,
      plan: status === 'active' || status === 'past_due' ? 'pro' : 'free',
      status,
      paddle_customer_id: data.customer_id || null,
      paddle_subscription_id: data.id,
      billing_interval: billingInterval === 'year' ? 'year' : billingInterval === 'month' ? 'month' : null,
      current_period_end: data.current_billing_period?.ends_at || null,
      paddle_event_occurred_at: occurredAt,
      updated_at: new Date().toISOString(),
    }

    const update = await fetch(`${supabaseUrl}/rest/v1/portify_subscriptions?on_conflict=user_id`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(row),
    })
    if (!update.ok) {
      console.error('Could not update subscription row:', update.status, await update.text())
      return response({ error: 'Could not save subscription state.' }, 500)
    }

    return response({ received: true })
  } catch (error) {
    console.error('Webhook processing failed:', error?.message || error)
    return response({ error: 'Webhook processing failed.' }, 400)
  }
})
