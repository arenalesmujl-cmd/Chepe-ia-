export type AIModelId = 
  // --- OpenAI / ChatGPT ---
  | 'gpt-4o' 
  | 'gpt-4o-mini' 
  | 'o1' 
  | 'o1-mini'
  | 'o3-mini' 
  | 'o3-preview'
  | 'gpt-4.5-preview'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'chatgpt-canvas'
  | 'dall-e-3'
  | 'sora-video'
  | 'whisper-voice'
  // --- Anthropic Claude ---
  | 'claude-3-7-sonnet'
  | 'claude-3-7-thinking'
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'claude-code'
  | 'claude-proxy'
  // --- Google Gemini & DeepMind ---
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash'
  | 'gemini-2.0-flash-thinking'
  | 'gemini-2.0-pro-exp'
  | 'gemini-2.0-flash-lite'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash-8b'
  | 'gemini-3.5-flash' 
  | 'gemini-4.0-ultra' 
  | 'imagen-3'
  | 'veo-2-video'
  | 'gemma-2-27b'
  | 'gemma-2-9b'
  | 'alphafold-3'
  | 'web-grounding'
  // --- DeepSeek ---
  | 'deepseek-r1'
  | 'deepseek-r1-zero'
  | 'deepseek-v3'
  | 'deepseek-coder'
  | 'deepseek-coder-33b'
  | 'deepseek-math'
  | 'deepseek-vl2'
  | 'deepseek-janus-pro'
  // --- Meta AI / Llama ---
  | 'llama-3.3-70b'
  | 'llama-3.2-90b'
  | 'llama-3.2-vision'
  | 'llama-3.2-11b'
  | 'llama-3.2-3b'
  | 'llama-3.2-1b'
  | 'llama-3.1-405b'
  | 'llama-3.1-70b'
  | 'llama-3.1-8b'
  | 'codellama-70b'
  | 'meta-moviegen'
  // --- xAI Grok ---
  | 'grok-3'
  | 'grok-3-deepsearch'
  | 'grok-3-mini'
  | 'grok-2'
  | 'grok-2-vision'
  | 'grok-2-aurora'
  // --- Mistral AI ---
  | 'mistral-large-2'
  | 'mistral-medium-3'
  | 'mistral-small-3'
  | 'codestral-25k'
  | 'codestral-mamba'
  | 'pixtral-large'
  | 'pixtral-12b'
  | 'mistral-nemo'
  | 'mixtral-8x22b'
  | 'mixtral-8x7b'
  | 'le-chat-pro'
  // --- Qwen / Alibaba ---
  | 'qwen-2.5-max'
  | 'qwen-2.5-72b'
  | 'qwen-2.5-coder'
  | 'qwen-2.5-coder-7b'
  | 'qwen-2.5-math'
  | 'qwen-2.5-vl'
  | 'qwen-audio'
  | 'qwq-32b'
  | 'wan-2.1-video'
  // --- Perplexity AI ---
  | 'sonar-deep-research'
  | 'sonar-reasoning-pro'
  | 'sonar-reasoning-8b'
  | 'sonar-online-pro'
  | 'sonar-academic'
  // --- Microsoft, Nvidia & Enterprise ---
  | 'phi-4-reasoning'
  | 'phi-3.5-vision'
  | 'copilot-pro'
  | 'nvidia-nemotron-70b'
  | 'nvidia-nemotron-340b'
  | 'cohere-command-r-plus'
  | 'cohere-command-r'
  | 'cohere-aya-23'
  | 'amazon-nova-pro'
  | 'amazon-nova-lite'
  | 'amazon-nova-canvas'
  | 'jamba-1.5-large'
  | 'ernie-4.0-pro'
  // --- Chepe IA Specialized Autonomous Agents ---
  | 'chepe-3.8' 
  | 'chepe-reasoning-o1'
  | 'chepe-coder-pro'
  | 'chepe-lawyer'
  | 'chepe-medic'
  | 'chepe-finance'
  | 'chepe-data-scientist'
  | 'chepe-marketing'
  | 'chepe-writer'
  | 'chepe-polyglot'
  | 'chepe-cybersecurity'
  | 'chepe-educator';

export interface AIModelOption {
  id: AIModelId;
  name: string;
  badge: string;
  icon: string;
  description: string;
  speed: string;
  provider?: 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek' | 'Meta' | 'xAI' | 'Mistral' | 'Qwen' | 'Perplexity' | 'Microsoft' | 'Nvidia' | 'Cohere' | 'Amazon' | 'AI21' | 'Baidu' | 'ChepeIA';
  photoUrl?: string;
  avatarBg?: string;
  accentColor?: string;
  tags?: string[];
}

export type PromptCategory = 
  | 'general' 
  | 'programacion' 
  | 'tareas' 
  | 'matematicas' 
  | 'ciencia' 
  | 'historia' 
  | 'escritura' 
  | 'traduccion' 
  | 'ideas' 
  | 'asistente_web';

export type PromptSpecialty = PromptCategory;

export interface CategoryOption {
  id: PromptCategory;
  name: string;
  icon: string;
  description: string;
  popular?: boolean;
}

export interface CustomServerConfig {
  apiKey: string;
  hostIp: string;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  contentSnippet?: string;
  dataUrl?: string;
}

export interface CustomGpt {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatarEmoji: string;
  category: string;
  author: string;
  isOfficial?: boolean;
  capabilities: {
    webSearch?: boolean;
    canvasCode?: boolean;
    imageGeneration?: boolean;
    dataInterpreter?: boolean;
  };
  starterPrompts: string[];
}

