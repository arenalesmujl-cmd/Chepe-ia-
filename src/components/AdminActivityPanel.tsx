import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Activity,
  Users,
  Cpu,
  Zap,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Clock,
  Radio,
  BarChart3,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  UserCheck,
  Bot,
  Filter
} from 'lucide-react';

interface HourlyDataPoint {
  time: string;
  humanRequests: number;
  aiResponses: number;
  tokensK: number;
  latencyMs: number;
}

interface ModuleTrafficPoint {
  module: string;
  humanos: number;
  ia: number;
}

interface LiveEvent {
  id: string;
  type: 'human' | 'ai';
  user: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

const INITIAL_HOURLY_DATA: HourlyDataPoint[] = [
  { time: '00:00', humanRequests: 420, aiResponses: 580, tokensK: 120, latencyMs: 640 },
  { time: '02:00', humanRequests: 210, aiResponses: 290, tokensK: 65, latencyMs: 590 },
  { time: '04:00', humanRequests: 150, aiResponses: 190, tokensK: 45, latencyMs: 580 },
  { time: '06:00', humanRequests: 380, aiResponses: 510, tokensK: 110, latencyMs: 610 },
  { time: '08:00', humanRequests: 1240, aiResponses: 1780, tokensK: 390, latencyMs: 780 },
  { time: '10:00', humanRequests: 2890, aiResponses: 4120, tokensK: 920, latencyMs: 840 },
  { time: '12:00', humanRequests: 3450, aiResponses: 4900, tokensK: 1140, latencyMs: 890 },
  { time: '14:00', humanRequests: 3890, aiResponses: 5460, tokensK: 1280, latencyMs: 870 },
  { time: '16:00', humanRequests: 4120, aiResponses: 5890, tokensK: 1390, latencyMs: 910 },
  { time: '18:00', humanRequests: 3650, aiResponses: 5100, tokensK: 1190, latencyMs: 860 },
  { time: '20:00', humanRequests: 2940, aiResponses: 4050, tokensK: 940, latencyMs: 820 },
  { time: '22:00', humanRequests: 1820, aiResponses: 2540, tokensK: 580, latencyMs: 740 }
];

const MODULE_TRAFFIC_DATA: ModuleTrafficPoint[] = [
  { module: 'Chat General', humanos: 14200, ia: 19800 },
  { module: 'Programación', humanos: 9800, ia: 14500 },
  { module: 'Matemáticas', humanos: 4600, ia: 6200 },
  { module: 'Análisis Datos', humanos: 5900, ia: 8900 },
  { module: 'Multimedia / Video', humanos: 3800, ia: 5600 },
  { module: 'Búsqueda Web', humanos: 6200, ia: 8400 }
];

const PIE_TRAFFIC_DISTRIBUTION = [
  { name: '👤 Usuarios Web (Humanos)', value: 32450, color: '#00E5FF' },
  { name: '📱 Usuarios Móvil (Humanos)', value: 16470, color: '#38BDF8' },
  { name: '🤖 Respuestas IA / LLM', value: 48900, color: '#F59E0B' },
  { name: '⚡ Agentes & Herramientas IA', value: 19550, color: '#8B5CF6' }
];

const INITIAL_EVENTS: LiveEvent[] = [
  {
    id: 'evt-1',
    type: 'human',
    user: 'Jose Arenales',
    action: 'Envió prompt complejo con código',
    module: 'Programación',
    details: 'Python FastApi + Docker',
    timestamp: 'Hace 4 seg'
  },
  {
    id: 'evt-2',
    type: 'ai',
    user: 'Chepe IA (Gemini 2.5 Pro)',
    action: 'Completó generación en 1.1s',
    module: 'Programación',
    details: '1,420 tokens • 0 errores de sintaxis',
    timestamp: 'Hace 3 seg'
  },
  {
    id: 'evt-3',
    type: 'human',
    user: 'Carlos Rodríguez',
    action: 'Inició sesión y consulta matemática',
    module: 'Matemáticas',
    details: 'Cálculo de Integrales Dobles',
    timestamp: 'Hace 12 seg'
  },
  {
    id: 'evt-4',
    type: 'ai',
    user: 'Chepe IA (DeepSeek R1)',
    action: 'Resolución paso a paso generada',
    module: 'Matemáticas',
    details: '890 tokens • LaTeX formateado',
    timestamp: 'Hace 10 seg'
  },
  {
    id: 'evt-5',
    type: 'human',
    user: 'Sofía Morales',
    action: 'Cargó documento PDF para análisis',
    module: 'Análisis Datos',
    details: 'Reporte_Financiero_Q4.pdf (2.4MB)',
    timestamp: 'Hace 24 seg'
  }
];

export const AdminActivityPanel: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [trafficFilter, setTrafficFilter] = useState<'all' | 'human' | 'ai'>('all');
  const [isLiveTelemetry, setIsLiveTelemetry] = useState<boolean>(true);
  const [chartType, setChartType] = useState<'area' | 'bar' | 'latency'>('area');
  
