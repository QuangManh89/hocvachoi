import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tokens.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Đăng ký Service Worker chạy offline 100% khi deploy
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        console.log('PWA ServiceWorker registered with scope:', reg.scope)
      })
      .catch((err) => {
        console.warn('PWA ServiceWorker registration failed:', err)
      })
  })
}
