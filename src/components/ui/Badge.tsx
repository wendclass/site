import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'violet' | 'champagne' | 'amethyste' | 'dark';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'violet',
  className = '',
}) => {
  const variantStyles = {
    violet: 'bg-violet-imperial/10 text-violet-imperial border border-violet-imperial/20',
    champagne: 'bg-or-champagne/15 text-[#8A5E2E] border border-or-champagne/30',
    amethyste: 'bg-amethyste/15 text-violet-imperial border border-amethyste/30',
    dark: 'bg-onyx/40 text-ivoire-violet border border-white/10 backdrop-blur-sm',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
