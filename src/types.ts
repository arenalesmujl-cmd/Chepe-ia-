export type AIModelId = 
  | 'gpt-4o' 
  | 'gpt-4o-mini' 
  | 'o1' 
  | 'o3-mini' 
  | 'deepseek-r1'
  | 'dall-e-3'
  | 'sora-video'
  | 'web-grounding'
  | 'chepe-3.8' 
  | 'chepe-reasoning-o1' 
  | 'gemini-3.5-flash' 
  | 'gemini-4.0-ultra' 
  | 'claude-proxy';

export interface AIModelOption {
  id: AIModelId;
  name: string;
  badge: string;
  icon: string;
  description: string;
  speed: string;
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


