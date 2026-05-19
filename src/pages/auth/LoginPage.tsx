import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password, role);
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-100/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-50/20 to-accent-50/20 blur-3xl" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft-lg shadow-primary-500/20">
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

        <div className="mt-8 bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-soft-lg border border-gray-100">
          {error && (
            <div className="mb-5 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl flex items-start gap-2.5 text-sm animate-fade-in">
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
                  className={`py-3 px-4 border-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
                    role === 'entrepreneur'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setRole('entrepreneur')}
                >
                  <Building2 size={18} />
                  Entrepreneur
                </button>
                <button
                  type="button"
                  className={`py-3 px-4 border-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
                    role === 'investor'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<LogIn size={18} />}>
              Sign in
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
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
