import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeMap = {
  sm: { img: 32, text: 'text-sm' },
  md: { img: 40, text: 'text-lg' },
  lg: { img: 60, text: 'text-2xl' },
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const s = sizeMap[size];
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0" style={{ width: s.img, height: s.img }}>
        <img
          src="/logo.png"
          alt="Logo Poder Estoico"
          style={{ width: s.img, height: s.img }}
          className="rounded-full object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute rounded-full bg-background"
          style={{ left: '12.5%', top: '46%', width: '5.5%', height: '5.5%' }}
        />
        <span
          aria-hidden="true"
          className="absolute rounded-full bg-background"
          style={{ right: '12.5%', top: '46%', width: '5.5%', height: '5.5%' }}
        />
      </div>
      {showText && (
        <span className={`font-heading font-bold text-foreground tracking-wider ${s.text}`}>
          PODERESTOICO
        </span>
      )}
    </div>
  );
};

export default Logo;
