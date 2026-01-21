import { createContext, useContext } from "react";

export interface User {
  id: number;
  user_id: number;
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
  buitengebruik: boolean;
  druppelId?: number;
  druppelCode?: string;
  firstName?: string;
  lastName?: string;
  affix?: string;
  role?: string;
}

export interface Facility {
  facilities_id: number;
  facility_type: string;
  capacity: number;
  broken: boolean;
  active: boolean;
}

export interface WeatherData {
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    apparent_temperature: number;
    precipitation: number;
    snowfall: number;
    showers: number;
    rain: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    is_day: number;
  };
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

export interface ApiUrl {
  value: string;
  label: string;
  isOnline: boolean;
  active: boolean;
}

export interface DataContextType {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // API URLs state
  apiUrls: ApiUrl[];
  setApiUrls: (urls: ApiUrl[]) => void;
  activeApiUrl: string;
  setActiveApiUrl: (url: string) => void;

  // Scans state
  scans: Scan[];
  setScans: (scans: Scan[]) => void;

  // Facilities state
  facilities: Facility[];
  setFacilities: (facilities: Facility[]) => void;

  // Keyfobs state
  keyfobs: Keyfob[];
  setKeyfobs: (keyfobs: Keyfob[]) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const DEFAULT_API_URLS: ApiUrl[] = [
  { value: 'http://localhost:3000/api', label: 'localhost:3000', isOnline: false, active: true },
  { value: 'https://boerbert.spoekle.com/api', label: 'boerbert.spoekle.com', isOnline: false, active: false },
];

export const DataContext = createContext<DataContextType>({
  user: null,
  setUser: () => { },
  apiUrls: DEFAULT_API_URLS,
  setApiUrls: () => { },
  activeApiUrl: DEFAULT_API_URLS[0].value,
  setActiveApiUrl: () => { },
  scans: [],
  setScans: () => { },
  facilities: [],
  setFacilities: () => { },
  keyfobs: [],
  setKeyfobs: () => { },
  isLoading: false,
  setIsLoading: () => { },
});

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataContext.Provider');
  }
  return context;
};