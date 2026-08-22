import React, { useState } from 'react';
import {
  AdminNotification,
  AdminAlertThresholds,
  AdminUserItem,
  AdminNotificationCategory,
  AdminNotificationSeverity
} from '../types';
import {
  Bell,
  AlertTriangle,
  Flame,
  Award,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  CheckCheck,
  Trash2,
  Filter,
  Sliders,
  Sparkles,
  Zap,
  UserX,
  Users,
  Search,
  ExternalLink,
  Volume2,
  VolumeX,
  PlusCircle,
  Clock,
  TrendingUp,
  Activity,
  ChevronRight,
  Info,
  Radio,
  Eye,
  Smartphone,
  Send
} from 'lucide-react';
import { sendRealDeviceNotification } from '../services/nativeNotificationService';

interface AdminNotificationCenterProps {
  notifications: AdminNotification[];
  thresholds: AdminAlertThresholds;
  users: AdminUserItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearReadNotifications: () => void;
  onUpdateThresholds: (updated: AdminAlertThresholds) => void;
  onTriggerSimulatedAlert: (category: AdminNotificationCategory, severity: AdminNotificationSeverity) => void;
  onNavigateToTab: (tab: 'all' | 'analytics' | 'licenses' | 'users' | 'security' | 'notifications', searchParam?: string) => void;
  onToggleUserStatus?: (userId: string) => void;
}

