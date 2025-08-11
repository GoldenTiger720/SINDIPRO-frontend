// Equipment API Service
// Professional service for handling equipment and maintenance backend operations

import { getStoredToken } from './auth';

// TypeScript interfaces for type safety
export interface EquipmentData {
  name: string;
  type: string;
  location: string;
  purchaseDate: string;
  contractorName: string;
  contractorPhone: string;
  maintenanceFrequency: string;
  condominium: string;
  status: 'operational' | 'maintenance' | 'repair' | 'inactive';
}

export interface MaintenanceRecordData {
  date: string;
  type: string;
  description: string;
  technician: string;
  cost?: number;
  notes?: string;
}

export interface MaintenanceRecordResponse {
  id: number;
  date: string;
  type: string;
  description: string;
  technician: string;
  cost: number | null;
  notes: string | null;
  equipment_id: number;
  created_at: string;
  updated_at: string;
}

export interface EquipmentResponse {
  id: number;
  name: string;
  type: string;
  location: string;
  purchaseDate: string;
  contractorName: string;
  contractorPhone: string;
  maintenanceFrequency: string;
  condominium: string;
  status: 'operational' | 'maintenance' | 'repair' | 'inactive';
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentListResponse {
  equipment: EquipmentResponse[];
}

interface ApiErrorData {
  message: string;
  code?: string;
  details?: unknown;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sindipro-backend.onrender.com';
const EQUIPMENT_ENDPOINT = '/api/equipment';

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
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: unknown): Promise<T> {
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
  public details?: unknown;

  constructor({ message, code, details }: { message: string; code?: string; details?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

// Initialize API client
const apiClient = new ApiClient();

// Equipment API service functions
export const equipmentApi = {
  /**
   * Create a new equipment
   * @param equipmentData - The equipment data to create
   * @returns Promise<EquipmentResponse>
   */
  async createEquipment(equipmentData: EquipmentData): Promise<EquipmentResponse> {
    try {
      // Validate required fields before sending
      const validationError = validateEquipmentData(equipmentData);
      if (validationError) {
        throw new ApiError({
          message: `Validation Error: ${validationError}`,
          code: 'VALIDATION_ERROR',
        } as ApiErrorData);
      }

      const response = await apiClient.post<EquipmentResponse>(
        `${EQUIPMENT_ENDPOINT}/`,
        equipmentData
      );

      return response;
    } catch (error) {
      console.error('Error creating equipment:', error);
      throw error;
    }
  },

  /**
   * Get all equipment
   * @returns Promise<EquipmentResponse[]>
   */
  async getEquipment(): Promise<EquipmentResponse[]> {
    try {
      const response = await apiClient.get<EquipmentListResponse>(`${EQUIPMENT_ENDPOINT}/`);
      return response.equipment;
    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw error;
    }
  },

  /**
   * Get specific equipment by ID
   * @param id - Equipment ID
   * @returns Promise<EquipmentResponse>
   */
  async getEquipmentById(id: string): Promise<EquipmentResponse> {
    try {
      return await apiClient.get<EquipmentResponse>(`${EQUIPMENT_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error fetching equipment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update equipment
   * @param id - Equipment ID
   * @param equipmentData - Updated equipment data
   * @returns Promise<EquipmentResponse>
   */
  async updateEquipment(id: string, equipmentData: Partial<EquipmentData>): Promise<EquipmentResponse> {
    try {
      return await apiClient.put<EquipmentResponse>(
        `${EQUIPMENT_ENDPOINT}/${id}`,
        equipmentData
      );
    } catch (error) {
      console.error(`Error updating equipment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete equipment
   * @param id - Equipment ID
   * @returns Promise<{ message: string }>
   */
  async deleteEquipment(id: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`${EQUIPMENT_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting equipment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add maintenance record to equipment
   * @param equipmentId - Equipment ID
   * @param maintenanceData - Maintenance record data
   * @returns Promise<MaintenanceRecordResponse>
   */
  async addMaintenanceRecord(equipmentId: string, maintenanceData: MaintenanceRecordData): Promise<MaintenanceRecordResponse> {
    try {
      // Validate required fields before sending
      const validationError = validateMaintenanceData(maintenanceData);
      if (validationError) {
        throw new ApiError({
          message: `Validation Error: ${validationError}`,
          code: 'VALIDATION_ERROR',
        } as ApiErrorData);
      }

      const response = await apiClient.post<MaintenanceRecordResponse>(
        `${EQUIPMENT_ENDPOINT}/${equipmentId}/maintenance/`,
        maintenanceData
      );

      return response;
    } catch (error) {
      console.error(`Error adding maintenance record for equipment ${equipmentId}:`, error);
      throw error;
    }
  },

  /**
   * Get maintenance records for equipment
   * @param equipmentId - Equipment ID
   * @returns Promise<MaintenanceRecordResponse[]>
   */
  async getMaintenanceRecords(equipmentId: string): Promise<MaintenanceRecordResponse[]> {
    try {
      return await apiClient.get<MaintenanceRecordResponse[]>(`${EQUIPMENT_ENDPOINT}/${equipmentId}/maintenance/`);
    } catch (error) {
      console.error(`Error fetching maintenance records for equipment ${equipmentId}:`, error);
      throw error;
    }
  },
};

// Validation helper functions
function validateEquipmentData(data: EquipmentData): string | null {
  const requiredFields = [
    'name',
    'type',
    'location',
    'purchaseDate',
    'contractorName',
    'contractorPhone',
    'maintenanceFrequency',
    'condominium',
    'status',
  ];

  for (const field of requiredFields) {
    if (!data[field as keyof EquipmentData]) {
      return `${field} is required`;
    }
  }

  // Validate status
  const validStatuses = ['operational', 'maintenance', 'repair', 'inactive'];
  if (!validStatuses.includes(data.status)) {
    return 'Invalid status value';
  }

  // Validate maintenance frequency
  const validFrequencies = ['monthly', 'quarterly', 'semiannual', 'annual'];
  if (!validFrequencies.includes(data.maintenanceFrequency)) {
    return 'Invalid maintenance frequency value';
  }

  return null;
}

function validateMaintenanceData(data: MaintenanceRecordData): string | null {
  const requiredFields = ['date', 'type', 'description', 'technician'];

  for (const field of requiredFields) {
    if (!data[field as keyof MaintenanceRecordData]) {
      return `${field} is required`;
    }
  }

  // Validate cost if provided
  if (data.cost !== undefined && (typeof data.cost !== 'number' || data.cost < 0)) {
    return 'Cost must be a non-negative number';
  }

  return null;
}

// Export types and API service
export { ApiError };
export default equipmentApi;