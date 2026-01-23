import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, DEFAULT_API_URLS } from '../types';

const API_URL_STORAGE_KEY = 'activeApiUrl';

const getStoredApiUrl = (): string => {
  const stored = localStorage.getItem(API_URL_STORAGE_KEY);
  if (stored) {
    return stored;
  }
  const activeUrl = DEFAULT_API_URLS.find(url => url.active) || DEFAULT_API_URLS[0];
  return activeUrl.value;
};

const api = axios.create({
  baseURL: getStoredApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setApiBaseUrl = (url: string): void => {
  api.defaults.baseURL = url;
  localStorage.setItem(API_URL_STORAGE_KEY, url);
};

export const getApiBaseUrl = (): string => {
  return api.defaults.baseURL || getStoredApiUrl();
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      const apiError: ApiError = {
        message: error.response.data?.message || 'An unexpected error occurred',
        status: error.response.status,
        errors: error.response.data?.errors,
      };
      return Promise.reject(apiError);
    }

    return Promise.reject({
      message: error.message || 'Network Error',
      status: 0,
    });
  }
);

export default api;
