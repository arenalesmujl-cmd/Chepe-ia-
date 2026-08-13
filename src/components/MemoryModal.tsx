import React, { useState } from 'react';
import { X, Brain, Trash2, Plus, Sparkles, Check, Info } from 'lucide-react';

interface MemoryItem {
  id: string;
  text: string;
  category: 'preferencia' | 'tecnologia' | 'personal' | 'estilo';
  createdAt: string;
}

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: 'mem-1',
      text: 'El usuario prefiere explicaciones estructuradas con ejemplos en TypeScript y React.',
      category: 'tecnologia',
      createdAt: '12 Ago 2026'
    },
    {
      id: 'mem-2',
      text: 'Le gusta que las respuestas incluyan diagramas de flujo o bloques de código probados.',
      category: 'preferencia',
      createdAt: '10 Ago 2026'
    },
    {
      id: 'mem-3',
      text: 'Trabaja con arquitectura de software en Node.js y Tailwind CSS.',
      category: 'personal',
      createdAt: '08 Ago 2026'
    }
  ]);

  const [newFact, setNewFact] = useState('');

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;

    const newItem: MemoryItem = {
      id: `mem-${Date.now()}`,
      text: newFact.trim(),
      category: 'preferencia',
      createdAt: 'Ahora'
    };

    setMemories([newItem, ...memories]);
    setNewFact('');
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter((m) => m.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de borrar toda la memoria de Chepe IA?')) {
      setMemories([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#060C1B] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#0B132B] border-b border-cyan-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-purple-600 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20">
              <Brain className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>Memoria Guardada de Chepe IA</span>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono">
                  GPT-4O MEMORY
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Detalles y preferencias que Chepe IA recuerda sobre ti en todas las conversaciones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#0F1C36] text-stone-400 hover:text-white border border-cyan-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form to Add Memory */}
        <div className="p-4 bg-[#081021] border-b border-cyan-950">
          <form onSubmit={handleAddMemory} className="flex gap-2">
            <input
              type="text"
              placeholder="Ej. Prefiero que las respuestas sean breves y sin preámbulos..."
              value={newFact}
              onChange={(e) => setNewFact(e.target.value)}
              className="flex-1 bg-[#050A14] text-xs text-white border border-cyan-800 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00E5FF]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Recordar</span>
            </button>
          </form>
        </div>

        {/* Memory List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#050A14] max-h-96">
          {memories.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Brain className="w-10 h-10 text-stone-600 mx-auto" />
              <p className="text-xs text-stone-400 font-bold">La memoria de Chepe IA está vacía</p>
              <p className="text-[11px] text-stone-500">Agrega un detalle o sigue conversando para que la IA aprenda de ti.</p>
            </div>
          ) : (
            memories.map((mem) => (
              <div
                key={mem.id}
                className="p-3.5 rounded-2xl bg-[#081021] border border-cyan-900/60 flex items-start justify-between gap-3 group hover:border-[#00E5FF] transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <span className="p-1 rounded-lg bg-cyan-950 text-[#00E5FF] border border-cyan-800 text-[10px] font-mono mt-0.5">
                    🧠
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs text-stone-200 font-medium leading-relaxed">{mem.text}</p>
                    <span className="text-[10px] text-stone-500 font-mono">Añadido: {mem.createdAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMemory(mem.id)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Olvidar esta información"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#081021] border-t border-cyan-950 flex items-center justify-between text-xs">
          <span className="text-stone-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#00E5FF]" />
            {memories.length} hechos recordados activamente
          </span>

          {memories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
            >
              Borrar toda la memoria
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
