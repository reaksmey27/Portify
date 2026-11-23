import { supabase } from '../lib/supabase'

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

function notifyCountChanged() {
  window.dispatchEvent(new Event('portify:notifications-changed'))
}

export async function getNotifications(userId) {
  const { data, error } = await requireSupabase()
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data || []
}

export async function getUnreadNotificationCount(userId) {
  const { count, error } = await requireSupabase()
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw error
  return count || 0
}

export async function createNotification(notification) {
  const { error } = await requireSupabase().from('notifications').insert(notification)
  if (error) throw error
  notifyCountChanged()
}

export async function markNotificationRead(userId, notificationId) {
  const { error } = await requireSupabase()
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)
  if (error) throw error
  notifyCountChanged()
}

export async function markAllNotificationsRead(userId) {
  const { error } = await requireSupabase()
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  if (error) throw error
  notifyCountChanged()
}
