import React, { useState } from 'react';
import { X, ThumbsDown, Send, Check } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  messageId: string | null;
  onClose: () => void;
  onSubmit: (messageId: string, tags: string[], comment: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  messageId,
  onClose,
  onSubmit
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !messageId) return null;

  const tagOptions = [
    '⚠️ Respuesta inexacta o inventada',
    '❌ No siguió las instrucciones',
    '🔄 Demasiado larga o repetitiva',
    '⚡ Código con errores o roto',
    '🗣️ Tono no deseado o confuso',
    '📉 Gráfica o datos incorrectos',
    '⏱️ Respuesta incompleta'
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(messageId, selectedTags, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedTags([]);
      setComment('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-[#070D1E] border border-cyan-500/40 rounded-3xl w-full max-w-md shadow-2xl shadow-cyan-950/80 overflow-hidden text-cyan-50">
        
        {/* Header */}
        <div className="p-4 border-b border-cyan-950 flex items-center justify-between bg-[#040813]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400">
              <ThumbsDown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Comentarios sobre la respuesta</h2>
              <p className="text-[11px] text-stone-400">Ayúdanos a calibrar las respuestas de Chepe IA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-cyan-950 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">¡Gracias por tu retroalimentación!</h3>
            <p className="text-xs text-stone-400">Tus observaciones mejoran continuamente nuestros modelos.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-2">
                ¿Qué problema tuvo esta respuesta?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tagOptions.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] font-semibold'
                          : 'bg-[#0B1428] border-cyan-950 text-stone-400 hover:text-stone-200 hover:border-cyan-800'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Detalles adicionales (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explica qué esperabas obtener o cómo mejorar la respuesta..."
                rows={3}
                className="w-full bg-[#040915] border border-cyan-900 rounded-xl p-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-cyan-950">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs text-stone-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={selectedTags.length === 0 && !comment.trim()}
                className="px-4 py-1.5 rounded-xl bg-[#00E5FF] text-stone-950 font-bold text-xs hover:bg-[#33EAFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
