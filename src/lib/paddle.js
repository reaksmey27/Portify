import { initializePaddle } from '@paddle/paddle-js'

let paddleInstance

export async function getPaddle(options = {}) {
  if (paddleInstance) return paddleInstance

  const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN
  if (!token) throw new Error('Paddle client token is missing. Add it to your .env file.')

  paddleInstance = await initializePaddle({ environment: 'sandbox', token, ...options })
  if (!paddleInstance) throw new Error('Could not initialize Paddle.')
  return paddleInstance
}
