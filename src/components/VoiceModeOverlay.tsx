import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, Radio, RefreshCw, Check } from 'lucide-react';

interface VoiceModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSendVoiceMessage: (text: string) => Promise<string>;
}

export const VoiceModeOverlay: React.FC<VoiceModeOverlayProps> = ({ isOpen, onClose, onSendVoiceMessage }) => {
  if (!isOpen) return null;

  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Sofía (Latina)');
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognitionRef.current.onend = async () => {
        setIsListening(false);
        if (transcript.trim().length > 0) {
          setStatus('thinking');
          try {
            const aiReply = await onSendVoiceMessage(transcript);
            setLastResponse(aiReply);
            setStatus('speaking');

            if (!isMuted && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(aiReply.replace(/```[\s\S]*?```/g, 'Código generado.'));
              utterance.lang = 'es-ES';
              utterance.onend = () => setStatus('idle');
              window.speechSynthesis.speak(utterance);
            } else {
              setTimeout(() => setStatus('idle'), 3000);
            }
          } catch (err) {
            setStatus('idle');
          }
        } else {
          setStatus('idle');
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setStatus('idle');
      };
    }
  }, [transcript, onSendVoiceMessage, isMuted]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setStatus('listening');
      setIsListening(true);
      if (recognitionRef.current) recognitionRef.current.start();
    }
  };

  const voices = [
    'Breeze (Cálida & Fluida)',
    'Ember (Confianza & Calidez)',
    'Cove (Tranquila & Profesional)',
    'Juniper (Energética & Clara)',
    'Sol (Brillante & Amigable)',
    'Alloy (Equilibrada)',
    'Echo (Profunda & Grave)',
    'Sofía (Español Latino)',
    'Carlos (Español España)'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#030712]/95 backdrop-blur-2xl flex flex-col items-center justify-between p-6 sm:p-10 font-sans select-none animate-fadeIn">
      {/* Top Bar Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-mono font-bold">
          <Radio className="w-3.5 h-3.5 text-[#00E5FF] animate-ping" />
          <span>MODO VOZ AVANZADO CHEPE IA</span>
        </div>

        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onClose();
          }}
          className="p-2.5 rounded-full bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Central Pulsing Wave Sphere Visualizer (ChatGPT Advanced Voice Style) */}
      <div className="flex flex-col items-center justify-center my-auto space-y-8 relative">
        <div className="relative flex items-center justify-center">
          {/* Background Ambient Glow Circles */}
          <div
            className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl transition-all duration-700 ${
              status === 'listening'
                ? 'bg-cyan-500/40 scale-125'
                : status === 'thinking'
                ? 'bg-purple-500/40 scale-110 animate-pulse'
                : status === 'speaking'
                ? 'bg-emerald-500/40 scale-125'
                : 'bg-cyan-900/20 scale-100'
            }`}
          />

          {/* Core Animated Fluid Sphere */}
          <div
            onClick={toggleListening}
            className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-500 border-4 relative overflow-hidden ${
              status === 'listening'
                ? 'bg-gradient-to-tr from-cyan-600 via-teal-400 to-[#00E5FF] border-[#00E5FF] shadow-cyan-500/50 scale-105'
                : status === 'thinking'
                ? 'bg-gradient-to-tr from-purple-700 via-indigo-500 to-cyan-400 border-purple-400 shadow-purple-500/50 animate-spin'
                : status === 'speaking'
                ? 'bg-gradient-to-tr from-emerald-600 via-teal-400 to-cyan-300 border-emerald-400 shadow-emerald-500/50 scale-110'
                : 'bg-gradient-to-tr from-[#0F1C36] via-[#162A50] to-[#0A1224] border-cyan-800/80 shadow-cyan-950'
            }`}
          >
            {/* Dynamic Sound Wave Bars */}
            <div className="flex items-center gap-1.5 z-10">
              <div
                className={`w-1.5 rounded-full bg-white transition-all duration-300 ${
                  status === 'speaking' || status === 'listening' ? 'h-12 animate-bounce' : 'h-4'
                }`}
              />
              <div
                className={`w-1.5 rounded-full bg-white transition-all duration-300 ${
                  status === 'speaking' || status === 'listening' ? 'h-16 animate-bounce delay-100' : 'h-6'
                }`}
              />
              <div
                className={`w-1.5 rounded-full bg-white transition-all duration-300 ${
                  status === 'speaking' || status === 'listening' ? 'h-10 animate-bounce delay-200' : 'h-4'
                }`}
              />
              <div
                className={`w-1.5 rounded-full bg-white transition-all duration-300 ${
                  status === 'speaking' || status === 'listening' ? 'h-14 animate-bounce delay-150' : 'h-5'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Live Status Text */}
        <div className="text-center space-y-2 max-w-lg px-4">
          <p className="text-sm font-extrabold tracking-widest uppercase text-cyan-300">
            {status === 'listening' && '🎤 Escuchando tu voz...'}
            {status === 'thinking' && '🧠 Razonando respuesta...'}
            {status === 'speaking' && '🔊 Chepe IA respondiendo...'}
            {status === 'idle' && 'Haz clic en la esfera para hablar'}
          </p>

          <p className="text-xs font-mono text-stone-300 min-h-[3rem] italic line-clamp-3">
            {transcript || lastResponse || 'Toca el micrófono y mantén una conversación fluida en tiempo real.'}
          </p>
        </div>
      </div>

      {/* Bottom Voice Controls Bar */}
      <div className="w-full max-w-xl bg-[#081021] border border-cyan-900/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-bold">Voz:</span>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="bg-[#050A14] text-cyan-300 border border-cyan-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none font-bold"
          >
            {voices.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? 'bg-red-950/80 border-red-800 text-red-400'
                : 'bg-[#0F1C36] border-cyan-800 text-cyan-300 hover:text-white'
            }`}
            title={isMuted ? 'Dessilenciar respuesta' : 'Silenciar respuesta'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleListening}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isListening
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                : 'bg-[#00E5FF] hover:bg-cyan-300 text-stone-950'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Detener' : 'Hablar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
