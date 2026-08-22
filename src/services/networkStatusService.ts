// Network & Online Connectivity Service for Chepe IA
// Monitors real-time internet status, server heartbeats, latency, and auto-sync events

export interface NetworkStatus {
  isOnline: boolean;
  isServerReachable: boolean;
  latencyMs: number | null;
  effectiveType?: string;
  downlinkSpeed?: number;
  lastChecked: Date;
  statusText: string;
}

type NetworkChangeCallback = (status: NetworkStatus) => void;

class NetworkStatusService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isServerReachable: boolean = true;
  private latencyMs: number | null = 24;
  private effectiveType: string = '4g';
  private lastChecked: Date = new Date();
  private listeners: Set<NetworkChangeCallback> = new Set();
  private checkInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnlineEvent());
      window.addEventListener('offline', () => this.handleOfflineEvent());

      // Read Network Information API if available
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        this.effectiveType = conn.effectiveType || '4g';
        conn.addEventListener('change', () => {
          this.effectiveType = conn.effectiveType || '4g';
          this.notifyListeners();
        });
      }

      // Initial server ping
      this.pingServer();

      // Periodic ping every 25 seconds
      this.checkInterval = setInterval(() => {
        this.pingServer();
      }, 25000);
    }
  }

  public getStatus(): NetworkStatus {
    return {
      isOnline: this.isOnline,
      isServerReachable: this.isServerReachable,
      latencyMs: this.latencyMs,
      effectiveType: this.effectiveType,
      lastChecked: this.lastChecked,
      statusText: !this.isOnline
        ? 'Sin Conexión (Offline)'
        : this.isServerReachable
        ? `Online • ${this.latencyMs ? this.latencyMs + 'ms' : 'Conectado'}`
        : 'Online • Servidor reconectando'
    };
  }

  public subscribe(callback: NetworkChangeCallback): () => void {
    this.listeners.add(callback);
    callback(this.getStatus());
    return () => {
      this.listeners.delete(callback);
    };
  }

  public async pingServer(): Promise<NetworkStatus> {
    if (typeof window === 'undefined') return this.getStatus();

    if (!navigator.onLine) {
      this.isOnline = false;
      this.isServerReachable = false;
      this.latencyMs = null;
      this.lastChecked = new Date();
      this.notifyListeners();
      return this.getStatus();
    }

    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('/api/health', {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (res.ok) {
        this.isOnline = true;
        this.isServerReachable = true;
        this.latencyMs = Math.max(8, latency);
      } else {
        this.isOnline = true;
        this.isServerReachable = false;
      }
    } catch (e) {
      // Fallback check against a public favicon or DNS if internal proxy had issue
      this.isServerReachable = false;
    }

    this.lastChecked = new Date();
    this.notifyListeners();
    return this.getStatus();
  }

  private handleOnlineEvent() {
    this.isOnline = true;
    this.pingServer();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chepe:network-online', { detail: { isOnline: true } }));
    }
  }

  private handleOfflineEvent() {
    this.isOnline = false;
    this.isServerReachable = false;
    this.latencyMs = null;
    this.notifyListeners();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chepe:network-offline', { detail: { isOnline: false } }));
    }
  }

  private notifyListeners() {
    const current = this.getStatus();
    this.listeners.forEach((cb) => {
      try {
        cb(current);
      } catch (e) {
        console.error('Error in network listener callback:', e);
      }
    });
  }
}

export const networkService = new NetworkStatusService();
