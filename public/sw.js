// Service Worker for Chepe IA Real Device & Push Notifications
// Manages background push events, system notification clicks, and route redirection

const DEFAULT_ICON = '/icon.svg';
const DEFAULT_BADGE = '/icon.svg';

// Force immediate activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle push notifications received from a Web Push server
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Chepe IA',
    body: 'Tienes una nueva actualización en Chepe IA',
    icon: DEFAULT_ICON,
    badge: DEFAULT_BADGE,
    tab: 'chat',
    url: '/?tab=chat',
    tag: 'chepe-push-notification',
    data: {}
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      notificationData = {
        ...notificationData,
        ...parsed,
        data: {
          ...notificationData.data,
          ...(parsed.data || {}),
          tab: parsed.tab || (parsed.data && parsed.data.tab) || 'chat',
          url: parsed.url || (parsed.data && parsed.data.url) || `/?tab=${encodeURIComponent(parsed.tab || 'chat')}`
        }
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  const targetTab = notificationData.tab || (notificationData.data && notificationData.data.tab) || 'chat';
  const targetUrl = notificationData.url || (notificationData.data && notificationData.data.url) || `/?tab=${encodeURIComponent(targetTab)}`;

  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon || DEFAULT_ICON,
    badge: notificationData.badge || DEFAULT_BADGE,
    tag: notificationData.tag || `chepe-${Date.now()}`,
    vibrate: [200, 100, 200],
    data: {
      tab: targetTab,
      url: targetUrl,
      ...(notificationData.data || {})
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir en Chepe IA'
      },
      {
        action: 'close',
        title: 'Descartar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationOptions)
  );
});

// Handle click events on native system notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // If user clicked the 'close' action button, do nothing further
  if (event.action === 'close') {
    return;
  }

  const notificationData = event.notification.data || {};
  const targetTab = notificationData.tab || 'chat';
  const targetUrl = notificationData.url || `/?tab=${encodeURIComponent(targetTab)}`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. If an existing Chepe IA tab is already open, focus it and notify client
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus().then(() => {
            // Post message to update activeTab in React
            client.postMessage({
              type: 'CHEPE_NOTIFICATION_CLICK',
              tab: targetTab,
              url: targetUrl,
              data: notificationData
            });
            // Also navigate if needed
            if (client.url && !client.url.includes(`tab=${targetTab}`) && 'navigate' in client) {
              return client.navigate(targetUrl);
            }
          });
        }
      }

      // 2. If no window is currently open, launch a new window with the specific route
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle notification dismissal by user
self.addEventListener('notificationclose', (event) => {
  // Optional telemetry or audit tracking hook
});
