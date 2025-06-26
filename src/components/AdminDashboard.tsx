import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, Users, TrendingUp, LogOut, Eye, Crown, Sparkles, Activity } from 'lucide-react';
import { User, Poll } from '../types';
import { storage } from '../utils/storage';
import CreatePoll from './CreatePoll';
import PollResults from './PollResults';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'create' | 'results'>('overview');
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  useEffect(() => {
    loadPolls();
    // eslint-disable-next-line
  }, []);

  const loadPolls = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/polls');
      if (!response.ok) throw new Error('Failed to fetch polls');
      const allPolls = await response.json();
      const userPolls = allPolls.filter((poll: any) => poll.createdBy === user.id);
      setPolls(userPolls);
    } catch (err) {
      setPolls([]);
    }
  };

  const handlePollCreated = (poll: Poll) => {
    setPolls(prev => [...prev, poll]);
    setSelectedView('overview');
  };

  const getTotalVotes = (poll: Poll) => {
    return poll.options.reduce((total, option) => total + option.votes, 0);
  };

  const getTotalVotesAcrossPolls = () => {
    return polls.reduce((total, poll) => total + getTotalVotes(poll), 0);
  };
 
  const getActivePolls = () => {
    return polls.filter(poll => poll.isActive).length;
  };

  const viewResults = (poll: Poll) => {
    setSelectedPoll(poll);
    setSelectedView('results');
  };

  const handlePublishResults = async (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;
    const updatedPoll = { ...poll, resultsPublished: !poll.resultsPublished };
    try {
      const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultsPublished: updatedPoll.resultsPublished })
      });
      if (response.ok) {
        await loadPolls(); // Always reload polls from backend for latest state
      }
    } catch (err) {
      // Optionally show error
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      try {
        await fetch(`http://localhost:4000/api/polls/${pollId}`, { method: 'DELETE' });
        setPolls(prevPolls => prevPolls.filter(poll => poll.id !== pollId));
      } catch (err) {
        // Optionally show error
      }
    }
  };

  if (selectedView === 'create') {
    return (
      <div className="min-h-screen p-4">
        <CreatePoll 
          user={user} 
          onPollCreated={handlePollCreated}
          onBack={() => setSelectedView('overview')}
        />
      </div>
    );
  }

  if (selectedView === 'results' && selectedPoll) {
    return (
      <div className="min-h-screen p-4">
        <PollResults 
          poll={selectedPoll}
          onBack={() => setSelectedView('overview')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto stagger-animation">
        {/* Enhanced Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 shadow-2xl card-hover">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Admin Command Center</h1>
                <p className="text-white/80 text-lg">Welcome back, <span className="font-semibold text-yellow-300">{user.username}</span>!</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-sm font-medium">System Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedView('create')}
                className="btn-success px-8 py-4 rounded-2xl font-bold text-lg text-white flex items-center space-x-3"
              >
                <Plus className="w-6 h-6" />
                <span>Create New Poll</span>
              </button>
              <button
                onClick={onLogout}
                className="glass-button px-6 py-4 rounded-2xl text-white hover:text-red-300 transition-all duration-300 flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="glass-card rounded-3xl p-8 card-hover animate-slide-in-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Total Polls</p>
                <p className="text-4xl font-bold text-white animate-count-up">{polls.length}</p>
                <p className="text-white/60 text-sm mt-1">Polls created</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-expand-bar" style={{ '--target-width': '75%' } as any}></div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 card-hover animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Active Polls</p>
                <p className="text-4xl font-bold text-white animate-count-up">{getActivePolls()}</p>
                <p className="text-white/60 text-sm mt-1">Currently running</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full animate-expand-bar" style={{ '--target-width': '90%' } as any}></div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 card-hover animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Total Votes</p>
                <p className="text-4xl font-bold text-white animate-count-up">{getTotalVotesAcrossPolls()}</p>
                <p className="text-white/60 text-sm mt-1">Votes collected</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full animate-expand-bar" style={{ '--target-width': '60%' } as any}></div>
            </div>
          </div>
        </div>

        {/* Enhanced Polls List */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Your Polls</h2>
              <p className="text-white/70 text-lg mt-1">Manage and monitor your voting sessions</p>
            </div>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          
          {polls.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-pulse-glow"></div>
                <BarChart3 className="w-12 h-12 text-white/40" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No polls created yet</h3>
              <p className="text-white/60 text-lg mb-8">Create your first poll to start collecting votes!</p>
              <button
                onClick={() => setSelectedView('create')}
                className="btn-primary px-8 py-4 rounded-2xl font-bold text-lg text-white flex items-center space-x-3 mx-auto"
              >
                <Plus className="w-6 h-6" />
                <span>Create Your First Poll</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {polls.map((poll, index) => (
                <div key={poll.id} className="glass-card rounded-3xl p-8 card-hover animate-slide-in-up" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-2xl font-bold text-white">{poll.title}</h3>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                          poll.isActive 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {poll.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </div>
                      </div>
                      <p className="text-white/80 text-lg mb-4">{poll.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="glass-button rounded-2xl p-4 text-center">
                          <p className="text-white/60 text-sm font-semibold uppercase tracking-wider">Poll ID</p>
                          <p className="text-white font-mono text-xl font-bold">{poll.id}</p>
                        </div>
                        <div className="glass-button rounded-2xl p-4 text-center">
                          <p className="text-white/60 text-sm font-semibold uppercase tracking-wider">Options</p>
                          <p className="text-white text-xl font-bold">{poll.options.length}</p>
                        </div>
                        <div className="glass-button rounded-2xl p-4 text-center">
                          <p className="text-white/60 text-sm font-semibold uppercase tracking-wider">Total Votes</p>
                          <p className="text-white text-xl font-bold">{getTotalVotes(poll)}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => viewResults(poll)}
                            className="btn-primary px-6 py-3 rounded-2xl font-bold text-white flex items-center space-x-2"
                          >
                            <Eye className="w-5 h-5" />
                            <span>View Results</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <button
                      onClick={() => viewResults(poll)}
                      className="btn-primary px-6 py-3 rounded-2xl font-bold text-white flex items-center space-x-2"
                    >
                      <Eye className="w-5 h-5" />
                      <span>View Results</span>
                    </button>
                    <button
                      onClick={() => handlePublishResults(poll.id)}
                      className={`btn-success px-6 py-3 rounded-2xl font-bold text-white flex items-center space-x-2 ${poll.resultsPublished ? 'bg-green-600' : ''}`}
                    >
                      {poll.resultsPublished ? 'Unpublish Results' : 'Publish Results'}
                    </button>
                    <button
                      onClick={() => handleDeletePoll(poll.id)}
                      className="btn-danger px-6 py-3 rounded-2xl font-bold text-white flex items-center space-x-2"
                    >
                      <span>Delete Poll</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;