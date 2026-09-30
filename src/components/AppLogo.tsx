import React, { useState } from 'react';
import logoLuwuUtara from '../assets/images/Luwu_Utara_Logo_(North_Luwu).png';

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
  const [imgError, setImgError] = useState(false);

  // Height sizing for the official logo to preserve original proportions (400:483) without stretching
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-11 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto',
  }[size];

  // Primary image is Vite bundled import; fallback to public/logo.png or public/favicon.png for GitHub Pages
  const imgSrc = imgError ? './logo.png' : logoLuwuUtara;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="shrink-0 flex items-center justify-center">
        {/* Logo Lambang Resmi Pemerintah Kabupaten Luwu Utara */}
        <img
          src={imgSrc}
          onError={() => {
            if (!imgError) setImgError(true);
          }}
          alt="Lambang Resmi Pemerintah Kabupaten Luwu Utara"
          className={`${sizeClasses} max-w-none object-contain select-none`}
          loading="eager"
          style={{ imageRendering: 'auto' }}
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
