import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navbar
      "dashboard": "Dashboard",
      "buildings": "Buildings",
      "legalObligations": "Legal Obligations",
      "equipment": "Equipment",
      "financial": "Financial",
      "consumption": "Consumption",
      "fieldManagement": "Requests",
      "reports": "Reports",
      "users": "Users",
      
      // Header
      "administrator": "Administrator",
      "myProfile": "My Profile",
      "settings": "Settings",
      "logout": "Log out",
      
      // Dashboard Titles
      "basicCondominiumRegistry": "Basic Condominium Registry",
      "legalObligationsDocuments": "Legal Obligations and Documents",
      "equipmentMaintenance": "Equipment and Maintenance",
      "financialBudgetManagement": "Financial/Budget Management",
      "consumptionManagement": "Consumption Management",
      "fieldManagementSurveys": "Field Management and Surveys",
      "reports": "Reports",
      "userManagement": "User Management",
      
      // Dashboard Page
      "condominiumManagementSystem": "Condominium Management System",
      "completeCondominiumPlatform": "Complete platform for condominium administration",
      "adminSindipro": "SINDIPRO Administrator",
      
      // Dashboard Cards
      "buildingManagement": "Building Management",
      "buildingManagementDesc": "Register and manage buildings, units, and properties",
      "financialReports": "Financial Reports",
      "financialReportsDesc": "Generate complete financial reports and budgets",
      "equipmentMaintenance": "Equipment & Maintenance",
      "equipmentMaintenanceDesc": "Track equipment, maintenance schedules and contracts",
      "consumptionDesc": "Monitor water, electricity and gas consumption",
      "legalObligationsDesc": "Manage legal requirements and compliance",
      "suppliers": "Suppliers",
      "suppliersDesc": "Manage supplier contacts and services",
      "documents": "Documents",
      "documentsDesc": "Store and organize important documents",
      "usersDesc": "Manage user access and permissions",
      "reportsDesc": "Generate PDF reports for condominium owners",
      "notifications": "Notifications",
      "notificationsDesc": "Manage alerts and communication",
      "inventory": "Inventory",
      "inventoryDesc": "Track building inventory and supplies",
      "analytics": "Analytics",
      "analyticsDesc": "View performance metrics and insights"
    }
  },
  pt: {
    translation: {
      // Navbar
      "dashboard": "Dashboard",
      "buildings": "Edifícios",
      "legalObligations": "Obrigações",
      "equipment": "Equipamentos",
      "financial": "Financeiro",
      "consumption": "Consumo",
      "fieldManagement": "Solicitações",
      "reports": "Relatórios",
      "users": "Usuários",
      
      // Header
      "administrator": "Administrador",
      "myProfile": "Meu Perfil",
      "settings": "Configurações",
      "logout": "Sair",
      
      // Dashboard Titles
      "basicCondominiumRegistry": "Registro Básico do Condomínio",
      "legalObligationsDocuments": "Obrigações Legais e Documentos",
      "equipmentMaintenance": "Equipamentos e Manutenção",
      "financialBudgetManagement": "Gestão Financeira/Orçamentária",
      "consumptionManagement": "Gestão de Consumo",
      "fieldManagementSurveys": "Gestão de Campo e Vistorias",
      "reports": "Relatórios",
      "userManagement": "Gestão de Usuários",
      
      // Dashboard Page
      "condominiumManagementSystem": "Sistema de Gestão Condominial",
      "completeCondominiumPlatform": "Plataforma completa para administração de condomínios",
      "adminSindipro": "Administrador SINDIPRO",
      
      // Dashboard Cards
      "buildingManagement": "Gestão de Edifícios",
      "buildingManagementDesc": "Registrar e gerenciar edifícios, unidades e propriedades",
      "financialReports": "Relatórios Financeiros",
      "financialReportsDesc": "Gerar relatórios financeiros completos e orçamentos",
      "equipmentMaintenance": "Equipamentos e Manutenção",
      "equipmentMaintenanceDesc": "Acompanhar equipamentos, cronogramas e contratos de manutenção",
      "consumptionDesc": "Monitorar consumo de água, energia elétrica e gás",
      "legalObligationsDesc": "Gerenciar requisitos legais e conformidade",
      "suppliers": "Fornecedores",
      "suppliersDesc": "Gerenciar contatos e serviços de fornecedores",
      "documents": "Documentos",
      "documentsDesc": "Armazenar e organizar documentos importantes",
      "usersDesc": "Gerenciar acesso e permissões de usuários",
      "reportsDesc": "Gerar relatórios PDF para proprietários do condomínio",
      "notifications": "Notificações",
      "notificationsDesc": "Gerenciar alertas e comunicação",
      "inventory": "Inventário",
      "inventoryDesc": "Acompanhar inventário e suprimentos do edifício",
      "analytics": "Análises",
      "analyticsDesc": "Visualizar métricas de desempenho e insights"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;