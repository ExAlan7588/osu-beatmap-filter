const CACHE_NAME = 'osu-filter-v4';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting()) // 強制新的 Service Worker 立即接管
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // 清理舊的緩存
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // 確保 Service Worker 立即控制所有頁面
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', event => {
    // 處理相對路徑
    const url = new URL(event.request.url);
    const isLocal = url.origin === location.origin;
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // 只緩存本地資源
                        if (isLocal) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }

                        return response;
                    })
                    .catch(() => {
                        // 如果是導航請求，返回首頁
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        // 其他請求返回 404
                        return new Response('Not found', {
                            status: 404,
                            statusText: 'Not found'
                        });
                    });
            })
    );
}); 