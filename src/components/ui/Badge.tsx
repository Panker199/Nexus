import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'gray';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  dot = false,
  pulse = false,
  className = '',
  onClick,
}) => {
  const variantClasses = {
    primary: 'bg-primary-50 text-primary-700 ring-1 ring-primary-200/50',
    secondary: 'bg-secondary-50 text-secondary-700 ring-1 ring-secondary-200/50',
    accent: 'bg-accent-50 text-accent-700 ring-1 ring-accent-200/50',
    success: 'bg-success-50 text-success-700 ring-1 ring-success-200/50',
    warning: 'bg-warning-50 text-warning-700 ring-1 ring-warning-200/50',
    error: 'bg-error-50 text-error-700 ring-1 ring-error-200/50',
    gray: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200/50',
  };

  const dotColors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    gray: 'bg-gray-500',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
  const clickableClass = onClick ? 'cursor-pointer hover:opacity-80 active:scale-95' : '';

  return (
    <span
      className={`inline-flex items-center font-medium transition-all duration-200 ${roundedClass} ${variantClasses[variant]} ${sizeClasses[size]} ${clickableClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${pulse ? 'animate-pulse-soft' : ''} ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};
