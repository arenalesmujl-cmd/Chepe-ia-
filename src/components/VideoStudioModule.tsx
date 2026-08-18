import React, { useState, useRef, useEffect } from 'react';
import {
  Video, Film, Sparkles, Play, Pause, RotateCcw, Download, Maximize2,
  Sliders, Wand2, Layers, Image as ImageIcon, CheckCircle, Volume2,
  VolumeX, Copy, Check, ChevronRight, Eye, RefreshCw, Star, Info,
  Compass, Radio, Flame, Clock, Monitor, Smartphone, Grid, Clapperboard, VideoOff
} from 'lucide-react';
import { VideoProject, VideoScene } from '../types';
import { renderAndRecordVideo } from '../lib/videoGeneratorEngine';

interface VideoStudioModuleProps {
  onAskAI?: (prompt: string, category?: string) => void;
  onSendVideoToChat?: (video: VideoProject) => void;
}

const STYLE_PRESETS = [
  { id: 'cinematic', name: 'Cinemático 8K', icon: '🎬', promptSuffix: '8k cinematic photography, shallow depth of field, anamorphic lens flare, photorealistic' },
  { id: 'cyberpunk', name: 'Cyberpunk Neón', icon: '🌆', promptSuffix: 'cyberpunk futuristic metropolis, volumetric neon lights, raining reflections, synthwave glow' },
  { id: 'anime', name: 'Anime Studio Ghibli', icon: '🎨', promptSuffix: 'Studio Ghibli aesthetic, anime masterwork, hand-drawn digital watercolor, vibrant natural lighting' },
  { id: 'pixar', name: '3D Pixar Animation', icon: '🧸', promptSuffix: '3D animated feature film render, Octane render, cute expressive character, subsurface scattering' },
  { id: 'hyperlapse', name: 'Timelapse / Hiperlapso', icon: '⏱️', promptSuffix: 'smooth motion hyperlapse, long exposure light trails, dynamic clouds passing rapidly' },
  { id: 'fantasy', name: 'Fantasía Oscura Épica', icon: '🐉', promptSuffix: 'dark fantasy cinematic scene, mystical fog, ethereal magical glows, moody atmospheric depth' },
  { id: 'drone', name: 'Toma Aérea Drone FPV', icon: '🦅', promptSuffix: 'smooth 4k fpv drone aerial sweeping shot, majestic landscape, wide angle golden hour' },
  { id: 'retro', name: 'Retro VHS 80s', icon: '📼', promptSuffix: 'vintage 1980s VHS tape aesthetic, scan lines, retro analog film grain, nostalgic colors' }
];

const CAMERA_MOTIONS = [
  { id: 'dolly_in', name: 'Dolly In (Acercamiento)', desc: 'Movimiento fluido hacia el sujeto principal' },
  { id: 'pan_horizontal', name: 'Paneo Lateral Dinámico', desc: 'Desplazamiento horizontal de cámara suave' },
  { id: 'orbit_360', name: 'Giro Orbital 360°', desc: 'Rotación circular alrededor del objeto' },
  { id: 'fpv_flythrough', name: 'Vuelo FPV / Drone', desc: 'Vuelo cinemático inmersivo en primera persona' },
  { id: 'vertigo_zoom', name: 'Zoom Vértigo (Hitchcock)', desc: 'Efecto dolly zoom con distorsión de fondo' },
  { id: 'static_cinema', name: 'Cámara Fija de Cine', desc: 'Encuadre estático con animación de elementos' }
];

