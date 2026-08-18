import React, { useState } from 'react';
import { X, Download, FileText, Code, FileJson, Copy, Check, Sparkles, Printer } from 'lucide-react';
import { ChatMessage } from '../types';

interface ExportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  chatTitle?: string;
}

export const ExportChatModal: React.FC<ExportChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  chatTitle = 'Conversación con Chepe IA'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# ${chatTitle}\n\n`;
    md += `*Exportado de Chepe IA (ChatGPT Style) - Fecha: ${new Date().toLocaleString()}*\n\n---\n\n`;
    messages.forEach((m, idx) => {
      const senderName = m.sender === 'user' ? '🧑 **Usuario**' : '🤖 **Chepe IA**';
      md += `### ${senderName} (${m.timestamp})\n\n${m.text}\n\n`;
      if (m.imageUrl) md += `![Imagen Adjunta](${m.imageUrl})\n\n`;
      if (m.generatedImageUrl) md += `![Imagen Generada](${m.generatedImageUrl})\n\n`;
      md += `---\n\n`;
    });
    return md;
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chatTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleDownloadJson = () => {
    const data = {
      title: chatTitle,
      exportedAt: new Date().toISOString(),
      messagesCount: messages.length,
      messages: messages
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chatTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleDownloadPlainText = () => {
    let text = `${chatTitle}\n===========================\nExportado: ${new Date().toLocaleString()}\n\n`;
    messages.forEach((m) => {
      const sender = m.sender === 'user' ? 'TÚ' : 'CHEPE IA';
      text += `[${m.timestamp}] ${sender}:\n${m.text}\n\n-------------------------\n\n`;
    });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chatTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleCopyFormattedText = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1500);
  };

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${chatTitle}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 24px; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 20px; }
          .msg { margin-bottom: 24px; padding: 16px; border-radius: 12px; }
          .msg.user { background: #f3f4f6; border-left: 4px solid #0284c7; }
          .msg.ai { background: #f8fafc; border-left: 4px solid #10b981; }
          .sender { font-weight: bold; font-size: 14px; margin-bottom: 6px; display: flex; justify-content: space-between; }
          .time { color: #6b7280; font-size: 12px; font-weight: normal; }
          .content { white-space: pre-wrap; font-size: 14px; }
          pre { background: #1e293b; color: #f8fafc; padding: 12px; border-radius: 8px; overflow-x: auto; }
          code { font-family: monospace; }
        </style>
      </head>
      <body>
        <h1>${chatTitle}</h1>
        <p style="color: #666; font-size: 12px;">Exportado desde Chepe IA • ${new Date().toLocaleString()}</p>
        ${messages.map(m => `
          <div class="msg ${m.sender === 'user' ? 'user' : 'ai'}">
            <div class="sender">
              <span>${m.sender === 'user' ? '🧑 Usuario' : '🤖 Chepe IA'}</span>
              <span class="time">${m.timestamp}</span>
            </div>
            <div class="content">${m.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-[#070D1E] border border-cyan-500/40 rounded-3xl w-full max-w-md flex flex-col shadow-2xl shadow-cyan-950/80 overflow-hidden text-cyan-50">
        
        {/* Header */}
        <div className="p-4 border-b border-cyan-950 flex items-center justify-between bg-[#040813]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-[#00E5FF]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Exportar Conversación
              </h2>
              <p className="text-xs text-stone-400">Guarda o comparte tu chat en varios formatos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2.5">
          <button
            onClick={handleDownloadMarkdown}
            className="w-full p-3 rounded-2xl bg-[#091224] hover:bg-[#0E1A33] border border-cyan-950/60 hover:border-cyan-500/50 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Documento Markdown (.md)</h4>
                <p className="text-[10px] text-stone-400">Ideal para Obsidian, Notion y editores de código</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-[#00E5FF]" />
          </button>

          <button
            onClick={handlePrintPdf}
            className="w-full p-3 rounded-2xl bg-[#091224] hover:bg-[#0E1A33] border border-cyan-950/60 hover:border-cyan-500/50 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-purple-950 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Imprimir o Guardar como PDF</h4>
                <p className="text-[10px] text-stone-400">Formato limpio y visual para compartir o imprimir</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-purple-400" />
          </button>

          <button
            onClick={handleDownloadPlainText}
            className="w-full p-3 rounded-2xl bg-[#091224] hover:bg-[#0E1A33] border border-cyan-950/60 hover:border-cyan-500/50 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Texto Plano (.txt)</h4>
                <p className="text-[10px] text-stone-400">Compatible con cualquier lector de notas</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-emerald-400" />
          </button>

          <button
            onClick={handleDownloadJson}
            className="w-full p-3 rounded-2xl bg-[#091224] hover:bg-[#0E1A33] border border-cyan-950/60 hover:border-cyan-500/50 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-950 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Estructura de Datos JSON (.json)</h4>
                <p className="text-[10px] text-stone-400">Exporta todos los metadatos y árbol de mensajes</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-amber-400" />
          </button>

          <button
            onClick={handleCopyFormattedText}
            className="w-full p-3 rounded-2xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-[#00E5FF]/40 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {copied ? '¡Copiado al Portapapeles!' : 'Copiar todo en Formato Markdown'}
                </h4>
                <p className="text-[10px] text-cyan-200/80">Pega directamente en Slack, Discord o correos</p>
              </div>
            </div>
            {copied ? (
              <span className="text-xs text-emerald-400 font-bold">Listo</span>
            ) : (
              <Copy className="w-4 h-4 text-cyan-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
