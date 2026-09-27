import React from 'react';
import logoLuwuUtaraTransparent from '../assets/images/logo_luwu_utara_transparent.png';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  // Dimension classes matching government shield proportions (approx 1:1.3 ratio)
  const sizeClasses = {
    sm: 'w-7 h-9',
    md: 'w-10 h-13',
    lg: 'w-16 h-21',
    xl: 'w-24 h-31',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`${sizeClasses} shrink-0 relative flex items-center justify-center`}>
        {/* Official Kabupaten Luwu Utara Coat of Arms - 100% Transparent Background */}
        <img
          src={logoLuwuUtaraTransparent}
          alt="Lambang Resmi Pemerintah Kabupaten Luwu Utara"
          className="w-full h-full object-contain filter drop-shadow-md select-none"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-sm tracking-tight text-white leading-tight">
            LAPAK KINERJA
          </span>
          <span className="text-[10px] text-blue-300 font-medium">
            Dinas Transnaker Luwu Utara
          </span>
        </div>
      )}
    </div>
  );
};
