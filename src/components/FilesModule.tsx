import React, { useState } from 'react';
import { UploadedFileItem } from '../types';
import { Folder, Upload, FileText, Image as ImageIcon, Trash2, MessageSquare, Sparkles, Check } from 'lucide-react';

interface FilesModuleProps {
  files: UploadedFileItem[];
  onUploadFile: (file: UploadedFileItem) => void;
  onDeleteFile: (id: string) => void;
  onChatWithFile: (file: UploadedFileItem) => void;
}

export const FilesModule: React.FC<FilesModuleProps> = ({
  files,
  onUploadFile,
  onDeleteFile,
  onChatWithFile
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    Array.from(uploadedFiles).forEach((file: File) => {
      const reader = new FileReader();

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          onUploadFile({
            id: 'file-' + Date.now() + Math.random().toString(36).substr(2, 4),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type,
            uploadedAt: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dataUrl: reader.result as string
          });
        };
      } else {
        reader.readAsText(file);
        reader.onload = () => {
          onUploadFile({
            id: 'file-' + Date.now() + Math.random().toString(36).substr(2, 4),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type || 'text/plain',
            uploadedAt: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            contentSnippet: (reader.result as string).slice(0, 3000)
          });
        };
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase">
            <Folder className="w-3.5 h-3.5 text-[#00E5FF]" />
            Centro de Documentos y Análisis de Archivos
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Gestión y Análisis de Archivos con IA
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Sube código, archivos de texto, PDF o imágenes para que Chepe IA los analice, resuma, busque errores o responda preguntas sobre ellos.
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
            if (fileInput) {
              fileInput.files = e.dataTransfer.files;
              fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        }}
        className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center space-y-3 cursor-pointer ${
          dragOver
            ? 'border-[#00E5FF] bg-[#002C3E]/50 shadow-xl'
            : 'border-cyan-900/80 bg-[#081021] hover:border-cyan-500/60'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#0B132B] border border-cyan-800 flex items-center justify-center text-[#00E5FF] mx-auto shadow-md">
          <Upload className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">
            Arrastra tus archivos aquí o haz clic para explorar
          </h3>
          <p className="text-xs text-stone-400">
            Soporta archivos .txt, .js, .py, .ts, .json, .csv, .md, e imágenes (PNG, JPG, WEBP) hasta 20MB.
          </p>
        </div>

        <input
          id="file-upload-input"
          type="file"
          multiple
          accept=".txt,.js,.ts,.py,.json,.html,.css,.csv,.md,.png,.jpg,.jpeg,.webp"
          onChange={handleFileUpload}
          className="hidden"
        />

        <label
          htmlFor="file-upload-input"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-extrabold text-xs cursor-pointer shadow-lg shadow-cyan-500/20 transition-transform active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>Seleccionar Archivos</span>
        </label>
      </div>

      {/* Uploaded Files List */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Folder className="w-4 h-4 text-[#00E5FF]" />
          Mis Archivos Subidos ({files.length}):
        </h3>

        {files.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#081021] border border-cyan-900/60 text-center text-xs text-stone-400">
            Aún no has subido ningún archivo. Sube un archivo arriba para comenzar a chatear con él.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 rounded-2xl bg-[#081021] border border-cyan-900/80 hover:border-cyan-500/60 transition-all flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#050A14] border border-cyan-900 flex items-center justify-center text-[#00E5FF] shrink-0">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-cyan-300" />
                    )}
                  </div>

                  <div className="overflow-hidden space-y-0.5">
                    <h4 className="text-xs font-bold text-white truncate" title={file.name}>
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onChatWithFile(file)}
                    className="p-2 rounded-xl bg-[#002C3E] text-[#00E5FF] hover:bg-[#003B54] border border-[#00E5FF]/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Chatear con este archivo"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">Analizar con IA</span>
                  </button>

                  <button
                    onClick={() => onDeleteFile(file.id)}
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-colors cursor-pointer"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
