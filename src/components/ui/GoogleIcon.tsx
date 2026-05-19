import React from 'react';

interface GoogleIconProps {
  icon: string;
  size?: number;
  className?: string;
  filled?: boolean;
}

export const GoogleIcon: React.FC<GoogleIconProps> = ({ icon, size = 20, className = '', filled = false }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontSize: size,
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0`,
      lineHeight: 1,
    }}
  >
    {icon}
  </span>
);
