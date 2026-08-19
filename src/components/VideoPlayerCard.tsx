import React, { useState } from 'react';
import { Download, Copy, Check, Clapperboard, Sparkles, Layers } from 'lucide-react';
import { VideoProject } from '../types';
import { CinematicCanvasPlayer } from './CinematicCanvasPlayer';

interface VideoPlayerCardProps {
  video: VideoProject;
  onAskAIRemix?: (prompt: string) => void;
}

export const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({ video, onAskAIRemix }) => {
  const [copied, setCopied] = useState(false);
  const [showStoryboard, setShowStoryboard] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoProject>(video);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activeVideo.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl bg-[#060C1B] border border-cyan-500/40 shadow-2xl overflow-hidden space-y-0 animate-in fade-in">
      {/* Card Header */}
      <div className="p-3 bg-[#0B152B] border-b border-cyan-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate max-w-xs">
            <Clapperboard className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
            {activeVideo.title}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-[#00E5FF]/20 text-[#00E5FF] font-bold text-[10px] border border-[#00E5FF]/40 shrink-0">
          {activeVideo.style}
        </span>
      </div>

      {/* Cinematic Interactive Player Engine */}
      <div className="p-2 bg-[#030712]">
        <CinematicCanvasPlayer
          project={activeVideo}
          onProduceNew={(updated) => setActiveVideo(updated)}
        />
      </div>

      {/* Storyboard Dropdown */}
      {showStoryboard && activeVideo.storyboard && activeVideo.storyboard.length > 0 && (
        <div className="p-3 bg-[#050A14] border-t border-cyan-950 space-y-2 text-xs">
          <span className="font-bold text-cyan-300 block text-[11px]">Guión Visual & Tomas:</span>
          {activeVideo.storyboard.map(sc => (
            <div key={sc.sceneNumber} className="p-2 rounded-xl bg-[#080E1C] border border-cyan-950 space-y-1">
              <span className="text-[10px] font-bold text-white block">Toma {sc.sceneNumber}: {sc.title}</span>
              <p className="text-[11px] text-stone-300">{sc.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="p-2.5 bg-[#0B152B] border-t border-cyan-950 flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          {activeVideo.storyboard && activeVideo.storyboard.length > 0 && (
            <button
              onClick={() => setShowStoryboard(!showStoryboard)}
              className="px-2.5 py-1 rounded-lg bg-[#050A14] hover:bg-cyan-950 text-stone-300 hover:text-white border border-cyan-900/50 text-[10px] font-bold transition-colors cursor-pointer"
            >
              {showStoryboard ? 'Ocultar Storyboard' : `Ver Storyboard (${activeVideo.storyboard.length})`}
            </button>
          )}

          <button
            onClick={handleCopyPrompt}
            className="text-stone-400 hover:text-cyan-300 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copiado' : 'Copiar Prompt'}</span>
          </button>
        </div>

        {onAskAIRemix && (
          <button
            onClick={() => onAskAIRemix(`Remixa o haz una secuela del video: "${activeVideo.title}". Prompt: ${activeVideo.prompt}`)}
            className="px-2.5 py-1.5 rounded-xl bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 border border-blue-500/40 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-blue-300" />
            <span>Remixar con IA</span>
          </button>
        )}
      </div>
    </div>
  );
};
