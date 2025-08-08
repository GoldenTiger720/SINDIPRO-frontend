import { 
  Building2, 
  FileText, 
  Settings, 
  BarChart3, 
  CheckSquare, 
  MessageSquare, 
  Camera, 
  Mail, 
  FileIcon, 
  Wrench,
  AlertTriangle,
  Calculator,
  Calendar
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { DashboardHeader } from "./DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const dashboardItems = [
    {
      id: "buildings",
      title: t("basicCondominiumRegistry"),
      icon: Building2,
      color: "bg-dashboard-gray",
      route: "/buildings"
    },
    {
      id: "obligations",
      title: t("legalObligationsDocuments"),
      icon: AlertTriangle,
      color: "bg-dashboard-red",
      route: "/legal-obligations"
    },
    {
      id: "equipment",
      title: t("equipmentMaintenance"),
      icon: Wrench,
      color: "bg-dashboard-green",
      route: "/equipment"
    },
    {
      id: "financial",
      title: t("financialBudgetManagement"),
      icon: BarChart3,
      color: "bg-dashboard-orange",
      route: "/financial"
    },
    {
      id: "consumption",
      title: t("consumptionManagement"),
      icon: Calculator,
      color: "bg-dashboard-blue",
      route: "/consumption"
    },
    {
      id: "field-management",
      title: t("fieldManagementSurveys"),
      icon: MessageSquare,
      color: "bg-dashboard-purple",
      route: "/field-management"
    },
    {
      id: "reports",
      title: t("reports"),
      icon: FileText,
      color: "bg-dashboard-teal",
      route: "/reports"
    },
    {
      id: "users",
      title: t("userManagement"),
      icon: Settings,
      color: "bg-dashboard-pink",
      route: "/users"
    },
    {
      id: "supplier-contacts",
      title: t("supplierContacts"),
      icon: Calendar,
      color: "bg-dashboard-indigo",
      route: "/supplier-contacts"
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t("condominiumManagementSystem")}
          </h1>
          <p className="text-muted-foreground">
            {t("completeCondominiumPlatform")}
          </p>
        </div> */}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {dashboardItems.map((item) => (
            <DashboardCard
              key={item.id}
              title={item.title}
              icon={item.icon}
              color={item.color}
              onClick={() => handleCardClick(item.route)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};