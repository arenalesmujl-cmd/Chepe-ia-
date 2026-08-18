import React, { useState, useEffect, useRef } from 'react';
import {
  Globe, Search, Link2, ExternalLink, Sparkles, Code2, Layout,
  Smartphone, Monitor, Tablet, Copy, Check, Download, RefreshCw,
  TrendingUp, CloudSun, ShieldCheck, ArrowRight, Eye, CheckCircle2,
  FileText, Layers, Hash, BookOpen, Terminal, Play, Zap, Compass,
  CheckCircle, Lock, ShieldAlert, Cpu, Activity, Server, AlertTriangle,
  Flame, Laptop, Maximize2, Minimize2, Wrench, RefreshCcw, Send,
  Share2, BarChart2, Star, Sparkle, Wand2
} from 'lucide-react';
import {
  WebScrapedResult,
  LiveWebSearchItem,
  WebAuditResult,
  GeneratedWebsite,
  LiveDnsResult
} from '../types';

interface WebToolsModuleProps {
  onAskAI?: (prompt: string, category?: string) => void;
}

const SAMPLE_SCRAPED_PRESETS = [
  { name: 'Wikipedia: Inteligencia Artificial', url: 'https://es.wikipedia.org/wiki/Inteligencia_artificial' },
  { name: 'Documentación Oficial React', url: 'https://react.dev' },
  { name: 'GitHub Developer Blog', url: 'https://github.blog' },
  { name: 'TechCrunch: AI News', url: 'https://techcrunch.com/category/artificial-intelligence/' },
  { name: 'OpenAI Research', url: 'https://openai.com/research' }
];