  const [hourlyData, setHourlyData] = useState<HourlyDataPoint[]>(INITIAL_HOURLY_DATA);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(INITIAL_EVENTS);
  const [pulseCount, setPulseCount] = useState<number>(0);
  
  // Real-time live pulse simulation
  useEffect(() => {
    if (!isLiveTelemetry) return;

    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);

      // Random micro-variations for the last hour
      setHourlyData((prev) => {
        const lastIndex = prev.length - 1;
        const current = prev[lastIndex];
        const randomHumanDelta = Math.floor(Math.random() * 9) - 3;
        const randomAiDelta = Math.floor(Math.random() * 12) - 4;
        
        const updated = [...prev];
        updated[lastIndex] = {
          ...current,
          humanRequests: Math.max(100, current.humanRequests + randomHumanDelta),
          aiResponses: Math.max(150, current.aiResponses + randomAiDelta),
          latencyMs: Math.max(500, Math.min(1200, current.latencyMs + Math.floor(Math.random() * 20) - 10))
        };
        return updated;
      });

      // Periodically inject a new live event
      if (Math.random() > 0.4) {
        const isHuman = Math.random() > 0.45;
        const humanNames = ['Jose Arenales', 'Carlos Rodríguez', 'María Fernández', 'Sofía Morales', 'Fernando Castillo', 'Lucía Benítez'];
        const aiModels = ['Chepe IA (Gemini 2.5 Pro)', 'Chepe IA (Claude 3.7)', 'Chepe IA (DeepSeek R1)', 'Chepe IA (GPT-4o)'];
        const modules = ['Chat General', 'Programación', 'Análisis Datos', 'Matemáticas', 'Búsqueda Web'];

        const randomModule = modules[Math.floor(Math.random() * modules.length)];
        const newEvent: LiveEvent = isHuman
          ? {
              id: `evt-${Date.now()}`,
              type: 'human',
              user: humanNames[Math.floor(Math.random() * humanNames.length)],
              action: 'Ejecutó nueva petición interactiva',
              module: randomModule,
              details: `Consulta enviada desde cliente Web`,
              timestamp: 'Ahora mismo'
            }
          : {
              id: `evt-${Date.now()}`,
              type: 'ai',
              user: aiModels[Math.floor(Math.random() * aiModels.length)],
              action: `Respuesta procesada en ${(0.6 + Math.random() * 0.8).toFixed(2)}s`,
              module: randomModule,
              details: `${Math.floor(400 + Math.random() * 1200)} tokens procesados`,
              timestamp: 'Ahora mismo'
            };

        setLiveEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveTelemetry]);

  // Totals calculation
  const totalHumanRequestsToday = hourlyData.reduce((acc, curr) => acc + curr.humanRequests, 0);
  const totalAiResponsesToday = hourlyData.reduce((acc, curr) => acc + curr.aiResponses, 0);
  const totalInteractions = totalHumanRequestsToday + totalAiResponsesToday;
  const humanRatio = ((totalHumanRequestsToday / totalInteractions) * 100).toFixed(1);
  const aiRatio = ((totalAiResponsesToday / totalInteractions) * 100).toFixed(1);
  const avgLatency = Math.round(hourlyData.reduce((acc, curr) => acc + curr.latencyMs, 0) / hourlyData.length);

