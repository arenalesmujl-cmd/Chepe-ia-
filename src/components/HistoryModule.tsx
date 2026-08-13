import React, { useState } from 'react';
import { SavedConversation, ChatFolder } from '../types';
import {
  History, Search, Pin, Star, Trash2, Folder, Plus, MessageSquare,
  Sparkles, Calendar, Edit2, Check, FolderPlus
} from 'lucide-react';

interface HistoryModuleProps {
  conversations: SavedConversation[];
  folders: ChatFolder[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCreateFolder: (name: string, color: string) => void;
  onNewChat: () => void;
}

export const HistoryModule: React.FC<HistoryModuleProps> = ({
  conversations,
  folders,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onTogglePin,
  onToggleFavorite,
  onCreateFolder,
  onNewChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | 'all'>('all');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#00E5FF');

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.firstPrompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolderId === 'all' || c.folderId === selectedFolderId;
    return matchesSearch && matchesFolder;
  });

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim(), newFolderColor);
    setNewFolderName('');
    setShowFolderModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase">
            <History className="w-3.5 h-3.5 text-[#00E5FF]" />
            Historial de Conversaciones
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Gestor de Hilos y Consultas
          </h1>
        </div>

        <button
          onClick={onNewChat}
          className="px-4 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Iniciar Nuevo Chat</span>
        </button>
      </div>

      {/* Search Bar & Folder Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversaciones por palabra clave o título..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#081021] border border-cyan-900 text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          {/* Create Folder Button */}
          <button
            onClick={() => setShowFolderModal(true)}
            className="w-full md:w-auto px-4 py-3 rounded-2xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <FolderPlus className="w-4 h-4 text-[#00E5FF]" />
            <span>Nueva Carpeta</span>
          </button>
        </div>

        {/* Folders List */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedFolderId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
              selectedFolderId === 'all'
                ? 'bg-[#002C3E] text-[#00E5FF] border-[#00E5FF]'
                : 'bg-[#081021] text-stone-400 border-cyan-900/60 hover:text-white'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Todas las Conversaciones ({conversations.length})</span>
          </button>

          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolderId(folder.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
                selectedFolderId === folder.id
                  ? 'bg-[#002C3E] text-[#00E5FF] border-[#00E5FF]'
                  : 'bg-[#081021] text-stone-400 border-cyan-900/60 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: folder.color }} />
              <span>{folder.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversations Grid */}
      <div className="space-y-3">
        {filteredConversations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#081021] border border-cyan-900/60 text-center text-xs text-stone-400">
            No se encontraron conversaciones con este criterio de búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;

              return (
                <div
                  key={conv.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-md ${
                    isActive
                      ? 'bg-[#002C3E] border-[#00E5FF] shadow-cyan-950/50'
                      : 'bg-[#081021] hover:bg-[#0F1C36] border-cyan-900/80 hover:border-cyan-500/60'
                  }`}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00E5FF]' : 'text-cyan-400'}`} />
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-[#00E5FF] transition-colors">
                          {conv.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onTogglePin(conv.id)}
                          className={`p-1 rounded hover:bg-[#162A50] transition-colors ${
                            conv.isPinned ? 'text-amber-400' : 'text-stone-600 hover:text-stone-300'
                          }`}
                          title={conv.isPinned ? 'Desfijar' : 'Fijar arriba'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleFavorite(conv.id)}
                          className={`p-1 rounded hover:bg-[#162A50] transition-colors ${
                            conv.isFavorite ? 'text-amber-300 fill-amber-300' : 'text-stone-600 hover:text-stone-300'
                          }`}
                          title="Favorito"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-400 line-clamp-2 italic">
                      "{conv.firstPrompt || (conv.messages[0] ? conv.messages[0].text : 'Sin mensajes')}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-500 pt-2 border-t border-cyan-950">
                    <span className="uppercase font-mono font-semibold text-cyan-400">
                      {conv.category || 'General'}
                    </span>

                    <div className="flex items-center gap-2">
                      <span>{conv.updatedAt}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        className="text-stone-600 hover:text-red-400 transition-colors p-1"
                        title="Eliminar conversación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-[#00E5FF]" />
              Crear Nueva Carpeta de Chats
            </h3>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Nombre de la Carpeta:</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ej: Programación, Tareas Universidad, Proyectos..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Color Distintivo:</label>
                <div className="flex items-center gap-2">
                  {['#00E5FF', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewFolderColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        newFolderColor === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-5 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-extrabold text-xs shadow-md shadow-cyan-500/20"
                >
                  Crear Carpeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
