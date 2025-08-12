import { useMutation } from '@tanstack/react-query';
import { getStoredToken } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Types for consumption data
export interface DailyConsumptionData {
  utilityType: 'water' | 'electricity' | 'gas';
  gasCategory?: 'units' | 'common' | 'generator';
  date: string;
  value: number;
}

export interface MonthlyBillData {
  utilityType: 'water' | 'electricity' | 'gas';
  month: string;
  amount: number;
  paymentDate: string;
}

export interface ConsumptionResponse {
  id: number;
  utilityType: string;
  gasCategory?: string;
  date: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export interface BillResponse {
  id: number;
  utilityType: string;
  month: string;
  amount: number;
  paymentDate: string;
  isPaid: boolean;
  created_at: string;
  updated_at: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sindipro-backend.onrender.com';

// API function to register daily consumption
const registerDailyConsumption = async (consumptionData: DailyConsumptionData): Promise<ConsumptionResponse> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/consumption/register/`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(consumptionData),
  };

  // Debug logging
  console.log('Daily Consumption API Request:', {
    url,
    method: requestOptions.method,
    headers: requestOptions.headers,
    bodyData: consumptionData,
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

// API function to register monthly bill
const registerMonthlyBill = async (billData: MonthlyBillData): Promise<BillResponse> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/consumption/account/`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(billData),
    redirect: 'manual' // Prevent automatic redirect following
  };

  // Debug logging
  console.log('Monthly Bill API Request:', {
    url,
    method: requestOptions.method,
    headers: requestOptions.headers,
    bodyData: billData,
    hasBody: !!requestOptions.body,
    redirectHandling: 'manual'
  });

  const response = await fetch(url, requestOptions);

  // Debug response details
  console.log('Monthly Bill API Response:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    redirected: response.redirected,
    url: response.url,
    type: response.type
  });

  // Handle redirect responses manually
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('Location');
    console.log('Redirect detected:', {
      status: response.status,
      location: location,
      originalUrl: url
    });
    throw new Error(`Server redirect detected (${response.status}). This suggests a URL mismatch. Expected URL: ${url}`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// React Query hook for registering daily consumption
export const useRegisterDailyConsumption = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: registerDailyConsumption,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Daily consumption registered successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error registering consumption:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register daily consumption. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// React Query hook for registering monthly bill
export const useRegisterMonthlyBill = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: registerMonthlyBill,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Monthly bill registered successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error registering monthly bill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register monthly bill. Please try again.",
        variant: "destructive",
      });
    },
  });
};