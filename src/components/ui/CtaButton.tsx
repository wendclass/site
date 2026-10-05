import React from 'react';
import { Link } from 'react-router-dom';

export interface CtaButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'champagne' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const CtaButton: React.FC<CtaButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'right',
  type = 'button',
  disabled = false,
  fullWidth = false,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium font-body rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] select-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-1.5 min-h-[38px]',
    md: 'px-6 py-3 text-base gap-2 min-h-[46px]',
    lg: 'px-8 py-4 text-lg gap-2.5 min-h-[54px]',
  };

  const variantStyles = {
    primary:
      'bg-violet-imperial text-ivoire-violet hover:bg-[#7818e8] shadow-soft hover:shadow-glow hover:-translate-y-0.5 focus-visible:ring-violet-imperial',
    secondary:
      'bg-white/80 border border-violet-imperial/20 text-violet-imperial hover:bg-violet-imperial/5 hover:border-violet-imperial/40 shadow-sm focus-visible:ring-violet-imperial',
    champagne:
      'bg-or-champagne text-onyx font-semibold hover:bg-[#d4ac7d] shadow-soft hover:shadow-glow hover:-translate-y-0.5 focus-visible:ring-or-champagne',
    dark:
      'bg-ivoire-violet text-onyx hover:bg-white shadow-soft hover:shadow-glow hover:-translate-y-0.5 focus-visible:ring-white',
    ghost:
      'bg-transparent text-onyx hover:text-violet-imperial hover:bg-violet-imperial/5 focus-visible:ring-violet-imperial',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${disabledStyle} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`group ${combinedClasses}`} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={`group ${combinedClasses}`}
        onClick={onClick}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={`group ${combinedClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};
