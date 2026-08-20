import React, { useState, useRef } from 'react';
import { UserProfile, LicenseCode, SupportedPlan, UserProfessionalProfile, CertificationItem } from '../types';
import { PRESET_AVATARS, POPULAR_SKILL_SUGGESTIONS, PROFESSIONAL_TEMPLATES, AvatarPreset } from '../data/profilePresets';
import {
  User, Shield, Zap, Sparkles, Key, CheckCircle, Clock, Activity, Award,
  KeyRound, AlertCircle, Camera, Upload, Link as LinkIcon, RefreshCw,
  Briefcase, MapPin, Globe, Github, Linkedin, Twitter, Edit3, Plus, Trash2,
  Check, ExternalLink, Share2, Copy, FileText, CheckCircle2, ChevronRight,
  Sliders, Star, Code2, GraduationCap, Building2, UserCheck, Eye, Save,
  Layers, BadgeCheck, Wand2, Image as ImageIcon
} from 'lucide-react';

interface ProfileModuleProps {
  user: UserProfile;
  onUpdateUserPlan: (newPlan: SupportedPlan, expiresAt: string) => void;
  onUpdateUserProfile: (updatedUser: UserProfile) => void;
  onOpenSettings: () => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({
  user,
  onUpdateUserPlan,
  onUpdateUserProfile,
  onOpenSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'card' | 'photo' | 'builder' | 'licenses'>('card');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // --- PHOTO STATE ---
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoFilterCategory, setPhotoFilterCategory] = useState<string>('all');
  const [dicebearSeed, setDicebearSeed] = useState(user.name.replace(/\s+/g, '') || 'ChepeUser');
  const [dicebearStyle, setDicebearStyle] = useState<'bottts' | 'adventurer' | 'lorelei' | 'micah' | 'personas'>('bottts');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- PROFESSIONAL BUILDER STATE ---
  const existingPro = user.professionalProfile;
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [headline, setHeadline] = useState(existingPro?.headline || '');
  const [organization, setOrganization] = useState(existingPro?.organization || '');
  const [category, setCategory] = useState<UserProfessionalProfile['category']>(existingPro?.category || 'development');
  const [experienceLevel, setExperienceLevel] = useState<UserProfessionalProfile['experienceLevel']>(existingPro?.experienceLevel || 'senior');
  const [experienceYears, setExperienceYears] = useState(existingPro?.experienceYears || '3-5 años');
  const [availabilityStatus, setAvailabilityStatus] = useState<UserProfessionalProfile['availabilityStatus']>(existingPro?.availabilityStatus || 'available');
  const [location, setLocation] = useState(existingPro?.location || 'Remoto / Global');
  const [bio, setBio] = useState(existingPro?.bio || '');
  const [skills, setSkills] = useState<string[]>(existingPro?.skills || ['React', 'TypeScript', 'Node.js', 'Python', 'LLMs & Prompt Engineering']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [linkedin, setLinkedin] = useState(existingPro?.socialLinks?.linkedin || '');
  const [github, setGithub] = useState(existingPro?.socialLinks?.github || '');
  const [portfolio, setPortfolio] = useState(existingPro?.socialLinks?.portfolio || '');
  const [twitter, setTwitter] = useState(existingPro?.socialLinks?.twitter || '');
  const [customAiPersona, setCustomAiPersona] = useState(existingPro?.customAiPersona ?? true);

  // Certifications
  const [certifications, setCertifications] = useState<CertificationItem[]>(
    existingPro?.certifications || [
      { id: 'c-1', title: 'Certified AI Solutions Architect', issuer: 'Google Cloud & DeepMind', year: '2026' },
      { id: 'c-2', title: 'Full Stack Web Engineering', issuer: 'Meta Professional Academy', year: '2025' }
    ]
  );
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('2026');
  const [isAddingCert, setIsAddingCert] = useState(false);

  // --- REDEEM STATE ---
  const [redeemInput, setRedeemInput] = useState('');
  const [redeemStatus, setRedeemStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedProfileToast, setCopiedProfileToast] = useState(false);

  const usagePercentage = Math.min(100, Math.round((user.dailyUsageCount / user.dailyLimit) * 100));

  // --- HANDLERS FOR PHOTO ---
  const handleSelectPresetAvatar = (preset: AvatarPreset) => {
    const updated: UserProfile = {
      ...user,
      avatarUrl: preset.url,
      avatarType: 'preset',
      photoUploadedAt: new Date().toISOString()
    };
    onUpdateUserProfile(updated);
    showSaveNotification('¡Foto de perfil actualizada con éxito!');
  };

  const handleApplyUrlPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrlInput.trim()) return;
    const cleanUrl = photoUrlInput.trim();
    const updated: UserProfile = {
      ...user,
      avatarUrl: cleanUrl,
      avatarType: 'url',
      photoUploadedAt: new Date().toISOString()
    };
    onUpdateUserProfile(updated);
    setPhotoUrlInput('');
    showSaveNotification('¡Foto de perfil actualizada desde URL!');
  };

