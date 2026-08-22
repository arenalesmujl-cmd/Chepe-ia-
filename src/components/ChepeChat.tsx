import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AIModelId, PromptSpecialty, CustomServerConfig, UploadedFileItem, CustomGpt, UserProfile, ChatFolder } from '../types';
import { AI_MODEL_OPTIONS, CATEGORY_OPTIONS, QUICK_WELCOME_CARDS, SLASH_COMMANDS } from '../data/chepeData';
import { CodeBlock } from './CodeBlock';
import { CanvasDrawer } from './CanvasDrawer';
import { VoiceModeOverlay } from './VoiceModeOverlay';
import { CustomGptsModal } from './CustomGptsModal';
import { MemoryModal } from './MemoryModal';
import { ShareChatModal } from './ShareChatModal';
import { CustomInstructionsModal } from './CustomInstructionsModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { FeedbackModal } from './FeedbackModal';
import { DataAnalystCard } from './DataAnalystCard';
import { ApiKeyModal } from './ApiKeyModal';
import { ProjectFoldersModal } from './ProjectFoldersModal';
import { ExportChatModal } from './ExportChatModal';
import { ReadAloudPlayer } from './ReadAloudPlayer';
import { VideoPlayerCard } from './VideoPlayerCard';
import { GeneratedImageCard } from './GeneratedImageCard';
import { ModelAvatar } from './ModelAvatar';
import { renderAndRecordVideo } from '../lib/videoGeneratorEngine';
import { callGeminiDirectlyFromClient, getStoredApiKey, clearStoredApiKey } from '../services/geminiClient';
import {
  Bot, Send, Sparkles, User, Volume2, VolumeX, Plus, Image as ImageIcon,
  X, ChevronDown, Settings, Check, Copy, MessageSquare, PanelLeftClose,
  PanelLeft, Lightbulb, Search, Trash2, Mic, MicOff, ThumbsUp, ThumbsDown,
  Paperclip, Terminal, Play, Globe, Cpu, Layout, RotateCcw, ExternalLink,
  ChevronRight, Share2, FileCode, CheckCircle2, Shield, BarChart3, Download,
  Maximize2, Palette, Radio, Wand2, Brain, Edit3, Sliders, Pin, PinOff,
  Keyboard, Edit2, Loader2, Key, Square, AlertTriangle, UserPlus, Folder,
  FolderPlus, Printer, EyeOff, Layers, FileSearch, Sparkle, Video, Clapperboard, Compass, Zap
} from 'lucide-react';

interface ChepeChatProps {
  initialPrompt?: string;
  customConfig?: CustomServerConfig;
  onOpenConfig?: () => void;
  onNavigateTab?: (tab: string) => void;
  attachedFileForChat?: UploadedFileItem | null;
  userProfile?: UserProfile;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onIncrementUsage?: () => void;
}

