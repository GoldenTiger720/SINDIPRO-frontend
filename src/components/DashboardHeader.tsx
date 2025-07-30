import { Menu, User, Globe, ChevronDown, Home, Building2, AlertTriangle, Wrench, BarChart3, Calculator, MessageSquare, FileText, Users, LogOut, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStoredUser, logoutUser } from "@/lib/auth";

interface DashboardHeaderProps {
  userName?: string;
  onMenuClick?: () => void;
}

export const DashboardHeader = ({
  userName,
  onMenuClick,
}: DashboardHeaderProps) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const user = getStoredUser();
  
  // Use stored user data or fallback to prop or default
  const displayName = user?.username || userName || "User";

  const handleLogout = () => {
    logoutUser();
    // Force page reload to ensure clean state
    window.location.href = '/login';
  };

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setIsSubmenuOpen(false);
      }
    };

    if (isSubmenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSubmenuOpen]);

  const submenuItems = [
    { name: t("buildings"), href: "/buildings", icon: Building2 },
    { name: t("legalObligations"), href: "/legal-obligations", icon: AlertTriangle },
    { name: t("equipment"), href: "/equipment", icon: Wrench },
    { name: t("financial"), href: "/financial", icon: BarChart3 },
    { name: t("consumption"), href: "/consumption", icon: Calculator },
    { name: t("fieldManagement"), href: "/field-management", icon: MessageSquare },
    { name: t("reportsNavbar"), href: "/reports", icon: FileText },
    { name: t("users"), href: "/users", icon: Users },
  ];
  return (
    <header className="bg-white shadow-sm border-b border-border px-4 py-3 relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsSubmenuOpen(!isSubmenuOpen);
              if (onMenuClick) onMenuClick();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SINDIPRO" className="h-8 w-auto" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:block">
                  {language === "pt" ? "PT" : "EN"}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("pt")}>
                🇧🇷 Português (Brasil)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                  {displayName}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3 h-3 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 mr-2" />
                {t("myProfile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                {t("settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Submenu Grid */}
      {isSubmenuOpen && (
        <div 
          ref={submenuRef}
          className="absolute top-full left-4 bg-background border border-border shadow-lg z-50 rounded-md"
          style={{ width: 'fit-content' }}
        >
          <div className="p-4">
            <div className="grid grid-cols-4 gap-3" style={{ width: 'max-content' }}>
              {submenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.name}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border border-border hover:border-primary/50 hover:scale-105"
                    onClick={() => {
                      navigate(item.href);
                      setIsSubmenuOpen(false);
                    }}
                    style={{ width: '100px', height: '80px' }}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-2 text-center h-full">
                      <Icon className="h-5 w-5 text-muted-foreground mb-1 hover:text-primary transition-colors" />
                      <span className="text-xs font-medium text-foreground leading-tight">{item.name}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
