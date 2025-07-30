import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Globe, Bell, Shield, Palette, Database, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardHeader } from "@/components/DashboardHeader";
import { logoutUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type SettingsType = {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    reports: boolean;
    maintenance: boolean;
  };
  privacy: {
    profileVisibility: string;
    dataSharing: boolean;
    analytics: boolean;
  };
  appearance: {
    theme: string;
    compactMode: boolean;
  };
  system: {
    autoSave: boolean;
    backupFrequency: string;
  };
};

const Settings = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState<SettingsType>({
    notifications: {
      email: true,
      push: false,
      sms: false,
      reports: true,
      maintenance: true,
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false,
      analytics: true,
    },
    appearance: {
      theme: "light",
      compactMode: false,
    },
    system: {
      autoSave: true,
      backupFrequency: "weekly",
    }
  });

  const handleToggle = <C extends keyof SettingsType, S extends keyof SettingsType[C]>(
    category: C,
    setting: S
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelectChange = (category: string, setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t("success"),
        description: t("settingsSavedSuccessfully"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failedToSaveSettings"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    toast({
      title: t("exportStarted"),
      description: t("dataExportReady"),
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: t("accountDeletion"),
      description: t("contactSupportToDelete"),
      variant: "destructive",
    });
  };

  const handleClearCache = async () => {
    try {
      // Clear localStorage except auth tokens
      const keysToKeep = ['access_token', 'refresh_token', 'user_data'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      toast({
        title: t("success"),
        description: t("cacheClearedSuccessfully"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failedToClearCache"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("settings")}</h1>
            <p className="text-gray-600">{t("manageApplicationPreferences")}</p>
          </div>

          {/* Language & Localization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t("languageLocalization")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("interfaceLanguage")}</Label>
                  <p className="text-sm text-gray-600">{t("choosePreferredLanguage")}</p>
                </div>
                <Select value={language} onValueChange={changeLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="pt">🇧🇷 Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("notificationsSettings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("emailNotifications")}</Label>
                  <p className="text-sm text-gray-600">{t("receiveNotificationsViaEmail")}</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={() => handleToggle('notifications', 'email')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("pushNotifications")}</Label>
                  <p className="text-sm text-gray-600">{t("receivePushNotifications")}</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={() => handleToggle('notifications', 'push')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("reportNotifications")}</Label>
                  <p className="text-sm text-gray-600">{t("getNotifiedWhenReportsReady")}</p>
                </div>
                <Switch
                  checked={settings.notifications.reports}
                  onCheckedChange={() => handleToggle('notifications', 'reports')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("maintenanceAlerts")}</Label>
                  <p className="text-sm text-gray-600">{t("receiveMaintenanceAlerts")}</p>
                </div>
                <Switch
                  checked={settings.notifications.maintenance}
                  onCheckedChange={() => handleToggle('notifications', 'maintenance')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("privacySecurity")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("profileVisibility")}</Label>
                  <p className="text-sm text-gray-600">{t("controlWhoCanSeeProfile")}</p>
                </div>
                <Select 
                  value={settings.privacy.profileVisibility} 
                  onValueChange={(value) => handleSelectChange('privacy', 'profileVisibility', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">{t("public")}</SelectItem>
                    <SelectItem value="private">{t("private")}</SelectItem>
                    <SelectItem value="team">{t("teamOnly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("dataSharing")}</Label>
                  <p className="text-sm text-gray-600">{t("allowSharingAnonymizedData")}</p>
                </div>
                <Switch
                  checked={settings.privacy.dataSharing}
                  onCheckedChange={() => handleToggle('privacy', 'dataSharing')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("analyticsSettings")}</Label>
                  <p className="text-sm text-gray-600">{t("helpImproveAppAnalytics")}</p>
                </div>
                <Switch
                  checked={settings.privacy.analytics}
                  onCheckedChange={() => handleToggle('privacy', 'analytics')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t("appearance")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("theme")}</Label>
                  <p className="text-sm text-gray-600">{t("choosePreferredTheme")}</p>
                </div>
                <Select 
                  value={settings.appearance.theme} 
                  onValueChange={(value) => handleSelectChange('appearance', 'theme', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t("light")}</SelectItem>
                    <SelectItem value="dark">{t("dark")}</SelectItem>
                    <SelectItem value="auto">{t("auto")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("compactMode")}</Label>
                  <p className="text-sm text-gray-600">{t("useCompactInterfaceLayout")}</p>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={() => handleToggle('appearance', 'compactMode')}
                />
              </div>
            </CardContent>
          </Card>

          {/* System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t("system")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("autoSave")}</Label>
                  <p className="text-sm text-gray-600">{t("automaticallySaveChanges")}</p>
                </div>
                <Switch
                  checked={settings.system.autoSave}
                  onCheckedChange={() => handleToggle('system', 'autoSave')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("backupFrequency")}</Label>
                  <p className="text-sm text-gray-600">{t("howOftenBackupData")}</p>
                </div>
                <Select 
                  value={settings.system.backupFrequency} 
                  onValueChange={(value) => handleSelectChange('system', 'backupFrequency', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t("daily")}</SelectItem>
                    <SelectItem value="weekly">{t("weekly")}</SelectItem>
                    <SelectItem value="monthly">{t("monthly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 border-t">
                <Button onClick={handleClearCache} variant="outline" className="w-full">
                  {t("clearCache")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                {t("dataManagement")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t("exportData")}</Label>
                  <p className="text-sm text-gray-600">{t("downloadCopyOfData")}</p>
                </div>
                <Button onClick={handleExportData} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {t("export")}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium text-red-600">{t("deleteAccount")}</Label>
                  <p className="text-sm text-gray-600">{t("permanentlyDeleteAccount")}</p>
                </div>
                <Button onClick={handleDeleteAccount} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("delete")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Settings */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="flex-1"
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              {isLoading ? t("saving") : t("saveSettings")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;