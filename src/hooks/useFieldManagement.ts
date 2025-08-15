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