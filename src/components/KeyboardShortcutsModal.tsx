import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Navegación & Chat',
      items: [
        { keys: ['Ctrl', 'Shift', 'O'], desc: 'Abrir nuevo chat' },
        { keys: ['Ctrl', 'K'], desc: 'Buscar en chats o atajos' },
        { keys: ['Ctrl', 'Shift', 'S'], desc: 'Ocultar / Mostrar barra lateral' },
        { keys: ['/'], desc: 'Enfocar barra de prompt' },
        { keys: ['Esc'], desc: 'Cerrar modales o Canvas' },
      ]
    },
    {
      category: 'Herramientas de ChatGPT',
      items: [
        { keys: ['Ctrl', 'Shift', 'V'], desc: 'Iniciar Modo de Voz Avanzado' },
        { keys: ['Ctrl', 'Shift', 'I'], desc: 'Instrucciones Personalizadas' },
        { keys: ['Ctrl', 'Shift', 'G'], desc: 'Explorar Agentes GPTs' },
        { keys: ['Ctrl', 'Shift', 'M'], desc: 'Gestor de Memoria' },
        { keys: ['?'], desc: 'Ver atajos de teclado' },
      ]
    },
    {
      category: 'Acciones en Mensajes',
      items: [
        { keys: ['Ctrl', 'Shift', 'C'], desc: 'Copiar última respuesta' },
        { keys: ['Ctrl', 'Enter'], desc: 'Enviar mensaje rápidamente' },
        { keys: ['Shift', 'Enter'], desc: 'Salto de línea en el mensaje' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-[#070D1E] border border-cyan-500/40 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-950/80 overflow-hidden text-cyan-50">
        
        {/* Header */}
        <div className="p-4 border-b border-cyan-950 flex items-center justify-between bg-[#040813]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-[#00E5FF]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Atajos de Teclado
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[#00E5FF]">
                  ChatGPT Style
                </span>
              </h2>
              <p className="text-xs text-stone-400">Acelera tu flujo de trabajo en Chepe IA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-cyan-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {shortcuts.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF]/80">
                {sec.category}
              </h3>
              <div className="space-y-1.5">
                {sec.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#0B1428] border border-cyan-950/80 hover:border-cyan-800/60 transition-colors"
                  >
                    <span className="text-xs text-stone-300">{item.desc}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 text-[11px] font-mono font-bold bg-[#040915] border border-cyan-800 text-[#00E5FF] rounded-md shadow-inner"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-cyan-950 bg-[#040813] flex justify-between items-center text-xs text-stone-400">
          <span>Pulsa <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-cyan-950 border border-cyan-800 rounded text-cyan-300">Esc</kbd> para cerrar</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#00E5FF] text-stone-950 font-bold hover:bg-[#33EAFF] transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
