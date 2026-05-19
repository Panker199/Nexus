import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OtpInput } from '../../components/ui/SecurityInputs';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!showOtp) {
      setShowOtp(true);
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password, role);
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const resetOtp = () => { setShowOtp(false); setOtp(''); };

  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === 'entrepreneur') {
      setEmail('sarah@techwave.io');
      setPassword('password123');
    } else {
      setEmail('michael@vcinnovate.com');
      setPassword('password123');
    }
    setRole(userRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded bg-primary-600 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="mt-5 text-center text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-1.5 text-center text-sm text-gray-500">
            Sign in to continue to your dashboard
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 sm:px-10 rounded border border-gray-200">
          {error && (
            <div className="mb-5 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded flex items-start gap-2.5 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 border rounded flex items-center justify-center gap-2 text-sm font-medium ${
                    role === 'entrepreneur'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setRole('entrepreneur')}
                >
                  <Building2 size={18} />
                  Entrepreneur
                </button>
                <button
                  type="button"
                  className={`py-3 px-4 border rounded flex items-center justify-center gap-2 text-sm font-medium ${
                    role === 'investor'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setRole('investor')}
                >
                  <CircleDollarSign size={18} />
                  Investor
                </button>
              </div>
            </div>

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<User size={18} />}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            {showOtp && (
              <div className="space-y-4 p-4 rounded bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Enter the 6-digit code sent to your device</p>
                  </div>
                </div>
                <OtpInput value={otp} onChange={setOtp} />
                <div className="flex justify-between">
                  <button type="button" onClick={resetOtp} className="text-xs text-gray-500 hover:text-gray-700 underline">Back to login</button>
                  <button type="button" className="text-xs text-primary-600 hover:text-primary-700 underline">Resend code</button>
                </div>
              </div>
            )}

            <Button type="submit" fullWidth isLoading={isLoading} leftIcon={showOtp ? <Shield size={18} /> : <LogIn size={18} />}>
              {showOtp ? 'Verify & Sign In' : 'Sign in'}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs font-medium text-gray-400 flex items-center gap-1.5">
                  <Sparkles size={14} /> Demo Accounts
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('entrepreneur')} leftIcon={<Building2 size={16} />}>
                Entrepreneur Demo
              </Button>
              <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('investor')} leftIcon={<CircleDollarSign size={16} />}>
                Investor Demo
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
