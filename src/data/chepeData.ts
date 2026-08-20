import { AIModelOption, CategoryOption, PlanTier, UserProfile, AdminUserItem } from '../types';
import { AI_MODEL_OPTIONS } from './modelsData';

export { AI_MODEL_OPTIONS };

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'general',
    name: 'General',
    icon: '⚡',
    description: 'Respuestas generales, consultas variadas y ayuda cotidiana.',
    popular: true
  },
  {
    id: 'programacion',
    name: 'Programación',
    icon: '💻',
    description: 'HTML, CSS, JS, Python, Kotlin, Java, C#, Lua, SQL, Roblox Studio.',
    popular: true
  },
  {
    id: 'tareas',
    name: 'Tareas',
    icon: '📚',
    description: 'Guías de estudio, resúmenes académicos y explicaciones didácticas.',
    popular: true
  },
  {
    id: 'matematicas',
    name: 'Matemáticas',
    icon: '🧮',
    description: 'Resolución de ecuaciones, álgebra, cálculo y física paso a paso.',
    popular: true
  },
  {
    id: 'ciencia',
    name: 'Ciencia',
    icon: '🔬',
    description: 'Biología, química, astronomía y tecnología explicada claramente.'
  },
  {
    id: 'historia',
    name: 'Historia',
    icon: '🏛️',
    description: 'Líneas de tiempo, cultura general, biografía y sucesos mundiales.'
  },
  {
    id: 'escritura',
    name: 'Escritura',
    icon: '✍️',
    description: 'Redacción de textos, correos, ensayos, copys e historias creativas.',
    popular: true
  },
  {
    id: 'traduccion',
    name: 'Traducción',
    icon: '🌐',
    description: 'Traductor políglota preciso con explicaciones de contexto.'
  },
  {
    id: 'ideas',
    name: 'Ideas',
    icon: '💡',
    description: 'Lluvia de ideas, nombres para proyectos, startups e inventos.'
  },
  {
    id: 'asistente_web',
    name: 'Asistente Web',
    icon: '🌐',
    description: 'Navegación conceptual, síntesis de sitios y extracción de datos.'
  }
];

export const PROGRAMMING_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript / Node', icon: '🟨', extension: '.js' },
  { id: 'typescript', name: 'TypeScript / React', icon: '🟦', extension: '.ts' },
  { id: 'python', name: 'Python 3', icon: '🐍', extension: '.py' },
  { id: 'html', name: 'HTML5 & CSS3', icon: '🎨', extension: '.html' },
  { id: 'java', name: 'Java', icon: '☕', extension: '.java' },
  { id: 'kotlin', name: 'Kotlin (Android)', icon: '📱', extension: '.kt' },
  { id: 'csharp', name: 'C# (.NET)', icon: '💜', extension: '.cs' },
  { id: 'lua', name: 'Lua / Roblox Studio', icon: '🌙', extension: '.lua' },
  { id: 'sql', name: 'SQL Database Query', icon: '🗄️', extension: '.sql' },
  { id: 'apis', name: 'REST APIs & GraphQL', icon: '🔌', extension: '.json' }
];

