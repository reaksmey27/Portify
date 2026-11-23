const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405)

  try {
    const authorization = request.headers.get('Authorization')
    if (!authorization?.startsWith('Bearer ')) return response({ error: 'Sign in before upgrading.' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const paddleApiKey = Deno.env.get('PADDLE_API_KEY')
    const monthlyPriceId = Deno.env.get('PADDLE_MONTHLY_PRICE_ID')
    const yearlyPriceId = Deno.env.get('PADDLE_YEARLY_PRICE_ID')
    const paddleEnvironment = Deno.env.get('PADDLE_ENVIRONMENT') || 'sandbox'
    if (!['sandbox', 'live'].includes(paddleEnvironment)) {
      return response({ error: 'Paddle environment must be sandbox or live.' }, 503)
    }
    if (!supabaseUrl || !supabaseAnonKey || !paddleApiKey || !monthlyPriceId || !yearlyPriceId) {
      console.error('Checkout function is missing required server configuration.')
      return response({ error: 'Checkout is not configured yet. Please try again later.' }, 503)
    }

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseAnonKey, Authorization: authorization },
    })
    if (!userResponse.ok) return response({ error: 'Your session is invalid. Sign in again.' }, 401)
    const user = await userResponse.json()

    const subscriptionResponse = await fetch(
      `${supabaseUrl}/rest/v1/portify_subscriptions?select=plan,status&user_id=eq.${encodeURIComponent(user.id)}`,
      { headers: { apikey: supabaseAnonKey, Authorization: authorization } },
    )
    if (!subscriptionResponse.ok) return response({ error: 'Could not verify your current plan.' }, 502)
    const subscriptions = await subscriptionResponse.json()
    if (subscriptions.some((subscription: { plan: string; status: string }) => subscription.plan === 'pro' && ['active', 'past_due'].includes(subscription.status))) {
      return response({ error: 'Your Pro subscription is already active.' }, 409)
    }

    const body = await request.json().catch(() => ({}))
    const billingInterval = body.billingInterval
    if (billingInterval !== 'month' && billingInterval !== 'year') {
      return response({ error: 'Choose a valid billing interval.' }, 400)
    }

    const priceId = billingInterval === 'month' ? monthlyPriceId : yearlyPriceId
    const paddleApiBase = paddleEnvironment === 'live' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com'
    const paddleResponse = await fetch(`${paddleApiBase}/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        collection_mode: 'automatic',
        custom_data: { portify_user_id: user.id, billing_interval: billingInterval },
      }),
    })
    const paddleResult = await paddleResponse.json()
    if (!paddleResponse.ok || !paddleResult?.data?.id) {
      console.error('Paddle transaction creation failed:', paddleResult?.error?.detail || paddleResponse.status)
      return response({ error: 'Could not start checkout. Please try again.' }, 502)
    }

    return response({ transactionId: paddleResult.data.id })
  } catch (error) {
    console.error('Checkout request failed:', error?.message || error)
    return response({ error: 'Could not start checkout. Please try again.' }, 500)
  }
})
