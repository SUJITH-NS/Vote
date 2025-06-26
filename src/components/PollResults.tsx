import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, Users, TrendingUp, Trophy, Crown, Zap, Target } from 'lucide-react';
import { Poll, User } from '../types';

interface PollResultsProps {
  poll: Poll;
  onBack: () => void;
  showUserView?: boolean;
  currentUser?: User; // Add currentUser prop
}

const PollResults: React.FC<PollResultsProps> = ({ poll, onBack, showUserView = false, currentUser }) => {
  const [animatedVotes, setAnimatedVotes] = useState<{ [key: string]: number }>({});
  const [votes, setVotes] = useState<any[]>([]);
  const [loadingVotes, setLoadingVotes] = useState(true);
  const [optionVoteCounts, setOptionVoteCounts] = useState<{ [optionId: string]: number }>({});

  useEffect(() => {
    // Fetch votes for this poll from backend if currentUser is poll creator
    const fetchVotes = async () => {
      if (currentUser && poll.createdBy === currentUser.id) {
        setLoadingVotes(true);
        try {
          const response = await fetch(`http://localhost:4000/api/votes/poll/${poll.id}`);
          if (response.ok) {
            const data = await response.json();
            setVotes(data);
          } else {
            setVotes([]);
          }
        } catch {
          setVotes([]);
        }
        setLoadingVotes(false);
      }
    };
    fetchVotes();
  }, [poll, currentUser]);

  useEffect(() => {
    // Fetch votes for this poll from backend and count per option
    const fetchVotes = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/votes/poll/${poll.id}`);
        if (response.ok) {
          const votes = await response.json();
          const counts: { [optionId: string]: number } = {};
          poll.options.forEach(opt => { counts[opt.id] = 0; });
          votes.forEach((vote: any) => {
            if (vote.optionId && counts.hasOwnProperty(vote.optionId)) {
              counts[vote.optionId]++;
            }
          });
          setOptionVoteCounts(counts);
        } else {
          setOptionVoteCounts({});
        }
      } catch {
        setOptionVoteCounts({});
      }
    };
    fetchVotes();
  }, [poll]);

  useEffect(() => {
    // Animate vote counts
    poll.options.forEach((option, index) => {
      setTimeout(() => {
        setAnimatedVotes(prev => ({
          ...prev,
          [option.id]: option.votes
        }));
      }, index * 300);
    });
  }, [poll]);

  // If not poll creator, do not show results
  if (currentUser && poll.createdBy !== currentUser.id) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl p-10 shadow-2xl animate-slide-in-up">
          <h2 className="text-2xl font-bold text-white mb-4">You are not authorized to view these results.</h2>
          <button onClick={onBack} className="btn-primary mt-4">Back</button>
        </div>
      </div>
    );
  }

  // Calculate total votes and max votes using live optionVoteCounts
  const totalVotes = Object.values(optionVoteCounts).reduce((total, count) => total + count, 0);
  const getPercentage = (votes: number) => totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  const maxVotes = Math.max(...Object.values(optionVoteCounts), 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="glass-card rounded-3xl p-10 shadow-2xl animate-slide-in-up">
        {/* Enhanced Header */}
        <div className="flex items-center space-x-6 mb-10">
          <button
            onClick={onBack}
            className="glass-button p-4 rounded-2xl text-white hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <Zap className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">{poll.title}</h1>
              <p className="text-white/80 text-lg mt-2">{poll.description}</p>
            </div>
          </div>
          {showUserView && (
            <div className="glass-card border-green-400/50 bg-green-500/20 px-6 py-4 rounded-2xl animate-bounce-in">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-green-300" />
                <p className="text-green-300 font-bold text-lg">Vote Submitted Successfully!</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="glass-card rounded-3xl p-8 card-hover animate-slide-in-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Total Votes</p>
                <p className="text-4xl font-bold text-white animate-count-up">{totalVotes}</p>
                <p className="text-white/60 text-sm mt-1">Votes collected</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full animate-expand-bar" style={{ '--target-width': '100%' } as any}></div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 card-hover animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Options</p>
                <p className="text-4xl font-bold text-white animate-count-up">{poll.options.length}</p>
                <p className="text-white/60 text-sm mt-1">Available choices</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full animate-expand-bar" style={{ '--target-width': '85%' } as any}></div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 card-hover animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Leading Option</p>
                <p className="text-xl font-bold text-white truncate">
                  {poll.options.find(opt => opt.votes === maxVotes)?.text || 'N/A'}
                </p>
                <p className="text-white/60 text-sm mt-1">Current winner</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full animate-expand-bar" style={{ '--target-width': '95%' } as any}></div>
            </div>
          </div>
        </div>

        {/* Enhanced Results */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3 mb-8">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold gradient-text">Live Results</h2>
          </div>
          
          {poll.options
            .sort((a, b) => (optionVoteCounts[b.id] || 0) - (optionVoteCounts[a.id] || 0))
            .map((option, index) => {
              const votes = optionVoteCounts[option.id] || 0;
              const percentage = getPercentage(votes);
              const isWinning = votes === maxVotes && maxVotes > 0;
              
              return (
                <div 
                  key={option.id}
                  className={`glass-card rounded-3xl p-8 transition-all duration-500 card-hover animate-slide-in-up ${
                    isWinning 
                      ? 'border-yellow-400/50 bg-yellow-500/10 shadow-lg shadow-yellow-500/25' 
                      : 'border-white/20'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-xl ${
                        isWinning 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse-glow' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{option.text}</h3>
                        {isWinning && (
                          <div className="flex items-center space-x-2">
                            <Crown className="w-5 h-5 text-yellow-400" />
                            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/30">
                              🏆 Leading
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-white animate-count-up">{votes}</p>
                      <p className="text-white/70 text-lg font-semibold">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white/10 rounded-full h-6 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-2000 ease-out animate-expand-bar ${
                          isWinning 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500'
                        }`}
                        style={{ 
                          '--target-width': `${percentage}%`,
                          animationDelay: `${index * 300}ms`
                        } as any}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {totalVotes === 0 && (
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-pulse-glow"></div>
              <BarChart3 className="w-16 h-16 text-white/40" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No votes yet</h3>
            <p className="text-white/60 text-xl">Be the first to cast your vote!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollResults;