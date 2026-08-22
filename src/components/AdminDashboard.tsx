import React, { useState, useEffect } from 'react';
import { MOCK_ADMIN_USERS, PLAN_TIERS } from '../data/chepeData';
import {
  AdminUserItem,
  AdminStats,
  LicenseCode,
  PlanTier,
  SupportedPlan,
  AdminNotification,
  AdminAlertThresholds,
  AdminNotificationCategory,
  AdminNotificationSeverity
} from '../types';
import { AdminActivityPanel } from './AdminActivityPanel';
import { AdminNotificationCenter } from './AdminNotificationCenter';
import {
  ShieldCheck, Users, Activity, MessageSquare, Cpu, RefreshCw,
  Search, AlertTriangle, CheckCircle, Ban, Trash2, ShieldAlert, Sparkles, Server,
  Lock, Key, Copy, Check, Calendar, Clock, Plus, Award, Unlock, Zap, CreditCard,
  Layers, CheckCircle2, ChevronRight, Eye, Shield, KeyRound, Sparkle,
  UserPlus, UserCheck, Mail, X, User, BarChart2, Bell, Flame, Filter, Volume2, CheckCheck
} from 'lucide-react';

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    category: 'unusual_activity',
    severity: 'critical',
    title: '🚨 Ráfaga inusual de prompts detectada',
    message: 'El usuario Carlos Rodríguez (carlos.r@gmail.com) ha emitido 62 peticiones de programación por minuto, superando el umbral de seguridad de 45 req/min.',
    userEmail: 'carlos.r@gmail.com',
    userName: 'Carlos Rodríguez',
    metricValue: '62 req/min',
    threshold: '45 req/min',
    timestamp: 'Hace 5 min',
    read: false
  },
  {
    id: 'notif-2',
    category: 'usage_milestone',
    severity: 'milestone',
    title: '🎯 Hito Diario Alcanzado: 3,800+ Usuarios Activos',
    message: 'La plataforma ha superado los 3,840 usuarios activos concurrentes el día de hoy, marcando un nuevo récord de adopción e interacción continua.',
    metricValue: '3,842 usuarios activos',
    threshold: '3,500 usuarios',
    timestamp: 'Hace 20 min',
    read: false
  },
  {
    id: 'notif-3',
    category: 'usage_milestone',
    severity: 'milestone',
    title: '⚡ Hito de Cómputo: 4,000,000+ Tokens Diarios',
    message: 'Se han procesado más de 4.28 millones de tokens entre Gemini 2.5 Pro y DeepSeek R1 manteniendo una latencia media óptima de 780ms.',
    metricValue: '4,280,900 tokens',
    threshold: '4,000,000 tokens',
    timestamp: 'Hace 1 hora',
    read: true
  },
  {
    id: 'notif-4',
    category: 'security',
    severity: 'warning',
    title: '🛡️ Intento de acceso bloqueado',
    message: 'Se registró un intento no autorizado de acceso al panel de administración con contraseña errónea.',
    metricValue: '1 intento fallido',
    threshold: 'Máx 3 intentos',
    timestamp: 'Hace 2 horas',
    read: true
  }
];

const DEFAULT_THRESHOLDS: AdminAlertThresholds = {
  unusualBurstRequestsPerMin: 45,
  unusualDailyTokensThreshold: 500000,
  failedAuthAttemptsAlert: 3,
  dailyActiveUsersMilestone: 3500,
  dailyConversationsMilestone: 150000,
  dailyTokensMilestone: 4000000,
  soundAlertsEnabled: true,
  autoFlagSuspiciousUsers: true
};

