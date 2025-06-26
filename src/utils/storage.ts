// Define User type locally if not exported from '../types'
type User = {
  id: string;
  email: string;
  // Add other fields as needed
};

// Define Vote type locally if not exported from '../types'
type Vote = {
  id: string;
  pollId: string;
  userId: string;
  // Add other fields as needed
};

import { Poll } from '../types';
// If 'User' and 'Vote' types exist, export them from '../types' and add them back here.
// Otherwise, define them locally or import from the correct module.

const USERS_KEY = 'voting_app_users';
const POLLS_KEY = 'voting_app_polls';
const VOTES_KEY = 'voting_app_votes';
const CURRENT_USER_KEY = 'voting_app_current_user';

export const storage = {
  // Users
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (user: User): void => {
    const users = storage.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUserByEmail: (email: string): User | null => {
    const users = storage.getUsers();
    return users.find(u => u.email === email) || null;
  },

  // Current User
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Polls
  getPolls: (): Poll[] => {
    const polls = localStorage.getItem(POLLS_KEY);
    return polls ? JSON.parse(polls) : [];
  },

  savePoll: (poll: Poll): void => {
    const polls = storage.getPolls();
    const existingIndex = polls.findIndex(p => p.id === poll.id);
    
    if (existingIndex >= 0) {
      polls[existingIndex] = poll;
    } else {
      polls.push(poll);
    }
    
    localStorage.setItem(POLLS_KEY, JSON.stringify(polls));
  },

  getPollById: (id: string): Poll | null => {
    const polls = storage.getPolls();
    return polls.find(p => p.id === id) || null;
  },

  deletePoll: (pollId: string) => {
    const polls = JSON.parse(localStorage.getItem('polls') || '[]');
    const updatedPolls = polls.filter((poll: any) => poll.id !== pollId);
    localStorage.setItem('polls', JSON.stringify(updatedPolls));
    // Optionally, remove votes for this poll
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    const updatedVotes = votes.filter((vote: any) => vote.pollId !== pollId);
    localStorage.setItem('votes', JSON.stringify(updatedVotes));
  },

  // Votes
  getVotes: (): Vote[] => {
    const votes = localStorage.getItem(VOTES_KEY);
    return votes ? JSON.parse(votes) : [];
  },

  saveVote: (vote: Vote): void => {
    const votes = storage.getVotes();
    votes.push(vote);
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  },

  getVotesByPoll: (pollId: string): Vote[] => {
    const votes = storage.getVotes();
    return votes.filter(v => v.pollId === pollId);
  },

  hasUserVoted: (pollId: string, userId: string): boolean => {
    const votes = storage.getVotes();
    return votes.some(v => v.pollId === pollId && v.userId === userId);
  },

  getVotesByUserId: (userId: string): Vote[] => {
    const votes = storage.getVotes();
    return votes.filter(vote => vote.userId === userId);
  }
};