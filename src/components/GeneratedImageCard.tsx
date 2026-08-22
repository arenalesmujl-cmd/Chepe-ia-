import React, { useState } from 'react';
import {
  Palette, Download, Maximize2, Sparkles, RefreshCw, Copy, Check,
  ExternalLink, Eye, Share2, Layers, ZoomIn, Sliders, Image as ImageIcon
} from 'lucide-react';

interface GeneratedImageMetadata {
  prompt?: string;
  style?: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  engine?: string;
  seed?: number;
}

interface GeneratedImageCardProps {
  imageUrl: string;
  prompt?: string;
  metadata?: GeneratedImageMetadata;
  onOpenLightbox?: (url: string) => void;
  onRegenerate?: (prompt: string) => void;
}

export const GeneratedImageCard: React.FC<GeneratedImageCardProps> = ({
  imageUrl,
  prompt = 'Imagen generada por IA',
  metadata,
  onOpenLightbox,
  onRegenerate
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(imageUrl);

  const displayPrompt = metadata?.prompt || prompt;
  const styleLabel = metadata?.style || 'Fotorrealista';
  const ratioLabel = metadata?.aspectRatio || '1:1';
  const engineLabel = metadata?.engine || 'DALL-E 3 / FLUX Pro';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (currentUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = currentUrl;
        link.download = `chepe_ia_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(currentUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `chepe_ia_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      }
    } catch (err) {
      // Fallback direct link
      window.open(currentUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRetryWithNewSeed = () => {
    setHasError(false);
    setIsLoaded(false);
    if (currentUrl.includes('seed=')) {
      const newSeed = Math.floor(Math.random() * 999999);
      const updatedUrl = currentUrl.replace(/seed=\d+/, `seed=${newSeed}`);
      setCurrentUrl(updatedUrl);
    } else if (onRegenerate) {
      onRegenerate(displayPrompt);
    }
  };

  return (
    <div className="my-3 p-3 sm:p-4 rounded-2xl bg-[#060C1B] border border-cyan-500/50 shadow-2xl shadow-cyan-950/40 space-y-2.5 animate-in fade-in zoom-in-95 duration-300">
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-cyan-300 font-bold px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-pink-500/20 border border-pink-400 flex items-center justify-center text-pink-300">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <span className="text-white font-extrabold text-xs sm:text-sm">
            {engineLabel}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#0A1832] text-cyan-300 border border-cyan-800 text-[10px] font-mono">
            {ratioLabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-mono">
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-200 border border-cyan-900/60">
            Estilo: {styleLabel}
          </span>
        </div>
      </div>

      {/* Main Image Frame with Loading Skeleton and Action Overlay */}
      <div className="relative rounded-xl overflow-hidden border border-cyan-900 bg-[#030712] min-h-[260px] flex items-center justify-center group">
        {/* Loading shimmer while image downloads */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-[#081226] flex flex-col items-center justify-center gap-3 text-cyan-400 p-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-[#00E5FF] flex items-center justify-center animate-spin">
              <Sparkles className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-white block">
                Renderizando imagen en Ultra HD...
              </span>
              <span className="text-[10px] text-cyan-300/80 font-mono block">
                Aplicando iluminación volumétrica y composición 8K
              </span>
            </div>
          </div>
        )}

        {/* Error Fallback with Retry */}
        {hasError ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/80 text-rose-300 flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-rose-200">
                La conexión visual tardó más de lo esperado
              </p>
              <p className="text-[11px] text-stone-400">
                Toca reintentar para generar una nueva variación con el motor de respaldo
              </p>
            </div>
            <button
              onClick={handleRetryWithNewSeed}
              className="px-4 py-1.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 text-xs font-black flex items-center gap-1.5 mx-auto cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reintentar Generación
            </button>
          </div>
        ) : (
          <img
            src={currentUrl}
            alt={displayPrompt}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              // Try fallback with alternative model if initial failed
              if (!currentUrl.includes('model=flux-realism')) {
                setCurrentUrl(prev => `${prev}&model=flux-realism`);
              } else {
                setHasError(true);
              }
            }}
            className={`w-full max-h-[520px] object-contain transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        )}

        {/* Hover / Touch Action Overlay */}
        {isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-black/70 hover:bg-black text-white border border-stone-700 backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-lg text-xs flex items-center gap-1"
                title="Copiar enlace directo"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-bold">{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="text-left max-w-[70%]">
                <p className="text-[11px] text-white font-medium line-clamp-1 drop-shadow">
                  {displayPrompt}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenLightbox ? onOpenLightbox(currentUrl) : window.open(currentUrl, '_blank')}
                  className="p-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-black shadow-lg shadow-cyan-500/40 hover:scale-110 transition-transform cursor-pointer"
                  title="Ver en pantalla completa"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-white border border-stone-600 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  title="Descargar en Alta Definición (PNG)"
                >
                  {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin text-[#00E5FF]" /> : <Download className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Prompt Footer & Quick Action Buttons */}
      <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border-t border-cyan-950/80">
        <p className="text-[11px] text-stone-300 font-medium italic line-clamp-2 text-left">
          "{displayPrompt}"
        </p>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button
            onClick={handleRetryWithNewSeed}
            className="px-2.5 py-1 rounded-lg bg-[#0B172E] hover:bg-[#102447] text-cyan-300 border border-cyan-800 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Generar nueva variación con diferente semilla"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span>Variación</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-2.5 py-1 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Descargar HD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
