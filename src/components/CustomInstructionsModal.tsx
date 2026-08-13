import React, { useState } from 'react';
import { X, Sliders, Sparkles, Check, Info, UserCheck, MessageSquare } from 'lucide-react';

interface CustomInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (aboutUser: string, responseFormat: string) => void;
}

export const CustomInstructionsModal: React.FC<CustomInstructionsModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [aboutUser, setAboutUser] = useState(
    'Soy un profesional/estudiante en tecnología interesado en desarrollo web con React, Node.js y arquitectura de software. Me gustan los ejemplos prácticos.'
  );

  const [responseFormat, setResponseFormat] = useState(
    'Respuestas claras, estructuradas en Markdown, con explicaciones directas al punto y bloques de código comentados en TypeScript.'
  );

  const [isEnabled, setIsEnabled] = useState(true);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(aboutUser, responseFormat);
    }
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#060C1B] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#0B132B] border-b border-cyan-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-indigo-600 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>Instrucciones Personalizadas</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-[#00E5FF] border border-cyan-800 text-[10px] font-mono font-bold">
                  CHATGPT STANDARD
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Personaliza cómo debe comportarse Chepe IA en todas tus conversaciones futuras
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#0F1C36] text-stone-400 hover:text-white border border-cyan-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 bg-[#050A14]">
          {/* Field 1: About User */}
          <div className="space-y-2">
            <label className="text-xs font-black text-white flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#00E5FF]" />
              ¿Qué te gustaría que Chepe IA sepa sobre ti para dar mejores respuestas?
            </label>
            <p className="text-[11px] text-stone-400">
              Ubicación, profesión, proyectos activos, nivel técnico o temas de interés recurrente.
            </p>
            <textarea
              rows={3}
              value={aboutUser}
              onChange={(e) => setAboutUser(e.target.value)}
              placeholder="Ej. Trabajo en desarrollo de software, vivo en Guatemala y prefiero explicaciones para nivel intermedio-avanzado..."
              className="w-full bg-[#081021] text-xs text-white border border-cyan-900 rounded-xl p-3 focus:outline-none focus:border-[#00E5FF] resize-none leading-relaxed"
            />
          </div>

          {/* Field 2: Response Style */}
          <div className="space-y-2">
            <label className="text-xs font-black text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              ¿Cómo te gustaría que responda Chepe IA?
            </label>
            <p className="text-[11px] text-stone-400">
              Tono de voz (formal/cercano), longitud de respuestas, uso de listas o postura ante preguntas abiertas.
            </p>
            <textarea
              rows={3}
              value={responseFormat}
              onChange={(e) => setResponseFormat(e.target.value)}
              placeholder="Ej. Sé directo, evita introducciones largas, usa viñetas y proporciona ejemplos de código probados..."
              className="w-full bg-[#081021] text-xs text-white border border-cyan-900 rounded-xl p-3 focus:outline-none focus:border-[#00E5FF] resize-none leading-relaxed"
            />
          </div>

          {/* Toggle Enable */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#081021] border border-cyan-950">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white">Activar para nuevos chats</span>
              <p className="text-[10px] text-stone-400">Aplica estas directrices automáticamente en cada nueva sesión</p>
            </div>

            <button
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                isEnabled ? 'bg-[#00E5FF]' : 'bg-stone-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-stone-950 transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-cyan-950">
            <span className="text-[11px] text-stone-500 font-mono">
              Las instrucciones se guardan de forma segura en tu sesión
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {isSavedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Guardar Instrucciones</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
