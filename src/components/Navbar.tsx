import React from 'react';
import { Bot, Plus, User, Settings, ShieldAlert, Sparkles, Activity, Menu, PanelLeft } from 'lucide-react';

interface NavbarProps {
  onNewChat: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userRole?: string;
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
  onToggleSidebar
}) => {
  return (
    <header className="bg-[#080E1C] border-b border-cyan-900/50 sticky top-0 z-40 px-3 sm:px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800/80 transition-colors cursor-pointer"
              title="Abrir o cerrar menú lateral"
            >
              <Menu className="w-5 h-5 text-[#00E5FF]" />
            </button>
          )}

          <button
            onClick={() => onSelectTab('chat')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5FF] to-blue-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Chepe <span className="text-[#00E5FF]">IA</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  IA en línea
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-medium hidden sm:inline">
                Plataforma Multimodal de Inteligencia Artificial
              </span>
            </div>
          </button>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2">
          {/* Nuevo Chat Button */}
          <button
            onClick={() => {
              onSelectTab('chat');
              onNewChat();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Chat</span>
          </button>

          {/* Admin Panel Access Button */}
          {userRole === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
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
            className={`p-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
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
            className={`p-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
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
