import React, { useState } from 'react';
import { X, Sparkles, Plus, Search, Check, Bot, Code2, Cpu, Wrench, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { CustomGpt } from '../types';
import { OFFICIAL_CUSTOM_GPTS } from '../data/chepeData';

interface CustomGptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGpt: (gpt: CustomGpt) => void;
}

export const CustomGptsModal: React.FC<CustomGptsModalProps> = ({ isOpen, onClose, onSelectGpt }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'create'>('explore');
  const [searchTerm, setSearchTerm] = useState('');
  const [userGpts, setUserGpts] = useState<CustomGpt[]>([]);

  // Create GPT Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('🤖');
  const [starter1, setStarter1] = useState('');
  const [starter2, setStarter2] = useState('');
  const [enableWeb, setEnableWeb] = useState(true);
  const [enableCanvas, setEnableCanvas] = useState(true);
  const [enableImage, setEnableImage] = useState(false);

  if (!isOpen) return null;

  const allGpts = [...OFFICIAL_CUSTOM_GPTS, ...userGpts];
  const filteredGpts = allGpts.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomGpt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !systemPrompt) return;

    const newGpt: CustomGpt = {
      id: `custom-gpt-${Date.now()}`,
      name: name,
      description: description || 'Agente IA personalizado para tareas específicas.',
      systemPrompt: systemPrompt,
      avatarEmoji: avatarEmoji || '🤖',
      category: 'general',
      author: 'Tú (Usuario)',
      capabilities: {
        webSearch: enableWeb,
        canvasCode: enableCanvas,
        imageGeneration: enableImage
      },
      starterPrompts: [starter1, starter2].filter(Boolean)
    };

    setUserGpts([newGpt, ...userGpts]);
    onSelectGpt(newGpt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#060C1B] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-5 bg-[#0B132B] border-b border-cyan-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-blue-600 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Tienda y Creador de GPTs de Chepe</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-[#00E5FF] text-[10px] font-mono border border-cyan-800">
                  ESTÁNDAR GPT-4O
                </span>
              </h2>
              <p className="text-xs text-stone-400">Descubre o crea agentes IA especializados con instrucciones y capacidades a medida</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#0F1C36] text-stone-400 hover:text-white border border-cyan-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#081021] border-b border-cyan-950">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:bg-[#0F1C36]'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Explorar GPTs Oficiales ({allGpts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:bg-[#0F1C36]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Crear mi propio GPT</span>
            </button>
          </div>

          {activeTab === 'explore' && (
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar GPT especializado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#050A14] text-xs text-cyan-200 border border-cyan-900 rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#050A14]">
          {activeTab === 'explore' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGpts.map((gpt) => (
                <div
                  key={gpt.id}
                  onClick={() => {
                    onSelectGpt(gpt);
                    onClose();
                  }}
                  className="p-5 rounded-2xl bg-[#081021] border border-cyan-900/60 hover:border-[#00E5FF] hover:bg-[#0D1830] transition-all cursor-pointer group relative flex flex-col justify-between space-y-4 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0B1528] border border-cyan-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {gpt.avatarEmoji}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-white group-hover:text-[#00E5FF] transition-colors">
                          {gpt.name}
                        </h3>
                        {gpt.isOfficial && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[9px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Oficial
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{gpt.description}</p>
                    </div>
                  </div>

                  {/* Capabilities Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-cyan-950 text-[10px] text-stone-400">
                    {gpt.capabilities.webSearch && <span className="px-2 py-0.5 rounded bg-[#0A162B] text-cyan-300 border border-cyan-800">🌐 Búsqueda Web</span>}
                    {gpt.capabilities.canvasCode && <span className="px-2 py-0.5 rounded bg-[#0A162B] text-cyan-300 border border-cyan-800">💻 Code Canvas</span>}
                    {gpt.capabilities.imageGeneration && <span className="px-2 py-0.5 rounded bg-[#0A162B] text-cyan-300 border border-cyan-800">🎨 DALL-E 3</span>}
                    {gpt.capabilities.dataInterpreter && <span className="px-2 py-0.5 rounded bg-[#0A162B] text-cyan-300 border border-cyan-800">📊 Gráficos CSV</span>}
                  </div>

                  <div className="flex items-center justify-between text-xs font-extrabold text-[#00E5FF] pt-1">
                    <span>Usar este GPT</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCreateCustomGpt} className="max-w-2xl mx-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">Emoji / Avatar</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={avatarEmoji}
                    onChange={(e) => setAvatarEmoji(e.target.value)}
                    className="w-full bg-[#081021] text-center text-2xl border border-cyan-800 rounded-xl p-2.5 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">Nombre del GPT *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Chepe Tutor de Python, Coach de Ensayos..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#081021] text-xs text-white border border-cyan-800 rounded-xl p-3 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Descripción Breve</label>
                <input
                  type="text"
                  placeholder="¿Qué hace que este GPT sea único?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#081021] text-xs text-white border border-cyan-800 rounded-xl p-3 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Instrucciones Maestras del Sistema *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Define la personalidad, reglas y comportamiento especial de este agente IA..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-[#081021] text-xs text-white border border-cyan-800 rounded-xl p-3 focus:outline-none focus:border-[#00E5FF] leading-relaxed resize-none"
                />
              </div>

              {/* Capabilities Toggles */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-300">Capacidades Habilitadas</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setEnableWeb(!enableWeb)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      enableWeb ? 'bg-cyan-950 border-[#00E5FF] text-[#00E5FF]' : 'bg-[#081021] border-cyan-900 text-stone-400'
                    }`}
                  >
                    <span>🌐 Búsqueda Web</span>
                    {enableWeb && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEnableCanvas(!enableCanvas)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      enableCanvas ? 'bg-cyan-950 border-[#00E5FF] text-[#00E5FF]' : 'bg-[#081021] border-cyan-900 text-stone-400'
                    }`}
                  >
                    <span>💻 Live Canvas</span>
                    {enableCanvas && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEnableImage(!enableImage)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      enableImage ? 'bg-cyan-950 border-[#00E5FF] text-[#00E5FF]' : 'bg-[#081021] border-cyan-900 text-stone-400'
                    }`}
                  >
                    <span>🎨 DALL-E 3</span>
                    {enableImage && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Starter Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400">Pregunta Sugerida 1</label>
                  <input
                    type="text"
                    placeholder="Ej. Revisa este código..."
                    value={starter1}
                    onChange={(e) => setStarter1(e.target.value)}
                    className="w-full bg-[#081021] text-xs text-white border border-cyan-800 rounded-xl p-2.5 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400">Pregunta Sugerida 2</label>
                  <input
                    type="text"
                    placeholder="Ej. Explícame el concepto de..."
                    value={starter2}
                    onChange={(e) => setStarter2(e.target.value)}
                    className="w-full bg-[#081021] text-xs text-white border border-cyan-800 rounded-xl p-2.5 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-black text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Guardar y Empezar a Usar GPT
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
