export type AIModelId = 'chepe-3.8' | 'chepe-reasoning-o1' | 'gemini-3.5-flash' | 'gemini-4.0-ultra' | 'claude-proxy';

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
  webCitations?: { title: string; url: string; domain: string }[];
  chartData?: ChartDataPayload;
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
