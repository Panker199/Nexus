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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97]';

  const sizeStyles = {
    xs: 'text-xs px-2.5 py-1 gap-1.5',
    sm: 'text-sm px-3.5 py-2 gap-2',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
    xl: 'text-lg px-8 py-3.5 gap-3',
  };

  const variantStyles = {
    primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md focus:ring-primary-500 focus:shadow-glow disabled:bg-primary-300',
    secondary: 'bg-secondary-600 text-white shadow-sm hover:bg-secondary-700 hover:shadow-md focus:ring-secondary-500 disabled:bg-secondary-300',
    accent: 'bg-accent-500 text-white shadow-sm hover:bg-accent-600 hover:shadow-md focus:ring-accent-400 disabled:bg-accent-300',
    outline: 'border-2 border-gray-200 bg-transparent text-gray-700 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 focus:ring-primary-500 disabled:border-gray-100 disabled:text-gray-400',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-primary-500 disabled:text-gray-300',
    link: 'bg-transparent text-primary-600 hover:text-primary-800 hover:underline focus:ring-primary-500 p-0 disabled:text-gray-400',
    success: 'bg-success-500 text-white shadow-sm hover:bg-success-600 hover:shadow-md focus:ring-success-500 disabled:bg-success-300',
    warning: 'bg-warning-500 text-white shadow-sm hover:bg-warning-600 hover:shadow-md focus:ring-warning-500 disabled:bg-warning-300',
    error: 'bg-error-500 text-white shadow-sm hover:bg-error-600 hover:shadow-md focus:ring-error-500 disabled:bg-error-300',
  };

  const loadingClass = isLoading ? 'opacity-80 cursor-wait' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthClass} ${loadingClass} ${disabledClass} ${className}`;

  const renderIcon = (icon: React.ReactNode, size: ButtonSize) => {
    const iconSizes = { xs: 14, sm: 16, md: 18, lg: 20, xl: 22 };
    const iconSize = iconSizes[size];
    return React.cloneElement(icon as React.ReactElement, { size: iconSize });
  };

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
        renderIcon(leftIcon, size)
      ) : null}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && renderIcon(rightIcon, size)}
    </button>
  );
};