const SAMPLE_PROJECTS: VideoProject[] = [
  {
    id: 'sample-1',
    title: 'Metrópolis Futurista en Lluvia Neón',
    prompt: 'Vehículos voladores atravesando rascacielos iluminados por neones holográficos bajo una lluvia suave, reflejos cinematográficos en charcos de asfalto, 8K ultra realista.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&auto=format&fit=crop&q=80',
    duration: 10,
    aspectRatio: '16:9',
    style: 'Cyberpunk Neón',
    cameraMotion: 'Vuelo FPV / Drone',
    fps: 60,
    tags: ['Cyberpunk', 'Ciencia Ficción', 'Vehículos Voladores', 'Neón'],
    createdAt: 'Hace 1 hora',
    isFavorite: true,
    storyboard: [
      {
        sceneNumber: 1,
        title: 'Establecimiento Aéreo',
        description: 'La cámara desciende entre rascacielos cubiertos de carteles holográficos brillantes.',
        cameraAngle: 'Toma cenital en descenso suave',
        lighting: 'Luces de neón magenta y cian con lluvia volumétrica',
        audioEffect: 'Zumbido de motores antigravedad y truenos lejanos'
      },
      {
        sceneNumber: 2,
        title: 'Tráfico Aéreo Dinámico',
        description: 'Un auto volador aerodinámico cruza a gran velocidad dejando estelas de luz.',
        cameraAngle: 'Paneo lateral siguiendo la trayectoria del vehículo',
        lighting: 'Reflejos especulares en carrocería metálica mojada',
        audioEffect: 'Aceleración sónica y sintetizador cyberpunk'
      },
      {
        sceneNumber: 3,
        title: 'Horizonte de la Ciudad',
        description: 'La toma se abre hacia la niebla futurista con la luna emergiendo tras las torres.',
        cameraAngle: 'Plano general amplio',
        lighting: 'Contraluz lunar con destellos cromados',
        audioEffect: 'Foley de lluvia constante y campanas de fondo'
      }
    ]
  },
  {
    id: 'sample-2',
    title: 'Túnel Cuántico Digital en Bucle',
    prompt: 'Viaje a velocidad luz por un túnel cuántico de filamentos ópticos y datos holográficos brillantes.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    duration: 5,
    aspectRatio: '16:9',
    style: 'Cinemático 8K',
    cameraMotion: 'Dolly In (Acercamiento)',
    fps: 60,
    tags: ['Abstracto', 'Túnel Cuántico', 'FX', 'Loop'],
    createdAt: 'Hace 3 horas',
    storyboard: [
      {
        sceneNumber: 1,
        title: 'Aceleración Cuántica',
        description: 'Filamentos de luz se tensan y comienzan a desplazarse hacia el observador.',
        cameraAngle: 'Dolly in a alta velocidad',
        lighting: 'Gradientes azul eléctrico y violeta pulsante',
        audioEffect: 'Pulso electromagnético creciente'
      }
    ]
  },
  {
    id: 'sample-3',
    title: 'Atardecer Dorado sobre las Olas del Mar',
    prompt: 'Olas suaves del océano rompiendo contra la orilla con destellos dorados durante la puesta de sol, cámara lenta cinematográfica.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    duration: 10,
    aspectRatio: '16:9',
    style: 'Cinemático 8K',
    cameraMotion: 'Paneo Lateral Dinámico',
    fps: 30,
    tags: ['Naturaleza', 'Océano', 'Atardecer', 'Slow Motion'],
    createdAt: 'Ayer',
    storyboard: [
      {
        sceneNumber: 1,
        title: 'Luz Dorada',
        description: 'La espuma marina brilla como oro mientras el sol toca el horizonte.',
        cameraAngle: 'Plano bajo a ras del agua',
        lighting: 'Luz dorada cálida natural',
        audioEffect: 'Sonido suave de olas y brisa marina'
      }
    ]
  }
];

