import React, { useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  ring?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || '?';
}

const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-gray-400',
  away: 'bg-warning-500',
  busy: 'bg-error-500',
};

const statusSizes = {
  xs: 'h-1.5 w-1.5 ring-1.5',
  sm: 'h-2 w-2 ring-2',
  md: 'h-2.5 w-2.5 ring-2',
  lg: 'h-3 w-3 ring-2',
  xl: 'h-3.5 w-3.5 ring-2',
};

const statusPositions = {
  xs: 'bottom-0 right-0',
  sm: 'bottom-0 right-0',
  md: 'bottom-0.5 right-0.5',
  lg: 'bottom-0.5 right-0.5',
  xl: 'bottom-1 right-1',
};

const fontSize: Record<AvatarSize, string> = {
  xs: 'text-[8px]',
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  className = '',
  status,
  ring = false,
}) => {
  const [imgStatus, setImgStatus] = useState<'pending' | 'loaded' | 'failed'>('pending');
  const ringClass = ring ? 'ring-2 ring-primary-200 ring-offset-2' : '';

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {/* Initials always rendered */}
      <div
        className={`rounded-full bg-primary-500 flex items-center justify-center text-white font-bold ${sizeClasses[size]} ${ringClass} ${fontSize[size]} transition-opacity duration-300 ${
          imgStatus === 'loaded' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {getInitials(alt)}
      </div>

      {/* Image — only rendered when not permanently failed */}
      {imgStatus !== 'failed' && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 rounded-full object-cover ${sizeClasses[size]} transition-opacity duration-300 ${
            imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImgStatus('loaded')}
          onError={() => setImgStatus('failed')}
        />
      )}

      {status && (
        <span
          className={`absolute block rounded-full ring-white ${statusColors[status]} ${statusSizes[size]} ${statusPositions[size]}`}
        />
      )}
    </div>
  );
};
