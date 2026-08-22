import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Sparkles, Check, AlertCircle, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey, clearStoredApiKey } from '../services/geminiClient';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setTestStatus('idle');
      setErrorMessage('');
      setSavedSuccess(false);
      setClearedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearKey = () => {
    clearStoredApiKey();
    setApiKey('');
    setTestStatus('idle');
    setErrorMessage('');
    setClearedSuccess(true);
    if (onKeySaved) onKeySaved('');
    setTimeout(() => {
      setClearedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '').trim();
    if (!cleanKey) {
      handleClearKey();
      return;
    }

    if (cleanKey.length < 15) {
      setErrorMessage('La clave parece incompleta o demasiado corta. Debe ser una clave válida de Google AI Studio (empieza con AIzaSy...).');
      setTestStatus('error');
      return;
    }

    setIsTesting(true);
    setTestStatus('idle');
    setErrorMessage('');

    try {
      // Test ping against available Gemini models with properly formatted payload
      const testModels = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];
      let verified = false;
      let lastErrText = '';

      for (const model of testModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: 'ping' }] }]
            })
          });

          if (res.ok) {
            verified = true;
            break;
          } else {
            const data = await res.json().catch(() => ({}));
            lastErrText = data.error?.message || `HTTP ${res.status}`;
            if (res.status === 400 && (lastErrText.includes('API key not valid') || lastErrText.includes('INVALID_ARGUMENT'))) {
              break;
            }
          }
        } catch (e: any) {
          lastErrText = e.message || 'Error de red';
        }
      }

      if (!verified) {
        setErrorMessage(
          lastErrText.includes('API key not valid')
            ? '⚠️ La clave de API ingresada no es válida en Google AI Studio. Verifica que esté copiada completa (comienza con AIzaSy...).'
            : `⚠️ No se pudo verificar la clave: ${lastErrText}. Si prefieres, puedes usar la conexión del servidor por defecto.`
        );
        setTestStatus('error');
        return;
      }

      saveStoredApiKey(cleanKey);
      setTestStatus('success');
      setSavedSuccess(true);
      if (onKeySaved) onKeySaved(cleanKey);

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage('Ocurrió un error al contactar el servicio de verificación.');
      setTestStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-[#081021] border border-cyan-500/50 shadow-2xl p-6 relative text-stone-200 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-lg shadow-cyan-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Clave de API Personalizada
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                Opcional
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              Chepe IA funciona con el servidor en la nube. Puedes configurar tu clave propia aquí si lo deseas.
            </p>
          </div>
        </div>

        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyan-300 flex items-center justify-between">
              <span>Clave API de Gemini</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 font-normal"
              >
                <span>Obtener clave gratis</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestStatus('idle');
                setErrorMessage('');
              }}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900/80 focus:border-[#00E5FF] text-white text-xs placeholder-stone-600 focus:outline-none transition-all"
            />
            <p className="text-[11px] text-stone-500 leading-tight">
              Se almacena localmente en tu navegador. Si dejas el campo vacío, se usará el servidor integrado.
            </p>
          </div>

          {testStatus === 'error' && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{errorMessage}</p>
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="text-[11px] text-cyan-300 underline hover:text-white font-bold cursor-pointer block mt-1"
                >
                  👉 Toca aquí para borrarla y usar la conexión del Servidor
                </button>
              </div>
            </div>
          )}

          {testStatus === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">¡Clave verificada con éxito en Google AI Studio! Conectando...</span>
            </div>
          )}

          {clearedSuccess && (
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <span className="font-bold">¡Clave personalizada eliminada! Usando servidor integrado.</span>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-[#050A14] border border-cyan-950 text-xs space-y-2 text-stone-400">
            <div className="font-semibold text-stone-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              ¿Cómo obtener tu clave gratis si la necesitas?
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-400">
              <li>Entra a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[#00E5FF] underline">Google AI Studio (aistudio.google.com)</a>.</li>
              <li>Inicia sesión con tu cuenta de Google y haz clic en <strong>"Create API key"</strong>.</li>
              <li>Copia tu clave (empieza con <code>AIzaSy...</code>) y pégala en el campo de arriba.</li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={handleClearKey}
              className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-xs font-semibold text-rose-300 hover:text-rose-200 border border-stone-800 hover:border-rose-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Borrar clave personalizada y usar servidor"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Usar Servidor Integrado</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#0F1C36] hover:bg-[#162B54] text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
              >
                Cerrar
              </button>

              <button
                type="submit"
                disabled={isTesting || savedSuccess}
                className="px-5 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verificando en Google...</span>
                  </>
                ) : savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Listo!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Guardar y Activar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
