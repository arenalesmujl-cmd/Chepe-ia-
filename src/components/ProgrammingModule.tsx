import React, { useState } from 'react';
import { PROGRAMMING_LANGUAGES } from '../data/chepeData';
import { CodeBlock } from './CodeBlock';
import {
  Code, Terminal, Play, Bug, Cpu, FileCode2, Sparkles, Copy, Download,
  Send, RefreshCw, Check, Layers, Database, Shield, Flame
} from 'lucide-react';

interface ProgrammingModuleProps {
  onAskAI: (prompt: string, specialty: string) => void;
}

export const ProgrammingModule: React.FC<ProgrammingModuleProps> = ({ onAskAI }) => {
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [promptText, setPromptText] = useState('');
  const [sandboxCode, setSandboxCode] = useState(
`// Sandbox Interactivo Chepe IA
// Puedes modificar y ejecutar este código JavaScript directamente aquí

function chepeFibonacci(n) {
  if (n <= 1) return n;
  return chepeFibonacci(n - 1) + chepeFibonacci(n - 2);
}

console.log("Calculando serie Fibonacci con Chepe IA...");
for (let i = 0; i < 8; i++) {
  console.log(\`Fibonacci(\${i}) =\`, chepeFibonacci(i));
}
`
  );

  const [sandboxOutput, setSandboxOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const samplePrompts = [
    {
      title: 'Crear componente React + Tailwind',
      desc: 'Genera un componente modular reutilizable con estados y tipos.',
      lang: 'typescript',
      prompt: 'Escribe un componente React funcional en TypeScript con Tailwind CSS para una tarjeta de usuario interactiva.'
    },
    {
      title: 'Script de Python para web scraping / API',
      desc: 'Extracción de datos asíncrona con manejo de errores.',
      lang: 'python',
      prompt: 'Escribe un script en Python 3 usando requests y BeautifulSoup para consumir una API REST e imprimir resultados en JSON.'
    },
    {
      title: 'Script Lua para Roblox Studio',
      desc: 'Sistema de leaderboard y recompensas de experiencia.',
      lang: 'lua',
      prompt: 'Escribe un Script de Roblox Studio en Lua para gestionar el servicio DataStore y guardar monedas de los jugadores.'
    },
    {
      title: 'Consulta SQL de agregación avanzada',
      desc: 'INNER JOINs, GROUP BY y funciones de ventana.',
      lang: 'sql',
      prompt: 'Escribe una consulta SQL avanzada que agrupe ventas mensuales por cliente y ordene el top 10 con la función RANK().'
    },
    {
      title: 'Función en Kotlin con Corrutinas & Flow',
      desc: 'Programación reactiva y manejo de estados para Android.',
      lang: 'kotlin',
      prompt: 'Escribe una función en Kotlin para Android que descargue datos en segundo plano usando StateFlow y Corrutinas.'
    },
    {
      title: 'Servicio Web C# .NET Web API',
      desc: 'Controlador REST con inyección de dependencias.',
      lang: 'csharp',
      prompt: 'Crea un Controller de ASP.NET Core en C# para un servicio CRUD de usuarios con Entity Framework.'
    }
  ];

  const handleRunSandbox = async () => {
    setIsRunning(true);
    setSandboxOutput(['[Sandbox Chepe IA] Ejecutando código...']);

    try {
      const res = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: sandboxCode, language: 'javascript' })
      });

      const data = await res.json();
      if (data.success) {
        setSandboxOutput([
          `[Chepe IA Engine] Tiempo de ejecución: ${data.executionTimeMs}ms`,
          '----------------------------------------',
          ...(data.logs || []),
          data.result !== null ? `Resultado devuelto: ${data.result}` : ''
        ].filter(Boolean));
      } else {
        setSandboxOutput([
          `[Chepe IA Sandbox] Error sintáctico o de ejecución:`,
          `----------------------------------------`,
          data.error || 'Error desconocido'
        ]);
      }
    } catch (err: any) {
      setSandboxOutput([`[Error de conexión] ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    const langObj = PROGRAMMING_LANGUAGES.find(l => l.id === selectedLang);
    const fullPrompt = `[Lenguaje: ${langObj?.name || selectedLang}]\n${promptText}`;
    onAskAI(fullPrompt, 'programacion');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase">
              <Code className="w-3.5 h-3.5 text-[#00E5FF]" />
              Centro de Desarrollo & Código Chepe IA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Programación, Depuración y Arquitectura
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Genera código limpio en HTML, CSS, JavaScript, Python, Java, Kotlin, C#, Lua, Roblox Studio y SQL. Revisa algoritmos, depura errores e integra APIs de alto rendimiento.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#050A14] p-3 rounded-2xl border border-cyan-900/80">
            <Cpu className="w-8 h-8 text-[#00E5FF] animate-pulse" />
            <div className="text-left">
              <div className="text-xs text-stone-400 font-semibold">Motor Dev Activo</div>
              <div className="text-xs font-bold text-emerald-400">Chepe 3.8 Code Engine</div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector Chips */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00E5FF]" />
          Selecciona un Lenguaje o Tecnología:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {PROGRAMMING_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#002C3E] text-[#00E5FF] border-[#00E5FF] shadow-lg shadow-cyan-500/20 scale-102'
                    : 'bg-[#081021] text-stone-300 border-cyan-900/60 hover:border-cyan-500/60 hover:bg-[#0F1C36]'
                }`}
              >
                <span className="text-base">{lang.icon}</span>
                <span className="truncate">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Prompt Assistant Input */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00E5FF]" />
          ¿Qué código necesitas construir o corregir hoy?
        </h3>

        <form onSubmit={handleSubmitPrompt} className="space-y-3">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={`Describe tu problema o requerimiento para ${PROGRAMMING_LANGUAGES.find(l => l.id === selectedLang)?.name}... Ej: Crea una API en Node.js para autenticación de usuarios.`}
            rows={4}
            className="w-full p-4 rounded-2xl bg-[#050A14] border border-cyan-900 text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF] leading-relaxed resize-none font-mono"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
              <span>Lenguaje seleccionado: </span>
              <strong className="text-cyan-300 uppercase">{selectedLang}</strong>
            </div>

            <button
              type="submit"
              disabled={!promptText.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 disabled:opacity-40 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Generar Código con Chepe IA</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preset Code Prompts Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-[#00E5FF]" />
          Plantillas Rápidas de Programación:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {samplePrompts.map((p, idx) => (
            <div
              key={idx}
              onClick={() => onAskAI(p.prompt, 'programacion')}
              className="p-4 rounded-2xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-900/60 hover:border-[#00E5FF] transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00E5FF] group-hover:text-white">
                    {p.title}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {p.lang}
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Usar plantilla</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live JavaScript Sandbox Execution Component */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cyan-900/60 pb-3">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="text-base font-extrabold text-white">
              Sandbox Interactivo en Tiempo Real (JavaScript)
            </h3>
          </div>

          <button
            onClick={handleRunSandbox}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer transition-transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Ejecutando...' : 'Ejecutar en Sandbox'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              Código Fuente JS:
            </label>
            <textarea
              value={sandboxCode}
              onChange={(e) => setSandboxCode(e.target.value)}
              rows={10}
              className="w-full p-4 rounded-2xl bg-[#050A14] border border-cyan-900/80 text-cyan-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-[#00E5FF] resize-none"
            />
          </div>

          {/* Terminal Output */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Consola de Salida (Logs):
            </label>
            <div className="w-full h-[220px] p-4 rounded-2xl bg-[#03060D] border border-emerald-950 text-emerald-400 font-mono text-xs overflow-y-auto leading-relaxed space-y-1">
              {sandboxOutput.length === 0 ? (
                <div className="text-stone-600 italic">Haz clic en "Ejecutar en Sandbox" para probar tu código...</div>
              ) : (
                sandboxOutput.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap">{line}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
