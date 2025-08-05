// Auth API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sindipro-backend.onrender.com';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'localhost:8000';

// Types for auth responses
export interface LoginResponse {
  access: string;
  refresh: string;
  user?: {
    id: number;
    email: string;
    username?: string;
  };
}

export interface RegisterResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    username?: string;
  };
}

export interface RefreshResponse {
  access: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Token management
export const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  USER: 'user_data'
} as const;

export const getStoredToken = (type: 'access' | 'refresh'): string | null => {
  return localStorage.getItem(type === 'access' ? TOKEN_KEYS.ACCESS : TOKEN_KEYS.REFRESH);
};

export const setTokens = (tokens: { access: string; refresh: string; user?: object }) => {
  localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.access);
  localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refresh);
  if (tokens.user) {
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(tokens.user));
  }
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
  localStorage.removeItem(TOKEN_KEYS.USER);
};

export const getStoredUser = () => {
  const userData = localStorage.getItem(TOKEN_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const accessToken = getStoredToken('access');
  const refreshToken = getStoredToken('refresh');
  return !!(accessToken && refreshToken);
};

// API request helper with auth headers
const makeAuthRequest = async (url: string, options: RequestInit = {}) => {
  const accessToken = getStoredToken('access');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Auth API functions
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await makeAuthRequest('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  if (response.access && response.refresh) {
    setTokens(response);
  }
  
  return response;
};

export const registerUser = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const response = await makeAuthRequest('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  if (response.access && response.refresh) {
    setTokens(response);
  }
  return response;
};

export const refreshToken = async (): Promise<string> => {
  const refreshTokenValue = getStoredToken('refresh');
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }
  
  const response = await makeAuthRequest('/api/auth/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshTokenValue }),
  });
  
  if (response.access) {
    localStorage.setItem(TOKEN_KEYS.ACCESS, response.access);
  }
  
  return response.access;
};

export const logoutUser = () => {
  clearTokens();
  // Redirect to login page will be handled by the calling component
};

// Auto-refresh token when it's about to expire
export const setupTokenRefresh = () => {
  const accessToken = getStoredToken('access');
  if (!accessToken) return;

  try {
    // Decode JWT to get expiration time (simple base64 decode)
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    
    // Refresh token 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
    
    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          await refreshToken();
          setupTokenRefresh(); // Setup next refresh
        } catch (error) {
          console.error('Failed to refresh token:', error);
          logoutUser();
          window.location.href = '/login';
        }
      }, refreshTime);
    }
  } catch (error) {
    console.error('Error setting up token refresh:', error);
  }
};