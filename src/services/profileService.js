import { supabase } from '../lib/supabase'

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

export async function getMyProfile(userId) {
  const { data, error } = await requireSupabase()
    .from('profiles')
    .select('id, full_name, bio, website, location, avatar_url')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateMyProfile(userId, updates) {
  const { data, error } = await requireSupabase()
    .from('profiles')
    .update({
      full_name: updates.full_name.trim(),
      bio: updates.bio.trim(),
      website: updates.website.trim(),
      location: updates.location.trim(),
      avatar_url: updates.avatar_url.trim(),
    })
    .eq('id', userId)
    .select('id, full_name, bio, website, location, avatar_url')
    .single()

  if (error) throw error
  return data
}

export async function updateMyEmail(email) {
  const { error } = await requireSupabase().auth.updateUser({ email: email.trim() })
  if (error) throw error
}

export async function updateMyPassword(password) {
  const { error } = await requireSupabase().auth.updateUser({ password })
  if (error) throw error
}
