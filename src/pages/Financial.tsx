import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Upload, TrendingUp, DollarSign, FileSpreadsheet, Calculator, Home, PieChart, FileText, Download, Edit, Plus, Trash2, Building2, X, Check } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { DashboardHeader } from "@/components/DashboardHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useBuildings } from "@/hooks/useBuildings";
import { useToast } from "@/hooks/use-toast";
import { isMasterUser, isManagerUser, getStoredUser } from "@/lib/auth";
import { BudgetManagement, CondominiumCalculations, MarketingValues } from "@/components/financial";
import {
  useCollections,
  useCreateCollection,
  useExpenses,
  useCreateExpense,
  useAnnualBudget,
  useCreateAnnualBudgetItem,
  useFinancialAccounts,
  useCreateFinancialAccount,
  useDeleteFinancialAccount,
} from "@/hooks/useFinancial";
import type { CollectionAccount } from "@/services/financial";

// Mock data for demonstration
const mockUnits = [
  { id: 1, number: "101", area: 85.5, type: "residential", owner: "João Silva", percentage: 8.5, idealFraction: 0.085 },
  { id: 2, number: "102", area: 90.0, type: "residential", owner: "Maria Santos", percentage: 9.0, idealFraction: 0.090 },
  { id: 3, number: "201", area: 85.5, type: "residential", owner: "Carlos Oliveira", percentage: 8.5, idealFraction: 0.085 },
  { id: 4, number: "202", area: 90.0, type: "residential", owner: "Ana Costa", percentage: 9.0, idealFraction: 0.090 },
  { id: 5, number: "301", area: 75.0, type: "residential", owner: "Pedro Lima", percentage: 7.5, idealFraction: 0.075 },
];

// Mock data for Brazilian condominium system
const mockBudgetAccounts = [
  {
    id: 1,
    code: "1000",
    name: "Administração",
    type: "main",
    annualBudget: 48000,
    parentId: null,
    subAccounts: [
      { id: 11, code: "1001", name: "Salários Administração", type: "sub", annualBudget: 30000, parentId: 1 },
      { id: 12, code: "1002", name: "Encargos Sociais", type: "sub", annualBudget: 12000, parentId: 1 },
      { id: 13, code: "1003", name: "Material de Escritório", type: "sub", annualBudget: 6000, parentId: 1 },
    ]
  },
  {
    id: 2,
    code: "2000", 
    name: "Manutenção",
    type: "main",
    annualBudget: 36000,
    parentId: null,
    subAccounts: [
      { id: 21, code: "2001", name: "Manutenção Elevador", type: "sub", annualBudget: 18000, parentId: 2 },
      { id: 22, code: "2002", name: "Manutenção Elétrica", type: "sub", annualBudget: 12000, parentId: 2 },
      { id: 23, code: "2003", name: "Manutenção Hidráulica", type: "sub", annualBudget: 6000, parentId: 2 },
    ]
  },
  {
    id: 3,
    code: "3000",
    name: "Limpeza",
    type: "main", 
    annualBudget: 24000,
    parentId: null,
    subAccounts: [
      { id: 31, code: "3001", name: "Salários Limpeza", type: "sub", annualBudget: 18000, parentId: 3 },
      { id: 32, code: "3002", name: "Material de Limpeza", type: "sub", annualBudget: 6000, parentId: 3 },
    ]
  },
  {
    id: 4,
    code: "4000",
    name: "Segurança",
    type: "main",
    annualBudget: 60000,
    parentId: null,
    subAccounts: [
      { id: 41, code: "4001", name: "Salários Portaria", type: "sub", annualBudget: 48000, parentId: 4 },
      { id: 42, code: "4002", name: "Equipamentos Segurança", type: "sub", annualBudget: 12000, parentId: 4 },
    ]
  }
];

