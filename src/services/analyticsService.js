import { supabase } from '../lib/supabase'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
  }
  return supabase
}

export async function recordPortfolioView(portfolioId, visitorId) {
  const { error } = await requireSupabase()
    .from('portfolio_views')
    .insert({ portfolio_id: portfolioId, visitor_id: visitorId })
  if (error) throw error
}

export async function getPortfolioAnalytics(portfolioIds) {
  if (!portfolioIds.length) {
    return { totalViews: 0, uniqueVisitors: 0, dailyViews: [], topPortfolios: [], recentViews: [] }
  }

  const { data, error } = await requireSupabase()
    .from('portfolio_views')
    .select('id, portfolio_id, visitor_id, viewed_at')
    .in('portfolio_id', portfolioIds)
    .order('viewed_at', { ascending: false })
  if (error) throw error

  const views = data || []
  const uniqueVisitors = new Set(views.map(view => view.visitor_id)).size
  const dailyMap = new Map()
  const today = new Date()

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - offset))
    const key = date.toISOString().slice(0, 10)
    dailyMap.set(key, { date: key, views: 0 })
  }

  const counts = new Map()
  for (const view of views) {
    const dateKey = new Date(view.viewed_at).toISOString().slice(0, 10)
    if (dailyMap.has(dateKey)) dailyMap.get(dateKey).views += 1
    counts.set(view.portfolio_id, (counts.get(view.portfolio_id) || 0) + 1)
  }

  return {
    totalViews: views.length,
    uniqueVisitors,
    dailyViews: [...dailyMap.values()],
    topPortfolios: portfolioIds
      .map(id => ({ id, views: counts.get(id) || 0 }))
      .sort((left, right) => right.views - left.views),
    recentViews: views.slice(0, 10),
  }
}
