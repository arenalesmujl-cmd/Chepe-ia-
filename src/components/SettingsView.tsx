import React, { useState } from 'react';
import { CustomServerConfig } from '../types';
import { Settings, Key, Server, Shield, Check, RefreshCw, Sparkles, ExternalLink, AlertCircle, Trash2 } from 'lucide-react';
import { saveStoredApiKey, getStoredApiKey } from '../services/geminiClient';

interface SettingsViewProps {
  customConfig: CustomServerConfig;
  onSaveCustomConfig: (config: CustomServerConfig) => void;
  onClearAllHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  customConfig,
  onSaveCustomConfig,
  onClearAllHistory
}) => {
  const [apiKey, setApiKey] = useState(customConfig.apiKey || getStoredApiKey() || '');
  const [hostIp, setHostIp] = useState(customConfig.hostIp || '');
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleTestConnection = async () => {
    const cleanKey = (apiKey || getStoredApiKey() || '').trim().replace(/^["']|["']$/g, '').trim();
    if (!cleanKey) {
      setTestResult({
        success: false,
        message: 'Por favor pega tu clave de API de Gemini (empieza con AIzaSy...).'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    // Test directly against Gemini API first
    const testModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let directSuccess = false;
    let directErrorMsg = '';

    for (const model of testModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
        const pingRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'ping' }] }]
          })
        });

        if (pingRes.ok) {
          directSuccess = true;
          break;
        } else {
          const errData = await pingRes.json().catch(() => ({}));
          directErrorMsg = errData.error?.message || `Error HTTP ${pingRes.status}`;
          if (pingRes.status === 400 && directErrorMsg.includes('API key not valid')) {
            break;
          }
        }
      } catch (err: any) {
        directErrorMsg = err.message || 'Error de red';
      }
    }

    if (directSuccess) {
      saveStoredApiKey(cleanKey);
      setTestResult({
        success: true,
        message: '¡Clave de API verificada con éxito! Chepe IA está listo para responder.'
      });
      setIsTesting(false);
      return;
    }

    // Try backend endpoint if direct failed
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleanKey, hostIp })
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          saveStoredApiKey(cleanKey);
          setTestResult({
            success: true,
            message: data.message || '¡Conexión exitosa!'
          });
          setIsTesting(false);
          return;
        }
      }
    } catch {
      // Backend not running (standard on static hosts)
    }

    setIsTesting(false);
    setTestResult({
      success: false,
      message: directErrorMsg || 'La clave no es válida. Por favor verifica que la copiaste completa desde Google AI Studio.'
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '').trim();
    if (cleanKey) {
      saveStoredApiKey(cleanKey);
    }
    onSaveCustomConfig({ apiKey: cleanKey, hostIp });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border border-cyan-500/40 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase">
          <Settings className="w-3.5 h-3.5 text-[#00E5FF]" />
          Ajustes de Plataforma Chepe IA
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Configuración de Clave API y Motor de IA
        </h1>
      </div>

      {/* API Key Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-xl space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-[#00E5FF]" />
            Clave API de Gemini (Requerida para Vercel)
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Pega tu clave gratuita de Google AI Studio para activar las respuestas de Chepe IA al instante.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Clave API de Google Gemini:</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Obtener clave gratis en Google</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-2xl bg-[#050A14] border border-cyan-900 text-white font-mono text-xs focus:outline-none focus:border-[#00E5FF]"
            />
            <p className="text-[11px] text-stone-400">
              💡 <strong>Nota:</strong> No necesitas escribir ninguna URL de servidor. Solo pega tu clave de API arriba.
            </p>
          </div>

          {/* Test connection alert */}
          {testResult && (
            <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-2 ${
              testResult.success
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/80 border-red-500/50 text-red-300'
            }`}>
              {testResult.success ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Verificando...' : 'Probar Conexión'}</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Ajustes Guardados!</span>
                </>
              ) : (
                <span>Guardar y Activar</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ChatGPT Style Custom Instructions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00E5FF]" />
              Instrucciones Personalizadas (Memoria de Usuario)
            </h3>
            <p className="text-xs text-stone-400">
              Personaliza el comportamiento de Chepe IA en todas tus conversaciones.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-[#00E5FF] text-[10px] font-mono border border-cyan-800 font-bold">
            GPT-4O MEMORY
          </span>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">
              ¿Qué te gustaría que Chepe IA sepa sobre ti para darte mejores respuestas?
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Soy estudiante de ingeniería en sistemas, me interesa Python, TypeScript y la robótica..."
              className="w-full p-3 rounded-2xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF] resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">
              ¿Cómo te gustaría que responda Chepe IA?
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Respuestas breves y directas, formateadas con Markdown, tono profesional y ejemplos prácticos de código..."
              className="w-full p-3 rounded-2xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF] resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Platform Policy & Privacy Guardrails Card */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-xl space-y-3">
        <h3 className="text-sm font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#00E5FF]" />
          Políticas de Seguridad y Restricción Activas
        </h3>

        <div className="p-4 rounded-2xl bg-[#050A14] border border-cyan-900/60 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 text-[#00E5FF] shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white">Política de Restricción de Información (Guatemala)</h4>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                ACTIVA Y REFORZADA
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Cualquier consulta sobre Guatemala genera la respuesta automática programada: <strong className="text-[#00E5FF]">"No tengo derecho de responder información acerca de Guatemala."</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Reset & Danger Zone */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-red-900/40 space-y-4 shadow-xl">
        <h3 className="text-sm font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Mantenimiento de Datos e Historial:
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#050A14] border border-red-950">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-white">Borrar todo el historial local</h4>
            <p className="text-[11px] text-stone-400">Elimina las conversaciones guardadas de este dispositivo.</p>
          </div>

          <button
            onClick={onClearAllHistory}
            className="px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Borrar Historial Completo
          </button>
        </div>
      </div>
    </div>
  );
};
