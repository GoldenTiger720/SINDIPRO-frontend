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
  Calculator
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { DashboardHeader } from "./DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const dashboardItems = [
    {
      id: "buildings",
      title: "Registro Básico do Condomínio",
      icon: Building2,
      color: "bg-dashboard-gray",
      route: "/buildings"
    },
    {
      id: "obligations",
      title: "Obrigações Legais e Documentos",
      icon: AlertTriangle,
      color: "bg-dashboard-red",
      route: "/legal-obligations"
    },
    {
      id: "equipment",
      title: "Equipamentos e Manutenção",
      icon: Wrench,
      color: "bg-dashboard-green",
      route: "/equipment"
    },
    {
      id: "financial",
      title: "Gestão Financeira/Orçamentária",
      icon: BarChart3,
      color: "bg-dashboard-orange",
      route: "/financial"
    },
    {
      id: "consumption",
      title: "Módulo de Consumo",
      icon: Calculator,
      color: "bg-dashboard-blue",
      route: "/consumption"
    },
    {
      id: "field-management",
      title: "Gestão de Campo/Solicitações",
      icon: MessageSquare,
      color: "bg-dashboard-purple",
      route: "/field-management"
    },
    {
      id: "reports",
      title: "Geração e Exportação de Relatórios",
      icon: FileText,
      color: "bg-dashboard-teal",
      route: "/reports"
    },
    {
      id: "users",
      title: "Gestão de Usuários e Permissões",
      icon: Settings,
      color: "bg-dashboard-pink",
      route: "/users"
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Administrador SINDIPRO" />
      
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistema de Gestão Condominial
          </h1>
          <p className="text-muted-foreground">
            Plataforma completa para administração de condomínios
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
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