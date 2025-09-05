import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, BarChart3, Calculator, Plus, Edit } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTranslation } from "react-i18next";

interface CollectionAccount {
  id: number;
  name: string;
  purpose: string;
  monthlyAmount: number;
  startDate: string;
  active: boolean;
}

interface ExpenseData {
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

interface AnnualBudgetData {
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

interface FinancialAccount {
  id: number;
  code: string;
  name: string;
  type: 'main' | 'sub';
  expectedAmount: number;
  actualAmount: number;
  parentId?: number;
  subAccounts?: FinancialAccount[];
}

interface CondominiumCalculationsProps {
  // User permissions
  isMaster: boolean;
  
  // Collection accounts
  collectionAccounts: CollectionAccount[];
  setEditingCollection: (collection: any) => void;
  setShowCollectionDialog: (show: boolean) => void;
  
  // Backend data
  expensesData: ExpenseData[];
  annualBudgetData: AnnualBudgetData[];
  accounts: FinancialAccount[];
  
  // Data and functions from parent
  brazilianData: any;
}

export function CondominiumCalculations({
  isMaster,
  collectionAccounts,
  setEditingCollection,
  setShowCollectionDialog,
  expensesData,
  annualBudgetData,
  accounts,
  brazilianData
}: CondominiumCalculationsProps) {
  const { t } = useTranslation();

  // Process backend data for charts
  const processFinancialFlowData = () => {
    // Ensure expensesData exists and is an array
    if (!expensesData || !Array.isArray(expensesData)) {
      return [];
    }

    // Group expenses by month
    const expensesByMonth = expensesData.reduce((acc, expense) => {
      // Ensure expense and reference_month exist
      if (!expense || !expense.reference_month) {
        return acc;
      }
      
      const month = expense.reference_month.slice(0, 7); // YYYY-MM format
      const monthName = new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short' });
      
      if (!acc[monthName]) {
        acc[monthName] = 0;
      }
      acc[monthName] += parseFloat(expense.amount || '0');
      return acc;
    }, {} as Record<string, number>);

    // Calculate total monthly collections from collection accounts
    const totalMonthlyCollections = (collectionAccounts || [])
      .filter(c => c && c.active)
      .reduce((sum, c) => sum + (c.monthlyAmount || 0), 0);

    // Generate data for last 6 months
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map(month => {
      const expenses = expensesByMonth[month] || 0;
      const collections = totalMonthlyCollections;
      const balance = collections - expenses;
      
      return {
        month,
        expenses,
        collections,
        balance
      };
    });
  };

  const processExpenseDistributionData = () => {
    // Ensure expensesData exists and is an array
    if (!expensesData || !Array.isArray(expensesData)) {
      return [];
    }

    // Group expenses by category
    const expensesByCategory = expensesData.reduce((acc, expense) => {
      // Ensure expense and category exist
      if (!expense || !expense.category) {
        return acc;
      }
      
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += parseFloat(expense.amount || '0');
      return acc;
    }, {} as Record<string, number>);

    // Convert to array for pie chart
    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  };

  const processUnitComparisonData = () => {
    // Ensure expensesData exists and is an array
    if (!expensesData || !Array.isArray(expensesData)) {
      return [];
    }

    // Group expenses by category for radar chart
    const categories = ['Manutenção', 'Limpeza', 'Segurança', 'Administração', 'Elevador', 'Água'];
    
    return categories.map(category => {
      const categoryExpenses = expensesData
        .filter(expense => expense && expense.category && expense.category.toLowerCase().includes(category.toLowerCase()))
        .reduce((sum, expense) => sum + parseFloat(expense.amount || '0'), 0);
      
      // Simulate data for 3 units based on area proportion
      const unit101 = Math.max(85, categoryExpenses * 0.3);
      const unit102 = Math.max(90, categoryExpenses * 0.35);
      const unit201 = Math.max(85, categoryExpenses * 0.35);
      
      return {
        subject: category,
        unit101,
        unit102,
        unit201
      };
    });
  };

  const financialFlowData = processFinancialFlowData();
  const expenseDistributionData = processExpenseDistributionData();
  const unitComparisonData = processUnitComparisonData();

  return (
    <div className="space-y-6">
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
                    id: null,
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
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("monthlyAmount")}: R$ {collection.monthlyAmount.toLocaleString('pt-BR')}</span>
                  <span className="text-muted-foreground">{t("startDate")}: {collection.startDate}</span>
                </div>
              </div>
            ))}
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
        <CardContent className="p-2 sm:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={collectionAccounts.filter(c => c.active).map(collection => ({
              name: collection.name.length > 12 ? collection.name.substring(0, 12) + '...' : collection.name,
              amount: collection.monthlyAmount
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Bar key="amount" dataKey="amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Financial Flow Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t("financialFlowAnalysis")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={financialFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar key="expenses" dataKey="expenses" fill="#ef4444" name={t("expenses")} />
              <Bar key="collections" dataKey="collections" fill="#10b981" name={t("collections")} />
              <Bar key="balance" dataKey="balance" fill="#3b82f6" name={t("balance")} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {isMaster && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
              <Calculator className="w-5 h-5" />
              {t("expenseDistributionCalculator")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Cost Distribution by Unit */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {t("expenseDistribution")}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      key="expenseDistribution"
                      data={expenseDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseDistributionData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Unit Comparison Radar */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("unitComparisonRadar")}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={unitComparisonData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 'dataMax + 50']} />
                    <Radar key="unit101" name="Unit 101" dataKey="unit101" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Radar key="unit102" name="Unit 102" dataKey="unit102" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    <Radar key="unit201" name="Unit 201" dataKey="unit201" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}