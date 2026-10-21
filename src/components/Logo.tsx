import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  showSubtitle = true
}) => {
  const isLight = variant === 'light';

  const textPrimary = isLight ? 'text-white' : 'text-brand-green';
  const textSubtitle = isLight ? 'text-[#E6DFD3]/80' : 'text-brand-slate/75';

  const fontSizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl md:text-4xl'
  }[size];

  const subSizeClass = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  }[size];

  return (
    <div className="flex flex-col select-none group">
      <div className="flex items-center gap-1.5">
        {/* FEBI Brand Name with twin leaf emblem over the dot of 'i' */}
        <div className="relative inline-flex items-baseline font-black tracking-tight font-sans">
          <span className={`${fontSizeClass} ${textPrimary} tracking-tight font-extrabold`}>
            FEB
          </span>
          <span className="relative">
            <span className={`${fontSizeClass} ${textPrimary} font-extrabold`}>I</span>
            {/* Twin Leaf Emblem above the I */}
            <span className="absolute -top-3 -right-1 flex items-center pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left leaf (Forest green or sage) */}
                <path
                  d="M11 2C11 2 4 4 4 13C4 18 8 21 11 22C11 17 11 10 11 2Z"
                  fill={isLight ? '#A3D9B5' : '#1B4D3C'}
                />
                {/* Right leaf (Terracotta) */}
                <path
                  d="M13 2C13 2 20 5 20 13C20 18 16 21 13 22C13 17 13 10 13 2Z"
                  fill="#B86B35"
                />
              </svg>
            </span>
          </span>
        </div>

        {/* Separator Dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta inline-block mx-0.5"></span>

        {/* SPACE stylized */}
        <span className={`${fontSizeClass} font-bold tracking-[0.22em] text-brand-terracotta`}>
          SP<span className="font-light">Λ</span>CE
        </span>
      </div>

      {showSubtitle && (
        <span className={`${subSizeClass} uppercase tracking-[0.28em] ${textSubtitle} font-semibold mt-0.5`}>
          Cafe • Creative • Ideas
        </span>
      )}
    </div>
  );
};
