import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Droplets, Zap, Flame, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Consumption() {
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
            <Calculator className="w-6 h-6 text-blue-500" />
            <h1 className="text-3xl font-bold">Módulo de Consumo</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                Água
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2.450 m³</div>
              <p className="text-sm text-muted-foreground">Consumo mensal atual</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+5% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Energia Elétrica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">8.920 kWh</div>
              <p className="text-sm text-muted-foreground">Consumo mensal atual</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                <span className="text-sm text-red-600">-3% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Gás
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">1.240 m³</div>
              <p className="text-sm text-muted-foreground">Consumo mensal atual</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+2% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Inserir Consumo Diário/Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="consumption-type">Tipo de Consumo</Label>
                <select className="w-full p-2 border rounded">
                  <option value="water">Água</option>
                  <option value="electricity">Energia Elétrica</option>
                  <option value="gas">Gás</option>
                </select>
              </div>
              <div>
                <Label htmlFor="consumption-period">Período</Label>
                <select className="w-full p-2 border rounded">
                  <option value="daily">Diário</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <div>
                <Label htmlFor="consumption-date">Data</Label>
                <Input id="consumption-date" type="date" />
              </div>
              <div>
                <Label htmlFor="consumption-value">Valor do Consumo</Label>
                <Input id="consumption-value" type="number" placeholder="0.00" />
              </div>
              <Button className="w-full">Registrar Consumo</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Gráfico de Tendência de Consumo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Gráfico de consumo dos últimos 12 meses</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Visualização interativa das tendências de água, energia e gás
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Histórico de Consumo Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Janeiro 2024</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Água: 2.320 m³</p>
                  <p>Energia: 9.200 kWh</p>
                  <p>Gás: 1.180 m³</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Dezembro 2023</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Água: 2.150 m³</p>
                  <p>Energia: 8.950 kWh</p>
                  <p>Gás: 1.220 m³</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Média Automática</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Sistema calcula automaticamente</p>
                  <p>a média quando não inserido</p>
                  <p>baseado no histórico</p>
                </div>
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
                <h3 className="font-semibold mb-2">Inserção Direta do App de Campo</h3>
                <p className="text-sm text-muted-foreground">
                  Registre consumos diretamente do aplicativo móvel durante as vistorias de campo.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Gráfico Periódico de Consumo</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize tendências e padrões de consumo através de gráficos interativos e relatórios.
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