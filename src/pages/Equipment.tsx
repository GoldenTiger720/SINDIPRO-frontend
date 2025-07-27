import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wrench, MapPin, Calendar, Plus, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Equipment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName="Administrador SINDIPRO" />
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-green-500" />
            <h1 className="text-3xl font-bold">Equipamentos e Manutenção</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Registro de Equipamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="equipment-name">Nome do Equipamento</Label>
                <Input id="equipment-name" placeholder="Ex: Elevador Social" />
              </div>
              <div>
                <Label htmlFor="equipment-type">Tipo</Label>
                <Input id="equipment-type" placeholder="Ex: Elevador, Bomba, Gerador" />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 mt-3 text-muted-foreground" />
                  <Input id="location" placeholder="Ex: Subsolo - Sala de Máquinas" />
                </div>
              </div>
              <div>
                <Label htmlFor="purchase-date">Data de Compra</Label>
                <Input id="purchase-date" type="date" />
              </div>
              <div>
                <Label htmlFor="contractor">Informações da Contratada</Label>
                <Input id="contractor" placeholder="Nome da empresa responsável" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Cronograma de Manutenção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maintenance-frequency">Frequência de Manutenção</Label>
                <select className="w-full p-2 border rounded">
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Semestral</option>
                  <option>Anual</option>
                </select>
              </div>
              <div>
                <Label htmlFor="last-maintenance">Última Manutenção</Label>
                <Input id="last-maintenance" type="date" />
              </div>
              <div>
                <Label htmlFor="next-maintenance">Próxima Manutenção</Label>
                <Input id="next-maintenance" type="date" />
              </div>
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">Lembrete Automático</span>
                </div>
                <p className="text-sm text-blue-700">
                  Sistema configurado para notificar 7 dias antes da manutenção programada.
                </p>
              </div>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Equipamento
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Equipamentos Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Elevador Social</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><MapPin className="w-3 h-3 inline mr-1" />Hall Principal</p>
                  <p><Calendar className="w-3 h-3 inline mr-1" />Próxima manutenção: 15/03/2024</p>
                  <p>Status: <span className="text-green-600">Em funcionamento</span></p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold">Bomba de Recalque</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><MapPin className="w-3 h-3 inline mr-1" />Casa de Máquinas</p>
                  <p><Calendar className="w-3 h-3 inline mr-1" />Próxima manutenção: 22/03/2024</p>
                  <p>Status: <span className="text-yellow-600">Manutenção necessária</span></p>
                </div>
              </div>
              <div className="p-4 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center hover:bg-muted/50 cursor-pointer">
                <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Adicionar Equipamento</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Funcionalidades Relacionadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Lembrete Automático de Cronograma</h3>
                <p className="text-sm text-muted-foreground">
                  Receba notificações automáticas sobre cronogramas de manutenção preventiva.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Rastreamento de Histórico de Manutenção</h3>
                <p className="text-sm text-muted-foreground">
                  Mantenha um histórico completo de todas as manutenções realizadas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}