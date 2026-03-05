import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Person, ArrowBack } from '@mui/icons-material';

/**
 * LoginPage Component
 * Modern gradient login page with violet theme and polished form
 */
export default function LoginPage({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    const result = login(username, password);

    if (result.success) {
      setUsername('');
      setPassword('');
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-slate-50 to-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600" />

          <div className="p-6 md:p-8">
            {/* Back Button */}
            {onBack && (
              <div className="mb-6">
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors focus-ring rounded-lg px-1"
                  aria-label="Back to store"
                >
                  <ArrowBack fontSize="small" />
                  <span>Back to Store</span>
                </button>
              </div>
            )}

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-200">
                <span className="text-white font-extrabold text-2xl">J</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gradient mb-1">
                Jeyam Fancy Store
              </h1>
              <p className="text-slate-500 text-sm font-medium">Admin Login</p>
              <p className="text-xs text-slate-400 mt-1">Sign in to access admin features</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Person className="text-primary-400" fontSize="small" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter username"
                    autoComplete="username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-primary-400" fontSize="small" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-error-50 border-l-4 border-error-500 text-error-700 px-4 py-3 rounded-xl text-sm">
                  <span className="font-bold mt-0.5">!</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-base"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
