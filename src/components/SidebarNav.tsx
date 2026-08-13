import React from 'react';
import {
  Plus, MessageSquare, History, Bookmark, BookOpen, Code,
  Calculator, PenTool, Folder, CreditCard, User, Settings,
  ShieldCheck, PanelLeftClose, PanelLeft, Bot, Sparkles, ChevronRight
} from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  dailyCount?: number;
  dailyLimit?: number;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  onNewChat,
  isOpen,
  onToggleOpen,
  dailyCount = 28,
  dailyLimit = 1000,
  userName = 'Usuario Chepe IA',
  userRole = 'user',
  onLogout
}) => {
  const navItems = [
    { id: 'chat', label: 'Chat IA', icon: MessageSquare, badge: 'Principal' },
    { id: 'projects', label: 'Proyectos', icon: Folder, badge: 'Pro' },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'favorites', label: 'Favoritos', icon: Bookmark },
    { id: 'tasks', label: 'Tareas', icon: BookOpen, badge: 'Escolar' },
    { id: 'programming', label: 'Programación', icon: Code, badge: 'Dev' },
    { id: 'math', label: 'Matemáticas', icon: Calculator },
    { id: 'writing', label: 'Escritura', icon: PenTool },
    { id: 'files', label: 'Archivos', icon: Folder },
    { id: 'profile', label: 'Mi Cuenta', icon: User },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'admin', label: 'Panel Admin', icon: ShieldCheck, adminOnly: true }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`${
          isOpen ? 'w-64 sm:w-72 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0 opacity-0'
        } transition-all duration-300 bg-[#080E1C] border-r border-cyan-900/40 flex flex-col fixed md:relative inset-y-0 left-0 z-50 overflow-hidden shrink-0 shadow-2xl md:shadow-none font-sans`}
      >
        {/* Header inside Sidebar */}
        <div className="p-3 border-b border-cyan-950 flex items-center justify-between bg-[#0B132B]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-blue-600 flex items-center justify-center text-stone-950 font-black shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white leading-none">Chepe IA</span>
              <span className="text-[10px] text-cyan-400 font-medium">Plataforma Oficial</span>
            </div>
          </div>

          <button
            onClick={onToggleOpen}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#152442] transition-colors"
            title="Ocultar menú"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Nuevo Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onSelectTab('chat');
              onNewChat();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-cyan-500/20 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span>Nuevo Chat</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-stone-900" />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3 scrollbar-none">
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Navegación Principal
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (window.innerWidth < 768) onToggleOpen();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#002C3E] text-[#00E5FF] border border-[#00E5FF]/40 shadow-md shadow-cyan-950/50'
                      : 'text-stone-300 hover:bg-[#0F1C36] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#00E5FF]' : 'text-cyan-400 group-hover:text-[#00E5FF]'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive
                        ? 'bg-[#00E5FF] text-stone-950'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ChatGPT Style GPTs Section */}
          <div className="space-y-1 pt-2 border-t border-cyan-950">
            <div className="px-3 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
              <span>Agentes GPTs Recomendados</span>
              <span className="text-[9px] text-stone-500 font-mono">ChatGPT Style</span>
            </div>

            {[
              { name: 'GPT Master Code', icon: '💻', desc: 'Desarrollo & React' },
              { name: 'GPT Math & Science', icon: '🧮', desc: 'Fórmulas & Cálculo' },
              { name: 'GPT Data Analyst', icon: '📊', desc: 'CSV & Estadísticas' },
              { name: 'GPT Creative Writer', icon: '✍️', desc: 'Redacción & Ensayos' }
            ].map((gpt, gIdx) => (
              <button
                key={gIdx}
                onClick={() => {
                  onSelectTab('chat');
                  onNewChat();
                  if (window.innerWidth < 768) onToggleOpen();
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-[#0E1B33] flex items-center gap-2 transition-colors cursor-pointer group"
              >
                <span className="text-sm shrink-0">{gpt.icon}</span>
                <div className="truncate">
                  <div className="font-bold text-xs truncate group-hover:text-[#00E5FF]">{gpt.name}</div>
                  <div className="text-[10px] text-stone-400 truncate">{gpt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Usage & Account info */}
        <div className="p-3 border-t border-cyan-950 space-y-2 bg-[#060B17]">
          <div className="bg-[#091224] p-2.5 rounded-xl border border-cyan-900/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-cyan-300">Uso diario de IA</span>
              <span className="text-white font-bold">{dailyCount} / {dailyLimit}</span>
            </div>
            <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-[#00E5FF] transition-all duration-300"
                style={{ width: `${Math.min(100, (dailyCount / dailyLimit) * 100)}%` }}
              />
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900/60 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
