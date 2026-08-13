import React, { useState } from 'react';
import { BookOpen, Sparkles, Send, GraduationCap, FileText, CheckCircle2 } from 'lucide-react';

interface TasksModuleProps {
  onAskAI: (prompt: string, specialty: string) => void;
}

export const TasksModule: React.FC<TasksModuleProps> = ({ onAskAI }) => {
  const [taskInput, setTaskInput] = useState('');

  const taskPresets = [
    {
      title: 'Resumen Didáctico de Lectura / Tema',
      desc: 'Transforma capítulos o textos extensos en puntos clave y conclusiones.',
      prompt: 'Haz un resumen didáctico estructurado en 5 puntos clave sobre la Revolución Industrial y sus consecuencias económicas.'
    },
    {
      title: 'Explicación Didáctica para Examen',
      desc: 'Explicación sencilla con analogías para entender cualquier concepto complejo.',
      prompt: 'Explícame el concepto de la teoría de la relatividad general de Einstein de forma sencilla para un examen.'
    },
    {
      title: 'Guía de Estudio y Cuestionario',
      desc: 'Genera un cuestionario de 10 preguntas de opción múltiple con respuestas.',
      prompt: 'Crea una guía de estudio de 10 preguntas con respuestas explicadas sobre la estructura de la célula y el ADN.'
    },
    {
      title: 'Esquema / Guión para Exposición',
      desc: 'Estructura una presentación escolar con introducción, desarrollo y conclusión.',
      prompt: 'Diseña un guión de 5 minutos para una exposición escolar sobre el cambio climático y la energía solar.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    onAskAI(`[Ayuda con Tarea / Estudio]\n${taskInput}`, 'tareas');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase">
            <GraduationCap className="w-3.5 h-3.5 text-[#00E5FF]" />
            Centro de Tareas y Tutoría Académica Chepe IA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ayuda con Tareas, Resúmenes y Guías de Estudio
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Obtén explicaciones pedagógicas claras en historia, ciencias, geografía, biología y redacción académica.
          </p>
        </div>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00E5FF]" />
          Escribe tu Tarea, Pregunta o Texto a Resumir:
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Pega aquí las instrucciones de tu tarea, tema a repasar o preguntas de estudio..."
            rows={4}
            className="w-full p-4 rounded-2xl bg-[#050A14] border border-cyan-900 text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF] leading-relaxed resize-none font-mono"
          />

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={!taskInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 disabled:opacity-40 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Solicitar Ayuda con Tarea</span>
            </button>
          </div>
        </form>
      </div>

      {/* Task Presets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {taskPresets.map((p, idx) => (
          <div
            key={idx}
            onClick={() => onAskAI(p.prompt, 'tareas')}
            className="p-5 rounded-2xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-900/60 hover:border-[#00E5FF] transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-md"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#00E5FF] group-hover:text-white transition-colors">
                {p.title}
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                {p.desc}
              </p>
            </div>

            <div className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Probar asistente de tarea</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
