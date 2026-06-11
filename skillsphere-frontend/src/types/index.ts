export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  skills: Skill[];
  experience: 'Student' | 'Junior' | 'Mid-level' | 'Senior' | 'Lead' | 'Expert';
  lookingFor: string[];
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

export interface Match {
  _id: string;
  user: User;
  lastMessage?: Message;
  lastMessageAt?: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  match: string;
  sender: User;
  content: string;
  type: 'text' | 'image';
  read: boolean;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'match' | 'message' | 'friend_request' | 'friend_accept';
  from: User;
  data: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface FriendRequest {
  _id: string;
  from: User;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface SwipeResult {
  matched: boolean;
  matchId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
