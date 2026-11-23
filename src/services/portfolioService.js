import { supabase } from '../lib/supabase'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.')
  }
  return supabase
}

function generateSlug(title) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${baseSlug || 'portfolio'}-${suffix}`
}

export async function getPortfolios() {
  const { data, error } = await requireSupabase()
    .from('portfolios')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createPortfolio({
  title,
  category = '',
  description = '',
  templateId = 'minimal',
  userId,
}) {
  if (!userId) throw new Error('You must be signed in to create a portfolio.')
  if (!title?.trim()) throw new Error('A portfolio title is required.')

  const { data, error } = await requireSupabase()
    .from('portfolios')
    .insert({
      user_id: userId,
      title: title.trim(),
      slug: generateSlug(title),
      category,
      description,
      template_id: templateId,
      status: 'draft',
      content: {},
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePortfolio(id, updates) {
  const { data, error } = await requireSupabase()
    .from('portfolios')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePortfolio(id) {
  const { error } = await requireSupabase()
    .from('portfolios')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

export function publishPortfolio(id) {
  return updatePortfolio(id, { status: 'published' })
}

export function unpublishPortfolio(id) {
  return updatePortfolio(id, { status: 'draft' })
}
