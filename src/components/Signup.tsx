import React, { useState } from 'react';
import { User, Mail, Lock, UserCheck, ArrowRight, Sparkles, Shield } from 'lucide-react';

interface SignupProps {
  onSignupSuccess: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Password validation
    const password = formData.password;
    const passwordValid =
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password);
    if (!passwordValid) {
      setError('Password must be at least 6 characters, include uppercase, lowercase, and a number.');
      setIsLoading(false);
      return;
    }

    try {
      // Send signup data to backend
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password, // You may want to hash this in production
          role: formData.role
        })
      });
      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }
      // Optionally, you can store the user in localStorage or context here
      await new Promise(resolve => setTimeout(resolve, 500));
      onSignupSuccess();
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="glass-card rounded-3xl p-8 shadow-2xl card-hover animate-bounce-in">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-3">Create Account</h1>
            <p className="text-white/80 text-lg">Join the future of digital voting</p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-4"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Username Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-white/60 group-focus-within:text-purple-400 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-glass w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all duration-300"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Email Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-white/60 group-focus-within:text-purple-400 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-glass w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all duration-300"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-white/60 group-focus-within:text-purple-400 transition-colors duration-300" />
                </div>
                <input
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-glass w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all duration-300"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-white/90 font-semibold text-sm uppercase tracking-wider">Choose Your Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === 'user'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' })}
                      className="sr-only"
                    />
                    <div className={`glass-card p-6 rounded-2xl border-2 transition-all duration-300 text-center group-hover:scale-105 ${
                      formData.role === 'user' 
                        ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25' 
                        : 'border-white/20 hover:border-purple-300/50'
                    }`}>
                      <User className="w-8 h-8 mx-auto mb-3 text-white" />
                      <span className="text-white font-semibold text-lg">Voter</span>
                      <p className="text-white/70 text-sm mt-1">Participate in polls</p>
                    </div>
                  </label>

                  <label className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === 'admin'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' })}
                      className="sr-only"
                    />
                    <div className={`glass-card p-6 rounded-2xl border-2 transition-all duration-300 text-center group-hover:scale-105 ${
                      formData.role === 'admin' 
                        ? 'border-pink-400 bg-pink-500/20 shadow-lg shadow-pink-500/25' 
                        : 'border-white/20 hover:border-pink-300/50'
                    }`}>
                      <Shield className="w-8 h-8 mx-auto mb-3 text-white" />
                      <span className="text-white font-semibold text-lg">Admin</span>
                      <p className="text-white/70 text-sm mt-1">Create & manage polls</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="glass-card border-red-400/50 bg-red-500/20 rounded-2xl p-4 animate-slide-in-up">
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
                  <span>Create Account</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={onSignupSuccess}
              className="text-white/70 hover:text-white transition-colors duration-300 font-medium"
            >
              Already have an account? <span className="gradient-text hover:underline">Sign in here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;