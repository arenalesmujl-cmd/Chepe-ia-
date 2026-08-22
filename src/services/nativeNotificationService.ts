/**
 * Native Device Notification Service for Chepe IA
 * Handles real OS Web Notifications, permissions, Service Worker dispatch,
 * and click events targeting Chepe IA modules.
 */

export interface NativeNotificationOptions {
  title: string;
  body: string;
  targetTab?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  vibrate?: number[];
  data?: Record<string, any>;
  onNotificationClick?: (tab: string) => void;
}

export interface NotificationDiagnostics {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  isSecureContext: boolean;
  isIframe: boolean;
  hasServiceWorker: boolean;
  serviceWorkerRegistered: boolean;
  statusMessage: string;
}

let swRegistration: ServiceWorkerRegistration | null = null;
let navigationCallback: ((tab: string) => void) | null = null;

/**
 * Set the global navigation callback when a native notification is clicked
 */
export function setNotificationNavigationHandler(callback: (tab: string) => void) {
  navigationCallback = callback;
}

/**
 * Check device and browser capabilities for real notifications
 */
export function checkNotificationSupport(): NotificationDiagnostics {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;
  const isSecure = typeof window !== 'undefined' ? window.isSecureContext : false;
  const hasSW = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  const isIframe = typeof window !== 'undefined' && (window.self !== window.top || window.location !== window.parent.location);

  let permission: NotificationPermission | 'unsupported' = 'unsupported';
  if (isSupported) {
    try {
      permission = Notification.permission;
    } catch (e) {
      permission = 'default';
    }
  }

  let statusMessage = '';
  if (!isSupported) {
    statusMessage = 'Este navegador o entorno no soporta la API de Notificaciones Web nativas.';
  } else if (!isSecure) {
    statusMessage = 'Las notificaciones requieren un contexto seguro HTTPS o localhost.';
  } else if (permission === 'granted') {
    statusMessage = 'Permisos de notificación concedidos en el sistema operativo.';
  } else if (isIframe && permission === 'denied') {
    statusMessage = 'El navegador bloquea los permisos dentro de marcos de previsualización (iFrame). Abre Chepe IA en una pestaña completa.';
  } else if (permission === 'denied') {
    statusMessage = 'Notificaciones bloqueadas en el navegador. Puedes activarlas desde el candado/ajustes de sitio de tu navegador.';
  } else {
    statusMessage = 'Permisos de notificación pendientes de autorización por el usuario.';
  }

  return {
    supported: isSupported,
    permission,
    isSecureContext: isSecure,
    isIframe,
    hasServiceWorker: hasSW,
    serviceWorkerRegistered: !!swRegistration,
    statusMessage
  };
}

/**
 * Request real device OS notification permissions from the user
 */
export async function requestNativePermission(): Promise<{
  granted: boolean;
  permission: NotificationPermission | 'unsupported';
  error?: string;
  isIframeBlock?: boolean;
}> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      granted: false,
      permission: 'unsupported',
      error: 'La API de Notificaciones no está disponible en este dispositivo.'
    };
  }

  const isIframe = window.self !== window.top;

  try {
    // Attempt modern Promise-based request
    let result: NotificationPermission;
    try {
      result = await Notification.requestPermission();
    } catch (err: any) {
      // Fallback for older browsers with callback
      result = await new Promise((resolve) => {
        Notification.requestPermission((p) => resolve(p));
      });
    }

    // Initialize Service Worker upon permission grant
    if (result === 'granted') {
      await initializeServiceWorker();
    }

    // Dispatch global event for UI synchronization
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('chepe:permission-changed', {
          detail: { permission: result }
        })
      );
    }

    if (result === 'denied' && isIframe) {
      return {
        granted: false,
        permission: result,
        isIframeBlock: true,
        error: 'Chrome bloquea la solicitud de permisos dentro de marcos de vista previa (iFrame). Abre Chepe IA en una nueva pestaña completa para autorizarlas.'
      };
    }

    return {
      granted: result === 'granted',
      permission: result,
      error: result === 'denied' ? 'Los permisos fueron denegados en el navegador o bloqueados por la configuración del sitio.' : undefined
    };
  } catch (error: any) {
    console.error('[Chepe Notifications] Error al solicitar permisos:', error);
    return {
      granted: false,
      permission: 'denied',
      isIframeBlock: isIframe,
      error: isIframe
        ? 'Por seguridad, los navegadores no permiten solicitar permisos de notificación dentro de un iFrame. Abre la app en pestaña completa.'
        : error.message || 'No se pudo completar la solicitud de permisos del sistema operativo.'
    };
  }
}

