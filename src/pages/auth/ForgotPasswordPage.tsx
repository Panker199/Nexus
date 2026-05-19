import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 sm:px-10 rounded border border-gray-200 text-center">
            <div className="mx-auto w-14 h-14 rounded bg-success-50 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-success-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent password reset instructions to <span className="font-medium text-gray-900">{email}</span>
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button onClick={() => setIsSubmitted(false)} className="font-medium text-primary-600 hover:text-primary-700">
                try again
              </button>
            </p>
            <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              <ArrowLeft size={16} />
              Back to login
            </Link>
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
            <Mail size={28} className="text-white" />
          </div>
          <h2 className="mt-5 text-center text-3xl font-bold text-gray-900">Forgot password?</h2>
          <p className="mt-1.5 text-center text-sm text-gray-500 max-w-sm">
            No worries. Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 sm:px-10 rounded border border-gray-200">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<Mail size={18} />}
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Send reset instructions
            </Button>
            <Link to="/login">
              <Button variant="ghost" fullWidth leftIcon={<ArrowLeft size={18} />}>
                Back to login
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
