import React from 'react';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Multi-layer Animated Background */}
      <div className="absolute inset-0">
        {/* Primary Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-shift"></div>
        
        {/* Secondary Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/50 via-transparent to-rose-800/50 animate-gradient-shift" style={{ animationDelay: '2s' }}></div>
        
        {/* Tertiary Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-bl from-violet-800/30 via-transparent to-emerald-800/30 animate-gradient-shift" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-float-complex"></div>
        <div className="absolute top-40 right-32 w-56 h-56 bg-gradient-to-r from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl animate-float-complex" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-gradient-to-r from-rose-400/20 to-orange-400/20 rounded-full blur-2xl animate-float-complex" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-r from-emerald-400/25 to-teal-400/25 rounded-full blur-xl animate-float-complex" style={{ animationDelay: '6s' }}></div>
        
        {/* Medium Particles */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-violet-300/30 to-purple-300/30 rounded-full blur-xl animate-particle-float"></div>
        <div className="absolute top-3/4 right-1/4 w-20 h-20 bg-gradient-to-r from-cyan-300/25 to-blue-300/25 rounded-full blur-lg animate-particle-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-28 h-28 bg-gradient-to-r from-pink-300/20 to-rose-300/20 rounded-full blur-xl animate-particle-float" style={{ animationDelay: '5s' }}></div>
        
        {/* Small Sparkles */}
        <div className="absolute top-16 right-16 w-12 h-12 bg-gradient-to-r from-yellow-300/40 to-amber-300/40 rounded-full blur-md animate-pulse-glow"></div>
        <div className="absolute bottom-16 left-16 w-8 h-8 bg-gradient-to-r from-green-300/50 to-emerald-300/50 rounded-full blur-sm animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-gradient-to-r from-indigo-300/45 to-blue-300/45 rounded-full blur-md animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-32 left-1/2 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rotate-45 blur-lg animate-float-complex" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-1/2 w-12 h-12 bg-gradient-to-r from-blue-400/25 to-cyan-400/25 rotate-12 blur-md animate-float-complex" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;