import React, { useState, useEffect, useRef } from 'react';
import {
  AdminNotification,
  AdminNotificationCategory,
  AdminNotificationSeverity,
  UserProfile,
  AdminAlertThresholds
} from '../types';
import {
  Bell,
  AlertTriangle,
  Award,
  Flame,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  TrendingUp,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCheck,
  Trash2,
  Activity,
  Info,
  Clock,
  ArrowUpRight,
  Maximize2,
  Smartphone,
  Check,
  AlertCircle,
  HelpCircle,
  Timer,
  Send,
  Sliders
} from 'lucide-react';
import {
  checkNotificationSupport,
  requestNativePermission,
  sendRealDeviceNotification,
  scheduleDelayedRealNotification,
  setNotificationNavigationHandler,
  NotificationDiagnostics
} from '../services/nativeNotificationService';

export interface ToastNotification extends AdminNotification {
  duration?: number;
  progress?: number;
}

interface NotificationCenterProps {
  userProfile: UserProfile;
  activeTab: string;
  onNavigateTab: (tab: string, param?: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

const DEFAULT_ALERT_THRESHOLDS: AdminAlertThresholds = {
  unusualBurstRequestsPerMin: 45,
  unusualDailyTokensThreshold: 500000,
  failedAuthAttemptsAlert: 3,
  dailyActiveUsersMilestone: 3500,
  dailyConversationsMilestone: 150000,
  dailyTokensMilestone: 4000000,
  soundAlertsEnabled: true,
  autoFlagSuspiciousUsers: true
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userProfile,
  activeTab,
  onNavigateTab,
  onOpenAuthModal
}) => {
  // Global notifications list
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const stored = localStorage.getItem('chepe_admin_notifications');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'init-milestone-1',
        category: 'usage_milestone',
        severity: 'milestone',
        title: '🎯 Hito Diario: Alta Adopción de Usuarios',
        message: 'La plataforma ha superado los 3,840 usuarios activos diarios con más de 125,000 interacciones completadas.',
        timestamp: 'Hace 10 min',
        read: false,
        metricValue: '3,842 usuarios',
        threshold: '3,500 usuarios'
      },
      {
        id: 'init-anomaly-1',
        category: 'unusual_activity',
        severity: 'warning',
        title: '⚠️ Detección de Ráfaga de Consultas',
        message: 'Se identificó un incremento rápido en peticiones de código. El balanceador de carga ha optimizado la inferencia.',
        timestamp: 'Hace 25 min',
        read: false,
        metricValue: '48 req/min',
        threshold: '45 req/min'
      }
    ];
  });

  // Active floating toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  // Drawer / overlay visibility
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('chepe_notif_sound');
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {}
    return true;
  });

  // Native OS Notification States & Diagnostics
  const [nativeDiagnostics, setNativeDiagnostics] = useState<NotificationDiagnostics>(() =>
    checkNotificationSupport()
  );
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  const [testTargetTab, setTestTargetTab] = useState<string>('chat');
  const [nativeFeedback, setNativeFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<'all' | AdminNotificationCategory>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Tracking usage milestones & anomalies
  const prevUsageCountRef = useRef<number>(userProfile.dailyUsageCount || 0);
  const requestTimestampsRef = useRef<number[]>([]);
  const hasTriggered50Ref = useRef<boolean>(false);
  const hasTriggered80Ref = useRef<boolean>(false);
  const hasTriggered100Ref = useRef<boolean>(false);

  // Refresh native notification diagnostics
  const refreshDiagnostics = () => {
    const diag = checkNotificationSupport();
    setNativeDiagnostics(diag);
  };

  useEffect(() => {
    refreshDiagnostics();
    // Register global navigation callback
    setNotificationNavigationHandler((tab) => {
      onNavigateTab(tab);
    });

    const handlePermChange = () => {
      refreshDiagnostics();
    };

    const handleNavigate = (e: any) => {
      if (e.detail && e.detail.tab) {
        onNavigateTab(e.detail.tab);
      }
    };

    window.addEventListener('chepe:permission-changed', handlePermChange);
    window.addEventListener('chepe:navigate-tab', handleNavigate);

    return () => {
      window.removeEventListener('chepe:permission-changed', handlePermChange);
      window.removeEventListener('chepe:navigate-tab', handleNavigate);
    };
  }, [onNavigateTab]);

  // Sync notifications to localStorage & listen to custom storage events
  const saveNotifications = (newList: AdminNotification[]) => {
    setNotifications(newList);
    try {
      localStorage.setItem('chepe_admin_notifications', JSON.stringify(newList));
    } catch (e) {}
  };

  // Sound Synthesizer via Web Audio API
  const playAlertTone = (severity: AdminNotificationSeverity) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (severity === 'critical') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (severity === 'milestone') {
        // Cheerful triad chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.38);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch (e) {}
  };

  // Dispatch a toast, real OS device notification, and add to history
  const triggerNotification = async (
    notif: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>,
    targetTab: string = 'chat'
  ) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const fullNotif: AdminNotification = {
      ...notif,
      id,
      timestamp: `Hoy a las ${nowTime}`,
      read: false
    };

    // Add to toast floating queue (max 4 concurrent)
    setToasts(prev => [fullNotif, ...prev.slice(0, 3)]);
    
    // Add to persisted list
    saveNotifications([fullNotif, ...notifications]);

    // Audio cue
    playAlertTone(notif.severity);

    // Trigger Real OS Native Notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        await sendRealDeviceNotification({
          title: notif.title,
          body: notif.message,
          targetTab: notif.actionType === 'upgrade_plan' ? 'profile' : targetTab,
          icon: '/icon.svg',
          badge: '/icon.svg',
          requireInteraction: notif.severity === 'critical',
          onNotificationClick: (tab) => {
            onNavigateTab(tab);
          }
        });
      } catch (e) {
        console.warn('[Chepe IA] Error al emitir notificación al SO:', e);
      }
    }
  };

  // Real OS Permission Request Handler
  const handleRequestNativePermission = async () => {
    setIsRequestingPermission(true);
    setNativeFeedback(null);
    try {
      const res = await requestNativePermission();
      refreshDiagnostics();
      if (res.granted) {
        setNativeFeedback({
          type: 'success',
          message: '¡Permisos concedidos! Chepe IA enviará notificaciones reales directamente a tu sistema operativo.'
        });
        // Send welcoming real notification
        await sendRealDeviceNotification({
          title: '🎉 Notificaciones de Chepe IA Activadas',
          body: 'Has conectado las notificaciones reales del sistema operativo con éxito.',
          targetTab: 'chat',
          onNotificationClick: (tab) => onNavigateTab(tab)
        });
      } else {
        setNativeFeedback({
          type: 'error',
          message: res.error || 'Los permisos fueron denegados en el navegador o bloqueados por la configuración del sistema operativo.'
        });
      }
    } catch (err: any) {
      setNativeFeedback({
        type: 'error',
        message: err.message || 'Error al conectar con la API de Notificaciones del sistema.'
      });
    } finally {
      setIsRequestingPermission(false);
    }
  };

  // Immediate Real OS Test
  const handleSendImmediateNativeTest = async () => {
    setNativeFeedback(null);
    const diag = checkNotificationSupport();
    if (diag.permission !== 'granted') {
      const req = await requestNativePermission();
      refreshDiagnostics();
      if (!req.granted) {
        setNativeFeedback({
          type: 'error',
          message: 'Debes conceder permisos de notificación en el navegador para recibir alertas en el sistema operativo.'
        });
        return;
      }
    }

    const title = '⚡ Chepe IA: Notificación Real del Dispositivo';
    const body = `Evento confirmado en ${testTargetTab.toUpperCase()}. Toca esta notificación para abrir la pestaña directamente.`;

    const res = await sendRealDeviceNotification({
      title,
      body,
      targetTab: testTargetTab,
      onNotificationClick: (tab) => onNavigateTab(tab)
    });

    if (res.sent) {
      setNativeFeedback({
        type: 'success',
        message: `Notificación nativa emitida al sistema operativo mediante [${res.method}]. ¡Tócala para navegar!`
      });
    } else {
      setNativeFeedback({
        type: 'error',
        message: res.error || 'No se pudo entregar la notificación al sistema operativo.'
      });
    }
  };

  // Delayed Test (5 seconds countdown to test while tab is unfocused/minimized)
  const handleSendDelayedNativeTest = () => {
    setNativeFeedback(null);
    const diag = checkNotificationSupport();
    if (diag.permission !== 'granted') {
      handleRequestNativePermission();
      return;
    }

    let remaining = 5;
    setTestCountdown(remaining);

    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setTestCountdown(remaining);
      } else {
        clearInterval(interval);
        setTestCountdown(null);
        sendRealDeviceNotification({
          title: '🔔 Chepe IA: Prueba en Segundo Plano Exitosa',
          body: `Esta notificación se disparó en segundo plano. Toca aquí para abrir la vista ${testTargetTab}.`,
          targetTab: testTargetTab,
          requireInteraction: true,
          onNotificationClick: (tab) => onNavigateTab(tab)
        }).then((res) => {
          if (res.sent) {
            setNativeFeedback({
              type: 'success',
              message: '¡Notificación en segundo plano entregada con éxito a tu sistema operativo!'
            });
          }
        });
      }
    }, 1000);
  };

  // Listen to window custom events for global dispatching
  useEffect(() => {
    const handleCustomAlert = (event: CustomEvent<any>) => {
      if (event.detail) {
        triggerNotification(event.detail);
      }
    };
    window.addEventListener('chepe:notification' as any, handleCustomAlert);
    return () => {
      window.removeEventListener('chepe:notification' as any, handleCustomAlert);
    };
  }, [notifications, soundEnabled]);

  // Monitor User Usage Milestones & Bursts
  useEffect(() => {
    const currentUsage = userProfile.dailyUsageCount || 0;
    const limit = userProfile.dailyLimit || 20;
    const now = Date.now();

    // Check if usage incremented
    if (currentUsage > prevUsageCountRef.current && currentUsage > 0) {
      // Record timestamp for burst rate monitoring
      requestTimestampsRef.current.push(now);
      // Clean timestamps older than 60 seconds
      requestTimestampsRef.current = requestTimestampsRef.current.filter(t => now - t <= 60000);

      // Check for burst anomaly (> 5 requests in 10 seconds or > 15 requests in 60 seconds)
      const rapidRequests10s = requestTimestampsRef.current.filter(t => now - t <= 10000).length;
      if (rapidRequests10s >= 4) {
        triggerNotification({
          category: 'unusual_activity',
          severity: 'warning',
          title: '⚡ Detección de Ráfaga: Actividad Intensa',
          message: `Has enviado ${rapidRequests10s} peticiones en menos de 10 segundos. La inferencia multimodal se mantiene activa y protegida contra saturación.`,
          userEmail: userProfile.email,
          userName: userProfile.name,
          metricValue: `${rapidRequests10s} req/10s`,
          threshold: '3 req/10s',
          actionType: 'view_telemetry'
        });
      }

      // Check for Daily Usage Milestones
      const ratio = currentUsage / limit;

      if (ratio >= 1.0 && !hasTriggered100Ref.current) {
        hasTriggered100Ref.current = true;
        triggerNotification({
          category: 'usage_milestone',
          severity: 'critical',
          title: '🚨 Límite Diario de Consultas Alcanzado (100%)',
          message: `Has completado ${currentUsage} de ${limit} consultas permitidas para tu plan ${userProfile.planType}. ¡Actualiza tu suscripción o canjea una licencia para continuar sin pausas!`,
          userEmail: userProfile.email,
          userName: userProfile.name,
          metricValue: `${currentUsage}/${limit}`,
          threshold: `${limit} máx`,
          actionType: 'upgrade_plan'
        });
      } else if (ratio >= 0.8 && ratio < 1.0 && !hasTriggered80Ref.current) {
        hasTriggered80Ref.current = true;
        triggerNotification({
          category: 'usage_milestone',
          severity: 'warning',
          title: '⚠️ 80% de Cuota Diaria Consumida',
          message: `Has alcanzado ${currentUsage} de ${limit} peticiones hoy. Te quedan ${limit - currentUsage} consultas disponibles en tu plan ${userProfile.planType}.`,
          userEmail: userProfile.email,
          userName: userProfile.name,
          metricValue: `${currentUsage}/${limit}`,
          threshold: '80% de cuota',
          actionType: 'upgrade_plan'
        });
      } else if (ratio >= 0.5 && ratio < 0.8 && !hasTriggered50Ref.current && limit > 5) {
        hasTriggered50Ref.current = true;
        triggerNotification({
          category: 'usage_milestone',
          severity: 'milestone',
          title: '🎯 Hito Alcanzado: 50% de Uso Diario Completado',
          message: `¡Buen progreso! Has alcanzado ${currentUsage} consultas productivas el día de hoy en Chepe IA.`,
          userEmail: userProfile.email,
          userName: userProfile.name,
          metricValue: `${currentUsage} consultas`,
          threshold: '50% de cuota',
          actionType: 'acknowledge'
        });
      }

      // Specific Milestones on Prompt counts (e.g. 5, 10, 25, 50, 100)
      if ([5, 10, 25, 50, 100].includes(currentUsage)) {
        triggerNotification({
          category: 'usage_milestone',
          severity: 'milestone',
          title: `🏆 ¡Hito de Productividad! ${currentUsage} Consultas Realizadas`,
          message: `Felicidades ${userProfile.name?.split(' ')[0] || ''}, has completado ${currentUsage} interacciones con los modelos neuronales de Chepe IA.`,
          userEmail: userProfile.email,
          userName: userProfile.name,
          metricValue: `${currentUsage} prompts`,
          threshold: `Meta: ${currentUsage}`,
          actionType: 'acknowledge'
        });
      }
    }

    prevUsageCountRef.current = currentUsage;
  }, [userProfile.dailyUsageCount, userProfile.dailyLimit, userProfile.planType]);

  // Auto-dismiss floating toasts after 6.5 seconds
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      setToasts(prev => prev.slice(0, prev.length - 1));
    }, 6500);

    return () => clearTimeout(timer);
  }, [toasts]);

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const handleToggleRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    saveNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleDeleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const handleClearRead = () => {
    const updated = notifications.filter(n => !n.read);
    saveNotifications(updated);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('chepe_notif_sound', JSON.stringify(next));
    } catch (e) {}
    if (next) playAlertTone('info');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = notifications.filter(n => {
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
    if (unreadOnly && n.read) return false;
    return true;
  });

  const getSeverityBadge = (severity: AdminNotificationSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-600 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Crítico
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-600">
            <Flame className="w-3 h-3 text-amber-400" />
            Anomalía
          </span>
        );
      case 'milestone':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-sm shadow-emerald-900/30">
            <Award className="w-3 h-3 text-emerald-400" />
            Hito
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-700">
            <Info className="w-3 h-3 text-cyan-400" />
            Aviso
          </span>
        );
    }
  };

  const getCategoryIcon = (category: AdminNotificationCategory, severity: AdminNotificationSeverity) => {
    if (severity === 'critical') return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    if (category === 'usage_milestone') return <Award className="w-5 h-5 text-emerald-400" />;
    if (category === 'unusual_activity') return <Flame className="w-5 h-5 text-amber-400" />;
    if (category === 'security') return <ShieldAlert className="w-5 h-5 text-rose-400" />;
    return <Zap className="w-5 h-5 text-[#00E5FF]" />;
  };

  return (
    <>
      {/* 1. FLOATING TOAST STACK (Top-Right Screen Overlay) */}
      <div className="fixed top-16 sm:top-20 right-3 sm:right-6 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none font-sans">
        {toasts.map((toast) => {
          const isCritical = toast.severity === 'critical';
          const isMilestone = toast.severity === 'milestone';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all transform animate-in slide-in-from-top-4 fade-in duration-300 relative overflow-hidden ${
                isCritical
                  ? 'bg-[#18080E]/95 border-rose-500 text-rose-100 shadow-rose-950/50 ring-1 ring-rose-500/40'
                  : isMilestone
                  ? 'bg-[#061810]/95 border-emerald-400 text-emerald-100 shadow-emerald-950/50 ring-1 ring-emerald-400/40'
                  : 'bg-[#071020]/95 border-amber-400 text-amber-100 shadow-amber-950/40 ring-1 ring-amber-400/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`p-2 rounded-xl border shrink-0 ${
                      isCritical
                        ? 'bg-rose-900/60 border-rose-700 animate-bounce'
                        : isMilestone
                        ? 'bg-emerald-900/60 border-emerald-700'
                        : 'bg-amber-900/60 border-amber-700'
                    }`}
                  >
                    {getCategoryIcon(toast.category, toast.severity)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black tracking-tight text-white truncate">
                        {toast.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-stone-500" />
                      {toast.timestamp}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDismissToast(toast.id)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  title="Cerrar notificación"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message text */}
              <p className="text-xs sm:text-[13px] text-stone-200 mt-2 leading-relaxed">
                {toast.message}
              </p>

              {/* Metric stats if available */}
              {(toast.metricValue || toast.threshold) && (
                <div className="mt-2.5 flex items-center gap-3 p-1.5 px-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono">
                  {toast.metricValue && (
                    <span className="text-stone-300">
                      <strong>Valor:</strong>{' '}
                      <span className="text-cyan-300 font-bold">{toast.metricValue}</span>
                    </span>
                  )}
                  {toast.threshold && (
                    <span className="text-stone-400">
                      <strong>Umbral:</strong>{' '}
                      <span className="text-amber-300">{toast.threshold}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons inside Toast */}
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    handleDismissToast(toast.id);
                    setIsOverlayOpen(true);
                  }}
                  className="text-[11px] text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Ver todas las alertas</span>
                  <ChevronRight className="w-3 h-3" />
                </button>

                {toast.actionType === 'upgrade_plan' ? (
                  <button
                    onClick={() => {
                      handleDismissToast(toast.id);
                      onNavigateTab('profile');
                    }}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 text-xs font-black flex items-center gap-1 shadow-md cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span>Mejorar Plan</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleDismissToast(toast.id);
                      onNavigateTab('admin');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Progress bar animation */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                  className={`h-full animate-[pulse_2s_infinite] ${
                    isCritical ? 'bg-rose-500' : isMilestone ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. FLOATING FLOATING HUB BUTTON (Bottom-Right Corner) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 font-sans">
        <button
          onClick={() => setIsOverlayOpen(!isOverlayOpen)}
          className={`group p-3 sm:px-4 sm:py-3 rounded-2xl border shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer transform active:scale-95 ${
            unreadCount > 0
              ? 'bg-gradient-to-r from-[#18080E] to-[#0A1224] border-rose-500/90 text-white shadow-rose-950/50 hover:border-rose-400 ring-2 ring-rose-500/30'
              : 'bg-[#081021]/95 border-cyan-700/80 text-cyan-200 hover:text-white hover:border-[#00E5FF] shadow-black/80'
          }`}
          title="Centro de Alertas & Notificaciones de Chepe IA"
        >
          <div className="relative">
            <Bell
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                unreadCount > 0 ? 'text-rose-400 animate-bounce' : 'text-amber-400'
              }`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-lg border border-black animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-tight text-white">
              {unreadCount > 0 ? `${unreadCount} Alertas Nuevas` : 'Notificaciones'}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">
              Hitos & Anomalías
            </span>
          </div>
        </button>
      </div>

      {/* 3. MODAL / OVERLAY DRAWER: FULL NOTIFICATION CENTER */}
      {isOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
          <div
            className="w-full max-w-3xl max-h-[90vh] rounded-3xl bg-[#081021] border border-cyan-500/50 shadow-2xl flex flex-col overflow-hidden text-stone-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Overlay Header */}
            <div className="p-5 bg-gradient-to-r from-[#120A1E] via-[#09152B] to-[#050A14] border-b border-cyan-900 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      Centro Global de Alertas & Hitos de Uso
                    </h3>
                    {unreadCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-700">
                        {unreadCount} sin leer
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Al día
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Monitoreo en tiempo real de anomalías de red, cuotas diarias y logros de adopción
                  </p>
                </div>
              </div>

              {/* Close & Sound controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSound}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                      : 'bg-stone-900 text-stone-500 border-stone-800'
                  }`}
                  title={soundEnabled ? 'Sonidos activados' : 'Sonidos silenciados'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOverlayOpen(false)}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800 transition-all cursor-pointer"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* REAL DEVICE OS NOTIFICATIONS PANEL */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-[#091730] via-[#050D1C] to-[#040812] border-b border-cyan-900/90">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-[#00E5FF]">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-black text-white">
                        Notificaciones Reales del Dispositivo
                      </h4>
                      {nativeDiagnostics.permission === 'granted' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          Activo en tu SO
                        </span>
                      ) : nativeDiagnostics.permission === 'denied' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-400" />
                          Bloqueado en Navegador
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-500 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-amber-400" />
                          Requiere Permiso
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Recibe alertas nativas en tu barra de tareas, pantalla bloqueada y centro de notificaciones de Windows, macOS, Android o iOS.
                    </p>
                  </div>
                </div>

                {/* Target tab selector when clicking OS notification */}
                <div className="flex items-center gap-2 bg-[#081021] p-1.5 px-3 rounded-xl border border-cyan-950 text-xs shrink-0">
                  <span className="text-stone-400 text-[11px] font-medium flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#00E5FF]" />
                    Al tocar abre:
                  </span>
                  <select
                    value={testTargetTab}
                    onChange={(e) => setTestTargetTab(e.target.value)}
                    className="bg-transparent text-[#00E5FF] font-bold outline-none cursor-pointer text-xs"
                  >
                    <option value="chat" className="bg-[#081021] text-white">
                      💬 Chat Principal
                    </option>
                    <option value="video-studio" className="bg-[#081021] text-white">
                      🎬 Video Studio
                    </option>
                    <option value="web-tools" className="bg-[#081021] text-white">
                      🛠️ Herramientas Web
                    </option>
                    <option value="admin" className="bg-[#081021] text-white">
                      📊 Dashboard Admin
                    </option>
                    <option value="profile" className="bg-[#081021] text-white">
                      👤 Mi Perfil / Planes
                    </option>
                  </select>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                {nativeDiagnostics.permission !== 'granted' && (
                  <button
                    onClick={handleRequestNativePermission}
                    disabled={isRequestingPermission}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-cyan-950/60 cursor-pointer active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isRequestingPermission ? 'Solicitando...' : 'Solicitar Permiso al Sistema'}</span>
                  </button>
                )}

                {/* Open in Dedicated Tab Button (Crucial for mobile and iFrame preview) */}
                <button
                  onClick={() => {
                    const standaloneUrl = window.location.href;
                    window.open(standaloneUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-[#00E5FF] hover:text-white border border-cyan-700/80 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  title="Abre Chepe IA en una pestaña completa fuera de la vista previa para habilitar permisos nativos"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Abrir en Nueva Pestaña</span>
                </button>

                <button
                  onClick={refreshDiagnostics}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  title="Vuelve a comprobar el estado de permisos del navegador"
                >
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Re-verificar</span>
                </button>

                <button
                  onClick={handleSendImmediateNativeTest}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 hover:text-white border border-cyan-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Probar Notificación Real</span>
                </button>

                <button
                  onClick={handleSendDelayedNativeTest}
                  disabled={testCountdown !== null}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 text-amber-200 hover:text-amber-100 border border-amber-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  title="Permite minimizar la ventana y recibir la alerta en segundo plano"
                >
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {testCountdown !== null
                      ? `Minimiza ahora: enviando en ${testCountdown}s...`
                      : 'Probar en 5s (Minimiza pestaña)'}
                  </span>
                </button>
              </div>

              {/* UNBLOCK INSTRUCTIONS ACCORDION / BANNER WHEN DENIED */}
              {nativeDiagnostics.permission === 'denied' && (
                <div className="mt-3 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-rose-100">
                        Cómo activar las notificaciones bloqueadas en tu navegador:
                      </p>
                      <p className="text-[11px] text-rose-300/90 leading-relaxed">
                        Por seguridad, los navegadores (como Chrome Android) no permiten pedir permisos dentro de la vista previa integrada o cuando fueron denegados previamente. Sigue estos sencillos pasos:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-rose-900/60 flex flex-col justify-between">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px]">1</span>
                        Abrir pestaña completa
                      </div>
                      <p className="text-stone-300 text-[10px] mt-1">
                        Toca el botón azul <strong className="text-white">"Abrir en Nueva Pestaña"</strong> arriba.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-rose-900/60 flex flex-col justify-between">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px]">2</span>
                        Ajustes del Sitio
                      </div>
                      <p className="text-stone-300 text-[10px] mt-1">
                        Toca el icono de <strong>candado o ajustes (tune)</strong> a la izquierda del enlace en Chrome.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-rose-900/60 flex flex-col justify-between">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px]">3</span>
                        Cambiar a "Permitir"
                      </div>
                      <p className="text-stone-300 text-[10px] mt-1">
                        Entra a <strong>Permisos &gt; Notificaciones</strong> y selecciona <strong className="text-emerald-300">Permitir</strong>. Luego pulsa "Re-verificar".
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Alert if present */}
              {nativeFeedback && (
                <div
                  className={`mt-3 p-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-between gap-2 border animate-in fade-in duration-200 ${
                    nativeFeedback.type === 'success'
                      ? 'bg-emerald-950/80 text-emerald-200 border-emerald-700'
                      : nativeFeedback.type === 'error'
                      ? 'bg-rose-950/80 text-rose-200 border-rose-700'
                      : 'bg-cyan-950/80 text-cyan-200 border-cyan-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {nativeFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    {nativeFeedback.message}
                  </span>
                  <button
                    onClick={() => setNativeFeedback(null)}
                    className="text-stone-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Testing Bar inside Overlay */}
            <div className="p-3 bg-[#050A14] border-b border-cyan-950/80 flex flex-wrap items-center justify-between gap-2 px-5">
              <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                Simuladores de eventos de plataforma:
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() =>
                    triggerNotification({
                      category: 'usage_milestone',
                      severity: 'milestone',
                      title: '🎯 Hito Alcanzado: +5,000 Consultas Diarias',
                      message: 'La comunidad de Chepe IA ha procesado más de 5,000 prompts el día de hoy.',
                      metricValue: '5,024 consultas',
                      threshold: '5,000 meta',
                      actionType: 'acknowledge'
                    }, 'admin')
                  }
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-bold cursor-pointer transition-all active:scale-95"
                >
                  + Disparar Hito
                </button>

                <button
                  onClick={() =>
                    triggerNotification({
                      category: 'unusual_activity',
                      severity: 'warning',
                      title: '🚨 Alerta de Ráfaga Inusual (42 req/min)',
                      message: 'Pico anómalo de consultas concurrentes registrado en el motor de código.',
                      metricValue: '42 req/min',
                      threshold: '30 req/min',
                      actionType: 'view_telemetry'
                    }, 'admin')
                  }
                  className="px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800 text-[11px] font-bold cursor-pointer transition-all active:scale-95"
                >
                  + Disparar Anomalía
                </button>
              </div>
            </div>

            {/* Filter Pills & Toolbar */}
            <div className="p-3 px-5 bg-[#070E1E] border-b border-cyan-950 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-amber-500 text-stone-950 font-black'
                      : 'bg-[#050A14] text-stone-400 hover:text-white border border-cyan-950'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('usage_milestone')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    categoryFilter === 'usage_milestone'
                      ? 'bg-emerald-500 text-stone-950 font-black'
                      : 'bg-[#050A14] text-stone-400 hover:text-white border border-cyan-950'
                  }`}
                >
                  Hitos de Uso
                </button>
                <button
                  onClick={() => setCategoryFilter('unusual_activity')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    categoryFilter === 'unusual_activity'
                      ? 'bg-amber-500 text-stone-950 font-black'
                      : 'bg-[#050A14] text-stone-400 hover:text-white border border-cyan-950'
                  }`}
                >
                  Actividad Inusual
                </button>
                <button
                  onClick={() => setCategoryFilter('security')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    categoryFilter === 'security'
                      ? 'bg-rose-500 text-white font-black'
                      : 'bg-[#050A14] text-stone-400 hover:text-white border border-cyan-950'
                  }`}
                >
                  Seguridad
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setUnreadOnly(!unreadOnly)}
                  className={`px-2.5 py-1 rounded-xl font-bold border transition-all cursor-pointer ${
                    unreadOnly
                      ? 'bg-cyan-950 text-[#00E5FF] border-[#00E5FF]'
                      : 'bg-[#050A14] text-stone-400 border-cyan-950 hover:text-white'
                  }`}
                >
                  Solo no leídas
                </button>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-2.5 py-1 rounded-xl bg-[#09152C] hover:bg-[#0E2042] text-cyan-300 border border-cyan-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Marcar todas leídas</span>
                  </button>
                )}

                {notifications.some(n => n.read) && (
                  <button
                    onClick={handleClearRead}
                    className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-red-300 border border-stone-800 cursor-pointer"
                    title="Limpiar leídas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Notifications Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 max-h-[55vh]">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center space-y-3 rounded-2xl bg-[#050A14] border border-cyan-950">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400/80 mx-auto" />
                  <h4 className="text-sm sm:text-base font-extrabold text-white">
                    No hay notificaciones en esta categoría
                  </h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    El sistema está operando con total normalidad y sin alertas pendientes de atención.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isUnread = !notif.read;

                  return (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                        isUnread
                          ? notif.severity === 'critical'
                            ? 'bg-[#18080E] border-rose-500/80 shadow-md shadow-rose-950/40'
                            : notif.severity === 'milestone'
                            ? 'bg-[#071F15] border-emerald-500/70 shadow-md shadow-emerald-950/30'
                            : 'bg-[#1A1405] border-amber-500/60 shadow-md'
                          : 'bg-[#050A14]/90 border-cyan-950 hover:border-cyan-900 opacity-85'
                      }`}
                    >
                      {/* Top item row */}
                      <div className="flex items-start sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-xl bg-[#081021] border border-cyan-900/60 shrink-0">
                            {getCategoryIcon(notif.category, notif.severity)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                                {notif.title}
                              </span>
                              {getSeverityBadge(notif.severity)}
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono mt-0.5">
                              <Clock className="w-3 h-3 text-stone-500" />
                              <span>{notif.timestamp}</span>
                              {notif.userName && (
                                <>
                                  <span>•</span>
                                  <span className="text-cyan-300 font-sans font-bold">
                                    {notif.userName}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Item actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleToggleRead(notif.id)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              notif.read
                                ? 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                                : 'bg-cyan-950 text-[#00E5FF] border-cyan-700 hover:bg-cyan-900'
                            }`}
                            title={notif.read ? 'Marcar como no leída' : 'Marcar como leída'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="p-1.5 rounded-lg bg-stone-900 hover:bg-rose-950/70 text-stone-400 hover:text-rose-300 border border-stone-800 transition-all cursor-pointer"
                            title="Eliminar notificación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content Message */}
                      <p className="text-xs sm:text-[13px] text-stone-200 leading-relaxed pl-1 sm:pl-10">
                        {notif.message}
                      </p>

                      {/* Metric Tags */}
                      {(notif.metricValue || notif.threshold) && (
                        <div className="ml-1 sm:ml-10 flex flex-wrap items-center gap-3 p-1.5 px-2.5 rounded-xl bg-[#081021] border border-cyan-950 text-[11px] font-mono">
                          {notif.metricValue && (
                            <span className="text-stone-300">
                              <strong className="text-white">Valor:</strong>{' '}
                              <span className="text-cyan-300 font-bold">{notif.metricValue}</span>
                            </span>
                          )}
                          {notif.threshold && (
                            <span className="text-stone-400">
                              <strong>Umbral objetivo:</strong>{' '}
                              <span className="text-amber-300">{notif.threshold}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quick Navigation Footer for item */}
                      <div className="ml-1 sm:ml-10 flex flex-wrap items-center gap-2 pt-1 border-t border-cyan-950/70">
                        <button
                          onClick={() => {
                            setIsOverlayOpen(false);
                            onNavigateTab('admin');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-[#08152B] hover:bg-[#0E2244] text-[#00E5FF] border border-cyan-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Activity className="w-3 h-3" />
                          <span>Ver en Dashboard Admin</span>
                        </button>

                        {notif.actionType === 'upgrade_plan' && (
                          <button
                            onClick={() => {
                              setIsOverlayOpen(false);
                              onNavigateTab('profile');
                            }}
                            className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                          >
                            <span>Ver Planes & Cuotas</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Overlay Footer */}
            <div className="p-4 px-5 bg-[#050A14] border-t border-cyan-950 flex items-center justify-between gap-3 text-xs">
              <span className="text-stone-400 font-mono text-[11px]">
                {notifications.length} notificaciones registradas • {unreadCount} pendientes
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsOverlayOpen(false);
                    onNavigateTab('admin');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-stone-950 font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Abrir Dashboard Administrativo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
