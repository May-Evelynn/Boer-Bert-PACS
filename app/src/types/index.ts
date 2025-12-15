export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name?: string;
  affix: string;
  role: string;
  is_first_login: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface Scan {
  id: number;
  keyfob_id: number;
  facility_id: number;
  timestamp: number;
  in_out: 'in' | 'out';
  location?: string;
  time?: string;
  tagId?: string;
}

export interface Guest {
  id: string;
  name: string;
  accessCode?: string;
  validUntil?: string;
  createdAt: string;
}

export interface Keyfob {
  keyfob_id: number;
  keyfob_key: number;
  attached_user_id?: number;
  kapot: boolean;
  druppelId?: number;
  druppelCode?: string;
  firstName?: string;
  lastName?: string;
  affix?: string;
  role?: string;
}

export interface Facility {
  facility_id: number;
  facility_type: string;
  capacity: number;
  active: boolean;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  affix: string;
  email: string;
  username: string;
  role: string;
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

export interface ScansResponse {
  scans: Scan[];
}

export interface KeyfobsResponse {
  keyfobs: Keyfob[];
}

export interface FacilitiesResponse {
  facilities: Facility[];
}