const CODE_SANDBOX_PRESETS = [
  {
    id: 'saas-landing',
    name: 'SaaS AI Platform Pro',
    category: 'Landing Page',
    description: 'Landing ultra moderna con gradientes neón, hero dinámico, pricing toggle interactivo y componentes UI pulidos.',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexusAI - Plataforma de Inteligencia Artificial</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .float-card { animation: float 4s ease-in-out infinite; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
  <!-- Navbar -->
  <header class="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30">
          ⚡
        </div>
        <span class="text-xl font-black text-white tracking-tight">Nexus<span class="text-cyan-400">AI</span></span>
      </div>
      <nav class="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
        <a href="#features" class="hover:text-cyan-400 transition">Modelos</a>
        <a href="#pricing" class="hover:text-cyan-400 transition">Precios</a>
        <a href="#stats" class="hover:text-cyan-400 transition">Métricas</a>
      </nav>
      <div class="flex items-center gap-3">
        <button onclick="alert('¡Conexión a consola autorizada!')" class="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-400/20 transition cursor-pointer">
          Comenzar Gratis
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="max-w-6xl mx-auto px-6 py-16 text-center space-y-8 flex-1">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
      ✨ Chepe IA Web Engine v4.0 • Renderizado Ultra Pro
    </div>

    <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
      Automatiza tu flujo de trabajo con <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Agentes Autónomos</span>
    </h1>

    <p class="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
      Implementa pipelines multimodales, análisis de código en vivo y síntesis de datos en microsegundos con latencia cero.
    </p>

    <div class="flex flex-wrap justify-center gap-4 pt-2">
      <button onclick="document.getElementById('demo-modal').classList.remove('hidden')" class="px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-400/30 transition cursor-pointer">
        ⚡ Abrir Sandbox de Pruebas
      </button>
      <button onclick="togglePricing()" class="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm transition cursor-pointer">
        Ver Comparativa de Precios
      </button>
    </div>

    <!-- Feature Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left" id="features">
      <div class="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition float-card">
        <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl mb-4">🚀</div>
        <h3 class="text-lg font-bold text-white mb-1">Inferencia en Tiempo Real</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Procesamiento de más de 120 tokens por segundo con cuantización FP8 de alta fidelidad.</p>
      </div>

      <div class="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition float-card" style="animation-delay: 1s;">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl mb-4">🛡️</div>
        <h3 class="text-lg font-bold text-white mb-1">Aislamiento Cifrado</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Entorno Zero-Knowledge con claves criptográficas rotativas y cumplimiento SOC2.</p>
      </div>

      <div class="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition float-card" style="animation-delay: 2s;">
        <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl mb-4">🌐</div>
        <h3 class="text-lg font-bold text-white mb-1">Grounding Web Global</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Extracción y validación cruzada de fuentes de internet en vivo con citas verificadas.</p>
      </div>
    </div>
  </main>

  <!-- Interactive Modal -->
  <div id="demo-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-cyan-500/40 p-6 rounded-3xl max-w-md w-full text-left space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-white">🧪 Prueba Interactiva de Agente</h3>
        <button onclick="document.getElementById('demo-modal').classList.add('hidden')" class="text-slate-400 hover:text-white font-bold">✕</button>
      </div>
      <p class="text-xs text-slate-300">¡El motor JavaScript del sandbox está 100% operativo y conectado en vivo!</p>
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
        Status: ONLINE • Latencia: 18ms
      </div>
      <button onclick="document.getElementById('demo-modal').classList.add('hidden')" class="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition">
        Entendido
      </button>
    </div>
  </div>

  <footer class="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
    Desarrollado con Chepe IA Web Studio • 2026
  </footer>
</body>
</html>`
  },
  {
    id: 'crypto-dashboard',
    name: 'Dashboard Fintech 3D Glass',
    category: 'Dashboard',
    description: 'Panel financiero interactivo con métricas de portafolio, selector de monedas y gráficos responsivos.',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Fintech Terminal</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#070D18] text-slate-100 p-6 font-sans min-h-screen">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <h1 class="text-2xl font-black text-white">Apex Terminal Pro</h1>
        </div>
        <p class="text-xs text-slate-400 mt-0.5">Cartera Cuántica & Arbitraje Automatizado</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="simulateTrade()" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20">
          + Ejecutar Orden
        </button>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-1">
        <span class="text-xs text-slate-400 font-medium">Patrimonio Neto</span>
        <p id="total-val" class="text-2xl font-black text-white">$142,850.00</p>
        <span class="text-[11px] text-emerald-400 font-semibold font-mono">+12.4% (24h)</span>
      </div>
      <div class="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-1">
        <span class="text-xs text-slate-400 font-medium">Rendimiento Mensual</span>
        <p class="text-2xl font-black text-cyan-400">+$18,920.40</p>
        <span class="text-[11px] text-cyan-300 font-semibold font-mono">18 transacciones</span>
      </div>
      <div class="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-1">
        <span class="text-xs text-slate-400 font-medium">Nivel de Riesgo</span>
        <p class="text-2xl font-black text-purple-400">Moderado A+</p>
        <span class="text-[11px] text-purple-300 font-semibold font-mono">Stop-loss activo</span>
      </div>
    </div>

    <!-- Live Positions Table -->
    <div class="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-4">
      <h3 class="text-sm font-bold text-white">Posiciones Abiertas en Tiempo Real</h3>
      <div class="space-y-2 text-xs">
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">₿</span>
            <div>
              <span class="font-bold text-white block">Bitcoin Core (BTC)</span>
              <span class="text-[10px] text-slate-400">1.42 BTC</span>
            </div>
          </div>
          <div class="text-right">
            <span class="font-bold text-white block">$133,877.60</span>
            <span class="text-emerald-400 font-mono">+3.85%</span>
          </div>
        </div>

        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">Ξ</span>
            <div>
              <span class="font-bold text-white block">Ethereum (ETH)</span>
              <span class="text-[10px] text-slate-400">8.50 ETH</span>
            </div>
          </div>
          <div class="text-right">
            <span class="font-bold text-white block">$23,634.25</span>
            <span class="text-emerald-400 font-mono">+2.10%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>
    function simulateTrade() {
      const val = document.getElementById('total-val');
      const curr = parseFloat(val.innerText.replace('$', '').replace(',', ''));
      val.innerText = '$' + (curr + 1500).toLocaleString('en-US', {minimumFractionDigits: 2});
      alert('¡Orden de compra ejecutada en red descentralizada! +$1,500.00');
    }
  </script>
</body>
</html>`
  },
  {
    id: 'ecommerce-luxury',
    name: 'E-Commerce de Lujo Minimalista',
    category: 'Tienda Online',
    description: 'Catálogo de productos con carrito reactivo, selector de tallas y checkout simulado.',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AURA - Maison de Parfums</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-stone-950 text-stone-100 font-serif min-h-screen p-6">
  <div class="max-w-4xl mx-auto space-y-10">
    <header class="flex justify-between items-center border-b border-stone-800 pb-6">
      <span class="text-2xl tracking-[0.3em] font-light uppercase">A U R A</span>
      <div class="flex items-center gap-4 text-xs font-sans">
        <button id="cart-btn" onclick="openCart()" class="px-3 py-1.5 rounded-full border border-stone-700 hover:border-amber-400 transition cursor-pointer">
          Bolsa (<span id="cart-count">0</span>)
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
      <div class="space-y-4">
        <span class="text-xs uppercase tracking-widest text-amber-400 font-sans">Colección Signature</span>
        <h1 class="text-4xl font-light leading-tight">Élixir de Nuit</h1>
        <p class="text-xs font-sans text-stone-400 leading-relaxed">
          Notas de ámbar gris, bergamota de Calabria y madera de cedro ahumada. Una fragancia envolvente para veladas inolvidables.
        </p>
        <div class="text-2xl font-light font-sans text-amber-300">$240.00 USD</div>
        <button onclick="addToCart()" class="w-full py-3.5 bg-stone-100 hover:bg-white text-stone-950 font-sans font-bold text-xs uppercase tracking-widest transition cursor-pointer">
          Añadir a la Bolsa
        </button>
      </div>

      <div class="aspect-square bg-stone-900 rounded-3xl border border-stone-800 flex items-center justify-center text-7xl shadow-2xl">
        🏺
      </div>
    </div>
  </div>
  <script>
    let count = 0;
    function addToCart() {
      count++;
      document.getElementById('cart-count').innerText = count;
      alert('¡Producto añadido con éxito a tu bolsa de compra!');
    }
    function openCart() {
      alert('Tienes ' + count + ' artículo(s) en tu bolsa de lujo.');
    }
  </script>
</body>
</html>`
  }
];

export const WebToolsModule: React.FC<WebToolsModuleProps> = ({ onAskAI }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'scraper' | 'generator' | 'audit' | 'search' | 'dns' | 'sandbox' | 'market'
  >('scraper');

  // URL Scraper states
  const [urlInput, setUrlInput] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapedData, setScrapedData] = useState<WebScrapedResult | null>(null);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // AI Web Generator states
  const [webPrompt, setWebPrompt] = useState<string>('');
  const [webStyle, setWebStyle] = useState<string>('modern-saas');
  const [webTheme, setWebTheme] = useState<string>('dark-neon');
  const [isGeneratingWeb, setIsGeneratingWeb] = useState<boolean>(false);
  const [generatedSite, setGeneratedSite] = useState<GeneratedWebsite | null>(null);

  // Web Auditor states
  const [auditUrlInput, setAuditUrlInput] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditData, setAuditData] = useState<WebAuditResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  // DNS & SSL Lookup states
  const [dnsDomainInput, setDnsDomainInput] = useState<string>('google.com');
  const [isDnsLoading, setIsDnsLoading] = useState<boolean>(false);
  const [dnsData, setDnsData] = useState<LiveDnsResult | null>(null);

  // Live Web Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('general');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<LiveWebSearchItem[]>([]);
  const [searchAnswer, setSearchAnswer] = useState<string | null>(null);

  // Sandbox Live Code Viewer states
  const [sandboxCode, setSandboxCode] = useState<string>(CODE_SANDBOX_PRESETS[0].html);
  const [sandboxDevice, setSandboxDevice] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
  const [sandboxPreset, setSandboxPreset] = useState<string>(CODE_SANDBOX_PRESETS[0].id);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['[Sandbox Engine] Entorno Web interactivo inicializado con éxito.']);

  // Market & Weather states
  const [weatherCity, setWeatherCity] = useState<string>('Ciudad de México');
  const [weatherData, setWeatherData] = useState<any>({
    city: 'Ciudad de México',
    temp: '22°C',
    condition: 'Parcialmente Nublado',
    humidity: '48%',
    wind: '14 km/h',
    uv: 'Moderado (5)'
  });

  const [marketPrices, setMarketPrices] = useState([
    { symbol: 'BTC/USD', name: 'Bitcoin', price: '$94,280.00', change: '+3.42%', isPositive: true },
    { symbol: 'ETH/USD', name: 'Ethereum', price: '$2,780.50', change: '+1.85%', isPositive: true },
    { symbol: 'NVDA', name: 'Nvidia Corp.', price: '$138.25', change: '+4.12%', isPositive: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$186.40', change: '+0.95%', isPositive: true },
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$232.10', change: '-0.30%', isPositive: false },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$218.90', change: '+5.60%', isPositive: true }
  ]);

  // Handle URL Scraping & Inspection
  const handleScrapeUrl = async (targetUrlOverride?: string) => {
    const target = targetUrlOverride || urlInput;
    if (!target || !target.trim()) return;

    setIsScraping(true);
    setScrapeError(null);

    try {
      const res = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.trim() })
      });
      const data = await res.json();
      if (data.data) {
        setScrapedData(data.data);
      } else if (data.error) {
        setScrapeError(data.error);
      }
    } catch (err: any) {
      console.error('Error scraping web URL:', err);
      setScrapeError('No se pudo establecer conexión con la URL especificada.');
    } finally {
      setIsScraping(false);
    }
  };

  // Handle AI Website Generation
  const handleGenerateWebsite = async () => {
    if (!webPrompt.trim()) return;
    setIsGeneratingWeb(true);

    try {
      const res = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: webPrompt.trim(),
          style: webStyle,
          theme: webTheme
        })
      });
      const data = await res.json();
      if (data.website) {
        setGeneratedSite(data.website);
        setSandboxCode(data.website.html);
        setConsoleLogs(prev => [...prev, `[AI Web Generator] Sitio generado con éxito para "${webPrompt.slice(0, 30)}..."`]);
      }
    } catch (err) {
      console.error('Error generating website:', err);
    } finally {
      setIsGeneratingWeb(false);
    }
  };

  // Handle Web Audit
  const handleAuditWebsite = async (targetUrlOverride?: string) => {
    const target = targetUrlOverride || auditUrlInput;
    if (!target || !target.trim()) return;

    setIsAuditing(true);
    setAuditError(null);

    try {
      const res = await fetch('/api/audit-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.trim() })
      });
      const data = await res.json();
      if (data.data) {
        setAuditData(data.data);
      } else if (data.error) {
        setAuditError(data.error);
      }
    } catch (err) {
      console.error('Error in website audit:', err);
      setAuditError('No se pudo completar la auditoría técnica de la URL.');
    } finally {
      setIsAuditing(false);
    }
  };

  // Handle DNS & SSL Lookup
  const handleDnsLookup = async (targetDomain?: string) => {
    const d = targetDomain || dnsDomainInput;
    if (!d) return;

    setIsDnsLoading(true);
    try {
      const res = await fetch('/api/dns-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: d })
      });
      const data = await res.json();
      if (data.data) {
        setDnsData(data.data);
      }
    } catch (err) {
      console.error('Error in DNS lookup:', err);
    } finally {
      setIsDnsLoading(false);
    }
  };

  // Handle Live Web Search
  const handleLiveSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setSearchAnswer(null);

    try {
      const res = await fetch('/api/web-search-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery.trim(),
          category: searchCategory
        })
      });
      const data = await res.json();
      if (data.data) {
        setSearchResults(data.data.results || []);
        setSearchAnswer(data.data.synthesizedAnswer || null);
      }
    } catch (err) {
      console.error('Error performing live web search:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCheckWeather = (city: string) => {
    setWeatherCity(city);
    const hash = city.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const temps = [18, 21, 24, 26, 28, 16, 22];
    const conditions = ['Soleado y Despejado', 'Parcialmente Nublado', 'Brisa Fresca', 'Lluvia Ligera'];
    setWeatherData({
      city: city,
      temp: `${temps[hash % temps.length]}°C`,
      condition: conditions[hash % conditions.length],
      humidity: `${40 + (hash % 40)}%`,
      wind: `${10 + (hash % 18)} km/h`,
      uv: `${3 + (hash % 6)}/10`
    });
  };

  const handleCopySummary = () => {
    if (!scrapedData?.summary) return;
    navigator.clipboard.writeText(`${scrapedData.title}\n\n${scrapedData.summary}\n\nPuntos Clave:\n${scrapedData.keyTakeaways.map(k => '- ' + k).join('\n')}`);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sandboxCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([sandboxCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chepe_website_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="web-tools-module" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#080E1C] via-[#0B1A3A] to-[#08152E] border border-cyan-500/40 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] text-[11px] font-extrabold uppercase tracking-wider border border-[#00E5FF]/40 flex items-center gap-1.5 shadow-sm">
                <Globe className="w-3.5 h-3.5" />
                Suite de Navegación & Desarrollo Web Ultra Pro
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                En Vivo & Grounded
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Compass className="w-7 h-7 text-[#00E5FF]" />
              Herramientas Web Ultra Pro
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
              Crea sitios web completos con IA, audita SEO y rendimiento 360°, inspecciona URLs en tiempo real, analiza DNS/SSL y experimenta en el sandbox interactivo con Tailwind CSS.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#050A14]/90 p-1.5 rounded-2xl border border-cyan-900/60 self-start md:self-center shadow-inner">
            <button
              onClick={() => setActiveSubTab('scraper')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'scraper'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Lector Web
            </button>
            <button
              onClick={() => setActiveSubTab('generator')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'generator'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Creador IA
            </button>
            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'audit'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Auditor 360°
            </button>
            <button
              onClick={() => setActiveSubTab('search')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'search'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Búsqueda en Vivo
            </button>
            <button
              onClick={() => setActiveSubTab('dns')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'dns'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              DNS & SSL
            </button>
            <button
              onClick={() => setActiveSubTab('sandbox')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'sandbox'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Sandbox
            </button>
            <button
              onClick={() => setActiveSubTab('market')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'market'
                  ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Mercados
            </button>
          </div>
        </div>
      </div>

      {/* 1. LECTOR & INSPECTOR DE URLs */}
      {activeSubTab === 'scraper' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 shadow-xl space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#00E5FF]" />
                Ingresa una URL o Enlace Web para analizar con Inteligencia Artificial:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleScrapeUrl();
                    }}
                    placeholder="https://ejemplo.com/articulo-o-noticia"
                    className="w-full pl-4 pr-4 py-3 rounded-2xl bg-[#050A14] border border-cyan-900/60 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF] transition-all shadow-inner font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleScrapeUrl()}
                  disabled={!urlInput.trim() || isScraping}
                  className="py-3 px-6 rounded-2xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  {isScraping ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Extrayendo Datos...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-stone-950" />
                      <span>Inspeccionar & Resumir</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Presets Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-stone-400">Pruebas Rápidas:</span>
              {SAMPLE_SCRAPED_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrlInput(preset.url);
                    handleScrapeUrl(preset.url);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#050A14] hover:bg-cyan-950 text-stone-300 hover:text-[#00E5FF] border border-cyan-900/40 text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {scrapeError && (
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️ {scrapeError}</span>
            </div>
          )}

          {scrapedData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in">
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-3xl bg-[#080E1C] border border-cyan-900/40 p-6 space-y-5 shadow-xl">
                  <div className="flex items-start justify-between gap-3 border-b border-cyan-950 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {scrapedData.faviconUrl && (
                          <img src={scrapedData.faviconUrl} alt="" className="w-4 h-4 rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        )}
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-[#00E5FF] font-mono text-[10px] border border-cyan-900/50">
                          {scrapedData.domain}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                        {scrapedData.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleCopySummary}
                        className="p-2 rounded-xl bg-[#050A14] hover:bg-cyan-950 text-stone-300 hover:text-[#00E5FF] border border-cyan-900/50 text-xs transition-colors cursor-pointer"
                        title="Copiar Resumen"
                      >
                        {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={scrapedData.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-[#050A14] hover:bg-cyan-950 text-stone-300 hover:text-[#00E5FF] border border-cyan-900/50 text-xs transition-colors cursor-pointer"
                        title="Abrir enlace original"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
                      Resumen Ejecutivo de Contenido:
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line bg-[#050A14] p-4 rounded-2xl border border-cyan-950">
                      {scrapedData.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Puntos Clave Extraídos:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {scrapedData.keyTakeaways.map((point, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 text-xs text-stone-300 flex items-start gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {onAskAI && (
                    <div className="pt-2">
                      <button
                        onClick={() => onAskAI(`He analizado la página "${scrapedData.title}" (${scrapedData.url}).\n\nResumen: ${scrapedData.summary}\n\nPor favor profundiza y responde preguntas sobre este contenido.`, 'asistente_web')}
                        className="w-full py-2.5 px-4 rounded-2xl bg-cyan-950 hover:bg-cyan-900/60 border border-[#00E5FF]/40 text-[#00E5FF] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Abrir en Chat para hacer preguntas sobre esta página web</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-3xl bg-[#080E1C] border border-cyan-900/40 p-5 space-y-4 shadow-xl">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-cyan-950 pb-3">
                    <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                    Métricas & Tecnologías
                  </h3>

                  <div className="p-4 rounded-2xl bg-[#050A14] border border-cyan-950 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 block">Puntaje de Calidad / SEO</span>
                      <span className="text-xl font-black text-emerald-400">{scrapedData.seoScore || 90}/100</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
                      A+
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950">
                      <span className="text-[10px] text-stone-400 block">Palabras</span>
                      <span className="font-bold text-white text-sm">{scrapedData.wordCount || 850}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950">
                      <span className="text-[10px] text-stone-400 block">Secciones</span>
                      <span className="font-bold text-white text-sm">{scrapedData.headings?.length || 4}</span>
                    </div>
                  </div>

                  {scrapedData.techStack && scrapedData.techStack.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-stone-400 block">Stack Detectado:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {scrapedData.techStack.map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 text-[10px] border border-blue-800/40">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-400 block">Temas Principales:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scrapedData.mainTopics?.map((topic, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 text-[10px] font-semibold border border-cyan-900/50">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. CREADOR DE SITIOS WEB CON IA */}
      {activeSubTab === 'generator' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00E5FF]" />
              <h2 className="text-sm font-bold text-white">Generador Instantáneo de Páginas Web & Apps UI</h2>
            </div>
            <p className="text-xs text-stone-400">
              Describe cualquier sitio web, landing page o dashboard que desees crear. Chepe IA generará el código HTML5 completo con Tailwind CSS y componentes interactivos listos para usar.
            </p>

            <div className="space-y-3">
              <textarea
                value={webPrompt}
                onChange={(e) => setWebPrompt(e.target.value)}
                rows={3}
                placeholder="Ejemplo: Landing page moderna para una startup de satélites agrícolas, con modo oscuro, testimonios, tabla de precios mensual/anual y formulario de contacto reactivo..."
                className="w-full p-4 rounded-2xl bg-[#050A14] border border-cyan-900/60 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF] transition-all font-sans resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#050A14] p-1.5 rounded-xl border border-cyan-950 text-xs">
                    <span className="text-[10px] text-stone-400 font-bold px-1">Estilo:</span>
                    <select
                      value={webStyle}
                      onChange={(e) => setWebStyle(e.target.value)}
                      className="bg-transparent text-cyan-300 font-bold text-xs outline-none cursor-pointer"
                    >
                      <option value="modern-saas" className="bg-[#080E1C]">SaaS Moderno</option>
                      <option value="dark-neon" className="bg-[#080E1C]">Cyberpunk Neón</option>
                      <option value="clean-minimal" className="bg-[#080E1C]">Minimalista Limpio</option>
                      <option value="ecommerce" className="bg-[#080E1C]">E-Commerce Tienda</option>
                      <option value="portfolio" className="bg-[#080E1C]">Portafolio Creativo</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#050A14] p-1.5 rounded-xl border border-cyan-950 text-xs">
                    <span className="text-[10px] text-stone-400 font-bold px-1">Tema:</span>
                    <select
                      value={webTheme}
                      onChange={(e) => setWebTheme(e.target.value)}
                      className="bg-transparent text-cyan-300 font-bold text-xs outline-none cursor-pointer"
                    >
                      <option value="dark-neon" className="bg-[#080E1C]">Dark High-Tech</option>
                      <option value="luxury-gold" className="bg-[#080E1C]">Luxury & Gold</option>
                      <option value="emerald-green" className="bg-[#080E1C]">Emerald Clean</option>
                      <option value="light-clean" className="bg-[#080E1C]">Light Corporate</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateWebsite}
                  disabled={!webPrompt.trim() || isGeneratingWeb}
                  className="py-3 px-6 rounded-2xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  {isGeneratingWeb ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Diseñando Sitio Web...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-stone-950" />
                      <span>Generar Sitio Web con IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Inspiration Prompts */}
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-cyan-950">
              <span className="text-[11px] font-bold text-stone-400">Inspiración:</span>
              {[
                'Plataforma de Criptomonedas & Staking',
                'Restaurante de Sushi Fusión con Reserva Online',
                'Agencia de Marketing Digital con Portafolio',
                'Calculadora de ROI para Inversiones Inmobiliarias'
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setWebPrompt(p);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#050A14] hover:bg-cyan-950 text-stone-300 hover:text-[#00E5FF] border border-cyan-900/40 text-[11px] font-medium transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Result Preview */}
          {generatedSite && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between bg-[#080E1C] p-4 rounded-2xl border border-cyan-900/50 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{generatedSite.title}</h3>
                  <span className="text-xs text-stone-400">{generatedSite.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveSubTab('sandbox');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#00E5FF] text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Editar en Sandbox</span>
                  </button>
                  <button
                    onClick={handleDownloadHtml}
                    className="px-3 py-1.5 rounded-xl bg-[#050A14] text-cyan-300 border border-cyan-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar .html</span>
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-[#080E1C] border border-cyan-900/40 overflow-hidden shadow-2xl">
                <div className="p-3 bg-[#0B132B] border-b border-cyan-950 flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
                    Vista Previa Interactiva Generada
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">100% Funcional</span>
                </div>
                <div className="p-4 bg-[#050A14] flex justify-center min-h-[500px]">
                  <iframe
                    srcDoc={generatedSite.html}
                    title="AI Generated Website"
                    sandbox="allow-scripts allow-modals allow-forms"
                    className="w-full h-[550px] rounded-2xl border border-cyan-950 bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. AUDITOR WEB 360° */}
      {activeSubTab === 'audit' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 shadow-xl space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                Auditoría Técnica Web 360° (Performance, SEO, Seguridad & Accesibilidad):
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={auditUrlInput}
                  onChange={(e) => setAuditUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAuditWebsite();
                  }}
                  placeholder="https://tudominio.com"
                  className="flex-1 pl-4 pr-4 py-3 rounded-2xl bg-[#050A14] border border-cyan-900/60 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF] transition-all shadow-inner font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAuditWebsite()}
                  disabled={!auditUrlInput.trim() || isAuditing}
                  className="py-3 px-6 rounded-2xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  {isAuditing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Auditando Dominio...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4 text-stone-950" />
                      <span>Ejecutar Auditoría 360°</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-stone-400">Probar con:</span>
              {['https://react.dev', 'https://github.com', 'https://tailwindcss.com', 'https://vercel.com'].map((u, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAuditUrlInput(u);
                    handleAuditWebsite(u);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#050A14] hover:bg-cyan-950 text-stone-300 hover:text-[#00E5FF] border border-cyan-900/40 text-[11px] font-mono"
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {auditError && (
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️ {auditError}</span>
            </div>
          )}

          {auditData && (
            <div className="space-y-6 animate-in fade-in">
              {/* Score Gauges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-4 rounded-2xl bg-[#080E1C] border border-cyan-900/40 text-center space-y-1">
                  <span className="text-[11px] text-stone-400 font-bold">Rendimiento</span>
                  <div className="text-3xl font-black text-emerald-400">{auditData.scores.performance}</div>
                  <span className="text-[10px] text-emerald-300 font-bold block">Excelente</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#080E1C] border border-cyan-900/40 text-center space-y-1">
                  <span className="text-[11px] text-stone-400 font-bold">SEO Orgánico</span>
                  <div className="text-3xl font-black text-cyan-400">{auditData.scores.seo}</div>
                  <span className="text-[10px] text-cyan-300 font-bold block">Optimizado</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#080E1C] border border-cyan-900/40 text-center space-y-1">
                  <span className="text-[11px] text-stone-400 font-bold">Seguridad & SSL</span>
                  <div className="text-3xl font-black text-blue-400">{auditData.scores.security}</div>
                  <span className="text-[10px] text-blue-300 font-bold block">TLS 1.3 Seguro</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#080E1C] border border-cyan-900/40 text-center space-y-1">
                  <span className="text-[11px] text-stone-400 font-bold">Accesibilidad</span>
                  <div className="text-3xl font-black text-purple-400">{auditData.scores.accessibility}</div>
                  <span className="text-[10px] text-purple-300 font-bold block">WCAG AA</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#080E1C] border border-cyan-900/40 text-center space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-stone-400 font-bold">Buenas Prácticas</span>
                  <div className="text-3xl font-black text-amber-400">{auditData.scores.bestPractices}</div>
                  <span className="text-[10px] text-amber-300 font-bold block">Modern Web</span>
                </div>
              </div>

              {/* Core Web Vitals & Tech Stack */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 rounded-3xl bg-[#080E1C] border border-cyan-900/40 p-5 space-y-4">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-cyan-950 pb-3">
                    <Activity className="w-4 h-4 text-[#00E5FF]" />
                    Core Web Vitals de Google
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950">
                      <span className="text-[10px] text-stone-400 block">LCP (Carga)</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm">{auditData.coreWebVitals.lcp}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950">
                      <span className="text-[10px] text-stone-400 block">FID (Interactividad)</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm">{auditData.coreWebVitals.fid}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950">
                      <span className="text-[10px] text-stone-400 block">CLS (Estabilidad)</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm">{auditData.coreWebVitals.cls}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950">
                      <span className="text-[10px] text-stone-400 block">TTFB (Servidor)</span>
                      <span className="font-bold text-cyan-400 font-mono text-sm">{auditData.coreWebVitals.ttfb}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 col-span-2 sm:col-span-2">
                      <span className="text-[10px] text-stone-400 block">Índice de Velocidad</span>
                      <span className="font-bold text-white font-mono text-sm">{auditData.coreWebVitals.speedIndex}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 p-5 space-y-4">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-cyan-950 pb-3">
                    <Cpu className="w-4 h-4 text-[#00E5FF]" />
                    Tecnologías & Infraestructura
                  </h3>
                  <div className="space-y-2">
                    {auditData.techStack.map((tech, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#050A14] border border-cyan-950 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span>{tech.icon || '⚡'}</span>
                          <span className="font-bold text-stone-200">{tech.name}</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/50">
                          {tech.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Improvement Recommendations */}
              <div className="rounded-3xl bg-[#080E1C] border border-cyan-900/40 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-2 uppercase tracking-wide">
                    <Wrench className="w-4 h-4 text-[#00E5FF]" />
                    Recomendaciones de Optimización de IA:
                  </h3>
                  <span className="text-[11px] text-stone-400 font-mono">{auditData.aiRecommendations.length} mejoras detectadas</span>
                </div>

                <div className="space-y-3">
                  {auditData.aiRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#050A14] border border-cyan-950 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            rec.priority === 'alta' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                            rec.priority === 'media' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}>
                            Prioridad {rec.priority}
                          </span>
                          <span className="text-xs font-bold text-white">{rec.title}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">{rec.category}</span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">{rec.description}</p>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-cyan-950 text-xs font-mono text-cyan-300 flex items-center justify-between">
                        <span className="truncate pr-2">{rec.suggestedFix}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(rec.suggestedFix);
                            alert('Solución copiada al portapapeles');
                          }}
                          className="text-[10px] text-stone-400 hover:text-white shrink-0 cursor-pointer"
                        >
                          Copiar Código
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. BÚSQUEDA WEB EN VIVO */}
      {activeSubTab === 'search' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 shadow-xl space-y-4">
            <form onSubmit={handleLiveSearch} className="space-y-3">
              <label className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#00E5FF]" />
                Búsqueda Web en Tiempo Real con Fuentes Verificadas:
              </label>

              <div className="flex flex-wrap items-center gap-2 pb-1">
                {['general', 'noticias', 'tecnologia', 'finanzas', 'ciencia'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSearchCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      searchCategory === cat
                        ? 'bg-cyan-950 text-[#00E5FF] border border-[#00E5FF]/60'
                        : 'bg-[#050A14] text-stone-400 hover:text-white border border-cyan-950'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escribe tu consulta (e.g. 'Últimos avances de computación cuántica y telescopios 2026')..."
                  className="flex-1 pl-4 pr-4 py-3 rounded-2xl bg-[#050A14] border border-cyan-900/60 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF] transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || isSearching}
                  className="py-3 px-6 rounded-2xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  {isSearching ? <RefreshCw className="w-4 h-4 animate-spin text-stone-950" /> : <Search className="w-4 h-4 text-stone-950" />}
                  <span>Buscar en la Web</span>
                </button>
              </div>
            </form>
          </div>

          {searchAnswer && (
            <div className="p-5 rounded-3xl bg-[#080E1C] border border-cyan-500/40 shadow-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                  <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                    Síntesis Web en Tiempo Real
                  </h3>
                </div>
                {onAskAI && (
                  <button
                    onClick={() => onAskAI(`Respecto a la búsqueda: "${searchQuery}"\n\nSíntesis: ${searchAnswer}\n\nPor favor continúa analizando este tema en detalle.`, 'asistente_web')}
                    className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Continuar en Chat</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed bg-[#050A14] p-4 rounded-2xl border border-cyan-950 whitespace-pre-line">
                {searchAnswer}
              </p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-400">
                Fuentes Web & Citaciones ({searchResults.length}):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#080E1C] border border-cyan-900/40 space-y-2 hover:border-[#00E5FF]/60 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#00E5FF] bg-cyan-950 px-2 py-0.5 rounded-md border border-cyan-900/50">
                        {item.domain}
                      </span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-tight hover:text-[#00E5FF] transition-colors">
                      <a href={item.url} target="_blank" rel="noreferrer">
                        {item.title}
                      </a>
                    </h4>
                    <p className="text-[11px] text-stone-300 line-clamp-3">
                      {item.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. DNS & SSL ANALYZER */}
      {activeSubTab === 'dns' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 shadow-xl space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Server className="w-4 h-4 text-[#00E5FF]" />
                Inspección DNS, Registros MX y Estado de Certificado SSL:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={dnsDomainInput}
                  onChange={(e) => setDnsDomainInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleDnsLookup();
                  }}
                  placeholder="ejemplo.com"
                  className="flex-1 pl-4 pr-4 py-3 rounded-2xl bg-[#050A14] border border-cyan-900/60 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF] font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleDnsLookup()}
                  disabled={!dnsDomainInput.trim() || isDnsLoading}
                  className="py-3 px-6 rounded-2xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  {isDnsLoading ? <RefreshCw className="w-4 h-4 animate-spin text-stone-950" /> : <Server className="w-4 h-4 text-stone-950" />}
                  <span>Consultar DNS</span>
                </button>
              </div>
            </div>
          </div>

          {dnsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in">
              <div className="p-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-cyan-950 pb-3">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Certificado SSL & Seguridad Web
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 flex justify-between">
                    <span className="text-stone-400">Estado SSL</span>
                    <span className="font-bold text-emerald-400">{dnsData.sslStatus}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 flex justify-between">
                    <span className="text-stone-400">Autoridad Emisora</span>
                    <span className="font-bold text-white font-mono">{dnsData.sslIssuer}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 flex justify-between">
                    <span className="text-stone-400">Válido Hasta</span>
                    <span className="font-bold text-cyan-300 font-mono">{dnsData.sslValidUntil}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 flex justify-between">
                    <span className="text-stone-400">Latencia Servidor</span>
                    <span className="font-bold text-emerald-400 font-mono">{dnsData.responseTimeMs} ms</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-cyan-950 pb-3">
                  <Server className="w-4 h-4 text-[#00E5FF]" />
                  Dirección IP & Registros DNS
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 flex justify-between">
                    <span className="text-stone-400">IPv4 Primaria</span>
                    <span className="font-bold text-cyan-400 font-mono">{dnsData.ip}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 flex justify-between">
                    <span className="text-stone-400">Nameservers</span>
                    <span className="font-bold text-white font-mono">{dnsData.nameservers.join(', ')}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 space-y-1">
                    <span className="text-stone-400 block">Registros MX (Servidor Correo)</span>
                    <div className="font-mono text-[11px] text-stone-300">
                      {dnsData.mxRecords.map((m, i) => <div key={i}>• {m}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. SANDBOX WEB & LIVE CODE VIEWER */}
      {activeSubTab === 'sandbox' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#080E1C] border border-cyan-900/40 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#00E5FF]" />
                Plantillas:
              </span>
              {CODE_SANDBOX_PRESETS.map(pre => (
                <button
                  key={pre.id}
                  onClick={() => {
                    setSandboxPreset(pre.id);
                    setSandboxCode(pre.html);
                    setConsoleLogs(prev => [...prev, `[Template Loaded] ${pre.name}`]);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sandboxPreset === pre.id
                      ? 'bg-[#00E5FF] text-stone-950'
                      : 'bg-[#050A14] text-stone-400 hover:text-white border border-cyan-950'
                  }`}
                >
                  {pre.name}
                </button>
              ))}
            </div>

            {/* Device Viewport Switcher */}
            <div className="flex items-center gap-1 bg-[#050A14] p-1 rounded-xl border border-cyan-950">
              <button
                onClick={() => setSandboxDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  sandboxDevice === 'desktop' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
                title="Escritorio Completo"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSandboxDevice('laptop')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  sandboxDevice === 'laptop' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
                title="Portátil"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSandboxDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  sandboxDevice === 'tablet' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
                title="Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSandboxDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  sandboxDevice === 'mobile' ? 'bg-[#00E5FF] text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
                title="Móvil"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Split Screen: Code Editor & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 overflow-hidden shadow-xl space-y-0">
              <div className="p-3 bg-[#0B132B] border-b border-cyan-950 flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
                  Editor de Código HTML / Tailwind CSS
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="text-[11px] text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCode ? 'Copiado' : 'Copiar'}
                  </button>
                  <button
                    onClick={handleDownloadHtml}
                    className="text-[11px] text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    .html
                  </button>
                </div>
              </div>
              <textarea
                value={sandboxCode}
                onChange={(e) => setSandboxCode(e.target.value)}
                rows={19}
                className="w-full bg-[#050A14] p-4 text-xs font-mono text-cyan-100 focus:outline-none resize-none leading-relaxed border-none"
              />

              {/* Console Logs Footer */}
              <div className="p-3 bg-[#03060C] border-t border-cyan-950 text-[10px] font-mono text-stone-400 space-y-1 max-h-24 overflow-y-auto">
                <span className="text-cyan-400 font-bold block">Consola de Eventos:</span>
                {consoleLogs.slice(-3).map((log, i) => (
                  <div key={i} className="truncate">{log}</div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl bg-[#080E1C] border border-cyan-900/40 overflow-hidden shadow-2xl">
              <div className="p-3 bg-[#0B132B] border-b border-cyan-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-bold text-white pl-2">
                    Renderizado Interactivo en Vivo
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">
                  {sandboxDevice === 'mobile' ? 'iPhone 16 Pro (393px)' : sandboxDevice === 'tablet' ? 'iPad Pro (768px)' : sandboxDevice === 'laptop' ? 'Laptop (1024px)' : '100% Responsivo'}
                </span>
              </div>

              <div className="p-4 bg-[#050A14] flex justify-center min-h-[500px] overflow-hidden">
                <div
                  className={`transition-all duration-300 rounded-2xl overflow-hidden border border-cyan-950 shadow-2xl bg-white ${
                    sandboxDevice === 'mobile'
                      ? 'w-[375px] h-[550px]'
                      : sandboxDevice === 'tablet'
                      ? 'w-[640px] h-[550px]'
                      : sandboxDevice === 'laptop'
                      ? 'w-[820px] h-[550px]'
                      : 'w-full h-[550px]'
                  }`}
                >
                  <iframe
                    srcDoc={sandboxCode}
                    title="Live Web Sandbox"
                    sandbox="allow-scripts allow-modals allow-forms"
                    className="w-full h-full border-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MERCADOS GLOBALES & CLIMA EN VIVO */}
      {activeSubTab === 'market' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 rounded-3xl bg-[#080E1C] border border-cyan-900/40 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#00E5FF]" />
                <h3 className="text-sm font-bold text-white">Mercados Financieros & Cripto en Vivo</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Actualización Continua
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {marketPrices.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#050A14] border border-cyan-950 flex items-center justify-between hover:border-cyan-800 transition-colors"
                >
                  <div>
                    <span className="text-[11px] font-bold text-white">{item.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono block">{item.symbol}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-stone-100 font-mono block">{item.price}</span>
                    <span className={`text-[10px] font-bold font-mono ${item.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-[#080E1C] border border-cyan-900/40 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Clima & Atmósfera Global</h3>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ciudad (e.g. Madrid, Buenos Aires, Tokio)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCheckWeather((e.target as HTMLInputElement).value);
                  }}
                  className="flex-1 p-2.5 rounded-xl bg-[#050A14] border border-cyan-900/50 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E5FF]"
                />
                <button
                  onClick={(e) => {
                    const inp = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    if (inp?.value) handleCheckWeather(inp.value);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#00E5FF] text-stone-950 font-bold text-xs cursor-pointer"
                >
                  Consultar
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B1A3A] to-[#08152E] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{weatherData.city}</h4>
                  <span className="text-xs text-cyan-300">{weatherData.condition}</span>
                </div>
                <span className="text-3xl font-black text-amber-300">{weatherData.temp}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-stone-300 border-t border-cyan-950">
                <div>
                  <span className="text-stone-400 block">Humedad</span>
                  <span className="font-bold text-white">{weatherData.humidity}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Viento</span>
                  <span className="font-bold text-white">{weatherData.wind}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Índice UV</span>
                  <span className="font-bold text-white">{weatherData.uv}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