export const AdminDashboard: React.FC = () => {
  // Master Password state
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Active Admin Tab
  const [activeAdminTab, setActiveAdminTab] = useState<'all' | 'analytics' | 'notifications' | 'licenses' | 'users' | 'security'>('all');

  // Notifications State & Dropdown
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const stored = localStorage.getItem('chepe_admin_notifications');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  const [thresholds, setThresholds] = useState<AdminAlertThresholds>(() => {
    try {
      const stored = localStorage.getItem('chepe_admin_alert_thresholds');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_THRESHOLDS;
  });

  const [isQuickNotifOpen, setIsQuickNotifOpen] = useState(false);

  // Password change state
  const [currentPassForChange, setCurrentPassForChange] = useState('');
  const [newPassForChange, setNewPassForChange] = useState('');
  const [confirmPassForChange, setConfirmPassForChange] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState(false);

  // Users state (persisted)
  const [users, setUsers] = useState<AdminUserItem[]>(() => {
    try {
      const stored = localStorage.getItem('chepe_admin_users');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return MOCK_ADMIN_USERS;
  });
  const [searchUser, setSearchUser] = useState('');
  const [filterPlanUser, setFilterPlanUser] = useState<string>('all');

  // New Real User Form/Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPlan, setNewUserPlan] = useState<SupportedPlan>('Pro');
  const [newUserStatus, setNewUserStatus] = useState<'activo' | 'suspendido'>('activo');
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');
  
  const [stats, setStats] = useState<AdminStats>({
    registeredUsersCount: 12480,
    activeUsersToday: 3842,
    totalConversations: 149200,
    totalMessages: 890450,
    tokensUsedToday: 4280900,
    serverHealth: '100% Operativo'
  });

  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // License Code Generator State
  const [licenseCodes, setLicenseCodes] = useState<LicenseCode[]>([
    {
      id: 'lic-1',
      code: 'CHEPE-PRO-9842-2026',
      plan: 'Pro',
      expiresAt: '2026-12-31 23:59',
      createdAt: '12/02/2026 10:00',
      isUsed: false
    },
    {
      id: 'lic-2',
      code: 'CHEPE-PREM-4410-2026',
      plan: 'Premium',
      expiresAt: '2027-01-31 23:59',
      createdAt: '12/02/2026 11:30',
      isUsed: true,
      usedBy: 'arenalesjose802@gmail.com'
    },
    {
      id: 'lic-3',
      code: 'CHEPE-ENT-7721-PERM',
      plan: 'Enterprise',
      expiresAt: 'Vitalicio (Sin Expiración)',
      createdAt: '18/02/2026 14:15',
      isUsed: false
    }
  ]);

  const [genPlan, setGenPlan] = useState<SupportedPlan>('Pro');
  const [genExpiryDate, setGenExpiryDate] = useState('2026-12-31T23:59');
  const [genPreset, setGenPreset] = useState<'30d' | '90d' | '1y' | '3y' | 'lifetime' | 'custom'>('30d');
  const [genBatchCount, setGenBatchCount] = useState<number>(1);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [searchLicense, setSearchLicense] = useState('');
  const [filterLicensePlan, setFilterLicensePlan] = useState<string>('all');
  const [filterLicenseStatus, setFilterLicenseStatus] = useState<string>('all');

  // Load codes, users, notifications and thresholds on mount
  useEffect(() => {
    try {
      const storedCodes = localStorage.getItem('chepe_license_codes');
      if (storedCodes) {
        setLicenseCodes(JSON.parse(storedCodes));
      }
      const storedUsers = localStorage.getItem('chepe_admin_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
      const storedNotifs = localStorage.getItem('chepe_admin_notifications');
      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      }
      const storedThresholds = localStorage.getItem('chepe_admin_alert_thresholds');
      if (storedThresholds) {
        setThresholds(JSON.parse(storedThresholds));
      }
    } catch (e) {}
  }, []);

  const saveLicenseCodes = (codes: LicenseCode[]) => {
    setLicenseCodes(codes);
    try {
      localStorage.setItem('chepe_license_codes', JSON.stringify(codes));
    } catch (e) {}
  };

  const saveUsers = (updatedUsers: AdminUserItem[]) => {
    setUsers(updatedUsers);
    try {
      localStorage.setItem('chepe_admin_users', JSON.stringify(updatedUsers));
    } catch (e) {}
  };

  const saveNotifications = (updated: AdminNotification[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem('chepe_admin_notifications', JSON.stringify(updated));
    } catch (e) {}
  };

  const saveThresholds = (updated: AdminAlertThresholds) => {
    setThresholds(updated);
    try {
      localStorage.setItem('chepe_admin_alert_thresholds', JSON.stringify(updated));
    } catch (e) {}
  };

  // Sound Synthesizer helper for real-time alerts
  const playAlertTone = (severity: AdminNotificationSeverity) => {
    if (!thresholds.soundAlertsEnabled) return;
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
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.38);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch (e) {}
  };

  // Notification Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    saveNotifications(updated);
  };

  const handleMarkAllNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleDeleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const handleClearReadNotifications = () => {
    const updated = notifications.filter(n => !n.read);
    saveNotifications(updated);
  };

  const handleUpdateThresholds = (updated: AdminAlertThresholds) => {
    saveThresholds(updated);
  };

  const handleTriggerSimulatedAlert = (
    category: AdminNotificationCategory,
    severity: AdminNotificationSeverity
  ) => {
    playAlertTone(severity);

    let newAlert: AdminNotification;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (category === 'unusual_activity') {
      const sampleUsers = [
        { name: 'Fernando Castillo', email: 'fernando.castillo@correo.com' },
        { name: 'María Fernández', email: 'maria.f@hotmail.com' },
        { name: 'Lucía Benítez', email: 'lucia.b@empresa.com' },
        { name: 'Carlos Rodríguez', email: 'carlos.r@gmail.com' }
      ];
      const selected = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const reqCount = Math.floor(48 + Math.random() * 35);

      newAlert = {
        id: `notif-${Date.now()}`,
        category: 'unusual_activity',
        severity: 'critical',
        title: '🚨 Actividad Inusual: Ráfaga anómala de prompts',
        message: `El usuario ${selected.name} (${selected.email}) ha generado ${reqCount} peticiones en menos de 60 segundos, excediendo el límite de seguridad de ${thresholds.unusualBurstRequestsPerMin} req/min.`,
        userEmail: selected.email,
        userName: selected.name,
        metricValue: `${reqCount} req/min`,
        threshold: `${thresholds.unusualBurstRequestsPerMin} req/min`,
        timestamp: `Hoy a las ${nowTime}`,
        read: false
      };
    } else if (category === 'usage_milestone') {
      const isTokenMilestone = Math.random() > 0.5;
      if (isTokenMilestone) {
        const tokenVal = (thresholds.dailyTokensMilestone + Math.floor(Math.random() * 800000)).toLocaleString();
        newAlert = {
          id: `notif-${Date.now()}`,
          category: 'usage_milestone',
          severity: 'milestone',
          title: '⚡ Hito Diario de Cómputo Alcanzado',
          message: `El servidor ha procesado más de ${tokenVal} tokens en las últimas 24 horas a través de la infraestructura neuronal de Chepe IA.`,
          metricValue: `${tokenVal} tokens`,
          threshold: `${thresholds.dailyTokensMilestone.toLocaleString()} tokens`,
          timestamp: `Hoy a las ${nowTime}`,
          read: false
        };
      } else {
        const userCount = thresholds.dailyActiveUsersMilestone + Math.floor(Math.random() * 400);
        newAlert = {
          id: `notif-${Date.now()}`,
          category: 'usage_milestone',
          severity: 'milestone',
          title: '🎯 Hito Diario: Récord de Usuarios Activos',
          message: `¡Se ha alcanzado la meta diaria de ${userCount} usuarios concurrentes interactuando simultáneamente!`,
          metricValue: `${userCount} activos`,
          threshold: `${thresholds.dailyActiveUsersMilestone} usuarios`,
          timestamp: `Hoy a las ${nowTime}`,
          read: false
        };
      }
    } else {
      newAlert = {
        id: `notif-${Date.now()}`,
        category: 'security',
        severity: 'warning',
        title: '🛡️ Alerta de Seguridad: Acceso Bloqueado',
        message: `Intento de ingreso al panel de administración denegado tras múltiples claves incorrectas. Se ha bloqueado la sesión temporalmente.`,
        metricValue: `${thresholds.failedAuthAttemptsAlert} intentos fallidos`,
        threshold: `Límite: ${thresholds.failedAuthAttemptsAlert}`,
        timestamp: `Hoy a las ${nowTime}`,
        read: false
      };
    }

    const updated = [newAlert, ...notifications];
    saveNotifications(updated);
  };

  const handleNavigateFromNotification = (
    tab: 'all' | 'analytics' | 'licenses' | 'users' | 'security' | 'notifications',
    searchParam?: string
  ) => {
    setActiveAdminTab(tab as any);
    if (tab === 'users' && searchParam) {
      setSearchUser(searchParam);
    }
  };

  // Master hardcoded key
  const MASTER_HARD_PASSWORD = 'Chepe@Secure99#Admin2026!';

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const input = adminPasswordInput.trim();

    if (!input) {
      setAuthError('⚠️ ERROR: Debes ingresar la contraseña maestra para autenticarte.');
      return;
    }

    const storedPass = localStorage.getItem('chepe_admin_master_password');
    const isMatch = (storedPass && input === storedPass) || input === MASTER_HARD_PASSWORD;

    if (isMatch) {
      setIsUnlocked(true);
      setAdminPasswordInput('');
      setFailedAttempts(0);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= thresholds.failedAuthAttemptsAlert) {
        // Emit automatic security notification
        const secAlert: AdminNotification = {
          id: `sec-${Date.now()}`,
          category: 'security',
          severity: 'critical',
          title: '🚨 Alerta Crítica: Múltiples Intentos Fallidos de Clave Maestra',
          message: `Se han detectado ${newAttempts} intentos fallidos consecutivos de ingreso con contraseña maestra. Acceso temporalmente retenido.`,
          metricValue: `${newAttempts} intentos`,
          threshold: `Máx ${thresholds.failedAuthAttemptsAlert}`,
          timestamp: 'Hace un instante',
          read: false
        };
        saveNotifications([secAlert, ...notifications]);
        playAlertTone('critical');
      }

      if (newAttempts >= 3) {
        setAuthError(`🚫 ALERTA DE SEGURIDAD [Intento ${newAttempts}]: Contraseña incorrecta. Se han registrado múltiples intentos fallidos. Acceso denegado.`);
      } else {
        setAuthError(`⛔ ERROR 401: Contraseña maestra incorrecta (Intento fallido #${newAttempts}). Acceso exclusivo a administradores autorizados.`);
      }
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError('');
    const storedPass = localStorage.getItem('chepe_admin_master_password') || MASTER_HARD_PASSWORD;

    if (currentPassForChange) {
      const isCurrentValid = currentPassForChange === storedPass || currentPassForChange === MASTER_HARD_PASSWORD;
      if (!isCurrentValid) {
        setChangePassError('❌ ERROR: La contraseña actual ingresada es incorrecta.');
        return;
      }
    }

    if (!newPassForChange || newPassForChange.length < 8) {
      setChangePassError('❌ ERROR DE COMPLEJIDAD: La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (confirmPassForChange && newPassForChange !== confirmPassForChange) {
      setChangePassError('❌ ERROR: La confirmación de contraseña no coincide.');
      return;
    }

    try {
      localStorage.setItem('chepe_admin_master_password', newPassForChange);
      setChangePassSuccess(true);
      setTimeout(() => {
        setChangePassSuccess(false);
        setCurrentPassForChange('');
        setNewPassForChange('');
        setConfirmPassForChange('');
      }, 2500);
    } catch (e) {
      setChangePassError('❌ ERROR DEL SISTEMA: No se pudo almacenar la nueva contraseña.');
    }
  };

  const fetchAdminStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats({
          registeredUsersCount: data.registeredUsersCount || 12480,
          activeUsersToday: data.activeUsersToday || 3842,
          totalConversations: data.totalConversations || 149200,
          totalMessages: data.totalMessages || 890450,
          tokensUsedToday: data.tokensUsedToday || 4280900,
          serverHealth: data.serverHealth || '100% Operativo'
        });
      }
    } catch (err) {
      console.log('Using local admin stats fallback');
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchAdminStats();
    }
  }, [isUnlocked]);

  const handleGenerateLicense = (targetPlan?: SupportedPlan) => {
    const planToUse = targetPlan || genPlan;
    let formattedExpiry = genExpiryDate.replace('T', ' ');
    
    if (genPreset === '30d') {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      formattedExpiry = d.toISOString().slice(0, 10) + ' 23:59';
    } else if (genPreset === '90d') {
      const d = new Date();
      d.setDate(d.getDate() + 90);
      formattedExpiry = d.toISOString().slice(0, 10) + ' 23:59';
    } else if (genPreset === '1y') {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      formattedExpiry = d.toISOString().slice(0, 10) + ' 23:59';
    } else if (genPreset === '3y') {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 3);
      formattedExpiry = d.toISOString().slice(0, 10) + ' 23:59';
    } else if (genPreset === 'lifetime') {
      formattedExpiry = 'Vitalicio (Sin Expiración)';
    }

    const count = Math.max(1, Math.min(genBatchCount, 20));
    const newItems: LicenseCode[] = [];

    let planPrefix = 'PRO';
    if (planToUse === 'Gratis') planPrefix = 'FREE';
    else if (planToUse === 'Estudiante') planPrefix = 'STUD';
    else if (planToUse === 'Pro') planPrefix = 'PRO';
    else if (planToUse === 'Pro Anual') planPrefix = 'PRO-YR';
    else if (planToUse === 'Premium') planPrefix = 'PREM';
    else if (planToUse === 'Premium Anual') planPrefix = 'PREM-YR';
    else if (planToUse === 'Enterprise') planPrefix = 'ENT';
    else if (planToUse === 'Developer VIP') planPrefix = 'DEV';

    for (let i = 0; i < count; i++) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const codeString = `CHEPE-${planPrefix}-${randomDigits}-${genPreset === 'lifetime' ? 'PERM' : new Date().getFullYear()}`;

      newItems.push({
        id: 'lic-' + Date.now() + '-' + i,
        code: codeString,
        plan: planToUse,
        expiresAt: formattedExpiry,
        createdAt: new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUsed: false
      });
    }

    const updated = [...newItems, ...licenseCodes];
    saveLicenseCodes(updated);
    if (targetPlan) {
      setGenPlan(targetPlan);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleDeleteLicenseCode = (id: string) => {
    const updated = licenseCodes.filter(c => c.id !== id);
    saveLicenseCodes(updated);
  };

  const handleToggleUserStatus = (id: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: (u.status === 'activo' ? 'suspendido' : 'activo') as 'activo' | 'suspendido' } : u
    );
    saveUsers(updated);
  };

  const handleChangeUserPlan = (id: string, newPlan: SupportedPlan) => {
    const expDate = newPlan === 'Gratis' ? 'Indefinido' : (newPlan === 'Enterprise' || newPlan === 'Developer VIP') ? 'Vitalicio (Sin Expiración)' : '31/12/2026 23:59';
    const updated = users.map((u) =>
      u.id === id ? { ...u, plan: newPlan, planExpiresAt: expDate } : u
    );
    saveUsers(updated);
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
  };

  const handleCreateRealUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError('');
    setAddUserSuccess('');

    const cleanName = newUserName.trim();
    const cleanEmail = newUserEmail.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      setAddUserError('Por favor ingresa un nombre y apellido válido.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setAddUserError('Por favor ingresa un correo electrónico real y válido.');
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      setAddUserError('Ya existe un usuario registrado con este correo electrónico.');
      return;
    }

    const expDate = newUserPlan === 'Gratis'
      ? 'Indefinido'
      : (newUserPlan === 'Enterprise' || newUserPlan === 'Developer VIP')
      ? 'Vitalicio (Sin Expiración)'
      : '31/12/2026 23:59';

    const newUser: AdminUserItem = {
      id: `usr-real-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      plan: newUserPlan,
      planExpiresAt: expDate,
      usage: 0,
      status: newUserStatus,
      registeredDate: new Date().toLocaleDateString('es-ES'),
      lastActive: 'Hace un momento'
    };

    const updated = [newUser, ...users];
    saveUsers(updated);

    setAddUserSuccess(`¡Usuario "${cleanName}" creado y activado con éxito!`);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPlan('Pro');
    setNewUserStatus('activo');

    setTimeout(() => {
      setAddUserSuccess('');
      setIsAddUserOpen(false);
    }, 1500);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase());
    const matchesPlan = filterPlanUser === 'all' || u.plan.toLowerCase() === filterPlanUser.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  const filteredLicenseCodes = licenseCodes.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(searchLicense.toLowerCase()) ||
      (c.usedBy && c.usedBy.toLowerCase().includes(searchLicense.toLowerCase()));
    const matchesPlan = filterLicensePlan === 'all' || c.plan.toLowerCase() === filterLicensePlan.toLowerCase();
    const matchesStatus = filterLicenseStatus === 'all' ||
      (filterLicenseStatus === 'used' && c.isUsed) ||
      (filterLicenseStatus === 'available' && !c.isUsed);
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Calculate plan distribution among users
  const planCounts = {
    Gratis: users.filter(u => u.plan === 'Gratis').length,
    Estudiante: users.filter(u => u.plan === 'Estudiante').length,
    Pro: users.filter(u => u.plan === 'Pro').length,
    'Pro Anual': users.filter(u => u.plan === 'Pro Anual').length,
    Premium: users.filter(u => u.plan === 'Premium').length,
    'Premium Anual': users.filter(u => u.plan === 'Premium Anual').length,
    Enterprise: users.filter(u => u.plan === 'Enterprise').length,
    'Developer VIP': users.filter(u => u.plan === 'Developer VIP').length,
  };

  // If panel is locked, prompt for master password
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-3xl bg-[#081021] border border-amber-500/40 shadow-2xl space-y-6 font-sans text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            Acceso de Administrador
          </h2>
          <p className="text-xs text-stone-300">
            Ingresa la contraseña maestra para acceder a la gestión de planes, licencias, usuarios y seguridad.
          </p>
        </div>

        {authError && (
          <div className="p-3.5 rounded-2xl bg-red-950/90 border border-red-500/60 text-red-200 text-xs font-medium text-left flex items-start gap-2.5 shadow-lg shadow-red-950/40">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>{authError}</div>
          </div>
        )}

        <form onSubmit={handleAdminUnlock} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-stone-300 flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Contraseña Maestra:</span>
            </label>
            <input
              type="password"
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-4 py-3.5 rounded-2xl bg-[#050A14] border border-amber-500/30 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 placeholder:text-stone-600 transition-all"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Unlock className="w-4 h-4" />
            <span>Verificar y Desbloquear Panel</span>
          </button>
        </form>
      </div>
    );
  }

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const criticalUnreadAlerts = notifications.filter(n => !n.read && n.severity === 'critical');

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E1202] via-[#0B132B] to-[#050A14] border border-amber-500/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Panel de Administración Global Chepe IA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Control de Planes, Generador de Licencias y Usuarios
          </h1>
          <p className="text-xs text-stone-300">
            Administra todos los planes del sistema, emite licencias de activación personalizadas y gestiona permisos de usuario.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Notification Bell Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsQuickNotifOpen(!isQuickNotifOpen)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                unreadNotifCount > 0
                  ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-700 shadow-md shadow-rose-950/30'
                  : 'bg-[#081021] hover:bg-[#0D1830] text-stone-300 border-cyan-900'
              }`}
              title="Notificaciones y Alertas"
            >
              <div className="relative">
                <Bell className={`w-4 h-4 ${unreadNotifCount > 0 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                    {unreadNotifCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                {unreadNotifCount > 0 ? `${unreadNotifCount} Alertas` : 'Notificaciones'}
              </span>
            </button>

            {/* Quick Notification Popover Drawer */}
            {isQuickNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#081021] border border-cyan-500/50 shadow-2xl p-4 space-y-3 z-50 font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-950">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Notificaciones Recientes
                    </span>
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={handleMarkAllNotificationsAsRead}
                      className="text-[10px] text-[#00E5FF] hover:underline font-bold"
                    >
                      Marcar leídas
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        handleMarkNotificationAsRead(n.id);
                        setActiveAdminTab('notifications');
                        setIsQuickNotifOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs space-y-1 ${
                        !n.read
                          ? n.severity === 'critical'
                            ? 'bg-rose-950/40 border-rose-800 hover:bg-rose-950/60'
                            : 'bg-amber-950/40 border-amber-800 hover:bg-amber-950/60'
                          : 'bg-[#050A14] border-cyan-950 hover:bg-[#09152B]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-white truncate">{n.title}</span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-300 line-clamp-2">{n.message}</p>
                      <div className="text-[9px] text-stone-400 font-mono flex items-center justify-between pt-0.5">
                        <span>{n.timestamp}</span>
                        <span className="text-cyan-400 font-sans font-bold">Ver detalle &rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-cyan-950 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveAdminTab('notifications');
                      setIsQuickNotifOpen(false);
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <span>Abrir Centro Completo de Alertas ({notifications.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={fetchAdminStats}
            disabled={isLoadingStats}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
            <span>Actualizar Métricas</span>
          </button>

          <button
            onClick={() => setIsUnlocked(false)}
            className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Bloquear acceso"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Bloquear Panel</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if there are unread critical notifications */}
      {criticalUnreadAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-[#1A0810] to-[#081021] border border-rose-500 text-rose-200 shadow-xl shadow-rose-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-900/60 border border-rose-700 shrink-0 animate-bounce">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-black text-white text-sm">
                <span>Alerta de Seguridad & Actividad Inusual Activa</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-rose-900 text-rose-300 font-mono">
                  {criticalUnreadAlerts.length} Eventos Críticos
                </span>
              </div>
              <p className="text-xs text-rose-300 mt-0.5">
                {criticalUnreadAlerts[0].title}: {criticalUnreadAlerts[0].message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setActiveAdminTab('notifications')}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-900/50 transition-all cursor-pointer"
            >
              Revisar Alerta
            </button>
            <button
              onClick={() => handleMarkNotificationAsRead(criticalUnreadAlerts[0].id)}
              className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-cyan-950">
        <button
          onClick={() => setActiveAdminTab('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeAdminTab === 'all'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-black'
              : 'bg-[#081021] text-stone-400 hover:text-white border border-cyan-900/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Vista General Completa</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('notifications')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeAdminTab === 'notifications'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-black'
              : 'bg-[#081021] text-stone-400 hover:text-white border border-cyan-900/60'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notificaciones & Alertas</span>
          {unreadNotifCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeAdminTab === 'notifications' ? 'bg-stone-950 text-amber-300' : 'bg-rose-600 text-white'
            }`}>
              {unreadNotifCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeAdminTab === 'analytics'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-black'
              : 'bg-[#081021] text-stone-400 hover:text-white border border-cyan-900/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Tráfico & Actividad (IA vs Humanos)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('licenses')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeAdminTab === 'licenses'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-black'
              : 'bg-[#081021] text-stone-400 hover:text-white border border-cyan-900/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Generador de Licencias ({licenseCodes.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeAdminTab === 'users'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-black'
              : 'bg-[#081021] text-stone-400 hover:text-white border border-cyan-900/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestión de Usuarios ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('security')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeAdminTab === 'security'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-black'
              : 'bg-[#081021] text-stone-400 hover:text-white border border-cyan-900/60'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Seguridad & Clave Maestra</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#081021] border border-cyan-900/80 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Usuarios Registrados</span>
            <Users className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.registeredUsersCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 font-bold">+12% este mes</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#081021] border border-cyan-900/80 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Usuarios Activos Hoy</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.activeUsersToday.toLocaleString()}
          </div>
          <div className="text-[10px] text-cyan-300 font-bold">En tiempo real</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#081021] border border-cyan-900/80 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Licencias Emitidas</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {licenseCodes.length}
          </div>
          <div className="text-[10px] text-amber-300 font-bold">
            {licenseCodes.filter(c => !c.isUsed).length} disponibles / {licenseCodes.filter(c => c.isUsed).length} canjeadas
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#081021] border border-cyan-900/80 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Estado del Servidor</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            {stats.serverHealth}
          </div>
          <div className="text-[10px] text-stone-400">Latencia: 95ms</div>
        </div>
      </div>

      {/* SECTION: NOTIFICACIONES & ALERTAS INTELIGENTES */}
      {(activeAdminTab === 'all' || activeAdminTab === 'notifications') && (
        <AdminNotificationCenter
          notifications={notifications}
          thresholds={thresholds}
          users={users}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onDeleteNotification={handleDeleteNotification}
          onClearReadNotifications={handleClearReadNotifications}
          onUpdateThresholds={handleUpdateThresholds}
          onTriggerSimulatedAlert={handleTriggerSimulatedAlert}
          onNavigateToTab={handleNavigateFromNotification}
          onToggleUserStatus={handleToggleUserStatus}
        />
      )}


      {/* SECTION: REAL-TIME ACTIVITY & TRAFFIC ANALYTICS (IA VS HUMANOS) */}
      {(activeAdminTab === 'all' || activeAdminTab === 'analytics') && (
        <AdminActivityPanel />
      )}

      {/* GENERADOR DE CÓDIGOS DE PLAN Y LICENCIAS */}
      {(activeAdminTab === 'all' || activeAdminTab === 'licenses') && (
        <div className="p-6 rounded-3xl bg-[#081021] border border-amber-500/40 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-cyan-950">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Generador de Códigos de Licencia con Fecha y Hora
              </h3>
              <p className="text-xs text-stone-300">
                Selecciona un plan a continuación para generar códigos de activación con vigencia personalizable. Los usuarios los canjean en su perfil.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-700 text-amber-300 text-xs font-bold font-mono">
                {licenseCodes.length} Códigos Registrados
              </span>
            </div>
          </div>

          {/* Generator Controls Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#050A14] border border-cyan-900">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Plan Seleccionado:</span>
              </label>
              <select
                value={genPlan}
                onChange={(e) => setGenPlan(e.target.value as SupportedPlan)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="Gratis">Plan Gratuito / Invitado (20 msgs/día - $0)</option>
                <option value="Estudiante">Plan Estudiante / Académico (500 msgs/día - $4.99/mes)</option>
                <option value="Pro">Plan Pro Mensual (1,000 msgs/día - $9.99/mes)</option>
                <option value="Pro Anual">Plan Pro Anual (2,500 msgs/día - $79.99/año)</option>
                <option value="Premium">Plan Premium Mensual (10,000 msgs/día - $19.99/mes)</option>
                <option value="Premium Anual">Plan Premium Anual (25,000 msgs/día - $199.99/año)</option>
                <option value="Enterprise">Plan Enterprise / Vitalicio (Ilimitado - $99.99)</option>
                <option value="Developer VIP">Plan Desarrollador / API VIP (Ilimitado + API - $149.99)</option>
              </select>
            </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Duración / Vigencia:</span>
                </label>
                <select
                  value={genPreset}
                  onChange={(e) => setGenPreset(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="30d">30 Días (1 Mes)</option>
                  <option value="90d">90 Días (3 Meses)</option>
                  <option value="1y">1 Año (12 Meses)</option>
                  <option value="3y">3 Años</option>
                  <option value="lifetime">Vitalicio / Sin Expiración</option>
                  <option value="custom">Fecha y Hora Personalizada</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cantidad a Generar:</span>
                </label>
                <select
                  value={genBatchCount}
                  onChange={(e) => setGenBatchCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value={1}>1 Código</option>
                  <option value={5}>5 Códigos en lote</option>
                  <option value={10}>10 Códigos en lote</option>
                </select>
              </div>

              {genPreset === 'custom' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fecha y Hora de Expiración:</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={genExpiryDate}
                    onChange={(e) => setGenExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              ) : (
                <div className="space-y-1.5 flex flex-col justify-end">
                  <button
                    onClick={() => handleGenerateLicense()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generar {genBatchCount > 1 ? `${genBatchCount} Códigos ${genPlan}` : `Código ${genPlan}`}</span>
                  </button>
                </div>
              )}

              {genPreset === 'custom' && (
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                  <button
                    onClick={() => handleGenerateLicense()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generar Código {genPlan} con Fecha Personalizada</span>
                  </button>
                </div>
              )}
            </div>

          {/* Generated License Table Controls */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                Códigos de Plan Disponibles y Canjeados ({filteredLicenseCodes.length}):
              </h4>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchLicense}
                    onChange={(e) => setSearchLicense(e.target.value)}
                    placeholder="Buscar código o usuario..."
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <select
                  value={filterLicensePlan}
                  onChange={(e) => setFilterLicensePlan(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs font-bold focus:outline-none"
                >
                  <option value="all">Todos los Planes</option>
                  <option value="Gratis">Plan Gratuito</option>
                  <option value="Estudiante">Plan Estudiante</option>
                  <option value="Pro">Plan Pro</option>
                  <option value="Pro Anual">Plan Pro Anual</option>
                  <option value="Premium">Plan Premium</option>
                  <option value="Premium Anual">Plan Premium Anual</option>
                  <option value="Enterprise">Plan Enterprise</option>
                  <option value="Developer VIP">Plan Developer VIP</option>
                </select>

                <select
                  value={filterLicenseStatus}
                  onChange={(e) => setFilterLicenseStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs font-bold focus:outline-none"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="available">Disponibles</option>
                  <option value="used">Canjeados</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-cyan-950 text-stone-400 text-[11px] font-bold uppercase">
                    <th className="py-2.5 px-3">Código de Licencia</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Fecha y Hora de Expiración</th>
                    <th className="py-2.5 px-3">Fecha Emisión</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-950/60 font-mono">
                  {filteredLicenseCodes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-stone-500 font-sans text-xs">
                        No se encontraron códigos con los filtros actuales.
                      </td>
                    </tr>
                  ) : (
                    filteredLicenseCodes.map((c) => (
                      <tr key={c.id} className="hover:bg-[#0F1C36] transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#00E5FF] flex items-center gap-2">
                            <span>{c.code}</span>
                            <button
                              onClick={() => handleCopyCode(c.code, c.id)}
                              className="p-1 rounded bg-[#050A14] text-stone-400 hover:text-white transition-colors cursor-pointer"
                              title="Copiar Código"
                            >
                              {copiedCodeId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            c.plan === 'Enterprise' || c.plan === 'Developer VIP'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : c.plan.includes('Premium')
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}>
                            {c.plan}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-300 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{c.expiresAt}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-stone-400 text-[10px]">
                          {c.createdAt}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.isUsed ? 'bg-stone-900 text-stone-400 border border-stone-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}>
                            {c.isUsed ? `Canjeado (${c.usedBy || 'Usuario'})` : 'Disponible'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteLicenseCode(c.id)}
                            className="p-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-800 hover:bg-red-900 transition-colors cursor-pointer"
                            title="Eliminar Código"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: GESTIÓN DE USUARIOS Y ASIGNACIÓN DIRECTA DE PLANES */}
      {(activeAdminTab === 'all' || activeAdminTab === 'users') && (
        <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-900/80 space-y-5 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-cyan-950">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00E5FF]" />
                  Gestión de Usuarios Reales Registrados ({users.length})
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" /> Cuentas Humanas
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Supervisa y gestiona las cuentas de personas reales registradas en la plataforma, cambia planes y activa accesos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setIsAddUserOpen(!isAddUserOpen)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-400 hover:from-cyan-300 hover:to-cyan-200 text-stone-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isAddUserOpen ? 'Cerrar Formulario' : '＋ Registrar Persona Real'}</span>
              </button>

              <select
                value={filterPlanUser}
                onChange={(e) => setFilterPlanUser(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs font-bold focus:outline-none"
              >
                <option value="all">Todos los Planes</option>
                <option value="Gratis">Gratis ({planCounts.Gratis})</option>
                <option value="Estudiante">Estudiante ({planCounts.Estudiante})</option>
                <option value="Pro">Pro ({planCounts.Pro})</option>
                <option value="Pro Anual">Pro Anual ({planCounts['Pro Anual']})</option>
                <option value="Premium">Premium ({planCounts.Premium})</option>
                <option value="Premium Anual">Premium Anual ({planCounts['Premium Anual']})</option>
                <option value="Enterprise">Enterprise ({planCounts.Enterprise})</option>
                <option value="Developer VIP">Developer VIP ({planCounts['Developer VIP']})</option>
              </select>

              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Buscar persona o correo..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>
          </div>

          {/* Form to Register New Real User */}
          {isAddUserOpen && (
            <div className="p-5 rounded-2xl bg-[#050A14] border border-cyan-500/40 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold text-[#00E5FF] uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#00E5FF]" />
                  <span>Registrar Nueva Cuenta de Usuario Real (Persona)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {addUserSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{addUserSuccess}</span>
                </div>
              )}

              {addUserError && (
                <div className="p-3 rounded-xl bg-red-950/90 border border-red-500 text-red-300 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{addUserError}</span>
                </div>
              )}

              <form onSubmit={handleCreateRealUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Nombre Completo:</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Ej: Laura Ramírez"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Correo Electrónico Real:</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="Ej: laura.ramirez@gmail.com"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Plan a Otorgar:</label>
                    <select
                      value={newUserPlan}
                      onChange={(e) => setNewUserPlan(e.target.value as SupportedPlan)}
                      className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="Gratis">Plan Gratuito ($0)</option>
                      <option value="Estudiante">Plan Estudiante ($4.99/mes)</option>
                      <option value="Pro">Plan Pro ($9.99/mes)</option>
                      <option value="Pro Anual">Plan Pro Anual ($79.99/año)</option>
                      <option value="Premium">Plan Premium ($19.99/mes)</option>
                      <option value="Premium Anual">Plan Premium Anual ($199.99/año)</option>
                      <option value="Enterprise">Plan Enterprise ($99.99)</option>
                      <option value="Developer VIP">Plan Developer VIP ($149.99)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Estado Inicial:</label>
                    <select
                      value={newUserStatus}
                      onChange={(e) => setNewUserStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="activo">Activo (Acceso Inmediato)</option>
                      <option value="suspendido">Suspendido</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar y Habilitar Usuario Real</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-cyan-950 text-stone-400 text-[11px] font-bold uppercase">
                  <th className="py-3 px-3">Persona / Usuario</th>
                  <th className="py-3 px-3">Plan Asignado</th>
                  <th className="py-3 px-3">Vigencia del Plan</th>
                  <th className="py-3 px-3">Mensajes Hoy</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-950/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-500">
                      No se encontraron usuarios reales con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const initials = u.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                    const isSelf = u.id === 'usr-admin-real';

                    return (
                      <tr key={u.id} className={`transition-colors ${isSelf ? 'bg-cyan-950/20 hover:bg-cyan-950/40' : 'hover:bg-[#0F1C36]'}`}>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-[#00E5FF] text-stone-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-cyan-500/20">
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-white">{u.name}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400 text-stone-950">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
                                <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                                <span>{u.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={u.plan}
                            onChange={(e) => handleChangeUserPlan(u.id, e.target.value as any)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 text-[11px] focus:outline-none cursor-pointer"
                          >
                            <option value="Gratis">Gratis</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Pro">Pro</option>
                            <option value="Pro Anual">Pro Anual</option>
                            <option value="Premium">Premium</option>
                            <option value="Premium Anual">Premium Anual</option>
                            <option value="Enterprise">Enterprise</option>
                            <option value="Developer VIP">Developer VIP</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-stone-300 font-mono text-[11px]">
                          {u.planExpiresAt || '31/12/2026 23:59'}
                        </td>
                        <td className="py-3 px-3 font-mono text-cyan-300 text-[11px]">
                          {u.usage} msgs
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'activo'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}>
                            {u.status === 'activo' ? 'Activo' : 'Suspendido'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                u.status === 'activo'
                                  ? 'bg-amber-950/40 text-amber-300 border-amber-800 hover:bg-amber-900/60'
                                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                              }`}
                              title={u.status === 'activo' ? 'Suspender Usuario' : 'Activar Usuario'}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>

                            {!isSelf && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-800 hover:bg-red-900/60 transition-colors cursor-pointer"
                                title="Eliminar Cuenta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: SEGURIDAD & CONTRASEÑA MAESTRA */}
      {(activeAdminTab === 'all' || activeAdminTab === 'security') && (
        <div className="p-6 rounded-3xl bg-[#081021] border border-amber-500/40 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-cyan-950">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Seguridad del Administrador & Contraseña Maestra
              </h3>
              <p className="text-xs text-stone-300">
                Configura y actualiza la clave maestra de acceso con encriptación local segura.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Protección Activa
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info Card */}
            <div className="p-5 rounded-2xl bg-[#050A14] border border-cyan-900 space-y-3">
              <div className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Normas de Acceso</span>
              </div>
              <ul className="text-xs text-stone-300 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Requiere un mínimo de 8 caracteres complejos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Acceso restringido tras 3 intentos fallidos consecutivos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Almacenamiento protegido en el navegador del administrador.</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsUnlocked(false)}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bloquear Sesión Ahora</span>
                </button>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#050A14] border border-amber-500/30 space-y-4">
              <div className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Actualizar Contraseña Maestra de Administrador</span>
              </div>

              {changePassSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>¡Contraseña maestra actualizada exitosamente en el sistema!</span>
                </div>
              )}

              {changePassError && (
                <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-500 text-red-300 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{changePassError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">Contraseña Actual (Opcional):</label>
                    <input
                      type="password"
                      value={currentPassForChange}
                      onChange={(e) => setCurrentPassForChange(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">Nueva Contraseña Maestra:</label>
                    <input
                      type="password"
                      value={newPassForChange}
                      onChange={(e) => setNewPassForChange(e.target.value)}
                      placeholder="Mínimo 8 caracteres..."
                      className="w-full px-3 py-2.5 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">Confirmar Nueva Contraseña Maestra:</label>
                  <input
                    type="password"
                    value={confirmPassForChange}
                    onChange={(e) => setConfirmPassForChange(e.target.value)}
                    placeholder="Repite la nueva contraseña..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Guardar y Aplicar Nueva Clave</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
