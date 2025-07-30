import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, BarChart3, Upload, TrendingUp, DollarSign, FileSpreadsheet, Calculator, Home, PieChart, FileText, Download, Edit, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState } from "react";

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

export default function Financial() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [calculationData, setCalculationData] = useState({
    totalExpense: "5000",
    calculationType: "area",
    customPercentages: mockUnits.reduce((acc, unit) => ({
      ...acc,
      [unit.id]: unit.percentage.toString()
    }), {} as Record<number, string>)
  });

  // Brazilian system state
  const [brazilianData, setBrazilianData] = useState({
    budgetAccounts: mockBudgetAccounts,
    monthlyExpenses: mockMonthlyExpenses,
    units: mockUnits,
    selectedMonth: "Janeiro",
    editingAccount: null as any,
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
    const subAccounts: any[] = [];
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
    alert("Excel export functionality would be implemented here");
  };

  const importFromExcel = () => {
    // This would allow importing Excel files to update budget data
    alert("Excel import functionality would be implemented here");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
{t("backToDashboard")}
          </Button>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-500" />
            <h1 className="text-3xl font-bold">{t("financialBudgetManagement")}</h1>
          </div>
        </div>

        <Tabs defaultValue="budget-management" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="budget-management" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Budget Management
            </TabsTrigger>
            <TabsTrigger value="condominium-calculations" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Condominium Calculations
            </TabsTrigger>
            <TabsTrigger value="brazilian-system" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Brazilian System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="budget-management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    {t("annualBudget")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">R$ 250.000,00</div>
                  <p className="text-sm text-muted-foreground">{t("totalApproved")} 2024</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    {t("currentExpense")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">R$ 125.430,00</div>
                  <p className="text-sm text-muted-foreground">50,2% {t("ofBudget")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    {t("remainingBalance")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">R$ 124.570,00</div>
                  <p className="text-sm text-muted-foreground">49,8% {t("available")}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {t("annualBudgetRegistry")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="account-category">{t("accountCategory")}</Label>
                    <select className="w-full p-2 border rounded">
                      <option>{t("maintenance")}</option>
                      <option>{t("cleaning")}</option>
                      <option>{t("security")}</option>
                      <option>{t("administration")}</option>
                      <option>{t("electricity")}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">{t("subItem")}</Label>
                    <Input id="subcategory" placeholder={t("subItemPlaceholder")} />
                  </div>
                  <div>
                    <Label htmlFor="budget-amount">{t("budgetedAmount")}</Label>
                    <Input id="budget-amount" type="number" placeholder="0,00" />
                  </div>
                  <Button className="w-full">{t("addToBudget")}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    {t("monthlyExpenses")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="expense-category">{t("category")}</Label>
                    <select className="w-full p-2 border rounded">
                      <option>{t("maintenance")}</option>
                      <option>{t("cleaning")}</option>
                      <option>{t("security")}</option>
                      <option>{t("administration")}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="expense-amount">{t("expenseAmount")}</Label>
                    <Input id="expense-amount" type="number" placeholder="0,00" />
                  </div>
                  <div>
                    <Label htmlFor="expense-date">{t("date")}</Label>
                    <Input id="expense-date" type="date" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Upload className="w-4 h-4" />
                      {t("uploadExcel")}
                    </Button>
                    <Button className="flex-1">{t("registerExpense")}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("comparativeAnalysis")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{t("maintenance")}</h3>
                      <p className="text-sm text-muted-foreground">{t("budgeted")}: R$ 50.000,00 | {t("spent")}: R$ 35.420,00</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">-29%</div>
                      <div className="text-sm text-muted-foreground">{t("economy")}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{t("electricity")}</h3>
                      <p className="text-sm text-muted-foreground">{t("budgeted")}: R$ 30.000,00 | {t("spent")}: R$ 32.150,00</p>
                    </div>
                    <div className="text-right">
                      <div className="text-red-600 font-semibold">+7%</div>
                      <div className="text-sm text-muted-foreground">{t("aboveBudget")}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{t("cleaning")}</h3>
                      <p className="text-sm text-muted-foreground">{t("budgeted")}: R$ 25.000,00 | {t("spent")}: R$ 24.860,00</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">-1%</div>
                      <div className="text-sm text-muted-foreground">{t("withinBudget")}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="condominium-calculations" className="space-y-6">
            {/* Calculation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Expense Distribution Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total-expense">Total Expense Amount (R$)</Label>
                    <Input
                      id="total-expense"
                      type="number"
                      placeholder="5000.00"
                      value={calculationData.totalExpense}
                      onChange={(e) => setCalculationData({...calculationData, totalExpense: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="calculation-type">Calculation Method</Label>
                    <Select value={calculationData.calculationType} onValueChange={(value) => setCalculationData({...calculationData, calculationType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="area">By Unit Area</SelectItem>
                        <SelectItem value="equal">Equal Distribution</SelectItem>
                        <SelectItem value="custom">Custom Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Cost Distribution by Unit
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Total: R$ {parseFloat(calculationData.totalExpense || "0").toFixed(2)} | 
                  Method: {calculationData.calculationType === "area" ? "By Area" : calculationData.calculationType === "equal" ? "Equal Split" : "Custom"}
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
                            <span className="font-semibold">Unit {unit.number}</span>
                          </div>
                          <Badge variant="outline">
                            {unit.area}m²
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {unit.owner}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {calculationData.calculationType === "custom" && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="8.5"
                                value={calculationData.customPercentages[unit.id]}
                                onChange={(e) => handleCustomPercentageChange(unit.id, e.target.value)}
                                className="w-20 text-center"
                              />
                              <span className="text-sm">%</span>
                            </div>
                          )}
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              R$ {unitShare.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
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
                    <span className="font-semibold">Total Distributed:</span>
                    <span className="font-bold text-lg">
                      R$ {mockUnits.reduce((sum, unit) => sum + calculateUnitShare(unit), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Export to Excel
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Generate Invoices
                  </Button>
                  <Button className="flex-1">
                    Send to Units
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brazilian-system" className="space-y-6">
            {/* Ideal Fractions Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Ideal Fractions Management (Fração Ideal)
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Configure the percentage of total condominium expenses each unit is responsible for
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Current Annual Budget: R$ {getTotalAnnualBudget().toLocaleString()}</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={importFromExcel}>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Excel
                      </Button>
                      <Button variant="outline" onClick={exportToExcel}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unit</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Area (m²)</TableHead>
                        <TableHead>Ideal Fraction</TableHead>
                        <TableHead>Monthly Fee</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {brazilianData.units.map((unit) => (
                        <TableRow key={unit.id}>
                          <TableCell className="font-medium">{unit.number}</TableCell>
                          <TableCell>{unit.owner}</TableCell>
                          <TableCell>{unit.area}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.001"
                              className="w-20"
                              value={unit.idealFraction}
                              onChange={(e) => {
                                const newUnits = brazilianData.units.map(u => 
                                  u.id === unit.id ? {...u, idealFraction: parseFloat(e.target.value) || 0} : u
                                );
                                setBrazilianData({...brazilianData, units: newUnits});
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            R$ {calculateUnitMonthlyFee(unit).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Total Ideal Fractions:</span>
                      <span className="font-bold">
                        {brazilianData.units.reduce((sum, unit) => sum + unit.idealFraction, 0).toFixed(3)}
                        {brazilianData.units.reduce((sum, unit) => sum + unit.idealFraction, 0) !== 1.0 && 
                          <span className="text-red-500 ml-2">(Should equal 1.0)</span>
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Matrix Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Annual Budget Matrix
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Main accounts and sub-accounts structure as approved in Assembly
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brazilianData.budgetAccounts.map((account) => (
                    <div key={account.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="default" className="bg-slate-700">
                            {account.code}
                          </Badge>
                          <h3 className="font-bold text-lg">{account.name}</h3>
                          <span className="text-xl font-bold text-green-600">
                            R$ {account.annualBudget.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Sub-account
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="ml-6 space-y-2">
                        {account.subAccounts?.map((subAccount) => (
                          <div key={subAccount.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">{subAccount.code}</Badge>
                              <span>{subAccount.name}</span>
                              <span className="font-semibold text-green-600">
                                R$ {subAccount.annualBudget.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Tracking vs Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Tracking vs Forecast
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Label>Select Month:</Label>
                  <Select value={brazilianData.selectedMonth} onValueChange={(value) => setBrazilianData({...brazilianData, selectedMonth: value})}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Monthly Budget</TableHead>
                      <TableHead>Actual Expense</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getAllSubAccounts().map((subAccount) => {
                      const monthlyBudget = getMonthlyBudget(subAccount.id);
                      const actualExpense = getMonthlyExpense(subAccount.id, brazilianData.selectedMonth);
                      const variance = actualExpense - monthlyBudget;
                      const variancePercent = monthlyBudget > 0 ? (variance / monthlyBudget) * 100 : 0;
                      
                      return (
                        <TableRow key={subAccount.id}>
                          <TableCell>
                            <Badge variant="outline">{subAccount.code}</Badge>
                          </TableCell>
                          <TableCell>{subAccount.name}</TableCell>
                          <TableCell>R$ {monthlyBudget.toFixed(2)}</TableCell>
                          <TableCell>R$ {actualExpense.toFixed(2)}</TableCell>
                          <TableCell className={variance >= 0 ? "text-red-600" : "text-green-600"}>
                            R$ {Math.abs(variance).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={Math.abs(variancePercent) > 10 ? "destructive" : variancePercent > 0 ? "secondary" : "default"}>
                              {variancePercent > 0 ? "+" : ""}{variancePercent.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Template Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Standard Template Generator
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Generate standardized spreadsheets for administrators to complete and submit
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="flex-1 gap-2">
                    <Download className="w-4 h-4" />
                    Download Monthly Expense Template
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Download className="w-4 h-4" />
                    Download Budget Template
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Download className="w-4 h-4" />
                    Download Ideal Fractions Template
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Template Instructions:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Templates include all current account structures</li>
                    <li>• Pre-filled with current budget values for reference</li>
                    <li>• Color-coded cells indicate which fields should be filled</li>
                    <li>• Built-in validation to prevent errors</li>
                    <li>• Ready for import back into the system</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("relatedFeatures")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Brazilian System
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete Brazilian condominium management with ideal fractions, budget matrix, and monthly tracking vs forecast.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Condominium Calculator
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automatically calculate and distribute expenses across units based on area, equality, or custom percentages.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("excelUploadAndAnalysis")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("excelUploadAndAnalysisDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("automaticBudgetComparison")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("automaticBudgetComparisonDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("automaticReportGeneration")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("automaticReportGenerationDesc")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}