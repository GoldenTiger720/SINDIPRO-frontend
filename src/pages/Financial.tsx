import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BarChart3, Upload, TrendingUp, DollarSign, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";

export default function Financial() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("relatedFeatures")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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