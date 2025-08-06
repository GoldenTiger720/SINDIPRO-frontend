import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Phone, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PhoneDirectory } from "@/components/supplier-contacts/PhoneDirectory";
import { AppointmentCalendar } from "@/components/supplier-contacts/AppointmentCalendar";

interface SupplierContact {
  id: string;
  companyName: string;
  contactPerson: string;
  phoneNumbers: string[];
  emailAddress: string;
  serviceCategory: string;
  notes: string;
  condominium: string;
}

interface AppointmentEvent {
  id: string;
  title: string;
  eventType: string;
  dateTime: Date;
  condominium: string;
  peopleInvolved: string[];
  comments: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const SupplierContacts = () => {
  const { t } = useTranslation();

  // Mock data - in real implementation, this would come from an API
  const [supplierContacts, setSupplierContacts] = useState<SupplierContact[]>([
    {
      id: "1",
      companyName: "Elevadores ABC Ltda",
      contactPerson: "João Silva",
      phoneNumbers: ["(11) 3333-4444", "(11) 99999-1111"],
      emailAddress: "joao@elevadoresabc.com",
      serviceCategory: "elevatorMaintenance",
      notes: "Manutenção preventiva mensal",
      condominium: "Edifício Central"
    },
    {
      id: "2", 
      companyName: "Segurança Total",
      contactPerson: "Maria Santos",
      phoneNumbers: ["(11) 2222-3333"],
      emailAddress: "maria@segurancatotal.com",
      serviceCategory: "securityServices",
      notes: "Portaria 24h e monitoramento",
      condominium: "Residencial Park"
    }
  ]);

  const [appointmentEvents, setAppointmentEvents] = useState<AppointmentEvent[]>([
    {
      id: "1",
      title: "Vistoria Anual de Elevadores",
      eventType: "inspectionEvent",
      dateTime: new Date(2024, 11, 15, 9, 0), // December 2024
      condominium: "Edifício Central",
      peopleInvolved: ["João Silva", "Administrador"],
      comments: "Vistoria anual obrigatória",
      status: "confirmed"
    },
    {
      id: "2",
      title: "Reunião de Segurança",
      eventType: "meetingEvent", 
      dateTime: new Date(2024, 11, 20, 14, 0), // December 2024
      condominium: "Residencial Park",
      peopleInvolved: ["Maria Santos", "Síndico"],
      comments: "Revisão dos protocolos de segurança",
      status: "pending"
    },
    {
      id: "3",
      title: "Manutenção Preventiva - Bomba d'água",
      eventType: "maintenanceEvent",
      dateTime: new Date(2024, 11, 10, 8, 30), // December 2024
      condominium: "Edifício Central",
      peopleInvolved: ["Carlos Técnico", "Administrador"],
      comments: "Manutenção trimestral da bomba d'água",
      status: "confirmed"
    },
    {
      id: "4",
      title: "Assembleia Geral Ordinária",
      eventType: "generalAssemblyEvent",
      dateTime: new Date(2024, 11, 25, 19, 0), // December 2024
      condominium: "Residencial Park",
      peopleInvolved: ["Todos os Condôminos", "Síndico"],
      comments: "Aprovação do orçamento para 2025",
      status: "confirmed"
    },
    {
      id: "5", 
      title: "Visita Técnica - Sistema de Incêndio",
      eventType: "technicalVisitEvent",
      dateTime: new Date(2024, 9, 15, 10, 0), // October 2024 (past)
      condominium: "Edifício Central",
      peopleInvolved: ["Engenheiro de Segurança"],
      comments: "Inspeção do sistema de prevenção de incêndios",
      status: "completed"
    },
    {
      id: "6",
      title: "Reparo no Portão Principal",
      eventType: "repairEvent",
      dateTime: new Date(2024, 10, 5, 13, 0), // November 2024 (past)
      condominium: "Residencial Park",
      peopleInvolved: ["Técnico em Automação"],
      comments: "Correção de problema no motor do portão",
      status: "completed"
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader userName={t("adminSindipro")} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("supplierContactsDesc")}
          </p>
        </div>

        <Tabs defaultValue="directory" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="directory" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{t("phoneDirectory")}</span>
              <span className="sm:hidden">{t("directory")}</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{t("appointmentCalendar")}</span>
              <span className="sm:hidden">{t("calendar")}</span>
            </TabsTrigger>
          </TabsList>

          {/* Phone Directory Tab */}
          <TabsContent value="directory" className="space-y-4 sm:space-y-6">
            <PhoneDirectory 
              supplierContacts={supplierContacts} 
              setSupplierContacts={setSupplierContacts} 
            />
          </TabsContent>

          {/* Appointment Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4 sm:space-y-6">
            <AppointmentCalendar 
              appointmentEvents={appointmentEvents} 
              setAppointmentEvents={setAppointmentEvents} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SupplierContacts;