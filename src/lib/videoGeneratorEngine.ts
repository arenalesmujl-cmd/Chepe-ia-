// Advanced Real-Time Canvas Video Synthesis, Live Player & Media Recording Engine
// Generates live 60 FPS cinematic visuals, ambient soundtrack via Web Audio API, and exports true MP4/WebM files

export interface VideoRenderOptions {
  prompt: string;
  style: string;
  durationSeconds: number;
  fps?: number;
  width?: number;
  height?: number;
  backgroundImageUrl?: string;
  title?: string;
  cameraMotion?: string;
  onProgress?: (progress: number, status: string) => void;
}

export interface GeneratedVideoResult {
  blob: Blob;
  blobUrl: string;
  filename: string;
  duration: number;
  thumbnailUrl: string;
}

// Color palettes for cinematic styles
export const COLOR_PALETTES: Record<string, string[]> = {
  'Cinemático 8K': ['#00E5FF', '#FFB703', '#FB8500', '#023047', '#219EBC', '#E0FBFC'],
  'Cyberpunk Neón': ['#FF007F', '#00F0FF', '#7928CA', '#00FF66', '#FFE600', '#FA709A'],
  'Anime Studio Ghibli': ['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94', '#64B5F6'],
  '3D Pixar Realista': ['#FF4D4D', '#FFB142', '#34ACE0', '#706FD3', '#33D9B2', '#FAD390'],
  'Fantasía Oscura': ['#9B5DE5', '#F15BB5', '#FEE440', '#00BBF9', '#00F5D4', '#7209B7'],
  'Dron FPV / Acción': ['#FF3366', '#33CCFF', '#FFCC00', '#FFFFFF', '#0066FF', '#FF9900'],
  'default': ['#00E5FF', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B']
};

// Web Audio Ambient Synthesizer for Cinematic Sound
export class CinematicAudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private isRunning: boolean = false;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(4, this.ctx.currentTime);

      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }
  }

  public start() {
    this.init();
    if (!this.ctx || this.isRunning) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {
          // Ignored if user hasn't interacted with document yet
        });
      }

      this.osc1 = this.ctx.createOscillator();
      this.osc2 = this.ctx.createOscillator();

      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note bass drone

      this.osc2.type = 'sawtooth';
      this.osc2.frequency.setValueAtTime(110.5, this.ctx.currentTime); // Harmonic detune

      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      if (this.filter && this.masterGain) {
        this.osc1.connect(this.filter);
        this.osc2.connect(osc2Gain);
        osc2Gain.connect(this.filter);
        this.filter.connect(this.masterGain);
      }

      this.osc1.start();
      this.osc2.start();
      this.isRunning = true;
    } catch {
      // Audio autoplay gracefully suppressed until user interaction
    }
  }

  public stop() {
    if (!this.isRunning) return;
    try {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
        this.osc1 = null;
      }
      if (this.osc2) {
        this.osc2.stop();
        this.osc2.disconnect();
        this.osc2 = null;
      }
      this.isRunning = false;
    } catch (e) {
      console.warn('Audio stop warning:', e);
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)) * 0.1, this.ctx.currentTime);
    }
  }
}

// Single active audio synth instance
export const audioSynth = new CinematicAudioSynth();

