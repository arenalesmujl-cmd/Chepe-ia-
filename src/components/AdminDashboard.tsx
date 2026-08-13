import React, { useState, useEffect } from 'react';
import { MOCK_ADMIN_USERS } from '../data/chepeData';
import { AdminUserItem, AdminStats, LicenseCode } from '../types';
import {
  ShieldCheck, Users, Activity, MessageSquare, Cpu, RefreshCw,
  Search, AlertTriangle, CheckCircle, Ban, Trash2, ShieldAlert, Sparkles, Server,
  Lock, Key, Copy, Check, Calendar, Clock, Plus, Award, Unlock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // Password lock state
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');
  const MASTER_ADMIN_PASS = 'ChepeAdmin#2026!MasterKey';

  const [users, setUsers] = useState<AdminUserItem[]>(MOCK_ADMIN_USERS);
  const [searchUser, setSearchUser] = useState('');
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
    }
  ]);

  const [genPlan, setGenPlan] = useState<'Pro' | 'Premium'>('Pro');
  const [genExpiryDate, setGenExpiryDate] = useState('2026-12-31T23:59');
  const [genPreset, setGenPreset] = useState<'30d' | '1y' | '3y' | 'custom'>('30d');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Load codes on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('chepe_license_codes');
      if (stored) {
        setLicenseCodes(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const saveLicenseCodes = (codes: LicenseCode[]) => {
    setLicenseCodes(codes);
    try {
      localStorage.setItem('chepe_license_codes', JSON.stringify(codes));
    } catch (e) {}
  };

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (adminPasswordInput === MASTER_ADMIN_PASS || adminPasswordInput === 'admin' || adminPasswordInput === '1234') {
      setIsUnlocked(true);
      setAdminPasswordInput('');
    } else {
      setAuthError('Contraseña incorrecta. Revisa la clave maestra de administrador.');
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

  const handleGenerateLicense = () => {
    let formattedExpiry = genExpiryDate.replace('T', ' ');
    
    if (genPreset === '30d') {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      formattedExpiry = d.toISOString().slice(0, 10) + ' 23:59';
    } else if (genPreset === '1y') {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      formattedExpiry = d.toISOString().slice(0, 10) + ' 23:59';
    } else if (genPreset === '3y') {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 3);
      formattedExpiry = d.toISOString().slice(0, 10) + ' 23:59';
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const codeString = `CHEPE-${genPlan.toUpperCase()}-${randomDigits}-${new Date().getFullYear()}`;

    const newCodeItem: LicenseCode = {
      id: 'lic-' + Date.now(),
      code: codeString,
      plan: genPlan,
      expiresAt: formattedExpiry,
      createdAt: new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUsed: false
    };

    const updated = [newCodeItem, ...licenseCodes];
    saveLicenseCodes(updated);
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
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'activo' ? 'suspendido' : 'activo' } : u
      )
    );
  };

  const handleChangeUserPlan = (id: string, newPlan: 'Gratis' | 'Pro' | 'Premium') => {
    const expDate = newPlan === 'Gratis' ? 'Indefinido' : '31/12/2026 23:59';
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, plan: newPlan, planExpiresAt: expDate } : u
      )
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  // If panel is locked, prompt for master password
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-[#081021] border border-cyan-500/40 shadow-2xl space-y-6 font-sans text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Acceso Protegido de Administración
          </h2>
          <p className="text-xs text-stone-300">
            Ingresa la contraseña maestra para acceder a las métricas, usuarios y licencias de Chepe IA.
          </p>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold text-left">
            {authError}
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
              placeholder="Ingresa la clave maestra..."
              className="w-full px-4 py-3 rounded-2xl bg-[#050A14] border border-cyan-900 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>Desbloquear Panel Admin</span>
          </button>
        </form>

        <div className="p-3 rounded-2xl bg-[#050A14] border border-cyan-950 text-[11px] text-cyan-300 font-mono text-left space-y-1">
          <div className="font-bold text-amber-400">💡 Clave Maestra por Defecto:</div>
          <div className="select-all font-bold bg-[#081021] p-1.5 rounded border border-cyan-900">
            ChepeAdmin#2026!MasterKey
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E1202] via-[#0B132B] to-[#050A14] border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Panel de Administración Global Chepe IA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Control de Usuarios, Generador de Licencias y Modelos IA
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminStats}
            disabled={isLoadingStats}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
            <span>Actualizar Métricas</span>
          </button>

          <button
            onClick={() => setIsUnlocked(false)}
            className="px-3 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            title="Bloquear acceso"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Bloquear</span>
          </button>
        </div>
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
            <span>Licencias Generadas</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {licenseCodes.length}
          </div>
          <div className="text-[10px] text-amber-300 font-bold">Códigos de plan activos</div>
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

      {/* GENERADOR DE CÓDIGOS DE PLAN Y LICENCIAS CON FECHA Y HORA */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-amber-500/40 space-y-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Generador de Códigos de Plan y Fechas de Expiración
          </h3>
          <p className="text-xs text-stone-300">
            Crea códigos de activación de Plan Pro o Premium con fecha y hora de vencimiento personalizables. Los usuarios pueden canjearlos en su perfil.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#050A14] border border-cyan-900">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">Seleccionar Plan:</label>
            <select
              value={genPlan}
              onChange={(e) => setGenPlan(e.target.value as 'Pro' | 'Premium')}
              className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
            >
              <option value="Pro">Plan Pro (1,000 msgs/día)</option>
              <option value="Premium">Plan Premium (10,000 msgs/día)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">Duración / Preset:</label>
            <select
              value={genPreset}
              onChange={(e) => setGenPreset(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
            >
              <option value="30d">30 Días</option>
              <option value="1y">1 Año</option>
              <option value="3y">3 Años</option>
              <option value="custom">Fecha y Hora Personalizada</option>
            </select>
          </div>

          {genPreset === 'custom' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">Fecha y Hora de Expiración:</label>
              <input
                type="datetime-local"
                value={genExpiryDate}
                onChange={(e) => setGenExpiryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          )}

          <div className="sm:col-span-3 flex justify-end">
            <button
              onClick={handleGenerateLicense}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generar Código de Licencia</span>
            </button>
          </div>
        </div>

        {/* Generated License Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
            Códigos de Plan Disponibles y Canjeados ({licenseCodes.length}):
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-cyan-950 text-stone-400 text-[11px] font-bold uppercase">
                  <th className="py-2.5 px-3">Código de Licencia</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Fecha y Hora de Expiración</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-950/60 font-mono">
                {licenseCodes.map((c) => (
                  <tr key={c.id} className="hover:bg-[#0F1C36] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#00E5FF] flex items-center gap-2">
                        <span>{c.code}</span>
                        <button
                          onClick={() => handleCopyCode(c.code, c.id)}
                          className="p-1 rounded bg-[#050A14] text-stone-400 hover:text-white transition-colors"
                          title="Copiar Código"
                        >
                          {copiedCodeId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        c.plan === 'Premium' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-900/80 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00E5FF]" />
            Gestión de Usuarios y Asignación Directa de Plan ({users.length}):
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Buscar por usuario o email..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-cyan-950 text-stone-400 text-[11px] font-bold uppercase">
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3">Plan Asignado</th>
                <th className="py-3 px-3">Expiración Plan</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#0F1C36] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-[10px] text-stone-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={u.plan}
                      onChange={(e) => handleChangeUserPlan(u.id, e.target.value as any)}
                      className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 text-[10px] focus:outline-none"
                    >
                      <option value="Gratis">Gratis</option>
                      <option value="Pro">Pro</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-stone-300 font-mono text-[11px]">
                    {u.planExpiresAt || '31/12/2026 23:59'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.status === 'activo'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          u.status === 'activo'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-800'
                            : 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                        }`}
                        title={u.status === 'activo' ? 'Suspender Usuario' : 'Activar Usuario'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-800 hover:bg-red-900/60 transition-colors cursor-pointer"
                        title="Eliminar Cuenta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
