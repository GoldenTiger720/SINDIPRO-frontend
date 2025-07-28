import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Droplets, Zap, Flame, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";

export default function Consumption() {
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
            <Calculator className="w-6 h-6 text-blue-500" />
            <h1 className="text-3xl font-bold">{t("consumptionModule")}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
{t("water")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2.450 m³</div>
              <p className="text-sm text-muted-foreground">{t("monthlyConsumption")}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+5% {t("vsLastMonth")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
{t("electricity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">8.920 kWh</div>
              <p className="text-sm text-muted-foreground">{t("monthlyConsumption")}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                <span className="text-sm text-red-600">-3% {t("vsLastMonth")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
{t("gas")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">1.240 m³</div>
              <p className="text-sm text-muted-foreground">{t("monthlyConsumption")}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+2% {t("vsLastMonth")}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
{t("insertDailyMonthlyConsumption")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="consumption-type">{t("consumptionType")}</Label>
                <select className="w-full p-2 border rounded">
                  <option value="water">{t("water")}</option>
                  <option value="electricity">{t("electricity")}</option>
                  <option value="gas">{t("gas")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="consumption-period">{t("period")}</Label>
                <select className="w-full p-2 border rounded">
                  <option value="daily">{t("daily")}</option>
                  <option value="monthly">{t("monthly")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="consumption-date">{t("date")}</Label>
                <Input id="consumption-date" type="date" />
              </div>
              <div>
                <Label htmlFor="consumption-value">{t("consumptionValue")}</Label>
                <Input id="consumption-value" type="number" placeholder="0.00" />
              </div>
              <Button className="w-full">{t("registerConsumption")}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
{t("consumptionTrendChart")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{t("last12MonthsChart")}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("interactiveVisualization")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("monthlyConsumptionHistory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">{t("january")} 2024</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p>{t("water")}: 2.320 m³</p>
                  <p>{t("electricity")}: 9.200 kWh</p>
                  <p>{t("gas")}: 1.180 m³</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">{t("december")} 2023</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p>{t("water")}: 2.150 m³</p>
                  <p>{t("electricity")}: 8.950 kWh</p>
                  <p>{t("gas")}: 1.220 m³</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">{t("automaticAverage")}</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{t("systemCalculatesAutomatically")}</p>
                  <p>{t("averageWhenNotEntered")}</p>
                  <p>{t("basedOnHistory")}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("directFieldAppEntry")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("directFieldAppEntryDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("periodicConsumptionChart")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("periodicConsumptionChartDesc")}
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