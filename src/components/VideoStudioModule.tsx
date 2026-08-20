import React, { useState, useRef, useEffect } from 'react';
import {
  Video, Film, Sparkles, Play, Pause, RotateCcw, Download, Maximize2,
  Sliders, Wand2, Layers, Image as ImageIcon, CheckCircle, Volume2,
  VolumeX, Copy, Check, ChevronRight, Eye, RefreshCw, Star, Info,
  Compass, Radio, Flame, Clock, Monitor, Smartphone, Grid, Clapperboard, VideoOff,
  Users, Music, BookOpen, ChevronLeft, Plus, Trash2, AlertCircle, FastForward,
  Share2, ArrowRight
} from 'lucide-react';
import { VideoProject, VideoScene, MovieScene, CharacterProfile } from '../types';
import { renderAndRecordVideo } from '../lib/videoGeneratorEngine';
import { CinematicCanvasPlayer } from './CinematicCanvasPlayer';

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

const MOVIE_GENRES = [
  'Ciencia Ficción Épica',
  'Animación & Aventura',
  'Cyberpunk Noir',
  'Fantasía Mística',
  'Acción & Suspenso',
  'Terror Psicológico',
  'Documental Naturaleza 8K',
  'Drama Cinemático'
];

const SAMPLE_PROJECTS: VideoProject[] = [
  {
    id: 'sample-movie-1',
    title: 'El Felino Galáctico: Guardián de las Estrellas',
    prompt: 'Un gato callejero con un collar cuántico viaja por nebulosas estelares defendiendo civilizaciones antiguas.',
    videoUrl: '',
    posterUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&auto=format&fit=crop&q=80',
    duration: 32,
    aspectRatio: '16:9',
    resolution: '720p',
    style: 'Anime Studio Ghibli',
    cameraMotion: 'Vuelo FPV / Drone',
    fps: 60,
    isMovie: true,
    genre: 'Animación & Aventura',
    synopsis: 'Orion, un felino callejero de Tokio, tropieza con una gema cuántica que lo transporta a los confines de la galaxia Andrómeda, donde debe unir fuerzas con robots astrónomos para salvar el Sol Central.',
    tags: ['Película Veo', 'Gatos', 'Espacio', 'Aventura', 'Ghibli'],
    createdAt: 'Reciente',
    isFavorite: true,
    cast: [
      { name: 'Orion', role: 'El Gato Guardián Cuántico', description: 'Gato atigrado con inteligencia sobrehumana y botas gravitatorias', avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=80' },
      { name: 'Kira-9', role: 'Androide de Navegación', description: 'Inteligencia artificial que guía la nave estelar', avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80' }
    ],
    characters: [
      { id: 'c1', name: 'Orion', description: 'Gato atigrado con traje espacial blanco y botas gravitatorias' },
      { id: 'c2', name: 'Kira-9', description: 'Androide holográfica con visor cian brillante' }
    ],
    soundtrack: {
      title: 'Sinfonía Cósmica de las Siete Lunas',
      composer: 'Maestro IA Orquestal',
      mood: 'Épico, emotivo y celestial con coros sintetizados'
    },
    movieScenes: [
      {
        sceneNumber: 1,
        title: 'El Descubrimiento en el Callejón',
        location: 'Callejón neón en Shibuya, Tokio',
        characters: ['Orion'],
        action: 'Orion camina bajo la lluvia y encuentra un cristal brillante pulsante en el suelo.',
        description: 'Bajo la lluvia neón de Shibuya, Orion encuentra un cristal flotante que emite pulsos de luz violeta.',
        visualPrompt: 'Cute cat in Tokyo neon rain alley touching glowing purple crystal gem, cinematic lighting, 8k',
        videoPrompt: 'Cinematic shot of a cute tabby cat wearing a tiny reflective collar in a rainy Tokyo alley with bright neon reflections, touching a glowing pulsating purple energy crystal, camera dollies in smoothly, photorealistic 8k, volumetric lighting',
        cameraAngle: 'Plano bajo a nivel del suelo',
        lighting: 'Neones cian y púrpura reflejados en charcos',
        audioEffect: 'Goteo de lluvia y zumbido armónico de cristal',
        sceneDuration: 8,
        speaker: 'Orion (Pensamiento)',
        dialogue: 'No era una joya ordinaria... el universo entero latía dentro de ella.',
        posterUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&auto=format&fit=crop&q=80',
        status: 'idle'
      },
      {
        sceneNumber: 2,
        title: 'Salto al Hiperespacio Interestelar',
        location: 'Vórtice cósmico sobre la atmósfera',
        characters: ['Orion', 'Kira-9'],
        action: 'El cristal se activa disparando un torrente de energía que impulsa al héroe a través de una nebulosa.',
        description: 'El cristal se activa disparando un vórtice gravitacional que eleva al gato hacia una aurora cósmica.',
        visualPrompt: 'Heroic cat floating in cosmic hyperdrive nebula space, stars streaks, anime fantasy art style',
        videoPrompt: 'Heroic cat wearing a sleek white astronaut suit floating peacefully in a cosmic nebula with purple and turquoise stars streaking by, dynamic hyperdrive acceleration, 8k render, Studio Ghibli inspired cinematic art',
        cameraAngle: 'Dolly in dinámico a gran velocidad',
        lighting: 'Destellos de plasma turquesa y estrellas fugaces',
        audioEffect: 'Rugido de salto cuántico y arpegios celestiales',
        sceneDuration: 8,
        speaker: 'Kira-9',
        dialogue: 'Coordenadas fijadas: Sector Andrómeda 7. Bienvenido a bordo, Guardián.',
        posterUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=1200&auto=format&fit=crop&q=80',
        status: 'idle'
      },
      {
        sceneNumber: 3,
        title: 'La Ciudadela Flotante de Cristal',
        location: 'Palacio celestial sobre nubes de gas esmeralda',
        characters: ['Orion'],
        action: 'Llegada a las torres flotantes sobre nubes cósmicas donde aguardan los sabios estelares.',
        description: 'Llegada a las torres flotantes sobre nubes de gas esmeralda donde se reúnen los sabios de la galaxia.',
        visualPrompt: 'Majestic futuristic crystal palace floating in emerald nebula clouds, epic scale, Studio Ghibli style',
        videoPrompt: 'Sweeping drone aerial pan of colossal floating crystal spires above vibrant emerald nebula clouds, cinematic majestic scale, soft golden double-sun lighting, 8k masterpiece',
        cameraAngle: 'Paneo panorámico majestuoso',
        lighting: 'Luz solar doble dorada y turquesa',
        audioEffect: 'Campanas de viento etéreas y cuerdas sinfónicas',
        sceneDuration: 8,
        speaker: 'Sabio de Cristal',
        dialogue: 'La profecía se ha cumplido. El Guardián de cuatro patas ha llegado.',
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
        status: 'idle'
      },
      {
        sceneNumber: 4,
        title: 'El Destino del Sol Central',
        location: 'Cámara del reactor solar cósmico',
        characters: ['Orion'],
        action: 'Orion deposita el cristal en el núcleo, desatando una oleada dorada de vida interestelar.',
        description: 'Orion coloca el cristal en el reactor solar restaurando la luz y la vida en miles de mundos.',
        visualPrompt: 'Hero cat standing triumphantly in front of blazing golden star core, majestic energy waves, 8k wallpaper',
        videoPrompt: 'Heroic cat with glowing golden suit standing triumphantly before a colossal blazing golden star core, massive waves of radiant warm energy pulsing outward, 360 orbital camera rotation, ultra high definition 8k',
        cameraAngle: 'Giro orbital 360° triunfal',
        lighting: 'Explosión de luz dorada resplandeciente',
        audioEffect: 'Crescendo orquestal triunfante con coro celestial',
        sceneDuration: 8,
        speaker: 'Orion',
        dialogue: 'Mientras brillen las estrellas, ningún rincón del cosmos quedará en la oscuridad.',
        posterUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1200&auto=format&fit=crop&q=80',
        status: 'idle'
      }
    ]
  }
];

export const VideoStudioModule: React.FC<VideoStudioModuleProps> = ({
  onAskAI,
  onSendVideoToChat
}) => {
  // Mode: Movie Generator vs Single Clip vs Image-to-Video vs Extender vs Storyboard
  const [studioMode, setStudioMode] = useState<'movie' | 'text' | 'image' | 'extend' | 'storyboard'>('movie');

  // Input states
  const [prompt, setPrompt] = useState<string>('Un gato explorador con traje espacial en Marte descubriendo un cristal de energía ancestral');
  const [selectedStyle, setSelectedStyle] = useState<string>('Cinemático 8K');
  const [selectedCamera, setSelectedCamera] = useState<string>('Dolly In (Acercamiento)');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [duration, setDuration] = useState<number>(5);
  const [fps, setFps] = useState<number>(30);
  const [audioPrompt, setAudioPrompt] = useState<string>('Banda sonora épica orquestal, sintetizadores espaciales y efectos de viento cósmico');

  // Image to Video State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Reference Images for Character/Style Consistency (Up to 3)
  const [referenceImages, setReferenceImages] = useState<Array<{ id: string; base64: string; name: string }>>([]);

  // Character Consistency State
  const [characters, setCharacters] = useState<CharacterProfile[]>([
    { id: 'c1', name: 'Leo', description: 'Joven explorador con chaqueta azul marino y visor holográfico' },
    { id: 'c2', name: 'Aria', description: 'Piloto estelar con traje blanco y detalles dorados' }
  ]);
  const [newCharName, setNewCharName] = useState<string>('');
  const [newCharDesc, setNewCharDesc] = useState<string>('');
  const [showCharacterModal, setShowCharacterModal] = useState<boolean>(false);

  // Movie specific states
  const [movieGenre, setMovieGenre] = useState<string>('Animación & Aventura');
  const [sceneCount, setSceneCount] = useState<number>(4);

  // Video Extension State
  const [extendPrompt, setExtendPrompt] = useState<string>('Continúa la toma ingresando dentro de la estructura misteriosa con luz brillante');

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingSceneNumber, setGeneratingSceneNumber] = useState<number | null>(null);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);

  // Helper to parse errors into user-friendly messages
  const parseVideoErrorMessage = (err: any): string => {
    if (!err) return 'La escena no pudo generarse.';
    let rawStr = '';
    if (typeof err === 'string') {
      rawStr = err;
    } else if (err.message) {
      rawStr = err.message;
    } else {
      rawStr = JSON.stringify(err);
    }

    // Try parsing internal JSON string error
    try {
      const parsed = JSON.parse(rawStr);
      if (parsed?.error?.message) {
        rawStr = parsed.error.message;
      }
    } catch (e) {
      // not a json string
    }

    if (
      rawStr.includes('429') ||
      rawStr.includes('RESOURCE_EXHAUSTED') ||
      rawStr.includes('quota') ||
      rawStr.includes('exceeded your current quota') ||
      rawStr.includes('rate-limit') ||
      rawStr.includes('Rate limit')
    ) {
      return 'Se alcanzó el límite de generación. Intenta nuevamente más tarde.';
    }

    if (rawStr.includes('GEMINI_API_KEY') || rawStr.includes('API key') || rawStr.includes('API_KEY')) {
      return 'Falta configurar GEMINI_API_KEY.';
    }

    if (rawStr.includes('not found') || rawStr.includes('no está disponible') || rawStr.includes('404')) {
      return 'El modelo de video no está disponible para este proyecto.';
    }

    return rawStr.length > 140 ? 'La escena no pudo generarse. Intenta nuevamente.' : rawStr;
  };

  // Active Video Project
  const [activeProject, setActiveProject] = useState<VideoProject>(() => {
    try {
      const saved = localStorage.getItem('chepe_video_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch (e) {}
    return SAMPLE_PROJECTS[0];
  });

  const [projectsList, setProjectsList] = useState<VideoProject[]>(() => {
    try {
      const saved = localStorage.getItem('chepe_video_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SAMPLE_PROJECTS;
  });

  // Selected Scene for preview in Movie Player
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'player' | 'movie-script' | 'storyboard' | 'characters' | 'references' | 'prompt'>('player');

  // Player ref for smooth scrolling
  const playerSectionRef = useRef<HTMLDivElement>(null);

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chepe_video_projects', JSON.stringify(projectsList));
    } catch (e) {}
  }, [projectsList]);

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Reference Image Handler
  const handleAddReferenceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && referenceImages.length < 3) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setReferenceImages(prev => [
          ...prev,
          { id: `ref-${Date.now()}`, base64, name: file.name }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Reference Image
  const handleRemoveReferenceImage = (id: string) => {
    setReferenceImages(prev => prev.filter(r => r.id !== id));
  };

  // Add Character Handler
  const handleAddCharacter = () => {
    if (!newCharName.trim()) return;
    const newChar: CharacterProfile = {
      id: `char-${Date.now()}`,
      name: newCharName.trim(),
      description: newCharDesc.trim() || 'Personaje de la historia'
    };
    setCharacters(prev => [...prev, newChar]);
    setNewCharName('');
    setNewCharDesc('');
  };

  // Remove Character
  const handleRemoveCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  // Enhance prompt with Director AI
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancingPrompt) return;
    setIsEnhancingPrompt(true);

    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          style: selectedStyle,
          type: studioMode === 'movie' ? 'movie' : 'video'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.enhancedPrompt) {
          setPrompt(data.enhancedPrompt);
        }
      }
    } catch (e) {
      console.warn('Enhance prompt fallback:', e);
      setPrompt(prev => `${prev}, 8k resolution, photorealistic cinematic lighting, anamorphic lens flare, masterwork`);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Helper: Poll Veo Video Operation
  const pollVeoOperation = async (
    operationName: string,
    onStatusUpdate?: (step: string, progress: number) => void
  ): Promise<{ videoUrl: string; downloadUrl?: string }> => {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        attempts++;
        const estimatedProgress = Math.min(95, 20 + Math.floor(attempts * 2.5));
        onStatusUpdate?.(
          `Renderizando fotogramas con Veo 3.1 (${attempts * 5}s transcurridos)...`,
          estimatedProgress
        );

        try {
          const res = await fetch('/api/video/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName })
          });

          if (!res.ok) {
            throw new Error(`Error en el servidor de video (${res.status})`);
          }

          const data = await res.json();

          if (data.done) {
            clearInterval(interval);
            if (data.error) {
              reject(new Error(data.error));
            } else if (data.hasVideo && data.videoUrl) {
              resolve({
                videoUrl: data.videoUrl,
                downloadUrl: data.downloadUrl
              });
            } else {
              reject(new Error('La operación finalizó pero no devolvió el archivo de video'));
            }
          }

          if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('Tiempo de espera agotado al renderizar el video'));
          }
        } catch (err: any) {
          clearInterval(interval);
          reject(err);
        }
      }, 5000);
    });
  };

  // 1. Generate Full Movie Storyboard & Scenes
  const handleGenerateMovie = async () => {
    const effectivePrompt = prompt.trim() || 'El misterio del felino cibernético en la ciudad de neón';

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(10);
    setGenerationStep('🎬 Escribiendo guión cinemático, reparto y actos con Director IA (Gemini 3.7 Flash)...');

    try {
      const res = await fetch('/api/video/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: effectivePrompt.slice(0, 45),
          prompt: effectivePrompt,
          genre: movieGenre,
          style: selectedStyle,
          sceneCount: sceneCount,
          aspectRatio: aspectRatio,
          resolution: resolution,
          characters: characters,
          audioPrompt: audioPrompt
        })
      });

      if (!res.ok) {
        throw new Error('Error al contactar el servidor de storyboard');
      }

      const data = await res.json();
      if (!data.movie) {
        throw new Error(data.error || 'No se pudo generar el guión de la película');
      }

      const newMovie: VideoProject = data.movie;
      setActiveProject(newMovie);
      setProjectsList(prev => [newMovie, ...prev.filter(p => p.id !== newMovie.id)]);
      setActiveTab('storyboard');
      setGenerationProgress(30);
      setGenerationStep('✨ Guión generado con éxito. Iniciando producción de escenas de video con Veo 3.1...');

      // Smooth scroll to view
      playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Automatically begin rendering Scene 1 with Veo
      if (newMovie.movieScenes && newMovie.movieScenes.length > 0) {
        await handleGenerateSingleSceneVideo(newMovie, 0);
      } else {
        setIsGenerating(false);
      }
    } catch (err: any) {
      console.error('Error generating movie:', err);
      const friendlyMsg = parseVideoErrorMessage(err);
      setGenerationError(friendlyMsg);
      setRetryAction(() => () => handleGenerateMovie());
      setIsGenerating(false);
    }
  };

  // 2. Generate Video for a Specific Scene in a Movie
  const handleGenerateSingleSceneVideo = async (targetMovie: VideoProject, sceneIndex: number) => {
    const scenes = targetMovie.movieScenes;
    if (!scenes || !scenes[sceneIndex]) return;

    const targetScene = scenes[sceneIndex];
    setGeneratingSceneNumber(targetScene.sceneNumber);
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStep(`🎬 Iniciando generación de Acto ${targetScene.sceneNumber}: "${targetScene.title}" con Veo...`);
    setGenerationProgress(35);

    // Update scene status to generating
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex] = {
      ...targetScene,
      status: 'generating',
      errorMessage: undefined
    };

    const updatedMovie: VideoProject = {
      ...targetMovie,
      movieScenes: updatedScenes
    };
    setActiveProject(updatedMovie);
    setProjectsList(prev => prev.map(p => p.id === updatedMovie.id ? updatedMovie : p));

    try {
      const charDescriptions = characters.length > 0
        ? `Characters: ${characters.map(c => `${c.name} (${c.description})`).join(', ')}. `
        : '';

      const effectiveScenePrompt = targetScene.videoPrompt
        ? `${charDescriptions}${targetScene.videoPrompt}`
        : `${charDescriptions}${targetScene.description}, ${targetScene.cameraAngle || ''}, ${targetScene.lighting || ''}, ${targetMovie.style || 'cinematic 8k'}`;

      // Start generation with Veo
      const genRes = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: effectiveScenePrompt,
          model: 'veo-3.1-generate-preview',
          aspectRatio: targetMovie.aspectRatio === '9:16' ? '9:16' : '16:9',
          resolution: resolution,
          duration: 5,
          referenceImages: referenceImages.map(r => ({ imageBytes: r.base64, mimeType: 'image/png' }))
        })
      });

      const genData = await genRes.json();
      if (!genRes.ok || !genData.success || !genData.operationName) {
        throw new Error(genData.error || 'No se pudo iniciar la generación con el modelo Veo');
      }

      const operationName = genData.operationName;
      setGenerationStep(`⏳ Renderizando Acto ${targetScene.sceneNumber} con Veo 3.1...`);

      // Poll until done
      const pollResult = await pollVeoOperation(operationName, (step, pct) => {
        setGenerationStep(`Acto ${targetScene.sceneNumber}: ${step}`);
        setGenerationProgress(pct);
      });

      // Update scene with real video URL
      const finalScenes = [...(activeProject.movieScenes || updatedScenes)];
      finalScenes[sceneIndex] = {
        ...finalScenes[sceneIndex],
        videoUrl: pollResult.videoUrl,
        operationName: operationName,
        status: 'completed',
        errorMessage: undefined
      };

      const finalMovie: VideoProject = {
        ...activeProject,
        videoUrl: pollResult.videoUrl,
        movieScenes: finalScenes,
        generationStatus: 'completed'
      };

      setActiveProject(finalMovie);
      setProjectsList(prev => prev.map(p => p.id === finalMovie.id ? finalMovie : p));
      setSelectedSceneIndex(sceneIndex);
      setGenerationProgress(100);
      setGenerationStep(`✅ ¡Acto ${targetScene.sceneNumber} completado con éxito!`);

      setTimeout(() => {
        setIsGenerating(false);
        setGeneratingSceneNumber(null);
      }, 1500);
    } catch (err: any) {
      console.error(`Error rendering scene ${targetScene.sceneNumber}:`, err);
      const friendlyMsg = parseVideoErrorMessage(err);
      const failedScenes = [...(activeProject.movieScenes || updatedScenes)];
      failedScenes[sceneIndex] = {
        ...failedScenes[sceneIndex],
        status: 'failed',
        errorMessage: friendlyMsg
      };

      const failedMovie: VideoProject = {
        ...activeProject,
        movieScenes: failedScenes
      };

      setActiveProject(failedMovie);
      setProjectsList(prev => prev.map(p => p.id === failedMovie.id ? failedMovie : p));
      setGenerationError(`Acto ${targetScene.sceneNumber}: ${friendlyMsg}`);
      setRetryAction(() => () => handleGenerateSingleSceneVideo(failedMovie, sceneIndex));
      setIsGenerating(false);
      setGeneratingSceneNumber(null);
    }
  };

  // 3. Generate Single Clip Video (Text-to-Video / Image-to-Video)
  const handleGenerateSingleClip = async () => {
    const effectivePrompt = prompt.trim() || 'Metrópolis Cyberpunk en lluvia neón con autos voladores 8K';

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(15);
    setGenerationStep(
      uploadedImage
        ? '🎨 Animando imagen con Google Veo 3.1...'
        : '🎬 Iniciando generación de clip de video con Veo 3.1...'
    );

    try {
      const charDescriptions = characters.length > 0
        ? `Characters: ${characters.map(c => `${c.name} (${c.description})`).join(', ')}. `
        : '';

      const fullPrompt = `${charDescriptions}${effectivePrompt}, ${selectedStyle}, ${selectedCamera}, ultra high quality, 8k masterpiece`;

      const genRes = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          model: 'veo-3.1-generate-preview',
          aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
          resolution: resolution,
          duration: duration,
          image: uploadedImage ? { imageBytes: uploadedImage, mimeType: 'image/png' } : undefined,
          referenceImages: referenceImages.map(r => ({ imageBytes: r.base64, mimeType: 'image/png' }))
        })
      });

      const genData = await genRes.json();
      if (!genRes.ok || !genData.success || !genData.operationName) {
        throw new Error(genData.error || 'No se pudo iniciar la generación con el modelo Veo');
      }

      const operationName = genData.operationName;
      setGenerationStep('⏳ Renderizando clip de video con Veo 3.1...');

      const pollResult = await pollVeoOperation(operationName, (step, pct) => {
        setGenerationStep(step);
        setGenerationProgress(pct);
      });

      const newProject: VideoProject = {
        id: `vid-${Date.now()}`,
        title: effectivePrompt.slice(0, 40),
        prompt: effectivePrompt,
        videoUrl: pollResult.videoUrl,
        operationName: operationName,
        posterUrl: uploadedImage || `https://image.pollinations.ai/prompt/${encodeURIComponent(effectivePrompt.slice(0, 60))}%20${encodeURIComponent(selectedStyle)}?width=1280&height=720&nologo=true`,
        duration: duration,
        aspectRatio: aspectRatio,
        resolution: resolution,
        style: selectedStyle,
        cameraMotion: selectedCamera,
        fps: fps,
        isMovie: false,
        tags: [selectedStyle, `${duration}s`, 'Veo 3.1'],
        createdAt: 'Ahora mismo',
        isFavorite: true,
        generationStatus: 'completed',
        storyboard: [
          {
            sceneNumber: 1,
            title: 'Toma Cinemática Veo',
            description: effectivePrompt,
            cameraAngle: selectedCamera,
            lighting: selectedStyle,
            videoUrl: pollResult.videoUrl,
            status: 'completed'
          }
        ]
      };

      setActiveProject(newProject);
      setProjectsList(prev => [newProject, ...prev]);
      setActiveTab('player');
      setGenerationProgress(100);
      setGenerationStep('✅ ¡Video generado con Veo 3.1 listo para reproducir!');

      setTimeout(() => {
        playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsGenerating(false);
      }, 1000);
    } catch (err: any) {
      console.error('Error generating clip:', err);
      setGenerationError(err.message || 'Error al generar video');
      setIsGenerating(false);
    }
  };

  // 4. Extend Video
  const handleExtendVideo = async () => {
    if (!activeProject.operationName && !activeProject.videoUrl) {
      setGenerationError('Se requiere un video previo completado para poder extenderlo.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(15);
    setGenerationStep('🎬 Extendiendo video con Veo 3.1...');

    try {
      const res = await fetch('/api/video/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: extendPrompt.trim() || 'Continúa la escena suavemente con movimiento de cámara',
          previousOperationName: activeProject.operationName || '',
          aspectRatio: activeProject.aspectRatio === '9:16' ? '9:16' : '16:9'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.operationName) {
        throw new Error(data.error || 'No se pudo extender el video');
      }

      const pollResult = await pollVeoOperation(data.operationName, (step, pct) => {
        setGenerationStep(step);
        setGenerationProgress(pct);
      });

      const extendedProject: VideoProject = {
        id: `ext-${Date.now()}`,
        title: `${activeProject.title} (Extensión)`,
        prompt: `${activeProject.prompt} -> ${extendPrompt}`,
        videoUrl: pollResult.videoUrl,
        operationName: data.operationName,
        posterUrl: activeProject.posterUrl,
        duration: activeProject.duration + 5,
        aspectRatio: activeProject.aspectRatio,
        style: activeProject.style,
        cameraMotion: activeProject.cameraMotion,
        fps: activeProject.fps,
        tags: [...(activeProject.tags || []), 'Extensión Veo'],
        createdAt: 'Ahora mismo',
        isFavorite: true,
        generationStatus: 'completed'
      };

      setActiveProject(extendedProject);
      setProjectsList(prev => [extendedProject, ...prev]);
      setActiveTab('player');
      setGenerationProgress(100);
      setGenerationStep('✅ ¡Extensión de video completada!');

      setTimeout(() => {
        playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsGenerating(false);
      }, 1000);
    } catch (err: any) {
      console.error('Error extending video:', err);
      setGenerationError(err.message || 'Error al extender video');
      setIsGenerating(false);
    }
  };

  // Direct In-Browser Canvas Video Producer & MediaRecorder fallback
  const handleProduceLocalCanvasVideo = async () => {
    const effectivePrompt = prompt.trim() || activeProject.prompt || 'Metrópolis Cyberpunk en lluvia neón con autos voladores 8K';

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(10);
    setGenerationStep('Iniciando motor de renderizado Canvas 60 FPS...');

    try {
      const videoResult = await renderAndRecordVideo({
        prompt: effectivePrompt,
        style: selectedStyle,
        durationSeconds: duration || 8,
        fps: fps || 30,
        width: aspectRatio === '9:16' ? 720 : 1280,
        height: aspectRatio === '9:16' ? 1280 : 720,
        backgroundImageUrl: uploadedImage || activeProject.posterUrl || undefined,
        title: effectivePrompt.slice(0, 35) || 'Video Cinemático IA',
        cameraMotion: selectedCamera,
        onProgress: (pct, step) => {
          setGenerationProgress(pct);
          setGenerationStep(step);
        }
      });

      const newProj: VideoProject = {
        id: 'vid-local-' + Date.now(),
        title: effectivePrompt.slice(0, 40) || 'Video Animado Canvas',
        prompt: effectivePrompt,
        videoUrl: videoResult.blobUrl,
        posterUrl: videoResult.thumbnailUrl,
        duration: duration,
        aspectRatio: aspectRatio,
        style: selectedStyle,
        cameraMotion: selectedCamera,
        fps: fps,
        tags: ['Canvas 60FPS', selectedStyle, 'Render Directo'],
        createdAt: 'Ahora mismo',
        storyboard: [
          {
            sceneNumber: 1,
            title: 'Entrada Cinemática y Partículas',
            description: `Animación volumétrica con estilo ${selectedStyle} y movimiento ${selectedCamera}.`,
            videoUrl: videoResult.blobUrl,
            status: 'completed'
          }
        ]
      };

      setActiveProject(newProj);
      setProjectsList(prev => [newProj, ...prev]);
      setActiveTab('player');
      setGenerationProgress(100);
      setGenerationStep('¡Video generado y grabado con éxito!');

      setTimeout(() => {
        playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsGenerating(false);
      }, 500);
    } catch (localErr: any) {
      console.error('Error during local canvas video production:', localErr);
      setGenerationError('Error en renderizado Canvas local');
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activeProject.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadVideo = async (targetVideo?: VideoProject, specificUrl?: string) => {
    const proj = targetVideo || activeProject;
    const url = specificUrl || proj?.videoUrl;
    if (!url || isDownloading) return;
    setIsDownloading(true);

    try {
      const filename = `${(proj.title || 'chepe_video_ia').replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;

      try {
        const res = await fetch(url, { mode: 'cors' });
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
      } catch (directErr) {
        console.warn('Direct fetch download fallback to link:', directErr);
      }

      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const currentScene = activeProject.isMovie && activeProject.movieScenes
    ? activeProject.movieScenes[selectedSceneIndex]
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#030712] via-[#08132B] to-[#040C1A] border border-cyan-500/30 p-6 shadow-2xl overflow-hidden">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] text-xs font-black tracking-wider uppercase border border-[#00E5FF]/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Estudio Cinemático & Películas IA
              </span>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                Google Veo 3.1 • Gemini 3.7 Flash
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Generador de Películas y Videos Ultra HD
            </h1>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Crea cortometrajes multi-escena con guión técnico y reparto, genera clips de video con Veo 3.1, o anima fotos y extiende videos directamente a MP4.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-[#050A14] p-1.5 rounded-2xl border border-cyan-900/60 shadow-inner flex-wrap">
            <button
              onClick={() => {
                setStudioMode('movie');
                if (activeProject.isMovie) setActiveTab('player');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                studioMode === 'movie'
                  ? 'bg-gradient-to-r from-[#00E5FF] to-blue-500 text-stone-950 shadow-md shadow-cyan-500/30'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5" />
              🎬 Película Completa IA
            </button>
            <button
              onClick={() => setStudioMode('text')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                studioMode === 'text'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              Clip de Video
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
              onClick={() => setStudioMode('extend')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                studioMode === 'extend'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FastForward className="w-3.5 h-3.5" />
              Extender Video
            </button>
            <button
              onClick={() => {
                setStudioMode('storyboard');
                setActiveTab('storyboard');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                studioMode === 'storyboard'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Storyboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Creator / Parameters Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-[#080E1C] border border-cyan-900/40 p-5 space-y-4 shadow-xl">
            {/* Mode Specific Banner */}
            {studioMode === 'movie' && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF] text-stone-950 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Director de Cine Multi-Escena</h4>
                  <p className="text-[11px] text-cyan-200">
                    Crea storyboard con Gemini 3.7 y produce cada escena con Veo 3.1 manteniendo consistencia de personajes.
                  </p>
                </div>
              </div>
            )}

            {studioMode === 'extend' && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-500/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-400 text-stone-950 flex items-center justify-center shrink-0 shadow-lg">
                  <FastForward className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Modo Extensión de Video</h4>
                  <p className="text-[11px] text-blue-200">
                    Continúa la acción del video seleccionado ("{activeProject.title}") con una nueva toma fluida.
                  </p>
                </div>
              </div>
            )}

            {/* Mode Specific: Image to Video Upload */}
            {studioMode === 'image' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-300 flex items-center justify-between">
                  <span>Imagen de Referencia para Animar (Veo 3.1)</span>
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
                    <span className="text-[10px] text-stone-400">PNG, JPG hasta 10MB</span>
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

            {/* Movie Genre & Scene Count (Only in Movie Mode) */}
            {studioMode === 'movie' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
                    <Film className="w-3.5 h-3.5 text-[#00E5FF]" />
                    Género Fílmico
                  </label>
                  <select
                    value={movieGenre}
                    onChange={(e) => setMovieGenre(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#050A14] border border-cyan-900/60 text-xs text-stone-200 font-semibold focus:outline-none focus:border-[#00E5FF] cursor-pointer"
                  >
                    {MOVIE_GENRES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
                    Número de Actos
                  </label>
                  <div className="grid grid-cols-4 gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950">
                    {[3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSceneCount(num)}
                        className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          sceneCount === num
                            ? 'bg-[#00E5FF] text-stone-950 font-black'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Character Consistency Panel & Reference Images Bar */}
            <div className="p-3 rounded-2xl bg-[#050A14] border border-cyan-950 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#00E5FF]" />
                  Personajes ({characters.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowCharacterModal(!showCharacterModal)}
                  className="text-[11px] text-[#00E5FF] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  {showCharacterModal ? 'Cerrar editor' : 'Gestionar personajes'}
                </button>
              </div>

              {/* Character Chips */}
              <div className="flex flex-wrap gap-1.5">
                {characters.map(c => (
                  <div
                    key={c.id}
                    className="px-2.5 py-1 rounded-xl bg-[#08132B] border border-cyan-500/30 text-white text-[11px] flex items-center gap-1.5"
                  >
                    <span className="font-bold text-[#00E5FF]">{c.name}:</span>
                    <span className="text-stone-300 truncate max-w-[120px]">{c.description}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCharacter(c.id)}
                      className="text-stone-400 hover:text-red-400 ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Character Input Form when modal open */}
              {showCharacterModal && (
                <div className="p-2.5 rounded-xl bg-[#080E1C] border border-cyan-900/60 space-y-2 animate-in fade-in">
                  <input
                    type="text"
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    placeholder="Nombre del personaje (ej: Leo, Dra. Vance)"
                    className="w-full p-2 rounded-lg bg-[#050A14] border border-cyan-950 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                  <input
                    type="text"
                    value={newCharDesc}
                    onChange={(e) => setNewCharDesc(e.target.value)}
                    placeholder="Descripción visual (ej: Chaqueta azul, visor cian, pelo castaño)"
                    className="w-full p-2 rounded-lg bg-[#050A14] border border-cyan-950 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCharacter}
                    disabled={!newCharName.trim()}
                    className="w-full py-1.5 rounded-lg bg-[#00E5FF] text-stone-950 text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    + Agregar Personaje a la Producción
                  </button>
                </div>
              )}

              {/* Reference Images (Up to 3) */}
              <div className="pt-2 border-t border-cyan-950/80 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-cyan-400" />
                  Referencias visuales Veo ({referenceImages.length}/3):
                </span>
                <label className="text-[10px] font-bold text-[#00E5FF] hover:underline cursor-pointer flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  + Agregar referencia
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddReferenceImage}
                    className="hidden"
                    disabled={referenceImages.length >= 3}
                  />
                </label>
              </div>

              {referenceImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {referenceImages.map(ref => (
                    <div key={ref.id} className="relative w-14 h-14 rounded-lg overflow-hidden border border-cyan-500/50 shrink-0 group">
                      <img src={ref.base64} alt={ref.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveReferenceImage(ref.id)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 text-xs font-bold transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prompt Textarea & Fast Suggestion Pills */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                  {studioMode === 'movie'
                    ? 'Argumento / Idea de la Película'
                    : (studioMode === 'extend'
                        ? 'Prompt de Continuación de Escena'
                        : (studioMode === 'image' ? 'Instrucciones de Movimiento & Animación' : 'Descripción del Video (Prompt)'))}
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

              {studioMode === 'extend' ? (
                <textarea
                  value={extendPrompt}
                  onChange={(e) => setExtendPrompt(e.target.value)}
                  placeholder="Describe cómo continúa la escena: 'La cámara avanza lentamente hacia el interior del templo revelando los pilares de luz...'"
                  rows={3}
                  className="w-full rounded-2xl bg-[#050A14] border border-cyan-900/50 p-3.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF] transition-all resize-none shadow-inner"
                />
              ) : (
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    studioMode === 'movie'
                      ? 'Describe la historia: "Un gato astronauta descubre una antigua reliquia en Marte que despierta una civilización alienígena..."'
                      : (studioMode === 'image'
                        ? 'Describe el movimiento: "Zoom suave con partículas doradas y reflejos cinemáticos..."'
                        : 'Describe la escena: "Un coche volador atravesando rascacielos neón bajo la lluvia en Tokio 8K..."')
                  }
                  rows={3}
                  className="w-full rounded-2xl bg-[#050A14] border border-cyan-900/50 p-3.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF] transition-all resize-none shadow-inner"
                />
              )}

              {/* Quick Idea Presets */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400">⚡ Ideas Populares:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Un gato astronauta navegando entre nebulosas y salvando la galaxia',
                    'Metrópolis Cyberpunk en lluvia neón con autos voladores 8K',
                    'Cabaña en bosque mágico de Studio Ghibli con espíritus del agua',
                    'Aventura submarina en las ruinas perdidas de la Atlántida',
                    'Batalla espacial épica de naves estelares en los anillos de Saturno'
                  ].map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(idea)}
                      className="px-2 py-1 rounded-lg bg-[#061226] hover:bg-[#0B2248] text-cyan-300 hover:text-white border border-cyan-900/40 text-[10px] truncate max-w-[220px] transition-all cursor-pointer text-left"
                    >
                      ✨ {idea}
                    </button>
                  ))}
                </div>
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

            {/* Aspect Ratio, Resolution & Duration */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-cyan-400" />
                  Formato
                </span>
                <div className="grid grid-cols-2 gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950">
                  {(['16:9', '9:16'] as const).map(ratio => (
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

              {/* Resolution */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-cyan-400" />
                  Calidad
                </span>
                <div className="grid grid-cols-2 gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950">
                  {(['720p', '1080p'] as const).map(res => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setResolution(res)}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        resolution === res
                          ? 'bg-[#00E5FF] text-stone-950 font-black'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {res}
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
                <div className="grid grid-cols-2 gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950">
                  {[5, 10].map(sec => (
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
            </div>

            {/* Error Message Box */}
            {generationError && (
              <div className="p-3 rounded-2xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Aviso del Estudio de Video:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{generationError}</p>
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGenerationError(null)}
                    className="px-2.5 py-1 rounded-lg bg-red-900/50 hover:bg-red-800 text-[10px] font-bold text-white cursor-pointer"
                  >
                    Entendido
                  </button>
                  <button
                    type="button"
                    onClick={handleProduceLocalCanvasVideo}
                    className="px-2.5 py-1 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-bold cursor-pointer"
                  >
                    Renderizar con Canvas 60FPS
                  </button>
                </div>
              </div>
            )}

            {/* Generate Action Buttons */}
            <div className="space-y-2 pt-1">
              {studioMode === 'movie' ? (
                <button
                  type="button"
                  onClick={handleGenerateMovie}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-stone-950 font-black text-sm shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-98 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                      <span>{generationStep || `Produciendo Película (${sceneCount} Actos)...`}</span>
                    </>
                  ) : (
                    <>
                      <Clapperboard className="w-4 h-4 text-stone-950" />
                      <span>🎬 Producir Película Completa IA ({sceneCount} Actos)</span>
                    </>
                  )}
                </button>
              ) : studioMode === 'extend' ? (
                <button
                  type="button"
                  onClick={handleExtendVideo}
                  disabled={isGenerating || !extendPrompt.trim()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-stone-950 font-black text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-98 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Extendiendo video con Veo 3.1...</span>
                    </>
                  ) : (
                    <>
                      <FastForward className="w-4 h-4 text-stone-950" />
                      <span>Extender Video con Veo 3.1 (+5s)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateSingleClip}
                  disabled={isGenerating || (!prompt.trim() && !uploadedImage)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-stone-950 font-black text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-98 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Renderizando con Veo 3.1...</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4 text-stone-950" />
                      <span>Generar Video Real con Veo 3.1 ({duration}s • {aspectRatio})</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleProduceLocalCanvasVideo}
                disabled={isGenerating || (!prompt.trim() && !uploadedImage)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#061024] hover:bg-[#0B1E40] text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Generar Video Canvas Directo (60 FPS)</span>
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
        <div ref={playerSectionRef} className="lg:col-span-7 space-y-5">
          {/* Main Interactive Video Player */}
          <div className="rounded-3xl bg-[#080E1C] border border-cyan-900/40 overflow-hidden shadow-2xl space-y-0">
            {/* Player Top Toolbar */}
            <div className="p-3.5 bg-[#0B132B] border-b border-cyan-950 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-xs text-white truncate max-w-xs">
                  {activeProject.title}
                </span>
                {activeProject.isMovie && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                    🎬 Película
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] font-bold text-[10px] border border-[#00E5FF]/30">
                  {activeProject.style}
                </span>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950 flex-wrap">
                <button
                  onClick={() => setActiveTab('player')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'player' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Reproductor
                </button>
                {activeProject.isMovie && (
                  <button
                    onClick={() => setActiveTab('movie-script')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeTab === 'movie-script' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Guión & Reparto
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('storyboard')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'storyboard' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Storyboard ({activeProject.movieScenes?.length || activeProject.storyboard?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('characters')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'characters' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Personajes ({characters.length})
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
              <div className="p-2 bg-[#040814]">
                {/* Scene Switcher Bar for Movies */}
                {activeProject.isMovie && activeProject.movieScenes && activeProject.movieScenes.length > 0 && (
                  <div className="mb-2 p-2 bg-[#08132B] rounded-2xl border border-cyan-950 flex items-center justify-between gap-2 overflow-x-auto">
                    <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                      {activeProject.movieScenes.map((sc, idx) => (
                        <button
                          key={sc.sceneNumber || idx}
                          onClick={() => setSelectedSceneIndex(idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                            selectedSceneIndex === idx
                              ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/30'
                              : 'bg-[#050A14] text-stone-300 hover:text-white border border-cyan-900/50'
                          }`}
                        >
                          <span>Acto {idx + 1}:</span>
                          <span className="truncate max-w-[120px]">{sc.title}</span>
                          {sc.videoUrl && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          )}
                        </button>
                      ))}
                    </div>

                    {currentScene && !currentScene.videoUrl && (
                      <button
                        type="button"
                        onClick={() => handleGenerateSingleSceneVideo(activeProject, selectedSceneIndex)}
                        disabled={isGenerating}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-stone-950 text-xs font-black shrink-0 shadow-md flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Generar Video Acto {selectedSceneIndex + 1}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Render Player Engine */}
                <CinematicCanvasPlayer
                  project={{
                    ...activeProject,
                    videoUrl: currentScene?.videoUrl || activeProject.videoUrl
                  }}
                  onProduceNew={(updated) => {
                    setActiveProject(updated);
                    setProjectsList((prev) => [updated, ...prev.filter(x => x.id !== updated.id)]);
                  }}
                />
              </div>
            )}

            {/* Movie Script & Cast Tab Content */}
            {activeTab === 'movie-script' && activeProject.isMovie && (
              <div className="p-4 bg-[#050A14] min-h-[300px] max-h-[460px] overflow-y-auto space-y-4">
                {/* Synopsis */}
                {activeProject.synopsis && (
                  <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-cyan-900/40 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase block">
                      📖 Sinopsis Oficial de la Película
                    </span>
                    <p className="text-xs text-stone-200 leading-relaxed font-serif">
                      "{activeProject.synopsis}"
                    </p>
                  </div>
                )}

                {/* Cast List */}
                {activeProject.cast && activeProject.cast.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#00E5FF]" />
                      Reparto & Personajes Principales:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeProject.cast.map((actorItem, idx) => {
                        const actor = typeof actorItem === 'string'
                          ? { name: actorItem, role: 'Personaje', description: '', avatarUrl: undefined }
                          : actorItem;
                        return (
                          <div key={idx} className="p-2.5 rounded-xl bg-[#080E1C] border border-cyan-950 flex items-center gap-3">
                            {actor.avatarUrl && (
                              <img src={actor.avatarUrl} alt={actor.name} className="w-10 h-10 rounded-full object-cover border border-cyan-500/40 shrink-0" />
                            )}
                            <div className="overflow-hidden">
                              <h5 className="text-xs font-bold text-white truncate">{actor.name}</h5>
                              <span className="text-[10px] text-cyan-400 font-semibold block truncate">{actor.role}</span>
                              {actor.description && (
                                <span className="text-[9px] text-stone-400 line-clamp-1">{actor.description}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Soundtrack Score */}
                {activeProject.soundtrack && (
                  <div className="p-3 rounded-xl bg-[#080E1C] border border-cyan-950 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 block">Banda Sonora Original</span>
                      <h6 className="text-xs font-bold text-white">
                        {typeof activeProject.soundtrack === 'string' ? activeProject.soundtrack : activeProject.soundtrack.title}
                      </h6>
                      {typeof activeProject.soundtrack !== 'string' && activeProject.soundtrack.mood && (
                        <p className="text-[10px] text-stone-400">{activeProject.soundtrack.mood}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Storyboard Tab Content with Individual Scene Controls */}
            {activeTab === 'storyboard' && (
              <div className="p-4 bg-[#050A14] min-h-[300px] max-h-[480px] overflow-y-auto space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300 pb-2 border-b border-cyan-950">
                  <span>Plan de Dirección & Tomas ({activeProject.movieScenes?.length || activeProject.storyboard?.length || 0} Escenas)</span>
                  <span className="text-[10px] text-stone-400">Google Veo 3.1 HD</span>
                </div>

                {/* If movieScenes are present, show visual scene cards with Veo generation buttons */}
                {activeProject.movieScenes && activeProject.movieScenes.length > 0 ? (
                  activeProject.movieScenes.map((scene: MovieScene, idx: number) => (
                    <div
                      key={scene.sceneNumber || idx}
                      className="p-3.5 rounded-2xl bg-[#080E1C] border border-cyan-900/40 space-y-3 hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                            Acto 0{scene.sceneNumber}: {scene.title}
                          </span>
                          {scene.status === 'completed' && scene.videoUrl && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Video Listo
                            </span>
                          )}
                          {scene.status === 'generating' && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40 flex items-center gap-1 animate-pulse">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Generando con Veo...
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {scene.videoUrl ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSceneIndex(idx);
                                  setActiveTab('player');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#00E5FF] text-stone-950 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                Reproducir
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadVideo(activeProject, scene.videoUrl)}
                                className="p-1 rounded-lg bg-cyan-950 text-[#00E5FF] border border-cyan-800 text-[10px] cursor-pointer"
                                title="Descargar MP4 de esta escena"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleGenerateSingleSceneVideo(activeProject, idx)}
                              disabled={isGenerating}
                              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-stone-950 text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              Generar Video Veo
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Scene poster if generated */}
                      {scene.posterUrl && (
                        <div className="relative rounded-xl overflow-hidden aspect-video border border-cyan-950">
                          <img src={scene.posterUrl} alt={scene.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded-md text-[9px] font-mono text-cyan-300">
                            Foto / Fotograma de Acto {scene.sceneNumber}
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-stone-200 leading-relaxed">
                        {scene.description}
                      </p>

                      {scene.dialogue && (
                        <div className="bg-[#050A14] p-2.5 rounded-xl border border-cyan-900/40 text-xs font-serif italic text-cyan-200">
                          <span className="font-sans font-bold text-[#00E5FF] not-italic text-[10px] block mb-0.5">
                            {scene.speaker || 'Personaje'}:
                          </span>
                          "{scene.dialogue}"
                        </div>
                      )}

                      {/* Veo Prompt Inspector */}
                      {scene.videoPrompt && (
                        <div className="p-2 rounded-xl bg-[#050A14] border border-cyan-950 space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 block uppercase">
                            Directiva de Video Veo (Prompt):
                          </span>
                          <p className="text-[10px] text-cyan-300 font-mono line-clamp-2">
                            {scene.videoPrompt}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-stone-400">
                        <div className="bg-[#050A14] p-2 rounded-xl border border-cyan-950">
                          <span className="font-bold text-cyan-400 block text-[10px]">💡 Iluminación</span>
                          <span className="truncate block">{scene.lighting || 'Cinemática'}</span>
                        </div>
                        <div className="bg-[#050A14] p-2 rounded-xl border border-cyan-950">
                          <span className="font-bold text-cyan-400 block text-[10px]">🎥 Cámara</span>
                          <span className="truncate block">{scene.cameraAngle || 'Dolly In'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-stone-500 text-xs">
                    No hay escenas de storyboard disponibles. Haz clic en "🎬 Producir Película Completa IA" para generarlas.
                  </div>
                )}
              </div>
            )}

            {/* Characters Tab Content */}
            {activeTab === 'characters' && (
              <div className="p-4 bg-[#050A14] min-h-[300px] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">Personajes Registrados para Consistencia:</span>
                  <button
                    type="button"
                    onClick={() => setShowCharacterModal(!showCharacterModal)}
                    className="text-xs text-[#00E5FF] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Nuevo Personaje
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {characters.map(char => (
                    <div key={char.id} className="p-3 rounded-2xl bg-[#080E1C] border border-cyan-950 space-y-1.5 relative group">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{char.name}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveCharacter(char.id)}
                          className="text-stone-400 hover:text-red-400 text-xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-300 leading-relaxed">{char.description}</p>
                    </div>
                  ))}
                </div>
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
          </div>

          {/* Quick Gallery of AI Videos & Movies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Film className="w-4 h-4 text-[#00E5FF]" />
                Galería de Creaciones de Video & Películas
              </h3>
              <span className="text-[11px] text-stone-400">
                {projectsList.length} proyectos generados
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
                      setActiveTab('player');
                      playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                    className="relative rounded-xl overflow-hidden aspect-video bg-black cursor-pointer group"
                  >
                    <img
                      src={item.posterUrl || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80'}
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
                    {item.isMovie && (
                      <span className="absolute top-1 left-1 bg-amber-500/90 text-stone-950 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                        🎬 Película
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-cyan-400 block">{item.style}</span>
                    </div>
                    {item.videoUrl && (
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
                    )}
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
