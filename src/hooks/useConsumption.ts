import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeAuthenticatedRequest } from '@/lib/api-utils';
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
  utility_type: string;
  gas_category?: string | null;
  date: string;
  value: string;
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

// API function to register daily consumption (building-specific)
const registerDailyConsumption = async (consumptionData: DailyConsumptionData): Promise<ConsumptionResponse> => {
  // Debug logging
  console.log('Daily Consumption API Request:', {
    endpoint: '/api/consumption/register/',
    method: 'POST',
    bodyData: consumptionData,
  });

  return await makeAuthenticatedRequest('/api/consumption/register/', {
    method: 'POST',
    body: JSON.stringify(consumptionData),
  });
};

// API function to register monthly bill (building-specific)
const registerMonthlyBill = async (billData: MonthlyBillData): Promise<BillResponse> => {
  // Debug logging
  console.log('Monthly Bill API Request:', {
    endpoint: '/api/consumption/account/',
    method: 'POST',
    bodyData: billData,
  });

  return await makeAuthenticatedRequest('/api/consumption/account/', {
    method: 'POST',
    body: JSON.stringify(billData),
  });
};

// API function to fetch consumption data (building-specific)
const fetchConsumptionData = async (): Promise<ConsumptionResponse[]> => {
  console.log('Fetch Consumption Data API Request:', {
    endpoint: '/api/consumption/register',
    method: 'GET',
  });

  return await makeAuthenticatedRequest('/api/consumption/register');
};

// API function to fetch account/bills data (building-specific)
const fetchAccountData = async (): Promise<BillResponse[]> => {
  console.log('Fetch Account Data API Request:', {
    endpoint: '/api/consumption/account',
    method: 'GET',
  });

  return await makeAuthenticatedRequest('/api/consumption/account');
};

// React Query hook for registering daily consumption
export const useRegisterDailyConsumption = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerDailyConsumption,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Daily consumption registered successfully",
      });
      // Invalidate and refetch consumption data
      queryClient.invalidateQueries({ queryKey: ['consumption-data'] });
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

// React Query hook for fetching consumption data
export const useGetConsumptionData = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['consumption-data'],
    queryFn: fetchConsumptionData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error: Error) => {
      console.error('Error fetching consumption data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch consumption data. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// React Query hook for fetching account/bills data
export const useGetAccountData = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['account-data'],
    queryFn: fetchAccountData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error: Error) => {
      console.error('Error fetching account data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch account data. Please try again.",
        variant: "destructive",
      });
    },
  });
};