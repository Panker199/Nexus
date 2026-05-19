import React, { useMemo } from 'react';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

const strengthConfig = [
  { label: 'Weak', color: 'bg-error-500', text: 'text-error-600', icon: ShieldAlert, min: 0 },
  { label: 'Fair', color: 'bg-warning-500', text: 'text-warning-600', icon: Shield, min: 1 },
  { label: 'Good', color: 'bg-accent-500', text: 'text-accent-600', icon: Shield, min: 2 },
  { label: 'Strong', color: 'bg-success-500', text: 'text-success-600', icon: ShieldCheck, min: 3 },
  { label: 'Very Strong', color: 'bg-success-600', text: 'text-success-700', icon: ShieldCheck, min: 4 },
];

function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const score = useMemo(() => getStrength(password), [password]);
  const cfg = strengthConfig[score];

  if (!password) return null;

  const Icon = cfg.icon;
  const pct = ((score + 1) / strengthConfig.length) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs">
        <Icon size={14} className={cfg.text} />
        <span className={`font-medium ${cfg.text}`}>{cfg.label}</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${cfg.color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, value, onChange }) => {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) return;
    const newVal = value.substring(0, idx) + val[idx] + value.substring(idx + 1);
    onChange(newVal);
    if (idx < length - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={el => { inputsRef.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] ?? ''}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          className="w-10 h-12 text-center text-lg font-bold border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      ))}
    </div>
  );
};
