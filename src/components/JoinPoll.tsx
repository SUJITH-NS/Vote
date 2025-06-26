import React, { useState, useEffect } from 'react';
import { ArrowLeft, Vote, Target, Zap, Trophy } from 'lucide-react';
import { Poll, User, Vote as VoteType } from '../types';
import { storage } from '../utils/storage';
import PollResults from './PollResults';

interface JoinPollProps {
  pollId: string;
  user: User;
  onBack: () => void;
}

const JoinPoll: React.FC<JoinPollProps> = ({ pollId, user, onBack }) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPoll();
    // eslint-disable-next-line
  }, [pollId]);

  const loadPoll = async () => {
    setError('');
    setPoll(null);
    setHasVoted(false);
    try {
      const response = await fetch(`http://localhost:4000/api/polls/${pollId}`);
      if (!response.ok) {
        setError('Poll not found. Please check the Poll ID and try again.');
        return;
      }
      const foundPoll = await response.json();
      if (!foundPoll.isActive) {
        setError('This poll is no longer active and not accepting votes.');
        return;
      }
      setPoll(foundPoll);
      // Check if user has already voted (fetch from backend)
      const voteRes = await fetch(`http://localhost:4000/api/votes/poll/${pollId}`);
      if (voteRes.ok) {
        const votes = await voteRes.json();
        const userHasVoted = votes.some((v: any) => v.userId === user.id);
        setHasVoted(userHasVoted);
      }
    } catch (err) {
      setError('Poll not found. Please check the Poll ID and try again.');
    }
  };

  const handleVote = async () => {
    if (!selectedOption || !poll) return;
    setIsVoting(true);
    setError('');
    try {
      // Send vote to backend
      const response = await fetch('http://localhost:4000/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: poll.id,
          userId: user.id,
          optionId: selectedOption
        })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit vote');
      }
      // Optionally, you can update UI or reload poll data here
      setHasVoted(true);
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-10 shadow-2xl animate-bounce-in">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={onBack}
              className="glass-button p-4 rounded-2xl text-white hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">Poll Not Found</h1>
          </div>
          
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
              <Target className="w-12 h-12 text-red-300" />
            </div>
            <div className="glass-card border-red-400/50 bg-red-500/20 rounded-3xl p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-red-200 mb-4">Oops! Something went wrong</h3>
              <p className="text-red-200 text-lg">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-10 shadow-2xl">
          <div className="text-center py-16">
            <div className="loading-dots text-white text-2xl mb-8">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="text-white/70 text-xl">Loading poll...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    if (poll.resultsPublished) {
      return (
        <PollResults 
          poll={poll}
          onBack={onBack}
          showUserView={true}
        />
      );
    } else {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-10 shadow-2xl animate-slide-in-up">
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={onBack}
                className="glass-button p-4 rounded-2xl text-white hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold text-white">Results Coming Soon</h1>
            </div>
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
                <Trophy className="w-12 h-12 text-yellow-300" />
              </div>
              <div className="glass-card border-yellow-400/50 bg-yellow-500/20 rounded-3xl p-8 max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-yellow-200 mb-4">Thank you for voting!</h3>
                <p className="text-yellow-200 text-lg">Results will be published soon by the admin. Please check back later.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
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
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                <Vote className="w-8 h-8 text-white" />
              </div>
              <Zap className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">{poll.title}</h1>
              <p className="text-white/80 text-lg mt-2">{poll.description}</p>
              <div className="flex items-center mt-3 space-x-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-sm font-medium">Poll ID: {poll.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Section */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-8">
            <Target className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Choose your option:</h2>
          </div>
          
          <div className="grid gap-6">
            {poll.options.map((option, index) => (
              <label
                key={option.id}
                className={`block glass-card p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 card-hover animate-slide-in-up ${
                  selectedOption === option.id
                    ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/25 scale-105'
                    : 'border-white/20 hover:border-blue-300/50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-6">
                  <input
                    type="radio"
                    name="poll-option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full border-3 flex items-center justify-center transition-all duration-300 ${
                      selectedOption === option.id
                        ? 'border-blue-400 bg-blue-500'
                        : 'border-white/40'
                    }`}>
                      {selectedOption === option.id && (
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce-in"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white text-xl font-semibold">{option.text}</span>
                  </div>
                  <div className="flex-shrink-0 text-2xl font-bold text-white/60">
                    {String.fromCharCode(65 + index)}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleVote}
            disabled={!selectedOption || isVoting}
            className="btn-success px-12 py-6 rounded-3xl font-bold text-2xl text-white flex items-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isVoting ? (
              <>
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span>Submitting Vote...</span>
              </>
            ) : (
              <>
                <Vote className="w-8 h-8" />
                <span>Submit Vote</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinPoll;