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
        title: "Success",
        description: "Settings saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready for download shortly.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
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
        title: "Success",
        description: "Cache cleared successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache",
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
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your application preferences and account settings</p>
          </div>

          {/* Language & Localization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Interface Language</Label>
                  <p className="text-sm text-gray-600">Choose your preferred language for the interface</p>
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
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={() => handleToggle('notifications', 'email')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={() => handleToggle('notifications', 'push')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Report Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified when reports are ready</p>
                </div>
                <Switch
                  checked={settings.notifications.reports}
                  onCheckedChange={() => handleToggle('notifications', 'reports')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Maintenance Alerts</Label>
                  <p className="text-sm text-gray-600">Receive maintenance and system alerts</p>
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
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Profile Visibility</Label>
                  <p className="text-sm text-gray-600">Control who can see your profile</p>
                </div>
                <Select 
                  value={settings.privacy.profileVisibility} 
                  onValueChange={(value) => handleSelectChange('privacy', 'profileVisibility', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Data Sharing</Label>
                  <p className="text-sm text-gray-600">Allow sharing anonymized usage data</p>
                </div>
                <Switch
                  checked={settings.privacy.dataSharing}
                  onCheckedChange={() => handleToggle('privacy', 'dataSharing')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Analytics</Label>
                  <p className="text-sm text-gray-600">Help improve the app with usage analytics</p>
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
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-gray-600">Choose your preferred theme</p>
                </div>
                <Select 
                  value={settings.appearance.theme} 
                  onValueChange={(value) => handleSelectChange('appearance', 'theme', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Compact Mode</Label>
                  <p className="text-sm text-gray-600">Use more compact interface layout</p>
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
                System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto Save</Label>
                  <p className="text-sm text-gray-600">Automatically save changes as you work</p>
                </div>
                <Switch
                  checked={settings.system.autoSave}
                  onCheckedChange={() => handleToggle('system', 'autoSave')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Backup Frequency</Label>
                  <p className="text-sm text-gray-600">How often to backup your data</p>
                </div>
                <Select 
                  value={settings.system.backupFrequency} 
                  onValueChange={(value) => handleSelectChange('system', 'backupFrequency', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 border-t">
                <Button onClick={handleClearCache} variant="outline" className="w-full">
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Export Data</Label>
                  <p className="text-sm text-gray-600">Download a copy of your data</p>
                </div>
                <Button onClick={handleExportData} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium text-red-600">Delete Account</Label>
                  <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                </div>
                <Button onClick={handleDeleteAccount} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
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
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;