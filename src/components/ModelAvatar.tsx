import React, { useState } from 'react';
import { AIModelOption } from '../types';

interface ModelAvatarProps {
  model: AIModelOption;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

export const ModelAvatar: React.FC<ModelAvatarProps> = ({
  model,
  size = 'md',
  showBadge = false,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const badgeSizeClasses = {
    sm: 'w-3 h-3 text-[8px]',
    md: 'w-4 h-4 text-[9px]',
    lg: 'w-5 h-5 text-[10px]',
    xl: 'w-6 h-6 text-[11px]'
  };

  // Provider branding color for tiny indicator or fallback badge
  const getProviderColor = (provider?: string) => {
    switch (provider) {
      case 'OpenAI':
        return 'bg-emerald-500 text-stone-950 border-emerald-300';
      case 'Anthropic':
        return 'bg-amber-500 text-stone-950 border-amber-300';
      case 'Google':
        return 'bg-blue-500 text-white border-blue-300';
      case 'DeepSeek':
        return 'bg-cyan-500 text-stone-950 border-cyan-300';
      case 'Meta':
        return 'bg-indigo-500 text-white border-indigo-300';
      case 'xAI':
        return 'bg-neutral-200 text-stone-950 border-white';
      case 'Mistral':
        return 'bg-orange-500 text-stone-950 border-orange-300';
      case 'Qwen':
        return 'bg-purple-500 text-white border-purple-300';
      case 'Perplexity':
        return 'bg-teal-500 text-stone-950 border-teal-300';
      case 'Stability':
        return 'bg-fuchsia-500 text-stone-950 border-fuchsia-300';
      case 'Runway':
        return 'bg-pink-600 text-white border-pink-300';
      case 'AudioAI':
        return 'bg-rose-500 text-white border-rose-300';
      case 'Moonshot':
        return 'bg-cyan-600 text-white border-cyan-300';
      case '01AI':
        return 'bg-violet-600 text-white border-violet-300';
      case 'Microsoft':
        return 'bg-sky-500 text-white border-sky-300';
      case 'Nvidia':
        return 'bg-lime-500 text-stone-950 border-lime-300';
      case 'Cohere':
        return 'bg-amber-600 text-white border-amber-400';
      case 'Amazon':
        return 'bg-orange-600 text-white border-amber-300';
      case 'AI21':
        return 'bg-purple-600 text-white border-purple-300';
      case 'Baidu':
        return 'bg-blue-600 text-white border-blue-300';
      case 'ChepeIA':
        return 'bg-[#00E5FF] text-stone-950 border-cyan-200';
      default:
        return 'bg-[#00E5FF] text-stone-950 border-cyan-200';
    }
  };

  const gradientBg = model.avatarBg || 'from-cyan-600 to-blue-900';

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-2xl overflow-hidden shadow-md flex items-center justify-center bg-gradient-to-br ${gradientBg} border border-white/20 transition-transform duration-300`}
        style={{
          boxShadow: `0 4px 14px ${model.accentColor ? `${model.accentColor}33` : 'rgba(0,229,255,0.2)'}`
        }}
      >
        {model.photoUrl && !imgError ? (
          <img
            src={model.photoUrl}
            alt={model.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-2xl filter brightness-95 contrast-105 hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="select-none filter drop-shadow-sm font-bold flex items-center justify-center">
            {model.icon || '🤖'}
          </span>
        )}
      </div>

      {showBadge && model.provider && (
        <span
          className={`absolute -bottom-1 -right-1 ${badgeSizeClasses[size]} rounded-full flex items-center justify-center font-bold font-mono shadow-md border ${getProviderColor(
            model.provider
          )}`}
          title={`Proveedor: ${model.provider}`}
        >
          {model.provider.charAt(0)}
        </span>
      )}
    </div>
  );
};
