import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Square, FastForward, Sliders, X } from 'lucide-react';

interface ReadAloudPlayerProps {
  text: string;
  onClose: () => void;
}

const VOICES_PRESETS = [
  { id: 'breeze', name: 'Breeze (Animada & Clara)', pitch: 1.05, rate: 1.0 },
  { id: 'cove', name: 'Cove (Cálida & Profunda)', pitch: 0.9, rate: 0.95 },
  { id: 'ember', name: 'Ember (Confiada & Enérgica)', pitch: 1.0, rate: 1.1 },
  { id: 'juniper', name: 'Juniper (Positiva & Amigable)', pitch: 1.15, rate: 1.0 },
  { id: 'sky', name: 'Sky (Serena & Natural)', pitch: 1.0, rate: 1.0 }
];

export const ReadAloudPlayer: React.FC<ReadAloudPlayerProps> = ({ text, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('sky');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = playbackSpeed;

    const currentPreset = VOICES_PRESETS.find(v => v.id === selectedVoice);
    if (currentPreset) {
      utterance.pitch = currentPreset.pitch;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, selectedVoice, playbackSpeed]);

  const togglePlayPause = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    onClose();
  };

  const cycleSpeed = () => {
    const speeds = [0.8, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-[#070D1F]/95 backdrop-blur-xl border border-cyan-500/50 shadow-2xl shadow-cyan-950/90 rounded-2xl p-3 flex items-center gap-3 text-white max-w-lg w-[92%] sm:w-auto animate-in fade-in slide-in-from-bottom-3">
      {/* Visual Audio Wave */}
      <div className="flex items-center gap-0.5 px-2">
        <span className={`w-1 bg-[#00E5FF] rounded-full transition-all ${isPlaying ? 'h-4 animate-pulse' : 'h-1.5'}`} />
        <span className={`w-1 bg-[#00E5FF] rounded-full transition-all ${isPlaying ? 'h-6 animate-pulse [animation-delay:150ms]' : 'h-1.5'}`} />
        <span className={`w-1 bg-[#00E5FF] rounded-full transition-all ${isPlaying ? 'h-3 animate-pulse [animation-delay:300ms]' : 'h-1.5'}`} />
        <span className={`w-1 bg-[#00E5FF] rounded-full transition-all ${isPlaying ? 'h-5 animate-pulse [animation-delay:450ms]' : 'h-1.5'}`} />
      </div>

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlayPause}
        className="w-9 h-9 rounded-full bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 flex items-center justify-center font-bold transition-all shadow cursor-pointer shrink-0"
        title={isPlaying ? "Pausar lectura" : "Reanudar lectura"}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* Voice Selector Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
          className="px-2.5 py-1.5 rounded-xl bg-[#0F1C36] hover:bg-[#15274A] border border-cyan-900 text-xs font-semibold text-cyan-200 flex items-center gap-1.5 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>{VOICES_PRESETS.find(v => v.id === selectedVoice)?.name.split(' ')[0]}</span>
        </button>

        {isVoiceDropdownOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#091224] border border-cyan-500/40 rounded-2xl shadow-xl p-1.5 space-y-1 z-50">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2 py-1">
              Voces Estilo ChatGPT
            </div>
            {VOICES_PRESETS.map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setSelectedVoice(v.id);
                  setIsVoiceDropdownOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  selectedVoice === v.id ? 'bg-[#002C3E] text-[#00E5FF] font-bold' : 'text-stone-300 hover:bg-[#0E1A33]'
                }`}
              >
                <span>{v.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Speed Button */}
      <button
        type="button"
        onClick={cycleSpeed}
        className="px-2.5 py-1.5 rounded-xl bg-[#0F1C36] hover:bg-[#15274A] border border-cyan-900 text-xs font-mono font-bold text-cyan-200 cursor-pointer"
        title="Cambiar velocidad de reproducción"
      >
        {playbackSpeed}x
      </button>

      {/* Stop / Close Button */}
      <button
        type="button"
        onClick={handleStop}
        className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
        title="Detener y cerrar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
