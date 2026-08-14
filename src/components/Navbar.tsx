import React from 'react';
import { Bot, Plus, User, Settings, ShieldAlert, Sparkles, Activity, Menu, PanelLeft, UserPlus } from 'lucide-react';

interface NavbarProps {
  onNewChat: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userRole?: string;
  isGuest?: boolean;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewChat,
  onOpenProfile,
  onOpenSettings,
  onOpenAdmin,
  activeTab,
  onSelectTab,
  userRole = 'admin',
  isGuest = false,
  onOpenAuthModal,
  onToggleSidebar
}) => {
  return (
    <header className="bg-[#080E1C] border-b border-cyan-900/50 sticky top-0 z-40 px-2 sm:px-4 py-2 shadow-xl w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 sm:p-2 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800/80 transition-colors cursor-pointer shrink-0"
              title="Abrir o cerrar menú lateral"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[#00E5FF]" />
            </button>
          )}

          <button
            onClick={() => onSelectTab('chat')}
            className="flex items-center gap-2 group cursor-pointer text-left min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#00E5FF] to-blue-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-lg text-white tracking-tight truncate">
                  Chepe <span className="text-[#00E5FF]">IA</span>
                </span>
                {isGuest ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/50 text-amber-400 text-[9px] sm:text-[10px] font-extrabold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span className="hidden xs:inline">Invitado</span>
                  </span>
                ) : (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    IA en línea
                  </span>
                )}
              </div>
              <span className="text-[10px] text-cyan-400 font-medium hidden lg:inline truncate">
                Plataforma Multimodal de Inteligencia Artificial
              </span>
            </div>
          </button>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* If Guest: Prominent Create Account / Register button */}
          {isGuest && onOpenAuthModal && (
            <button
              onClick={() => onOpenAuthModal('register')}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-[11px] sm:text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
              title="Crear cuenta permanente para guardar tus chats"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Crear Cuenta</span>
            </button>
          )}

          {/* Nuevo Chat Button */}
          <button
            onClick={() => {
              onSelectTab('chat');
              onNewChat();
            }}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
            title="Nuevo Chat"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Chat</span>
          </button>

          {/* Admin Panel Access Button */}
          {userRole === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className={`p-1.5 sm:p-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
                activeTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : 'bg-[#0F1C36] text-amber-400 border-amber-500/40 hover:bg-[#162A50]'
              }`}
              title="Panel de Administración"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden md:inline">Admin</span>
            </button>
          )}

          {/* Perfil Button */}
          <button
            onClick={onOpenProfile}
            className={`p-1.5 sm:p-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'bg-[#002C3E] text-[#00E5FF] border-[#00E5FF]'
                : 'bg-[#0F1C36] text-cyan-200 border-cyan-800/80 hover:bg-[#162A50]'
            }`}
            title="Mi Perfil"
          >
            <User className="w-4 h-4 text-[#00E5FF]" />
            <span className="hidden md:inline">Perfil</span>
          </button>

          {/* Configuración Button */}
          <button
            onClick={onOpenSettings}
            className={`p-1.5 sm:p-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#002C3E] text-[#00E5FF] border-[#00E5FF]'
                : 'bg-[#0F1C36] text-cyan-200 border-cyan-800/80 hover:bg-[#162A50]'
            }`}
            title="Configuración"
          >
            <Settings className="w-4 h-4 text-cyan-300" />
            <span className="hidden lg:inline">Ajustes</span>
          </button>
        </div>
      </div>
    </header>
  );
};
