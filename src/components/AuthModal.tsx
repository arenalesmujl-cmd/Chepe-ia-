import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Bot, Key, Mail, User, ShieldCheck, Sparkles, ArrowRight, Lock, CheckCircle2, UserCheck, X } from 'lucide-react';

interface AuthModalProps {
  onLoginSuccess: (user: UserProfile) => void;
  onClose?: () => void;
  defaultMode?: 'login' | 'register' | 'guest';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, onClose, defaultMode = 'login' }) => {
  const [isRegister, setIsRegister] = useState(defaultMode === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegister) {
      if (!name.trim()) {
        setErrorMessage('Por favor ingresa tu nombre completo.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Ingresa un correo electrónico válido.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden.');
        return;
      }

      const newUser: UserProfile = {
        id: 'usr-' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        planType: 'Gratis',
        memberSince: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
        dailyUsageCount: 0,
        dailyLimit: 100,
        status: 'active',
        role: 'user',
        isGuest: false
      };

      onLoginSuccess(newUser);
    } else {
      if (!email.trim() || !password) {
        setErrorMessage('Completa tu correo y contraseña.');
        return;
      }

      // Check if logging in as admin with configured master password or admin email
      const customMasterPass = localStorage.getItem('chepe_admin_master_password');
      const isAdminLogin = email.toLowerCase().includes('admin') || (customMasterPass && password === customMasterPass);
      
      const loggedUser: UserProfile = {
        id: isAdminLogin ? 'usr-admin' : 'usr-' + Date.now(),
        name: email.split('@')[0] || 'Usuario Chepe IA',
        email: email.trim().toLowerCase(),
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        planType: isAdminLogin ? 'Premium' : 'Pro',
        planExpiresAt: isAdminLogin ? 'Sin Expiración (Ilimitado)' : '31/12/2026 23:59',
        memberSince: '12 de Enero de 2026',
        dailyUsageCount: 0,
        dailyLimit: isAdminLogin ? 10000 : 1000,
        status: 'active',
        role: isAdminLogin ? 'admin' : 'user',
        isGuest: false
      };

      onLoginSuccess(loggedUser);
    }
  };

  // 1-Click Instant Guest Account Generator
  const handleAutomaticGuestLogin = () => {
    const randomGuestNumber = Math.floor(1000 + Math.random() * 9000);
    const guestUser: UserProfile = {
      id: `usr-guest-${Date.now()}-${randomGuestNumber}`,
      name: `Invitado Chepe #${randomGuestNumber}`,
      email: `invitado_${randomGuestNumber}@chepeia.local`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=Guest${randomGuestNumber}`,
      planType: 'Gratis',
      memberSince: 'Hoy (Modo Invitado)',
      dailyUsageCount: 0,
      dailyLimit: 50,
      status: 'active',
      role: 'user',
      isGuest: true
    };
    onLoginSuccess(guestUser);
  };

  const handleQuickDemoAccess = () => {
    const demoUser: UserProfile = {
      id: 'usr-admin-demo',
      name: 'José Arenales (Admin Chepe IA)',
      email: 'arenalesjose802@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      planType: 'Premium',
      planExpiresAt: '31/12/2026 23:59',
      memberSince: '12 de Enero de 2026',
      dailyUsageCount: 28,
      dailyLimit: 10000,
      status: 'active',
      role: 'admin',
      isGuest: false
    };
    onLoginSuccess(demoUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03060E]/90 backdrop-blur-md font-sans">
      <div className="w-full max-w-md bg-[#081021] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#050A14] text-stone-400 hover:text-white border border-cyan-900/60 transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border-b border-cyan-900/60 text-center space-y-2 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-blue-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-cyan-500/30 mx-auto">
            <Bot className="w-8 h-8" />
          </div>

          <div className="space-y-0.5">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
              Acceso a <span className="text-[#00E5FF]">Chepe IA</span>
            </h2>
            <p className="text-xs text-stone-300">
              Inicia sesión, crea tu cuenta o ingresa en modo invitado automático
            </p>
          </div>
        </div>

        {/* Tab Switchers */}
        <div className="flex border-b border-cyan-950 bg-[#050A14]">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMessage(''); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              !isRegister
                ? 'border-[#00E5FF] text-[#00E5FF] bg-[#081021]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMessage(''); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              isRegister
                ? 'border-[#00E5FF] text-[#00E5FF] bg-[#081021]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Automatic Guest Mode Button - High Priority */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#07132B] to-[#0B1E40] border border-[#00E5FF]/50 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#00E5FF]" />
                ¿Quieres probar sin registrarte?
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-[#00E5FF] font-bold border border-cyan-800">
                1 Clic
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutomaticGuestLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Entrar en Modo Invitado Automático</span>
            </button>
            <p className="text-[10px] text-cyan-200/80 text-center">
              Genera una cuenta de invitado instantánea para conversar de inmediato.
            </p>
          </div>

          <div className="flex items-center gap-2 py-1">
            <div className="h-px bg-cyan-950 flex-1" />
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              {isRegister ? 'O regístrate con tu email' : 'O entra con tu cuenta'}
            </span>
            <div className="h-px bg-cyan-950 flex-1" />
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. José Arenales"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900/80 text-white text-xs focus:outline-none focus:border-[#00E5FF] transition-colors"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@chepeia.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900/80 text-white text-xs focus:outline-none focus:border-[#00E5FF] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900/80 text-white text-xs focus:outline-none focus:border-[#00E5FF] transition-colors"
              />
            </div>

            {isRegister && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900/80 text-white text-xs focus:outline-none focus:border-[#00E5FF] transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0E2042] hover:bg-[#152E5E] border border-cyan-600/70 text-cyan-200 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer mt-2"
            >
              <span>{isRegister ? 'Registrar Cuenta Permanente' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4 text-[#00E5FF]" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-cyan-950/80 flex justify-center">
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="text-[11px] text-cyan-400/80 hover:text-[#00E5FF] hover:underline font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Entrar como Administrador Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

