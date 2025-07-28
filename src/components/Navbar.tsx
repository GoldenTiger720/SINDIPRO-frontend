import { Building2, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const navigation = [
    { name: t("dashboard"), href: "/" },
    { name: t("buildings"), href: "/buildings" },
    { name: t("legalObligations"), href: "/legal-obligations" },
    { name: t("equipment"), href: "/equipment" },
    { name: t("financial"), href: "/financial" },
    { name: t("consumption"), href: "/consumption" },
    { name: t("fieldManagement"), href: "/field-management" },
    { name: t("reports"), href: "/reports" },
    { name: t("users"), href: "/users" },
  ];

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">SINDIPRO</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <Globe className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'EN' : 'PT'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('pt')}>
                    Português
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile menu button and language switcher */}
          {isMobile && (
            <div className="md:hidden flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('pt')}>
                    Português
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};