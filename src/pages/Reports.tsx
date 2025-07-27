import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText, Download, Settings, Mail, FileSpreadsheet, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Reports() {
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
            <FileText className="w-6 h-6 text-teal-500" />
            <h1 className="text-3xl font-bold">Geração e Exportação de Relatórios</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Geração Automática de PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="report-type">Tipo de Relatório</Label>
                <select className="w-full p-2 border rounded">
                  <option value="complete">Relatório Completo</option>
                  <option value="financial">Apenas Financeiro</option>
                  <option value="maintenance">Apenas Manutenção</option>
                  <option value="consumption">Apenas Consumo</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <div>
                <Label htmlFor="report-period">Período</Label>
                <div className="flex gap-2">
                  <Input id="start-date" type="date" />
                  <Input id="end-date" type="date" />
                </div>
              </div>
              <div>
                <Label>Seções do Relatório</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Status de Gestão</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Informações de Equipamentos</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Finanças</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Consumo</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Registro de Atividades</span>
                  </label>
                </div>
              </div>
              <Button className="w-full gap-2">
                <Download className="w-4 h-4" />
                Gerar Relatório PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Exportação Excel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="excel-data">Dados para Exportar</Label>
                <select className="w-full p-2 border rounded">
                  <option value="financial">Dados Financeiros</option>
                  <option value="consumption">Dados de Consumo</option>
                  <option value="equipment">Dados de Equipamentos</option>
                  <option value="requests">Solicitações</option>
                  <option value="all">Todos os Dados</option>
                </select>
              </div>
              <div>
                <Label htmlFor="excel-format">Formato</Label>
                <select className="w-full p-2 border rounded">
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="ods">OpenDocument (.ods)</option>
                </select>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 O arquivo Excel incluirá gráficos automáticos e formatação profissional 
                  para facilitar a análise dos dados.
                </p>
              </div>
              <Button className="w-full gap-2" variant="outline">
                <FileSpreadsheet className="w-4 h-4" />
                Exportar para Excel
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Templates Personalizáveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Template Executivo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Relatório resumido para apresentação à diretoria
                </p>
                <Button variant="outline" size="sm">Personalizar</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Template Técnico</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Relatório detalhado para equipe técnica
                </p>
                <Button variant="outline" size="sm">Personalizar</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Template Financeiro</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Foco em análises financeiras e orçamentárias
                </p>
                <Button variant="outline" size="sm">Personalizar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Relatório Mensal - Março 2024</h3>
                  <p className="text-sm text-muted-foreground">Gerado em 15/03/2024 às 14:30</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-3 h-3" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-3 h-3" />
                    Enviar
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Relatório Financeiro - Q1 2024</h3>
                  <p className="text-sm text-muted-foreground">Gerado em 01/04/2024 às 09:15</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-3 h-3" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-3 h-3" />
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Envio de Anexos por Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipient-emails">Destinatários</Label>
                <textarea 
                  className="w-full p-2 border rounded resize-none" 
                  rows={3}
                  placeholder="sindico@condominio.com&#10;administracao@empresa.com&#10;contabilidade@empresa.com"
                ></textarea>
              </div>
              <div>
                <Label htmlFor="email-subject">Assunto do Email</Label>
                <Input id="email-subject" placeholder="Relatório Mensal - Condomínio XYZ" />
                <Label htmlFor="email-message" className="mt-2 block">Mensagem</Label>
                <textarea 
                  className="w-full p-2 border rounded resize-none" 
                  rows={2}
                  placeholder="Segue em anexo o relatório mensal..."
                ></textarea>
              </div>
            </div>
            <Button className="mt-4 gap-2">
              <Mail className="w-4 h-4" />
              Enviar Relatório por Email
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Funcionalidades Relacionadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Templates Personalizáveis</h3>
                <p className="text-sm text-muted-foreground">
                  Crie e personalize templates de relatórios para diferentes necessidades e públicos.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Salvamento e Rastreamento Automático</h3>
                <p className="text-sm text-muted-foreground">
                  Todos os relatórios são salvos automaticamente com histórico completo de versões.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Envio de Anexos por Email</h3>
                <p className="text-sm text-muted-foreground">
                  Envie relatórios automaticamente por email para múltiplos destinatários.
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