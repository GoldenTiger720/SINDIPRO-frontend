import { getStoredUser, getStoredToken } from './auth';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sindipro-backend.onrender.com';

// Helper function to make authenticated requests with building filtering
export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const accessToken = getStoredToken('access');
  const user = getStoredUser();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  };

  // If user has a selected building, add building_id to query params for GET requests
  // or to the request body for POST/PUT requests
  if (user?.building_id && url.startsWith('/api/')) {
    const buildingId = user.building_id;
    
    if (options.method === 'GET' || !options.method) {
      // Add building_id to query parameters
      const urlObj = new URL(`${API_BASE_URL}${url}`);
      urlObj.searchParams.set('building_id', buildingId.toString());
      url = urlObj.pathname + urlObj.search;
    } else if (options.method === 'POST' || options.method === 'PUT') {
      // Add building_id to request body
      if (options.body) {
        try {
          const bodyData = JSON.parse(options.body as string);
          bodyData.building_id = buildingId;
          config.body = JSON.stringify(bodyData);
        } catch (error) {
          // If body is not JSON, keep original body
          console.warn('Could not parse request body as JSON:', error);
        }
      } else {
        config.body = JSON.stringify({ building_id: buildingId });
      }
    }
  }

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

// Get the current user's building ID
export const getCurrentBuildingId = (): number | null => {
  const user = getStoredUser();
  return user?.building_id || null;
};

// Check if user has building access
export const hasBuildingAccess = (): boolean => {
  return getCurrentBuildingId() !== null;
};