import React, { useState } from 'react';
import { Check, Copy, Download, Play, Terminal, Sparkles, Layout } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  isCyberpunk?: boolean;
  onExecute?: (code: string, language: string) => void;
  onOpenCanvas?: (code: string, language: string) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  isCyberpunk = true,
  onExecute,
  onOpenCanvas
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
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
      java: 'java',
      kotlin: 'kt',
      csharp: 'cs',
      lua: 'lua',
      sql: 'sql',
      json: 'json'
    };

    const ext = extMap[language.toLowerCase()] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chepe_ia_code.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className={`my-3 rounded-2xl overflow-hidden border transition-all ${
      isCyberpunk
        ? 'border-cyan-500/40 bg-[#060B17] shadow-xl shadow-cyan-950/40'
        : 'border-stone-800 bg-[#0D1117]'
    }`}>
      {/* Code Header Bar */}
      <div className="bg-[#0B132B] px-4 py-2.5 flex items-center justify-between border-b border-cyan-900/50 text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-mono">
          <Terminal className="w-4 h-4 text-[#00E5FF]" />
          <span className="uppercase tracking-wider font-extrabold text-[11px] text-white">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Canvas button */}
          {onOpenCanvas && (
            <button
              onClick={() => onOpenCanvas(code, language)}
              className="flex items-center gap-1.5 text-xs text-stone-950 font-bold bg-[#00E5FF] hover:bg-cyan-300 px-2.5 py-1 rounded-lg transition-transform active:scale-95 shadow-sm"
              title="Abrir en Canvas Interactivo"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
          )}

          {/* Execute button */}
          {onExecute && (
            <button
              onClick={() => onExecute(code, language)}
              className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white bg-[#0F1C36] hover:bg-[#16294D] px-2.5 py-1 rounded-lg border border-cyan-800/80 transition-colors"
              title="Ejecutar código en Sandbox"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Ejecutar</span>
            </button>
          )}

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white bg-[#0F1C36] hover:bg-[#16294D] px-2.5 py-1 rounded-lg border border-cyan-800/80 transition-colors"
            title="Descargar archivo de código"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Descargado</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </>
            )}
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white bg-[#0F1C36] hover:bg-[#16294D] px-2.5 py-1 rounded-lg border border-cyan-800/80 transition-colors"
            title="Copiar código al portapapeles"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-cyan-100 leading-relaxed bg-[#050A14] select-text">
        <pre className="whitespace-pre">{code}</pre>
      </div>
    </div>
  );
};
