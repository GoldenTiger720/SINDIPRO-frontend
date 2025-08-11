// Legal API Service
// Professional service for handling legal obligations backend operations

import { getStoredToken } from './auth';

// TypeScript interfaces for type safety
export interface TemplateData {
  name: string;
  description: string;
  buildingTypes: string[];
  frequency: string;
  daysBeforeExpiry: number;
  requiresQuote: boolean;
  active: boolean;
  conditions?: string;
}

export interface TemplateResponse {
  id: number;
  name: string;
  description: string;
  buildingTypes: string[];
  frequency: string;
  daysBeforeExpiry: number;
  requiresQuote: boolean;
  active: boolean;
  conditions: string | null;
  created_at: string;
  updated_at: string;
}

export interface TemplatesListResponse {
  templates: TemplateResponse[];
}

interface ApiErrorData {
  message: string;
  code?: string;
  details?: unknown;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sindipro-backend.onrender.com';
const LEGAL_ENDPOINT = '/api/legal';

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

// Legal API service functions
export const legalApi = {
  /**
   * Create a new legal obligation template
   * @param templateData - The template data to create
   * @returns Promise<TemplateResponse>
   */
  async createTemplate(templateData: TemplateData): Promise<TemplateResponse> {
    try {
      // Validate required fields before sending
      const validationError = validateTemplateData(templateData);
      if (validationError) {
        throw new ApiError({
          message: `Validation Error: ${validationError}`,
          code: 'VALIDATION_ERROR',
        } as ApiErrorData);
      }

      const response = await apiClient.post<TemplateResponse>(
        `${LEGAL_ENDPOINT}/template/`,
        templateData
      );

      return response;
    } catch (error) {
      console.error('Error creating legal template:', error);
      throw error;
    }
  },

  /**
   * Get all legal obligation templates
   * @returns Promise<TemplateResponse[]>
   */
  async getTemplates(): Promise<TemplateResponse[]> {
    try {
      const response = await apiClient.get<TemplatesListResponse>(`${LEGAL_ENDPOINT}/template/`);
      return response.templates;
    } catch (error) {
      console.error('Error fetching legal templates:', error);
      throw error;
    }
  },

  /**
   * Get a specific template by ID
   * @param id - Template ID
   * @returns Promise<TemplateResponse>
   */
  async getTemplate(id: string): Promise<TemplateResponse> {
    try {
      return await apiClient.get<TemplateResponse>(`${LEGAL_ENDPOINT}/template/${id}`);
    } catch (error) {
      console.error(`Error fetching legal template ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update a template
   * @param id - Template ID
   * @param templateData - Updated template data
   * @returns Promise<TemplateResponse>
   */
  async updateTemplate(id: string, templateData: Partial<TemplateData>): Promise<TemplateResponse> {
    try {
      return await apiClient.put<TemplateResponse>(
        `${LEGAL_ENDPOINT}/template/${id}`,
        templateData
      );
    } catch (error) {
      console.error(`Error updating legal template ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a template
   * @param id - Template ID
   * @returns Promise<{ message: string }>
   */
  async deleteTemplate(id: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`${LEGAL_ENDPOINT}/template/${id}`);
    } catch (error) {
      console.error(`Error deleting legal template ${id}:`, error);
      throw error;
    }
  },
};

// Validation helper function
function validateTemplateData(data: TemplateData): string | null {
  const requiredFields = [
    'name',
    'description',
    'buildingTypes',
    'frequency',
  ];

  for (const field of requiredFields) {
    if (!data[field as keyof TemplateData]) {
      return `${field} is required`;
    }
  }

  // Validate buildingTypes array
  if (!Array.isArray(data.buildingTypes) || data.buildingTypes.length === 0) {
    return 'At least one building type must be selected';
  }

  // Validate daysBeforeExpiry
  if (typeof data.daysBeforeExpiry !== 'number' || data.daysBeforeExpiry < 0) {
    return 'Days before expiry must be a non-negative number';
  }

  // Validate frequency
  const validFrequencies = ['monthly', 'quarterly', 'biannual', 'annual'];
  if (!validFrequencies.includes(data.frequency)) {
    return 'Invalid frequency value';
  }

  return null;
}

// Export types and API service
export { ApiError };
export default legalApi;