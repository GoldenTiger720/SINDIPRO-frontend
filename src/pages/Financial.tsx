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
import { isMasterUser, isManagerUser, getStoredUser, createFinancialAccount, getFinancialAccounts } from "@/lib/auth";

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

type CollectionAccount = {
  id: number;
  name: string;
  purpose: string;
  monthlyAmount: number;
  startDate: string;
  endDate?: string;
  active: boolean;
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
  
  // Chart of Accounts state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
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
  
  // Loading and error states for API calls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountsFetchError, setAccountsFetchError] = useState<string | null>(null);
  
  // Collection accounts state
  const [collectionAccounts, setCollectionAccounts] = useState<CollectionAccount[]>([
    {
      id: 1,
      name: t('condominiumFee'),
      purpose: t('operatingExpenses'),
      monthlyAmount: 50000,
      startDate: '2024-01-01',
      active: true
    }
  ]);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionAccount | null>(null);
  
  // Market values state
  const [marketValues, setMarketValues] = useState({
    saleMin: '',
    saleMax: '',
    rentalMin: '',
    rentalMax: ''
  });
  const [marketCalculationType, setMarketCalculationType] = useState<'sale' | 'rental' | 'condominium'>('sale');
  
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
  useEffect(() => {
    if (selectedBuildingId) {
      fetchAccounts(parseInt(selectedBuildingId));
    }
  }, [selectedBuildingId]);
  
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
  
  // Handle collection account save
  const handleSaveCollection = () => {
    if (editingCollection) {
      setCollectionAccounts(collectionAccounts.map(col => 
        col.id === editingCollection.id ? { ...col, ...editingCollection } : col
      ));
    } else {
      const newId = Math.max(...collectionAccounts.map(c => c.id), 0) + 1;
      setCollectionAccounts([...collectionAccounts, {
        id: newId,
        name: editingCollection?.name || '',
        purpose: editingCollection?.purpose || '',
        monthlyAmount: editingCollection?.monthlyAmount || 0,
        startDate: editingCollection?.startDate || new Date().toISOString().split('T')[0],
        active: true
      }]);
    }
    
    setShowCollectionDialog(false);
    setEditingCollection(null);
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

  // Brazilian system functions
  const getTotalAnnualBudget = () => {
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
  
  // Generate 12-month prediction data
  const generateMonthlyPrediction = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      // Calculate total expected (remains constant)
      const totalExpected = accounts.reduce((sum, acc) => {
        const amount = acc.isMonthly ? (acc.expectedAmount || 0) : ((acc.expectedAmount || 0) / 12);
        return sum + amount;
      }, 0);
      
      // Get actual expenses for the month
      const monthKey = date.toISOString().slice(0, 7);
      const actualExpenses = monthlyExpenses
        .filter(exp => `${exp.year}-${String(exp.month).padStart(2, '0')}` === monthKey)
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      months.push({
        month: monthName,
        expected: totalExpected,
        actual: i === 0 ? actualExpenses : 0, // Only show actual for current month, zero for future
        isCurrentMonth: i === 0
      });
    }
    
    return months;
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
            {/* Building Selection - Only show for master users */}
            {isMaster && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {t("selectBuilding")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedBuildingId} onValueChange={handleBuildingChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBuildingPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building.id} value={building.id.toString()}>
                          {building.building_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
            
            {/* Chart of Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {t("chartOfAccounts")}
                  </span>
                  {isMaster && (
                    <Button 
                      onClick={() => {
                        setEditingAccount(null);
                        setNewAccount({
                          code: '',
                          name: '',
                          type: 'main',
                          expectedAmount: 0,
                          actualAmount: 0,
                          parentId: null
                        });
                        setApiError(null);
                        setShowAccountDialog(true);
                      }}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t("addAccount")}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAccounts ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {t("loadingAccounts") || "Loading accounts..."}
                    </div>
                  </div>
                ) : accountsFetchError ? (
                  <div className="py-8 text-center">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600 mb-2">{accountsFetchError}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => selectedBuildingId && fetchAccounts(parseInt(selectedBuildingId))}
                      >
                        {t("retry") || "Retry"}
                      </Button>
                    </div>
                  </div>
                ) : accounts.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <p className="mb-2">{t("noAccountsFound") || "No accounts found for this building."}</p>
                    {isMaster && (
                      <p className="text-sm">{t("addFirstAccount") || "Click 'Add Account' to create your first account."}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {accounts.map((account) => (
                    <div key={account.id} className="border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <Badge className="flex-shrink-0">{account.code}</Badge>
                          <h4 className="font-semibold text-sm sm:text-base truncate">{account.name}</h4>
                        </div>
                        {isMaster && (
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                              onClick={() => {
                                setEditingAccount(null);
                                setNewAccount({
                                  code: '',
                                  name: '',
                                  type: 'sub',
                                  expectedAmount: 0,
                                  actualAmount: 0,
                                  parentId: account.id
                                });
                                setApiError(null);
                                setShowAccountDialog(true);
                              }}
                            >
                              <Plus className="w-3 h-3" />
                              <span className="hidden sm:inline ml-1">{t("addSub")}</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                              onClick={() => {
                                setEditingAccount(account);
                                setNewAccount(account);
                                setApiError(null);
                                setShowAccountDialog(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                              <span className="hidden sm:inline ml-1">{t("edit")}</span>
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex justify-between sm:block">
                          <p className="text-muted-foreground">{t("expectedAmount")}</p>
                          <p className="font-semibold">R$ {account.expectedAmount?.toLocaleString('pt-BR')}</p>
                        </div>
                        <div className="flex justify-between sm:block">
                          <p className="text-muted-foreground">{t("actualAmount")}</p>
                          <p className="font-semibold">R$ {account.actualAmount?.toLocaleString('pt-BR')}</p>
                        </div>
                        <div className="flex justify-between sm:block">
                          <p className="text-muted-foreground">{t("variance")}</p>
                          <p className={`font-semibold ${(account.actualAmount || 0) > (account.expectedAmount || 0) ? 'text-red-600' : 'text-green-600'}`}>
                            {((account.actualAmount || 0) - (account.expectedAmount || 0) > 0 ? '+' : '')}
                            R$ {Math.abs((account.actualAmount || 0) - (account.expectedAmount || 0)).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      {account.subAccounts && account.subAccounts.length > 0 && (
                        <div className="mt-3 ml-0 sm:ml-6 space-y-2">
                          {account.subAccounts.map((sub) => (
                            <div key={sub.id} className="p-2 bg-gray-50 rounded">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Badge variant="outline" className="text-xs flex-shrink-0">{sub.code}</Badge>
                                  <span className="text-xs sm:text-sm truncate">{sub.name}</span>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 text-xs sm:text-sm">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0">
                                    <span className="text-muted-foreground whitespace-nowrap">
                                      {t("expected")}: <span className="font-semibold">R$ {sub.expectedAmount?.toLocaleString('pt-BR')}</span>
                                    </span>
                                    <span className="text-muted-foreground whitespace-nowrap">
                                      {t("actual")}: <span className="font-semibold">R$ {sub.actualAmount?.toLocaleString('pt-BR')}</span>
                                    </span>
                                  </div>
                                  {isMaster && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 flex-shrink-0"
                                      onClick={() => {
                                        setEditingAccount(sub);
                                        setNewAccount(sub);
                                        setApiError(null);
                                        setShowAccountDialog(true);
                                      }}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Budget vs Actual Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <BarChart3 className="w-5 h-5" />
                  {t("budgetVsActualChart")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={accounts.map(account => ({
                    name: account.name.length > 10 ? account.name.substring(0, 10) + '...' : account.name,
                    expected: account.expectedAmount || 0,
                    actual: account.actualAmount || 0,
                    variance: (account.actualAmount || 0) - (account.expectedAmount || 0)
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Bar dataKey="expected" fill="#8884d8" name={t("expected")} />
                    <Bar dataKey="actual" fill="#82ca9d" name={t("actual")} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* 12-Month Budget Prediction Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <TrendingUp className="w-5 h-5" />
                  {t("12MonthBudgetPrediction")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={generateMonthlyPrediction()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="expected" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name={t("predictedBudget")}
                      strokeDasharray="0"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name={t("actualExpenses")}
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        if (payload.actual === 0 && !payload.isCurrentMonth) return null;
                        return <circle cx={cx} cy={cy} r={4} fill="#82ca9d" />;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Expense Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <PieChart className="w-5 h-5" />
                  {t("expenseDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={accounts.filter(account => (account.actualAmount || 0) > 0).map(account => ({
                        name: account.name,
                        value: account.actualAmount || 0
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {accounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4'][index % 7]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    {t("annualBudget")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl font-bold text-green-600">R$ 250.000,00</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t("totalApproved")} 2024</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    {t("currentExpense")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl font-bold text-blue-600">R$ 125.430,00</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">50,2% {t("ofBudget")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    {t("remainingBalance")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl font-bold text-orange-600">R$ 124.570,00</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">49,8% {t("available")}</p>
                </CardContent>
              </Card>
            </div>

            {isMaster && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                      <BarChart3 className="w-5 h-5" />
                      {t("annualBudgetRegistry")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="account-category" className="text-xs sm:text-sm">{t("accountCategory")}</Label>
                      <select className="w-full p-2 border rounded">
                        <option>{t("maintenance")}</option>
                        <option>{t("cleaning")}</option>
                        <option>{t("security")}</option>
                        <option>{t("administration")}</option>
                        <option>{t("electricity")}</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="subcategory" className="text-xs sm:text-sm">{t("subItem")}</Label>
                      <Input id="subcategory" placeholder={t("subItemPlaceholder")} className="text-xs sm:text-sm" />
                    </div>
                    <div>
                      <Label htmlFor="budget-amount" className="text-xs sm:text-sm">{t("budgetedAmount")}</Label>
                      <Input id="budget-amount" type="number" placeholder="0,00" className="text-xs sm:text-sm" />
                    </div>
                    <Button className="w-full text-xs sm:text-sm">{t("addToBudget")}</Button>
                  </CardContent>
                </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <FileSpreadsheet className="w-5 h-5" />
                    {t("monthlyExpenses")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="expense-month" className="text-xs sm:text-sm">{t("referenceMonth")}</Label>
                    <Input 
                      id="expense-month" 
                      type="month" 
                      value={selectedExpenseMonth}
                      onChange={(e) => setSelectedExpenseMonth(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expense-category" className="text-xs sm:text-sm">{t("category")}</Label>
                    <select className="w-full p-2 border rounded">
                      <option>{t("maintenance")}</option>
                      <option>{t("cleaning")}</option>
                      <option>{t("security")}</option>
                      <option>{t("administration")}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="expense-amount" className="text-xs sm:text-sm">{t("expenseAmount")}</Label>
                    <Input id="expense-amount" type="number" placeholder="0,00" className="text-xs sm:text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2 text-xs sm:text-sm">
                      <Upload className="w-4 h-4" />
                      {t("uploadExcel")}
                    </Button>
                    <Button className="flex-1 text-xs sm:text-sm">{t("registerExpense")}</Button>
                  </div>
                </CardContent>
              </Card>
              </div>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base lg:text-lg">{t("comparativeAnalysis")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm">{t("maintenance")}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t("budgeted")}: R$ 50.000,00 | {t("spent")}: R$ 35.420,00</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold text-xs sm:text-sm">-29%</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{t("economy")}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm">{t("electricity")}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t("budgeted")}: R$ 30.000,00 | {t("spent")}: R$ 32.150,00</p>
                    </div>
                    <div className="text-right">
                      <div className="text-red-600 font-semibold text-xs sm:text-sm">+7%</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{t("aboveBudget")}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm">{t("cleaning")}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t("budgeted")}: R$ 25.000,00 | {t("spent")}: R$ 24.860,00</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold text-xs sm:text-sm">-1%</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{t("withinBudget")}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="condominium-calculations" className="space-y-6">
            {/* Collection Accounts Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    {t("collectionAccounts")}
                  </span>
                  {isMaster && (
                    <Button
                      onClick={() => {
                        setEditingCollection({
                          id: 0,
                          name: '',
                          purpose: '',
                          monthlyAmount: 0,
                          startDate: new Date().toISOString().split('T')[0],
                          active: true
                        });
                        setShowCollectionDialog(true);
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t("addCollection")}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collectionAccounts.map((collection) => (
                    <div key={collection.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{collection.name}</h4>
                          <p className="text-sm text-muted-foreground">{collection.purpose}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={collection.active ? "default" : "secondary"}>
                            {collection.active ? t("active") : t("inactive")}
                          </Badge>
                          {isMaster && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingCollection(collection);
                                setShowCollectionDialog(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{t("monthlyAmount")}: <strong>R$ {collection.monthlyAmount.toLocaleString('pt-BR')}</strong></span>
                        <span>{t("startDate")}: {new Date(collection.startDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total Collections */}
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{t("totalMonthlyCollections")}:</span>
                      <span className="font-bold text-lg">
                        R$ {collectionAccounts.filter(c => c.active).reduce((sum, c) => sum + c.monthlyAmount, 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Collection Accounts Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {t("collectionAccountsChart")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={collectionAccounts.filter(c => c.active).map(collection => ({
                    name: collection.name.length > 12 ? collection.name.substring(0, 12) + '...' : collection.name,
                    amount: collection.monthlyAmount
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Bar dataKey="amount" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Monthly Expense Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t("monthlyExpenseTrends")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={[
                    { month: 'Jan', expenses: 45000, collections: 50000, balance: 5000 },
                    { month: 'Fev', expenses: 48000, collections: 50000, balance: 2000 },
                    { month: 'Mar', expenses: 46000, collections: 52000, balance: 6000 },
                    { month: 'Abr', expenses: 47000, collections: 52000, balance: 5000 },
                    { month: 'Mai', expenses: 49000, collections: 52000, balance: 3000 },
                    { month: 'Jun', expenses: 45000, collections: 52000, balance: 7000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" name={t("expenses")} strokeWidth={2} />
                    <Line type="monotone" dataKey="collections" stroke="#10b981" name={t("collections")} strokeWidth={2} />
                    <Line type="monotone" dataKey="balance" stroke="#3b82f6" name={t("balance")} strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Calculation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                  <Calculator className="w-5 h-5" />
                  {t("expenseDistributionCalculator")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total-expense" className="text-xs sm:text-sm">{t("totalExpenseAmount")}</Label>
                    <Input
                      id="total-expense"
                      type="number"
                      placeholder="5000.00"
                      value={calculationData.totalExpense}
                      onChange={isMaster ? (e) => setCalculationData({...calculationData, totalExpense: e.target.value}) : undefined}
                      readOnly={!isMaster}
                      disabled={!isMaster}
                    />
                  </div>
                  <div>
                    <Label htmlFor="calculation-type" className="text-xs sm:text-sm">{t("calculationMethod")}</Label>
                    <Select 
                      value={calculationData.calculationType} 
                      onValueChange={isMaster ? (value) => setCalculationData({...calculationData, calculationType: value}) : undefined}
                      disabled={!isMaster}
                    >
                      <SelectTrigger disabled={!isMaster}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="area">{t("byUnitArea")}</SelectItem>
                        <SelectItem value="equal">{t("equalDistribution")}</SelectItem>
                        <SelectItem value="custom">{t("customPercentage")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                  <PieChart className="w-5 h-5" />
                  {t("costDistributionByUnit")}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Total: R$ {parseFloat(calculationData.totalExpense || "0").toFixed(2)} | 
                  {t("method")}: {calculationData.calculationType === "area" ? t("byArea") : calculationData.calculationType === "equal" ? t("equalSplit") : t("custom")}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUnits.map((unit) => {
                    const unitShare = calculateUnitShare(unit);
                    const percentage = calculationData.calculationType === "area" 
                      ? (unit.area / totalArea) * 100
                      : calculationData.calculationType === "equal"
                      ? 100 / mockUnits.length
                      : parseFloat(calculationData.customPercentages[unit.id]) || 0;

                    return (
                      <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold text-xs sm:text-sm">{t("unit")} {unit.number}</span>
                          </div>
                          <Badge variant="outline">
                            {unit.area}m²
                          </Badge>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {unit.owner}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {calculationData.calculationType === "custom" && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder={t("percentagePlaceholder")}
                                value={calculationData.customPercentages[unit.id]}
                                onChange={isMaster ? (e) => handleCustomPercentageChange(unit.id, e.target.value) : undefined}
                                className="w-20 text-center text-xs"
                                readOnly={!isMaster}
                                disabled={!isMaster}
                              />
                              <span className="text-xs sm:text-sm">%</span>
                            </div>
                          )}
                          <div className="text-right">
                            <div className="font-semibold text-sm sm:text-base">
                              R$ {unitShare.toFixed(2)}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs sm:text-sm">{t("totalDistributed")}:</span>
                    <span className="font-bold text-sm sm:text-base">
                      R$ {mockUnits.reduce((sum, unit) => sum + calculateUnitShare(unit), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - Only for master users */}
            {isMaster && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">{t("quickActions")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="flex-1 text-xs sm:text-sm px-2 py-1.5">
                      {t("exportExcel")}
                    </Button>
                    <Button variant="outline" className="flex-1 text-xs sm:text-sm px-2 py-1.5">
                      {t("generateInvoices")}
                    </Button>
                    <Button className="flex-1 text-xs sm:text-sm px-2 py-1.5">
                      {t("sendToUnits")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="marketing-values" className="space-y-6">
            {/* Building and Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {t("buildingInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedBuilding ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p><strong>{t("building")}:</strong> {selectedBuilding.building_name}</p>
                      {selectedBuilding.address && (
                        <>
                          <p><strong>{t("neighborhood")}:</strong> {selectedBuilding.address.neighborhood}</p>
                          <p><strong>{t("city")}:</strong> {selectedBuilding.address.city}</p>
                        </>
                      )}
                    </div>
                    <div>
                      <Label>{t("calculationMethod")}</Label>
                      <Select 
                        value={marketCalculationType} 
                        onValueChange={(value) => setMarketCalculationType(value as 'sale' | 'rental' | 'condominium')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">{t("saleValue")}</SelectItem>
                          <SelectItem value="rental">{t("rentalValue")}</SelectItem>
                          <SelectItem value="condominium">{t("condominiumValue")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t("selectBuildingFirst")}</p>
                )}
              </CardContent>
            </Card>
            
            {/* Market Values */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t("marketValueRanges")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">{t("saleValuePerM2")}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>{t("minimum")}</Label>
                        <Input
                          placeholder="R$ 10.000,00"
                          value={marketValues.saleMin}
                          onChange={isMaster ? (e) => setMarketValues({...marketValues, saleMin: e.target.value}) : undefined}
                          readOnly={!isMaster}
                          disabled={!isMaster}
                        />
                      </div>
                      <div>
                        <Label>{t("maximum")}</Label>
                        <Input
                          placeholder="R$ 14.000,00"
                          value={marketValues.saleMax}
                          onChange={isMaster ? (e) => setMarketValues({...marketValues, saleMax: e.target.value}) : undefined}
                          readOnly={!isMaster}
                          disabled={!isMaster}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">{t("rentalValuePerM2")}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>{t("minimum")}</Label>
                        <Input
                          placeholder="R$ 45,00"
                          value={marketValues.rentalMin}
                          onChange={isMaster ? (e) => setMarketValues({...marketValues, rentalMin: e.target.value}) : undefined}
                          readOnly={!isMaster}
                          disabled={!isMaster}
                        />
                      </div>
                      <div>
                        <Label>{t("maximum")}</Label>
                        <Input
                          placeholder="R$ 65,00"
                          value={marketValues.rentalMax}
                          onChange={isMaster ? (e) => setMarketValues({...marketValues, rentalMax: e.target.value}) : undefined}
                          readOnly={!isMaster}
                          disabled={!isMaster}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {t("marketValueNote")}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Units Market Values */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                  <Home className="w-5 h-5" />
                  {marketCalculationType === 'sale' ? t("saleValuesSpreadsheet") : 
                   marketCalculationType === 'rental' ? t("rentalValuesSpreadsheet") : 
                   t("condominiumValuesSpreadsheet")}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {marketCalculationType === 'sale' ? t("totalMarketValueSale") : 
                   marketCalculationType === 'rental' ? t("totalMarketValueRental") : 
                   t("totalMarketValueCondominium")}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h4 className="font-semibold text-xs sm:text-sm">{t("currentAnnualBudget")}: R$ {getTotalAnnualBudget().toLocaleString()}</h4>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button variant="outline" onClick={importFromExcel} className="text-xs sm:text-sm px-3 py-2">
                        <Upload className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">{t("importExcel")}</span>
                      </Button>
                      <Button variant="outline" onClick={exportToExcel} className="text-xs sm:text-sm px-3 py-2">
                        <Download className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">{t("exportExcelBrazilian")}</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[60px]">{t("unit")}</TableHead>
                          <TableHead className="min-w-[60px]">{t("area")} (m²)</TableHead>
                          <TableHead className="min-w-[100px]">
                            {marketCalculationType === 'sale' ? t("salePerM2") : 
                             marketCalculationType === 'rental' ? t("rentalPerM2") : 
                             t("condominiumPerM2")}
                          </TableHead>
                          <TableHead className="min-w-[100px]">
                            {marketCalculationType === 'sale' ? t("totalSaleValue") : 
                             marketCalculationType === 'rental' ? t("totalRentalValue") : 
                             t("monthlyCondominiumValue")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {brazilianData.units.map((unit) => {
                          const condominiumPerM2 = calculateUnitMonthlyFee(unit) / unit.area;
                          const avgRentalPerM2 = marketValues.rentalMin && marketValues.rentalMax ? 
                            (parseFloat(marketValues.rentalMin.replace(/[^0-9,]/g, '').replace(',', '.')) + 
                             parseFloat(marketValues.rentalMax.replace(/[^0-9,]/g, '').replace(',', '.'))) / 2 : 55;
                          const avgSalePerM2 = marketValues.saleMin && marketValues.saleMax ? 
                            (parseFloat(marketValues.saleMin.replace(/[^0-9,]/g, '').replace(',', '.')) + 
                             parseFloat(marketValues.saleMax.replace(/[^0-9,]/g, '').replace(',', '.'))) / 2 : 12000;
                          
                          return (
                            <TableRow key={unit.id}>
                              <TableCell className="font-medium text-xs sm:text-sm">{unit.number}</TableCell>
                              <TableCell className="text-xs sm:text-sm">{unit.area.toFixed(1)}</TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                R$ {
                                  marketCalculationType === 'sale' ? avgSalePerM2.toLocaleString('pt-BR') : 
                                  marketCalculationType === 'rental' ? avgRentalPerM2.toFixed(2) : 
                                  condominiumPerM2.toFixed(2)
                                }
                              </TableCell>
                              <TableCell className={`font-semibold text-xs sm:text-sm ${
                                marketCalculationType === 'sale' ? 'text-green-600' : 
                                marketCalculationType === 'rental' ? 'text-blue-600' : 
                                'text-orange-600'
                              }`}>
                                R$ {
                                  marketCalculationType === 'sale' ? (unit.area * avgSalePerM2).toLocaleString('pt-BR') : 
                                  marketCalculationType === 'rental' ? (unit.area * avgRentalPerM2).toFixed(2) : 
                                  calculateUnitMonthlyFee(unit).toFixed(2)
                                }
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className={`p-4 rounded-lg ${
                      marketCalculationType === 'sale' ? 'bg-green-50' : 
                      marketCalculationType === 'rental' ? 'bg-blue-50' : 
                      'bg-orange-50'
                    }`}>
                      <h4 className={`font-semibold mb-2 ${
                        marketCalculationType === 'sale' ? 'text-green-900' : 
                        marketCalculationType === 'rental' ? 'text-blue-900' : 
                        'text-orange-900'
                      }`}>{t("marketAnalysis")}</h4>
                      <p className={`text-sm ${
                        marketCalculationType === 'sale' ? 'text-green-800' : 
                        marketCalculationType === 'rental' ? 'text-blue-800' : 
                        'text-orange-800'
                      }`}>
                        {marketCalculationType === 'sale' ? t("totalBuildingValue") : 
                         marketCalculationType === 'rental' ? t("totalMonthlyRentalValue") : 
                         t("totalMonthlyCondominiumValue")}: 
                        <strong className={`${
                          marketCalculationType === 'sale' ? 'text-green-600' : 
                          marketCalculationType === 'rental' ? 'text-blue-600' : 
                          'text-orange-600'
                        }`}>
                          R$ {brazilianData.units.reduce((sum, unit) => {
                            if (marketCalculationType === 'sale') {
                              const avgSalePerM2 = marketValues.saleMin && marketValues.saleMax ? 
                                (parseFloat(marketValues.saleMin.replace(/[^0-9,]/g, '').replace(',', '.')) + 
                                 parseFloat(marketValues.saleMax.replace(/[^0-9,]/g, '').replace(',', '.'))) / 2 : 12000;
                              return sum + (unit.area * avgSalePerM2);
                            } else if (marketCalculationType === 'rental') {
                              const avgRentalPerM2 = marketValues.rentalMin && marketValues.rentalMax ? 
                                (parseFloat(marketValues.rentalMin.replace(/[^0-9,]/g, '').replace(',', '.')) + 
                                 parseFloat(marketValues.rentalMax.replace(/[^0-9,]/g, '').replace(',', '.'))) / 2 : 55;
                              return sum + (unit.area * avgRentalPerM2);
                            } else {
                              return sum + calculateUnitMonthlyFee(unit);
                            }
                          }, 0).toLocaleString('pt-BR')}
                        </strong>
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">{t("exportOptions")}</h4>
                      <Button variant="outline" className="w-full" onClick={exportToExcel}>
                        <Download className="w-4 h-4 mr-2" />
                        {t("exportMarketAnalysis")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Market Values Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {t("marketValuesComparison")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={brazilianData.units.slice(0, 8).map(unit => {
                    const avgRentalPerM2 = marketValues.rentalMin && marketValues.rentalMax ? 
                      (parseFloat(marketValues.rentalMin.replace(/[^0-9,]/g, '').replace(',', '.')) + 
                       parseFloat(marketValues.rentalMax.replace(/[^0-9,]/g, '').replace(',', '.'))) / 2 : 55;
                    const avgSalePerM2 = marketValues.saleMin && marketValues.saleMax ? 
                      (parseFloat(marketValues.saleMin.replace(/[^0-9,]/g, '').replace(',', '.')) + 
                       parseFloat(marketValues.saleMax.replace(/[^0-9,]/g, '').replace(',', '.'))) / 2 : 12000;
                    
                    return {
                      unit: unit.number,
                      rental: unit.area * avgRentalPerM2,
                      saleValue: unit.area * avgSalePerM2 / 1000, // Divide by 1000 to show in thousands
                      condoFee: calculateUnitMonthlyFee(unit)
                    };
                  })}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="unit" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => {
                      if (name === t("monthlyRental") || name === t("condoFee")) return `R$ ${value.toLocaleString('pt-BR')}`;
                      return `R$ ${(value * 1000).toLocaleString('pt-BR')}`;
                    }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="rental" fill="#8884d8" name={t("monthlyRental")} />
                    <Bar yAxisId="left" dataKey="condoFee" fill="#ff7300" name={t("condoFee")} />
                    <Bar yAxisId="right" dataKey="saleValue" fill="#82ca9d" name={t("saleValueThousands")} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Unit Characteristics Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t("unitCharacteristics")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { subject: t("area"), unit101: 85, unit102: 90, unit201: 85, fullMark: 100 },
                    { subject: t("location"), unit101: 90, unit102: 85, unit201: 88, fullMark: 100 },
                    { subject: t("condition"), unit101: 86, unit102: 95, unit201: 80, fullMark: 100 },
                    { subject: t("amenities"), unit101: 80, unit102: 88, unit201: 85, fullMark: 100 },
                    { subject: t("view"), unit101: 85, unit102: 90, unit201: 75, fullMark: 100 },
                    { subject: t("parking"), unit101: 100, unit102: 100, unit201: 100, fullMark: 100 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Unit 101" dataKey="unit101" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Radar name="Unit 102" dataKey="unit102" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    <Radar name="Unit 201" dataKey="unit201" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Price Trends Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t("marketTrends")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Jan 2024', salePrice: 11500, rentalPrice: 52, condoFee: 15 },
                    { month: 'Fev 2024', salePrice: 11800, rentalPrice: 53, condoFee: 15 },
                    { month: 'Mar 2024', salePrice: 12000, rentalPrice: 54, condoFee: 16 },
                    { month: 'Abr 2024', salePrice: 12200, rentalPrice: 55, condoFee: 16 },
                    { month: 'Mai 2024', salePrice: 12400, rentalPrice: 56, condoFee: 16 },
                    { month: 'Jun 2024', salePrice: 12500, rentalPrice: 57, condoFee: 17 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => {
                      if (name.includes('Price')) return `R$ ${value.toLocaleString('pt-BR')}/m²`;
                      return `R$ ${value}/m²`;
                    }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="salePrice" stroke="#8884d8" name={t("salePrice")} strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="rentalPrice" stroke="#82ca9d" name={t("rentalPrice")} strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="condoFee" stroke="#ff7300" name={t("condoFeePerM2")} strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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
            <Button onClick={handleSaveCollection}>
              {editingCollection?.id ? t("save") : t("add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}