  // Custom Recharts Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050A14] border border-cyan-500/60 p-3 rounded-xl shadow-2xl space-y-1.5 text-xs font-sans">
          <div className="text-stone-300 font-mono font-bold border-b border-cyan-950 pb-1 flex items-center justify-between gap-3">
            <span>Hora: {label}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded font-mono">En Vivo</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono font-bold text-white">
                {entry.value.toLocaleString()} {entry.name.includes('Latencia') ? 'ms' : 'peticiones'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-500/40 space-y-6 shadow-2xl font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-cyan-950">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00E5FF]" />
              Telemetría de Actividad en Tiempo Real: Humanos vs IA
            </h3>
            {isLiveTelemetry && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-700 animate-pulse">
                <Radio className="w-3 h-3 text-emerald-400" /> EN VIVO
              </span>
            )}
          </div>
          <p className="text-xs text-stone-300">
            Monitoreo en vivo del flujo de consultas emitidas por personas reales vs respuestas y agentes autónomos de IA.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#050A14] border border-cyan-900">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === '24h' ? 'bg-[#00E5FF] text-stone-950 font-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === '7d' ? 'bg-[#00E5FF] text-stone-950 font-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === '30d' ? 'bg-[#00E5FF] text-stone-950 font-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              30 Días
            </button>
          </div>

