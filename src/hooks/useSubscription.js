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

  const refreshSubscription = useCallback(() => {
    if (!userId) return
    setResult(current => current.userId === userId ? { ...current, userId: null } : current)
    setRefreshKey(current => current + 1)
  }, [userId])

  const plan = getPlan(subscription?.status === 'active' ? subscription.plan : 'free')

  return {
    subscription,
    plan,
    loading,
    error,
    refreshSubscription,
    isPro: subscription?.plan === 'pro' && subscription?.status === 'active',
  }
}
