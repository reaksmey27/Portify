import { supabase } from '../lib/supabase'
import { getPaddle } from '../lib/paddle'

export async function startProCheckout(billingInterval = 'month') {
  if (!supabase) throw new Error('Supabase is not configured.')
  if (!['month', 'year'].includes(billingInterval)) throw new Error('Choose a valid billing interval.')

  const { data, error } = await supabase.functions.invoke('create-paddle-checkout', {
    body: { billingInterval },
  })
  if (error) throw error
  if (!data?.transactionId) throw new Error(data?.error || 'Checkout transaction was not created.')

  const paddle = await getPaddle({
    eventCallback: event => {
      if (event.name === 'checkout.completed') window.dispatchEvent(new Event('portify:checkout-completed'))
    },
  })
  paddle.Checkout.open({ transactionId: data.transactionId })
}
