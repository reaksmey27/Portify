import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    loading,
    signIn: async (email, password) => {
      if (!supabase) throw new Error('Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to the .env file first.')
      return supabase.auth.signInWithPassword({ email, password })
    },
    signUp: async (email, password) => {
      if (!supabase) throw new Error('Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to the .env file first.')
      return supabase.auth.signUp({ email, password })
    },
    signOut: async () => supabase?.auth.signOut(),
  }), [session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
