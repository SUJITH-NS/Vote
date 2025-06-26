import React, { useState, useEffect } from 'react';
import { User, AuthState } from './types';
import { storage } from './utils/storage';
import AnimatedBackground from './components/AnimatedBackground';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [currentView, setCurrentView] = useState<'signup' | 'login' | 'dashboard'>('signup');

  useEffect(() => {
    // Check for existing user session
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      setAuthState({
        user: currentUser,
        isAuthenticated: true
      });
      setCurrentView('dashboard');
    }
  }, []);

  const handleSignupSuccess = () => {
    setCurrentView('login');
  };

  const handleLogin = (user: User) => {
    setAuthState({
      user,
      isAuthenticated: true
    });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    setCurrentView('signup');
  };

  const handleBackToSignup = () => {
    setCurrentView('signup');
  };

  return (
    <AnimatedBackground>
      {currentView === 'signup' && (
        <Signup onSignupSuccess={handleSignupSuccess} />
      )}
      
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onBackToSignup={handleBackToSignup}
        />
      )}
      
      {currentView === 'dashboard' && authState.user && (
        <>
          {authState.user.role === 'admin' ? (
            <AdminDashboard 
              user={authState.user} 
              onLogout={handleLogout} 
            />
          ) : (
            <UserDashboard 
              user={authState.user} 
              onLogout={handleLogout} 
            />
          )}
        </>
      )}
    </AnimatedBackground>
  );
}

export default App;