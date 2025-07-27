import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, Plus, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Buildings() {
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
            <Building2 className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Registro Básico do Condomínio</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Informações Básicas do Edifício
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="building-name">Nome do Edifício</Label>
                <Input id="building-name" placeholder="Digite o nome do edifício" />
              </div>
              <div>
                <Label htmlFor="building-type">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residencial</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                    <SelectItem value="mixed">Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="total-area">Área Total (m²)</Label>
                <Input id="total-area" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="total-units">Número de Unidades</Label>
                <Input id="total-units" type="number" placeholder="0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="area-unit">Área por Unidade (m²)</Label>
                <Input id="area-unit" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="allocation-ratio">Proporção de Rateio (%)</Label>
                <Input id="allocation-ratio" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="parking">Vagas de Estacionamento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Disponibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="not-available">Não Disponível</SelectItem>
                    <SelectItem value="limited">Limitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Funcionalidades Relacionadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Automação de Distribuição de Taxas</h3>
                <p className="text-sm text-muted-foreground">
                  Distribua automaticamente as taxas de administração por unidade baseado na proporção configurada.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Seleção de Configuração Inicial</h3>
                <p className="text-sm text-muted-foreground">
                  Configure facilmente as configurações iniciais através de uma matriz de seleção intuitiva.
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