export const ChepeChat: React.FC<ChepeChatProps> = ({
  initialPrompt,
  customConfig,
  onOpenConfig,
  onNavigateTab,
  attachedFileForChat,
  userProfile,
  onOpenAuthModal,
  onIncrementUsage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [historySearch, setHistorySearch] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Advanced ChatGPT-Surpassing Toggles & Modals
  const [isReasoningMode, setIsReasoningMode] = useState(false);
  const [isDeepResearchMode, setIsDeepResearchMode] = useState(false);
  const [isWebSearchMode, setIsWebSearchMode] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [isGptsModalOpen, setIsGptsModalOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isCustomInstructionsOpen, setIsCustomInstructionsOpen] = useState(false);
  const [selectedCustomGpt, setSelectedCustomGpt] = useState<CustomGpt | null>(null);
  const [isImageMode, setIsImageMode] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [imageStyle, setImageStyle] = useState<string>('fotorrealista');
  const [isTemporaryChat, setIsTemporaryChat] = useState(false);
  const [readAloudText, setReadAloudText] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingMsgText, setEditingMsgText] = useState('');

  // ChatGPT Workspace Folders & Projects
  const [folders, setFolders] = useState<ChatFolder[]>([
    { id: 'f-code', name: '💻 Programación & Código', color: '#00E5FF' },
    { id: 'f-study', name: '📚 Estudio & Tareas', color: '#10B981' },
    { id: 'f-work', name: '💼 Proyectos & Trabajo', color: '#8B5CF6' }
  ]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const [canvasArtifact, setCanvasArtifact] = useState<{
    title: string;
    language: string;
    content: string;
    type?: 'code' | 'document' | 'html';
  } | null>(null);
  const [expandedReasoningIds, setExpandedReasoningIds] = useState<Record<string, boolean>>({});

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(null);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>(['hist-1']);
  const [editingChatHistoryId, setEditingChatHistoryId] = useState<string | null>(null);
  const [editingChatHistoryTitle, setEditingChatHistoryTitle] = useState('');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [messageRatings, setMessageRatings] = useState<Record<string, 'up' | 'down'>>({});
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3000);
  };

  const [chatHistory, setChatHistory] = useState([
    { id: 'hist-1', title: 'Función en Kotlin con Corrutinas', date: 'Hoy', specialty: 'programacion', folderId: 'f-code', firstPrompt: 'Escribe una función en Kotlin con StateFlow para Android' },
    { id: 'hist-2', title: 'Resolución de ecuación cuadrática', date: 'Ayer', specialty: 'matematicas', folderId: 'f-study', firstPrompt: 'Resuelve 2x² + 5x - 3 = 0 paso a paso' },
    { id: 'hist-3', title: 'Resumen Segunda Guerra Mundial', date: 'Hace 3 días', specialty: 'tareas', folderId: 'f-study', firstPrompt: 'Hazme un resumen educativo de los 5 eventos clave' },
    { id: 'hist-4', title: 'Redacción de correo profesional', date: 'Hace 5 días', specialty: 'escritura', folderId: 'f-work', firstPrompt: 'Redacta un correo para solicitar una reunión' }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModelId>('gpt-4o');
  const [modelProviderFilter, setModelProviderFilter] = useState<string>('all');
  const [welcomeModelFilter, setWelcomeModelFilter] = useState<string>('all');
  const [modelSearchQuery, setModelSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<PromptSpecialty>('general');

  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<UploadedFileItem | null>(attachedFileForChat || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // MediaRecorder Voice-to-Text states & refs
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [interimVoiceTranscript, setInterimVoiceTranscript] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  const [localDailyCount, setLocalDailyCount] = useState<number>(userProfile?.dailyUsageCount || 0);
  const dailyCount = userProfile?.dailyUsageCount ?? localDailyCount;
  const maxDailyLimit = userProfile?.dailyLimit ?? (userProfile?.isGuest ? 20 : 1000);
  const isGuestUser = userProfile?.isGuest ?? true;
  const hasReachedLimit = dailyCount >= maxDailyLimit;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModelData = AI_MODEL_OPTIONS.find(m => m.id === selectedModel) || AI_MODEL_OPTIONS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (attachedFileForChat) {
      setAttachedFile(attachedFileForChat);
    }
  }, [attachedFileForChat]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively writing in an input, unless modifier keys used
      const isInputActive = ['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''));

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleNewChat();
        showToast('✨ Nuevo chat iniciado');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsShortcutsModalOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setIsVoiceModeOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsCustomInstructionsOpen(true);
      } else if (!isInputActive && e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedChatIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [id, ...prev]
    );
    showToast(pinnedChatIds.includes(id) ? 'Chat desfijado' : '📌 Chat fijado arriba');
  };

  const handleStartRenameChat = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatHistoryId(id);
    setEditingChatHistoryTitle(currentTitle);
  };

  const handleSaveRenameChat = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingChatHistoryTitle.trim()) {
      setEditingChatHistoryId(null);
      return;
    }
    setChatHistory(prev => prev.map(h => h.id === id ? { ...h, title: editingChatHistoryTitle.trim() } : h));
    setEditingChatHistoryId(null);
    showToast('✏️ Título de conversación actualizado');
  };

  const handleExportChatHistoryItem = (item: { title: string; firstPrompt: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    const markdownContent = `# ${item.title}\n\n**Fecha:** ${new Date().toLocaleDateString()}\n**Plataforma:** Chepe IA\n\n## Consulta Inicial\n${item.firstPrompt}\n\n---\n*Exportado desde Chepe IA Platform*`;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('📥 Conversación descargada en Markdown');
  };

  const handleEnhancePrompt = async () => {
    if (!input.trim() || isEnhancingPrompt) return;
    setIsEnhancingPrompt(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftPrompt: input })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.enhancedPrompt) {
          setInput(data.enhancedPrompt);
          showToast('✨ ¡Prompt optimizado con éxito!');
        }
      }
    } catch (err) {
      console.error('Error enhancing prompt:', err);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  const handleCreateFolder = (name: string, color: string, instructions?: string) => {
    const newFolder: ChatFolder = {
      id: `folder-${Date.now()}`,
      name,
      color
    };
    setFolders(prev => [...prev, newFolder]);
    setSelectedFolderId(newFolder.id);
    showToast(`📁 Proyecto "${name}" creado`);
  };

  const handleDeleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    if (selectedFolderId === id) {
      setSelectedFolderId(null);
    }
    showToast('🗑️ Proyecto eliminado');
  };

  const handleSwitchMessageVersion = (msgId: string, direction: 'prev' | 'next') => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId || !m.versions || m.versions.length <= 1) return m;
      const currentIndex = m.activeVersionIndex ?? (m.versions.length - 1);
      const newIndex = direction === 'prev'
        ? Math.max(0, currentIndex - 1)
        : Math.min(m.versions.length - 1, currentIndex + 1);
      return {
        ...m,
        activeVersionIndex: newIndex,
        text: m.versions[newIndex]
      };
    }));
  };

  const handleRateMessage = (msgId: string, rating: 'up' | 'down') => {
    setMessageRatings(prev => ({ ...prev, [msgId]: rating }));
    if (rating === 'down') {
      setFeedbackMessageId(msgId);
    } else {
      showToast('👍 ¡Gracias por tu valoración positiva!');
    }
  };

  const handleSubmitFeedback = (msgId: string, tags: string[], comment: string) => {
    console.log('Feedback enviado para:', msgId, tags, comment);
    showToast('✅ Comentarios enviados correctamente');
  };

  const handleNewChat = () => {
    setMessages([]);
    setAttachedFile(null);
    setAttachedImage(null);
    window.speechSynthesis?.cancel();
    setIsSpeaking(null);
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(h => h.id !== id));
  };

  // Clean up media recorder tracks & timers on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, []);

  // Process recorded audio blob from MediaRecorder
  const processRecordedAudio = async (audioBlob: Blob, mimeType: string, capturedLiveText?: string) => {
    if (audioBlob.size < 50 && !capturedLiveText) return;

    if (capturedLiveText && capturedLiveText.trim().length > 0) {
      const transcribedText = capturedLiveText.trim();
      setInput(prev => (prev ? `${prev} ${transcribedText}` : transcribedText));
      setInterimVoiceTranscript('');
      showToast('✍️ Voz convertida a texto con éxito');
      return;
    }

    setIsTranscribingAudio(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        try {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType: mimeType || 'audio/webm'
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.transcript && data.transcript.trim()) {
              const transcribedText = data.transcript.trim();
              setInput(prev => (prev ? `${prev} ${transcribedText}` : transcribedText));
              showToast('✍️ Voz transcrita por IA con éxito');
            } else {
              showToast('⚠️ No se detectaron palabras claras');
            }
          } else {
            showToast('⚠️ Error al procesar audio en servidor');
          }
        } catch (apiErr) {
          console.error('Error en transcripción de audio:', apiErr);
          showToast('⚠️ Error de conexión al transcribir');
        } finally {
          setIsTranscribingAudio(false);
          setInterimVoiceTranscript('');
        }
      };
    } catch (err) {
      console.error('Error processing audio blob:', err);
      setIsTranscribingAudio(false);
      setInterimVoiceTranscript('');
    }
  };

  // Start MediaRecorder voice recording
  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Tu navegador no soporta la API de grabación de audio (MediaRecorder).');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      let liveSpeechCaptured = '';

      recorder.onstop = async () => {
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || mimeType });

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(t => t.stop());
          mediaStreamRef.current = null;
        }

        await processRecordedAudio(audioBlob, recorder.mimeType || mimeType, liveSpeechCaptured || interimVoiceTranscript);
      };

      recorder.start(250);
      setIsRecordingVoice(true);
      setRecordingDuration(0);
      setInterimVoiceTranscript('');

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Start Web Speech recognition in parallel for live interim preview
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = 'es-MX';
          recognition.continuous = true;
          recognition.interimResults = true;

          recognition.onresult = (event: any) => {
            let fullTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              fullTranscript += event.results[i][0].transcript + ' ';
            }
            liveSpeechCaptured = fullTranscript.trim();
            setInterimVoiceTranscript(fullTranscript.trim());
          };

          recognition.onerror = () => {};
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (e) {
          console.warn('SpeechRecognition live preview skipped', e);
        }
      }

      showToast('🎙️ Grabando audio con MediaRecorder... Di tu prompt');
    } catch (err: any) {
      console.error('Error al iniciar MediaRecorder:', err);
      alert('No se pudo acceder al micrófono. Por favor verifica los permisos del navegador.');
      setIsRecordingVoice(false);
    }
  };

  // Stop MediaRecorder and transcribe
  const stopVoiceRecording = () => {
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch(e) {}
      speechRecognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingVoice(false);
  };

  // Cancel MediaRecorder without transcribing
  const cancelVoiceRecording = () => {
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch(e) {}
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      audioChunksRef.current = [];
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecordingVoice(false);
    setInterimVoiceTranscript('');
    showToast('❌ Grabación cancelada');
  };

  const toggleRecording = () => {
    if (isRecordingVoice) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen no debe superar los 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setAttachedFile({
        id: 'file-' + Date.now(),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'text/plain',
        uploadedAt: 'Hoy',
        contentSnippet: (reader.result as string).slice(0, 3000)
      });
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if ((!promptText.trim() && !attachedImage && !attachedFile) || isLoading) return;

    if (hasReachedLimit) {
      if (isGuestUser) {
        showToast('⚠️ Has alcanzado tu límite de 20 mensajes de invitado. ¡Crea tu cuenta gratis para tener 1,000 mensajes diarios!');
        if (onOpenAuthModal) {
          onOpenAuthModal('register');
        }
      } else {
        showToast(`⚠️ Has alcanzado tu límite diario de ${maxDailyLimit} mensajes.`);
      }
      return;
    }

    const currentImage = attachedImage;
    const currentFile = attachedFile;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText || (currentFile ? `Por favor analiza el archivo: ${currentFile.name}` : 'Analiza esta imagen'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: currentImage || undefined,
      fileData: currentFile || undefined,
      modelUsed: selectedModel,
      specialty: selectedCategory,
      versions: [promptText],
      activeVersionIndex: 0
    };

    setMessages(prev => [...prev, userMsg]);

    if (messages.length === 0 && !isTemporaryChat) {
      const titleSnippet = promptText.length > 28 ? promptText.substring(0, 28) + '...' : promptText || (currentFile?.name || 'Nuevo Chat');
      const uniqueHistId = `hist-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setChatHistory(prev => [
        {
          id: uniqueHistId,
          title: titleSnippet,
          date: 'Ahora',
          specialty: selectedCategory,
          folderId: selectedFolderId || undefined,
          firstPrompt: promptText
        },
        ...prev.filter(item => item.id !== uniqueHistId)
      ]);
    }

    setInput('');
    setAttachedImage(null);
    setAttachedFile(null);
    setIsImageMode(false);
    setIsLoading(true);
    setLocalDailyCount(prev => prev + 1);
    if (onIncrementUsage) {
      onIncrementUsage();
    }

    try {
      let data: any = null;
      let usedClientFallback = false;

      // Direct Video Generation Flow
      const isVideoIntent = selectedModel === 'sora-video' ||
        /^\/video\b|^(?:crea|crear|haz|hazme|genera|generar|produce|producir|quiero)\s+(?:un\s+)?video\b|^video\s+de\b/i.test(promptText.trim());

      if (isVideoIntent) {
        try {
          const cleanedPrompt = promptText.replace(/^\/video\s*|^(?:crea|crear|haz|hazme|genera|generar|produce|producir|quiero)\s+(?:un\s+)?video\s*(?:de|sobre)?\s*|^video\s+de\s*/i, '').trim();
          const videoRes = await fetch('/api/generate-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: cleanedPrompt || promptText,
              style: 'Cinemático 8K',
              duration: 10,
              aspectRatio: '16:9',
              imageUrl: currentImage || undefined
            })
          });
          if (videoRes.ok) {
            const vJson = await videoRes.json();
            if (vJson.success && vJson.video) {
              data = {
                text: `🎬 **Video Cinemático Producido con Chepe Video & Sora:**\n\n- **Título:** ${vJson.video.title}\n- **Estilo:** ${vJson.video.style} (${vJson.video.duration}s • ${vJson.video.fps || 60} FPS)\n- **Movimiento de Cámara:** ${vJson.video.cameraMotion || 'Cinematográfico'}\n\n*Puedes reproducir el video en pantalla completa o descargarlo en formato MP4 con el botón inferior.*`,
                modelUsed: 'Sora & Veo Studio',
                videoData: vJson.video
              };
            }
          }

          // Fallback to client-side video recorder if server didn't provide data
          if (!data) {
            const localVideo = await renderAndRecordVideo({
              prompt: cleanedPrompt || promptText,
              style: 'Cinemático 8K',
              durationSeconds: 8,
              fps: 30,
              backgroundImageUrl: currentImage || undefined,
              title: (cleanedPrompt || promptText).slice(0, 35) || 'Video Cinemático IA'
            });

            data = {
              text: `🎬 **Video Cinemático Producido y Grabado en Alta Definición:**\n\n- **Título:** ${cleanedPrompt || 'Video Cinemático'}\n- **Estilo:** Cinemático 8K (30 FPS HDR)\n- **Formato:** Video MP4/WebM Listo para Reproducción y Descarga Directa`,
              modelUsed: 'Canvas 60FPS Video Engine',
              videoData: {
                id: 'vid-chat-' + Date.now(),
                title: cleanedPrompt || 'Video Cinemático IA',
                prompt: cleanedPrompt || promptText,
                videoUrl: localVideo.blobUrl,
                posterUrl: localVideo.thumbnailUrl,
                duration: 8,
                aspectRatio: '16:9',
                style: 'Cinemático 8K',
                cameraMotion: 'Paneo Suave & Zoom In',
                fps: 30,
                tags: ['Chepe Video', 'Cinemático 8K'],
                createdAt: new Date().toISOString(),
                storyboard: [
                  { sceneNumber: 1, title: 'Composición Principal', description: `Renderizado en movimiento de ${cleanedPrompt || promptText}` }
                ]
              }
            };
          }
        } catch (vErr) {
          console.warn('Video generation error, falling back to local engine:', vErr);
        }
      }

      if (!data) {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [...messages, userMsg],
              userPrompt: promptText,
              modelId: selectedModel,
              specialty: selectedCategory,
              imageUrl: currentImage || undefined,
              fileData: currentFile || undefined,
              customConfig: customConfig,
              isReasoningMode: isReasoningMode || isDeepResearchMode,
              isWebSearchMode: isWebSearchMode || isDeepResearchMode,
              isImageMode: isImageMode,
              imageAspectRatio: imageAspectRatio,
              imageStyle: imageStyle,
              customGptSystemPrompt: selectedCustomGpt?.systemPrompt
            })
          });

          if (response.ok) {
            data = await response.json();
          } else {
            const errorJson = await response.json().catch(() => ({}));
            const detailedMsg = errorJson.text || errorJson.details || errorJson.error;
            throw new Error(detailedMsg || `HTTP ${response.status}`);
          }
        } catch (serverErr: any) {
          console.warn('Backend /api/chat no disponible o falló, intentando conexión directa con Gemini...', serverErr);
          
          // Automatic direct client fallback
          const fallbackRes = await callGeminiDirectlyFromClient({
            messages: [...messages, userMsg],
            userPrompt: promptText,
            modelId: selectedModel,
            specialty: selectedCategory,
            imageUrl: currentImage || undefined,
            fileData: currentFile || undefined,
            isReasoningMode: isReasoningMode || isDeepResearchMode,
            isWebSearchMode: isWebSearchMode || isDeepResearchMode,
            isImageMode: isImageMode,
            customGptSystemPrompt: selectedCustomGpt?.systemPrompt
          }, customConfig?.apiKey);

          data = {
            text: fallbackRes.text,
            modelUsed: fallbackRes.modelUsed,
            generatedImageUrl: fallbackRes.generatedImageUrl,
            generatedImagePrompt: fallbackRes.generatedImagePrompt,
            reasoningChain: fallbackRes.reasoningChain,
            thinkingTimeMs: fallbackRes.thinkingTimeMs,
            canvasData: fallbackRes.canvasData,
            suggestions: fallbackRes.suggestions
          };
          usedClientFallback = true;
        }
      }

      const aiMsgText = data.text || 'Respuesta generada por Chepe IA.';
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'chepe_ia',
        text: aiMsgText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        customGptUsed: selectedCustomGpt?.name,
        specialty: selectedCategory,
        suggestions: data.suggestions || [],
        reasoningChain: data.reasoningChain || (isDeepResearchMode ? [
          'Fase 1: Mapeo de conceptos clave y búsqueda exhaustiva de fuentes.',
          'Fase 2: Cruce de referencias y síntesis de patrones principales.',
          'Fase 3: Verificación lógica y redacción de conclusiones estructuradas.'
        ] : undefined),
        thinkingTimeMs: data.thinkingTimeMs || (isDeepResearchMode ? 14500 : isReasoningMode ? 4200 : undefined),
        isDeepResearch: isDeepResearchMode,
        deepResearchSteps: isDeepResearchMode ? [
          { title: 'Búsqueda e indexación de fuentes especializadas', status: 'done', detail: '14 fuentes analizadas' },
          { title: 'Lectura crítica y contraste de hipótesis', status: 'done', detail: 'Eliminadas contradicciones' },
          { title: 'Estructuración y síntesis de informe técnico', status: 'done', detail: 'Conclusiones y citas generadas' }
        ] : undefined,
        webCitations: data.webCitations || ((isWebSearchMode || isDeepResearchMode) ? [
          { title: 'Documentación Oficial & Referencias', domain: 'developer.mozilla.org', url: 'https://developer.mozilla.org' },
          { title: 'OpenAI Documentation & Papers', domain: 'openai.com', url: 'https://openai.com/research' },
          { title: 'Wikipedia Knowledge Base', domain: 'es.wikipedia.org', url: 'https://es.wikipedia.org' }
        ] : undefined),
        canvasData: data.canvasData,
        chartData: data.chartData,
        videoData: data.videoData,
        webScrapedData: data.webScrapedData,
        generatedImageUrl: data.generatedImageUrl,
        generatedImagePrompt: data.generatedImagePrompt,
        generatedImageMetadata: data.generatedImageMetadata,
        versions: [aiMsgText],
        activeVersionIndex: 0
      };

      setMessages(prev => [...prev, aiMsg]);
      if ((data.reasoningChain && data.reasoningChain.length > 0) || isDeepResearchMode) {
        setExpandedReasoningIds(prev => ({ ...prev, [aiMsg.id]: true }));
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      
      if (err?.message === 'MISSING_API_KEY') {
        setIsApiKeyModalOpen(true);
        const promptMsg: ChatMessage = {
          id: `err-key-${Date.now()}`,
          sender: 'chepe_ia',
          text: '🔑 **Para activar las respuestas de IA en Vercel:**\n\n1. Haz clic en el botón **"Configurar Clave API"** que se abrió en tu pantalla.\n2. Pega tu clave de API de Gemini gratuita (empieza por `AIzaSy...`).\n3. Haz clic en **Guardar y Activar** y tu mensaje se responderá al instante.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'Chepe IA'
        };
        setMessages(prev => [...prev, promptMsg]);
      } else {
        const isKeyErr = String(err?.message || '').toLowerCase().includes('clave api') || String(err?.message || '').includes('API key');
        const errorMessage = isKeyErr
          ? '⚠️ La clave API de Gemini guardada en este navegador no es válida o está incompleta.\n\nPuedes borrarla para usar el servidor integrado o ingresar una clave gratuita válida desde Google AI Studio.'
          : err?.message && !err.message.includes('object') 
            ? `⚠️ ${err.message}` 
            : '⚠️ Ocurrió una interrupción al conectar con el motor de IA. Haz clic en "Clave API" arriba para configurar o verificar tu clave.';
        
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'chepe_ia',
          text: errorMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
          suggestions: isKeyErr ? [
            '🔑 Abrir configuración de Clave API',
            '🔄 Usar conexión del Servidor por defecto'
          ] : undefined
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEditedMessage = (msgId: string) => {
    if (!editingMsgText.trim()) return;
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    const currentMsg = messages[msgIndex];
    const prevVersions = currentMsg.versions || [currentMsg.text];
    const newText = editingMsgText.trim();
    const updatedVersions = [...prevVersions, newText];

    setEditingMsgId(null);
    setEditingMsgText('');

    // Remove subsequent messages and resend with version tracking
    setMessages(prev => prev.slice(0, msgIndex));
    handleSendMessage(newText);
  };

  const handleRegenerateResponse = () => {
    if (messages.length === 0 || isLoading) return;
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (!lastUserMsg) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === 'chepe_ia') {
      const prevVersions = lastMsg.versions || [lastMsg.text];
      setMessages(prev => prev.slice(0, -1));
    }

    handleSendMessage(lastUserMsg.text);
  };

  const handleSpeech = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#\-`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-MX';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const renderMessageContent = (content: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }

      parts.push({
        type: 'code',
        language: match[1] || 'code',
        code: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }

    return parts.map((part, pIdx) => {
      if (part.type === 'code') {
        return (
          <CodeBlock
            key={pIdx}
            code={part.code}
            language={part.language}
            isCyberpunk={true}
            onOpenCanvas={(code, lang) => setCanvasArtifact({
              title: `Artefacto_${lang.toUpperCase()}`,
              language: lang,
              content: code,
              type: lang === 'html' ? 'html' : 'code'
            })}
          />
        );
      }

      const lines = part.content.split('\n');
      return (
        <div key={pIdx} className="space-y-1.5 my-1">
          {lines.map((line, lIdx) => {
            const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
              return (
                <li
                  key={lIdx}
                  className="ml-4 list-disc my-0.5 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[-*]\s+/, '') }}
                />
              );
            }

            if (line.trim() === '') return <div key={lIdx} className="h-1.5" />;

            return (
              <p
                key={lIdx}
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedLine }}
              />
            );
          })}
        </div>
      );
    });
  };

  const filteredHistory = chatHistory.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.firstPrompt.toLowerCase().includes(historySearch.toLowerCase());
    const matchesFolder = selectedFolderId ? (h as any).folderId === selectedFolderId : true;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="flex h-[calc(100vh-5.5rem)] max-h-[960px] w-full bg-[#050A14] text-cyan-50 rounded-3xl border border-cyan-500/30 shadow-2xl overflow-hidden font-sans relative my-1">
      {/* 0. Canvas Side Drawer */}
      <CanvasDrawer
        artifact={canvasArtifact}
        onClose={() => setCanvasArtifact(null)}
        onAskAIRefine={(p) => handleSendMessage(p)}
      />

      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64 sm:w-72 border-r' : 'w-0 border-none opacity-0 pointer-events-none'
        } transition-all duration-300 bg-[#080E1C] border-cyan-900/40 flex flex-col overflow-hidden shrink-0 z-30 absolute md:relative inset-y-0 left-0 shadow-2xl md:shadow-none`}
      >
        <div className="p-3 border-b border-cyan-950 flex items-center justify-between bg-[#0B132B]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-blue-600 flex items-center justify-center text-stone-950 font-black shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white leading-none">Chepe IA</span>
              <span className="text-[10px] text-cyan-400 font-medium">Asistente Web</span>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#152442] transition-colors cursor-pointer"
            title="Ocultar menú"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-2">
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs flex items-center justify-between shadow-lg shadow-cyan-500/20 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span>Nuevo Chat</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-stone-900" />
          </button>

          {/* ChatGPT Workspace Projects Button */}
          <button
            onClick={() => setIsProjectsModalOpen(true)}
            className="w-full py-1.5 px-3 rounded-xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-900/80 hover:border-cyan-500 text-stone-300 hover:text-white font-semibold text-xs flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              <span>Proyectos & Carpetas</span>
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800">
              {folders.length}
            </span>
          </button>
        </div>

        {/* Selected Project Filter Badge */}
        {selectedFolderId && (
          <div className="px-3 pb-1">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-700 text-xs text-cyan-300">
              <div className="flex items-center gap-1.5 truncate">
                <Folder className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                <span className="truncate font-semibold text-[11px]">
                  {folders.find(f => f.id === selectedFolderId)?.name || 'Proyecto'}
                </span>
              </div>
              <button
                onClick={() => setSelectedFolderId(null)}
                className="text-cyan-400 hover:text-white p-0.5"
                title="Mostrar todos los chats"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Buscar historial..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#050A14] border border-cyan-950 text-stone-200 placeholder-stone-500 text-xs focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3 scrollbar-none">
          {/* Pinned Chats */}
          {chatHistory.filter(h => pinnedChatIds.includes(h.id)).length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-0.5 text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider flex items-center gap-1">
                <Pin className="w-3 h-3 text-[#00E5FF]" />
                <span>Chats Fijados</span>
              </div>
              {chatHistory.filter(h => pinnedChatIds.includes(h.id)).map((item) => (
                <div
                  key={`pinned-${item.id}`}
                  onClick={() => {
                    handleSendMessage(item.firstPrompt);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl bg-[#09152E] border border-cyan-900/80 hover:border-[#00E5FF]/60 text-xs flex items-center justify-between text-cyan-100 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Pin className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                    <span className="truncate font-semibold text-white">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleTogglePin(item.id, e)}
                      className="p-1 text-stone-400 hover:text-yellow-400"
                      title="Desfijar chat"
                    >
                      <PinOff className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleExportChatHistoryItem(item, e)}
                      className="p-1 text-stone-400 hover:text-[#00E5FF]"
                      title="Exportar Markdown"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All / Filtered Chats */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>Historial Reciente</span>
              <span className="text-[9px] text-stone-500 font-mono">{filteredHistory.length} chats</span>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="text-center py-6 text-xs text-stone-500 italic">
                No hay chats guardados
              </div>
            ) : (
              filteredHistory.map((item, idx) => {
                const isPinned = pinnedChatIds.includes(item.id);
                const isEditingThis = editingChatHistoryId === item.id;

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={() => {
                      if (!isEditingThis) {
                        handleSendMessage(item.firstPrompt);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#0F1C36] text-xs flex items-center justify-between text-cyan-100/90 transition-colors group cursor-pointer"
                  >
                    {isEditingThis ? (
                      <form
                        onSubmit={(e) => handleSaveRenameChat(item.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 w-full"
                      >
                        <input
                          type="text"
                          value={editingChatHistoryTitle}
                          onChange={(e) => setEditingChatHistoryTitle(e.target.value)}
                          className="w-full bg-[#040813] border border-[#00E5FF] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                          title="Guardar"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setEditingChatHistoryId(null); }}
                          className="p-1 text-stone-400 hover:text-stone-200"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 truncate">
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:text-[#00E5FF] transition-colors" />
                          <span className="truncate font-medium">{item.title}</span>
                        </div>

                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleTogglePin(item.id, e)}
                            className={`p-1 ${isPinned ? 'text-[#00E5FF]' : 'text-stone-400 hover:text-[#00E5FF]'}`}
                            title={isPinned ? "Desfijar" : "Fijar arriba"}
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleStartRenameChat(item.id, item.title, e)}
                            className="p-1 text-stone-400 hover:text-cyan-300"
                            title="Renombrar título"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleExportChatHistoryItem(item, e)}
                            className="p-1 text-stone-400 hover:text-[#00E5FF]"
                            title="Exportar Markdown"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteHistory(item.id, e)}
                            className="p-1 text-stone-400 hover:text-rose-400"
                            title="Eliminar chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="p-3 border-t border-cyan-950 space-y-1.5 bg-[#060B17]">
          {isGuestUser && (
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-950/60 to-[#120B04] border border-amber-500/40 space-y-1 mb-1">
              <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold">
                <span>Modo Invitado</span>
                <span className="bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded text-[9px] font-black">20 máx</span>
              </div>
              <p className="text-[10px] text-stone-300 leading-tight">
                Crea tu cuenta para obtener <strong>1,000 mensajes diarios</strong>.
              </p>
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('register')}
                  className="w-full py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-[10px] transition-colors cursor-pointer"
                >
                  Desbloquear 1,000 mensajes
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-cyan-300 font-semibold px-2 py-1">
            <span>{isGuestUser ? 'Mensajes de Invitado' : 'Uso diario de IA'}</span>
            <span className="text-white font-bold">{dailyCount} / {maxDailyLimit}</span>
          </div>

          <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden px-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                hasReachedLimit ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-[#00E5FF]'
              }`}
              style={{ width: `${Math.min(100, (dailyCount / maxDailyLimit) * 100)}%` }}
            />
          </div>

          <button
            onClick={onOpenConfig}
            className="w-full text-left px-3 py-2 rounded-xl bg-[#0F1E38] hover:bg-[#16294D] border border-cyan-900/60 text-xs text-cyan-300 font-semibold flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#00E5FF]" />
              <span>Servidor & API Keys</span>
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800">
              Config
            </span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CHAT CANVAS */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050A14] relative">
        {/* TOP NAVBAR WITH MODEL SELECTOR */}
        <div className="p-3 bg-[#0B132B] border-b border-cyan-900/40 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg text-cyan-300 hover:bg-[#152442] transition-colors"
                title="Abrir menú lateral"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
              >
                <ModelAvatar model={currentModelData} size="sm" showBadge />
                <span className="truncate max-w-[130px] sm:max-w-[200px]">{currentModelData.name}</span>
                <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform shrink-0 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isModelDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-84 sm:w-[420px] rounded-2xl bg-[#081021] border border-cyan-500/50 shadow-2xl shadow-cyan-950/90 p-3 z-50 animate-in fade-in space-y-2.5 max-h-[82vh] flex flex-col">
                  <div className="flex items-center justify-between border-b border-cyan-900/60 pb-2">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                      Modelos de IA con Fotos &amp; Logos
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono border border-cyan-800 font-bold">
                      {AI_MODEL_OPTIONS.length} Modelos
                    </span>
                  </div>

                  {/* Search Bar for Models */}
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Buscar entre 65+ modelos de IA (OpenAI, Claude, Gemini, DeepSeek, Midjourney, FLUX, Sora...)"
                      value={modelSearchQuery}
                      onChange={(e) => setModelSearchQuery(e.target.value)}
                      className="w-full bg-[#050A14] text-white text-xs pl-8 pr-7 py-2 rounded-xl border border-cyan-900 focus:border-[#00E5FF] focus:outline-none placeholder-stone-500"
                    />
                    {modelSearchQuery && (
                      <button
                        onClick={() => setModelSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Provider Filter Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-none text-[11px]">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'OpenAI', label: 'ChatGPT' },
                      { id: 'Anthropic', label: 'Claude' },
                      { id: 'Google', label: 'Gemini' },
                      { id: 'DeepSeek', label: 'DeepSeek' },
                      { id: 'Meta', label: 'Meta Llama' },
                      { id: 'xAI', label: 'xAI Grok' },
                      { id: 'Mistral', label: 'Mistral' },
                      { id: 'Qwen', label: 'Qwen' },
                      { id: 'Perplexity', label: 'Perplexity' },
                      { id: 'Stability', label: 'Arte & Imágenes' },
                      { id: 'Runway', label: 'Video Cinema' },
                      { id: 'AudioAI', label: 'Audio & Música' },
                      { id: 'Moonshot', label: 'Moonshot' },
                      { id: '01AI', label: '01.AI' },
                      { id: 'Microsoft', label: 'Microsoft' },
                      { id: 'Nvidia', label: 'NVIDIA' },
                      { id: 'Cohere', label: 'Cohere' },
                      { id: 'Amazon', label: 'AWS' },
                      { id: 'AI21', label: 'AI21' },
                      { id: 'Baidu', label: 'Baidu' },
                      { id: 'ChepeIA', label: 'Chepe Motors' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setModelProviderFilter(tab.id as any)}
                        className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
                          modelProviderFilter === tab.id
                            ? 'bg-[#00E5FF] text-stone-950 font-bold shadow-sm'
                            : 'bg-[#050A14] text-stone-400 hover:text-white border border-cyan-900/60'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 overflow-y-auto pr-1 max-h-[340px]">
                    {AI_MODEL_OPTIONS.filter((m) => {
                      const matchesProvider = modelProviderFilter === 'all' || m.provider === modelProviderFilter;
                      const q = modelSearchQuery.toLowerCase().trim();
                      const matchesSearch = !q ||
                        m.name.toLowerCase().includes(q) ||
                        m.description.toLowerCase().includes(q) ||
                        m.badge.toLowerCase().includes(q) ||
                        (m.provider && m.provider.toLowerCase().includes(q)) ||
                        (m.tags && m.tags.some(t => t.toLowerCase().includes(q)));
                      return matchesProvider && matchesSearch;
                    }).map((m) => {
                      const isSelected = selectedModel === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedModel(m.id as AIModelId);
                            setIsModelDropdownOpen(false);
                            const isImgModel = ['dall-e-3', 'imagen-3', 'midjourney-v6', 'midjourney-v6-1', 'flux-1-pro', 'flux-1-schnell', 'flux-1-dev', 'stable-diffusion-3-5', 'ideogram-2', 'grok-imagine'].includes(m.id);
                            if (isImgModel) {
                              setIsImageMode(true);
                              showToast(`🎨 Modo Generación de Imágenes Activado (${m.name})`);
                            } else {
                              showToast(`Motor activo: ${m.name}`);
                            }
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex gap-3 items-start transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#002C3E] to-[#0A3A52] text-[#00E5FF] font-bold border-[#00E5FF]/60 shadow-md ring-1 ring-[#00E5FF]/40'
                              : 'bg-[#050A14] text-stone-200 hover:bg-[#0D182E] border-cyan-950 hover:border-cyan-800'
                          }`}
                        >
                          <ModelAvatar model={m} size="md" showBadge />
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-white text-xs truncate">{m.name}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#0F2244] text-cyan-300 font-mono border border-cyan-800">
                                  {m.badge}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />}
                              </div>
                            </div>
                            <p className="text-[10px] text-stone-400 font-normal leading-relaxed line-clamp-2">
                              {m.description}
                            </p>
                            <div className="flex items-center justify-between text-[9px] text-stone-500 pt-0.5 font-mono">
                              <span>Velocidad: <span className="text-cyan-400">{m.speed}</span></span>
                              {m.provider && (
                                <span className="px-1.5 py-0.2 rounded bg-[#0A162C] text-stone-300 font-semibold border border-cyan-900/60">
                                  {m.provider}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-500/50 hover:bg-amber-900/50 hover:text-amber-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Configurar Clave API de Gemini para Vercel o web"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Clave API</span>
            </button>

            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#081021] text-stone-300 border border-cyan-900/80 hover:border-cyan-500 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Atajos de Teclado (Ctrl+K o ?)"
            >
              <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Atajos</span>
            </button>

            <button
              onClick={() => setIsCustomInstructionsOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[#081021] text-indigo-300 border border-indigo-900/80 hover:border-indigo-500 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Instrucciones Personalizadas de Chepe IA"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden xl:inline">Instrucciones</span>
            </button>

            <button
              onClick={() => setIsMemoryModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[#081021] text-purple-300 border border-purple-900/80 hover:border-purple-500 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Memoria Guardada de Chepe IA"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden xl:inline">Memoria</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[#081021] text-emerald-300 border border-emerald-900/80 hover:border-emerald-500 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Exportar conversación (PDF, Markdown, JSON, TXT)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">Exportar</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[#081021] text-cyan-300 border border-cyan-900 hover:border-[#00E5FF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Compartir o publicar conversación"
            >
              <Share2 className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="hidden xl:inline">Compartir</span>
            </button>

            <button
              onClick={() => setIsGptsModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCustomGpt
                  ? 'bg-cyan-950 text-[#00E5FF] border-[#00E5FF]'
                  : 'bg-[#081021] text-stone-300 border-cyan-800 hover:text-white hover:bg-[#0F1C36]'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="hidden sm:inline">{selectedCustomGpt ? selectedCustomGpt.name : 'Explorar GPTs'}</span>
              <span className="sm:hidden">GPTs</span>
            </button>

            <button
              onClick={() => setIsVoiceModeOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-950 border border-cyan-700 text-cyan-200 text-xs font-bold flex items-center gap-1.5 hover:text-white hover:border-[#00E5FF] transition-all cursor-pointer shadow-md"
            >
              <Radio className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
              <span className="hidden sm:inline">Modo Voz</span>
            </button>

            <button
              onClick={() => setIsTemporaryChat(!isTemporaryChat)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isTemporaryChat
                  ? 'bg-purple-950/90 text-purple-300 border-purple-500'
                  : 'bg-[#081021] text-stone-400 border-cyan-900 hover:text-white'
              }`}
              title={isTemporaryChat ? 'Chat Temporal Activo (Sin historial)' : 'Activar Chat Incógnito'}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isTemporaryChat ? 'Incógnito' : 'Temporal'}</span>
            </button>

            <span className="inline-flex items-center gap-1.5 bg-[#00384C] text-[#00E5FF] text-[10px] font-extrabold px-3 py-1 rounded-full border border-[#00E5FF]/40 uppercase tracking-wide">
              <Sparkles className="w-3 h-3 fill-current" />
              CHEPE IA ONLINE
            </span>
          </div>
        </div>

        {/* CATEGORIES BAR */}
        <div className="px-4 py-2 bg-[#080E1C] border-b border-cyan-900/30 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Especialidad:
          </span>
          {CATEGORY_OPTIONS.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as PromptSpecialty)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#002C3E] text-[#00E5FF] border-[#00E5FF] shadow-sm shadow-cyan-500/30'
                    : 'bg-[#0D182E] text-stone-300 border-stone-800 hover:border-cyan-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Temporary Chat Notice Banner */}
        {isTemporaryChat && (
          <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 border-b border-purple-800/80 px-4 py-2 text-xs text-purple-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2 max-w-2xl">
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                <strong className="text-white">Chat Temporal Activado:</strong> Este chat no se guardará en tu historial ni se utilizará para entrenar la memoria de Chepe IA.
              </span>
            </div>
            <button
              onClick={() => setIsTemporaryChat(false)}
              className="text-xs text-purple-300 hover:text-white underline cursor-pointer"
            >
              Desactivar
            </button>
          </div>
        )}

        {/* MAIN MESSAGES DISPLAY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#050A14] to-[#081122]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-6 text-center space-y-6 my-auto">
              <div className="space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-blue-600 flex items-center justify-center text-stone-950 shadow-2xl shadow-cyan-500/40 mx-auto">
                  <Bot className="w-9 h-9 sm:w-10 sm:h-10" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  ¿En qué puedo ayudarte hoy en <span className="text-[#00E5FF]">Chepe IA</span>?
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                  Pregunta sobre programación, tareas, resolución matemática, redacción de textos, traducciones e ideas.
                </p>
              </div>

              {/* Quick Start Greeting Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full text-left">
                {QUICK_WELCOME_CARDS.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(card.prompt)}
                    className="p-4 rounded-2xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-900/60 hover:border-[#00E5FF] transition-all group shadow-lg flex flex-col justify-between space-y-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{card.icon}</span>
                      <span className="text-xs font-bold text-cyan-300 group-hover:text-[#00E5FF]">
                        {card.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed group-hover:text-stone-200">
                      {card.desc}
                    </p>
                  </button>
                ))}
              </div>

              {/* Visual AI Models Showcase Grid with Photos & Filters */}
              <div className="w-full text-left bg-[#081021]/95 rounded-2xl border border-cyan-900/70 p-4 sm:p-5 space-y-4 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-900/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-stone-950 font-black shadow-md shadow-cyan-950">
                      <Sparkles className="w-4 h-4 text-stone-950" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                        Catálogo Completo de Modelos de Inteligencia Artificial
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-[#00E5FF] font-mono border border-cyan-800">
                          {AI_MODEL_OPTIONS.length} Modelos
                        </span>
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        Selecciona cualquier modelo con foto real para chatear de inmediato sin ingresar API Key
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-[#00E5FF] font-mono self-start sm:self-auto flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                    100% Desbloqueado
                  </span>
                </div>

                {/* Search Bar for Welcome Grid */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar modelo por nombre, proveedor, especialidad o capacidad (ej. Sora, Claude, DeepSeek, Matemáticas, Programación...)"
                    value={modelSearchQuery}
                    onChange={(e) => setModelSearchQuery(e.target.value)}
                    className="w-full bg-[#050A14] text-white text-xs pl-9 pr-8 py-2.5 rounded-xl border border-cyan-900 focus:border-[#00E5FF] focus:outline-none placeholder-stone-500 shadow-inner"
                  />
                  {modelSearchQuery && (
                    <button
                      onClick={() => setModelSearchQuery('')}
                      className="absolute right-3 top-3 text-stone-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {[
                    { id: 'all', label: `Todos (${AI_MODEL_OPTIONS.length})` },
                    { id: 'OpenAI', label: 'ChatGPT / OpenAI' },
                    { id: 'Anthropic', label: 'Claude Anthropic' },
                    { id: 'Google', label: 'Google Gemini' },
                    { id: 'DeepSeek', label: 'DeepSeek R1/V3' },
                    { id: 'Meta', label: 'Meta Llama' },
                    { id: 'xAI', label: 'xAI Grok' },
                    { id: 'Mistral', label: 'Mistral AI' },
                    { id: 'Qwen', label: 'Qwen Alibaba' },
                    { id: 'Perplexity', label: 'Perplexity' },
                    { id: 'Stability', label: 'Arte & Imágenes' },
                    { id: 'Runway', label: 'Video Cinema' },
                    { id: 'AudioAI', label: 'Voz & Audio' },
                    { id: 'Moonshot', label: 'Moonshot Kimi' },
                    { id: '01AI', label: '01.AI' },
                    { id: 'Microsoft', label: 'Microsoft' },
                    { id: 'Nvidia', label: 'NVIDIA' },
                    { id: 'Cohere', label: 'Cohere' },
                    { id: 'Amazon', label: 'AWS Nova' },
                    { id: 'AI21', label: 'AI21' },
                    { id: 'Baidu', label: 'Baidu' },
                    { id: 'ChepeIA', label: 'Chepe Motors' }
                  ].map((tab) => {
                    const count = tab.id === 'all' 
                      ? AI_MODEL_OPTIONS.length 
                      : AI_MODEL_OPTIONS.filter(m => m.provider === tab.id).length;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setWelcomeModelFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer text-xs flex items-center gap-1.5 ${
                          welcomeModelFilter === tab.id
                            ? 'bg-[#00E5FF] text-stone-950 font-bold shadow-md shadow-cyan-950/60 scale-[1.02]'
                            : 'bg-[#050A14] text-stone-400 hover:text-white border border-cyan-900/60 hover:bg-[#0E1B33]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.id !== 'all' && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            welcomeModelFilter === tab.id ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-950 text-cyan-400'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Full Grid of Model Cards with Photos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto pr-1">
                  {AI_MODEL_OPTIONS.filter((m) => {
                    const matchesProvider = welcomeModelFilter === 'all' || m.provider === welcomeModelFilter;
                    const q = modelSearchQuery.toLowerCase().trim();
                    const matchesSearch = !q ||
                      m.name.toLowerCase().includes(q) ||
                      m.description.toLowerCase().includes(q) ||
                      m.badge.toLowerCase().includes(q) ||
                      (m.provider && m.provider.toLowerCase().includes(q)) ||
                      (m.tags && m.tags.some(t => t.toLowerCase().includes(q)));
                    return matchesProvider && matchesSearch;
                  }).map((m) => {
                    const isSelected = selectedModel === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id as AIModelId);
                          showToast(`Motor activo: ${m.name}`);
                        }}
                        className={`p-3 rounded-2xl border flex flex-col justify-between gap-2.5 transition-all text-left cursor-pointer group relative overflow-hidden ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#002C3E] to-[#081829] border-[#00E5FF] shadow-lg shadow-cyan-950/80 ring-2 ring-[#00E5FF]/40'
                            : 'bg-[#050A14] border-cyan-950 hover:border-cyan-800 hover:bg-[#0B172E]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#00E5FF] text-stone-950 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            <Check className="w-3 h-3" /> ACTIVO
                          </div>
                        )}

                        <div className="flex items-start gap-2.5">
                          <ModelAvatar model={m} size="md" showBadge />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-[#00E5FF] transition-colors">
                              {m.name}
                            </h4>
                            <span className="text-[10px] text-cyan-400 font-mono block">
                              {m.provider || 'AI Engine'}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-2">
                          {m.description}
                        </p>

                        <div className="space-y-1.5 pt-1 border-t border-cyan-950/60">
                          {m.tags && m.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {m.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#0D1E3A] text-cyan-300 font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                            <span className="text-cyan-400/90 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400" />
                              {m.speed}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#0A162C] text-stone-300 text-[9px] border border-cyan-900/50">
                              {m.badge}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 w-full pb-4">
              {messages.map((msg) => {
                const isAI = msg.sender === 'chepe_ia';
                const msgModel = AI_MODEL_OPTIONS.find(m => m.id === (msg.modelUsed || selectedModel)) || currentModelData;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 text-xs sm:text-sm ${
                      isAI ? 'items-start' : 'items-end flex-row-reverse'
                    }`}
                  >
                    {isAI ? (
                      <div className="shrink-0 pt-0.5">
                        <ModelAvatar model={msgModel} size="sm" showBadge />
                      </div>
                    ) : (
                      userProfile?.avatarUrl ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-cyan-400 shadow-md bg-[#081021]">
                          <img
                            src={userProfile.avatarUrl}
                            alt={userProfile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold shadow-md bg-blue-600 text-white">
                          <User className="w-4 h-4" />
                        </div>
                      )
                    )}

                    <div className={`space-y-2 max-w-[88%] ${isAI ? 'w-full' : ''}`}>
                      <div
                        className={`p-4 rounded-2xl border shadow-md space-y-2 ${
                          isAI
                            ? 'bg-[#0F1C36] border-cyan-900 text-stone-100 rounded-tl-none'
                            : 'bg-[#00E5FF] text-stone-950 font-medium border-cyan-400 rounded-tr-none ml-auto'
                        }`}
                      >
                        {/* Model Identification Header for Assistant Messages */}
                        {isAI && (
                          <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-cyan-900/50 text-[10px] font-mono text-cyan-400">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse shrink-0" />
                              <span className="font-bold text-white truncate">{msgModel.name}</span>
                              {msgModel.provider && (
                                <span className="px-1.5 py-0.2 rounded bg-[#0A162C] text-stone-300 border border-cyan-900/60 shrink-0">
                                  {msgModel.provider}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                              {msgModel.badge}
                            </span>
                          </div>
                        )}

                        {/* Reasoning Chain Accordion */}
                        {msg.reasoningChain && msg.reasoningChain.length > 0 && (
                          <div className="mb-2 rounded-xl bg-[#081021] border border-cyan-800/80 p-2.5 text-xs">
                            <button
                              onClick={() =>
                                setExpandedReasoningIds(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))
                              }
                              className="w-full flex items-center justify-between text-cyan-300 font-bold hover:text-[#00E5FF] transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                                <span>Pensamiento de Chepe O1 ({((msg.thinkingTimeMs || 2500) / 1000).toFixed(1)}s)</span>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  expandedReasoningIds[msg.id] ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {expandedReasoningIds[msg.id] && (
                              <div className="mt-2 pt-2 border-t border-cyan-900/60 space-y-1.5 text-[11px] font-mono text-stone-300">
                                {msg.reasoningChain.map((step, sIdx) => (
                                  <div key={sIdx} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {msg.fileData && (
                          <div className="p-2.5 rounded-xl bg-[#050A14] border border-cyan-800/80 text-xs text-cyan-300 flex items-center gap-2 font-mono">
                            <Paperclip className="w-4 h-4 text-[#00E5FF]" />
                            <span className="truncate">{msg.fileData.name} ({msg.fileData.size})</span>
                          </div>
                        )}

                        {msg.imageUrl && (
                          <div className="my-1.5 rounded-lg overflow-hidden border border-cyan-500/40 max-w-sm">
                            <img src={msg.imageUrl} alt="Adjunto" referrerPolicy="no-referrer" className="w-full max-h-64 object-contain bg-[#050A14]" />
                          </div>
                        )}

                        {/* Generated AI Image Card (DALL-E 3 / FLUX Pro Style) */}
                        {msg.generatedImageUrl && (
                          <GeneratedImageCard
                            imageUrl={msg.generatedImageUrl}
                            prompt={msg.generatedImagePrompt}
                            metadata={msg.generatedImageMetadata}
                            onOpenLightbox={(url) => setLightboxImage(url)}
                            onRegenerate={(prompt) => handleSendMessage(`Genera una nueva versión en ultra HD de: ${prompt}`)}
                          />
                        )}

                        {/* Interactive Data Analyst Chart */}
                        {msg.chartData && (
                          <DataAnalystCard payload={msg.chartData} />
                        )}

                        {/* Interactive AI Video Card */}
                        {msg.videoData && (
                          <VideoPlayerCard
                            video={msg.videoData}
                            onAskAIRemix={(remixPrompt) => handleSendMessage(remixPrompt)}
                          />
                        )}

                        <div className="leading-relaxed">
                          {!isAI && editingMsgId === msg.id ? (
                            <div className="space-y-2 py-1">
                              <textarea
                                value={editingMsgText}
                                onChange={(e) => setEditingMsgText(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-[#050A14] text-white border border-cyan-800 text-xs font-mono focus:outline-none focus:border-[#00E5FF] resize-none"
                                rows={2}
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingMsgId(null)}
                                  className="px-2.5 py-1 rounded-lg bg-stone-900 text-stone-400 text-[11px] font-bold hover:text-white"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditedMessage(msg.id)}
                                  className="px-3 py-1 rounded-lg bg-[#00E5FF] text-stone-950 text-[11px] font-black hover:bg-cyan-300"
                                >
                                  Guardar y Re-enviar
                                </button>
                              </div>
                            </div>
                          ) : isAI ? (
                            <>
                              {/* Deep Research Process Summary Card */}
                              {msg.isDeepResearch && (
                                <div className="mb-3 p-3 rounded-2xl bg-[#08152B] border border-cyan-500/40 space-y-2">
                                  <div className="flex items-center justify-between text-xs font-bold text-[#00E5FF]">
                                    <div className="flex items-center gap-1.5">
                                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                      <span>Deep Research: Informe Técnico & Síntesis</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                                      Exhaustivo
                                    </span>
                                  </div>
                                  {msg.deepResearchSteps && msg.deepResearchSteps.length > 0 && (
                                    <div className="space-y-1.5 pt-1 text-[11px]">
                                      {msg.deepResearchSteps.map((step, sIdx) => (
                                        <div key={sIdx} className="flex items-start gap-2 text-stone-300">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                          <div className="flex-1">
                                            <span className="font-semibold text-white">{step.title}</span>
                                            {step.detail && <p className="text-[10px] text-stone-400">{step.detail}</p>}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                              {renderMessageContent(msg.text)}
                            </>
                          ) : (
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          )}
                        </div>

                        {/* Interactive Canvas Trigger Button */}
                        {isAI && msg.canvasData && (
                          <button
                            onClick={() => setCanvasArtifact(msg.canvasData!)}
                            className="mt-3 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#081830] to-[#0B2447] hover:from-[#0F2850] hover:to-[#123260] border border-[#00E5FF]/60 text-[#00E5FF] text-xs font-extrabold flex items-center justify-between shadow-lg shadow-cyan-950/50 group transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Layout className="w-4 h-4 text-[#00E5FF]" />
                              <span>Abrir en Canvas Interactivo (Live UI & Code Editor)</span>
                            </div>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}

                        {/* Web Search Citations */}
                        {msg.webCitations && msg.webCitations.length > 0 && (
                          <div className="pt-2 border-t border-cyan-950 flex flex-wrap gap-1.5">
                            <span className="text-[10px] text-stone-400 font-bold uppercase mr-1">Fuentes Web:</span>
                            {msg.webCitations.map((cit, cIdx) => (
                              <a
                                key={cIdx}
                                href={cit.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 rounded bg-[#050A14] text-cyan-300 text-[10px] font-mono border border-cyan-800 hover:border-[#00E5FF] flex items-center gap-1 transition-colors"
                              >
                                <Globe className="w-3 h-3 text-[#00E5FF]" />
                                <span>{cit.domain}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {!isAI ? (
                        <div className="flex items-center justify-end gap-2 text-stone-400 text-xs px-1">
                          {/* User Message Version Branch Indicator */}
                          {msg.versions && msg.versions.length > 1 && (
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#060C1B] border border-cyan-900/60 text-[10px] font-mono text-cyan-300 mr-1">
                              <button
                                onClick={() => handleSwitchMessageVersion(msg.id, 'prev')}
                                disabled={(msg.activeVersionIndex ?? (msg.versions.length - 1)) <= 0}
                                className="hover:text-white disabled:opacity-30 cursor-pointer px-0.5"
                                title="Versión de prompt anterior"
                              >
                                ‹
                              </button>
                              <span>
                                {(msg.activeVersionIndex ?? (msg.versions.length - 1)) + 1}/{msg.versions.length}
                              </span>
                              <button
                                onClick={() => handleSwitchMessageVersion(msg.id, 'next')}
                                disabled={(msg.activeVersionIndex ?? (msg.versions.length - 1)) >= msg.versions.length - 1}
                                className="hover:text-white disabled:opacity-30 cursor-pointer px-0.5"
                                title="Versión de prompt siguiente"
                              >
                                ›
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setEditingMsgId(msg.id);
                              setEditingMsgText(msg.text);
                            }}
                            className="hover:text-cyan-300 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Editar mensaje"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                          <span className="text-[10px] text-stone-500">{msg.timestamp}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3 px-1 text-stone-400 text-xs">
                            <button
                              onClick={() => handleCopyText(msg.text, msg.id)}
                              className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer"
                              title="Copiar respuesta"
                            >
                              {copiedMsgId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span className="text-[10px]">{copiedMsgId === msg.id ? 'Copiado' : 'Copiar'}</span>
                            </button>

                            <button
                              onClick={() => setReadAloudText(msg.text)}
                              className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer"
                              title="Escuchar en voz alta (ChatGPT Read Aloud)"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                              <span className="text-[10px] text-cyan-300">Voz Alta</span>
                            </button>

                            {/* Thumbs Up / Thumbs Down ChatGPT Feedback */}
                            <button
                              onClick={() => handleRateMessage(msg.id, 'up')}
                              className={`p-1 rounded hover:text-emerald-400 transition-colors cursor-pointer ${
                                messageRatings[msg.id] === 'up' ? 'text-emerald-400 bg-emerald-950/60' : 'hover:bg-[#081021]'
                              }`}
                              title="Buena respuesta"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleRateMessage(msg.id, 'down')}
                              className={`p-1 rounded hover:text-rose-400 transition-colors cursor-pointer ${
                                messageRatings[msg.id] === 'down' ? 'text-rose-400 bg-rose-950/60' : 'hover:bg-[#081021]'
                              }`}
                              title="Mala respuesta o inexacta (Dar Feedback)"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={handleRegenerateResponse}
                              className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer"
                              title="Regenerar respuesta con Chepe IA"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="text-[10px]">Regenerar</span>
                            </button>

                            {/* ChatGPT Version Branch Indicator */}
                            {msg.versions && msg.versions.length > 1 ? (
                              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#060C1B] border border-cyan-700/80 text-[10px] font-mono text-cyan-300">
                                <button
                                  onClick={() => handleSwitchMessageVersion(msg.id, 'prev')}
                                  disabled={(msg.activeVersionIndex ?? (msg.versions.length - 1)) <= 0}
                                  className="hover:text-white disabled:opacity-30 cursor-pointer px-0.5"
                                  title="Versión de respuesta anterior"
                                >
                                  ‹
                                </button>
                                <span>
                                  {(msg.activeVersionIndex ?? (msg.versions.length - 1)) + 1}/{msg.versions.length}
                                </span>
                                <button
                                  onClick={() => handleSwitchMessageVersion(msg.id, 'next')}
                                  disabled={(msg.activeVersionIndex ?? (msg.versions.length - 1)) >= msg.versions.length - 1}
                                  className="hover:text-white disabled:opacity-30 cursor-pointer px-0.5"
                                  title="Versión de respuesta siguiente"
                                >
                                  ›
                                </button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#060C1B] border border-cyan-900/60 text-[10px] font-mono text-stone-500">
                                <span>‹ 1/1 ›</span>
                              </div>
                            )}

                            <span className="text-[10px] text-stone-500 ml-auto">{msg.timestamp}</span>
                          </div>

                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {msg.suggestions.map((sug, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (sug.includes('Abrir configuración de Clave API')) {
                                      setIsApiKeyModalOpen(true);
                                    } else if (sug.includes('Usar conexión del Servidor')) {
                                      clearStoredApiKey();
                                      showToast('✅ Restablecido al servidor por defecto');
                                    } else {
                                      handleSendMessage(sug);
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#081021] hover:bg-[#0F1C36] border border-cyan-900/80 text-[11px] text-cyan-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  ↳ {sug}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="p-4 rounded-2xl bg-[#081021] border border-cyan-500/50 shadow-2xl space-y-3 max-w-md animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-black text-[#00E5FF]">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Chepe IA ({currentModelData.name}) razonando...</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    {isReasoningMode && (
                      <div className="flex items-center gap-2 text-purple-300">
                        <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                        <span>Generando cadena de razonamiento O1...</span>
                      </div>
                    )}
                    {isWebSearchMode && (
                      <div className="flex items-center gap-2 text-cyan-300">
                        <Globe className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" />
                        <span>Buscando datos web en tiempo real...</span>
                      </div>
                    )}
                    {isImageMode && (
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Palette className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Generando render en lienzo DALL-E 3...</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-stone-400">
                      <Bot className="w-3.5 h-3.5 text-[#00E5FF] animate-bounce" />
                      <span>Escribiendo respuesta en Markdown...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ATTACHMENTS PREVIEW */}
        {(attachedImage || attachedFile) && (
          <div className="bg-[#080E1C] p-2 px-4 border-t border-cyan-900 max-w-3xl mx-auto w-full flex items-center justify-between shrink-0 rounded-t-xl">
            <div className="flex items-center gap-2">
              {attachedImage ? (
                <img src={attachedImage} alt="Vista previa" className="w-10 h-10 object-cover rounded-lg border border-cyan-500" />
              ) : (
                <div className="p-2 rounded-lg bg-[#050A14] border border-cyan-800 text-cyan-300 text-xs font-mono">
                  📄 {attachedFile?.name}
                </div>
              )}
              <span className="text-xs text-cyan-200">Adjunto listo para enviar a Chepe IA</span>
            </div>
            <button
              onClick={() => { setAttachedImage(null); setAttachedFile(null); }}
              className="p-1 text-rose-400 hover:text-rose-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 3. INPUT CAPSULE WITH ADVANCED TOGGLES */}
        <div className="p-3 bg-[#050A14] border-t border-cyan-900/40 shrink-0 space-y-2">
          {/* Active Custom GPT Banner */}
          {selectedCustomGpt && (
            <div className="max-w-3xl mx-auto w-full px-3 py-1.5 rounded-xl bg-[#09152C] border border-cyan-500/40 flex items-center justify-between text-xs text-cyan-200">
              <div className="flex items-center gap-2">
                <span className="text-base">{selectedCustomGpt.avatarEmoji}</span>
                <span className="font-extrabold text-[#00E5FF]">{selectedCustomGpt.name}</span>
                <span className="text-[10px] text-stone-400 font-mono">({selectedCustomGpt.author})</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomGpt(null)}
                className="p-1 rounded text-stone-400 hover:text-white"
                title="Quitar GPT personalizado"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Advanced ChatGPT Mode Toggles */}
          <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-2 px-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReasoningMode(!isReasoningMode)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isReasoningMode
                    ? 'bg-purple-950 text-purple-300 border-purple-500 shadow-md shadow-purple-900/40'
                    : 'bg-[#0B132B] text-stone-400 border-cyan-900/60 hover:text-cyan-300'
                }`}
                title="Modo Razonamiento Profundo O1 (Muestra cadena de pensamiento)"
              >
                <Cpu className={`w-3.5 h-3.5 ${isReasoningMode ? 'text-purple-400 animate-pulse' : ''}`} />
                <span>Razonamiento O1</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWebSearchMode(!isWebSearchMode)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isWebSearchMode
                    ? 'bg-blue-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-900/40'
                    : 'bg-[#0B132B] text-stone-400 border-cyan-900/60 hover:text-cyan-300'
                }`}
                title="Búsqueda Web en Vivo (Cita fuentes y datos actualizados)"
              >
                <Globe className={`w-3.5 h-3.5 ${isWebSearchMode ? 'text-[#00E5FF] animate-spin' : ''}`} />
                <span>Búsqueda Web</span>
              </button>

              <button
                type="button"
                onClick={() => setIsImageMode(!isImageMode)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isImageMode
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-900/40'
                    : 'bg-[#0B132B] text-stone-400 border-cyan-900/60 hover:text-cyan-300'
                }`}
                title="Generar Imagen con DALL-E 3"
              >
                <Palette className={`w-3.5 h-3.5 ${isImageMode ? 'text-emerald-400 animate-pulse' : ''}`} />
                <span>🎨 Generar Imagen</span>
              </button>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
                  if (lastUserMsg) handleSendMessage(lastUserMsg.text);
                }}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-[#0B132B] hover:bg-[#152442] text-stone-300 border border-cyan-900/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Regenerar última respuesta de la IA"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Regenerar</span>
              </button>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-3xl mx-auto w-full relative"
          >
            {/* Active Custom GPT Banner */}
            {selectedCustomGpt && (
              <div className="mb-2 p-2 rounded-2xl bg-gradient-to-r from-cyan-950/90 via-[#0B1E3B] to-cyan-950/90 border border-cyan-500/50 flex items-center justify-between shadow-lg animate-fadeIn">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-xl p-1 rounded-xl bg-cyan-900/60 border border-cyan-700">{selectedCustomGpt.avatarEmoji}</span>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{selectedCustomGpt.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-[#00E5FF] text-[9px] font-mono font-bold">GPT ACTIVO</span>
                    </div>
                    <p className="text-[10px] text-stone-400 truncate">{selectedCustomGpt.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomGpt(null);
                    showToast('Cambiado al modelo estándar GPT-4o');
                  }}
                  className="px-2 py-1 rounded-xl bg-[#081021] hover:bg-red-950/60 text-stone-400 hover:text-red-300 border border-cyan-900/60 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ml-2"
                  title="Salir de este GPT personalizado"
                >
                  <X className="w-3 h-3" />
                  <span className="hidden sm:inline">Desactivar GPT</span>
                </button>
              </div>
            )}

            {/* Attached Image or File Preview Chip */}
            {(attachedImage || attachedFile) && (
              <div className="mb-2 flex flex-wrap gap-2 animate-fadeIn">
                {attachedImage && (
                  <div className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-[#0B152B] border border-[#00E5FF]/60 text-xs text-stone-200 shadow-md">
                    <img src={attachedImage} alt="Adjunto" className="w-8 h-8 rounded-lg object-cover bg-black" />
                    <span className="text-[11px] font-medium text-cyan-300 truncate max-w-[120px]">Imagen lista para análisis</span>
                    <button
                      type="button"
                      onClick={() => setAttachedImage(null)}
                      className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {attachedFile && (
                  <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-2xl bg-[#0B152B] border border-[#00E5FF]/60 text-xs text-stone-200 shadow-md">
                    <Paperclip className="w-4 h-4 text-[#00E5FF] shrink-0" />
                    <span className="text-[11px] font-mono text-cyan-300 truncate max-w-[150px]">{attachedFile.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono">({attachedFile.size})</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ChatGPT Quick Feature Pills Toolbar */}
            <div className="mb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsDeepResearchMode(!isDeepResearchMode);
                  showToast(isDeepResearchMode ? 'Deep Research desactivado' : '🔬 Deep Research activado: Búsqueda y síntesis profunda');
                }}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isDeepResearchMode
                    ? 'bg-cyan-950 text-[#00E5FF] border-[#00E5FF] shadow-sm shadow-cyan-500/30'
                    : 'bg-[#081021] text-stone-400 border-cyan-950 hover:border-cyan-800 hover:text-stone-200'
                }`}
              >
                <FileSearch className={`w-3.5 h-3.5 ${isDeepResearchMode ? 'text-[#00E5FF] animate-pulse' : 'text-stone-400'}`} />
                <span>Deep Research</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsWebSearchMode(!isWebSearchMode);
                  showToast(isWebSearchMode ? 'Búsqueda web desactivada' : '🌐 Búsqueda web en vivo activada');
                }}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isWebSearchMode
                    ? 'bg-[#002C3E] text-[#00E5FF] border-[#00E5FF] shadow-sm shadow-cyan-500/30'
                    : 'bg-[#081021] text-stone-400 border-cyan-950 hover:border-cyan-800 hover:text-stone-200'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${isWebSearchMode ? 'text-[#00E5FF]' : 'text-stone-400'}`} />
                <span>Buscar en la Web</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsReasoningMode(!isReasoningMode);
                  showToast(isReasoningMode ? 'Razonamiento desactivado' : '🧠 Razonamiento Profundo O1 activado');
                }}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isReasoningMode
                    ? 'bg-purple-950/90 text-purple-300 border-purple-500 shadow-sm shadow-purple-500/30'
                    : 'bg-[#081021] text-stone-400 border-cyan-950 hover:border-cyan-800 hover:text-stone-200'
                }`}
              >
                <Cpu className={`w-3.5 h-3.5 ${isReasoningMode ? 'text-purple-400' : 'text-stone-400'}`} />
                <span>Razonar (o1)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsImageMode(!isImageMode);
                  showToast(isImageMode ? 'Modo texto activado' : '🎨 Modo DALL-E 3 para generación de imágenes');
                }}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isImageMode
                    ? 'bg-pink-950/90 text-pink-300 border-pink-500 shadow-sm shadow-pink-500/30'
                    : 'bg-[#081021] text-stone-400 border-cyan-950 hover:border-cyan-800 hover:text-stone-200'
                }`}
              >
                <Palette className={`w-3.5 h-3.5 ${isImageMode ? 'text-pink-400' : 'text-stone-400'}`} />
                <span>Crear Imagen DALL-E 3</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onNavigateTab) {
                    onNavigateTab('video');
                  } else {
                    setSelectedModel('sora-video');
                    showToast('🎬 Modo Video Sora Activado');
                  }
                }}
                className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-950/80 to-purple-950/80 text-rose-300 hover:text-white border border-rose-800/80 hover:border-rose-400 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <Clapperboard className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Generar Video Sora</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onNavigateTab) {
                    onNavigateTab('web');
                  } else {
                    setIsWebSearchMode(true);
                    showToast('🌐 Herramientas Web Activadas');
                  }
                }}
                className="px-2.5 py-1 rounded-full bg-[#081021] text-stone-400 hover:text-[#00E5FF] border border-cyan-950 hover:border-cyan-700 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Compass className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Herramientas Web</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGptsModalOpen(true)}
                className="px-2.5 py-1 rounded-full bg-[#081021] text-stone-400 hover:text-cyan-300 border border-cyan-950 hover:border-cyan-800 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Bot className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Explorar GPTs</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMemoryModalOpen(true)}
                className="px-2.5 py-1 rounded-full bg-[#081021] text-stone-400 hover:text-purple-300 border border-cyan-950 hover:border-purple-800 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Memoria IA</span>
              </button>

              <button
                type="button"
                onClick={() => setIsProjectsModalOpen(true)}
                className="px-2.5 py-1 rounded-full bg-[#081021] text-stone-400 hover:text-indigo-300 border border-cyan-950 hover:border-indigo-800 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Carpetas</span>
              </button>
            </div>

            {/* DALL-E 3 / FLUX Pro Style & Aspect Ratio Controls */}
            {isImageMode && (
              <div className="mb-2 p-3 rounded-2xl bg-gradient-to-r from-[#0D0A1E] via-[#120D2A] to-[#0A152A] border border-pink-500/40 shadow-xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-pink-400">
                      <Palette className="w-3.5 h-3.5 text-pink-400" />
                      <span>Formato:</span>
                    </div>
                    {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setImageAspectRatio(ratio as any)}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          imageAspectRatio === ratio
                            ? 'bg-pink-600 text-white shadow-md shadow-pink-600/40 ring-1 ring-pink-400'
                            : 'bg-[#050A14] text-stone-400 hover:text-white border border-stone-800'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-pink-400">Estilo:</span>
                    {[
                      { id: 'fotorrealista', label: '📸 Fotorrealista 8K' },
                      { id: 'cinematic', label: '🎬 Cine 35mm' },
                      { id: 'cyberpunk', label: '🌆 Cyberpunk' },
                      { id: 'anime', label: '🎨 Anime Ghibli' },
                      { id: '3d-render', label: '🧸 3D Pixar' },
                      { id: 'oleo', label: '🖼️ Óleo Clásico' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setImageStyle(st.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                          imageStyle === st.id
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md font-bold'
                            : 'bg-[#050A14] text-stone-400 hover:text-white border border-stone-800'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Inspiration Prompt Chips for Image Mode */}
                <div className="pt-1.5 border-t border-pink-950/60 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
                  <span className="text-[10px] font-bold text-cyan-400 shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#00E5FF]" /> Ideas:
                  </span>
                  {[
                    { label: '🦁 León cibernético 8K', prompt: 'Retrato cinematográfico de un león cibernético majestuoso con armadura dorada y neones en Tokio de noche' },
                    { label: '🚀 Astronauta en Marte', prompt: 'Fotografía ultra detallada de un astronauta descubriendo un templo alienígena brillante en el cañón de Marte' },
                    { label: '🏰 Castillo flotante Ghibli', prompt: 'Castillo medieval flotando entre nubes al atardecer, cascadas de agua cristalina, estilo Studio Ghibli' },
                    { label: '🏎️ Superdeportivo en lluvia', prompt: 'Superdeportivo futurista de carreras acelerando sobre asfalto mojado reflejando rascacielos neón' }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInput(chip.prompt)}
                      className="px-2.5 py-1 rounded-full bg-[#081024] hover:bg-cyan-950 text-cyan-300 hover:text-white border border-cyan-900/80 hover:border-[#00E5FF] text-[10px] font-medium whitespace-nowrap transition-all cursor-pointer shrink-0"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Limit Reached Warning Banner */}
            {hasReachedLimit && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/90 via-[#260B12] to-[#17060A] border border-red-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-xl bg-red-900/60 border border-red-500 flex items-center justify-center text-red-300 shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white">
                      {isGuestUser ? 'Límite de Invitado Alcanzado (20/20 mensajes)' : `Límite Diario Alcanzado (${dailyCount}/${maxDailyLimit} mensajes)`}
                    </h5>
                    <p className="text-[11px] text-red-200">
                      {isGuestUser
                        ? 'Crea tu propia cuenta gratuita ahora para desbloquear 1,000 mensajes diarios.'
                        : 'Tu cuota diaria se renovará en 24 horas o puedes configurar tu clave API.'}
                    </p>
                  </div>
                </div>

                {isGuestUser && onOpenAuthModal && (
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('register')}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 shrink-0 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Crear Cuenta (1,000 mensajes)</span>
                  </button>
                )}
              </div>
            )}

            {/* Slash Commands Floating Autocomplete Menu */}
            {input.startsWith('/') && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#060C1B] border border-cyan-500/50 rounded-2xl shadow-2xl p-2 z-30 max-h-64 overflow-y-auto divide-y divide-cyan-950/60 animate-fadeIn font-sans">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-[#00E5FF] uppercase flex items-center justify-between">
                  <span>Atajos de Comando (Slash Commands)</span>
                  <span className="text-stone-500 font-normal">Haz clic para aplicar atajo</span>
                </div>
                {SLASH_COMMANDS.filter(c => c.cmd.toLowerCase().startsWith(input.toLowerCase().trim())).map((cmd) => (
                  <button
                    key={cmd.cmd}
                    type="button"
                    onClick={() => setInput(cmd.prompt)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#0E1C36] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{cmd.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#00E5FF] flex items-center gap-2">
                          <span className="font-mono text-cyan-400">{cmd.cmd}</span>
                          <span>•</span>
                          <span>{cmd.label}</span>
                        </div>
                        <p className="text-[11px] text-stone-400">{cmd.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0B132B] border border-cyan-800/80 focus-within:border-[#00E5FF] focus-within:ring-1 focus-within:ring-[#00E5FF] transition-all shadow-xl">
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-8 h-8 rounded-full bg-[#050A14] hover:bg-[#00E5FF] hover:text-stone-950 text-cyan-300 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Adjuntar imagen"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".txt,.js,.ts,.py,.json,.html,.css,.csv,.md"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-full bg-[#050A14] hover:bg-[#00E5FF] hover:text-stone-950 text-cyan-300 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Adjuntar archivo de código o texto"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Dictate Voice-to-Text Button (MediaRecorder API) */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-500/50'
                    : 'bg-[#050A14] hover:bg-[#00E5FF] hover:text-stone-950 text-cyan-300'
                }`}
                title={isRecordingVoice ? "Detener y transcribir grabación" : "Dictar prompt por voz (MediaRecorder)"}
              >
                {isRecordingVoice ? (
                  <Square className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Advanced Voice Chat Mode Overlay Trigger */}
              <button
                type="button"
                onClick={() => setIsVoiceModeOpen(true)}
                className="w-8 h-8 rounded-full bg-[#050A14] hover:bg-purple-600 hover:text-white text-purple-300 flex items-center justify-center shrink-0 transition-colors cursor-pointer hidden sm:flex"
                title="Modo Conversación de Voz en Vivo"
              >
                <Radio className="w-4 h-4" />
              </button>

              {isRecordingVoice ? (
                <div className="flex-1 flex items-center justify-between gap-2 px-3 py-1 bg-red-950/40 border border-red-500/50 rounded-2xl animate-fadeIn">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span className="text-xs font-mono font-bold text-red-400 shrink-0">
                      {Math.floor(recordingDuration / 60)}:{String(recordingDuration % 60).padStart(2, '0')}
                    </span>
                    <div className="hidden sm:flex items-center gap-0.5 px-1 py-0.5 shrink-0">
                      <span className="w-1 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                      <span className="w-1 h-5 bg-red-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-1 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                      <span className="w-1 h-4 bg-red-400 rounded-full animate-bounce [animation-delay:450ms]"></span>
                    </div>
                    <p className="text-xs text-stone-200 truncate italic">
                      {interimVoiceTranscript || "Escuchando... di tu prompt"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={cancelVoiceRecording}
                      className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                      title="Cancelar grabación"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="px-2.5 py-0.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow cursor-pointer"
                      title="Guardar y dictar texto en el prompt"
                    >
                      <Check className="w-3 h-3" />
                      <span>Listo</span>
                    </button>
                  </div>
                </div>
              ) : isTranscribingAudio ? (
                <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl text-cyan-300 text-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-[#00E5FF] shrink-0" />
                  <span>Transcribiendo tu audio con Inteligencia Artificial...</span>
                </div>
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isImageMode
                      ? "Describe la imagen que quieres que DALL-E 3 dibuje..."
                      : selectedCustomGpt
                      ? `Hablando con ${selectedCustomGpt.name}...`
                      : "Escribe tu mensaje o usa el micrófono para dictar..."
                  }
                  className="flex-1 bg-transparent text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none px-2"
                  disabled={isLoading}
                />
              )}

              {/* Magic Prompt Optimizer Button (ChatGPT Plus feature) */}
              {input.trim().length > 3 && (
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancingPrompt}
                  className="p-1.5 rounded-full bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow"
                  title="Optimizar y enriquecer este prompt con IA"
                >
                  {isEnhancingPrompt ? (
                    <Loader2 className="w-3.5 h-3.5 text-indigo-300 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 text-indigo-300" />
                  )}
                </button>
              )}

              <button
                type="submit"
                disabled={(!input.trim() && !attachedImage && !attachedFile) || isLoading}
                className="w-9 h-9 rounded-full bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 flex items-center justify-center shrink-0 font-bold shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-stone-500 text-center mt-2">
              Chepe IA es una plataforma de Inteligencia Artificial para tareas, programación, matemáticas y asistencia web.
            </p>
          </form>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-[#08152E] border border-[#00E5FF]/70 text-[#00E5FF] font-semibold text-xs shadow-2xl shadow-cyan-950/90 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <Sparkles className="w-4 h-4 text-[#00E5FF] animate-spin" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* MODALS AND OVERLAYS */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <FeedbackModal
        isOpen={!!feedbackMessageId}
        messageId={feedbackMessageId || ''}
        onClose={() => setFeedbackMessageId(null)}
        onSubmitFeedback={handleSubmitFeedback}
      />

      <VoiceModeOverlay
        isOpen={isVoiceModeOpen}
        onClose={() => setIsVoiceModeOpen(false)}
        onSendVoiceMessage={async (voicePrompt) => {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userPrompt: voicePrompt,
              modelId: selectedModel,
              specialty: selectedCategory
            })
          });
          const data = await res.json();
          return data.text || 'Respuesta generada.';
        }}
      />

      <CustomGptsModal
        isOpen={isGptsModalOpen}
        onClose={() => setIsGptsModalOpen(false)}
        onSelectGpt={(gpt) => {
          setSelectedCustomGpt(gpt);
          setSelectedCategory(gpt.category as PromptSpecialty || 'general');
        }}
      />

      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
      />

      <ShareChatModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        messages={messages}
      />

      <CustomInstructionsModal
        isOpen={isCustomInstructionsOpen}
        onClose={() => setIsCustomInstructionsOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => showToast('¡Clave de API guardada y activada!')}
      />

      <ProjectFoldersModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={(id) => setSelectedFolderId(id)}
        onCreateFolder={(name, color, instructions) => handleCreateFolder(name, color, instructions)}
        onSaveFolder={(folder) => folder.name && handleCreateFolder(folder.name, folder.color || '#00E5FF', folder.customInstructions)}
        onDeleteFolder={(folderId) => handleDeleteFolder(folderId)}
      />

      <ExportChatModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        messages={messages}
        chatTitle={chatHistory[0]?.title || 'Conversación Chepe IA'}
      />

      {readAloudText && (
        <ReadAloudPlayer
          text={readAloudText}
          onClose={() => setReadAloudText(null)}
        />
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-stone-900/80 text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={lightboxImage} alt="Generada en HD" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
};
