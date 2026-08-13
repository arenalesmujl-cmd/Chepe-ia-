import React, { useState } from 'react';
import {
  X, Play, Copy, Download, Check, Sparkles, Terminal, Code2, Eye,
  FileText, RefreshCw, Cpu, Maximize2, Minimize2, CheckCircle2, AlertCircle
} from 'lucide-react';

interface CanvasArtifactData {
  title: string;
  language: string;
  content: string;
  type?: 'code' | 'document' | 'html';
}

interface CanvasDrawerProps {
  artifact: CanvasArtifactData | null;
  onClose: () => void;
  onAskAIRefine?: (prompt: string) => void;
}

export const CanvasDrawer: React.FC<CanvasDrawerProps> = ({ artifact, onClose, onAskAIRefine }) => {
  if (!artifact) return null;

  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'console'>('preview');
  const [editedCode, setEditedCode] = useState(artifact.content);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const isHtmlOrUI =
    artifact.language.toLowerCase() === 'html' ||
    artifact.language.toLowerCase() === 'jsx' ||
    artifact.language.toLowerCase() === 'tsx' ||
    editedCode.includes('<!DOCTYPE html>') ||
    editedCode.includes('<html');

  const handleCopy = () => {
    navigator.clipboard.writeText(editedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      javascript: 'js',
      js: 'js',
      typescript: 'ts',
      ts: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md',
      md: 'md'
    };

    const ext = extMap[artifact.language.toLowerCase()] || 'txt';
    const blob = new Blob([editedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.replace(/\s+/g, '_').toLowerCase()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleRunInSandbox = async () => {
    setIsExecuting(true);
    setActiveTab('console');
    setConsoleOutput(['[Iniciando motor de ejecución Chepe IA...]']);

    try {
      const res = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: editedCode, language: artifact.language })
      });

      const data = await res.json();
      if (data.logs && data.logs.length > 0) {
        setConsoleOutput(data.logs);
      } else if (data.result) {
        setConsoleOutput([`Resultado: ${data.result}`]);
      } else {
        setConsoleOutput(['[Ejecución finalizada sin errores visuales]']);
      }
    } catch (err: any) {
      setConsoleOutput([`[ERROR DE EJECUCIÓN]: ${err.message || String(err)}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleQuickAIRefine = (actionText: string) => {
    if (onAskAIRefine) {
      onAskAIRefine(`Por favor refina este artefacto de Canvas (${artifact.title}): ${actionText}\n\nCódigo actual:\n\`\`\`${artifact.language}\n${editedCode}\n\`\`\``);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 bg-[#060C1B] border-l border-cyan-500/40 shadow-2xl flex flex-col font-sans transition-all duration-300 ${
        isExpanded ? 'w-full' : 'w-full md:w-[600px] lg:w-[720px]'
      }`}
    >
      {/* Top Bar Header */}
      <div className="p-4 bg-[#0B132B] border-b border-cyan-900/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[#00E5FF] text-stone-950 font-black flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white truncate">
                {artifact.title || 'Artefacto de Canvas'}
              </h3>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-[#00E5FF] text-[10px] font-mono font-bold uppercase border border-cyan-800 shrink-0">
                {artifact.language || 'Code'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 truncate">Canvas Interactivo Chepe IA</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800 transition-colors cursor-pointer"
            title={isExpanded ? 'Restaurar tamaño' : 'Pantalla completa'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900 text-red-400 border border-red-800/80 transition-colors cursor-pointer"
            title="Cerrar Canvas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Navigation Tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#081021] border-b border-cyan-950">
        <div className="flex items-center gap-2">
          {isHtmlOrUI && (
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:bg-[#0F1C36]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vista Previa UI</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                : 'text-stone-300 hover:bg-[#0F1C36]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'console'
                ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                : 'text-stone-300 hover:bg-[#0F1C36]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Consola ({consoleOutput.length})</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunInSandbox}
            disabled={isExecuting}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Ejecutar en Sandbox"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
            <span>Ejecutar</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-[#0F1C36] text-cyan-300 hover:text-white border border-cyan-800 transition-colors cursor-pointer"
            title="Copiar código"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-[#0F1C36] text-cyan-300 hover:text-white border border-cyan-800 transition-colors cursor-pointer"
            title="Descargar archivo"
          >
            {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-[#050A14] relative">
        {/* TAB 1: Live UI Preview */}
        {activeTab === 'preview' && (
          <div className="w-full h-full bg-white relative">
            <iframe
              title="Canvas Live Preview"
              srcDoc={
                isHtmlOrUI
                  ? editedCode
                  : `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:2rem;line-height:1.6;background:#0f172a;color:#f8fafc;}</style></head><body><pre>${editedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body></html>`
              }
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        )}

        {/* TAB 2: Editable Code Editor */}
        {activeTab === 'code' && (
          <div className="w-full h-full p-4 font-mono text-xs sm:text-sm text-cyan-100 bg-[#050A14] overflow-y-auto">
            <textarea
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              className="w-full h-full bg-transparent border-none text-cyan-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>
        )}

        {/* TAB 3: Execution Output Console */}
        {activeTab === 'console' && (
          <div className="w-full h-full p-4 font-mono text-xs bg-[#03060E] text-emerald-400 overflow-y-auto space-y-2">
            <div className="text-stone-500 text-[11px] font-bold uppercase border-b border-stone-800 pb-2 flex items-center justify-between">
              <span>Salida de Consola Chepe IA</span>
              <button
                onClick={() => setConsoleOutput([])}
                className="hover:text-stone-300 transition-colors cursor-pointer"
              >
                Limpiar Consola
              </button>
            </div>

            {consoleOutput.length === 0 ? (
              <div className="text-stone-600 italic py-4">Haz clic en "Ejecutar" para correr el código en el Sandbox.</div>
            ) : (
              consoleOutput.map((line, idx) => (
                <div key={idx} className="leading-relaxed border-b border-stone-900/40 pb-1">
                  {line}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Quick AI Refine Toolbar */}
      <div className="p-3 bg-[#081021] border-t border-cyan-950 space-y-2">
        <div className="text-[11px] font-bold text-stone-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Refinar Artefacto con Chepe IA:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAIRefine('Corregir errores de sintaxis y optimizar rendimiento')}
            className="px-2.5 py-1 rounded-lg bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            🐛 Corregir Errores
          </button>
          <button
            onClick={() => handleQuickAIRefine('Mejorar diseño UI/UX con Tailwind CSS y Modo Oscuro')}
            className="px-2.5 py-1 rounded-lg bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            🎨 Diseño Modo Oscuro
          </button>
          <button
            onClick={() => handleQuickAIRefine('Agregar comentarios explicativos paso a paso')}
            className="px-2.5 py-1 rounded-lg bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            💬 Agregar Comentarios
          </button>
        </div>
      </div>
    </div>
  );
};
