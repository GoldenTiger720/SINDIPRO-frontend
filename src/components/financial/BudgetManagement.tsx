import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, TrendingUp, DollarSign, FileSpreadsheet, Plus, Edit, Trash2, Building2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface BudgetManagementProps {
  // User and permissions
  isMaster: boolean;
  user: any;
  
  // Building selection
  buildings: any[];
  selectedBuildingId: string;
  selectedBuilding: any;
  handleBuildingChange: (buildingId: string) => void;
  
  // Account management
  accounts: any[];
  editingAccount: any;
  newAccount: any;
  showAccountDialog: boolean;
  apiError: string | null;
  setEditingAccount: (account: any) => void;
  setNewAccount: (account: any) => void;
  setShowAccountDialog: (show: boolean) => void;
  setApiError: (error: string | null) => void;
  handleSaveAccount: () => void;
  handleDeleteAccount: (accountId: number) => void;
  
  // Expense management
  selectedExpenseMonth: string;
  expenseCategory: string;
  expenseAmount: string;
  setSelectedExpenseMonth: (month: string) => void;
  setExpenseCategory: (category: string) => void;
  setExpenseAmount: (amount: string) => void;
  handleRegisterExpense: () => void;
  isSubmitting: boolean;
  
  // Budget management
  annualBudgetForm: any;
  setAnnualBudgetForm: (form: any) => void;
  handleAddToBudget: () => void;
  isSubmittingBudget: boolean;
  
  // Data processing functions
  generateBudgetVsActualData: () => any[];
  generateMonthlyPrediction: () => any[];
  getTotalAnnualBudget: () => number;
  getTotalCurrentExpenses: () => number;
  getRemainingBalance: () => number;
  generateComparativeAnalysisData: () => any[];
}

export function BudgetManagement({
  isMaster,
  user,
  buildings,
  selectedBuildingId,
  selectedBuilding,
  handleBuildingChange,
  accounts,
  editingAccount,
  newAccount,
  showAccountDialog,
  apiError,
  setEditingAccount,
  setNewAccount,
  setShowAccountDialog,
  setApiError,
  handleSaveAccount,
  handleDeleteAccount,
  selectedExpenseMonth,
  expenseCategory,
  expenseAmount,
  setSelectedExpenseMonth,
  setExpenseCategory,
  setExpenseAmount,
  handleRegisterExpense,
  isSubmitting,
  annualBudgetForm,
  setAnnualBudgetForm,
  handleAddToBudget,
  isSubmittingBudget,
  generateBudgetVsActualData,
  generateMonthlyPrediction,
  getTotalAnnualBudget,
  getTotalCurrentExpenses,
  getRemainingBalance,
  generateComparativeAnalysisData
}: BudgetManagementProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
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
              >
                <Plus className="w-4 h-4 mr-1" />
                {t("addAccount")}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">{t("code")}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t("accountName")}</TableHead>
                  <TableHead className="text-xs sm:text-sm text-right">{t("expected")}</TableHead>
                  <TableHead className="text-xs sm:text-sm text-right">{t("actual")}</TableHead>
                  <TableHead className="text-xs sm:text-sm text-right">{t("variance")}</TableHead>
                  {isMaster && <TableHead className="text-xs sm:text-sm text-center">{t("actions")}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono text-xs">{account.code}</TableCell>
                    <TableCell className="text-xs">{account.name}</TableCell>
                    <TableCell className="text-right text-xs">
                      R$ {(account.expectedAmount || 0).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      R$ {(account.actualAmount || 0).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      <Badge variant={(account.actualAmount || 0) > (account.expectedAmount || 0) ? "destructive" : "secondary"}>
                        {((account.actualAmount || 0) - (account.expectedAmount || 0)).toLocaleString('pt-BR', { signDisplay: 'always' })}
                      </Badge>
                    </TableCell>
                    {isMaster && (
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingAccount(account);
                              setNewAccount(account);
                              setShowAccountDialog(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
            <BarChart data={generateBudgetVsActualData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar key="expected" dataKey="expected" fill="#8884d8" name={t("expected")} />
              <Bar key="actual" dataKey="actual" fill="#82ca9d" name={t("actual")} />
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
                key="expected"
                type="monotone" 
                dataKey="expected" 
                stroke="#8884d8" 
                strokeWidth={2}
                name={t("predictedBudget")}
                strokeDasharray="0"
              />
              <Line 
                key="actual"
                type="monotone" 
                dataKey="actual" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name={t("actualExpenses")}
                dot={(props) => {
                  const { cx, cy, payload, index } = props;
                  if (payload.actual === 0 && !payload.isCurrentMonth) return null;
                  return <circle key={`dot-${index}`} cx={cx} cy={cy} r={4} fill="#82ca9d" />;
                }}
              />
            </LineChart>
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
            <div className="text-lg sm:text-xl font-bold text-green-600">
              R$ {getTotalAnnualBudget().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("totalApproved")} {new Date().getFullYear()}</p>
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
            <div className="text-lg sm:text-xl font-bold text-blue-600">
              R$ {getTotalCurrentExpenses().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {getTotalAnnualBudget() > 0 ? ((getTotalCurrentExpenses() / getTotalAnnualBudget()) * 100).toFixed(1) : 0}% {t("ofBudget")}
            </p>
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
            <div className={`text-lg sm:text-xl font-bold ${getRemainingBalance() >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
              R$ {getRemainingBalance().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {getTotalAnnualBudget() > 0 ? ((getRemainingBalance() / getTotalAnnualBudget()) * 100).toFixed(1) : 0}% {t("available")}
            </p>
          </CardContent>
        </Card>
      </div>

      {isMaster && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <select 
                  className="w-full p-2 border rounded"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="maintenance">{t("maintenance")}</option>
                  <option value="cleaning">{t("cleaning")}</option>
                  <option value="security">{t("security")}</option>
                  <option value="administration">{t("administration")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="expense-amount" className="text-xs sm:text-sm">{t("expenseAmount")}</Label>
                <Input 
                  id="expense-amount" 
                  type="number" 
                  placeholder="0,00" 
                  className="text-xs sm:text-sm"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  className="w-full text-xs sm:text-sm"
                  onClick={handleRegisterExpense}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("registering") : t("registerExpense")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparative Analysis */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base lg:text-lg">{t("comparativeAnalysis")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generateComparativeAnalysisData().map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm capitalize">{item.category}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("budgeted")}: R$ {item.budgeted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | {' '}
                    {t("spent")}: R$ {item.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-xs sm:text-sm ${item.statusColor}`}>
                    {item.varianceSign}{item.variancePercent.toFixed(1)}%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{t(item.status)}</div>
                </div>
              </div>
            ))}
            {generateComparativeAnalysisData().length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">{t("noDataAvailable")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}