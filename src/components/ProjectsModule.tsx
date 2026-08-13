import React, { useState } from 'react';
import {
  FolderPlus, Folder, Plus, Sparkles, Bot, FileText, ChevronRight,
  Settings, Trash2, Edit3, ArrowRight, BookOpen, ExternalLink, Code
} from 'lucide-react';

export interface ProjectWorkspace {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  chatCount: number;
  fileCount: number;
  customInstructions?: string;
  createdAt: string;
}

interface ProjectsModuleProps {
  onSelectProject: (project: ProjectWorkspace) => void;
  onNewProjectChat: (project: ProjectWorkspace) => void;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  onSelectProject,
  onNewProjectChat
}) => {
  const [projects, setProjects] = useState<ProjectWorkspace[]>([
    {
      id: 'proj-1',
      name: 'Desarrollo App React Native',
      description: 'Workspace para prototipos, componentes TypeScript y llamadas a API.',
      category: 'Programación',
      color: 'from-blue-600 to-cyan-500',
      chatCount: 14,
      fileCount: 5,
      customInstructions: 'Generar siempre componentes funcionales con TypeScript y Tailwind.',
      createdAt: 'Hace 3 días'
    },
    {
      id: 'proj-2',
      name: 'Investigación Académica & Tesis',
      description: 'Análisis de artículos científicos, resúmenes en APA 7 y redacción.',
      category: 'Educación',
      color: 'from-purple-600 to-indigo-500',
      chatCount: 8,
      fileCount: 3,
      customInstructions: 'Mantener un tono formal académico y citar fuentes en formato APA.',
      createdAt: 'Hace 1 semana'
    },
    {
      id: 'proj-3',
      name: 'Estrategia de Marketing & SEO',
      description: 'Copywriting para blogs, posts de LinkedIn y anuncios publicitarios.',
      category: 'Negocios',
      color: 'from-emerald-600 to-teal-500',
      chatCount: 19,
      fileCount: 8,
      customInstructions: 'Utilizar técnicas de Copywriting AIDA y enfocar en conversión.',
      createdAt: 'Hace 2 semanas'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [customInstructions, setCustomInstructions] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: ProjectWorkspace = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Proyecto personalizado en Chepe IA',
      category: category,
      color: 'from-cyan-600 to-blue-500',
      chatCount: 0,
      fileCount: 0,
      customInstructions: customInstructions.trim(),
      createdAt: 'Hoy'
    };

    setProjects([newProject, ...projects]);
    setName('');
    setDescription('');
    setCustomInstructions('');
    setIsCreating(false);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Deseas eliminar este proyecto?')) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 font-sans bg-[#040812]">
      {/* Title Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyan-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-[#00E5FF] text-[10px] font-mono border border-cyan-800 font-bold uppercase">
              CHATGPT TEAM & PROJECTS
            </span>
            <span className="text-xs text-stone-400 font-mono">• Espacios de Trabajo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Proyectos & Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Agrupa tus chats, archivos e instrucciones maestras en proyectos independientes
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Crear Proyecto</span>
        </button>
      </div>

      {/* Form modal or expand block */}
      {isCreating && (
        <form
          onSubmit={handleCreateProject}
          className="max-w-6xl mx-auto p-6 rounded-3xl bg-[#081021] border border-cyan-500/50 shadow-2xl space-y-4 animate-fadeIn"
        >
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            Nuevo Proyecto en Chepe IA
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Nombre del Proyecto</label>
              <input
                type="text"
                required
                placeholder="Ej. Rediseño Ecommerce 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050A14] text-xs text-white border border-cyan-800 rounded-xl p-3 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#050A14] text-xs text-white border border-cyan-800 rounded-xl p-3 focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="Programación">Programación</option>
                <option value="Educación">Educación</option>
                <option value="Negocios">Negocios</option>
                <option value="Escritura">Escritura & Copywriting</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-300">Descripción Corta</label>
            <input
              type="text"
              placeholder="¿De qué trata este proyecto?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#050A14] text-xs text-white border border-cyan-800 rounded-xl p-3 focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-300">Instrucciones Maestras del Proyecto</label>
            <textarea
              rows={2}
              placeholder="Instrucciones específicas para que Chepe IA las aplique en todos los chats de este proyecto..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full bg-[#050A14] text-xs text-white border border-cyan-800 rounded-xl p-3 focus:outline-none focus:border-[#00E5FF] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-stone-900 text-stone-400 text-xs font-bold hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#00E5FF] text-stone-950 text-xs font-black hover:bg-cyan-300"
            >
              Guardar Proyecto
            </button>
          </div>
        </form>
      )}

      {/* Grid of Projects */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => onSelectProject(proj)}
            className="p-5 rounded-3xl bg-[#081021] border border-cyan-900/60 hover:border-[#00E5FF] shadow-xl hover:shadow-cyan-500/10 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            {/* Gradient Top Banner */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${proj.color} absolute top-0 left-0`} />

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  {proj.category}
                </span>

                <button
                  onClick={(e) => handleDeleteProject(proj.id, e)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar proyecto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-white group-hover:text-[#00E5FF] transition-colors flex items-center gap-2">
                  <Folder className="w-4 h-4 text-[#00E5FF]" />
                  {proj.name}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed mt-1 line-clamp-2">
                  {proj.description}
                </p>
              </div>

              {proj.customInstructions && (
                <div className="p-2.5 rounded-xl bg-[#050A14] border border-cyan-950 text-[11px] text-stone-300 font-mono italic truncate">
                  💡 "{proj.customInstructions}"
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-cyan-950/80 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] font-mono text-stone-400">
                <span>💬 {proj.chatCount} chats</span>
                <span>📁 {proj.fileCount} archivos</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNewProjectChat(proj);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#0B1832] group-hover:bg-[#00E5FF] group-hover:text-stone-950 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Entrar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
