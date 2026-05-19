import React, { forwardRef, useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  startAdornment,
  endAdornment,
  fullWidth = false,
  className = '',
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const isActive = isFocused || (props.value && String(props.value).length > 0);

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-1.5 transition-colors duration-200 ${
          error ? 'text-error-600' : isFocused ? 'text-primary-700' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}

      <div className="relative">
        {startAdornment && (
          <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
            isFocused && !error ? 'text-primary-500' : error ? 'text-error-500' : 'text-gray-400'
          }`}>
            {startAdornment}
          </div>
        )}

        <input
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`block w-full rounded-lg shadow-sm transition-all duration-200 sm:text-sm ${
            error
              ? 'border-error-300 focus:border-error-500 focus:ring-error-500 bg-error-50/30'
              : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500 bg-white hover:border-gray-300'
          } ${
            startAdornment ? 'pl-11' : 'pl-4'
          } ${
            endAdornment ? 'pr-11' : 'pr-4'
          } py-2.5 focus:shadow-glow`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.name}-error` : undefined}
          {...props}
        />

        {endAdornment && (
          <div className={`absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
            isFocused && !error ? 'text-primary-500' : error ? 'text-error-500' : 'text-gray-400'
          }`}>
            {endAdornment}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          id={error ? `${props.name}-error` : undefined}
          className={`mt-1.5 text-sm flex items-center gap-1 ${
            error ? 'text-error-600' : 'text-gray-500'
          }`}
          role={error ? 'alert' : undefined}
        >
          {error && (
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