export const AdminNotificationCenter: React.FC<AdminNotificationCenterProps> = ({
  notifications,
  thresholds,
  users,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearReadNotifications,
  onUpdateThresholds,
  onTriggerSimulatedAlert,
  onNavigateToTab,
  onToggleUserStatus
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | AdminNotificationCategory>('all');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | AdminNotificationSeverity>('all');
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Editable threshold form state
  const [tempThresholds, setTempThresholds] = useState<AdminAlertThresholds>(thresholds);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;
  const unusualCount = notifications.filter(n => n.category === 'unusual_activity').length;
  const milestoneCount = notifications.filter(n => n.category === 'usage_milestone').length;
  const securityCount = notifications.filter(n => n.category === 'security').length;

  const filteredNotifications = notifications.filter(n => {
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    if (filterUnreadOnly && n.read) return false;
    if (selectedSeverity !== 'all' && n.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchMsg = n.message.toLowerCase().includes(q);
      const matchUser = n.userName?.toLowerCase().includes(q) || n.userEmail?.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchUser) return false;
    }
    return true;
  });

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateThresholds(tempThresholds);
    setSaveSuccessMsg('¡Configuración de umbrales y alertas guardada con éxito!');
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const getSeverityBadge = (severity: AdminNotificationSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-600 shadow-sm shadow-rose-900/30 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Crítico / Inusual
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950/90 text-amber-300 border border-amber-600">
            <Flame className="w-3 h-3 text-amber-400" />
            Anomalía / Advertencia
          </span>
        );
      case 'milestone':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500 shadow-sm shadow-emerald-900/30">
            <Award className="w-3 h-3 text-emerald-400" />
            Hito Alcanzado
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-700">
            <Info className="w-3 h-3 text-cyan-400" />
            Informativo
          </span>
        );
    }
  };

  const getCategoryIcon = (category: AdminNotificationCategory) => {
    switch (category) {
      case 'unusual_activity':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'usage_milestone':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'security':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'system':
      default:
        return <Zap className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#081021] border border-amber-500/40 space-y-6 shadow-2xl font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-cyan-950">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Bell className="w-6 h-6 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-md">
                  {unreadCount}
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Centro de Notificaciones & Alertas Inteligentes
            </h3>
            {unreadCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-950 border border-rose-700 text-rose-300">
                {unreadCount} sin leer
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-800 text-emerald-300">
                Todo al día
              </span>
            )}
          </div>
          <p className="text-xs text-stone-300">
            Detección automática de actividad inusual, picos de consultas, violaciones de cuota e hitos de uso diario alcanzados en el sistema.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
              isConfigOpen
                ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                : 'bg-[#050A14] text-stone-300 border-cyan-900 hover:text-white hover:border-[#00E5FF]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isConfigOpen ? 'Cerrar Umbrales' : 'Configurar Umbrales & Reglas'}</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3.5 py-2 rounded-xl bg-[#09152C] hover:bg-[#0E2042] text-cyan-300 border border-cyan-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Marcar todas leídas</span>
            </button>
          )}

          {notifications.some(n => n.read) && (
            <button
              onClick={onClearReadNotifications}
              className="px-3 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Eliminar notificaciones leídas"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar leídas</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards: Alert Counters by Category */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Alerts */}
        <div
          onClick={() => setSelectedCategory('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-b from-[#15233E] to-[#081021] border-[#00E5FF] shadow-lg'
              : 'bg-[#050A14] border-cyan-950 hover:border-cyan-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-stone-400">
            <span>Total Notificaciones</span>
            <Bell className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{notifications.length}</div>
          <div className="text-[10px] text-cyan-300 font-semibold mt-0.5">
            {unreadCount} pendientes de revisión
          </div>
        </div>

        {/* Unusual Activity Card */}
        <div
          onClick={() => setSelectedCategory('unusual_activity')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'unusual_activity'
              ? 'bg-gradient-to-b from-[#2A0E18] to-[#0A0307] border-rose-500 shadow-lg shadow-rose-950/30'
              : 'bg-[#050A14] border-cyan-950 hover:border-rose-900/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-300">
            <span>Actividad Inusual</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{unusualCount}</div>
          <div className="text-[10px] text-rose-300 font-semibold mt-0.5">
            Ráfagas anómalas & abusos
          </div>
        </div>

        {/* Milestones Card */}
        <div
          onClick={() => setSelectedCategory('usage_milestone')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'usage_milestone'
              ? 'bg-gradient-to-b from-[#092B1C] to-[#030F0A] border-emerald-400 shadow-lg shadow-emerald-950/30'
              : 'bg-[#050A14] border-cyan-950 hover:border-emerald-900/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
            <span>Hitos de Uso Diario</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{milestoneCount}</div>
          <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
            Récords diarios & volumen
          </div>
        </div>

        {/* Security & Access Card */}
        <div
          onClick={() => setSelectedCategory('security')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'security'
              ? 'bg-gradient-to-b from-[#281A05] to-[#0E0902] border-amber-400 shadow-lg shadow-amber-950/30'
              : 'bg-[#050A14] border-cyan-950 hover:border-amber-900/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-300">
            <span>Seguridad & Acceso</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{securityCount}</div>
          <div className="text-[10px] text-amber-300 font-semibold mt-0.5">
            Intentos fallidos & bloqueos
          </div>
        </div>
      </div>

      {/* Thresholds & Rule Configuration Panel (Collapsible) */}
      {isConfigOpen && (
        <form
          onSubmit={handleSaveThresholds}
          className="p-5 rounded-2xl bg-[#050A14] border border-amber-500/50 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                Parámetros y Reglas del Motor de Alertas Automáticas
              </h4>
            </div>
            <span className="text-[10px] text-amber-300 font-mono">
              Los cambios se guardan localmente
            </span>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Unusual burst per min */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#081021] border border-cyan-900">
              <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Ráfaga Inusual (prompts/min):</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={tempThresholds.unusualBurstRequestsPerMin}
                  onChange={(e) =>
                    setTempThresholds({
                      ...tempThresholds,
                      unusualBurstRequestsPerMin: Math.max(1, Number(e.target.value))
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#050A14] border border-cyan-800 text-white font-mono text-xs focus:outline-none focus:border-[#00E5FF]"
                />
                <span className="text-xs text-stone-400 whitespace-nowrap">req/min</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Dispara alerta si un usuario envía más peticiones por minuto de este umbral.
              </p>
            </div>

            {/* Daily Token Limit Spike */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#081021] border border-cyan-900">
              <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Consumo Anormal Diario (Tokens/usuario):</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step={50000}
                  min={50000}
                  max={5000000}
                  value={tempThresholds.unusualDailyTokensThreshold}
                  onChange={(e) =>
                    setTempThresholds({
                      ...tempThresholds,
                      unusualDailyTokensThreshold: Math.max(10000, Number(e.target.value))
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#050A14] border border-cyan-800 text-white font-mono text-xs focus:outline-none focus:border-[#00E5FF]"
                />
                <span className="text-xs text-stone-400 whitespace-nowrap">tokens</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Alerta cuando una cuenta consuma más tokens en un solo día.
              </p>
            </div>

            {/* Daily Active Users Milestone */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#081021] border border-cyan-900">
              <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hito de Usuarios Activos Hoy:</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step={500}
                  min={500}
                  max={50000}
                  value={tempThresholds.dailyActiveUsersMilestone}
                  onChange={(e) =>
                    setTempThresholds({
                      ...tempThresholds,
                      dailyActiveUsersMilestone: Math.max(100, Number(e.target.value))
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#050A14] border border-cyan-800 text-white font-mono text-xs focus:outline-none focus:border-[#00E5FF]"
                />
                <span className="text-xs text-stone-400 whitespace-nowrap">usuarios</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Notifica con celebración al alcanzar esta meta diaria de concurrentes.
              </p>
            </div>

            {/* Daily System Tokens Milestone */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#081021] border border-cyan-900">
              <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hito de Tokens Globales Hoy:</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step={500000}
                  min={1000000}
                  max={100000000}
                  value={tempThresholds.dailyTokensMilestone}
                  onChange={(e) =>
                    setTempThresholds({
                      ...tempThresholds,
                      dailyTokensMilestone: Math.max(100000, Number(e.target.value))
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#050A14] border border-cyan-800 text-white font-mono text-xs focus:outline-none focus:border-[#00E5FF]"
                />
                <span className="text-xs text-stone-400 whitespace-nowrap">tokens</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Celebra nuevos récords de computación y adopción en el servidor.
              </p>
            </div>

            {/* Failed Master Password Attempts */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#081021] border border-cyan-900">
              <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Intentos Fallidos de Clave Maestra:</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tempThresholds.failedAuthAttemptsAlert}
                  onChange={(e) =>
                    setTempThresholds({
                      ...tempThresholds,
                      failedAuthAttemptsAlert: Math.max(1, Number(e.target.value))
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#050A14] border border-cyan-800 text-white font-mono text-xs focus:outline-none focus:border-[#00E5FF]"
                />
                <span className="text-xs text-stone-400 whitespace-nowrap">intentos</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Alerta de seguridad inmediata tras superar estos intentos fallidos.
              </p>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5 p-3 rounded-xl bg-[#081021] border border-cyan-900 flex flex-col justify-center">
              <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempThresholds.soundAlertsEnabled}
                  onChange={(e) =>
                    setTempThresholds({ ...tempThresholds, soundAlertsEnabled: e.target.checked })
                  }
                  className="rounded border-cyan-700 text-[#00E5FF] focus:ring-0 cursor-pointer"
                />
                <span className="flex items-center gap-1.5 font-bold">
                  {tempThresholds.soundAlertsEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                  )}
                  Sonido sutil de alerta en vivo
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempThresholds.autoFlagSuspiciousUsers}
                  onChange={(e) =>
                    setTempThresholds({ ...tempThresholds, autoFlagSuspiciousUsers: e.target.checked })
                  }
                  className="rounded border-cyan-700 text-[#00E5FF] focus:ring-0 cursor-pointer"
                />
                <span className="font-bold">Marcar automáticamente cuentas anómalas</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsConfigOpen(false)}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guardar Reglas & Umbrales</span>
            </button>
          </div>
        </form>
      )}

      {/* Simulator Quick Testing Bar (Admin Live Test Toolkit) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#09152B] to-[#050A14] border border-cyan-900/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Simulador de Eventos en Tiempo Real (Probar Sistema de Alertas)
            </h4>
          </div>
          <span className="text-[10px] text-stone-400">
            Haz clic para emitir eventos de prueba inmediatos
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTriggerSimulatedAlert('unusual_activity', 'critical')}
            className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>+ Simular Ráfaga Inusual (48 req/min)</span>
          </button>

          <button
            onClick={() => onTriggerSimulatedAlert('usage_milestone', 'milestone')}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Simular Hito Diario (5,000 Usuarios)</span>
          </button>

          <button
            onClick={() => onTriggerSimulatedAlert('usage_milestone', 'milestone')}
            className="px-3 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 text-teal-200 border border-teal-700/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            <span>+ Simular Hito de Tokens (10M Tokens)</span>
          </button>

          <button
            onClick={() => onTriggerSimulatedAlert('security', 'warning')}
            className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Simular Intento de Clave Fallido</span>
          </button>

          <button
            onClick={() => {
              onTriggerSimulatedAlert('unusual_activity', 'critical');
              sendRealDeviceNotification({
                title: '🛡️ Chepe IA Admin: Alerta Crítica del Sistema',
                body: 'Se detectó actividad inusual en el cluster de inferencia. Toca para auditar en el panel.',
                targetTab: 'admin'
              });
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 text-cyan-200 border border-cyan-500 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Envía una notificación real a tu sistema operativo"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>+ Enviar Notificación Real al Dispositivo (SO)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar alertas por usuario o texto..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#050A14] border border-cyan-900 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setSelectedCategory('unusual_activity')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCategory === 'unusual_activity'
                  ? 'bg-rose-500 text-white font-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Inusual ({unusualCount})
            </button>
            <button
              onClick={() => setSelectedCategory('usage_milestone')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCategory === 'usage_milestone'
                  ? 'bg-emerald-500 text-stone-950 font-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Hitos ({milestoneCount})
            </button>
            <button
              onClick={() => setSelectedCategory('security')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCategory === 'security'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Seguridad ({securityCount})
            </button>
          </div>

          {/* Unread toggle */}
          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
              filterUnreadOnly
                ? 'bg-cyan-950 text-[#00E5FF] border-[#00E5FF]'
                : 'bg-[#050A14] text-stone-400 border-cyan-900 hover:text-white'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>Solo sin leer ({unreadCount})</span>
          </button>
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#050A14] border border-cyan-950 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/70 mx-auto" />
            <h4 className="text-base font-extrabold text-white">
              No hay alertas que coincidan con los filtros
            </h4>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              El sistema se encuentra operando dentro de los parámetros esperados y sin anomalías reportadas.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isUnread = !item.read;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                  isUnread
                    ? item.severity === 'critical'
                      ? 'bg-gradient-to-r from-[#200A13] via-[#0F0A18] to-[#050A14] border-rose-500/80 shadow-lg shadow-rose-950/40'
                      : item.severity === 'milestone'
                      ? 'bg-gradient-to-r from-[#071F15] via-[#081524] to-[#050A14] border-emerald-500/70 shadow-lg shadow-emerald-950/30'
                      : 'bg-gradient-to-r from-[#1E1705] via-[#0D1526] to-[#050A14] border-amber-500/60 shadow-lg'
                    : 'bg-[#050A14]/90 border-cyan-950 hover:border-cyan-900 opacity-90'
                }`}
              >
                {/* Notification Top Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-[#081021] border border-cyan-900/60 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-white truncate">
                          {item.title}
                        </span>
                        {getSeverityBadge(item.severity)}
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono mt-0.5">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{item.timestamp}</span>
                        {item.userName && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-300 font-sans font-bold">
                              {item.userName} ({item.userEmail})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onMarkAsRead(item.id)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        item.read
                          ? 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                          : 'bg-cyan-950 text-[#00E5FF] border-cyan-700 hover:bg-cyan-900'
                      }`}
                      title={item.read ? 'Marcar como no leída' : 'Marcar como leída'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteNotification(item.id)}
                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-red-950/70 text-stone-400 hover:text-red-300 border border-stone-800 hover:border-red-700 transition-all cursor-pointer"
                      title="Eliminar notificación"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed pl-1 sm:pl-11">
                  {item.message}
                </p>

                {/* Metadata & Metrics Snippets */}
                {(item.metricValue || item.threshold) && (
                  <div className="ml-1 sm:ml-11 flex flex-wrap items-center gap-3 p-2 rounded-xl bg-[#081021] border border-cyan-950 text-xs font-mono">
                    {item.metricValue && (
                      <span className="text-stone-300">
                        <strong className="text-white">Valor Registrado:</strong>{' '}
                        <span className="text-cyan-300 font-bold">{item.metricValue}</span>
                      </span>
                    )}
                    {item.threshold && (
                      <span className="text-stone-300">
                        <strong className="text-stone-400">Umbral Configurado:</strong>{' '}
                        <span className="text-amber-300">{item.threshold}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Contextual Quick Actions */}
                <div className="ml-1 sm:ml-11 flex flex-wrap items-center gap-2 pt-1 border-t border-cyan-950/70">
                  {item.userEmail && (
                    <button
                      onClick={() => onNavigateToTab('users', item.userEmail)}
                      className="px-3 py-1.5 rounded-xl bg-[#08152B] hover:bg-[#0E2244] text-[#00E5FF] border border-cyan-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspeccionar Usuario</span>
                    </button>
                  )}

                  {item.category === 'unusual_activity' && item.userEmail && onToggleUserStatus && (
                    <button
                      onClick={() => {
                        const targetUser = users.find(u => u.email.toLowerCase() === item.userEmail?.toLowerCase());
                        if (targetUser) {
                          onToggleUserStatus(targetUser.id);
                          onMarkAsRead(item.id);
                        } else {
                          onNavigateToTab('users', item.userEmail);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Suspender Cuenta Preventivamente</span>
                    </button>
                  )}

                  {item.category === 'usage_milestone' && (
                    <button
                      onClick={() => onNavigateToTab('licenses')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Generar Licencia de Recompensa</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNavigateToTab('analytics')}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ver Gráficas en Tiempo Real</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