export const PLAN_TIERS: PlanTier[] = [
  {
    id: 'gratis',
    name: 'Plan Gratuito / Invitado',
    planType: 'Gratis',
    price: '$0',
    period: 'para siempre',
    badge: 'BÁSICO',
    description: 'Ideal para probar las capacidades básicas de inteligencia artificial en modo invitado.',
    maxDailyMessages: 20,
    features: [
      '20 mensajes diarios para invitados',
      'Acceso al modelo Chepe 3.8 Ultra',
      'Asistencia general y búsqueda',
      'Historial temporal de conversación',
      'Generación de código básico'
    ],
    limitations: [
      'Límite de 20 mensajes al día (1,000 al crear cuenta)',
      'Sin análisis de archivos pesados',
      'Sin soporte para Gemini 4.0 Ultra'
    ]
  },
  {
    id: 'estudiante',
    name: 'Plan Estudiante / Académico',
    planType: 'Estudiante',
    price: '$4.99',
    period: '/ mes',
    badge: 'EDUCATIVO',
    description: 'Diseñado especialmente para estudiantes e investigadores con tarifa accesible.',
    maxDailyMessages: 500,
    features: [
      '500 mensajes diarios',
      'Acceso a solucionadores matemáticos y de ciencias',
      'Análisis de papers y PDFs de estudio',
      'Generador de resúmenes y flashcards',
      'Exportación en LaTeX y Markdown'
    ]
  },
  {
    id: 'pro',
    name: 'Plan Pro Mensual',
    planType: 'Pro',
    price: '$9.99',
    period: '/ mes',
    badge: 'MÁS POPULAR',
    popular: true,
    description: 'Perfecto para estudiantes, desarrolladores y profesionales activos.',
    maxDailyMessages: 1000,
    features: [
      '1,000 mensajes diarios',
      'Acceso a Chepe 3.8 Ultra y Gemini 3.5 Flash',
      'Soporte completo de lectura de archivos e imágenes',
      'Ejecución de código en Sandbox',
      'Historial e hilos ilimitados',
      'Lectura de voz (Text-To-Speech) ilimitada',
      'Exportación en PDF / Markdown'
    ]
  },
  {
    id: 'pro_anual',
    name: 'Plan Pro Anual',
    planType: 'Pro Anual',
    price: '$79.99',
    period: '/ año (Ahorra 35%)',
    badge: 'MEJOR VALOR',
    description: 'Suscripción anual Pro con mensajes ampliados y prioridad en servidores.',
    maxDailyMessages: 2500,
    features: [
      '2,500 mensajes diarios',
      'Ahorro del 35% frente al pago mensual',
      'Generación de imágenes ultrarrápida',
      'Acceso prioritario en horas punta',
      'Soporte técnico preferente'
    ]
  },
  {
    id: 'premium',
    name: 'Plan Premium Mensual',
    planType: 'Premium',
    price: '$19.99',
    period: '/ mes',
    badge: 'MÁXIMA POTENCIA',
    description: 'Para equipos de desarrollo, creadores y empresas que exigen máxima precisión.',
    maxDailyMessages: 10000,
    features: [
      '10,000 mensajes diarios',
      'Acceso a Gemini 4.0 Ultra y Claude Proxy Engine',
      'Análisis avanzado de archivos y documentos extensos',
      'Soporte prioritario 24/7',
      'Panel de control de API personalizada',
      'Respuestas ultrarrápidas sin cola de espera'
    ]
  },
  {
    id: 'premium_anual',
    name: 'Plan Premium Anual',
    planType: 'Premium Anual',
    price: '$199.99',
    period: '/ año (Ahorra $40)',
    badge: 'POTENCIA TOTAL',
    description: 'Plan Premium completo durante 12 meses con capacidad masiva de tokens.',
    maxDailyMessages: 25000,
    features: [
      '25,000 mensajes diarios',
      'Acceso full a Claude 3.7 Sonnet y GPT-4.5',
      'Análisis de videos y audios largos',
      'Sandbox sin límite de memoria',
      'Soporte VIP telefónico y por chat'
    ]
  },
  {
    id: 'enterprise',
    name: 'Plan Enterprise / Vitalicio',
    planType: 'Enterprise',
    price: '$99.99',
    period: 'pago único vitalicio',
    badge: 'ACCESO TOTAL',
    description: 'Solución definitiva sin límites para organizaciones, agencias y desarrolladores avanzados.',
    maxDailyMessages: 999999,
    features: [
      'Mensajes y tokens 100% ilimitados',
      'Acceso total a todos los 140+ modelos de IA',
      'Generación de videos Sora y Veo 2 en 4K',
      'Llamadas a API personalizadas y Webhooks',
      'Licencia vitalicia sin fecha de expiración',
      'Soporte técnico VIP dedicado'
    ]
  },
  {
    id: 'dev_vip',
    name: 'Plan Desarrollador / API VIP',
    planType: 'Developer VIP',
    price: '$149.99',
    period: 'pago único / semestral',
    badge: 'EXCLUSIVO DEV',
    description: 'Para desarrolladores de software, integraciones backend y llamadas masivas.',
    maxDailyMessages: 999999,
    features: [
      'Acceso a endpoints REST y WebSockets directos',
      'Generación de tokens API ilimitados',
      'Uso de agentes autónomos y Deep Research',
      'Consola de depuración y telemetría avanzada',
      'SLA del 99.9% de disponibilidad'
    ]
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-guest-default',
  name: 'Invitado Chepe',
  email: 'invitado@chepeia.local',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ChepeGuest',
  planType: 'Gratis',
  memberSince: 'Hoy (Modo Invitado)',
  dailyUsageCount: 0,
  dailyLimit: 20,
  status: 'active',
  role: 'user',
  isGuest: true
};

export const MOCK_ADMIN_USERS: AdminUserItem[] = [
  {
    id: 'usr-admin-real',
    name: 'Jose Arenales (Tú)',
    email: 'arenalesjose802@gmail.com',
    plan: 'Enterprise',
    planExpiresAt: 'Vitalicio (Sin Expiración)',
    usage: 412,
    status: 'activo',
    registeredDate: '01/01/2026',
    lastActive: 'En línea ahora'
  },
  {
    id: 'usr-1',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez.dev@gmail.com',
    plan: 'Pro',
    planExpiresAt: '31/12/2026 23:59',
    usage: 342,
    status: 'activo',
    registeredDate: '10/01/2026',
    lastActive: 'Hace 5 minutos'
  },
  {
    id: 'usr-2',
    name: 'María Fernández',
    email: 'maria.fernandez.est@outlook.com',
    plan: 'Estudiante',
    planExpiresAt: '15/06/2026 23:59',
    usage: 88,
    status: 'activo',
    registeredDate: '15/01/2026',
    lastActive: 'Hace 45 minutos'
  },
  {
    id: 'usr-3',
    name: 'Alejandro Gómez',
    email: 'agomez.software@yahoo.es',
    plan: 'Premium',
    planExpiresAt: '31/12/2026 23:59',
    usage: 1280,
    status: 'activo',
    registeredDate: '02/02/2026',
    lastActive: 'Hace 12 minutos'
  },
  {
    id: 'usr-4',
    name: 'Sofía Morales',
    email: 'sofia.morales.arq@gmail.com',
    plan: 'Pro Anual',
    planExpiresAt: '15/02/2027 23:59',
    usage: 620,
    status: 'activo',
    registeredDate: '12/02/2026',
    lastActive: 'Hace 2 horas'
  },
  {
    id: 'usr-5',
    name: 'Dr. Fernando Castillo',
    email: 'fcastillo.med@hotmail.com',
    plan: 'Premium Anual',
    planExpiresAt: '20/02/2027 23:59',
    usage: 2150,
    status: 'activo',
    registeredDate: '18/02/2026',
    lastActive: 'Hace 3 horas'
  },
  {
    id: 'usr-6',
    name: 'Lucía Benítez',
    email: 'lucia.benitez.design@icloud.com',
    plan: 'Developer VIP',
    planExpiresAt: 'Vitalicio (Sin Expiración)',
    usage: 940,
    status: 'activo',
    registeredDate: '20/02/2026',
    lastActive: 'Hace 15 minutos'
  }
];

export const QUICK_WELCOME_CARDS = [
  {
    icon: '🎬',
    title: 'Estudio de Video Sora IA',
    desc: 'Genera clips cinemáticos 8K, animaciones 60FPS con storyboard de director.',
    prompt: '/video Crea un video cinemático 8K de un astronauta explorando una cueva de cristales bioluminiscentes en Marte, iluminación volumétrica y lentes anamórficos'
  },
  {
    icon: '🌐',
    title: 'Navegación & Búsqueda Web',
    desc: 'Búsqueda en tiempo real con citas de fuentes verificadas y análisis web.',
    prompt: 'Busca las últimas noticias y descubrimientos en computación cuántica y telescopios espaciales de este año'
  },
  {
    icon: '📉',
    title: 'Gráfica Métodos de Depreciación',
    desc: 'Comparativa interactiva de Línea Recta, Doble Saldo Decreciente y Suma de Dígitos.',
    prompt: 'Genera la gráfica y tabla comparativa de los métodos de depreciación (Línea Recta, Doble Saldo Decreciente y Suma de Dígitos de los Años) para un activo con costo inicial de $100,000 USD, salvamento de $10,000 y vida útil de 5 años.'
  },
  {
    icon: '✨',
    title: 'Pregúntame cualquier cosa',
    desc: 'Consultas generales, datos, explicaciones y respuestas rápidas.',
    prompt: 'Explícame cómo funciona la fotosíntesis con un ejemplo sencillo'
  },
  {
    icon: '💻',
    title: 'Ayuda con programación',
    desc: 'HTML, CSS, JavaScript, Python, Kotlin, Roblox, SQL y depuración.',
    prompt: 'Crea una función en JavaScript para ordenar un arreglo de objetos por fecha'
  },
  {
    icon: '📚',
    title: 'Ayuda con tareas',
    desc: 'Resúmenes escolares, explicaciones didácticas y guías de estudio.',
    prompt: 'Hazme un resumen educativo de los 5 eventos clave de la Segunda Guerra Mundial'
  }
];

export const SLASH_COMMANDS = [
  {
    cmd: '/video',
    label: 'Generar Video Sora & Veo',
    desc: 'Crea un video cinemático con guión visual y storyboard',
    icon: '🎬',
    prompt: '/video '
  },
  {
    cmd: '/web',
    label: 'Búsqueda Web en Vivo',
    desc: 'Busca en internet en tiempo real y extrae fuentes verídicas',
    icon: '🌐',
    prompt: 'Busca en la web en tiempo real la siguiente información: '
  },
  {
    cmd: '/code',
    label: 'Escribir Código Clean',
    desc: 'Genera funciones, componentes React, scripts de Node.js o algoritmos',
    icon: '💻',
    prompt: 'Escribe el siguiente código optimizado, tipado en TypeScript y bien comentado: '
  },
  {
    cmd: '/math',
    label: 'Resolver Matemáticas',
    desc: 'Explicación y solución paso a paso con fórmulas detalladas',
    icon: '🧮',
    prompt: 'Resuelve el siguiente problema matemático paso a paso mostrando fórmulas y procedimiento: '
  },
  {
    cmd: '/depreciacion',
    label: 'Métodos de Depreciación',
    desc: 'Genera gráfica interactiva y tabla de Línea Recta, DDB y SYD',
    icon: '📉',
    prompt: 'Genera la gráfica y tabla comparativa de los métodos de depreciación (Línea Recta, Doble Saldo Decreciente y Suma de Dígitos de los Años) para un activo con costo inicial de $100,000 USD, salvamento de $10,000 y vida útil de 5 años.'
  },
  {
    cmd: '/resumen',
    label: 'Resumen Ejecutivo',
    desc: 'Sintetiza textos largos en puntos clave y decisiones estratégicas',
    icon: '📝',
    prompt: 'Resume el siguiente texto en viñetas clave y conclusiones ejecutivas: '
  },
  {
    cmd: '/tabla',
    label: 'Tabla Comparativa',
    desc: 'Organiza datos en una tabla comparativa Markdown limpia',
    icon: '📊',
    prompt: 'Crea una tabla comparativa en Markdown detallando pros, contras y características de: '
  },
  {
    cmd: '/traducir',
    label: 'Traducción Profesional',
    desc: 'Traduce manteniendo modismos y vocabulario técnico preciso',
    icon: '🌐',
    prompt: 'Traduce el siguiente texto al inglés con un tono técnico, profesional e impecable: '
  },
  {
    cmd: '/brainstorm',
    label: 'Lluvia de Ideas',
    desc: '5 conceptos innovadores con plan de acción estructurado',
    icon: '💡',
    prompt: 'Genera 5 ideas innovadoras y viables sobre el siguiente tema: '
  },
  {
    cmd: '/feynman',
    label: 'Explicación Sencilla (Feynman)',
    desc: 'Explica conceptos complejos usando analogías cotidianas',
    icon: '🧠',
    prompt: 'Explica el siguiente concepto de forma extremadamente sencilla, como a un estudiante de 10 años, usando analogías cotidianas: '
  }
];

export const OFFICIAL_CUSTOM_GPTS = [
  {
    id: 'gpt-code-master',
    name: 'Chepe Code Master',
    description: 'Arquitecto de software senior para desarrollo Full-Stack, refactorización y solución de bugs.',
    systemPrompt: 'Eres Chepe Code Master, un ingeniero de software principal. Proporciona soluciones de código impecables en TypeScript, Python, React y Tailwind CSS, con explicaciones limpias y mejores prácticas de arquitectura.',
    avatarEmoji: '⚡',
    category: 'programacion',
    author: 'Chepe IA Team',
    isOfficial: true,
    capabilities: { webSearch: true, canvasCode: true, dataInterpreter: true },
    starterPrompts: [
      'Refactoriza este código React a hooks modernos con TypeScript',
      'Diseña una arquitectura de API REST para una app en Node.js',
      'Escribe un script en Python para procesar archivos JSON masivos'
    ]
  },
  {
    id: 'gpt-image-dalle',
    name: 'DALL-E 3 Image Artist',
    description: 'Generador de imágenes artísticas, fotos fotorrealistas e ilustraciones en alta definición.',
    systemPrompt: 'Eres DALL-E 3 Image Artist. Diseña imágenes visualmente espectaculares con descripciones detalladas de composición, iluminación, estilo artístico y paleta de colores.',
    avatarEmoji: '🎨',
    category: 'ideas',
    author: 'Chepe IA Team',
    isOfficial: true,
    capabilities: { imageGeneration: true },
    starterPrompts: [
      'Genera una imagen fotorrealista de una ciudad futurista al atardecer',
      'Crea una ilustración 3D de un pequeño robot astronauta explorando Marte',
      'Diseña un logo minimalista para una startup de Inteligencia Artificial'
    ]
  },
  {
    id: 'gpt-data-analyst',
    name: 'Data Analyst Pro',
    description: 'Analista de datos cuantitativos. Transforma datos numéricos, CSV y JSON en gráficos e insights.',
    systemPrompt: 'Eres Data Analyst Pro. Analiza métricas, estadisticas y datos estructurados. Presenta resúmenes ejecutivos con gráficos y tablas interactivas.',
    avatarEmoji: '📊',
    category: 'general',
    author: 'Chepe IA Team',
    isOfficial: true,
    capabilities: { dataInterpreter: true, canvasCode: true },
    starterPrompts: [
      'Analiza las ventas mensuales de esta tabla y genera un gráfico comparativo',
      'Procesa este objeto JSON con métricas de usuarios y calcula promedios',
      'Crea un dashboard financiero interactivo con proyecciones anuales'
    ]
  },
  {
    id: 'gpt-math-o1',
    name: 'Matemático Ninja O1',
    description: 'Tutor de matemáticas avanzadas, cálculo diferencial, álgebra lineal y física teórica.',
    systemPrompt: 'Eres Matemático Ninja O1. Utiliza razonamiento riguroso paso a paso para resolver problemas matemáticos complejos, mostrando fórmulas claras y demostraciones lógicas.',
    avatarEmoji: '🧮',
    category: 'matematicas',
    author: 'Chepe IA Team',
    isOfficial: true,
    capabilities: { canvasCode: true },
    starterPrompts: [
      'Demuestra y resuelve la integral definida ∫ x² sin(x) dx paso a paso',
      'Explica el Teorema de Bayes con un ejemplo práctico de medicina',
      'Resuelve este sistema de ecuaciones matriciales 3x3'
    ]
  },
  {
    id: 'gpt-writer-seo',
    name: 'Redactor Académico & SEO',
    description: 'Especialista en ensayos universitarios, artículos de blog optimizados y redacción profesional.',
    systemPrompt: 'Eres un Redactor Académico y Consultor SEO de élite. Redacta contenido persuasivo, sin plagio, con estructura lógica, tono adaptable y formato rico.',
    avatarEmoji: '✍️',
    category: 'escritura',
    author: 'Chepe IA Team',
    isOfficial: true,
    capabilities: { webSearch: true },
    starterPrompts: [
      'Escribe un ensayo académico sobre el impacto de la Inteligencia Artificial en el empleo',
      'Redacta un correo corporativo de propuesta comercial para un nuevo cliente',
      'Escribe un artículo SEO de 1000 palabras sobre ciberseguridad en 2026'
    ]
  },
  {
    id: 'gpt-polyglot-coach',
    name: 'Polyglot Coach (Tutor de Idiomas)',
    description: 'Tutor conversacional en tiempo real para aprender y perfeccionar Inglés, Francés, Alemán y más.',
    systemPrompt: 'Eres Polyglot Coach. Ayuda a usuarios a practicar conversación en idiomas extranjeros, corrige errores gramaticales de forma constructiva y ofrece explicaciones de vocabulario.',
    avatarEmoji: '🗣️',
    category: 'traduccion',
    author: 'Chepe IA Team',
    isOfficial: true,
    capabilities: { webSearch: true },
    starterPrompts: [
      'Practiquemos una entrevista de trabajo en inglés para un puesto senior',
      'Explícame las diferencias entre el Passé Composé y el Imparfait en francés',
      'Corrige mi pronunciación y frases en este texto en alemán'
    ]
  }
];
