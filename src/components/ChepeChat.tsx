import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AIModelId, PromptSpecialty, CustomServerConfig, UploadedFileItem, CustomGpt } from '../types';
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
import {
  Bot, Send, Sparkles, User, Volume2, VolumeX, Plus, Image as ImageIcon,
  X, ChevronDown, Settings, Check, Copy, MessageSquare, PanelLeftClose,
  PanelLeft, Lightbulb, Search, Trash2, Mic, MicOff, ThumbsUp, ThumbsDown,
  Paperclip, Terminal, Play, Globe, Cpu, Layout, RotateCcw, ExternalLink,
  ChevronRight, Share2, FileCode, CheckCircle2, Shield, BarChart3, Download,
  Maximize2, Palette, Radio, Wand2, Brain, Edit3, Sliders, Pin, PinOff,
  Keyboard, Edit2, Loader2
} from 'lucide-react';

interface ChepeChatProps {
  initialPrompt?: string;
  customConfig?: CustomServerConfig;
  onOpenConfig?: () => void;
  onNavigateTab?: (tab: string) => void;
  attachedFileForChat?: UploadedFileItem | null;
}

export const ChepeChat: React.FC<ChepeChatProps> = ({
  initialPrompt,
  customConfig,
  onOpenConfig,
  onNavigateTab,
  attachedFileForChat
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [historySearch, setHistorySearch] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Advanced ChatGPT-Surpassing Toggles
  const [isReasoningMode, setIsReasoningMode] = useState(false);
  const [isWebSearchMode, setIsWebSearchMode] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [isGptsModalOpen, setIsGptsModalOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCustomInstructionsOpen, setIsCustomInstructionsOpen] = useState(false);
  const [selectedCustomGpt, setSelectedCustomGpt] = useState<CustomGpt | null>(null);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isTemporaryChat, setIsTemporaryChat] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingMsgText, setEditingMsgText] = useState('');

  const [canvasArtifact, setCanvasArtifact] = useState<{
    title: string;
    language: string;
    content: string;
    type?: 'code' | 'document' | 'html';
  } | null>(null);
  const [expandedReasoningIds, setExpandedReasoningIds] = useState<Record<string, boolean>>({});

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
    { id: 'hist-1', title: 'Función en Kotlin con Corrutinas', date: 'Hoy', specialty: 'programacion', firstPrompt: 'Escribe una función en Kotlin con StateFlow para Android' },
    { id: 'hist-2', title: 'Resolución de ecuación cuadrática', date: 'Ayer', specialty: 'matematicas', firstPrompt: 'Resuelve 2x² + 5x - 3 = 0 paso a paso' },
    { id: 'hist-3', title: 'Resumen Segunda Guerra Mundial', date: 'Hace 3 días', specialty: 'tareas', firstPrompt: 'Hazme un resumen educativo de los 5 eventos clave' },
    { id: 'hist-4', title: 'Redacción de correo profesional', date: 'Hace 5 días', specialty: 'escritura', firstPrompt: 'Redacta un correo para solicitar una reunión' }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModelId>('gpt-4o');
  const [selectedCategory, setSelectedCategory] = useState<PromptSpecialty>('general');

  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<UploadedFileItem | null>(attachedFileForChat || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const [dailyCount, setDailyCount] = useState<number>(28);
  const maxDailyLimit = 1000;

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

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta el reconocimiento de voz nativo.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
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
      specialty: selectedCategory
    };

    setMessages(prev => [...prev, userMsg]);

    if (messages.length === 0 && !isTemporaryChat) {
      const titleSnippet = promptText.length > 28 ? promptText.substring(0, 28) + '...' : promptText || (currentFile?.name || 'Nuevo Chat');
      const uniqueHistId = `hist-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setChatHistory(prev => [
        { id: uniqueHistId, title: titleSnippet, date: 'Ahora', specialty: selectedCategory, firstPrompt: promptText },
        ...prev.filter(item => item.id !== uniqueHistId)
      ]);
    }

    setInput('');
    setAttachedImage(null);
    setAttachedFile(null);
    setIsImageMode(false);
    setIsLoading(true);
    setDailyCount(prev => prev + 1);

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
          isReasoningMode: isReasoningMode,
          isWebSearchMode: isWebSearchMode,
          isImageMode: isImageMode,
          customGptSystemPrompt: selectedCustomGpt?.systemPrompt
        })
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const detailedMsg = errorJson.text || errorJson.details || errorJson.error || `Error de conexión (${response.status})`;
        throw new Error(detailedMsg);
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'chepe_ia',
        text: data.text || 'Respuesta generada por Chepe IA.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        customGptUsed: selectedCustomGpt?.name,
        specialty: selectedCategory,
        suggestions: data.suggestions || [],
        reasoningChain: data.reasoningChain,
        thinkingTimeMs: data.thinkingTimeMs,
        webCitations: data.webCitations,
        canvasData: data.canvasData,
        chartData: data.chartData,
        generatedImageUrl: data.generatedImageUrl,
        generatedImagePrompt: data.generatedImagePrompt
      };

      setMessages(prev => [...prev, aiMsg]);
      if (data.reasoningChain && data.reasoningChain.length > 0) {
        setExpandedReasoningIds(prev => ({ ...prev, [aiMsg.id]: true }));
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'chepe_ia',
        text: 'Ocurrió una interrupción temporal en el motor. Intenta enviar de nuevo tu consulta.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEditedMessage = (msgId: string) => {
    if (!editingMsgText.trim()) return;
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    setEditingMsgId(null);
    const newText = editingMsgText.trim();
    setEditingMsgText('');

    // Remove this message and all subsequent messages, then re-send
    setMessages(prev => prev.slice(0, msgIndex));
    handleSendMessage(newText);
  };

  const handleRegenerateResponse = () => {
    if (messages.length === 0 || isLoading) return;
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (!lastUserMsg) return;

    if (messages[messages.length - 1].sender === 'chepe_ia') {
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

  const filteredHistory = chatHistory.filter(h =>
    h.title.toLowerCase().includes(historySearch.toLowerCase()) ||
    h.firstPrompt.toLowerCase().includes(historySearch.toLowerCase())
  );

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
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#152442] transition-colors"
            title="Ocultar menú"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3">
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
        </div>

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
          <div className="flex items-center justify-between text-[11px] text-cyan-300 font-semibold px-2 py-1">
            <span>Uso diario de IA</span>
            <span className="text-white font-bold">{dailyCount} / {maxDailyLimit}</span>
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
              >
                <span className="text-[#00E5FF]">{currentModelData.icon}</span>
                <span>{currentModelData.name}</span>
                <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isModelDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 sm:w-72 rounded-2xl bg-[#081021] border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 p-2 z-50 animate-in fade-in space-y-1">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2 py-1 border-b border-cyan-900/60">
                    Seleccionar Motor de Inteligencia Artificial
                  </div>
                  {AI_MODEL_OPTIONS.map((m) => {
                    const isSelected = selectedModel === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id as AIModelId);
                          setIsModelDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#002C3E] text-[#00E5FF] font-bold border border-[#00E5FF]/40'
                            : 'text-stone-200 hover:bg-[#0F1C36]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{m.icon}</span>
                          <div>
                            <div className="font-semibold">{m.name}</div>
                            <div className="text-[10px] text-stone-400 font-normal">{m.description}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#00E5FF]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[#081021] text-cyan-300 border border-cyan-900 hover:border-[#00E5FF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Compartir o exportar conversación"
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
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 w-full pb-4">
              {messages.map((msg) => {
                const isAI = msg.sender === 'chepe_ia';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 text-xs sm:text-sm ${
                      isAI ? 'items-start' : 'items-end flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold shadow-md ${
                        isAI ? 'bg-[#00E5FF] text-stone-950' : 'bg-blue-600 text-white'
                      }`}
                    >
                      {isAI ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className={`space-y-2 max-w-[88%] ${isAI ? 'w-full' : ''}`}>
                      <div
                        className={`p-4 rounded-2xl border shadow-md space-y-2 ${
                          isAI
                            ? 'bg-[#0F1C36] border-cyan-900 text-stone-100 rounded-tl-none'
                            : 'bg-[#00E5FF] text-stone-950 font-medium border-cyan-400 rounded-tr-none ml-auto'
                        }`}
                      >
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
                            <img src={msg.imageUrl} alt="Adjunto" className="w-full max-h-64 object-contain bg-[#050A14]" />
                          </div>
                        )}

                        {/* Generated AI Image Card (DALL-E 3 Style) */}
                        {msg.generatedImageUrl && (
                          <div className="my-3 p-3 rounded-2xl bg-[#060C1B] border border-cyan-500/50 shadow-2xl space-y-2">
                            <div className="flex items-center justify-between text-xs text-cyan-300 font-bold px-1">
                              <span className="flex items-center gap-1.5">
                                <Palette className="w-4 h-4 text-[#00E5FF]" />
                                DALL-E 3 Image Artifact
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">1024x1024 HD</span>
                            </div>

                            <div className="relative rounded-xl overflow-hidden border border-cyan-900 group">
                              <img
                                src={msg.generatedImageUrl}
                                alt={msg.generatedImagePrompt || 'Imagen generada'}
                                className="w-full max-h-96 object-cover bg-black"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                  onClick={() => setLightboxImage(msg.generatedImageUrl!)}
                                  className="p-2.5 rounded-full bg-[#00E5FF] text-stone-950 font-bold shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                  title="Pantalla Completa"
                                >
                                  <Maximize2 className="w-5 h-5" />
                                </button>
                                <a
                                  href={msg.generatedImageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download="chepe_image.png"
                                  className="p-2.5 rounded-full bg-stone-900 text-white border border-stone-700 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                  title="Descargar Imagen"
                                >
                                  <Download className="w-5 h-5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interactive Data Analyst Chart */}
                        {msg.chartData && (
                          <DataAnalystCard payload={msg.chartData} />
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
                            renderMessageContent(msg.text)
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
                              onClick={() => handleSpeech(msg.text, msg.id)}
                              className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer"
                              title="Escuchar en voz alta"
                            >
                              {isSpeaking === msg.id ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                                  <div className="flex items-center gap-0.5 h-3">
                                    <span className="w-0.5 h-2.5 bg-[#00E5FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-0.5 h-3 bg-[#00E5FF] animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-0.5 h-2 bg-[#00E5FF] animate-bounce" style={{ animationDelay: '300ms' }} />
                                  </div>
                                  <span className="text-[10px] text-[#00E5FF] font-bold">Hablando...</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Voz</span>
                                </>
                              )}
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
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#060C1B] border border-cyan-900/60 text-[10px] font-mono text-stone-400">
                              <span>‹ 1/1 ›</span>
                            </div>

                            <span className="text-[10px] text-stone-500 ml-auto">{msg.timestamp}</span>
                          </div>

                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {msg.suggestions.map((sug, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSendMessage(sug)}
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

              <button
                type="button"
                onClick={() => setIsVoiceModeOpen(true)}
                className="w-8 h-8 rounded-full bg-[#050A14] hover:bg-[#00E5FF] hover:text-stone-950 text-cyan-300 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Modo Voz Avanzado"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isImageMode
                    ? "Describe la imagen que quieres que DALL-E 3 dibuje..."
                    : selectedCustomGpt
                    ? `Hablando con ${selectedCustomGpt.name}...`
                    : "Escribe tu mensaje o usa / para atajos de comandos..."
                }
                className="flex-1 bg-transparent text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none px-2"
                disabled={isLoading}
              />

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
