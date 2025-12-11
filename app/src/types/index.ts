export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  affix?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface Scan {
  id: string;
  userId?: string;
  guestId?: string;
  timestamp: string;
  location: string;
  status: 'success' | 'failed';
}

export interface Guest {
  id: string;
  name: string;
  accessCode?: string;
  validUntil?: string;
  createdAt: string;
}

export interface Druppel {
  id: string;
  code: string;
  userId?: string;
  isActive: boolean;
  lastUsed?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
