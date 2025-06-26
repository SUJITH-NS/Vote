import React, { useState } from 'react';
  import { User, Poll } from '../types';
  import { LogOut, Search, Zap, Target, Star, Trophy } from 'lucide-react';
  import JoinPoll from './JoinPoll';
  import { storage } from '../utils/storage';
  import { config } from '../config';

  interface UserDashboardProps {
    user: User;
    onLogout: () => void;
  }

  const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
    const [pollId, setPollId] = useState('');
    const [selectedView, setSelectedView] = useState<'search' | 'poll'>('search');
    const [attendedPolls, setAttendedPolls] = useState<Poll[]>([]);
    const [viewResultPoll, setViewResultPoll] = useState<Poll | null>(null);

    React.useEffect(() => {
      // Fetch attended polls from backend
      const fetchAttendedPolls = async () => {
        try {
          const response = await fetch(`${config.apiUrl}/attended-polls/${user.id}`);
          if (response.ok) {
            const polls = await response.json();
            setAttendedPolls(polls);
          } else {
            setAttendedPolls([]);
          }
        } catch {
          setAttendedPolls([]);
        }
      };
      fetchAttendedPolls();
    }, [user.id]);

    const handleJoinPoll = () => {
      if (pollId.trim()) {
        setSelectedView('poll');
      }
    };

    if (selectedView === 'poll') {
      return (
        <div className="min-h-screen p-4">
          <JoinPoll 
            pollId={pollId}
            user={user}
            onBack={() => setSelectedView('search')}
          />
        </div>
      );
    }

    if (viewResultPoll) {
      return (
        <div className="min-h-screen p-4">
          <JoinPoll 
            pollId={viewResultPoll.id}
            user={user}
            onBack={() => setViewResultPoll(null)}
          />
        </div>
      );
    }
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-5xl mx-auto stagger-animation">
          {/* Enhanced Header */}
          <div className="glass-card rounded-3xl p-8 mb-8 shadow-2xl card-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <Zap className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text mb-2">Welcome, {user.username}!</h1>
                  <p className="text-white/80 text-lg">Ready to make your voice heard?</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-medium">Voter Status: Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="glass-button px-6 py-4 rounded-2xl text-white hover:text-red-300 transition-all duration-300 flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Enhanced Join Poll Section */}
          <div className="glass-card rounded-3xl p-10 shadow-2xl animate-slide-in-up">
            <div className="text-center mb-10">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-6">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <Target className="absolute -top-3 -right-3 w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold gradient-text mb-4">Join a Poll</h2>
              <p className="text-white/80 text-xl max-w-2xl mx-auto">Enter the unique Poll ID provided by the admin to participate in the voting session</p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-6"></div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-focus-within:blur-2xl transition-all duration-300"></div>
                <input
                  type="text"
                  value={pollId}
                  onChange={(e) => setPollId(e.target.value.toUpperCase())}
                  placeholder="Enter Poll ID (e.g., ABC123XYZ)"
                  className="relative input-glass w-full px-8 py-6 rounded-3xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 text-center text-2xl font-mono tracking-widest font-bold"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <button
                onClick={handleJoinPoll}
                disabled={!pollId.trim()}
                className="btn-primary w-full py-6 rounded-3xl font-bold text-2xl text-white flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Target className="w-8 h-8" />
                <span>Join Poll</span>
              </button>
            </div>
          </div>

          {/* Always show attended polls section, even if empty */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">Attended Polls</h2>
            <div className="grid gap-6">
              {attendedPolls.length === 0 ? (
                <div className="glass-card rounded-2xl p-6 text-center text-white/70 text-lg">
                  No attended polls yet.
                </div>
              ) : (
                attendedPolls.map((poll) => (
                  <div key={poll.id} className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-lg">{poll.title}</div>
                      <div className="text-white/60 text-sm mb-2">Poll ID: {poll.id}</div>
                      <div className="text-white/70 text-sm mb-1 font-semibold">Options:</div>
                      <ul className="text-white/80 text-sm list-disc ml-5 mb-2">
                        {poll.options && poll.options.length > 0 ? poll.options.map((opt: any, idx: number) => (
                          <li key={opt.id || idx}>{opt.text}</li>
                        )) : <li>No options found</li>}
                      </ul>
                    </div>
                    <button
                      className={`btn-primary px-6 py-3 rounded-2xl font-bold text-white flex items-center space-x-2 mt-4 md:mt-0 ${!poll.resultsPublished ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => poll.resultsPublished && setViewResultPoll(poll)}
                      disabled={!poll.resultsPublished}
                    >
                      <Target className="w-5 h-5" />
                      <span>View Poll Result</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default UserDashboard;