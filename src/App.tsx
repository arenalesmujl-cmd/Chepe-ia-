import React, { useState, useEffect } from 'react';
import { CustomServerConfig, SavedConversation, ChatFolder, UserProfile, UploadedFileItem } from './types';
import { DEFAULT_USER_PROFILE } from './data/chepeData';
import { Navbar } from './components/Navbar';
import { SidebarNav } from './components/SidebarNav';
import { ChepeChat } from './components/ChepeChat';
import { ProgrammingModule } from './components/ProgrammingModule';
import { MathModule } from './components/MathModule';
import { TasksModule } from './components/TasksModule';
import { WritingModule } from './components/WritingModule';
import { FilesModule } from './components/FilesModule';
import { HistoryModule } from './components/HistoryModule';
import { ProfileModule } from './components/ProfileModule';
import { ProjectsModule, ProjectWorkspace } from './components/ProjectsModule';
import { AdminDashboard } from './components/AdminDashboard';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [chatPrompt, setChatPrompt] = useState<string>('');
  const [attachedFileForChat, setAttachedFileForChat] = useState<UploadedFileItem | null>(null);
  const [chatSessionKey, setChatSessionKey] = useState<number>(Date.now());

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'guest'>('login');

  // Saved Conversations & Folders
  const [conversations, setConversations] = useState<SavedConversation[]>([
    {
      id: 'conv-1',
      title: 'Función en Kotlin con Corrutinas',
      category: 'programacion',
      isPinned: true,
      isFavorite: true,
      createdAt: '12/02/2026',
      updatedAt: 'Hace 10 min',
      firstPrompt: 'Escribe una función en Kotlin con StateFlow para Android',
      messages: [
        { id: '1', sender: 'user', text: 'Escribe una función en Kotlin con StateFlow para Android', timestamp: '10:00' },
        { id: '2', sender: 'chepe_ia', text: 'Aquí tienes la función en Kotlin lista para producción con StateFlow y ViewModel...', timestamp: '10:01' }
      ]
    },
    {
      id: 'conv-2',
      title: 'Resolución Ecuación Cuadrática',
      category: 'matematicas',
      isPinned: false,
      isFavorite: false,
      createdAt: '11/02/2026',
      updatedAt: 'Ayer',
      firstPrompt: 'Resuelve 2x² + 5x - 3 = 0 paso a paso',
      messages: [
        { id: '1', sender: 'user', text: 'Resuelve 2x² + 5x - 3 = 0 paso a paso', timestamp: '15:20' }
      ]
    },
    {
      id: 'conv-3',
      title: 'Resumen Tarea de Historia',
      category: 'tareas',
      isPinned: false,
      isFavorite: true,
      createdAt: '10/02/2026',
      updatedAt: 'Hace 2 días',
      firstPrompt: 'Hazme un resumen educativo de los 5 eventos clave de la Segunda Guerra Mundial',
      messages: [
        { id: '1', sender: 'user', text: 'Hazme un resumen educativo de los 5 eventos clave', timestamp: '18:10' }
      ]
    }
  ]);

  const [folders, setFolders] = useState<ChatFolder[]>([
    { id: 'f-1', name: 'Programación Dev', color: '#00E5FF' },
    { id: 'f-2', name: 'Tareas Universidad', color: '#10B981' },
    { id: 'f-3', name: 'Escritura & Ensayos', color: '#F59E0B' }
  ]);

  // Uploaded Files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);

  // Custom Server Config State (API Key & Host IP Proxy)
  const [customConfig, setCustomConfig] = useState<CustomServerConfig>({
    apiKey: '',
    hostIp: 'https://generativelanguage.googleapis.com'
  });

  // Load state on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('chepe_auth_user');
      if (storedUser) {
        setUserProfile(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }

      const storedConfig = localStorage.getItem('chepe_custom_config');
      if (storedConfig) {
        setCustomConfig(JSON.parse(storedConfig));
      }

      const storedFiles = localStorage.getItem('chepe_uploaded_files');
      if (storedFiles) {
        setUploadedFiles(JSON.parse(storedFiles));
      }
    } catch (e) {
      console.error('Error loading stored app state:', e);
    }
  }, []);

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setUserProfile(user);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setActiveTab('chat');
    try {
      localStorage.setItem('chepe_auth_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAuthModalOpen(false);
    try {
      localStorage.removeItem('chepe_auth_user');
    } catch (e) {}
  };

  const handleUpdateUserPlan = (newPlan: 'Gratis' | 'Pro' | 'Premium', expiresAt: string) => {
    const updatedUser: UserProfile = {
      ...userProfile,
      planType: newPlan,
      planExpiresAt: expiresAt,
      dailyLimit: newPlan === 'Pro' ? 1000 : newPlan === 'Premium' ? 10000 : 50
    };
    setUserProfile(updatedUser);
    try {
      localStorage.setItem('chepe_auth_user', JSON.stringify(updatedUser));
    } catch (e) {}
  };

  const handleSaveConfig = (newConfig: CustomServerConfig) => {
    setCustomConfig(newConfig);
    try {
      localStorage.setItem('chepe_custom_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Error saving custom config:', e);
    }
  };

  const handleAskAI = (prompt: string, category: string = 'general') => {
    setChatPrompt(prompt);
    setAttachedFileForChat(null);
    setActiveTab('chat');
    setChatSessionKey(Date.now());
  };

  const handleNewChat = () => {
    setChatPrompt('');
    setAttachedFileForChat(null);
    setActiveTab('chat');
    setChatSessionKey(Date.now());
  };

  const handleUploadFile = (file: UploadedFileItem) => {
    setUploadedFiles(prev => {
      const updated = [file, ...prev];
      try {
        localStorage.setItem('chepe_uploaded_files', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      try {
        localStorage.setItem('chepe_uploaded_files', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleChatWithFile = (file: UploadedFileItem) => {
    setAttachedFileForChat(file);
    setChatPrompt(`Analiza este archivo (${file.name}) y hazme un resumen breve de su contenido.`);
    setActiveTab('chat');
    setChatSessionKey(Date.now());
  };

  const handleCreateFolder = (name: string, color: string) => {
    const newFolder: ChatFolder = {
      id: 'f-' + Date.now(),
      name,
      color
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const handleTogglePinConversation = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
  };

  const handleToggleFavoriteConversation = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-cyan-50 font-sans flex flex-col selection:bg-[#00E5FF] selection:text-stone-950 w-full max-w-full overflow-x-hidden">
      {/* Authentication Modal if not logged in or explicitly opened */}
      {(!isAuthenticated || isAuthModalOpen) && (
        <AuthModal
          onLoginSuccess={handleLoginSuccess}
          onClose={isAuthenticated ? () => setIsAuthModalOpen(false) : undefined}
          defaultMode={authModalMode}
        />
      )}

      {/* Top Main Navbar */}
      <Navbar
        onNewChat={handleNewChat}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenAdmin={() => setActiveTab('admin')}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        userRole={userProfile.role}
        isGuest={userProfile.isGuest}
        onOpenAuthModal={handleOpenAuthModal}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Full Workspace Wrapper */}
      <div className="flex-1 flex overflow-hidden relative w-full max-w-full">
        {/* Left Drawer Navigation */}
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onNewChat={handleNewChat}
          isOpen={isSidebarOpen}
          onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
          dailyCount={userProfile.dailyUsageCount}
          dailyLimit={userProfile.dailyLimit}
          userName={userProfile.name}
          userRole={userProfile.role}
          isGuest={userProfile.isGuest}
          onOpenAuthModal={handleOpenAuthModal}
          onLogout={handleLogout}
        />

        {/* Central View Content Canvas */}
        <main className="flex-1 overflow-y-auto w-full max-w-full overflow-x-hidden relative">
          {activeTab === 'chat' && (
            <ChepeChat
              key={chatSessionKey}
              initialPrompt={chatPrompt}
              customConfig={customConfig}
              onOpenConfig={() => setActiveTab('settings')}
              onNavigateTab={(tab) => setActiveTab(tab)}
              attachedFileForChat={attachedFileForChat}
            />
          )}

          {activeTab === 'programming' && (
            <ProgrammingModule onAskAI={handleAskAI} />
          )}

          {activeTab === 'projects' && (
            <ProjectsModule
              onSelectProject={(proj) => {
                handleAskAI(`Proporciona un plan estratégico para el proyecto: ${proj.name}.`, 'general');
              }}
              onNewProjectChat={(proj) => {
                handleAskAI(`Iniciando sesión de trabajo para el proyecto "${proj.name}". Instrucciones del espacio: ${proj.customInstructions || 'Sin instrucciones adicionales'}.`, 'general');
              }}
            />
          )}

          {activeTab === 'math' && (
            <MathModule onAskAI={handleAskAI} />
          )}

          {activeTab === 'tasks' && (
            <TasksModule onAskAI={handleAskAI} />
          )}

          {activeTab === 'writing' && (
            <WritingModule onAskAI={handleAskAI} />
          )}

          {activeTab === 'files' && (
            <FilesModule
              files={uploadedFiles}
              onUploadFile={handleUploadFile}
              onDeleteFile={handleDeleteFile}
              onChatWithFile={handleChatWithFile}
            />
          )}

          {(activeTab === 'history' || activeTab === 'favorites') && (
            <HistoryModule
              conversations={activeTab === 'favorites' ? conversations.filter(c => c.isFavorite) : conversations}
              folders={folders}
              activeConversationId={null}
              onSelectConversation={(id) => {
                const conv = conversations.find(c => c.id === id);
                if (conv) {
                  handleAskAI(conv.firstPrompt, conv.category);
                }
              }}
              onDeleteConversation={handleDeleteConversation}
              onTogglePin={handleTogglePinConversation}
              onToggleFavorite={handleToggleFavoriteConversation}
              onCreateFolder={handleCreateFolder}
              onNewChat={handleNewChat}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileModule
              user={userProfile}
              onUpdateUserPlan={handleUpdateUserPlan}
              onOpenSettings={() => setActiveTab('settings')}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              customConfig={customConfig}
              onSaveCustomConfig={handleSaveConfig}
              onClearAllHistory={() => setConversations([])}
            />
          )}
        </main>
      </div>
    </div>
  );
}
