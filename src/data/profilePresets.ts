export interface AvatarPreset {
  id: string;
  name: string;
  category: 'professional' | 'tech' | '3d' | 'cyberpunk' | 'creative' | 'minimal';
  url: string;
}

export const PRESET_AVATARS: AvatarPreset[] = [
  // Profesionales / Ejecutivos
  {
    id: 'pro-1',
    name: 'Ejecutivo Tech',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'pro-2',
    name: 'Ingeniero de Software',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'pro-3',
    name: 'Líder de Producto',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'pro-4',
    name: 'Arquitecto Cloud',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'pro-5',
    name: 'Científica de Datos',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'pro-6',
    name: 'Consultor Senior',
    category: 'professional',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&h=240&q=85'
  },

  // Tech & Desarrolladores
  {
    id: 'tech-1',
    name: 'Developer Hacker',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'tech-2',
    name: 'Ciberseguridad Pro',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'tech-3',
    name: 'AI Researcher',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'tech-4',
    name: 'DevOps & SRE',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=240&h=240&q=85'
  },

  // 3D & Futurista
  {
    id: '3d-1',
    name: 'Avatar 3D Neon Cyan',
    category: '3d',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: '3d-2',
    name: 'Holograma Quantum',
    category: '3d',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: '3d-3',
    name: 'Esfera Geométrica AI',
    category: '3d',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: '3d-4',
    name: 'Sintetizador Cósmico',
    category: '3d',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=240&h=240&q=85'
  },

  // Cyberpunk & Creativo
  {
    id: 'cyber-1',
    name: 'Cyberpunk Neon',
    category: 'cyberpunk',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'cyber-2',
    name: 'Gamer & Streamer',
    category: 'cyberpunk',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'creative-1',
    name: 'Diseñador UI/UX',
    category: 'creative',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=240&h=240&q=85'
  },
  {
    id: 'creative-2',
    name: 'Director de Arte',
    category: 'creative',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=240&h=240&q=85'
  }
];

export const POPULAR_SKILL_SUGGESTIONS: { category: string; skills: string[] }[] = [
  {
    category: 'Desarrollo & Software',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Next.js', 'Tailwind CSS', 'Docker', 'GraphQL', 'Kotlin', 'Rust', 'C#', 'SQL', 'PostgreSQL', 'MongoDB']
  },
  {
    category: 'Inteligencia Artificial & Datos',
    skills: ['Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'LLMs & Prompt Engineering', 'LangChain', 'Pandas & NumPy', 'Computer Vision', 'NLP', 'Data Analytics']
  },
  {
    category: 'Cloud, DevOps & Infra',
    skills: ['AWS', 'Google Cloud (GCP)', 'Kubernetes', 'CI/CD Pipelines', 'Terraform', 'Linux', 'Microservicios', 'Arquitectura Serverless']
  },
  {
    category: 'Diseño & Creatividad',
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'Motion Graphics', 'Blender 3D', 'Adobe Creative Cloud', 'Prototipado Rápido']
  },
  {
    category: 'Gestión, Legal & Negocios',
    skills: ['Scrum & Agile', 'Product Management', 'Derecho Corporativo & GDPR', 'Marketing Digital', 'Finanzas Cuantitativas', 'SEO Técnico', 'Liderazgo de Equipos']
  }
];

export const PROFESSIONAL_TEMPLATES = [
  {
    id: 'template-fullstack',
    name: 'Ingeniero Full-Stack & AI Developer',
    headline: 'Senior Full-Stack Engineer & AI Solutions Architect',
    organization: 'Tech Innovations Labs',
    category: 'development' as const,
    bio: 'Desarrollador enfocado en arquitecturas web reactivas de alta concurrencia, integración de modelos de lenguaje (LLMs) y despliegues escalables en la nube.',
    experienceLevel: 'senior' as const,
    experienceYears: '5-8 años',
    availabilityStatus: 'available' as const,
    location: 'Madrid, España / Remoto',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'GraphQL', 'Tailwind CSS', 'AWS', 'LLMs & Prompt Engineering'],
    socialLinks: {
      github: 'https://github.com/developer',
      linkedin: 'https://linkedin.com/in/developer',
      portfolio: 'https://developer.dev'
    }
  },
  {
    id: 'template-ai-scientist',
    name: 'Científico de Datos & Machine Learning',
    headline: 'Lead AI & Machine Learning Research Scientist',
    organization: 'DeepTech AI Institute',
    category: 'research' as const,
    bio: 'Especialista en entrenamiento de modelos fundacionales, visión artificial, procesamiento de lenguaje natural (NLP) y optimización de inferencia.',
    experienceLevel: 'lead' as const,
    experienceYears: '8+ años',
    availabilityStatus: 'consultant' as const,
    location: 'San Francisco, CA / Remoto',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Deep Learning', 'NLP', 'Computer Vision', 'LangChain', 'Data Analytics', 'PostgreSQL'],
    socialLinks: {
      github: 'https://github.com/ai-scientist',
      linkedin: 'https://linkedin.com/in/ai-scientist'
    }
  },
  {
    id: 'template-designer',
    name: 'Diseñador de Producto & UX/UI',
    headline: 'Senior Product Designer & Design Systems Lead',
    organization: 'Design Studio Global',
    category: 'design' as const,
    bio: 'Diseñador enfocado en crear interfaces intuitivas, sistemas de diseño accesibles, animaciones fluidas y experiencias centradas en el usuario.',
    experienceLevel: 'senior' as const,
    experienceYears: '4-6 años',
    availabilityStatus: 'open_to_collaborations' as const,
    location: 'Barcelona, España / Remoto',
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'Prototipado Rápido', 'Tailwind CSS', 'Motion Graphics', 'User Research'],
    socialLinks: {
      portfolio: 'https://designer-portfolio.io',
      linkedin: 'https://linkedin.com/in/designer'
    }
  },
  {
    id: 'template-legal',
    name: 'Abogado Corporativo & Cumplimiento',
    headline: 'Asesor Legal Corporativo & Especialista en Privacidad y GDPR',
    organization: 'Lex & Partners Consultores',
    category: 'law' as const,
    bio: 'Especialista en derecho digital, contratos mercantiles, protección de datos (GDPR/HIPAA), propiedad intelectual y gobernanza de IA.',
    experienceLevel: 'senior' as const,
    experienceYears: '7+ años',
    availabilityStatus: 'employed' as const,
    location: 'Ciudad de México / Remoto',
    skills: ['Derecho Corporativo & GDPR', 'Contratos', 'Auditoría Legal', 'Propiedad Intelectual', 'Gobernanza IA'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/abogado-legal'
    }
  }
];