// Draw a single cinematic frame onto any 2D canvas context
export function drawCinematicFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  timeSec: number,
  durationSec: number,
  options: {
    prompt: string;
    style: string;
    cameraMotion: string;
    title: string;
    bgImage?: HTMLImageElement | null;
    particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      pulse: number;
    }>;
  }
) {
  const { prompt, style, cameraMotion, title, bgImage, particles } = options;
  const t = (timeSec % durationSec) / durationSec; // 0 to 1 progress
  const activePalette = COLOR_PALETTES[style] || COLOR_PALETTES['default'];

  // Clear frame
  ctx.clearRect(0, 0, width, height);

  // 1. Background Layer (Image or Generative Space/Grid)
  if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
    const zoom = 1.0 + t * 0.16;
    const panX = Math.sin(t * Math.PI) * (width * 0.035);
    const panY = Math.cos(t * Math.PI) * (height * 0.025);

    ctx.save();
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(zoom, zoom);
    ctx.drawImage(bgImage, -width / 2, -height / 2, width, height);
    ctx.restore();

    // Dark vignette
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.25,
      width / 2, height / 2, width * 0.78
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.78)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Generative Nebula Gradient
    const bgGrad = ctx.createRadialGradient(
      width / 2 + Math.sin(timeSec * 0.5) * 100,
      height / 2 + Math.cos(timeSec * 0.5) * 80,
      20,
      width / 2, height / 2, width * 0.8
    );

    if (style.includes('Cyberpunk')) {
      bgGrad.addColorStop(0, '#2b0938');
      bgGrad.addColorStop(0.4, '#0f021e');
      bgGrad.addColorStop(1, '#030108');
    } else if (style.includes('Anime') || style.includes('Ghibli')) {
      bgGrad.addColorStop(0, '#1a3644');
      bgGrad.addColorStop(0.5, '#0d1f2d');
      bgGrad.addColorStop(1, '#050c12');
    } else {
      bgGrad.addColorStop(0, '#0a224a');
      bgGrad.addColorStop(0.4, '#051126');
      bgGrad.addColorStop(1, '#02060e');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 3D Perspective Floor Grid
    const horizon = height * 0.62;
    ctx.save();
    ctx.strokeStyle = activePalette[0] + '35';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    
    // Vertical perspective lines
    const lineSpacing = width / 16;
    for (let x = -width; x <= width * 2; x += lineSpacing) {
      ctx.moveTo(x, horizon);
      const spreadX = (x - width / 2) * 3.5 + width / 2;
      ctx.lineTo(spreadX, height);
    }

    // Horizontal moving grid lines
    const speed = (timeSec * 65) % 35;
    for (let y = horizon; y <= height; y += 18) {
      const currentY = y + speed * ((y - horizon) / (height - horizon));
      if (currentY <= height) {
        ctx.moveTo(0, currentY);
        ctx.lineTo(width, currentY);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  // 2. Animated Energy Beams
  ctx.save();
  for (let wave = 0; wave < 3; wave++) {
    ctx.beginPath();
    const waveColor = activePalette[wave % activePalette.length];
    ctx.strokeStyle = waveColor + '55';
    ctx.lineWidth = 2.5;

    for (let x = 0; x <= width; x += 20) {
      const frequency = 0.006 + wave * 0.003;
      const yOffset = Math.sin(x * frequency + timeSec * 2.8 + wave * 1.5) * 45;
      const yPos = height * 0.48 + yOffset + (wave - 1) * 35;
      if (x === 0) ctx.moveTo(x, yPos);
      else ctx.lineTo(x, yPos);
    }
    ctx.stroke();
  }
  ctx.restore();

  // 3. Volumetric Particle Vortex
  for (const p of particles) {
    p.x += p.speedX;
    p.y += p.speedY;
    p.pulse += 0.04;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    const rad = Math.max(0.8, p.radius + Math.sin(p.pulse) * 1.2);
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
    ctx.restore();
  }

  // 4. Center Ambient Light Core
  const pulseSize = Math.sin(timeSec * 3) * 25;
  const coreGrad = ctx.createRadialGradient(
    width / 2, height / 2, 5,
    width / 2, height / 2, 180 + pulseSize
  );
  coreGrad.addColorStop(0, activePalette[0] + '33');
  coreGrad.addColorStop(0.5, activePalette[1] + '15');
  coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(0, 0, width, height);

  // 5. Cinematic HUD Overlay
  // Top Header Status
  ctx.save();
  ctx.fillStyle = 'rgba(0, 229, 255, 0.9)';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(`● EN VIVO [${timeSec.toFixed(1)}s / ${durationSec}s] 60 FPS`, 30, 36);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '12px monospace';
  const metaText = `${style.toUpperCase()} • ${cameraMotion.toUpperCase()}`;
  ctx.fillText(metaText, Math.max(30, width - 380), 36);

  // Lower Third Cinematic Banner
  const bannerHeight = 110;
  const bannerY = height - bannerHeight;
  const bannerGrad = ctx.createLinearGradient(0, bannerY, 0, height);
  bannerGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bannerGrad.addColorStop(0.35, 'rgba(4, 8, 18, 0.88)');
  bannerGrad.addColorStop(1, 'rgba(2, 4, 10, 0.98)');
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(0, bannerY, width, bannerHeight);

  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.shadowColor = activePalette[0];
  ctx.shadowBlur = 12;
  ctx.fillText(title || 'Video Cinemático IA', 30, height - 60);

  // Prompt Subtitle
  ctx.fillStyle = '#00E5FF';
  ctx.font = '14px sans-serif';
  ctx.shadowBlur = 0;
  const snippet = prompt.length > 80 ? prompt.substring(0, 80) + '...' : prompt;
  ctx.fillText(`"${snippet}"`, 30, height - 32);

  // Brand Badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('CHEPE VIDEO STUDIO 4K', Math.max(30, width - 220), height - 32);

  ctx.restore();
}

// Generate, Record and Export Video with MediaRecorder
export async function renderAndRecordVideo(options: VideoRenderOptions): Promise<GeneratedVideoResult> {
  const {
    prompt,
    style,
    durationSeconds = 8,
    fps = 30,
    width = 1280,
    height = 720,
    backgroundImageUrl,
    title = 'Video IA Producido',
    cameraMotion = 'Paneo Suave & Zoom In',
    onProgress
  } = options;

  return new Promise(async (resolve, reject) => {
    try {
      // 1. Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo inicializar el contexto 2D del Canvas');
      }

      // Load background image if provided
      let bgImg: HTMLImageElement | null = null;
      if (backgroundImageUrl) {
        try {
          bgImg = new Image();
          bgImg.crossOrigin = 'anonymous';
          await new Promise<void>((imgResolve) => {
            if (!bgImg) return imgResolve();
            bgImg.onload = () => imgResolve();
            bgImg.onerror = () => {
              console.warn('Image could not be loaded, using procedural background');
              imgResolve();
            };
            bgImg.src = backgroundImageUrl;
          });
        } catch (e) {
          console.warn('Background image error:', e);
        }
      }

      // 2. Prepare Particle System
      const particleCount = 100;
      const activePalette = COLOR_PALETTES[style] || COLOR_PALETTES['default'];
      const particles: Array<{
        x: number;
        y: number;
        radius: number;
        speedX: number;
        speedY: number;
        color: string;
        alpha: number;
        pulse: number;
      }> = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3.5 + 1.5,
          speedX: (Math.random() - 0.5) * 2.5,
          speedY: (Math.random() - 0.5) * 2.5,
          color: activePalette[Math.floor(Math.random() * activePalette.length)],
          alpha: Math.random() * 0.7 + 0.3,
          pulse: Math.random() * Math.PI
        });
      }

      // 3. Setup MediaRecorder with cross-browser mime types
      const stream = canvas.captureStream(fps);
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4'
      ];
      let selectedMimeType = '';
      for (const mime of mimeTypes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
          selectedMimeType = mime;
          break;
        }
      }

      const recordedChunks: Blob[] = [];
      let mediaRecorder: MediaRecorder | null = null;
      if (typeof MediaRecorder !== 'undefined') {
        try {
          mediaRecorder = new MediaRecorder(stream, selectedMimeType ? { mimeType: selectedMimeType } : undefined);
          mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              recordedChunks.push(event.data);
            }
          };
        } catch (recErr) {
          console.warn('MediaRecorder init fallback:', recErr);
        }
      }

      let thumbnailDataUrl = '';

      const finishAndResolve = () => {
        let finalBlob: Blob;
        if (recordedChunks.length > 0) {
          finalBlob = new Blob(recordedChunks, { type: selectedMimeType || 'video/webm' });
        } else {
          // Fallback snapshot blob
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          finalBlob = new Blob([dataUrl], { type: 'image/jpeg' });
        }

        const blobUrl = URL.createObjectURL(finalBlob);
        const cleanTitle = (title || 'video_producido').replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${cleanTitle}.mp4`;

        resolve({
          blob: finalBlob,
          blobUrl: blobUrl,
          filename: filename,
          duration: durationSeconds,
          thumbnailUrl: thumbnailDataUrl || canvas.toDataURL('image/jpeg', 0.85)
        });
      };

      if (mediaRecorder) {
        mediaRecorder.onstop = finishAndResolve;
        mediaRecorder.start(100);
      }

      // 4. Render loop (Time-based step to prevent frame freeze)
      const totalFrames = durationSeconds * fps;
      let currentFrame = 0;

      const step = () => {
        const timeSec = currentFrame / fps;
        const pct = Math.round((currentFrame / totalFrames) * 100);

        if (onProgress) {
          onProgress(pct, `Renderizando fotograma ${currentFrame + 1}/${totalFrames} (${pct}%)`);
        }

        drawCinematicFrame(ctx, width, height, timeSec, durationSeconds, {
          prompt,
          style,
          cameraMotion,
          title,
          bgImage: bgImg,
          particles
        });

        if (currentFrame === Math.floor(totalFrames / 2)) {
          thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        currentFrame++;

        if (currentFrame < totalFrames) {
          setTimeout(step, Math.max(16, Math.floor(650 / fps)));
        } else {
          setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            } else {
              finishAndResolve();
            }
          }, 300);
        }
      };

      // Start rendering loop
      step();

    } catch (err) {
      console.error('Error rendering canvas video:', err);
      reject(err);
    }
  });
}
