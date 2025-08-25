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
    role?: string;
    building_id?: number;
    building_name?: string;
  };
}

export interface RegisterResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    username?: string;
    role?: string;
    building_id?: number;
    building_name?: string;
  };
}

export interface RefreshResponse {
  access: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  building_id?: number;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  building_id?: number;
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

// Check if user has a specific role
export const hasRole = (requiredRole: string): boolean => {
  const user = getStoredUser();
  return user?.role === requiredRole;
};

// Check if user is master role
export const isMasterUser = (): boolean => {
  return hasRole('master');
};

// Check if user is manager role
export const isManagerUser = (): boolean => {
  return hasRole('manager');
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
    
    // Handle backend error format: { errors: { field: "message" } }
    if (errorData.errors && typeof errorData.errors === 'object') {
      const errorMessages = Object.values(errorData.errors).join(', ');
      throw new Error(errorMessages);
    }
    
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
    // If user selected a building, fetch building name and add it to user data
    if (credentials.building_id && response.user) {
      try {
        const buildings = await fetchBuildings();
        const selectedBuilding = buildings.find(b => b.id === credentials.building_id);
        if (selectedBuilding) {
          response.user.building_id = selectedBuilding.id;
          response.user.building_name = selectedBuilding.building_name;
        }
      } catch (error) {
        console.warn('Failed to fetch building name:', error);
      }
    }
    
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
    // If user selected a building, fetch building name and add it to user data
    if (credentials.building_id && response.user) {
      try {
        const buildings = await fetchBuildings();
        const selectedBuilding = buildings.find(b => b.id === credentials.building_id);
        if (selectedBuilding) {
          response.user.building_id = selectedBuilding.id;
          response.user.building_name = selectedBuilding.building_name;
        }
      } catch (error) {
        console.warn('Failed to fetch building name:', error);
      }
    }
    
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

// Types for users API response
interface UsersApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone: string;
    is_active_user: boolean;
    date_joined: string;
  }[];
}

// Building/Condominium interface
export interface Building {
  id: number;
  building_name: string;
}

// Fetch users from backend
export const fetchUsers = async () => {
  const response: UsersApiResponse = await makeAuthRequest('/api/auth/users/');
  return response.results;
};

// Fetch buildings/condominiums from backend
export const fetchBuildings = async (): Promise<Building[]> => {
  const response = await fetch(`${API_BASE_URL}/api/buildings/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Financial API functions
export const createFinancialAccount = async (accountData: {
  code: string;
  name: string;
  type: 'main' | 'sub';
  expectedAmount: number;
  actualAmount: number;
  parentId: number | null;
  building_id: number;
}) => {
  return await makeAuthRequest('/api/financial/account/', {
    method: 'POST',
    body: JSON.stringify(accountData),
  });
};

export const getFinancialAccounts = async (buildingId?: number) => {
  const endpoint = buildingId 
    ? `/api/financial/account/?building_id=${buildingId}`
    : '/api/financial/account/';
  
  return await makeAuthRequest(endpoint, {
    method: 'GET',
  });
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