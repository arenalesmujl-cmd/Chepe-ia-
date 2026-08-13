import React, { useState } from 'react';
import { X, Share2, Copy, Check, Download, ExternalLink, Sparkles, FileText, Globe } from 'lucide-react';
import { ChatMessage } from '../types';

interface ShareChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  chatTitle?: string;
}

export const ShareChatModal: React.FC<ShareChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  chatTitle = 'Conversación con Chepe IA'
}) => {
  if (!isOpen) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const shareUrl = `https://chepe.ai/share/${Math.random().toString(36).substring(2, 10)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const generateMarkdown = () => {
    return messages
      .map((msg) => `### ${msg.sender === 'user' ? '👤 Usuario' : '🤖 Chepe IA'}\n\n${msg.text}\n`)
      .join('\n---\n\n');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleDownloadTxt = () => {
    const textContent = generateMarkdown();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chepe_chat_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-xl bg-[#060C1B] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-5 bg-[#0B132B] border-b border-cyan-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-blue-600 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Compartir Conversación</h2>
              <p className="text-xs text-stone-400">Genera un enlace público o exporta la sesión completa</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#0F1C36] text-stone-400 hover:text-white border border-cyan-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 bg-[#050A14]">
          {/* Link Generator */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#00E5FF]" />
              Enlace Público del Chat
            </label>
            <div className="flex items-center gap-2 bg-[#081021] border border-cyan-900 rounded-xl p-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-cyan-200 font-mono focus:outline-none px-2 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 text-xs font-black flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Chat Preview Summary */}
          <div className="p-4 rounded-2xl bg-[#081021] border border-cyan-950 space-y-2">
            <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold">Vista previa de exportación</span>
            <p className="text-xs font-bold text-white truncate">{chatTitle}</p>
            <p className="text-xs text-stone-400 font-mono">{messages.length} mensajes intercambiados en la sesión</p>
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyMarkdown}
              className="p-3 rounded-2xl bg-[#081021] border border-cyan-900 hover:border-[#00E5FF] hover:bg-[#0D1830] transition-all flex items-center justify-center gap-2 text-xs font-bold text-cyan-200 cursor-pointer"
            >
              {copiedMarkdown ? <Check className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4 text-[#00E5FF]" />}
              <span>Copiar en Markdown</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="p-3 rounded-2xl bg-[#081021] border border-cyan-900 hover:border-[#00E5FF] hover:bg-[#0D1830] transition-all flex items-center justify-center gap-2 text-xs font-bold text-cyan-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#00E5FF]" />
              <span>Descargar (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
