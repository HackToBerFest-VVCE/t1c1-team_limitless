import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Shield & Optical Lens Logo */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.icon}`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md transition-transform hover:scale-105 duration-300"
        >
          <defs>
            <linearGradient id="logoShieldGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46F5" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="logoLensRing" x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="logoEyePupil" x1="48" y1="48" x2="72" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Outer Protective Shield */}
          <path
            d="M60 12 C78 12, 102 18, 106 32 C108 58, 96 88, 60 108 C24 88, 12 58, 14 32 C18 18, 42 12, 60 12 Z"
            fill="url(#logoShieldGrad)"
          />

          {/* Shield Inner Border Highlight */}
          <path
            d="M60 18 C75 18, 96 23, 99 35 C101 56, 90 82, 60 99 C30 82, 19 56, 21 35 C24 23, 45 18, 60 18 Z"
            stroke="white"
            strokeOpacity="0.3"
            strokeWidth="2"
            fill="none"
          />

          {/* Optical Magnifying Lens */}
          <circle
            cx="60"
            cy="54"
            r="26"
            fill="white"
            fillOpacity="0.15"
            stroke="url(#logoLensRing)"
            strokeWidth="3.5"
          />

          {/* Optical Iris / Protective Eye */}
          <circle cx="60" cy="54" r="16" fill="white" />
          <circle cx="60" cy="54" r="11" fill="url(#logoEyePupil)" />
          
          {/* Lens Glares */}
          <circle cx="56" cy="50" r="3.5" fill="white" />
          <circle cx="64" cy="58" r="1.5" fill="white" opacity="0.8" />

          {/* Crosshairs */}
          <path d="M60 22 L60 27" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M60 81 L60 86" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 54 L33 54" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M87 54 L92 54" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />

          {/* Magnifying Glass Stem */}
          <path d="M78 72 L96 90" stroke="white" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5 font-extrabold tracking-tight">
            <span className={`bg-gradient-to-r from-[#4F46F5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent font-bold ${currentSize.text}`}>
              ScamLens
            </span>
            <span className="bg-[#4F46F5]/10 text-[#4F46F5] text-xs font-bold px-1.5 py-0.5 rounded border border-[#4F46F5]/20 uppercase tracking-wider">
              AI
            </span>
          </div>
          <span className={`font-semibold tracking-wider text-[#64748B] uppercase ${currentSize.sub}`}>
            Think Before You Trust
          </span>
        </div>
      )}
    </div>
  );
};
