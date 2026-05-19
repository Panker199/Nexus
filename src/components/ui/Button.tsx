import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link' | 'success' | 'warning' | 'error';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded border transition-colors focus:outline-none btn-press';

  const sizeStyles = {
    xs: 'text-xs px-2.5 py-1 gap-1',
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2',
    xl: 'text-lg px-6 py-3 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 disabled:opacity-50',
    secondary: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300 disabled:opacity-50',
    accent: 'bg-accent-500 text-white border-accent-500 hover:bg-accent-600 hover:border-accent-600 disabled:opacity-50',
    outline: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50',
    ghost: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 disabled:opacity-50',
    link: 'bg-transparent text-primary-600 border-transparent hover:text-primary-800 p-0 disabled:opacity-50',
    success: 'bg-success-500 text-white border-success-500 hover:bg-success-600 hover:border-success-600 disabled:opacity-50',
    warning: 'bg-warning-500 text-white border-warning-500 hover:bg-warning-600 hover:border-warning-600 disabled:opacity-50',
    error: 'bg-error-500 text-white border-error-500 hover:bg-error-600 hover:border-error-600 disabled:opacity-50',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthClass} ${disabledClass} ${className}`;

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
