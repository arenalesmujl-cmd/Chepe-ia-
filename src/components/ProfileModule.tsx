import React, { useState } from 'react';
import { UserProfile, LicenseCode } from '../types';
import { User, Shield, Zap, Sparkles, Key, CheckCircle, Clock, Activity, Award, KeyRound, AlertCircle } from 'lucide-react';

interface ProfileModuleProps {
  user: UserProfile;
  onUpdateUserPlan: (newPlan: 'Gratis' | 'Pro' | 'Premium', expiresAt: string) => void;
  onOpenSettings: () => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({ user, onUpdateUserPlan, onOpenSettings }) => {
  const usagePercentage = Math.min(100, Math.round((user.dailyUsageCount / user.dailyLimit) * 100));

  const [redeemInput, setRedeemInput] = useState('');
  const [redeemStatus, setRedeemStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemStatus(null);

    const cleanCode = redeemInput.trim().toUpperCase();
    if (!cleanCode) {
      setRedeemStatus({ type: 'error', message: 'Ingresa un código de licencia válido.' });
      return;
    }

    try {
      const stored = localStorage.getItem('chepe_license_codes');
      let codes: LicenseCode[] = stored ? JSON.parse(stored) : [];

      const codeIndex = codes.findIndex(c => c.code.toUpperCase() === cleanCode);

      if (codeIndex === -1) {
        setRedeemStatus({ type: 'error', message: 'El código ingresado no existe o es incorrecto.' });
        return;
      }

      const license = codes[codeIndex];

      if (license.isUsed) {
        setRedeemStatus({ type: 'error', message: `Este código ya fue canjeado por ${license.usedBy || 'otro usuario'}.` });
        return;
      }

      // Mark as used
      codes[codeIndex].isUsed = true;
      codes[codeIndex].usedBy = user.email || user.name;
      localStorage.setItem('chepe_license_codes', JSON.stringify(codes));

      // Upgrade user plan
      onUpdateUserPlan(license.plan, license.expiresAt);
      setRedeemStatus({
        type: 'success',
        message: `¡Código Canjeado con Éxito! Tu cuenta se ha activado al ${license.plan.toUpperCase()} con vencimiento el ${license.expiresAt}.`
      });
      setRedeemInput('');
    } catch (err) {
      setRedeemStatus({ type: 'error', message: 'Error procesando el código de licencia.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#00E5FF] shadow-lg shadow-cyan-500/30"
              />
              <span className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0B132B] absolute bottom-0 right-0 shadow-sm" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF] text-stone-950 text-[10px] font-black uppercase tracking-wider">
                  Plan {user.planType}
                </span>
              </div>
              <p className="text-xs text-stone-400">{user.email}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px] text-cyan-400 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Miembro desde: {user.memberSince}
                </span>
                {user.planExpiresAt && (
                  <span className="text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                    Vence: {user.planExpiresAt}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REDEEM LICENSE CODE CARD */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-amber-500/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-extrabold text-white">Canjear Código de Licencia de Plan</h3>
        </div>
        <p className="text-xs text-stone-300">
          Ingresa el código de activación generado por el administrador para actualizar tu plan y extender la fecha de vencimiento.
        </p>

        {redeemStatus && (
          <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            redeemStatus.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500'
              : 'bg-red-950/90 text-red-300 border border-red-500'
          }`}>
            {redeemStatus.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <span>{redeemStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleRedeemCode} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={redeemInput}
              onChange={(e) => setRedeemInput(e.target.value)}
              placeholder="Ej. CHEPE-PRO-9842-2026"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 font-mono text-white text-xs uppercase focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Canjear Código</span>
          </button>
        </form>
      </div>

      {/* Usage Progress Section */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="text-base font-extrabold text-white">Consumo Diario de Inteligencia Artificial</h3>
          </div>
          <span className="text-xs font-bold text-cyan-300">{usagePercentage}% consumido</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
            <span>Mensajes enviados hoy:</span>
            <strong className="text-white font-mono text-sm">{user.dailyUsageCount} de {user.dailyLimit} mensajes</strong>
          </div>

          <div className="w-full h-3 bg-[#050A14] rounded-full overflow-hidden p-0.5 border border-cyan-950">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-[#00E5FF] rounded-full transition-all duration-500 shadow-md shadow-cyan-500/50"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-stone-400">
            * El límite diario de mensajes se reinicia automáticamente cada 24 horas.
          </p>
        </div>
      </div>

      {/* Quick Settings & Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={onOpenSettings}
          className="p-5 rounded-2xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-900/60 hover:border-[#00E5FF] transition-all cursor-pointer group space-y-2 shadow-md col-span-2"
        >
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-[#00E5FF]" />
            <h4 className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors">
              Configuración de Clave API Personal y Servidor Domiciliario
            </h4>
          </div>
          <p className="text-xs text-stone-400">
            Configura un host IP o clave API de Gemini/Chepe IA para consultas directas sin límites.
          </p>
        </div>
      </div>
    </div>
  );
};
