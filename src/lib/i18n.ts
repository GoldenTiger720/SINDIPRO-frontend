import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      "administrator": "Administrator",
      "myProfile": "My Profile",
      "settings": "Settings",
      "logout": "Log out",
      
      // Dashboard Cards
      "buildingManagement": "Building Management",
      "buildingManagementDesc": "Register and manage buildings, units, and properties",
      "financialReports": "Financial Reports",
      "financialReportsDesc": "Generate complete financial reports and budgets",
      "equipmentMaintenance": "Equipment & Maintenance",
      "equipmentMaintenanceDesc": "Track equipment, maintenance schedules and contracts",
      "consumption": "Consumption",
      "consumptionDesc": "Monitor water, electricity and gas consumption",
      "legalObligations": "Legal Obligations",
      "legalObligationsDesc": "Manage legal requirements and compliance",
      "suppliers": "Suppliers",
      "suppliersDesc": "Manage supplier contacts and services",
      "documents": "Documents",
      "documentsDesc": "Store and organize important documents",
      "users": "Users",
      "usersDesc": "Manage user access and permissions",
      "reports": "Reports",
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
      // Header
      "administrator": "Administrador",
      "myProfile": "Meu Perfil",
      "settings": "Configurações",
      "logout": "Sair",
      
      // Dashboard Cards
      "buildingManagement": "Gestão de Edifícios",
      "buildingManagementDesc": "Registrar e gerenciar edifícios, unidades e propriedades",
      "financialReports": "Relatórios Financeiros",
      "financialReportsDesc": "Gerar relatórios financeiros completos e orçamentos",
      "equipmentMaintenance": "Equipamentos e Manutenção",
      "equipmentMaintenanceDesc": "Acompanhar equipamentos, cronogramas e contratos de manutenção",
      "consumption": "Consumo",
      "consumptionDesc": "Monitorar consumo de água, energia elétrica e gás",
      "legalObligations": "Obrigações Legais",
      "legalObligationsDesc": "Gerenciar requisitos legais e conformidade",
      "suppliers": "Fornecedores",
      "suppliersDesc": "Gerenciar contatos e serviços de fornecedores",
      "documents": "Documentos",
      "documentsDesc": "Armazenar e organizar documentos importantes",
      "users": "Usuários",
      "usersDesc": "Gerenciar acesso e permissões de usuários",
      "reports": "Relatórios",
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