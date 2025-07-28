import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings, Users as UsersIcon, Shield, Plus, UserCheck, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";

export default function Users() {
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
            <Settings className="w-6 h-6 text-pink-500" />
            <h1 className="text-3xl font-bold">{t("userAndPermissionManagement")}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
{t("addNewUser")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="user-name">{t("fullName")}</Label>
                <Input id="user-name" placeholder={t("fullNamePlaceholder")} />
              </div>
              <div>
                <Label htmlFor="user-email">{t("email")}</Label>
                <Input id="user-email" type="email" placeholder="usuario@email.com" />
              </div>
              <div>
                <Label htmlFor="user-phone">{t("phone")}</Label>
                <Input id="user-phone" placeholder={t("phoneNumberPlaceholder")} />
              </div>
              <div>
                <Label htmlFor="user-role">{t("userRole")}</Label>
                <select id="user-role" className="w-full p-2 border rounded">
                  <option value="master">{t("masterFullAccess")}</option>
                  <option value="manager">{t("managerAdminAccess")}</option>
                  <option value="field">{t("fieldLimitedAccess")}</option>
                  <option value="readonly">{t("readOnlyAccess")}</option>
                </select>
              </div>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
{t("addUser")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
{t("permissionSettings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("permissionsByRole")}</Label>
                <div className="mt-2 space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">{t("master")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("completeAccessAllModules")}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">{t("manager")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("adminAccessExceptCritical")}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold">{t("field")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("fieldRequestsConsumptionOnly")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("activeUsers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">João Silva</h3>
                    <p className="text-sm text-muted-foreground">joao.silva@sindipro.com • {t("master")}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">{t("edit")}</Button>
                  <Button variant="outline" size="sm">{t("deactivate")}</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Maria Santos</h3>
                    <p className="text-sm text-muted-foreground">maria.santos@sindipro.com • {t("manager")}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">{t("edit")}</Button>
                  <Button variant="outline" size="sm">{t("deactivate")}</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Key className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Carlos Oliveira</h3>
                    <p className="text-sm text-muted-foreground">carlos.oliveira@sindipro.com • {t("field")}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">{t("edit")}</Button>
                  <Button variant="outline" size="sm">{t("deactivate")}</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ana Costa</h3>
                    <p className="text-sm text-muted-foreground">ana.costa@sindipro.com • {t("readOnly")} • {t("inactiveUser")}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">{t("reactivate")}</Button>
                  <Button variant="outline" size="sm" className="text-red-600">{t("exclude")}</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("detailedPermissionsMatrix")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t("module")}</th>
                    <th className="text-center p-2">{t("master")}</th>
                    <th className="text-center p-2">{t("manager")}</th>
                    <th className="text-center p-2">{t("field")}</th>
                    <th className="text-center p-2">{t("readOnly")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">{t("buildingRegistry")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">❌ {t("denied")}</td>
                    <td className="text-center p-2">👁️ {t("view")}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">{t("financialManagement")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">❌ {t("denied")}</td>
                    <td className="text-center p-2">👁️ {t("view")}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">{t("equipment")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">✏️ {t("editAccess")}</td>
                    <td className="text-center p-2">👁️ {t("view")}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">{t("fieldRequests")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">👁️ {t("view")}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">{t("reports")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">👁️ {t("view")}</td>
                    <td className="text-center p-2">👁️ {t("view")}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">{t("systemSettings")}</td>
                    <td className="text-center p-2">✅ {t("fullAccess")}</td>
                    <td className="text-center p-2">❌ {t("denied")}</td>
                    <td className="text-center p-2">❌ {t("denied")}</td>
                    <td className="text-center p-2">❌ {t("denied")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}