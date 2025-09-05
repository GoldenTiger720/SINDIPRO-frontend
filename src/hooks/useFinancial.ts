import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  collectionsApi,
  expensesApi,
  annualBudgetApi,
  financialAccountsApi,
  type CollectionAccount,
  type ExpenseData,
  type AnnualBudgetData,
  type FinancialAccount,
} from '@/services/financial';

// Query Keys
export const financialKeys = {
  all: ['financial'] as const,
  collections: (buildingId: number) => [...financialKeys.all, 'collections', buildingId] as const,
  expenses: () => [...financialKeys.all, 'expenses'] as const,
  annualBudget: () => [...financialKeys.all, 'annualBudget'] as const,
  accounts: (buildingId: number) => [...financialKeys.all, 'accounts', buildingId] as const,
};

// Collections Hooks
export const useCollections = (buildingId: number | null) => {
  return useQuery({
    queryKey: financialKeys.collections(buildingId || 0),
    queryFn: () => collectionsApi.getCollections(buildingId!),
    enabled: !!buildingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: collectionsApi.createCollection,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: financialKeys.collections(variables.buildingId),
      });
      toast({
        title: "Success",
        description: "Collection created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create collection",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CollectionAccount> }) =>
      collectionsApi.updateCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financialKeys.all,
      });
      toast({
        title: "Success",
        description: "Collection updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update collection",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: collectionsApi.deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financialKeys.all,
      });
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete collection",
        variant: "destructive",
      });
    },
  });
};

// Expenses Hooks
export const useExpenses = () => {
  return useQuery({
    queryKey: financialKeys.expenses(),
    queryFn: expensesApi.getExpenses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: expensesApi.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financialKeys.expenses(),
      });
      toast({
        title: "Success",
        description: "Expense registered successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register expense",
        variant: "destructive",
      });
    },
  });
};

// Annual Budget Hooks
export const useAnnualBudget = () => {
  return useQuery({
    queryKey: financialKeys.annualBudget(),
    queryFn: annualBudgetApi.getAnnualBudget,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateAnnualBudgetItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: annualBudgetApi.createAnnualBudgetItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financialKeys.annualBudget(),
      });
      toast({
        title: "Success",
        description: "Budget item added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add budget item",
        variant: "destructive",
      });
    },
  });
};

// Financial Accounts Hooks
export const useFinancialAccounts = (buildingId: number | null) => {
  return useQuery({
    queryKey: financialKeys.accounts(buildingId || 0),
    queryFn: () => financialAccountsApi.getAccounts(buildingId!),
    enabled: !!buildingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateFinancialAccount = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: financialAccountsApi.createAccount,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: financialKeys.accounts(variables.buildingId),
      });
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFinancialAccount = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FinancialAccount> }) =>
      financialAccountsApi.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financialKeys.all,
      });
      toast({
        title: "Success",
        description: "Account updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update account",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFinancialAccount = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: financialAccountsApi.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financialKeys.all,
      });
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
    },
  });
};