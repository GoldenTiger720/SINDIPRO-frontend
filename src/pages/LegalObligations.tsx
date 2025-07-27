import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertTriangle, Calendar, FileText, Upload, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function LegalObligations() {
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
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h1 className="text-3xl font-bold">Obrigações Legais e Documentos</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Registro de Obrigações Legais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="avcb">AVCB (Auto de Vistoria do Corpo de Bombeiros)</Label>
                <div className="flex gap-2">
                  <Input id="avcb" type="date" />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="electrical-inspection">Inspeção Elétrica</Label>
                <div className="flex gap-2">
                  <Input id="electrical-inspection" type="date" />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="fire-inspection">Inspeção de Combate a Incêndio</Label>
                <div className="flex gap-2">
                  <Input id="fire-inspection" type="date" />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Prazos e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4 text-yellow-600" />
                  <span className="font-semibold">Próximos Vencimentos</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>AVCB - Renovação</span>
                    <span className="text-red-600">15 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspeção Elétrica</span>
                    <span className="text-yellow-600">45 dias</span>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="notification-email">Email para Notificações</Label>
                <Input id="notification-email" type="email" placeholder="admin@condominio.com" />
              </div>
              <Button className="w-full gap-2">
                <Bell className="w-4 h-4" />
                Configurar Notificações
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documentos Anexados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <FileText className="w-8 h-8 mb-2 text-primary" />
                <h3 className="font-semibold">AVCB_2024.pdf</h3>
                <p className="text-sm text-muted-foreground">Vence em: 15/03/2024</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <FileText className="w-8 h-8 mb-2 text-primary" />
                <h3 className="font-semibold">Inspeção_Elétrica.pdf</h3>
                <p className="text-sm text-muted-foreground">Vence em: 20/04/2024</p>
              </div>
              <div className="p-4 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center hover:bg-muted/50 cursor-pointer">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Adicionar Documento</span>
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
                <h3 className="font-semibold mb-2">Notificação Automática de Vencimentos</h3>
                <p className="text-sm text-muted-foreground">
                  Receba alertas automáticos por email sobre documentos próximos ao vencimento.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Histórico de Documentos de Gestão</h3>
                <p className="text-sm text-muted-foreground">
                  Mantenha um histórico completo de todos os documentos e suas renovações.
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