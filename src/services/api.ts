import { envConfig } from '@/lib/envConfig';
import axios, { type InternalAxiosRequestConfig } from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: envConfig.apiBaseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for the getToken function from Clerk
let getTokenFn: (() => Promise<string | null>) | null = null;

/**
 * Set the getToken function from Clerk
 * This should be called once when the app initializes
 */
export const setAuthTokenGetter = (fn: () => Promise<string | null>) => {
  getTokenFn = fn;
};

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Try to get token from Clerk first
    if (getTokenFn) {
      try {
        const token = await getTokenFn();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        }
      } catch (error) {
        console.warn('Failed to get Clerk token:', error);
      }
    }

    // Fallback: Try localStorage token (for backward compatibility)
    const localToken = localStorage.getItem('token');
    if (localToken) {
      config.headers.Authorization = `Bearer ${localToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to sign-in
      localStorage.removeItem('token');

      // Check if we're in admin route
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      const redirectPath = isAdminRoute ? '/admin/sign-in' : '/sign-in';

      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('sign-in')) {
        window.location.href = redirectPath;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
