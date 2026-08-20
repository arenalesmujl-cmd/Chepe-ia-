import React, { useEffect, useRef, useState } from 'react';
import {
  Play, Pause, Volume2, VolumeX, RotateCcw, Download,
  Maximize2, Sparkles, Layers, Sliders, CheckCircle, Flame, RefreshCw,
  Film, ChevronLeft, ChevronRight, MessageSquare, Clapperboard
} from 'lucide-react';
import { VideoProject, MovieScene } from '../types';
import {
  drawCinematicFrame,
  COLOR_PALETTES,
  audioSynth,
  renderAndRecordVideo
} from '../lib/videoGeneratorEngine';

interface CinematicCanvasPlayerProps {
  project: VideoProject;
  onProduceNew?: (project: VideoProject) => void;
  className?: string;
  autoPlay?: boolean;
}

export const CinematicCanvasPlayer: React.FC<CinematicCanvasPlayerProps> = ({
  project,
  onProduceNew,
  className = '',
  autoPlay = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Player mode: 'canvas' (Live 60FPS generative engine) or 'video' (HTML5 stream / blob)
  const [playerMode, setPlayerMode] = useState<'canvas' | 'video'>('canvas');
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(project.duration || 8);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);

  // Multi-scene movie state
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const movieScenes: MovieScene[] = project.movieScenes || [];
  const isMovieMode = Boolean(project.isMovie && movieScenes.length > 0);

  // Particle and background image state for canvas renderer
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    radius: number;
    speedX: number;
    speedY: number;
    color: string;
    alpha: number;
    pulse: number;
  }>>([]);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const currentTimeRef = useRef<number>(0);

  // Keep ref in sync
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // Load active image (either movie scene poster or main project poster)
  const activePosterUrl = isMovieMode && movieScenes[activeSceneIndex]?.posterUrl
    ? movieScenes[activeSceneIndex].posterUrl
    : project.posterUrl;

  const currentScene = isMovieMode ? movieScenes[activeSceneIndex] : null;

  // Initialize particles & background image when project or scene changes
  useEffect(() => {
    const width = 1280;
    const height = 720;
    const palette = COLOR_PALETTES[project.style] || COLOR_PALETTES['default'];
    
    // Init particles
    const newParticles = [];
    for (let i = 0; i < 90; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3.5 + 1.5,
        speedX: (Math.random() - 0.5) * 2.5,
        speedY: (Math.random() - 0.5) * 2.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI
      });
    }
    particlesRef.current = newParticles;

    // Load poster / image
    if (activePosterUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        bgImgRef.current = img;
      };
      img.onerror = () => {
        bgImgRef.current = null;
      };
      img.src = activePosterUrl;
    } else {
      bgImgRef.current = null;
    }

    setCurrentTime(0);
    currentTimeRef.current = 0;
    setDuration(currentScene?.sceneDuration || project.duration || 8);
    setIsPlaying(true);
    setPlayerMode('canvas');
  }, [project.id, activePosterUrl, project.style, activeSceneIndex]);

  // Canvas Animation Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTime = currentTimeRef.current;

    const render = (now: number) => {
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (isPlaying && playerMode === 'canvas') {
        localTime += delta * playbackSpeed;
        if (localTime >= duration) {
          if (isMovieMode && movieScenes.length > 1) {
            // Auto advance scene if in movie mode
            setActiveSceneIndex(prev => (prev + 1) % movieScenes.length);
            localTime = 0;
          } else {
            localTime = 0; // Seamless continuous loop
          }
        }
        currentTimeRef.current = localTime;
        setCurrentTime(localTime);
      }

      const activeTitle = currentScene ? `Escena ${currentScene.sceneNumber}: ${currentScene.title}` : project.title;
      const activePrompt = currentScene ? (currentScene.description || currentScene.visualPrompt || project.prompt) : project.prompt;

      drawCinematicFrame(ctx, canvas.width, canvas.height, localTime, duration, {
        prompt: activePrompt || activeTitle,
        style: project.style,
        cameraMotion: currentScene?.cameraAngle || project.cameraMotion || 'Paneo Suave & Zoom',
        title: activeTitle,
        bgImage: bgImgRef.current,
        particles: particlesRef.current
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    lastTimeRef.current = performance.now();
    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying, playerMode, duration, playbackSpeed, project, activeSceneIndex, isMovieMode, movieScenes.length]);

  // Audio Synth sync with playback
  useEffect(() => {
    if (isPlaying && !isMuted) {
      try {
        audioSynth.start();
      } catch (e) {
        console.warn('Audio start error:', e);
      }
    } else {
      try {
        audioSynth.stop();
      } catch (e) {}
    }
    return () => {
      try {
        audioSynth.stop();
      } catch (e) {}
    };
  }, [isPlaying, isMuted]);

  // Play / Pause Toggle
  const handleTogglePlay = () => {
    if (playerMode === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // If video failed, switch to canvas engine seamlessly
          setPlayerMode('canvas');
          setIsPlaying(true);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    currentTimeRef.current = val;
    if (playerMode === 'video' && videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (playerMode === 'video' && videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  // Fullscreen
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  // Produce & Record Video to MP4
  const handleProduceAndDownload = async () => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordProgress(0);

    try {
      const activeImg = activePosterUrl || project.posterUrl || undefined;
      const result = await renderAndRecordVideo({
        prompt: (currentScene?.description || project.prompt || project.title),
        style: project.style,
        durationSeconds: Math.min(duration, 15),
        fps: project.fps || 30,
        width: project.aspectRatio === '9:16' ? 720 : 1280,
        height: project.aspectRatio === '9:16' ? 1280 : 720,
        backgroundImageUrl: activeImg,
        title: currentScene ? `${project.title} - Escena ${currentScene.sceneNumber}` : project.title,
        cameraMotion: currentScene?.cameraAngle || project.cameraMotion || 'Paneo Suave & Zoom In',
        onProgress: (pct) => setRecordProgress(pct)
      });

      // Update project with blob
      if (onProduceNew) {
        onProduceNew({
          ...project,
          videoUrl: result.blobUrl,
          posterUrl: result.thumbnailUrl
        });
      }

      // Download file directly
      const a = document.createElement('a');
      a.href = result.blobUrl;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (e) {
      console.error('Error producing video:', e);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 flex flex-col select-none ${className}`}
    >
      {/* Top Header Mode Selector */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs shadow-lg">
          <button
            type="button"
            onClick={() => {
              setPlayerMode('canvas');
              setIsPlaying(true);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              playerMode === 'canvas'
                ? 'bg-gradient-to-r from-[#00E5FF] to-blue-500 text-stone-950 shadow-md shadow-cyan-500/25'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Motor Canvas 60 FPS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPlayerMode('video');
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
              setIsPlaying(true);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              playerMode === 'video'
                ? 'bg-[#00E5FF] text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Reproductor MP4</span>
          </button>
        </div>

        {/* Live indicator & Quick Produce MP4 Button */}
        <div className="flex items-center gap-2">
          {isPlaying && (
            <div className="hidden sm:flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>EN VIVO 60 FPS</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleProduceAndDownload}
            disabled={isRecording}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Producir los fotogramas y descargar archivo MP4 a tu dispositivo"
          >
            {isRecording ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Grabando ({recordProgress}%)</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-stone-950" />
                <span>¡MP4 Descargado!</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 text-stone-950" />
                <span>⚡ Descargar Video MP4</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Visual Display Stage (Canvas or Video) */}
      <div
        className="relative aspect-video w-full bg-[#02050E] flex items-center justify-center overflow-hidden cursor-pointer group"
        onClick={handleTogglePlay}
      >
        {playerMode === 'canvas' ? (
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            key={project.id + '-' + project.videoUrl + '-' + activeSceneIndex}
            src={project.videoUrl}
            poster={activePosterUrl}
            loop
            playsInline
            muted={isMuted}
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onEnded={() => {
              if (isMovieMode && movieScenes.length > 1) {
                setActiveSceneIndex(prev => (prev + 1) % movieScenes.length);
              } else {
                setIsPlaying(false);
              }
            }}
            onError={() => {
              // Seamlessly fallback to canvas engine if video source fails
              setPlayerMode('canvas');
              setIsPlaying(true);
            }}
            className="w-full h-full object-contain"
          />
        )}

        {/* Cinematic Subtitles / Dialogue Overlay for Movies */}
        {showSubtitles && (currentScene?.dialogue || currentScene?.description) && (
          <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none flex justify-center">
            <div className="bg-black/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-cyan-500/40 max-w-xl text-center shadow-2xl animate-in fade-in slide-in-from-bottom-2">
              {currentScene.speaker && (
                <span className="text-[10px] font-mono font-black text-[#00E5FF] uppercase block tracking-wider mb-0.5">
                  {currentScene.speaker}:
                </span>
              )}
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed drop-shadow-md">
                "{currentScene.dialogue || currentScene.description}"
              </p>
            </div>
          </div>
        )}

        {/* Center Play Button Overlay if Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePlay();
              }}
              className="w-16 h-16 rounded-full bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 flex items-center justify-center shadow-2xl shadow-cyan-500/60 hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Multi-Scene Timeline Switcher (For Movie Mode) */}
      {isMovieMode && movieScenes.length > 0 && (
        <div className="bg-[#070D1E] border-t border-cyan-900/50 p-2 px-3 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
              <Film className="w-3 h-3 text-[#00E5FF]" />
              Escenas:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {movieScenes.map((sc, idx) => (
              <button
                key={sc.sceneNumber || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSceneIndex(idx);
                  setCurrentTime(0);
                  currentTimeRef.current = 0;
                  setIsPlaying(true);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  activeSceneIndex === idx
                    ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/30'
                    : 'bg-[#0A162C] text-stone-300 hover:text-white border border-cyan-900/50'
                }`}
              >
                <span>Acto {idx + 1}:</span>
                <span className="truncate max-w-[100px]">{sc.title}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveSceneIndex(prev => Math.max(0, prev - 1));
              }}
              disabled={activeSceneIndex === 0}
              className="p-1 rounded-lg bg-stone-900 hover:bg-cyan-950 text-stone-300 disabled:opacity-30 cursor-pointer"
              title="Escena anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveSceneIndex(prev => Math.min(movieScenes.length - 1, prev + 1));
              }}
              disabled={activeSceneIndex === movieScenes.length - 1}
              className="p-1 rounded-lg bg-stone-900 hover:bg-cyan-950 text-stone-300 disabled:opacity-30 cursor-pointer"
              title="Siguiente escena"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Modern Control Bar */}
      <div className="bg-[#050A14] border-t border-cyan-950/60 p-3 space-y-2.5 z-30">
        {/* Timeline Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-cyan-300 w-10 text-right font-bold">
            {currentTime.toFixed(1)}s
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.05"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
          />
          <span className="text-[11px] font-mono text-stone-400 w-10 font-bold">
            {duration.toFixed(1)}s
          </span>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-3 py-1.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Reproducir</span>
                </>
              )}
            </button>

            {/* Restart */}
            <button
              type="button"
              onClick={() => {
                setCurrentTime(0);
                currentTimeRef.current = 0;
                if (videoRef.current) videoRef.current.currentTime = 0;
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Reiniciar desde el inicio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                !isMuted
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-stone-900 text-stone-400 hover:text-white'
              }`}
              title={isMuted ? 'Activar sonido ambiental sintético' : 'Silenciar'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Subtitles Toggle */}
            <button
              type="button"
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                showSubtitles
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                  : 'bg-stone-900 text-stone-400 hover:text-white'
              }`}
              title="Subtítulos / Diálogos de escena"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Subtítulos</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-stone-900/80 p-1 rounded-xl border border-stone-800">
              {[0.5, 1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => {
                    setPlaybackSpeed(spd);
                    if (videoRef.current) videoRef.current.playbackRate = spd;
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-[#00E5FF] text-stone-950'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Pantalla completa"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