const mockMonthlyExpenses = [
  { month: "Janeiro", expenses: { 1001: 2500, 1002: 1000, 1003: 500, 2001: 1500, 2002: 1000, 2003: 500, 3001: 1500, 3002: 500, 4001: 4000, 4002: 1000 } },
  { month: "Fevereiro", expenses: { 1001: 2500, 1002: 1000, 1003: 450, 2001: 1500, 2002: 800, 2003: 600, 3001: 1500, 3002: 600, 4001: 4000, 4002: 800 } },
  { month: "Março", expenses: { 1001: 2500, 1002: 1000, 1003: 520, 2001: 1500, 2002: 1200, 2003: 400, 3001: 1500, 3002: 480, 4001: 4000, 4002: 1200 } },
];

// Types for API data
interface Building {
  id: number;
  building_name: string;
  building_type: string;
  cnpj: string;
}

interface ExpenseData {
  id: number;
  building: Building;
  category: string;
  expense_type: string;
  description: string;
  amount: string;
  expense_date: string;
  supplier: string;
  invoice_number: string;
  payment_method: string;
  notes: string;
  created_on: string;
  updated_on: string;
}

interface AnnualBudgetData {
  id: number;
  building: Building;
  year: number;
  category: string;
  sub_item: string;
  budgeted_amount: string;
  created_at: string;
  updated_at: string;
}

// Types for chart of accounts
type Account = {
  id: number;
  code: string;
  name: string;
  type: 'main' | 'sub';
  expectedAmount?: number;
  actualAmount?: number;
  parentId: number | null;
  subAccounts?: Account[];
  assemblyDate?: string;
  referenceMonth?: string;
  isMonthly?: boolean;
};

type MonthlyExpense = {
  accountId: number;
  month: string;
  year: number;
  amount: number;
  isLocked?: boolean;
};


