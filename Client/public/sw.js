// CivilSoul Service Worker - Advanced Caching and Offline Support

const CACHE_NAME = 'civilsoul-v1.0.0';
const API_CACHE_NAME = 'civilsoul-api-v1.0.0';
const IMAGE_CACHE_NAME = 'civilsoul-images-v1.0.0';

// Resources to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/blogs/,
  /\/api\/volunteering/,
  /\/api\/mental-health/,
  /\/api\/certificates/,
  /\/api\/users\/profile/
];

// Images to cache
const IMAGE_CACHE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /images\.unsplash\.com/
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      }),
      
      // Cache API data
      caches.open(API_CACHE_NAME),
      
      // Cache images
      caches.open(IMAGE_CACHE_NAME)
    ]).then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network First with Cache Fallback
    event.respondWith(handleAPIRequest(request));
  } else if (IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    // Images - Cache First with Network Fallback
    event.respondWith(handleImageRequest(request));
  } else {
    // Static resources - Stale While Revalidate
    event.respondWith(handleStaticRequest(request));
  }
});

// API request handler - Network First strategy
async function handleAPIRequest(request) {
  const cacheName = API_CACHE_NAME;
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for API request, trying cache...');
    
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for critical endpoints
    if (request.url.includes('/api/user') || request.url.includes('/api/profile')) {
      return new Response(
        JSON.stringify({ error: 'Offline', message: 'This data is not available offline' }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

// Image request handler - Cache First strategy
async function handleImageRequest(request) {
  const cacheName = IMAGE_CACHE_NAME;
  
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the image
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return placeholder image for failed requests
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Image unavailable</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
}

// Static request handler - Stale While Revalidate strategy
async function handleStaticRequest(request) {
  const cacheName = CACHE_NAME;
  
  // Get from cache
  const cachedResponse = await caches.match(request);
  
  // Fetch from network in the background
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  // Return cached version immediately, or wait for network
  return cachedResponse || networkResponsePromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-volunteers') {
    event.waitUntil(syncVolunteerApplications());
  } else if (event.tag === 'background-sync-certificates') {
    event.waitUntil(syncCertificateRequests());
  } else if (event.tag === 'background-sync-blog-interactions') {
    event.waitUntil(syncBlogInteractions());
  }
});

// Sync volunteer applications made offline
async function syncVolunteerApplications() {
  try {
    const syncData = await getStoredSyncData('volunteer-applications');
    
    for (const application of syncData) {
      await fetch('/api/volunteering/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${application.token}`
        },
        body: JSON.stringify(application.data)
      });
    }
    
    // Clear synced data
    await clearStoredSyncData('volunteer-applications');
    
    // Notify success
    await notifyClient({
      title: 'Applications Synced',
      body: 'Your volunteer applications have been submitted successfully',
      icon: '/favicon.ico'
    });
    
  } catch (error) {
    console.error('Failed to sync volunteer applications:', error);
  }
}

// Sync certificate requests made offline
async function syncCertificateRequests() {
  try {
    const syncData = await getStoredSyncData('certificate-requests');
    
    for (const request of syncData) {
      await fetch('/api/certificates/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.token}`
        },
        body: JSON.stringify(request.data)
      });
    }
    
    await clearStoredSyncData('certificate-requests');
    
    await notifyClient({
      title: 'Certificates Requested',
      body: 'Your certificate requests have been processed',
      icon: '/favicon.ico'
    });
    
  } catch (error) {
    console.error('Failed to sync certificate requests:', error);
  }
}

// Sync blog interactions (likes, comments) made offline
async function syncBlogInteractions() {
  try {
    const syncData = await getStoredSyncData('blog-interactions');
    
    for (const interaction of syncData) {
      const endpoint = interaction.type === 'like' ? '/api/blogs/like' : '/api/blogs/comment';
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${interaction.token}`
        },
        body: JSON.stringify(interaction.data)
      });
    }
    
    await clearStoredSyncData('blog-interactions');
    
  } catch (error) {
    console.error('Failed to sync blog interactions:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (error) {
      notificationData = { title: 'CivilSoul', body: event.data.text() };
    }
  }
  
  const options = {
    title: notificationData.title || 'CivilSoul',
    body: notificationData.body || 'New notification',
    icon: notificationData.icon || '/favicon.ico',
    badge: '/favicon.ico',
    tag: notificationData.tag || 'default',
    data: notificationData.data || {},
    actions: notificationData.actions || [],
    requireInteraction: notificationData.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  
  event.notification.close();
  
  const data = event.notification.data;
  const action = event.action;
  
  let url = '/';
  
  if (action === 'view') {
    url = data.url || '/';
  } else if (data.url) {
    url = data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Try to focus existing window
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Utility functions
async function getStoredSyncData(key) {
  try {
    const data = await localforage.getItem(`sync_${key}`);
    return data || [];
  } catch (error) {
    return [];
  }
}

async function clearStoredSyncData(key) {
  try {
    await localforage.removeItem(`sync_${key}`);
  } catch (error) {
    console.error('Failed to clear sync data:', error);
  }
}

async function notifyClient(options) {
  const clients = await self.clients.matchAll();
  
  if (clients.length > 0) {
    clients[0].postMessage({
      type: 'NOTIFICATION',
      data: options
    });
  } else {
    // Show notification if no clients are open
    await self.registration.showNotification(options.title, options);
  }
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
  // Track performance for important resources
  if (event.request.url.includes('/api/')) {
    const start = performance.now();
    
    event.respondWith(
      handleAPIRequest(event.request).then((response) => {
        const duration = performance.now() - start;
        
        // Send performance data to analytics
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'PERFORMANCE',
              data: {
                url: event.request.url,
                method: event.request.method,
                duration,
                cached: response.headers.get('x-cache') === 'HIT'
              }
            });
          });
        });
        
        return response;
      })
    );
  }
});

console.log('CivilSoul Service Worker loaded successfully');
