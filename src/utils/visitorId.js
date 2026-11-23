const VISITOR_KEY = 'portify_visitor_id'

function createVisitorId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
}

export function getVisitorId() {
  try {
    let visitorId = window.localStorage.getItem(VISITOR_KEY)
    if (!visitorId) {
      visitorId = createVisitorId()
      window.localStorage.setItem(VISITOR_KEY, visitorId)
    }
    return visitorId
  } catch {
    return createVisitorId()
  }
}
