import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageSquare, Camera, MapPin, Clock, Mail, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";

export default function FieldManagement() {
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
            <MessageSquare className="w-6 h-6 text-purple-500" />
            <h1 className="text-3xl font-bold">{t("fieldManagementRequests")}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
{t("fieldRegistration")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photo-upload">{t("problemPhoto")}</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{t("clickToTakePhoto")}</p>
                  <Button variant="outline" className="mt-2">
                    <Camera className="w-4 h-4 mr-2" />
{t("addPhoto")}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="request-title">{t("requestTitle")}</Label>
                <Input id="request-title" placeholder={t("requestTitlePlaceholder")} />
              </div>
              <div>
                <Label htmlFor="request-description">{t("problemDescription")}</Label>
                <textarea 
                  className="w-full p-2 border rounded resize-none" 
                  rows={4}
                  placeholder={t("describeProblem")}
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
{t("locationAndTimestamp")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">{t("automaticLocation")}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lat: -23.5505, Long: -46.6333<br/>
                  {t("address")}: Rua das Flores, 123 - São Paulo, SP
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{t("automaticTimeRegistry")}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("date")}: 15/03/2024<br/>
                  Horário: 14:32:15
                </p>
              </div>
              <div>
                <Label htmlFor="priority">{t("priority")}</Label>
                <select className="w-full p-2 border rounded">
                  <option value="low">{t("low")}</option>
                  <option value="medium">{t("medium")}</option>
                  <option value="high">{t("high")}</option>
                  <option value="urgent">{t("urgent")}</option>
                </select>
              </div>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
{t("createRequest")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
{t("automaticRequestSending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="internal-email">{t("internalEmailAdmin")}</Label>
                <Input id="internal-email" type="email" placeholder="admin@condominio.com" />
              </div>
              <div>
                <Label htmlFor="contractor-email">{t("contractorSupplierEmail")}</Label>
                <Input id="contractor-email" type="email" placeholder="manutencao@empresa.com" />
              </div>
            </div>
            <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                📧 {t("requestsAutomaticallySent")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("recentRequests")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{t("bathroomLeak")} - {t("apartment")} 302</h3>
                    <p className="text-sm text-muted-foreground">{t("createdBy")}: João Silva ({t("janitor")})</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">{t("highPriority")}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span><MapPin className="w-3 h-3 inline mr-1" />3º {t("floor")} - {t("block")} A</span>
                  <span><Clock className="w-3 h-3 inline mr-1" />15/03/2024 14:32</span>
                  <span><Mail className="w-3 h-3 inline mr-1" />{t("sentForMaintenance")}</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{t("burnedOutBulb")} - Hall principal</h3>
                    <p className="text-sm text-muted-foreground">{t("createdBy")}: Maria Santos ({t("reception")})</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">{t("mediumPriority")}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span><MapPin className="w-3 h-3 inline mr-1" />{t("lobby")} - Hall</span>
                  <span><Clock className="w-3 h-3 inline mr-1" />14/03/2024 09:15</span>
                  <span><Mail className="w-3 h-3 inline mr-1" />{t("awaitingResponse")}</span>
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
                <h3 className="font-semibold mb-2">{t("roleBasedAccessControl")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("roleBasedAccessControlDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("requestHistoryManagement")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("requestHistoryManagementDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("inspectionRegistryReport")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("inspectionRegistryReportDesc")}
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