// Service Worker cho Học Và Chơi — Hoạt động offline 100% trên iPad Safari & PWA
const CACHE_NAME = 'hocvachoi-v3'

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './favicon.png',
  './apple-touch-icon.png',
  './apple-touch-icon-180x180.png',
  './apple-touch-icon-167x167.png',
  './apple-touch-icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
]

// 1. Cài đặt Service Worker và lưu sẵn các tệp cốt lõi
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Lỗi precache một số tài nguyên ban đầu:', err)
      })
    })
  )
})

// 2. Kích hoạt và dọn dẹp các phiên bản cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// 3. Chiến lược Cache-First: Ưu tiên bộ nhớ đệm, tự động lưu mọi audio, hình ảnh và script khi tải
self.addEventListener('fetch', (event) => {
  // Chỉ xử lý các request HTTP/HTTPS cùng origin hoặc relative
  if (!event.request.url.startsWith('http')) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Lưu vào cache nếu phản hồi hợp lệ
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => {
          // Khi mất mạng và là yêu cầu trang chính, trả về trang index trong cache
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html') || caches.match('./')
          }
        })
    })
  )
})
