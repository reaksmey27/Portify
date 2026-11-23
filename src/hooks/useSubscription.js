import { useCallback, useEffect, useState } from 'react'
import { getPlan } from '../data/plans'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/useAuth'

export function useSubscription() {
  const { user } = useAuth()
  const userId = user?.id
  const [result, setResult] = useState({ userId: null, subscription: null, error: '' })
  const [refreshKey, setRefreshKey] = useState(0)
  const loading = Boolean(userId) && result.userId !== userId
  const subscription = result.userId === userId ? result.subscription : null
  const error = result.userId === userId ? result.error : ''
  const refreshSubscription = useCallback(() => {
    if (!userId) return
    setResult(current => current.userId === userId ? { ...current, userId: null } : current)
    setRefreshKey(current => current + 1)
  }, [userId])

  useEffect(() => {
    if (!userId) return undefined
    let active = true
    const request = supabase
      ? supabase.from('portify_subscriptions').select('*').eq('user_id', userId).maybeSingle()
      : Promise.reject(new Error('Supabase is not configured.'))

    request
      .then(({ data, error: queryError }) => {
        if (active) setResult({ userId, subscription: data, error: queryError?.message || '' })
      })
      .catch(err => {
        if (active) setResult({ userId, subscription: null, error: err.message || 'Could not load subscription.' })
      })

    return () => { active = false }
  }, [userId, refreshKey])

  useEffect(() => {
    let firstRefresh
    let secondRefresh
    const handleCheckoutComplete = () => {
      // Checkout events only trigger a database refresh; the verified webhook remains the source of plan access.
      firstRefresh = window.setTimeout(() => {
        refreshSubscription()
        secondRefresh = window.setTimeout(refreshSubscription, 4000)
      }, 1500)
    }
    window.addEventListener('portify:checkout-completed', handleCheckoutComplete)
    return () => {
      window.removeEventListener('portify:checkout-completed', handleCheckoutComplete)
      window.clearTimeout(firstRefresh)
      window.clearTimeout(secondRefresh)
    }
  }, [refreshSubscription])

  const hasProAccess = subscription?.plan === 'pro' && ['active', 'past_due'].includes(subscription.status)
  const plan = getPlan(hasProAccess ? 'pro' : 'free')

  return {
    subscription,
    plan,
    loading,
    error,
    refreshSubscription,
    isPro: hasProAccess,
  }
}