/**
 * Register Service Worker to handle native background and click events
 */
export async function initializeServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    swRegistration = reg;

    // Listen for messages from SW when notification is clicked
    navigator.serviceWorker.onmessage = (event) => {
      if (event.data && event.data.type === 'CHEPE_NOTIFICATION_CLICK') {
        const targetTab = event.data.tab || 'chat';
        if (navigationCallback) {
          navigationCallback(targetTab);
        } else if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('chepe:navigate-tab', { detail: { tab: targetTab } })
          );
        }
      }
    };

    return reg;
  } catch (err) {
    console.warn('[Chepe Notifications] Service Worker registration note:', err);
    return null;
  }
}

/**
 * Send a real, native OS device notification
 */
export async function sendRealDeviceNotification(options: NativeNotificationOptions): Promise<{
  sent: boolean;
  method: 'service-worker' | 'native-api' | 'unsupported' | 'denied';
  error?: string;
}> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      sent: false,
      method: 'unsupported',
      error: 'La API de Notificaciones no es compatible con este navegador.'
    };
  }

  let currentPermission = Notification.permission;

  // If permission has not been requested yet, request it now
  if (currentPermission === 'default') {
    const req = await requestNativePermission();
    currentPermission = req.permission as NotificationPermission;
  }

  if (currentPermission !== 'granted') {
    return {
      sent: false,
      method: 'denied',
      error: 'El usuario o el sistema operativo ha denegado los permisos de notificación.'
    };
  }

  const targetTab = options.targetTab || 'chat';
  const iconUrl = options.icon || '/icon.svg';
  const badgeUrl = options.badge || '/icon.svg';
  const tag = options.tag || `chepe-${Date.now()}`;
  const vibratePattern = options.vibrate || [200, 100, 200];

  // Try method 1: ServiceWorker showNotification (Works in background & mobile OS)
  if (!swRegistration && 'serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.ready;
    } catch (e) {}
  }

  if (swRegistration && 'showNotification' in swRegistration) {
    try {
      const swOptions: NotificationOptions = {
        body: options.body,
        icon: iconUrl,
        badge: badgeUrl,
        tag: tag,
        requireInteraction: options.requireInteraction || false,
        data: {
          tab: targetTab,
          ...(options.data || {})
        }
      };
      // Add vibrate if supported in browser environment
      if (vibratePattern) {
        (swOptions as any).vibrate = vibratePattern;
      }
      await swRegistration.showNotification(options.title, swOptions);

      return { sent: true, method: 'service-worker' };
    } catch (swErr) {
      console.warn('[Chepe Notifications] Service Worker showNotification fallback to window.Notification:', swErr);
    }
  }

  // Method 2: Standard Window Notification constructor (Direct OS pop-up)
  try {
    const nativeOptions: NotificationOptions = {
      body: options.body,
      icon: iconUrl,
      badge: badgeUrl,
      tag: tag,
      requireInteraction: options.requireInteraction || false,
      data: {
        tab: targetTab,
        ...(options.data || {})
      }
    };
    const notification = new window.Notification(options.title, nativeOptions);

    // Real Click Handler: focuses window & navigates to screen
    notification.onclick = (event) => {
      event.preventDefault();
      try {
        window.focus();
      } catch (e) {}

      if (options.onNotificationClick) {
        options.onNotificationClick(targetTab);
      } else if (navigationCallback) {
        navigationCallback(targetTab);
      } else {
        window.dispatchEvent(
          new CustomEvent('chepe:navigate-tab', { detail: { tab: targetTab } })
        );
      }

      notification.close();
    };

    return { sent: true, method: 'native-api' };
  } catch (nativeErr: any) {
    console.error('[Chepe Notifications] Error al crear Notification nativa:', nativeErr);
    return {
      sent: false,
      method: 'native-api',
      error: nativeErr.message || 'El sistema operativo rechazó la creación de la notificación.'
    };
  }
}

/**
 * Schedule a test real notification with a delay (useful to minimize tab and verify real OS pop-up)
 */
export function scheduleDelayedRealNotification(
  options: NativeNotificationOptions,
  delaySeconds: number = 4
): Promise<{ scheduled: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const result = await sendRealDeviceNotification(options);
      resolve({
        scheduled: result.sent,
        message: result.sent
          ? `Notificación real del sistema emitida tras ${delaySeconds}s.`
          : `Fallo al enviar notificación: ${result.error || 'Permisos denegados'}`
      });
    }, delaySeconds * 1000);
  });
}