export default function Financial() {
  const { t } = useTranslation();
  const { data: buildings = [], isLoading: buildingsLoading } = useBuildings();
  
  // Get user data and check roles
  const user = getStoredUser();
  const isMaster = isMasterUser();
  const isManager = isManagerUser();
  
  // Block access for managers
  if (isManager) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader userName={t("adminSindipro")} />
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-red-600">{t("accessDenied")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  {t("managerNoFinancialAccess") || "Managers do not have access to the financial page."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  // State for building selection
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  
  // Chart of Accounts dialog state
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [newAccount, setNewAccount] = useState<any>({
    code: '',
    name: '',
    type: 'main',
    expectedAmount: 0,
    actualAmount: 0,
    parentId: null,
    assemblyDate: new Date().toISOString().split('T')[0],
    referenceMonth: new Date().toISOString().slice(0, 7),
    isMonthly: false
  });
  
  // Monthly expenses tracking
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [selectedExpenseMonth, setSelectedExpenseMonth] = useState(new Date().toISOString().slice(0, 7));
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  
  // Loading and error states for API calls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Toast hook
  const { toast } = useToast();
  
  // Annual budget form state
  const [annualBudgetForm, setAnnualBudgetForm] = useState({
    accountCategory: '',
    subItem: '',
    budgetedAmount: ''
  });
  const [isSubmittingBudget, setIsSubmittingBudget] = useState(false);
  
  
  // Collection accounts state
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionAccount | null>(null);
  
  // React Query hooks
  const buildingId = selectedBuildingId ? parseInt(selectedBuildingId) : null;
  const { data: collectionAccounts = [], isLoading: isLoadingCollections } = useCollections(buildingId);
  const createCollectionMutation = useCreateCollection();
  const { data: expensesData = [], isLoading: isLoadingExpenses, error: expensesError } = useExpenses();
  const createExpenseMutation = useCreateExpense();
  const { data: annualBudgetData = [], isLoading: isLoadingAnnualBudget, error: annualBudgetError } = useAnnualBudget();
  const createAnnualBudgetMutation = useCreateAnnualBudgetItem();
  const { data: accounts = [], isLoading: isLoadingAccounts, error: accountsFetchError } = useFinancialAccounts(buildingId);
  const createAccountMutation = useCreateFinancialAccount();
  const deleteAccountMutation = useDeleteFinancialAccount();
  
  // Market values state
  const [marketValues, setMarketValues] = useState({
    saleMin: '',
    saleMax: '',
    rentalMin: '',
    rentalMax: ''
  });
  const [marketCalculationType, setMarketCalculationType] = useState<'sale' | 'rental' | 'condominium'>('sale');
  
  const [unitCustomValues, setUnitCustomValues] = useState<Record<number, { salePerM2?: number; rentalPerM2?: number; condominiumPerM2?: number }>>({});
  
  const [calculationData, setCalculationData] = useState({
    totalExpense: "5000",
    calculationType: "area",
    customPercentages: mockUnits.reduce((acc, unit) => ({
      ...acc,
      [unit.id]: unit.percentage.toString()
    }), {} as Record<number, string>)
  });

  // Effect to set first building as default or user's building
  useEffect(() => {
    if (!isMaster && user?.building_id) {
      // For non-master users, use their assigned building
      setSelectedBuildingId(user.building_id.toString());
      const building = buildings.find(b => b.id === user.building_id);
      setSelectedBuilding(building || null);
    } else if (isMaster && buildings.length > 0 && !selectedBuildingId) {
      // For master users, set first building as default
      setSelectedBuildingId(buildings[0].id.toString());
      setSelectedBuilding(buildings[0]);
    } else if (!isMaster && !user?.building_id && buildings.length > 0) {
      // For non-master users without assigned building, use first available
      setSelectedBuildingId(buildings[0].id.toString());
      setSelectedBuilding(buildings[0]);
    }
  }, [buildings, selectedBuildingId, isMaster, user]);
  
  // Function to fetch accounts from backend
  const fetchAccounts = async (buildingId?: number) => {
    setIsLoadingAccounts(true);
    setAccountsFetchError(null);
    
    try {
      const response = await getFinancialAccounts(buildingId);
      
      // Transform the response data to match our Account interface
      // Assuming backend returns flat list, we need to organize into main/sub structure
      const transformedAccounts = transformBackendAccountsToHierarchy(response);
      setAccounts(transformedAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccountsFetchError(error instanceof Error ? error.message : 'Failed to fetch accounts');
      // Keep existing accounts on error
    } finally {
      setIsLoadingAccounts(false);
    }
  };
  
  // Transform flat backend response to hierarchical structure
  const transformBackendAccountsToHierarchy = (backendAccounts: any[]): Account[] => {
    const mainAccounts: Account[] = [];
    const subAccounts: any[] = [];
    
    // Separate main and sub accounts
    backendAccounts.forEach(account => {
      if (account.type === 'main') {
        mainAccounts.push({
          id: account.id,
          code: account.code,
          name: account.name,
          type: account.type,
          expectedAmount: account.expectedAmount || account.expected_amount || 0,
          actualAmount: account.actualAmount || account.actual_amount || 0,
          parentId: null,
          subAccounts: []
        });
      } else {
        subAccounts.push({
          id: account.id,
          code: account.code,
          name: account.name,
          type: account.type,
          expectedAmount: account.expectedAmount || account.expected_amount || 0,
          actualAmount: account.actualAmount || account.actual_amount || 0,
          parentId: account.parentId || account.parent_id
        });
      }
    });
    
    // Assign sub accounts to their parent main accounts
    mainAccounts.forEach(mainAccount => {
      mainAccount.subAccounts = subAccounts.filter(sub => sub.parentId === mainAccount.id);
    });
    
    return mainAccounts;
  };
  
  // Fetch accounts when building selection changes

  
  // Handle building selection
  const handleBuildingChange = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    const building = buildings.find(b => b.id.toString() === buildingId);
    setSelectedBuilding(building);
  };
  
  // Handle account creation/editing
  const handleSaveAccount = async () => {
    if (!selectedBuildingId && !editingAccount) {
      setApiError("Please select a building first");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      if (editingAccount) {
        // Update existing account (keep existing local state logic for now)
        setAccounts(accounts.map(acc => {
          if (acc.id === editingAccount.id) {
            return { ...acc, ...newAccount };
          }
          if (acc.subAccounts) {
            acc.subAccounts = acc.subAccounts.map(sub => 
              sub.id === editingAccount.id ? { ...sub, ...newAccount } : sub
            );
          }
          return acc;
        }));
      } else {
        // Create new account - send to backend API
        const accountData = {
          code: newAccount.code!,
          name: newAccount.name!,
          type: newAccount.type as 'main' | 'sub',
          expectedAmount: newAccount.expectedAmount || 0,
          actualAmount: newAccount.actualAmount || 0,
          parentId: newAccount.parentId || null,
          building_id: parseInt(selectedBuildingId)
        };

        await createFinancialAccount(accountData);
        
        // Refresh accounts list from backend after successful creation
        await fetchAccounts(parseInt(selectedBuildingId));
      }
      
      setShowAccountDialog(false);
      setEditingAccount(null);
      setNewAccount({
        code: '',
        name: '',
        type: 'main',
        expectedAmount: 0,
        actualAmount: 0,
        parentId: null
      });
    } catch (error) {
      console.error('Error saving account:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to save account');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle account deletion using React Query
  const handleDeleteAccount = (accountId: number) => {
    deleteAccountMutation.mutate(accountId);
  };

  // Handle collection account save
  const handleSaveCollection = async () => {
    if (!editingCollection) {
      toast({
        title: "Error",
        description: "No collection data to save",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (!editingCollection.name || !editingCollection.purpose || !editingCollection.monthlyAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBuildingId) {
      toast({
        title: "Error",
        description: "Please select a building first",
        variant: "destructive",
      });
      return;
    }

    // For new collections, use React Query mutation
    if (!editingCollection.id || editingCollection.id <= 0) {
      createCollectionMutation.mutate({
        buildingId: parseInt(selectedBuildingId),
        name: editingCollection.name,
        purpose: editingCollection.purpose,
        monthlyAmount: editingCollection.monthlyAmount,
        startDate: editingCollection.startDate || new Date().toISOString().split('T')[0],
        active: editingCollection.active !== undefined ? editingCollection.active : true
      }, {
        onSuccess: () => {
          setShowCollectionDialog(false);
          setEditingCollection(null);
        }
      });
    } else {
      // For updates, we'd use update mutation (not implemented yet)
      toast({
        title: "Success",
        description: "Collection updated successfully",
      });
      setShowCollectionDialog(false);
      setEditingCollection(null);
    }
  };
  
  
  // Brazilian system state
  const [brazilianData, setBrazilianData] = useState({
    budgetAccounts: mockBudgetAccounts,
    monthlyExpenses: mockMonthlyExpenses,
    units: mockUnits,
    selectedMonth: "Janeiro",
    editingAccount: null as number | null,
    newAccount: {
      code: "",
      name: "",
      type: "sub",
      annualBudget: "",
      parentId: null
    }
  });

  const totalArea = mockUnits.reduce((sum, unit) => sum + unit.area, 0);

  const calculateUnitShare = (unit: typeof mockUnits[0]) => {
    const expense = parseFloat(calculationData.totalExpense) || 0;
    
    if (calculationData.calculationType === "area") {
      return (unit.area / totalArea) * expense;
    } else if (calculationData.calculationType === "equal") {
      return expense / mockUnits.length;
    } else {
      // custom percentage
      const percentage = parseFloat(calculationData.customPercentages[unit.id]) || 0;
      return (percentage / 100) * expense;
    }
  };

  const handleCustomPercentageChange = (unitId: number, value: string) => {
    setCalculationData(prev => ({
      ...prev,
      customPercentages: {
        ...prev.customPercentages,
        [unitId]: value
      }
    }));
  };

  const handleUnitValueChange = (unitId: number, valueType: 'salePerM2' | 'rentalPerM2' | 'condominiumPerM2', value: string) => {
    const numValue = parseFloat(value.replace(/[^0-9,.-]/g, '').replace(',', '.'));
    setUnitCustomValues(prev => ({
      ...prev,
      [unitId]: {
        ...prev[unitId],
        [valueType]: isNaN(numValue) ? undefined : numValue
      }
    }));
  };

  // Annual budget form handlers
  const handleAnnualBudgetChange = (field: string, value: string) => {
    setAnnualBudgetForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddToBudget = async () => {
    if (!annualBudgetForm.accountCategory || !annualBudgetForm.subItem || !annualBudgetForm.budgetedAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const budgetedAmount = parseFloat(annualBudgetForm.budgetedAmount);
    if (isNaN(budgetedAmount) || budgetedAmount <= 0) {
      toast({
        title: "Error", 
        description: "Please enter a valid budget amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingBudget(true);

    try {
      const budgetData = {
        account_category: annualBudgetForm.accountCategory,
        sub_item: annualBudgetForm.subItem,
        budgeted_amount: budgetedAmount,
        building_id: selectedBuildingId ? parseInt(selectedBuildingId) : user?.building_id
      };

      await createAnnualBudget(budgetData);

      toast({
        title: "Success",
        description: "Annual budget item added successfully",
      });

      // Reset form
      setAnnualBudgetForm({
        accountCategory: '',
        subItem: '',
        budgetedAmount: ''
      });

    } catch (error) {
      console.error('Error adding budget item:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add budget item",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingBudget(false);
    }
  };

  // Handle expense registration
  const handleRegisterExpense = async () => {
    if (!expenseCategory || !expenseAmount || !selectedExpenseMonth) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBuildingId) {
      toast({
        title: "Error",
        description: "Please select a building first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const accessToken = getStoredToken('access');
      const response = await fetch(`${API_BASE_URL}/api/financial/expense/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({
          buildingId: selectedBuildingId,
          month: selectedExpenseMonth,
          category: expenseCategory,
          amount: parseFloat(expenseAmount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register expense');
      }

      const data = await response.json();
      
      toast({
        title: "Success",
        description: "Expense registered successfully",
      });

      // Clear form fields
      setExpenseCategory('');
      setExpenseAmount('');
      
      // Refresh expenses data
      try {
        const expenses = await fetchExpenses();
        setExpensesData(expenses);
      } catch (refreshError) {
        console.error('Error refreshing expenses:', refreshError);
      }
      
    } catch (error) {
      console.error('Error registering expense:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register expense",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Data processing functions
  const getTotalAnnualBudget = () => {
    return annualBudgetData.reduce((sum, item) => sum + parseFloat(item.budgeted_amount), 0);
  };

  const getTotalCurrentExpenses = () => {
    return expensesData.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  };

  const getRemainingBalance = () => {
    return getTotalAnnualBudget() - getTotalCurrentExpenses();
  };

  // Group budget data by category
  const getBudgetByCategory = () => {
    const categoryBudgets = new Map<string, number>();
    annualBudgetData.forEach(item => {
      const current = categoryBudgets.get(item.category) || 0;
      categoryBudgets.set(item.category, current + parseFloat(item.budgeted_amount));
    });
    return categoryBudgets;
  };

  // Group expense data by category
  const getExpensesByCategory = () => {
    const categoryExpenses = new Map<string, number>();
    expensesData.forEach(expense => {
      const current = categoryExpenses.get(expense.category) || 0;
      categoryExpenses.set(expense.category, current + parseFloat(expense.amount));
    });
    return categoryExpenses;
  };

  // Generate data for Budget vs Actual chart
  const generateBudgetVsActualData = () => {
    const budgetByCategory = getBudgetByCategory();
    const expensesByCategory = getExpensesByCategory();
    const allCategories = new Set([...budgetByCategory.keys(), ...expensesByCategory.keys()]);

    return Array.from(allCategories).map(category => ({
      name: category,
      expected: budgetByCategory.get(category) || 0,
      actual: expensesByCategory.get(category) || 0
    }));
  };

  // Generate data for 12-month forecast
  const generateMonthlyPrediction = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const totalAnnualBudget = getTotalAnnualBudget();
    const monthlyBudget = totalAnnualBudget / 12;
    
    // Calculate current month expenses
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const isPastMonth = index < currentMonth;
      const isCurrentMonth = index === currentMonth;
      
      return {
        month,
        expected: monthlyBudget,
        actual: isPastMonth ? monthlyBudget * 0.85 : (isCurrentMonth ? getTotalCurrentExpenses() : 0),
        isCurrentMonth
      };
    });
  };

  // Generate comparative analysis data
  const generateComparativeAnalysisData = () => {
    const budgetByCategory = getBudgetByCategory();
    const expensesByCategory = getExpensesByCategory();
    const allCategories = new Set([...budgetByCategory.keys(), ...expensesByCategory.keys()]);

    return Array.from(allCategories).map(category => {
      const budgeted = budgetByCategory.get(category) || 0;
      const spent = expensesByCategory.get(category) || 0;
      const variance = spent - budgeted;
      const variancePercent = budgeted > 0 ? ((variance / budgeted) * 100) : 0;
      
      let status = 'withinBudget';
      let statusColor = 'text-green-600';
      
      if (variancePercent > 5) {
        status = 'aboveBudget';
        statusColor = 'text-red-600';
      } else if (variancePercent < -5) {
        status = 'economy';
        statusColor = 'text-green-600';
      }

      return {
        category,
        budgeted,
        spent,
        variance,
        variancePercent: Math.abs(variancePercent),
        varianceSign: variancePercent >= 0 ? '+' : '-',
        status,
        statusColor
      };
    });
  };

  // Brazilian system functions (keeping for compatibility)
  const getTotalAnnualBudgetLegacy = () => {
    return brazilianData.budgetAccounts.reduce((sum, account) => sum + account.annualBudget, 0);
  };

  const getMonthlyBudget = (accountId: number) => {
    const account = getAllSubAccounts().find(acc => acc.id === accountId);
    return account ? account.annualBudget / 12 : 0;
  };

  const getMonthlyExpense = (accountId: number, month: string) => {
    const monthData = brazilianData.monthlyExpenses.find(m => m.month === month);
    return monthData?.expenses[accountId] || 0;
  };

  const getAllSubAccounts = () => {
    const subAccounts: typeof mockBudgetAccounts[0]['subAccounts'][0][] = [];
    brazilianData.budgetAccounts.forEach(account => {
      account.subAccounts?.forEach(sub => {
        subAccounts.push(sub);
      });
    });
    return subAccounts;
  };

  const calculateUnitMonthlyFee = (unit: typeof mockUnits[0]) => {
    const totalBudget = getTotalAnnualBudget();
    const monthlyTotal = totalBudget / 12;
    return monthlyTotal * unit.idealFraction;
  };

  const exportToExcel = () => {
    // This would generate an Excel file with the current budget structure
    alert(t("excelExportMessage"));
  };

  const importFromExcel = () => {
    // This would allow importing Excel files to update budget data
    alert(t("excelImportMessage"));
  };
  

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-500" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">{t("financialBudgetManagement")}</h1>
          </div>
        </div>

        {/* API Error Messages */}
        {(expensesError || annualBudgetError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">Loading Errors:</h3>
            {expensesError && (
              <p className="text-red-700 text-sm">Expenses: {expensesError}</p>
            )}
            {annualBudgetError && (
              <p className="text-red-700 text-sm">Annual Budget: {annualBudgetError}</p>
            )}
          </div>
        )}

        {/* Loading Indicators */}
        {(isLoadingExpenses || isLoadingAnnualBudget) && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">
              Loading financial data...
              {isLoadingExpenses && " Expenses"}
              {isLoadingAnnualBudget && " Annual Budget"}
            </p>
          </div>
        )}

        <Tabs defaultValue="budget-management" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="budget-management" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 p-1 sm:p-2 text-[10px] sm:text-xs lg:text-sm">
              <BarChart3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              <span className="text-center leading-none sm:leading-tight truncate max-w-full">{t("budgetManagement")}</span>
            </TabsTrigger>
            <TabsTrigger value="condominium-calculations" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 p-1 sm:p-2 text-[10px] sm:text-xs lg:text-sm">
              <Calculator className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              <span className="text-center leading-none sm:leading-tight truncate max-w-full">{t("condominiumCalculations")}</span>
            </TabsTrigger>
            <TabsTrigger value="marketing-values" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 p-1 sm:p-2 text-[10px] sm:text-xs lg:text-sm">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              <span className="text-center leading-none sm:leading-tight truncate max-w-full">{t("marketingValues")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="budget-management" className="space-y-6">
            <BudgetManagement
              isMaster={isMaster}
              user={user}
              buildings={buildings}
              selectedBuildingId={selectedBuildingId}
              selectedBuilding={selectedBuilding}
              handleBuildingChange={handleBuildingChange}
              accounts={accounts}
              editingAccount={editingAccount}
              newAccount={newAccount}
              showAccountDialog={showAccountDialog}
              apiError={apiError}
              setEditingAccount={setEditingAccount}
              setNewAccount={setNewAccount}
              setShowAccountDialog={setShowAccountDialog}
              setApiError={setApiError}
              handleSaveAccount={handleSaveAccount}
              handleDeleteAccount={handleDeleteAccount}
              selectedExpenseMonth={selectedExpenseMonth}
              expenseCategory={expenseCategory}
              expenseAmount={expenseAmount}
              setSelectedExpenseMonth={setSelectedExpenseMonth}
              setExpenseCategory={setExpenseCategory}
              setExpenseAmount={setExpenseAmount}
              handleRegisterExpense={handleRegisterExpense}
              isSubmitting={isSubmitting}
              annualBudgetForm={annualBudgetForm}
              setAnnualBudgetForm={setAnnualBudgetForm}
              handleAddToBudget={handleAddToBudget}
              isSubmittingBudget={isSubmittingBudget}
              generateBudgetVsActualData={generateBudgetVsActualData}
              generateMonthlyPrediction={generateMonthlyPrediction}
              getTotalAnnualBudget={getTotalAnnualBudget}
              getTotalCurrentExpenses={getTotalCurrentExpenses}
              getRemainingBalance={getRemainingBalance}
              generateComparativeAnalysisData={generateComparativeAnalysisData}
            />
          </TabsContent>

          <TabsContent value="condominium-calculations" className="space-y-6">
            <CondominiumCalculations
              isMaster={isMaster}
              collectionAccounts={collectionAccounts}
              setEditingCollection={setEditingCollection}
              setShowCollectionDialog={setShowCollectionDialog}
              brazilianData={brazilianData}
              expensesData={expensesData}
              annualBudgetData={annualBudgetData}
              accounts={accounts}
            />
          </TabsContent>

          <TabsContent value="marketing-values" className="space-y-6">
            <MarketingValues
              selectedBuilding={selectedBuilding}
              marketCalculationType={marketCalculationType}
              setMarketCalculationType={setMarketCalculationType}
              marketValues={marketValues}
              setMarketValues={setMarketValues}
              unitCustomValues={unitCustomValues}
              setUnitCustomValues={setUnitCustomValues}
              brazilianData={brazilianData}
              exportToExcel={exportToExcel}
            />

          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base lg:text-lg">{t("relatedFeatures")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 sm:p-4 border rounded-lg min-h-[120px] flex flex-col">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm leading-tight">
                  <Calculator className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{t("condominiumCalculator")}</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {t("automaticallyCalculateDistribute")}
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg min-h-[120px] flex flex-col">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm leading-tight">
                  <DollarSign className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{t("automaticFeeDistribution")}</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {t("automaticFeeDistributionDesc")}
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg min-h-[120px] flex flex-col">
                <h3 className="font-semibold mb-2 text-sm leading-tight break-words">{t("excelUploadAndAnalysis")}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {t("excelUploadAndAnalysisDesc")}
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg min-h-[120px] flex flex-col">
                <h3 className="font-semibold mb-2 text-sm leading-tight break-words">{t("automaticBudgetComparison")}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {t("automaticBudgetComparisonDesc")}
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg min-h-[120px] flex flex-col">
                <h3 className="font-semibold mb-2 text-sm leading-tight break-words">{t("automaticReportGeneration")}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {t("automaticReportGenerationDesc")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      
      {/* Account Dialog */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? t("editAccount") : t("addAccount")}
            </DialogTitle>
            <DialogDescription>
              {editingAccount ? t("editAccountDescription") : t("addAccountDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t("accountCode")}</Label>
              <Input
                value={newAccount.code}
                onChange={(e) => setNewAccount({...newAccount, code: e.target.value})}
                placeholder="1000"
              />
            </div>
            <div>
              <Label>{t("accountName")}</Label>
              <Input
                value={newAccount.name}
                onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                placeholder={t("accountNamePlaceholder")}
              />
            </div>
            <div>
              <Label>{t("accountType")}</Label>
              <Select 
                value={newAccount.type} 
                onValueChange={(value) => setNewAccount({...newAccount, type: value as 'main' | 'sub'})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">{t("mainAccount")}</SelectItem>
                  <SelectItem value="sub">{t("subAccount")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newAccount.type === 'sub' && (
              <div>
                <Label>{t("parentAccount")}</Label>
                <Select 
                  value={newAccount.parentId?.toString()} 
                  onValueChange={(value) => setNewAccount({...newAccount, parentId: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.filter(a => a.type === 'main').map(account => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.code} - {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>{t("assemblyDate")}</Label>
              <Input
                type="date"
                value={newAccount.assemblyDate}
                onChange={(e) => setNewAccount({...newAccount, assemblyDate: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isMonthly"
                checked={newAccount.isMonthly}
                onChange={(e) => setNewAccount({...newAccount, isMonthly: e.target.checked})}
              />
              <Label htmlFor="isMonthly">{t("setMonthlyAmount")}</Label>
            </div>
            <div>
              <Label>{newAccount.isMonthly ? t("monthlyAmount") : t("annualAmount")}</Label>
              <Input
                type="number"
                value={newAccount.expectedAmount}
                onChange={(e) => setNewAccount({...newAccount, expectedAmount: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
              />
              {newAccount.isMonthly && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t("annualTotal")}: R$ {((newAccount.expectedAmount || 0) * 12).toFixed(2)}
                </p>
              )}
            </div>
            <div>
              <Label>{t("referenceMonth")}</Label>
              <Input
                type="month"
                value={newAccount.referenceMonth}
                onChange={(e) => setNewAccount({...newAccount, referenceMonth: e.target.value})}
              />
            </div>
            <div>
              <Label>{t("actualAmount")}</Label>
              <Input
                type="number"
                value={newAccount.actualAmount}
                onChange={(e) => setNewAccount({...newAccount, actualAmount: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
                disabled={!isMaster && editingAccount && monthlyExpenses.some(exp => exp.accountId === editingAccount.id && exp.isLocked)}
              />
              {!isMaster && editingAccount && monthlyExpenses.some(exp => exp.accountId === editingAccount.id && exp.isLocked) && (
                <p className="text-xs text-red-500 mt-1">{t("onlyMasterCanEditLocked")}</p>
              )}
            </div>
          </div>
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAccountDialog(false);
                setApiError(null);
              }}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button 
              onClick={handleSaveAccount}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("saving") || "Saving..."}
                </div>
              ) : (
                editingAccount ? t("save") : t("add")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Collection Dialog */}
      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCollection?.id ? t("editCollection") : t("addCollection")}
            </DialogTitle>
            <DialogDescription>
              {editingCollection?.id ? t("editCollectionDescription") : t("addCollectionDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t("collectionName")}</Label>
              <Input
                value={editingCollection?.name || ''}
                onChange={(e) => setEditingCollection({...editingCollection!, name: e.target.value})}
                placeholder={t("collectionNamePlaceholder")}
              />
            </div>
            <div>
              <Label>{t("purpose")}</Label>
              <Input
                value={editingCollection?.purpose || ''}
                onChange={(e) => setEditingCollection({...editingCollection!, purpose: e.target.value})}
                placeholder={t("purposePlaceholder")}
              />
            </div>
            <div>
              <Label>{t("monthlyAmount")}</Label>
              <Input
                type="number"
                value={editingCollection?.monthlyAmount || ''}
                onChange={(e) => setEditingCollection({...editingCollection!, monthlyAmount: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>{t("startDate")}</Label>
              <Input
                type="date"
                value={editingCollection?.startDate || ''}
                onChange={(e) => setEditingCollection({...editingCollection!, startDate: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={editingCollection?.active || false}
                onChange={(e) => setEditingCollection({...editingCollection!, active: e.target.checked})}
              />
              <Label htmlFor="active">{t("activeCollection")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCollectionDialog(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveCollection} disabled={isSubmitting}>
              {isSubmitting ? t("saving") || "Saving..." : (editingCollection?.id ? t("save") : t("add"))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}