import React, { useState } from 'react';
import { X, FolderPlus, Folder, Trash2, Check, Sparkles, Plus, BookOpen, Briefcase, Code, GraduationCap, Palette } from 'lucide-react';
import { ChatFolder } from '../types';

interface ProjectFoldersModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: ChatFolder[];
  selectedFolderId?: string | null;
  onSelectFolder?: (id: string | null) => void;
  onCreateFolder?: (name: string, color: string, instructions?: string) => void;
  onSaveFolder?: (folder: Partial<ChatFolder>) => void;
  onDeleteFolder?: (id: string) => void;
}

const DEFAULT_COLOR_PALETTES = [
  '#00E5FF', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#3B82F6', '#EF4444'
];

export const ProjectFoldersModal: React.FC<ProjectFoldersModalProps> = ({
  isOpen,
  onClose,
  folders,
  selectedFolderId = null,
  onSelectFolder,
  onCreateFolder,
  onSaveFolder,
  onDeleteFolder,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#00E5FF');
  const [customInstructions, setCustomInstructions] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    if (onCreateFolder) {
      onCreateFolder(folderName.trim(), selectedColor, customInstructions.trim());
    } else if (onSaveFolder) {
      onSaveFolder({
        name: folderName.trim(),
        color: selectedColor,
        customInstructions: customInstructions.trim()
      });
    }
    setFolderName('');
    setCustomInstructions('');
    setActiveTab('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-[#070D1E] border border-cyan-500/40 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-950/80 overflow-hidden text-cyan-50">
        
        {/* Header */}
        <div className="p-4 border-b border-cyan-950 flex items-center justify-between bg-[#040813]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-[#00E5FF]">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Proyectos & Carpetas
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[#00E5FF]">
                  ChatGPT Projects
                </span>
              </h2>
              <p className="text-xs text-stone-400">Organiza tus conversaciones y asigna instrucciones por proyecto</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-cyan-950 bg-[#050B17] px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'list'
                ? 'border-[#00E5FF] text-[#00E5FF]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Mis Proyectos ({folders.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'border-[#00E5FF] text-[#00E5FF]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear Nuevo Proyecto</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'list' ? (
            <div className="space-y-2">
              <div
                onClick={() => {
                  onSelectFolder?.(null);
                  onClose();
                }}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedFolderId === null
                    ? 'bg-[#0E223D] border-[#00E5FF] text-white shadow-md'
                    : 'bg-[#091224] border-cyan-950/60 text-stone-300 hover:bg-[#0E1A33]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950 flex items-center justify-center text-[#00E5FF]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Todos los Chats (Sin filtro)</h4>
                    <p className="text-[10px] text-stone-400">Ver todas las conversaciones activas</p>
                  </div>
                </div>
                {selectedFolderId === null && <Check className="w-4 h-4 text-[#00E5FF]" />}
              </div>

              {folders.length === 0 ? (
                <div className="text-center py-8 text-stone-500 space-y-2">
                  <FolderPlus className="w-8 h-8 mx-auto text-cyan-800" />
                  <p className="text-xs">No tienes proyectos creados aún.</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="text-xs text-[#00E5FF] hover:underline font-bold"
                  >
                    + Crear tu primer proyecto estilo ChatGPT
                  </button>
                </div>
              ) : (
                folders.map((folder) => {
                  const isSelected = selectedFolderId === folder.id;
                  return (
                    <div
                      key={folder.id}
                      onClick={() => {
                        onSelectFolder?.(folder.id);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#0E223D] border-[#00E5FF] text-white shadow-md'
                          : 'bg-[#091224] border-cyan-950/60 text-stone-300 hover:bg-[#0E1A33]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-950 font-bold text-xs"
                          style={{ backgroundColor: folder.color }}
                        >
                          <Folder className="w-4 h-4 text-stone-950" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-2">
                            {folder.name}
                          </h4>
                          <p className="text-[10px] text-stone-400">Carpeta de trabajo dedicada</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {isSelected && <Check className="w-4 h-4 text-[#00E5FF] mr-2" />}
                        <button
                          onClick={() => onDeleteFolder(folder.id)}
                          className="p-1.5 rounded-lg hover:bg-red-950 text-stone-500 hover:text-red-400 transition-colors"
                          title="Eliminar proyecto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1.5">
                  Nombre del Proyecto
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Ej: Programación Python, Tesis Universitaria, Marketing..."
                  className="w-full bg-[#040813] border border-cyan-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1.5">
                  Color del Proyecto
                </label>
                <div className="flex items-center gap-2">
                  {DEFAULT_COLOR_PALETTES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-xl transition-all cursor-pointer ${
                        selectedColor === c ? 'scale-110 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1.5">
                  Instrucciones Específicas para este Proyecto (Opcional)
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Ej: Responde siempre en TypeScript estricto, o actúa como un consultor financiero senior..."
                  rows={3}
                  className="w-full bg-[#040813] border border-cyan-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00E5FF] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!folderName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