  const handleApplyDicebear = () => {
    const url = `https://api.dicebear.com/7.x/${dicebearStyle}/svg?seed=${encodeURIComponent(dicebearSeed.trim() || 'Chepe')}`;
    const updated: UserProfile = {
      ...user,
      avatarUrl: url,
      avatarType: 'dicebear',
      photoUploadedAt: new Date().toISOString()
    };
    onUpdateUserProfile(updated);
    showSaveNotification('¡Avatar generado aplicado al perfil!');
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, GIF, SVG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        const updated: UserProfile = {
          ...user,
          avatarUrl: e.target.result,
          avatarType: 'upload',
          photoUploadedAt: new Date().toISOString()
        };
        onUpdateUserProfile(updated);
        showSaveNotification('¡Foto de perfil subida y guardada exitosamente!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleResetAvatar = () => {
    const updated: UserProfile = {
      ...user,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || 'ChepeGuest')}`,
      avatarType: 'dicebear',
      photoUploadedAt: undefined
    };
    onUpdateUserProfile(updated);
    showSaveNotification('Avatar restablecido al valor inicial.');
  };

  // --- HANDLERS FOR PROFESSIONAL BUILDER ---
  const handleAddSkill = (skillToAdd: string) => {
    const clean = skillToAdd.trim();
    if (!clean) return;
    if (!skills.includes(clean)) {
      setSkills(prev => [...prev, clean]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertIssuer.trim()) return;
    const newCert: CertificationItem = {
      id: 'cert-' + Date.now(),
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim(),
      year: newCertYear.trim() || '2026'
    };
    setCertifications(prev => [...prev, newCert]);
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertYear('2026');
    setIsAddingCert(false);
  };

  const handleRemoveCertification = (certId: string) => {
    setCertifications(prev => prev.filter(c => c.id !== certId));
  };

  const handleLoadTemplate = (templateId: string) => {
    const tmpl = PROFESSIONAL_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;
    setHeadline(tmpl.headline);
    setOrganization(tmpl.organization);
    setCategory(tmpl.category);
    setBio(tmpl.bio);
    setExperienceLevel(tmpl.experienceLevel);
    setExperienceYears(tmpl.experienceYears);
    setAvailabilityStatus(tmpl.availabilityStatus);
    setLocation(tmpl.location);
    setSkills(tmpl.skills);
    setLinkedin(tmpl.socialLinks.linkedin || '');
    setGithub(tmpl.socialLinks.github || '');
    setPortfolio(tmpl.socialLinks.portfolio || '');
    showSaveNotification(`Plantilla "${tmpl.name}" cargada. Puedes personalizarla y pulsar Guardar.`);
  };

  const handleSaveProfessionalProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const professionalProfile: UserProfessionalProfile = {
      isCreated: true,
      headline: headline.trim() || 'Profesional de Inteligencia Artificial',
      organization: organization.trim() || 'Independiente',
      category,
      bio: bio.trim() || 'Especialista enfocado en soluciones de alto impacto y tecnología.',
      experienceLevel,
      experienceYears,
      availabilityStatus,
      location: location.trim() || 'Remoto',
      skills,
      socialLinks: {
        linkedin: linkedin.trim() || undefined,
        github: github.trim() || undefined,
        portfolio: portfolio.trim() || undefined,
        twitter: twitter.trim() || undefined
      },
      certifications,
      customAiPersona,
      verifiedBadge: true,
      lastUpdated: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updatedUser: UserProfile = {
      ...user,
      name: fullName.trim() || user.name,
      email: email.trim() || user.email,
      phone: phone.trim() || undefined,
      professionalProfile
    };

    onUpdateUserProfile(updatedUser);
    showSaveNotification('¡Perfil Profesional guardado y activado correctamente!');
    setActiveSubTab('card');
  };

  const showSaveNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleCopyProfileSummary = () => {
    const summary = `Perfil Profesional: ${user.name}
Título: ${existingPro?.headline || 'Especialista en IA'}
Empresa/Org: ${existingPro?.organization || 'Independiente'}
Habilidades: ${existingPro?.skills?.join(', ') || 'N/A'}
Ubicación: ${existingPro?.location || 'Remoto'}
Plan: ${user.planType}`;

    navigator.clipboard.writeText(summary);
    setCopiedProfileToast(true);
    setTimeout(() => setCopiedProfileToast(false), 3000);
  };

  // --- REDEEM LICENSE ---
  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemStatus(null);

    const cleanCode = redeemInput.trim().toUpperCase();
    if (!cleanCode) {
      setRedeemStatus({ type: 'error', message: 'Ingresa un código de licencia válido.' });
      return;
    }

    try {
      const stored = localStorage.getItem('chepe_license_codes');
      let codes: LicenseCode[] = stored ? JSON.parse(stored) : [];

      const codeIndex = codes.findIndex(c => c.code.toUpperCase() === cleanCode);

      if (codeIndex === -1) {
        setRedeemStatus({ type: 'error', message: 'El código ingresado no existe o es incorrecto.' });
        return;
      }

      const license = codes[codeIndex];

      if (license.isUsed) {
        setRedeemStatus({ type: 'error', message: `Este código ya fue canjeado por ${license.usedBy || 'otro usuario'}.` });
        return;
      }

      // Mark as used
      codes[codeIndex].isUsed = true;
      codes[codeIndex].usedBy = user.email || user.name;
      localStorage.setItem('chepe_license_codes', JSON.stringify(codes));

      // Upgrade user plan
      onUpdateUserPlan(license.plan, license.expiresAt);
      setRedeemStatus({
        type: 'success',
        message: `¡Código Canjeado con Éxito! Tu cuenta se ha activado al ${license.plan.toUpperCase()} con vencimiento el ${license.expiresAt}.`
      });
      setRedeemInput('');
    } catch (err) {
      setRedeemStatus({ type: 'error', message: 'Error procesando el código de licencia.' });
    }
  };

  const getAvailabilityBadge = (status: UserProfessionalProfile['availabilityStatus'] | undefined) => {
    switch (status) {
      case 'available':
        return { label: 'Disponible para proyectos', bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400', dot: 'bg-emerald-400' };
      case 'employed':
        return { label: 'Empleado a tiempo completo', bg: 'bg-blue-950/80 border-blue-500/50 text-blue-300', dot: 'bg-blue-400' };
      case 'consultant':
        return { label: 'Consultor Independiente', bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300', dot: 'bg-amber-400' };
      case 'open_to_collaborations':
        return { label: 'Abierto a colaboraciones', bg: 'bg-purple-950/80 border-purple-500/50 text-purple-300', dot: 'bg-purple-400' };
      default:
        return { label: 'Miembro Activo', bg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300', dot: 'bg-cyan-400' };
    }
  };

  const currentAvailability = getAvailabilityBadge(existingPro?.availabilityStatus);

  const filteredPresetAvatars = photoFilterCategory === 'all'
    ? PRESET_AVATARS
    : PRESET_AVATARS.filter(a => a.category === photoFilterCategory);

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8 font-sans overflow-x-hidden">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xl shadow-emerald-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* HEADER PROFILE HERO CARD */}
      {/* ========================================== */}
      <div className="p-4 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Core Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 min-w-0 w-full md:w-auto">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-[#00E5FF] shadow-xl shadow-cyan-500/30 bg-[#050A14] relative">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay on hover */}
                <button
                  onClick={() => setActiveSubTab('photo')}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cyan-300 text-[10px] font-extrabold transition-opacity cursor-pointer gap-1"
                  title="Cambiar foto de perfil"
                >
                  <Camera className="w-5 h-5 text-[#00E5FF]" />
                  <span>Cambiar</span>
                </button>
              </div>

              {/* Online Indicator */}
              <span className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0B132B] absolute bottom-1 right-1 shadow-md shadow-emerald-400/50" />
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                  {user.name}
                </h1>
                {existingPro?.isCreated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 text-[10px] font-black uppercase tracking-wider shrink-0" title="Perfil Profesional Verificado">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
                    PRO VERIFICADO
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-[#00E5FF] text-stone-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                  Plan {user.planType}
                </span>
              </div>

              {/* Headline */}
              <p className="text-xs sm:text-sm font-semibold text-cyan-200 truncate max-w-xl">
                {existingPro?.headline || 'Configura tu perfil profesional para desbloquear personalizaciones avanzadas'}
              </p>

              {/* Org & Location & Member since */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400">
                {existingPro?.organization && (
                  <span className="flex items-center gap-1 text-stone-300 font-medium">
                    <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                    {existingPro.organization}
                  </span>
                )}
                {existingPro?.location && (
                  <span className="flex items-center gap-1 text-stone-300 font-medium">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    {existingPro.location}
                  </span>
                )}
                <span className="flex items-center gap-1 text-stone-400">
                  <Clock className="w-3 h-3 shrink-0" />
                  Miembro: {user.memberSince}
                </span>
              </div>

              {/* Availability Status Pill */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentAvailability.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentAvailability.dot} animate-pulse`} />
                  {currentAvailability.label}
                </span>