export interface CustomInstructions {
  aboutUser: string;
  responsePreferences: string;
  enabled: boolean;
}

export interface ChartDataPayload {
  title: string;
  chartType: 'bar' | 'line' | 'pie' | 'area';
  data: Record<string, any>[];
  dataKeys: string[];
  xAxisKey: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'chepe_ia';
  text: string;
  timestamp: string;
  imageUrl?: string;
  generatedImageUrl?: string;
  generatedImagePrompt?: string;
  fileData?: UploadedFileItem;
  modelUsed?: string;
  customGptUsed?: string;
  specialty?: PromptSpecialty;
  suggestions?: string[];
  rating?: 'up' | 'down' | null;
  thinkingTimeMs?: number;
  reasoningChain?: string[];
  isDeepResearch?: boolean;
  deepResearchSteps?: { title: string; status: 'done' | 'running' | 'pending'; detail?: string }[];
  webCitations?: { title: string; url: string; domain: string }[];
  versions?: string[];
  activeVersionIndex?: number;
  chartData?: ChartDataPayload;
  videoData?: VideoProject;
  webScrapedData?: WebScrapedResult;
  canvasData?: {
    title: string;
    language: string;
    content: string;
    type: 'code' | 'document' | 'html';
  };
  codeBlocks?: {
    language: string;
    code: string;
  }[];
}

export interface ChatFolder {
  id: string;
  name: string;
  color: string;
}

export interface SavedConversation {
  id: string;
  title: string;
  category: PromptCategory;
  folderId?: string;
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  firstPrompt: string;
}

export interface LicenseCode {
  id: string;
  code: string;
  plan: 'Pro' | 'Premium';
  expiresAt: string; // ISO or formatted date & time e.g. "2026-12-31 23:59"
  createdAt: string;
  isUsed: boolean;
  usedBy?: string; // user email or name
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  planType: 'Gratis' | 'Pro' | 'Premium';
  planExpiresAt?: string;
  memberSince: string;
  dailyUsageCount: number;
  dailyLimit: number;
  status: 'active' | 'suspended';
  role: 'user' | 'admin';
  isGuest?: boolean;
}

export interface PlanTier {
  id: 'gratis' | 'pro' | 'premium';
  name: string;
  price: string;
  period: string;
  badge: string;
  description: string;
  maxDailyMessages: number;
  popular?: boolean;
  features: string[];
  limitations?: string[];
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  plan: 'Gratis' | 'Pro' | 'Premium';
  planExpiresAt?: string;
  usage: number;
  status: 'activo' | 'suspendido';
  registeredDate: string;
  lastActive: string;
}

export interface AdminStats {
  registeredUsersCount: number;
  activeUsersToday: number;
  totalConversations: number;
  totalMessages: number;
  tokensUsedToday: number;
  serverHealth: string;
}

export interface VideoScene {
  sceneNumber: number;
  title: string;
  description: string;
  cameraAngle?: string;
  lighting?: string;
  audioEffect?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  prompt: string;
  videoUrl: string;
  posterUrl: string;
  duration: number; // in seconds (5, 10, 15, 30)
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  style: string;
  cameraMotion: string;
  fps: number;
  tags: string[];
  createdAt: string;
  isFavorite?: boolean;
  storyboard?: VideoScene[];
}

export interface WebScrapedResult {
  url: string;
  title: string;
  description: string;
  domain: string;
  summary: string;
  keyTakeaways: string[];
  mainTopics: string[];
  seoScore?: number;
  wordCount?: number;
  headings?: string[];
  images?: string[];
  ogImage?: string;
  faviconUrl?: string;
  techStack?: string[];
  htmlSnippet?: string;
  extractedAt: string;
}

export interface WebAuditResult {
  url: string;
  domain: string;
  title: string;
  scores: {
    performance: number;
    seo: number;
    security: number;
    accessibility: number;
    bestPractices: number;
  };
  coreWebVitals: {
    lcp: string; // Largest Contentful Paint
    fid: string; // First Input Delay
    cls: string; // Cumulative Layout Shift
    ttfb: string; // Time to First Byte
    speedIndex: string;
  };
  techStack: {
    category: string;
    name: string;
    icon?: string;
  }[];
  seoDetails: {
    titleLength: number;
    hasMetaDescription: boolean;
    hasOpenGraph: boolean;
    hasTwitterCard: boolean;
    hasCanonical: boolean;
    hasRobotsTxt: boolean;
    hasSitemap: boolean;
    headingsCount: { h1: number; h2: number; h3: number };
  };
  securityDetails: {
    httpsEnabled: boolean;
    hstsEnabled: boolean;
    tlsVersion: string;
    xFrameOptions: string;
    contentSecurityPolicy: boolean;
    sslIssuer?: string;
    sslDaysLeft?: number;
  };
  aiRecommendations: {
    priority: 'alta' | 'media' | 'baja';
    category: string;
    title: string;
    description: string;
    suggestedFix: string;
  }[];
  auditedAt: string;
}

export interface GeneratedWebsite {
  id: string;
  prompt: string;
  title: string;
  description: string;
  theme: string;
  style: string;
  html: string;
  tags: string[];
  createdAt: string;
}

export interface LiveDnsResult {
  domain: string;
  ip: string;
  ipv6?: string;
  nameservers: string[];
  mxRecords: string[];
  txtRecords: string[];
  sslStatus: 'Válido & Seguro' | 'Expirado' | 'No Seguro';
  sslIssuer: string;
  sslValidUntil: string;
  httpStatus: number;
  responseTimeMs: number;
  serverType: string;
}

export interface LiveWebSearchItem {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  source: string;
  date?: string;
  category?: string;
  isVerified?: boolean;
}


