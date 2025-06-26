import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Sparkles, Target, Zap } from 'lucide-react';
import { User, Poll, PollOption } from '../types';
import { config } from '../config';

interface CreatePollProps {
  user: User;
  onPollCreated: (poll: Poll) => void;
  onBack: () => void;
}

const CreatePoll: React.FC<CreatePollProps> = ({ user, onPollCreated, onBack }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isLoading, setIsLoading] = useState(false);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return;
    }
    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      return;
    }
    setIsLoading(true);
    try {
      const pollOptions: PollOption[] = validOptions.map((option, index) => ({
        id: `option_${Date.now()}_${index}`,
        text: option.trim(),
        votes: 0
      }));
      // Do NOT include id here, let backend generate it
      const newPoll = {
        title: title.trim(),
        description: description.trim(),
        options: pollOptions,
        userId: user.id, // Pass userId for createdBy
        username: user.username // Pass username for createdByUsername
      };
      // Send poll to backend
      const response = await fetch('https://vote-9nmi.onrender.com/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPoll)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create poll');
      }
      const createdPoll = await response.json();
      onPollCreated(createdPoll);
    } catch (error) {
      console.error('Error creating poll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="glass-card rounded-3xl p-10 shadow-2xl animate-slide-in-up">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-6">
            <button
              onClick={onBack}
              className="glass-button p-4 rounded-2xl text-white hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Create New Poll</h1>
                <p className="text-white/80 text-lg">Design your perfect voting experience</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Poll Details Section */}
          <div className="glass-card rounded-3xl p-8 space-y-8">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Poll Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-white font-bold text-lg">Poll Title</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging poll title..."
                    className="input-glass w-full px-6 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 text-lg"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-white font-bold text-lg">Description</label>
                <div className="relative group">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this poll is about..."
                    rows={4}
                    className="input-glass w-full px-6 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 resize-none text-lg"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Poll Options Section */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Poll Options</h2>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                  {options.filter(opt => opt.trim()).length} options
                </span>
              </div>
              <button
                type="button"
                onClick={addOption}
                disabled={options.length >= 10}
                className="btn-success px-6 py-3 rounded-2xl font-bold text-white flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                <span>Add Option</span>
              </button>
            </div>

            <div className="grid gap-6">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-4 animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center font-bold text-white text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Enter option ${index + 1}...`}
                      className="input-glass w-full px-6 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 text-lg"
                      required
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="btn-danger p-3 rounded-2xl text-white hover:scale-105 transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <div className="mt-6 text-center">
                <p className="text-white/60">You can add up to {10 - options.length} more options</p>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !description.trim() || options.filter(opt => opt.trim()).length < 2}
              className="btn-primary px-12 py-4 rounded-2xl font-bold text-xl text-white flex items-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span>Creating Poll...</span>
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  <span>Create Poll</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;