export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  resultsPublished: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Vote {
  id: string;
  pollId: string;
  userId: string;
  optionId: string;
  timestamp: Date;
}