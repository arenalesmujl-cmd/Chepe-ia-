import React, { useState } from 'react';
import { PenTool, Sparkles, Send, Globe, Languages, FileCheck, RefreshCw } from 'lucide-react';

interface WritingModuleProps {
  onAskAI: (prompt: string, specialty: string) => void;
}

export const WritingModule: React.FC<WritingModuleProps> = ({ onAskAI }) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<'redaccion' | 'traduccion' | 'correccion'>('redaccion');
  const [targetLang, setTargetLang] = useState('Inglés');

  const writingPresets = [
    {
      title: 'Redactar Correo Profesional Formal',
      prompt: 'Redacta un correo electrónico profesional formal dirigido a un cliente confirmando una reunión de proyecto y adjuntando una agenda.'
    },
    {
      title: 'Ensayo Académico Estructurado',
      prompt: 'Escribe un ensayo de 500 palabras con introducción, 3 argumentos de desarrollo y conclusión sobre el impacto de la Inteligencia Artificial en el empleo.'
    },
    {
      title: 'Mejorar Tono y Corregir Ortografía',
      prompt: 'Corrige la ortografía, puntuación y mejora la elocuencia del siguiente texto manteniéndolo profesional:'
    },
    {
      title: 'Traducción Natural Multilingüe',
      prompt: 'Traduce de forma fluida y natural al inglés manteniendo las sutilezas contextuales el siguiente texto:'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let fullPrompt = inputText;
    if (mode === 'traduccion') {
      fullPrompt = `Traduce el siguiente texto al idioma ${targetLang} de forma fluida y precisa con explicación de modismos si aplica:\n\n${inputText}`;
    } else if (mode === 'correccion') {
      fullPrompt = `Corrige la gramática, sintaxis, ortografía y mejora la fluidez del siguiente texto:\n\n${inputText}`;
    }

    onAskAI(fullPrompt, mode === 'traduccion' ? 'traduccion' : 'escritura');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase">
            <PenTool className="w-3.5 h-3.5 text-[#00E5FF]" />
            Centro de Escritura, Redacción y Traducción Chepe IA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Redacción de Ensayos, Correos y Traducción
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Redacta ensayos impecables, perfecciona textos, corrige ortografía y traduce profesionalmente a más de 50 idiomas.
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-cyan-900/60 pb-3">
        <button
          onClick={() => setMode('redaccion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            mode === 'redaccion'
              ? 'bg-[#002C3E] text-[#00E5FF] border border-[#00E5FF]'
              : 'bg-[#081021] text-stone-400 hover:text-white'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Redacción & Ensayos</span>
        </button>

        <button
          onClick={() => setMode('traduccion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            mode === 'traduccion'
              ? 'bg-[#002C3E] text-[#00E5FF] border border-[#00E5FF]'
              : 'bg-[#081021] text-stone-400 hover:text-white'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Traducción Políglota</span>
        </button>

        <button
          onClick={() => setMode('correccion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            mode === 'correccion'
              ? 'bg-[#002C3E] text-[#00E5FF] border border-[#00E5FF]'
              : 'bg-[#081021] text-stone-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Corrección Ortográfica</span>
        </button>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-xl space-y-4">
        {mode === 'traduccion' && (
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <Globe className="w-4 h-4 text-[#00E5FF]" />
            <span>Traducir al idioma:</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-[#050A14] border border-cyan-800 text-cyan-300 font-bold px-3 py-1 rounded-lg text-xs focus:outline-none"
            >
              <option value="Inglés">Inglés (English)</option>
              <option value="Francés">Francés (Français)</option>
              <option value="Alemán">Alemán (Deutsch)</option>
              <option value="Portugués">Portugués (Português)</option>
              <option value="Italiano">Italiano (Italiano)</option>
              <option value="Japonés">Japonés (日本語)</option>
              <option value="Chino">Chino Mandarín (中文)</option>
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'traduccion'
                ? 'Escribe o pega el texto que deseas traducir...'
                : mode === 'correccion'
                ? 'Pega aquí tu texto para corregir ortografía y mejorar la redacción...'
                : 'Escribe el tema, idea o borrador para que Chepe IA lo redacte...'
            }
            rows={5}
            className="w-full p-4 rounded-2xl bg-[#050A14] border border-cyan-900 text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF] leading-relaxed resize-none font-mono"
          />

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 disabled:opacity-40 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>
                {mode === 'traduccion' ? 'Traducir Texto' : mode === 'correccion' ? 'Corregir Texto' : 'Redactar con Chepe IA'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Writing Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {writingPresets.map((p, idx) => (
          <div
            key={idx}
            onClick={() => onAskAI(p.prompt, 'escritura')}
            className="p-5 rounded-2xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-900/60 hover:border-[#00E5FF] transition-all cursor-pointer group space-y-2 shadow-md"
          >
            <h4 className="text-sm font-bold text-[#00E5FF] group-hover:text-white transition-colors">
              {p.title}
            </h4>
            <p className="text-xs text-stone-400 line-clamp-2">
              "{p.prompt}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
