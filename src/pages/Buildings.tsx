import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, Plus, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";

export default function Buildings() {
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
            <Building2 className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">{t("basicCondominiumRegistry")}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t("basicBuildingInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="building-name">{t("buildingName")}</Label>
                <Input id="building-name" placeholder={t("enterBuildingName")} />
              </div>
              <div>
                <Label htmlFor="building-type">{t("buildingType")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">{t("residential")}</SelectItem>
                    <SelectItem value="commercial">{t("commercial")}</SelectItem>
                    <SelectItem value="mixed">{t("mixed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="total-area">{t("totalArea")}</Label>
                <Input id="total-area" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="total-units">{t("numberOfUnits")}</Label>
                <Input id="total-units" type="number" placeholder="0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {t("advancedSettings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="area-unit">{t("areaPerUnit")}</Label>
                <Input id="area-unit" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="allocation-ratio">{t("allocationRatio")}</Label>
                <Input id="allocation-ratio" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="parking">{t("parkingSpaces")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t("availability")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">{t("available")}</SelectItem>
                    <SelectItem value="not-available">{t("notAvailable")}</SelectItem>
                    <SelectItem value="limited">{t("limited")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                {t("saveSettings")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("relatedFeatures")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("automaticFeeDistribution")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("automaticFeeDistributionDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("initialConfigSelection")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("initialConfigSelectionDesc")}
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