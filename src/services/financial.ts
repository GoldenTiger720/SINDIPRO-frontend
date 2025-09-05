import { API_BASE_URL, getStoredToken } from '@/lib/auth';

// Types
export interface CollectionAccount {
  id: number;
  name: string;
  purpose: string;
  monthlyAmount: number;
  startDate: string;
  endDate?: string;
  active: boolean;
}

export interface ExpenseData {
  id: number;
  building: {
    id: number;
    building_name: string;
    building_type: string;
    cnpj: string;
  };
  category: string;
  amount: string;
  reference_month: string;
  created_at: string;
}

export interface AnnualBudgetData {
  id: number;
  building: {
    id: number;
    building_name: string;
    building_type: string;
    cnpj: string;
  };
  category: string;
  sub_item: string;
  budgeted_amount: string;
  year: number;
  created_at: string;
}

export interface FinancialAccount {
  id: number;
  code: string;
  name: string;
  type: 'main' | 'sub';
  expectedAmount: number;
  actualAmount: number;
  parentId?: number;
  subAccounts?: FinancialAccount[];
}

// API Functions
const getAuthHeaders = () => {
  const token = getStoredToken('access');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Collections API
export const collectionsApi = {
  // Get all collections for a building
  getCollections: async (buildingId: number): Promise<CollectionAccount[]> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/collection/?building_id=${buildingId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch collections');
    }

    return response.json();
  },

  // Create new collection
  createCollection: async (data: {
    buildingId: number;
    name: string;
    purpose: string;
    monthlyAmount: number;
    startDate: string;
    active: boolean;
  }): Promise<CollectionAccount> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/collection/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create collection');
    }

    return response.json();
  },

  // Update collection
  updateCollection: async (id: number, data: Partial<CollectionAccount>): Promise<CollectionAccount> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/collection/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update collection');
    }

    return response.json();
  },

  // Delete collection
  deleteCollection: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/collection/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete collection');
    }
  },
};

// Expenses API
export const expensesApi = {
  // Get all expenses
  getExpenses: async (): Promise<ExpenseData[]> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/expense/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    return response.json();
  },

  // Create new expense
  createExpense: async (data: {
    buildingId: number;
    category: string;
    amount: number;
    referenceMonth: string;
  }): Promise<ExpenseData> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/expense/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create expense');
    }

    return response.json();
  },
};

// Annual Budget API
export const annualBudgetApi = {
  // Get annual budget
  getAnnualBudget: async (): Promise<AnnualBudgetData[]> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/annual/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch annual budget');
    }

    return response.json();
  },

  // Create annual budget item
  createAnnualBudgetItem: async (data: {
    buildingId: number;
    category: string;
    subItem: string;
    budgetedAmount: number;
    year: number;
  }): Promise<AnnualBudgetData> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/annual/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create annual budget item');
    }

    return response.json();
  },
};

// Financial Accounts API
export const financialAccountsApi = {
  // Get accounts for a building
  getAccounts: async (buildingId: number): Promise<FinancialAccount[]> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/account/?building_id=${buildingId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }

    return response.json();
  },

  // Create account
  createAccount: async (data: {
    buildingId: number;
    code: string;
    name: string;
    type: 'main' | 'sub';
    expectedAmount: number;
    actualAmount: number;
    parentId?: number;
  }): Promise<FinancialAccount> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/account/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create account');
    }

    return response.json();
  },

  // Update account
  updateAccount: async (id: number, data: Partial<FinancialAccount>): Promise<FinancialAccount> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/account/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update account');
    }

    return response.json();
  },

  // Delete account
  deleteAccount: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/financial/account/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
  },
};