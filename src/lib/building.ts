// Building API Service
// Professional service for handling building-related backend operations

import { getStoredToken } from './auth';

// TypeScript interfaces for type safety
export interface Address {
  street: string;
  number: string;
  cep: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface TowerConfig {
  name: string;
  units: number;
}

export interface UnitDistribution {
  residential?: number;
  commercial?: number;
  studio?: number;
  nonResidential?: number;
  wave?: number;
}

export interface BuildingData {
  buildingName: string;
  cnpj: string;
  buildingType: 'residential' | 'commercial' | 'mixed';
  totalUnits?: number;
  numberOfTowers?: number;
  apartmentsPerTower?: number;
  unitsPerTower?: number;
  residentialUnits?: number;
  commercialUnits?: number;
  studioUnits?: number;
  nonResidentialUnits?: number;
  waveUnits?: number;
  towerNames: string[];
  unitsPerTowerArray: number[];
  towerUnitDistribution?: Array<{
    residential: number;
    commercial: number;
    studio: number;
    nonResidential: number;
    wave: number;
  }>;
  managerName: string;
  managerPhone: string;
  managerPhoneType: 'mobile' | 'landline';
  address: Address;
  alternativeAddress?: Address;
  useSeparateAddress: boolean;
}

export interface BuildingResponse {
  id: string;
  message: string;
  data: BuildingData;
  createdAt: string;
  updatedAt: string;
}

interface ApiErrorData {
  message: string;
  code?: string;
  details?: any;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sindipro-backend.onrender.com';
const BUILDINGS_ENDPOINT = '/api/buildings/';

// HTTP request helper with error handling
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const accessToken = getStoredToken('access');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError({
          message: errorData.message || `HTTP Error: ${response.status} ${response.statusText}`,
          code: errorData.code || response.status.toString(),
          details: errorData,
        } as ApiErrorData);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or parsing errors
      throw new ApiError({
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: 'NETWORK_ERROR',
      } as ApiErrorData);
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Custom error class for API errors
class ApiError extends Error {
  public code?: string;
  public details?: any;

  constructor({ message, code, details }: { message: string; code?: string; details?: any }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

// Initialize API client
const apiClient = new ApiClient();

// Building API service functions
export const buildingApi = {
  /**
   * Create a new building
   * @param buildingData - The building data to create
   * @returns Promise<BuildingResponse>
   */
  async createBuilding(buildingData: BuildingData): Promise<BuildingResponse> {
    try {
      // Validate required fields before sending
      const validationError = validateBuildingData(buildingData);
      if (validationError) {
        throw new ApiError({
          message: `Validation Error: ${validationError}`,
          code: 'VALIDATION_ERROR',
        } as ApiErrorData);
      }

      const response = await apiClient.post<BuildingResponse>(
        BUILDINGS_ENDPOINT,
        buildingData
      );

      return response;
    } catch (error) {
      console.error('Error creating building:', error);
      throw error;
    }
  },

  /**
   * Get all buildings
   * @returns Promise<BuildingResponse[]>
   */
  async getBuildings(): Promise<BuildingResponse[]> {
    try {
      return await apiClient.get<BuildingResponse[]>(BUILDINGS_ENDPOINT);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      throw error;
    }
  },

  /**
   * Get a specific building by ID
   * @param id - Building ID
   * @returns Promise<BuildingResponse>
   */
  async getBuilding(id: string): Promise<BuildingResponse> {
    try {
      return await apiClient.get<BuildingResponse>(`${BUILDINGS_ENDPOINT}${id}/`);
    } catch (error) {
      console.error(`Error fetching building ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update a building
   * @param id - Building ID
   * @param buildingData - Updated building data
   * @returns Promise<BuildingResponse>
   */
  async updateBuilding(id: string, buildingData: Partial<BuildingData>): Promise<BuildingResponse> {
    try {
      return await apiClient.put<BuildingResponse>(
        `${BUILDINGS_ENDPOINT}${id}/`,
        buildingData
      );
    } catch (error) {
      console.error(`Error updating building ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a building
   * @param id - Building ID
   * @returns Promise<{ message: string }>
   */
  async deleteBuilding(id: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`${BUILDINGS_ENDPOINT}${id}/`);
    } catch (error) {
      console.error(`Error deleting building ${id}:`, error);
      throw error;
    }
  },
};

// Validation helper function
function validateBuildingData(data: BuildingData): string | null {
  const requiredFields = [
    'buildingName',
    'cnpj',
    'buildingType',
    'managerName',
    'managerPhone',
    'managerPhoneType',
  ];

  for (const field of requiredFields) {
    if (!data[field as keyof BuildingData]) {
      return `${field} is required`;
    }
  }

  // Validate address
  const addressFields = ['street', 'number', 'cep', 'neighborhood', 'city', 'state'];
  for (const field of addressFields) {
    if (!data.address[field as keyof Address]) {
      return `Address ${field} is required`;
    }
  }

  // Validate CNPJ format (basic check)
  if (data.cnpj && !isValidCNPJ(data.cnpj)) {
    return 'Invalid CNPJ format';
  }

  // Validate CEP format (basic check)
  if (data.address.cep && !isValidCEP(data.address.cep)) {
    return 'Invalid CEP format';
  }

  return null;
}

// Helper validation functions
function isValidCNPJ(cnpj: string): boolean {
  // Remove non-numeric characters
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  return cleanCNPJ.length === 14;
}

function isValidCEP(cep: string): boolean {
  // Remove non-numeric characters
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
}

// Export types and API service
export { ApiError };
export default buildingApi;