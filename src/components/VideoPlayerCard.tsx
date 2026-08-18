import React, { useState, useRef } from 'react';
import { Play, Pause, Download, Copy, Check, Clapperboard, Maximize2, Sparkles, Layers, RotateCcw, RefreshCw } from 'lucide-react';
import { VideoProject } from '../types';

interface VideoPlayerCardProps {
  video: VideoProject;
  onAskAIRemix?: (prompt: string) => void;
}

export const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({ video, onAskAIRemix }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showStoryboard, setShowStoryboard] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(e => console.warn(e));
      setIsPlaying(true);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(video.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadVideo = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const filename = `${(video.title || 'chepe_video').replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;
      const proxyDownloadUrl = `/api/download-video?url=${encodeURIComponent(video.videoUrl)}&filename=${encodeURIComponent(filename)}`;

      // Attempt direct blob download first
      try {
        const res = await fetch(video.videoUrl, { mode: 'cors' });
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
          setIsDownloading(false);
          return;
        }
      } catch (blobErr) {
        console.warn('Direct blob fetch CORS fallback to backend proxy:', blobErr);
      }

      // Fallback via server download proxy
      const a = document.createElement('a');
      a.href = proxyDownloadUrl;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading video:', err);
      window.open(video.videoUrl, '_blank');
    } finally {
      setTimeout(() => setIsDownloading(false), 1500);
    }
  };

  return (
    <div className="my-3 rounded-2xl bg-[#060C1B] border border-cyan-500/50 shadow-2xl overflow-hidden space-y-0 animate-in fade-in">
      {/* Card Header */}
      <div className="p-3 bg-[#0B152B] border-b border-cyan-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Clapperboard className="w-3.5 h-3.5 text-[#00E5FF]" />
            {video.title}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-[#00E5FF]/20 text-[#00E5FF] font-bold text-[10px] border border-[#00E5FF]/40">
          {video.style} • {video.aspectRatio}
        </span>
      </div>

      {/* Video Viewport */}
      <div className="relative bg-black aspect-video flex items-center justify-center group overflow-hidden">
        <video
          ref={videoRef}
          key={video.id + '-' + video.videoUrl}
          src={video.videoUrl}
          poster={video.posterUrl}
          loop
          playsInline
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
          }}
          onEnded={() => setIsPlaying(false)}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.hasFailed) {
              target.dataset.hasFailed = 'true';
              target.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
              target.load();
            }
          }}
          className="w-full h-full object-contain cursor-pointer"
          onClick={handleTogglePlay}
        />

        {!isPlaying && (
          <button
            onClick={handleTogglePlay}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#00E5FF]/90 text-stone-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:scale-110 transition-transform cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </button>
        )}

        <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 pointer-events-none">
          {video.duration}s • {video.fps} FPS
        </div>
      </div>

      {/* Storyboard Dropdown */}
      {showStoryboard && video.storyboard && video.storyboard.length > 0 && (
        <div className="p-3 bg-[#050A14] border-t border-cyan-950 space-y-2 text-xs">
          <span className="font-bold text-cyan-300 block text-[11px]">Guión Visual & Tomas:</span>
          {video.storyboard.map(sc => (
            <div key={sc.sceneNumber} className="p-2 rounded-xl bg-[#080E1C] border border-cyan-950 space-y-1">
              <span className="text-[10px] font-bold text-white block">Toma {sc.sceneNumber}: {sc.title}</span>
              <p className="text-[11px] text-stone-300">{sc.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer Controls */}
      <div className="p-3 bg-[#0B152B] border-t border-cyan-950 flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="p-1.5 rounded-lg bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          {video.storyboard && video.storyboard.length > 0 && (
            <button
              onClick={() => setShowStoryboard(!showStoryboard)}
              className="px-2.5 py-1 rounded-lg bg-[#050A14] hover:bg-cyan-950 text-stone-300 hover:text-white border border-cyan-900/50 text-[10px] font-bold transition-colors cursor-pointer"
            >
              {showStoryboard ? 'Ocultar Storyboard' : `Ver Storyboard (${video.storyboard.length})`}
            </button>
          )}

          <button
            onClick={handleCopyPrompt}
            className="text-stone-400 hover:text-cyan-300 text-[11px] flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copiado' : 'Prompt'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadVideo}
            disabled={isDownloading}
            className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-[#00E5FF] border border-cyan-800 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Descargar archivo de video MP4"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                <span>Descargando...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Descargar MP4</span>
              </>
            )}
          </button>

          {onAskAIRemix && (
            <button
              onClick={() => onAskAIRemix(`Remixa o haz una secuela del video: "${video.title}"`)}
              className="px-2.5 py-1.5 rounded-xl bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 border border-blue-500/40 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Remix</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