                {user.planExpiresAt && (
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800 shrink-0">
                    Vence: {user.planExpiresAt}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Hub on Header */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => setActiveSubTab('photo')}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-200 border border-cyan-800/80 hover:border-[#00E5FF] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Camera className="w-4 h-4 text-[#00E5FF]" />
              <span>Cambiar Foto</span>
            </button>

            <button
              onClick={() => setActiveSubTab('builder')}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Edit3 className="w-4 h-4" />
              <span>{existingPro?.isCreated ? 'Editar Perfil' : 'Crear Perfil Pro'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* NAVIGATION TABS */}
      {/* ========================================== */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#081021] border border-cyan-900/60 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('card')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'card'
              ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
              : 'text-stone-300 hover:text-white hover:bg-[#0F1C36]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Carnet Profesional</span>
        </button>

        <button
          onClick={() => setActiveSubTab('photo')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'photo'
              ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
              : 'text-stone-300 hover:text-white hover:bg-[#0F1C36]'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Foto & Avatar Studio</span>
        </button>

        <button
          onClick={() => setActiveSubTab('builder')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'builder'
              ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
              : 'text-stone-300 hover:text-white hover:bg-[#0F1C36]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Constructor de Perfil Pro</span>
          {!existingPro?.isCreated && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('licenses')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'licenses'
              ? 'bg-[#00E5FF] text-stone-950 shadow-md shadow-cyan-500/20'
              : 'text-stone-300 hover:text-white hover:bg-[#0F1C36]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Licencias & Consumo</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* TAB 1: CARNET / RESUMEN PROFESIONAL */}
      {/* ========================================== */}
      {activeSubTab === 'card' && (
        <div className="space-y-6">
          {/* Main Professional Identity Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-950 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#00E5FF]" />
                  <h3 className="text-lg font-extrabold text-white">Ficha de Perfil Profesional</h3>
                </div>
                <p className="text-xs text-stone-400">
                  Resumen ejecutivo y habilidades técnicas registradas en Chepe IA.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyProfileSummary}
                  className="px-3 py-1.5 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Copiar resumen del perfil profesional"
                >
                  {copiedProfileToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedProfileToast ? '¡Copiado!' : 'Copiar Ficha'}</span>
                </button>

                <button
                  onClick={() => setActiveSubTab('builder')}
                  className="px-3 py-1.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Sobre el Profesional / Bio Ejecutiva
              </h4>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed bg-[#050A14] p-4 rounded-2xl border border-cyan-950">
                {existingPro?.bio || (
                  <span className="text-stone-400 italic">
                    Aún no has redactado tu biografía profesional. Pulsa en "Constructor de Perfil Pro" para añadir tu resumen de carrera y especialidades.
                  </span>
                )}
              </p>
            </div>

            {/* Technical Skills Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-[#00E5FF]" />
                  Habilidades & Tecnologías Principales ({existingPro?.skills?.length || 0})
                </h4>
                <button
                  onClick={() => setActiveSubTab('builder')}
                  className="text-[11px] text-[#00E5FF] hover:underline font-semibold"
                >
                  + Agregar más
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {existingPro?.skills && existingPro.skills.length > 0 ? (
                  existingPro.skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] border border-cyan-800/80 text-cyan-200 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                      {sk}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-stone-400">No hay habilidades agregadas aún.</p>
                )}
              </div>
            </div>

            {/* Social & Professional Links */}
            <div className="space-y-3 border-t border-cyan-950 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#00E5FF]" />
                Enlaces & Redes Profesionales
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {existingPro?.socialLinks?.linkedin ? (
                  <a
                    href={existingPro.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-[#0A162C] hover:bg-[#102244] border border-cyan-900 text-xs font-bold text-white flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Linkedin className="w-4 h-4 text-[#0077B5] shrink-0" />
                      <span className="truncate">LinkedIn</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-white shrink-0" />
                  </a>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#050A14] border border-cyan-950 text-xs text-stone-400 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-stone-500 shrink-0" />
                    <span>LinkedIn (Sin vincular)</span>
                  </div>
                )}

                {existingPro?.socialLinks?.github ? (
                  <a
                    href={existingPro.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-[#0A162C] hover:bg-[#102244] border border-cyan-900 text-xs font-bold text-white flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Github className="w-4 h-4 text-white shrink-0" />
                      <span className="truncate">GitHub</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-white shrink-0" />
                  </a>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#050A14] border border-cyan-950 text-xs text-stone-400 flex items-center gap-2">
                    <Github className="w-4 h-4 text-stone-500 shrink-0" />
                    <span>GitHub (Sin vincular)</span>
                  </div>
                )}

                {existingPro?.socialLinks?.portfolio ? (
                  <a
                    href={existingPro.socialLinks.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-[#0A162C] hover:bg-[#102244] border border-cyan-900 text-xs font-bold text-white flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="w-4 h-4 text-[#00E5FF] shrink-0" />
                      <span className="truncate">Portafolio</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-white shrink-0" />
                  </a>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#050A14] border border-cyan-950 text-xs text-stone-400 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-stone-500 shrink-0" />
                    <span>Portafolio (Sin vincular)</span>
                  </div>
                )}

                {existingPro?.socialLinks?.twitter ? (
                  <a
                    href={existingPro.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-[#0A162C] hover:bg-[#102244] border border-cyan-900 text-xs font-bold text-white flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Twitter className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate">X / Twitter</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-white shrink-0" />
                  </a>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#050A14] border border-cyan-950 text-xs text-stone-400 flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-stone-500 shrink-0" />
                    <span>X (Sin vincular)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications Display */}
            {existingPro?.certifications && existingPro.certifications.length > 0 && (
              <div className="space-y-3 border-t border-cyan-950 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#00E5FF]" />
                  Certificaciones & Credenciales ({existingPro.certifications.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {existingPro.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3.5 rounded-2xl bg-[#050A14] border border-cyan-950 flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h5 className="text-xs font-bold text-white truncate">{cert.title}</h5>
                        <p className="text-[11px] text-stone-400 truncate">{cert.issuer}</p>
                        <span className="text-[10px] text-amber-300 font-mono font-bold">Año {cert.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Personalization Indicator */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 to-[#0F1C36] border border-[#00E5FF]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Calibración de Respuestas de Chepe IA
                  </h4>
                  <p className="text-[11px] text-stone-300">
                    {existingPro?.customAiPersona
                      ? 'Chepe IA adapta automáticamente el nivel técnico y sugerencias a tu perfil y stack tecnológico.'
                      : 'La personalización por perfil profesional está desactivada.'}
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase shrink-0 ${
                existingPro?.customAiPersona
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  : 'bg-stone-900 text-stone-400 border border-stone-700'
              }`}>
                {existingPro?.customAiPersona ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: FOTO DE PERFIL & AVATAR STUDIO */}
      {/* ========================================== */}
      {activeSubTab === 'photo' && (
        <div className="space-y-6">
          {/* Active Avatar Preview & Quick Actions */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-950 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#00E5FF]" />
                  <h3 className="text-lg font-extrabold text-white">Estudio de Foto de Perfil & Avatares</h3>
                </div>
                <p className="text-xs text-stone-400">
                  Sube tu fotografía personal, usa una imagen web o elige entre la galería de avatares de alta definición.
                </p>
              </div>

              <button
                onClick={handleResetAvatar}
                className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950 text-red-300 border border-red-900/60 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Restablecer avatar inicial"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar por defecto</span>
              </button>
            </div>

            {/* Current Avatar Showcase */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#050A14] border border-cyan-950">
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-[#00E5FF] shadow-xl shadow-cyan-500/30"
                />
                <span className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#050A14] absolute bottom-1 right-1" />
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#00E5FF] bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800">
                  Foto Actual en Uso
                </span>
                <h4 className="text-base font-extrabold text-white">{user.name}</h4>
                <p className="text-xs text-stone-400">
                  {user.photoUploadedAt
                    ? `Actualizada recientemente (${new Date(user.photoUploadedAt).toLocaleDateString()})`
                    : 'Avatar generado automáticamente'}
                </p>
                <span className="text-[11px] text-cyan-400 font-medium">
                  Tipo: <strong className="text-white uppercase">{user.avatarType || 'Estándar'}</strong>
                </span>
              </div>
            </div>

            {/* Option A: Upload Local Image (Drag & Drop + File Picker) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#00E5FF]" />
                1. Subir Fotografía desde tu Dispositivo
              </h4>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDropFile}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${
                  isDragOver
                    ? 'border-[#00E5FF] bg-[#00E5FF]/10'
                    : 'border-cyan-900/80 hover:border-[#00E5FF] bg-[#050A14] hover:bg-[#081021]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-[#0F1C36] border border-cyan-800 flex items-center justify-center text-[#00E5FF] shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-white">
                    Arrastra y suelta tu foto aquí, o <span className="text-[#00E5FF] underline">haz clic para examinar</span>
                  </p>
                  <p className="text-xs text-stone-400">
                    Formatos recomendados: JPG, PNG, WEBP, GIF de alta resolución (Máx 5MB).
                  </p>
                </div>
              </div>
            </div>

            {/* Option B: Direct Image URL */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-[#00E5FF]" />
                2. O Ingresa una URL Directa de Imagen
              </h4>

              <form onSubmit={handleApplyUrlPhoto} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/mi-foto-profesional.jpg"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shrink-0"
                >
                  Aplicar URL
                </button>
              </form>
            </div>

            {/* Option C: AI Avatar Generator (DiceBear Engine) */}
            <div className="space-y-3 border-t border-cyan-950 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-[#00E5FF]" />
                3. Generador de Avatar Vectorial por Semilla
              </h4>

              <div className="p-4 rounded-2xl bg-[#050A14] border border-cyan-950 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-400">Semilla / Nombre clave:</label>
                    <input
                      type="text"
                      value={dicebearSeed}
                      onChange={(e) => setDicebearSeed(e.target.value)}
                      placeholder="Ej. Developer99"
                      className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-400">Estilo del Avatar:</label>
                    <select
                      value={dicebearStyle}
                      onChange={(e) => setDicebearStyle(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="bottts">🤖 Bottts (Cyber Robot)</option>
                      <option value="adventurer">🧙‍♂️ Adventurer (Aventurero)</option>
                      <option value="lorelei">✨ Lorelei (Ilustrado)</option>
                      <option value="micah">🎨 Micah (Minimalista)</option>
                      <option value="personas">👤 Personas (Urbano)</option>
                    </select>
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDicebearSeed('Chepe-' + Math.floor(Math.random() * 10000))}
                      className="p-2.5 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800 text-xs font-bold transition-all cursor-pointer"
                      title="Generar semilla aleatoria"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyDicebear}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-stone-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generar & Aplicar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Option D: Curated Professional & Cyberpunk Presets */}
            <div className="space-y-4 border-t border-cyan-950 pt-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#00E5FF]" />
                  4. Galería de Avatares HD Seleccionados
                </h4>

                {/* Category filters */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'professional', label: '👔 Ejecutivos' },
                    { id: 'tech', label: '💻 Tech & Dev' },
                    { id: '3d', label: '🔮 3D Neon' },
                    { id: 'cyberpunk', label: '⚡ Cyberpunk' },
                    { id: 'creative', label: '🎨 Creativos' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPhotoFilterCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                        photoFilterCategory === cat.id
                          ? 'bg-[#00E5FF] text-stone-950 font-black'
                          : 'bg-[#050A14] text-stone-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filteredPresetAvatars.map((preset) => {
                  const isCurrent = user.avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPresetAvatar(preset)}
                      className={`group p-2 rounded-2xl bg-[#050A14] border transition-all cursor-pointer flex flex-col items-center gap-2 relative ${
                        isCurrent
                          ? 'border-[#00E5FF] ring-2 ring-[#00E5FF]/40 shadow-lg shadow-cyan-500/30'
                          : 'border-cyan-950 hover:border-cyan-500/80 hover:bg-[#0A162C]'
                      }`}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden relative">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[#00E5FF]/20 flex items-center justify-center">
                            <span className="w-6 h-6 rounded-full bg-[#00E5FF] text-stone-950 flex items-center justify-center font-black text-xs shadow-md">
                              ✓
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-stone-300 group-hover:text-white truncate w-full text-center">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: CONSTRUCTOR DE PERFIL PROFESIONAL */}
      {/* ========================================== */}
      {activeSubTab === 'builder' && (
        <form onSubmit={handleSaveProfessionalProfile} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-2xl space-y-6">
            <div className="border-b border-cyan-950 pb-5 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#00E5FF]" />
                  <h3 className="text-lg font-extrabold text-white">Constructor de Perfil Profesional</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-[11px] font-black text-[#00E5FF]">
                  Identidad Pro & IA Adaptativa
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Personaliza tu puesto, nivel de experiencia, habilidades y enlaces. Chepe IA utilizará esta información para calibrar sus respuestas técnicas.
              </p>
            </div>

            {/* Quick Load Templates */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#050A14] border border-cyan-950">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Cargar Plantilla Profesional Rápida:</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {PROFESSIONAL_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleLoadTemplate(tmpl.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-200 border border-cyan-800/70 hover:border-[#00E5FF] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>⚡</span>
                    <span>{tmpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Jose Arenales"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arenalesjose802@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                  <span>Título / Puesto Profesional (Headline):</span>
                  <span className="text-[10px] text-cyan-400 font-normal">Aparece destacado en tu perfil</span>
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Ej. Senior Full-Stack Engineer & AI Solutions Architect"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Empresa / Organización / Institución:</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Ej. Google / Freelance Studio / Tech Labs"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Ubicación (Ciudad, País / Modalidad):</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Madrid, España / Remoto"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Área Profesional / Categoría:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="development">💻 Desarrollo de Software & DevOps</option>
                  <option value="research">🔬 Inteligencia Artificial & Machine Learning</option>
                  <option value="design">🎨 Diseño UI/UX & Producto</option>
                  <option value="business">📈 Negocios, Finanzas & Gestión</option>
                  <option value="law">⚖️ Legal, Contratos & Privacidad</option>
                  <option value="medicine">🩺 Salud & Biotecnología</option>
                  <option value="education">📚 Docencia & Educación</option>
                  <option value="student">🎓 Estudiante Universitario / Técnico</option>
                  <option value="other">⚡ Otra especialidad</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Nivel de Seniority & Años:</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  >
                    <option value="student">Estudiante</option>
                    <option value="junior">Junior (1-2 años)</option>
                    <option value="mid">Mid-Level (3-5 años)</option>
                    <option value="senior">Senior (5-8 años)</option>
                    <option value="lead">Lead / Tech Lead</option>
                    <option value="executive">Director / Executive</option>
                  </select>

                  <input
                    type="text"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="Ej. 6 años"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-stone-300">Disponibilidad Actual:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'available', label: '🟢 Disponible para proyectos' },
                    { id: 'employed', label: '💼 Empleado a tiempo completo' },
                    { id: 'consultant', label: '💡 Consultor independiente' },
                    { id: 'open_to_collaborations', label: '🤝 Abierto a colaboraciones' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setAvailabilityStatus(st.id as any)}
                      className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                        availabilityStatus === st.id
                          ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-white shadow-md shadow-cyan-500/20'
                          : 'bg-[#050A14] border-cyan-950 text-stone-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Executive Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>Biografía Ejecutiva / Resumen Profesional:</span>
                <span className="text-[10px] text-stone-400">Describe tu trayectoria y áreas de interés</span>
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Escribe una breve descripción sobre tu experiencia, tecnologías favoritas, proyectos destacados y objetivos profesionales..."
                className="w-full p-3.5 rounded-2xl bg-[#050A14] border border-cyan-900 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF] leading-relaxed"
              />
            </div>

            {/* Skills Tags Manager */}
            <div className="space-y-3 border-t border-cyan-950 pt-5">
              <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>Habilidades y Tecnologías ({skills.length}):</span>
                <span className="text-[10px] text-stone-400">Escribe y pulsa Enter o selecciona sugerencias</span>
              </label>

              {/* Add Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(newSkillInput);
                    }
                  }}
                  placeholder="Escribe una habilidad (ej. PyTorch, Docker, React Native)..."
                  className="flex-1 px-4 py-2 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(newSkillInput)}
                  className="px-4 py-2 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-200 border border-cyan-800 text-xs font-bold transition-all cursor-pointer"
                >
                  + Agregar
                </button>
              </div>

              {/* Current Active Skills Chips */}
              <div className="flex flex-wrap gap-2 min-h-10 p-3 rounded-2xl bg-[#050A14] border border-cyan-950">
                {skills.length > 0 ? (
                  skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-3 py-1 rounded-xl bg-[#0F1C36] border border-cyan-800 text-cyan-200 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <span>{sk}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk)}
                        className="text-stone-400 hover:text-red-400 transition-colors ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-stone-500 italic">No has añadido ninguna habilidad aún.</p>
                )}
              </div>

              {/* Suggestions Categories */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-stone-400">Sugerencias populares (haz clic para añadir):</span>
                <div className="space-y-2">
                  {POPULAR_SKILL_SUGGESTIONS.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase">{cat.category}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((sk) => {
                          const isAlreadyAdded = skills.includes(sk);
                          return (
                            <button
                              key={sk}
                              type="button"
                              onClick={() => isAlreadyAdded ? handleRemoveSkill(sk) : handleAddSkill(sk)}
                              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                isAlreadyAdded
                                  ? 'bg-[#00E5FF] text-stone-950 font-black'
                                  : 'bg-[#050A14] text-stone-400 hover:text-white border border-cyan-950 hover:border-cyan-800'
                              }`}
                            >
                              {isAlreadyAdded ? `✓ ${sk}` : `+ ${sk}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social & Professional Links */}
            <div className="space-y-3 border-t border-cyan-950 pt-5">
              <label className="text-xs font-bold text-stone-300">Enlaces y Redes Profesionales:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Linkedin className="w-4 h-4 text-[#0077B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/tu-perfil"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="relative">
                  <Github className="w-4 h-4 text-white absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/tu-usuario"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="relative">
                  <Globe className="w-4 h-4 text-[#00E5FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://tu-sitio-o-portafolio.com"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="relative">
                  <Twitter className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://x.com/tu-usuario"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#050A14] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>
            </div>

            {/* Certifications Manager */}
            <div className="space-y-3 border-t border-cyan-950 pt-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#00E5FF]" />
                  Certificaciones y Credenciales ({certifications.length})
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCert(!isAddingCert)}
                  className="text-xs text-[#00E5FF] font-bold hover:underline"
                >
                  {isAddingCert ? 'Cancelar' : '+ Agregar Certificación'}
                </button>
              </div>

              {isAddingCert && (
                <div className="p-4 rounded-2xl bg-[#050A14] border border-cyan-900 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newCertTitle}
                      onChange={(e) => setNewCertTitle(e.target.value)}
                      placeholder="Título (ej. AWS Certified Solutions Architect)"
                      className="sm:col-span-2 px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                    />
                    <input
                      type="text"
                      value={newCertYear}
                      onChange={(e) => setNewCertYear(e.target.value)}
                      placeholder="Año (2026)"
                      className="px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCertIssuer}
                      onChange={(e) => setNewCertIssuer(e.target.value)}
                      placeholder="Entidad emisora (ej. Amazon Web Services / Coursera)"
                      className="flex-1 px-3 py-2 rounded-xl bg-[#081021] border border-cyan-900 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCertification}
                      className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-bold text-xs"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {certifications.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-[#050A14] border border-cyan-950 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-bold text-white truncate">{c.title}</span>
                      <span className="text-stone-400 text-[11px] truncate">· {c.issuer}</span>
                      <span className="text-amber-300 font-mono text-[10px]">({c.year})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(c.id)}
                      className="text-stone-500 hover:text-red-400 text-xs shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Personalization Checkbox */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-[#0F1C36] border border-cyan-800 flex items-start gap-3">
              <input
                type="checkbox"
                id="customAiPersona"
                checked={customAiPersona}
                onChange={(e) => setCustomAiPersona(e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-[#00E5FF] focus:ring-0 cursor-pointer accent-[#00E5FF]"
              />
              <label htmlFor="customAiPersona" className="text-xs text-stone-200 cursor-pointer space-y-0.5">
                <span className="font-extrabold text-white block">
                  Activar Personalización Continua de Chepe IA según mi Perfil
                </span>
                <span className="text-stone-400 block text-[11px]">
                  Chepe IA utilizará tu nivel de seniority ({experienceLevel}), tecnologías ({skills.slice(0, 4).join(', ')}...) y rol profesional para formular respuestas de alta precisión sin necesidad de repetirlo en cada prompt.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/30 transition-all cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Perfil Profesional</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================== */}
      {/* TAB 4: LICENCIAS & CONSUMO */}
      {/* ========================================== */}
      {activeSubTab === 'licenses' && (
        <div className="space-y-6">
          {/* REDEEM LICENSE CODE CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#081021] border border-amber-500/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-extrabold text-white">Canjear Código de Licencia de Plan</h3>
            </div>
            <p className="text-xs text-stone-300">
              Ingresa el código de activación generado por el administrador para actualizar tu plan y extender la fecha de vencimiento.
            </p>

            {redeemStatus && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                redeemStatus.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500'
                  : 'bg-red-950/90 text-red-300 border border-red-500'
              }`}>
                {redeemStatus.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                <span>{redeemStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleRedeemCode} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={redeemInput}
                  onChange={(e) => setRedeemInput(e.target.value)}
                  placeholder="Ej. CHEPE-PRO-9842-2026"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050A14] border border-cyan-900 font-mono text-white text-xs uppercase focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Canjear Código</span>
              </button>
            </form>
          </div>

          {/* Usage Progress Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#00E5FF]" />
                <h3 className="text-base sm:text-lg font-extrabold text-white">Consumo Diario de Inteligencia Artificial</h3>
              </div>
              <span className="text-xs font-bold text-cyan-300">{usagePercentage}% consumido</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
                <span>Mensajes enviados hoy:</span>
                <strong className="text-white font-mono text-sm">{user.dailyUsageCount} de {user.dailyLimit} mensajes</strong>
              </div>

              <div className="w-full h-3 bg-[#050A14] rounded-full overflow-hidden p-0.5 border border-cyan-950">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-[#00E5FF] rounded-full transition-all duration-500 shadow-md shadow-cyan-500/50"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>

              <p className="text-[11px] text-stone-400">
                * El límite diario de mensajes se reinicia automáticamente cada 24 horas.
              </p>
            </div>
          </div>

          {/* Quick Settings & Options */}
          <div
            onClick={onOpenSettings}
            className="p-5 rounded-2xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-900/60 hover:border-[#00E5FF] transition-all cursor-pointer group space-y-2 shadow-md"
          >
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-[#00E5FF]" />
              <h4 className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                Configuración de Clave API Personal y Servidor Domiciliario
              </h4>
            </div>
            <p className="text-xs text-stone-400">
              Configura un host IP o clave API de Gemini/Chepe IA para consultas directas sin límites.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