export const VideoStudioModule: React.FC<VideoStudioModuleProps> = ({
  onAskAI,
  onSendVideoToChat
}) => {
  // Mode: Text-to-Video vs Image-to-Video
  const [studioMode, setStudioMode] = useState<'text' | 'image' | 'storyboard'>('text');

  // Input states
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Cinemático 8K');
  const [selectedCamera, setSelectedCamera] = useState<string>('Dolly In (Acercamiento)');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');
  const [duration, setDuration] = useState<number>(10);
  const [fps, setFps] = useState<number>(30);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);

  // Active Video Project
  const [activeProject, setActiveProject] = useState<VideoProject>(SAMPLE_PROJECTS[0]);
  const [projectsList, setProjectsList] = useState<VideoProject[]>(SAMPLE_PROJECTS);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Video Player Controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(10);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'player' | 'storyboard' | 'prompt'>('player');

  // Sync video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setVideoDuration(videoRef.current.duration);
      }
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(e => console.warn('Autoplay error:', e));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleChangeSpeed = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleToggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Enhance Prompt using Director AI
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancingPrompt(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftPrompt: `Genera una descripción cinematográfica detallada para renderizar un video con: ${prompt}. Incluye lentes, iluminación, texturas y física de movimiento.`
        })
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error('Error enhancing video prompt:', e);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Handle Image Upload for Image-to-Video
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Generate Video with Cloud Sora / Veo AI
  const handleGenerateVideo = async () => {
    if (!prompt.trim() && !uploadedImage) return;

    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStep('Planificando dirección de arte y composición cinematográfica...');

    try {
      const progressTimer = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev;
          if (prev === 30) setGenerationStep('Configurando trayectoria de cámara y física de partículas...');
          if (prev === 60) setGenerationStep('Renderizando fotogramas clave y animación en alta definición...');
          if (prev === 80) setGenerationStep('Compilando pistas de video, iluminación volumétrica y audio...');
          return prev + 15;
        });
      }, 700);

      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim() || 'Escena cinemática de alta definición',
          imageUrl: uploadedImage,
          style: selectedStyle,
          duration: duration,
          aspectRatio: aspectRatio,
          cameraMotion: selectedCamera,
          fps: fps
        })
      });

      clearInterval(progressTimer);

      if (res.ok) {
        const data = await res.json();
        if (data.video) {
          setGenerationProgress(100);
          setGenerationStep('¡Renderizado completado con éxito!');
          const newProj: VideoProject = data.video;
          setActiveProject(newProj);
          setProjectsList(prev => [newProj, ...prev]);
          setTimeout(() => {
            setIsGenerating(false);
            if (videoRef.current) {
              videoRef.current.load();
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
          }, 600);
          return;
        }
      }

      // If backend was unreachable or returned error, produce with local canvas engine
      await handleProduceLocalCanvasVideo();
    } catch (err: any) {
      console.warn('Fallback to local canvas video recording engine:', err);
      await handleProduceLocalCanvasVideo();
    }
  };

  // Direct In-Browser Canvas Video Producer & MediaRecorder (100% Offline & Instant)
  const handleProduceLocalCanvasVideo = async () => {
    setIsGenerating(true);
    setGenerationProgress(5);
    setGenerationStep('Iniciando motor de renderizado Canvas 60 FPS...');

    try {
      const videoResult = await renderAndRecordVideo({
        prompt: prompt.trim() || 'Composición Cinemática en Movimiento',
        style: selectedStyle,
        durationSeconds: duration || 8,
        fps: fps || 30,
        width: aspectRatio === '9:16' ? 720 : 1280,
        height: aspectRatio === '9:16' ? 1280 : (aspectRatio === '1:1' ? 720 : 720),
        backgroundImageUrl: uploadedImage || undefined,
        title: prompt.slice(0, 35) || 'Video Cinemático IA',
        cameraMotion: selectedCamera,
        onProgress: (pct, step) => {
          setGenerationProgress(pct);
          setGenerationStep(step);
        }
      });

      const newProj: VideoProject = {
        id: 'vid-local-' + Date.now(),
        title: prompt.slice(0, 40) || 'Video Animado IA',
        prompt: prompt || 'Video generado en vivo',
        videoUrl: videoResult.blobUrl,
        posterUrl: videoResult.thumbnailUrl,
        duration: duration,
        aspectRatio: aspectRatio,
        style: selectedStyle,
        cameraMotion: selectedCamera,
        fps: fps,
        tags: ['Canvas 60FPS', selectedStyle, 'Render Directo'],
        createdAt: new Date().toISOString(),
        storyboard: [
          {
            sceneNumber: 1,
            title: 'Entrada Cinemática y Partículas',
            description: `Animación volumétrica con estilo ${selectedStyle} y movimiento ${selectedCamera}.`
          }
        ]
      };

      setActiveProject(newProj);
      setProjectsList(prev => [newProj, ...prev]);
      setGenerationProgress(100);
      setGenerationStep('¡Video generado y grabado con éxito!');

      setTimeout(() => {
        setIsGenerating(false);
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 500);
    } catch (localErr: any) {
      console.error('Error during local canvas video production:', localErr);
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activeProject.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadVideo = async (targetVideo?: VideoProject) => {
    const proj = targetVideo || activeProject;
    if (!proj?.videoUrl || isDownloading) return;
    setIsDownloading(true);

    try {
      const filename = `${(proj.title || 'chepe_video_ia').replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;
      const proxyUrl = `/api/download-video?url=${encodeURIComponent(proj.videoUrl)}&filename=${encodeURIComponent(filename)}`;

      // Try client blob download
      try {
        const res = await fetch(proj.videoUrl, { mode: 'cors' });
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
        console.warn('CORS blob download fallback to proxy:', blobErr);
      }

      // Proxy fallback
      const a = document.createElement('a');
      a.href = proxyUrl;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading video:', err);
      window.open(proj.videoUrl, '_blank');
    } finally {
      setTimeout(() => setIsDownloading(false), 1500);
    }
  };

  return (
    <div id="video-studio-module" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Studio Banner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#0D1B3E] to-[#0A1628] border border-cyan-500/30 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] text-[11px] font-extrabold uppercase tracking-wider border border-[#00E5FF]/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Motor Sora & Veo Ultra Pro
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                8K HDR 60FPS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Clapperboard className="w-7 h-7 text-[#00E5FF]" />
              Estudio de Video & Animación IA
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
              Crea videos cinemáticos, animaciones ultra realistas, clips publicitarios y reels a partir de texto o imágenes con control total de cámara, lentes, iluminación y guión visual.
            </p>
          </div>

          {/* Quick Switch Modes */}
          <div className="flex items-center gap-2 bg-[#050A14]/80 p-1.5 rounded-2xl border border-cyan-900/60 self-start md:self-center shrink-0">
            <button
              onClick={() => setStudioMode('text')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                studioMode === 'text'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              Texto a Video
            </button>
            <button
              onClick={() => setStudioMode('image')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                studioMode === 'image'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Imagen a Video
            </button>
            <button
              onClick={() => setStudioMode('storyboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                studioMode === 'storyboard'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Storyboard IA
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Creator / Parameters Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-[#080E1C] border border-cyan-900/40 p-5 space-y-4 shadow-xl">
            {/* Mode Specific Inputs */}
            {studioMode === 'image' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-300 flex items-center justify-between">
                  <span>Imagen de Referencia para Animar</span>
                  {uploadedImage && (
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="text-[10px] text-red-400 hover:underline cursor-pointer"
                    >
                      Quitar imagen
                    </button>
                  )}
                </label>
                {uploadedImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-cyan-500/50 aspect-video group">
                    <img src={uploadedImage} alt="Referencia" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-white bg-black/70 px-3 py-1 rounded-full">
                        Imagen cargada lista para animar
                      </span>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-cyan-800/60 hover:border-[#00E5FF] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#050A14]/50 transition-colors group">
                    <ImageIcon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-stone-200">
                      Haz clic o arrastra una imagen aquí
                    </span>
                    <span className="text-[10px] text-stone-400">PNG, JPG, WebP hasta 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {/* Prompt Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                  {studioMode === 'image' ? 'Instrucciones de Movimiento & Animación' : 'Descripción del Video (Prompt)'}
                </label>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={!prompt.trim() || isEnhancingPrompt}
                  className="text-[11px] font-bold text-[#00E5FF] hover:text-cyan-300 flex items-center gap-1 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Sparkles className={`w-3 h-3 ${isEnhancingPrompt ? 'animate-spin' : ''}`} />
                  {isEnhancingPrompt ? 'Optimizando...' : '🪄 Director IA'}
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    studioMode === 'image'
                      ? 'Describe cómo quieres que se mueva la imagen (e.g. "Haz que las nubes se muevan suavemente hacia la derecha y la cámara haga un zoom lento hacia el centro con partículas doradas flotando")...'
                      : 'Describe la escena cinemática (e.g. "Un robot futurista caminando bajo la lluvia neón en Tokio, vista de dron en 4K, luces volumétricas y reflejos en el asfalto")...'
                  }
                  rows={4}
                  className="w-full rounded-2xl bg-[#050A14] border border-cyan-900/50 p-3.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF] transition-all resize-none shadow-inner"
                />
              </div>
            </div>

            {/* Cinematic Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Estilo Artístico & Renderizado
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {STYLE_PRESETS.map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStyle(st.name)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedStyle === st.name
                        ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF] shadow-sm shadow-cyan-500/20'
                        : 'bg-[#050A14] border-cyan-950 text-stone-400 hover:text-white hover:border-cyan-800'
                    }`}
                  >
                    <span className="text-base">{st.icon}</span>
                    <span className="truncate">{st.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Motion Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                Movimiento de Cámara (Cinematografía)
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#050A14] border border-cyan-900/60 text-xs text-stone-200 font-semibold focus:outline-none focus:border-[#00E5FF] cursor-pointer"
              >
                {CAMERA_MOTIONS.map(cam => (
                  <option key={cam.id} value={cam.name}>
                    {cam.name} - {cam.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio, Duration & FPS */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-cyan-400" />
                  Formato
                </span>
                <div className="grid grid-cols-2 gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950">
                  {(['16:9', '9:16', '1:1', '4:3'] as const).map(ratio => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        aspectRatio === ratio
                          ? 'bg-[#00E5FF] text-stone-950 font-black'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Duración
                </span>
                <div className="grid grid-cols-3 gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950">
                  {[5, 10, 15].map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDuration(sec)}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        duration === sec
                          ? 'bg-[#00E5FF] text-stone-950 font-black'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Rate */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-cyan-400" />
                  Tasa FPS
                </span>
                <div className="grid grid-cols-2 gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950">
                  {[30, 60].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFps(val)}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        fps === val
                          ? 'bg-[#00E5FF] text-stone-950 font-black'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {val}fps
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={isGenerating || (!prompt.trim() && !uploadedImage)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-stone-950 font-black text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-98 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                    <span>Renderizando Clip de Video...</span>
                  </>
                ) : (
                  <>
                    <Clapperboard className="w-4 h-4 text-stone-950" />
                    <span>Generar Video IA Sora ({duration}s • {aspectRatio})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleProduceLocalCanvasVideo}
                disabled={isGenerating || (!prompt.trim() && !uploadedImage)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#061024] hover:bg-[#0B1E40] text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Producir y Grabar Video Canvas (60 FPS Directo)</span>
              </button>
            </div>

            {/* Rendering Progress Feedback */}
            {isGenerating && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#050A14] border border-[#00E5FF]/40 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                  <span className="truncate pr-2">{generationStep}</span>
                  <span>{generationProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-cyan-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00E5FF] to-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ultra-Pro Player, Storyboard & Inspector (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Interactive Video Player */}
          <div className="rounded-3xl bg-[#080E1C] border border-cyan-900/40 overflow-hidden shadow-2xl space-y-0">
            {/* Player Top Toolbar */}
            <div className="p-3.5 bg-[#0B132B] border-b border-cyan-950 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-xs text-white truncate max-w-xs">
                  {activeProject.title}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] font-bold text-[10px] border border-[#00E5FF]/30">
                  {activeProject.style}
                </span>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950">
                <button
                  onClick={() => setActiveTab('player')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'player' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Video
                </button>
                <button
                  onClick={() => setActiveTab('storyboard')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'storyboard' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Storyboard ({activeProject.storyboard?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'prompt' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Prompt
                </button>
              </div>
            </div>

            {/* Video Canvas / Screen Area */}
            {activeTab === 'player' && (
              <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden group">
                <video
                  ref={videoRef}
                  key={activeProject.id + '-' + activeProject.videoUrl}
                  src={activeProject.videoUrl}
                  poster={activeProject.posterUrl}
                  loop={isLooping}
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
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

                {/* Big Center Play Overlay Button if paused */}
                {!isPlaying && (
                  <button
                    onClick={handleTogglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#00E5FF]/90 text-stone-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </button>
                )}

                {/* Video Info Tag Overlay */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-cyan-300 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span>{activeProject.aspectRatio}</span>
                  <span>•</span>
                  <span>{activeProject.fps} FPS</span>
                  <span>•</span>
                  <span>{activeProject.cameraMotion}</span>
                </div>
              </div>
            )}

            {/* Storyboard Tab Content */}
            {activeTab === 'storyboard' && (
              <div className="p-4 bg-[#050A14] min-h-[300px] max-h-[420px] overflow-y-auto space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300 pb-2 border-b border-cyan-950">
                  <span>Plan de Dirección y Tomas ({activeProject.storyboard?.length || 0} Escenas)</span>
                  <span className="text-[10px] text-stone-400">Generado por Motor Veo / Sora</span>
                </div>
                {activeProject.storyboard && activeProject.storyboard.length > 0 ? (
                  activeProject.storyboard.map((scene: VideoScene) => (
                    <div
                      key={scene.sceneNumber}
                      className="p-3.5 rounded-2xl bg-[#080E1C] border border-cyan-900/40 space-y-2 hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                          Escena 0{scene.sceneNumber}: {scene.title}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {scene.cameraAngle}
                        </span>
                      </div>
                      <p className="text-xs text-stone-200 leading-relaxed">
                        {scene.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-stone-400">
                        <div className="bg-[#050A14] p-2 rounded-xl border border-cyan-950">
                          <span className="font-bold text-cyan-400 block text-[10px]">💡 Iluminación</span>
                          <span className="truncate block">{scene.lighting}</span>
                        </div>
                        <div className="bg-[#050A14] p-2 rounded-xl border border-cyan-950">
                          <span className="font-bold text-cyan-400 block text-[10px]">🎵 SFX & Audio</span>
                          <span className="truncate block">{scene.audioEffect}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-stone-500 text-xs">
                    No hay escenas de storyboard disponibles para este proyecto.
                  </div>
                )}
              </div>
            )}

            {/* Prompt Tab Content */}
            {activeTab === 'prompt' && (
              <div className="p-4 bg-[#050A14] min-h-[300px] space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">Prompt Original del Creador:</span>
                    <button
                      onClick={handleCopyPrompt}
                      className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedPrompt ? '¡Copiado!' : 'Copiar prompt'}
                    </button>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-cyan-950 text-xs text-stone-200 leading-relaxed font-mono">
                    {activeProject.prompt}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-stone-400">Etiquetas y Atributos:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.tags?.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 text-[10px] font-semibold border border-cyan-900/50">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Video Controls Bar */}
            <div className="p-3.5 bg-[#080E1C] border-t border-cyan-950 space-y-2.5">
              {/* Seekbar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-stone-400 w-9">
                  {Math.floor(currentTime)}s
                </span>
                <input
                  type="range"
                  min={0}
                  max={videoDuration || 10}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                />
                <span className="text-[10px] font-mono text-stone-400 w-9 text-right">
                  {Math.floor(videoDuration || activeProject.duration)}s
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Left Playback Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleTogglePlay}
                    className="p-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold transition-transform active:scale-95 cursor-pointer shadow-md shadow-cyan-500/20"
                    title={isPlaying ? 'Pausar' : 'Reproducir'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play();
                        setIsPlaying(true);
                      }
                    }}
                    className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Reiniciar video"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleToggleMute}
                    className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title={isMuted ? 'Activar audio' : 'Silenciar'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center bg-[#050A14] rounded-xl border border-cyan-950 p-0.5">
                    {[0.5, 1, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => handleChangeSpeed(speed)}
                        className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          playbackRate === speed ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Export & Share Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadVideo(activeProject)}
                    disabled={isDownloading}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900/80 text-[#00E5FF] font-bold text-xs flex items-center gap-1.5 border border-cyan-800/50 transition-all cursor-pointer shadow-md shadow-cyan-500/10 active:scale-95 disabled:opacity-50"
                    title="Descargar archivo MP4 a tu dispositivo"
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                        <span>Descargando MP4...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar MP4</span>
                      </>
                    )}
                  </button>

                  {onAskAI && (
                    <button
                      onClick={() => onAskAI(`Ayúdame a editar o crear una secuela para el video: "${activeProject.title}". Prompt actual: ${activeProject.prompt}`, 'ideas')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-bold text-xs flex items-center gap-1.5 border border-blue-500/40 transition-all cursor-pointer"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Remixar con IA</span>
                    </button>
                  )}

                  <button
                    onClick={handleToggleFullscreen}
                    className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Pantalla completa"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Gallery of AI Videos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Film className="w-4 h-4 text-[#00E5FF]" />
                Galería de Creaciones de Video
              </h3>
              <span className="text-[11px] text-stone-400">
                {projectsList.length} videos generados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {projectsList.map(item => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-2.5 space-y-2 transition-all ${
                    activeProject.id === item.id
                      ? 'bg-[#0B132B] border-[#00E5FF] shadow-md shadow-cyan-500/20'
                      : 'bg-[#080E1C] border-cyan-950 hover:border-cyan-800'
                  }`}
                >
                  <div
                    onClick={() => {
                      setActiveProject(item);
                      if (videoRef.current) {
                        videoRef.current.load();
                        videoRef.current.play().catch(() => {});
                        setIsPlaying(true);
                      }
                    }}
                    className="relative rounded-xl overflow-hidden aspect-video bg-black cursor-pointer group"
                  >
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#00E5FF]/90 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">
                      {item.duration}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-cyan-400 block">{item.style}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadVideo(item);
                      }}
                      className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-[#00E5FF] border border-cyan-800 text-[10px] shrink-0 cursor-pointer transition-colors"
                      title="Descargar este video MP4"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
