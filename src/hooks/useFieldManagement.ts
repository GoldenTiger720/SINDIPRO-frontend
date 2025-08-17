import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStoredToken } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Types for material request data
export interface MaterialRequestItem {
  productType: string;
  quantity: number;
  observations: string;
}

export interface MaterialRequestData {
  title: string;
  building_id: number;
  caretaker: string;
  items: MaterialRequestItem[];
}

export interface MaterialRequestResponse {
  id: number;
  title: string;
  building_id: number;
  building_name: string;
  caretaker: string;
  items: MaterialRequestItem[];
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface MaterialRequestListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MaterialRequestResponse[];
}

// Types for technical call data
export interface TechnicalCallData {
  title: string;
  description: string;
  photos: string[];
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  companyEmail?: string;
}

export interface TechnicalCallResponse {
  id: number;
  title: string;
  description: string;
  photos: string[];
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  created_by: string;
  assigned_to?: string;
  resolved_at?: string;
  company_email?: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sindipro-backend.onrender.com';

// API function to fetch material requests
const fetchMaterialRequests = async (): Promise<MaterialRequestResponse[]> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/field/requests/`;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API function to save material request
const saveMaterialRequest = async (requestData: MaterialRequestData): Promise<MaterialRequestResponse> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/field/requests/`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestData),
  };

  // Debug logging
  console.log('Material Request API Request:', {
    url,
    method: requestOptions.method,
    headers: requestOptions.headers,
    bodyData: requestData,
    hasBody: !!requestOptions.body
  });

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// React Query hook for saving material request
export const useSaveMaterialRequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveMaterialRequest,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Material request saved successfully",
      });
      // Invalidate and refetch any related queries if needed
      queryClient.invalidateQueries({ queryKey: ['material-requests'] });
    },
    onError: (error: Error) => {
      console.error('Error saving material request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save material request. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// React Query hook for fetching material requests
export const useMaterialRequests = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['material-requests'],
    queryFn: fetchMaterialRequests,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error: Error) => {
      console.error('Error fetching material requests:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch material requests. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// API function to save technical call
const saveTechnicalCall = async (callData: TechnicalCallData): Promise<TechnicalCallResponse> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/field/technical/`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: callData.title,
      description: callData.description,
      photos: callData.photos,
      location: callData.location,
      priority: callData.priority,
      company_email: callData.companyEmail || null,
    }),
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// React Query hook for saving technical call
export const useSaveTechnicalCall = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTechnicalCall,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Technical call created successfully",
      });
      // Invalidate and refetch any related queries if needed
      queryClient.invalidateQueries({ queryKey: ['technical-calls'] });
    },
    onError: (error: Error) => {
      console.error('Error saving technical call:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save technical call. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// API function to fetch technical calls
const fetchTechnicalCalls = async (): Promise<TechnicalCallResponse[]> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/field/technical/`;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// React Query hook for fetching technical calls
export const useTechnicalCalls = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['technical-calls'],
    queryFn: fetchTechnicalCalls,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error: Error) => {
      console.error('Error fetching technical calls:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch technical calls. Please try again.",
        variant: "destructive",
      });
    },
  });
};