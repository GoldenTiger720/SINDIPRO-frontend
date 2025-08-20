import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Users as UsersIcon, Shield, Plus, UserCheck, Key } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { fetchUsers } from "@/lib/auth";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  is_active_user: boolean;
  date_joined: string;
}

export default function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold leading-tight">{t("userAndPermissionManagement")}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
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
                <select id="user-role" className="w-full p-2 border rounded text-sm">
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

        <Card className="mt-4 sm:mt-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{t("activeUsers")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-muted-foreground">Loading users...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">Error loading users</div>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => {
                  const getRoleIcon = (role: string) => {
                    switch (role) {
                      case 'master':
                        return <Shield className="w-5 h-5 text-green-600" />;
                      case 'manager':
                        return <UserCheck className="w-5 h-5 text-blue-600" />;
                      case 'field':
                        return <Key className="w-5 h-5 text-orange-600" />;
                      default:
                        return <UsersIcon className="w-5 h-5 text-gray-600" />;
                    }
                  };

                  const getRoleColor = (role: string) => {
                    switch (role) {
                      case 'master':
                        return 'bg-green-100';
                      case 'manager':
                        return 'bg-blue-100';
                      case 'field':
                        return 'bg-orange-100';
                      default:
                        return 'bg-gray-100';
                    }
                  };

                  const getRoleText = (role: string) => {
                    switch (role) {
                      case 'master':
                        return t("master");
                      case 'manager':
                        return t("manager");
                      case 'field':
                        return t("field");
                      case 'readonly':
                        return t("readOnly");
                      default:
                        return role;
                    }
                  };

                  return (
                    <div 
                      key={user.id} 
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0 ${!user.is_active_user ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getRoleColor(user.role)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}` 
                              : user.username || 'Unknown User'
                            }
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground break-all">
                            {user.email || 'No email'} • {getRoleText(user.role)}
                            {!user.is_active_user && ` • ${t("inactiveUser")}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap sm:ml-4">
                        <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8">{t("edit")}</Button>
                        {user.is_active_user ? (
                          <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8">{t("deactivate")}</Button>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8">{t("reactivate")}</Button>
                            <Button variant="outline" size="sm" className="text-red-600 text-xs px-3 py-1 h-8">{t("exclude")}</Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-4 sm:mt-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{t("detailedPermissionsMatrix")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-max px-4 sm:px-0">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1 sm:p-2 font-medium">{t("module")}</th>
                    <th className="text-center p-1 sm:p-2 font-medium">{t("master")}</th>
                    <th className="text-center p-1 sm:p-2 font-medium">{t("manager")}</th>
                    <th className="text-center p-1 sm:p-2 font-medium">{t("field")}</th>
                    <th className="text-center p-1 sm:p-2 font-medium">{t("readOnly")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("buildingRegistry")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="denied">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("financialManagement")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="denied">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("equipment")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="edit">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("fieldRequests")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("reports")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("systemSettings")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="denied">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="denied">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="denied">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("legalObligations")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("supplierContacts")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="edit">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="edit">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("consumption")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="edit">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="view">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="edit">✏️ {t("editAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">{t("userAndPermissionManagement")}</td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="full">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="denied">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="denied">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                    <td className="text-center p-1 sm:p-2">
                      <select className="w-16 sm:w-20 px-1 py-1 border rounded text-xs" defaultValue="denied">
                        <option value="full">✅ {t("fullAccess")}</option>
                        <option value="view">👁️ {t("view")}</option>
                        <option value="denied">❌ {t("denied")}</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}