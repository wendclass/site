import React from 'react';
import { Link } from 'react-router-dom';

export interface LogoProps {
  variant?: 'violet' | 'blanc';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'violet',
  className = '',
  size = 'md',
  asLink = true
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 sm:h-9 w-auto',
    lg: 'h-10 sm:h-12 w-auto'
  };

  const imageSrc = variant === 'blanc'
    ? '/assets/logo/logo-blanc.png'
    : '/assets/logo/logo-violet.png';

  const logoElement = (
    <div className={`inline-flex items-center gap-2 select-none transition-transform duration-300 hover:scale-[1.02] ${className}`}>
      <img
        src={imageSrc}
        alt="Class S — L'identité visuelle qui vous impose"
        className={`${sizeClasses[size]} object-contain`}
        loading="eager"
      />
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" aria-label="Retour à l'accueil Class S" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amethyste rounded-lg">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};
