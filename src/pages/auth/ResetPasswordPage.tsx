import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { resetPassword } = useAuth();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || password !== confirmPassword) return;
    setIsLoading(true);
    try {
      await resetPassword(token, password);
      navigate('/login');
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 sm:px-10 rounded border border-gray-200 text-center">
            <div className="mx-auto w-14 h-14 rounded bg-error-50 flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-error-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Invalid reset link</h2>
            <p className="mt-2 text-sm text-gray-600">This password reset link is invalid or has expired.</p>
            <Button className="mt-6" onClick={() => navigate('/forgot-password')}>
              Request new reset link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded bg-primary-600 flex items-center justify-center">
            <Lock size={28} className="text-white" />
          </div>
          <h2 className="mt-5 text-center text-3xl font-bold text-gray-900">Set new password</h2>
          <p className="mt-1.5 text-center text-sm text-gray-500">Must be at least 8 characters.</p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 sm:px-10 rounded border border-gray-200">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              startAdornment={<Lock size={18} />}
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              startAdornment={<Lock size={18} />}
              error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Reset password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
