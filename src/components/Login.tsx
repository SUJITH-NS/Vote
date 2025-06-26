import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onBackToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBackToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Fetch users from backend
      const response = await fetch('https://vote-9nmi.onrender.com/api/users');
      if (!response.ok) {
        setError('Failed to connect to server');
        setIsLoading(false);
        return;
      }
      const users = await response.json();
      const user = users.find((u: any) => u.email === formData.email);
      if (!user) {
        setError('No account found with this email address');
        setIsLoading(false);
        return;
      }
      // Simulate password check (in real app, passwords would be hashed)
      if (user.password !== formData.password) {
        setError('Incorrect password');
        setIsLoading(false);
        return;
      }
      // Optionally, store user in localStorage or context
      onLogin(user);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="glass-card rounded-3xl p-8 shadow-2xl card-hover animate-slide-in-up">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-3">Welcome Back</h1>
            <p className="text-white/80 text-lg">Sign in to continue your journey</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Email Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-white/60 group-focus-within:text-blue-400 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-glass w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all duration-300"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-white/60 group-focus-within:text-blue-400 transition-colors duration-300" />
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-glass w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all duration-300"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {error && (
              <div className="glass-card border-red-400/50 bg-red-500/20 rounded-2xl p-4 animate-bounce-in">
                <p className="text-red-200 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={onBackToSignup}
              className="glass-button px-6 py-3 rounded-xl text-white/80 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;