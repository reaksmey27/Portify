import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import ToastViewport from './components/ToastViewport.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
      <ToastViewport />
    </HelmetProvider>
  </StrictMode>,
)
