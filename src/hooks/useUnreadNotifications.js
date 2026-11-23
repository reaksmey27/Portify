import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { getUnreadNotificationCount } from '../services/notificationService'

export function useUnreadNotifications() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user?.id) return undefined
    let active = true
    const refresh = () => {
      getUnreadNotificationCount(user.id)
        .then(value => { if (active) setCount(value) })
        .catch(() => { if (active) setCount(0) })
    }
    refresh()
    window.addEventListener('portify:notifications-changed', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      active = false
      window.removeEventListener('portify:notifications-changed', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [user?.id])

  return user?.id ? count : 0
}
