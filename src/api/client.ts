import { useAuthStore } from '../store/useAuthStore';
import { getClientMeta } from '../utils/telemetry';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Custom fetch wrapper that automatically handles:
 * - Injecting the Bearer accessToken
 * - Catching 401 Unauthorized errors
 * - Automatically calling /api/auth/refresh to get a new token
 * - Retrying the original request
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  let token = useAuthStore.getState().accessToken;

  let headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Intercept 401 errors
  if (response.status === 401) {
    console.log('Access token expired or invalid. Attempting to refresh...');
    const refreshToken = useAuthStore.getState().refreshToken;
    
    if (!refreshToken) {
      // Force logout if we don't have a refresh token
      await useAuthStore.getState().logout();
      return response;
    }

    try {
      const meta = await getClientMeta();
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken, ...meta }),
      });

      if (!refreshRes.ok) {
        throw new Error('Refresh token rejected');
      }

      const data = await refreshRes.json();
      
      // Save new tokens directly to store
      await useAuthStore.getState().setTokens(data.accessToken, data.refreshToken || refreshToken);
      
      // Retry original request with new token
      headers.set('Authorization', `Bearer ${data.accessToken}`);
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

    } catch (e) {
      console.error('Session expired entirely. Logging out.', e);
      await useAuthStore.getState().logout();
    }
  }

  return response;
};

const api = {
  get: (endpoint: string, options: RequestInit = {}) => 
    apiFetch(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint: string, body: any, options: RequestInit = {}) => 
    apiFetch(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(body) 
    }),
  
  put: (endpoint: string, body: any, options: RequestInit = {}) => 
    apiFetch(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(body) 
    }),
  
  delete: (endpoint: string, options: RequestInit = {}) => 
    apiFetch(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
