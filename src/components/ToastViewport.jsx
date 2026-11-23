import { lazy, Suspense } from 'react'

const Toaster = lazy(() => import('sonner').then(module => ({ default: module.Toaster })))

export default function ToastViewport() {
  return <Suspense fallback={null}><Toaster position="top-right" richColors /></Suspense>
}