          {/* Traffic Category Filter */}
          <select
            value={trafficFilter}
            onChange={(e) => setTrafficFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="all">Todo el Tráfico (IA + Humanos)</option>
            <option value="human">Solo Tráfico Humano</option>
            <option value="ai">Solo Tráfico IA</option>
          </select>

          {/* Toggle Live Pulse */}
          <button
            onClick={() => setIsLiveTelemetry(!isLiveTelemetry)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
              isLiveTelemetry
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900/80'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isLiveTelemetry ? 'Pausar Telemetría' : 'Reanudar En Vivo'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Human vs IA Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Human Requests Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0B2347] to-[#050E20] border border-[#00E5FF]/40 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-extrabold text-cyan-300">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#00E5FF]" />
              Tráfico Humano (Personas)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300">
              {humanRatio}% del Total
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalHumanRequestsToday.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-300 flex items-center justify-between">
            <span>Prompts y consultas interactivas</span>
            <span className="text-emerald-400 font-bold">+14.2% hoy</span>
          </div>
        </div>

        {/* AI Invocations Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#281604] to-[#0D0902] border border-amber-500/40 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-extrabold text-amber-300">
            <span className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-amber-400" />
              Tráfico de IA (Modelos & Tools)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-950 border border-amber-800 text-amber-300">
              {aiRatio}% del Total
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalAiResponsesToday.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-300 flex items-center justify-between">
            <span>Respuestas y ejecuciones de agentes</span>
            <span className="text-amber-400 font-bold">1.41x ratio</span>
          </div>
        </div>

        {/* Average Latency */}
        <div className="p-4 rounded-2xl bg-[#050A14] border border-cyan-900/80 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-extrabold text-stone-300">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              Latencia Promedio de Respuesta
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {avgLatency} <span className="text-sm text-stone-400 font-normal">ms</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Tiempo de cómputo y streaming en tiempo real
          </div>
        </div>

        {/* Bot / Abuse Filtering */}
        <div className="p-4 rounded-2xl bg-[#050A14] border border-cyan-900/80 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-extrabold text-stone-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Protección Anti-Bot & Autenticación
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              100% Limpio
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            0 <span className="text-sm text-stone-400 font-normal">Bots No Autorizados</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Cuentas verificadas y sesiones humanas activas
          </div>
        </div>
      </div>

      {/* Main Visual Charts Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Flujo Temporal de Tráfico Comparativo (Últimas 24 Horas)
            </h4>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#050A14] border border-cyan-900 text-xs">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                chartType === 'area' ? 'bg-[#00E5FF] text-stone-950 font-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              Área Comparativa
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                chartType === 'bar' ? 'bg-[#00E5FF] text-stone-950 font-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              Barras por Hora
            </button>
            <button
              onClick={() => setChartType('latency')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                chartType === 'latency' ? 'bg-[#00E5FF] text-stone-950 font-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              Latencia (ms)
            </button>
          </div>
        </div>

        {/* Recharts Main Graph Container */}
        <div className="p-4 rounded-2xl bg-[#050A14] border border-cyan-950 shadow-inner">
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#13233F" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => <span className="text-xs font-bold text-stone-300">{value}</span>}
                  />
                  {(trafficFilter === 'all' || trafficFilter === 'human') && (
                    <Area
                      type="monotone"
                      dataKey="humanRequests"
                      name="Peticiones Humanas (Prompts)"
                      stroke="#00E5FF"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorHuman)"
                    />
                  )}
                  {(trafficFilter === 'all' || trafficFilter === 'ai') && (
                    <Area
                      type="monotone"
                      dataKey="aiResponses"
                      name="Invocaciones & Respuestas IA"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorAi)"
                    />
                  )}
                </AreaChart>
              ) : chartType === 'bar' ? (
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#13233F" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => <span className="text-xs font-bold text-stone-300">{value}</span>}
                  />
                  {(trafficFilter === 'all' || trafficFilter === 'human') && (
                    <Bar
                      dataKey="humanRequests"
                      name="Peticiones Humanas"
                      fill="#00E5FF"
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  {(trafficFilter === 'all' || trafficFilter === 'ai') && (
                    <Bar
                      dataKey="aiResponses"
                      name="Respuestas IA"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                </BarChart>
              ) : (
                <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#13233F" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="ms" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => <span className="text-xs font-bold text-stone-300">{value}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="latencyMs"
                    name="Latencia de Respuesta IA (ms)"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10B981' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Graphs: Distribution and Modules Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Module Breakdown BarChart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#050A14] border border-cyan-950 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950">
            <h4 className="text-xs font-extrabold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00E5FF]" />
              <span>Tráfico por Módulo del Sistema (Humanos vs IA)</span>
            </h4>
            <span className="text-[10px] text-stone-400 font-mono">Top 6 Módulos</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODULE_TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#13233F" vertical={false} />
                <XAxis dataKey="module" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={28}
                  formatter={(value) => <span className="text-[11px] font-bold text-stone-300">{value}</span>}
                />
                <Bar dataKey="humanos" name="Consultas Humanas" fill="#00E5FF" radius={[3, 3, 0, 0]} />
                <Bar dataKey="ia" name="Ejecuciones IA" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Share PieChart (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#050A14] border border-cyan-950 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950">
            <h4 className="text-xs font-extrabold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-amber-400" />
              <span>Distribución de Carga del Sistema</span>
            </h4>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_TRAFFIC_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {PIE_TRAFFIC_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#050A14" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString()} ops`, 'Volumen']}
                  contentStyle={{ backgroundColor: '#050A14', borderColor: '#0891B2', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Pie Legend list */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {PIE_TRAFFIC_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-[#081021] border border-cyan-950 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <div className="truncate">
                  <div className="text-[10px] font-bold text-stone-300 truncate">{item.name}</div>
                  <div className="text-[11px] font-mono text-white font-bold">{item.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Live Event Stream */}
      <div className="p-5 rounded-2xl bg-[#050A14] border border-cyan-950 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-cyan-950">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00E5FF]" />
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Flujo de Eventos en Vivo (Live Activity Feed)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Actualizando en tiempo real
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {liveEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-2.5 rounded-xl bg-[#081021] border border-cyan-950/80 hover:border-cyan-800 transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase tracking-wider shrink-0 ${
                    evt.type === 'human'
                      ? 'bg-cyan-950 text-[#00E5FF] border border-cyan-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {evt.type === 'human' ? '👤 Humano' : '🤖 IA / LLM'}
                </span>

                <span className="font-extrabold text-white truncate">{evt.user}</span>
                <span className="text-stone-400 hidden sm:inline">•</span>
                <span className="text-stone-300 truncate">{evt.action}</span>
                <span className="px-1.5 py-0.2 rounded bg-stone-900 text-stone-400 text-[10px] hidden md:inline shrink-0">
                  {evt.module}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                <span className="text-stone-400 hidden lg:inline">{evt.details}</span>
                <span className="text-cyan-400">{evt.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
