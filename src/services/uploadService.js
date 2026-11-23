import { supabase } from '../lib/supabase'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function validateImage(file) {
  if (!file) throw new Error('Please select an image.')
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error('Only JPG, PNG, and WebP images are supported.')
  if (file.size > MAX_FILE_SIZE) throw new Error('Image must be smaller than 5 MB.')
}

async function uploadImage(file, bucket, userId, folder) {
  validateImage(file)
  if (!userId) throw new Error('You must be signed in to upload images.')
  if (!supabase) throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY).')

  const extension = file.name.split('.').pop()?.toLowerCase() || 'image'
  const filePath = `${userId}/${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error

  return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl
}

export function uploadAvatar(file, userId) {
  return uploadImage(file, 'avatars', userId, 'profile')
}

export function uploadProjectImage(file, userId) {
  return uploadImage(file, 'project-images', userId, 'projects')
}
