import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wrench, MapPin, Calendar, Plus, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";

export default function Equipment() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
{t("backToDashboard")}
          </Button>
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-green-500" />
            <h1 className="text-2xl sm:text-3xl font-bold">{t("equipmentAndMaintenance")}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
{t("equipmentRegistry")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="equipment-name">{t("equipmentName")}</Label>
                <Input id="equipment-name" placeholder={t("equipmentNamePlaceholder")} />
              </div>
              <div>
                <Label htmlFor="equipment-type">{t("equipmentType")}</Label>
                <Input id="equipment-type" placeholder={t("equipmentTypePlaceholder")} />
              </div>
              <div>
                <Label htmlFor="location">{t("location")}</Label>
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 mt-3 text-muted-foreground" />
                  <Input id="location" placeholder={t("locationPlaceholder")} />
                </div>
              </div>
              <div>
                <Label htmlFor="purchase-date">{t("purchaseDate")}</Label>
                <Input id="purchase-date" type="date" />
              </div>
              <div>
                <Label htmlFor="contractor">{t("contractorInfo")}</Label>
                <Input id="contractor" placeholder={t("contractorPlaceholder")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
{t("maintenanceSchedule")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maintenance-frequency">{t("maintenanceFrequency")}</Label>
                <select className="w-full p-2 border rounded">
                  <option>{t("monthly")}</option>
                  <option>{t("quarterly")}</option>
                  <option>{t("semiannual")}</option>
                  <option>{t("annual")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="last-maintenance">{t("lastMaintenance")}</Label>
                <Input id="last-maintenance" type="date" />
              </div>
              <div>
                <Label htmlFor="next-maintenance">{t("nextMaintenance")}</Label>
                <Input id="next-maintenance" type="date" />
              </div>
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{t("automaticReminder")}</span>
                </div>
                <p className="text-sm text-blue-700">
                  {t("systemConfiguredNotification")}
                </p>
              </div>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
{t("addEquipment")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("registeredEquipment")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">{t("socialElevator")}</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><MapPin className="w-3 h-3 inline mr-1" />{t("mainHall")}</p>
                  <p><Calendar className="w-3 h-3 inline mr-1" />{t("nextMaintenance")}: 15/03/2024</p>
                  <p>{t("status")}: <span className="text-green-600">{t("operatingNormally")}</span></p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold">{t("recirculationPump")}</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><MapPin className="w-3 h-3 inline mr-1" />{t("machineRoom")}</p>
                  <p><Calendar className="w-3 h-3 inline mr-1" />{t("nextMaintenance")}: 22/03/2024</p>
                  <p>{t("status")}: <span className="text-yellow-600">{t("maintenanceRequired")}</span></p>
                </div>
              </div>
              <div className="p-4 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center hover:bg-muted/50 cursor-pointer">
                <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("addEquipment")}</span>
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
                <h3 className="font-semibold mb-2">{t("automaticScheduleReminder")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("automaticScheduleReminderDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("maintenanceHistoryTracking")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("maintenanceHistoryTrackingDesc")}
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