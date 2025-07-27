import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BarChart3, Upload, TrendingUp, DollarSign, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Financial() {
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
            <BarChart3 className="w-6 h-6 text-orange-500" />
            <h1 className="text-3xl font-bold">Gestão Financeira/Orçamentária</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Orçamento Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 250.000,00</div>
              <p className="text-sm text-muted-foreground">Total aprovado para 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Gasto Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ 125.430,00</div>
              <p className="text-sm text-muted-foreground">50,2% do orçamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                Saldo Restante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">R$ 124.570,00</div>
              <p className="text-sm text-muted-foreground">49,8% disponível</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Registro de Orçamento Anual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="account-category">Categoria da Conta</Label>
                <select className="w-full p-2 border rounded">
                  <option>Manutenção</option>
                  <option>Limpeza</option>
                  <option>Segurança</option>
                  <option>Administração</option>
                  <option>Energia Elétrica</option>
                </select>
              </div>
              <div>
                <Label htmlFor="subcategory">Sub-item</Label>
                <Input id="subcategory" placeholder="Ex: Material de limpeza" />
              </div>
              <div>
                <Label htmlFor="budget-amount">Valor Orçado (R$)</Label>
                <Input id="budget-amount" type="number" placeholder="0,00" />
              </div>
              <Button className="w-full">Adicionar ao Orçamento</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Gastos Mensais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="expense-category">Categoria</Label>
                <select className="w-full p-2 border rounded">
                  <option>Manutenção</option>
                  <option>Limpeza</option>
                  <option>Segurança</option>
                  <option>Administração</option>
                </select>
              </div>
              <div>
                <Label htmlFor="expense-amount">Valor Gasto (R$)</Label>
                <Input id="expense-amount" type="number" placeholder="0,00" />
              </div>
              <div>
                <Label htmlFor="expense-date">Data</Label>
                <Input id="expense-date" type="date" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Excel
                </Button>
                <Button className="flex-1">Registrar Gasto</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Análise Comparativa (Orçado vs Real)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Manutenção</h3>
                  <p className="text-sm text-muted-foreground">Orçado: R$ 50.000,00 | Gasto: R$ 35.420,00</p>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-semibold">-29%</div>
                  <div className="text-sm text-muted-foreground">Economia</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Energia Elétrica</h3>
                  <p className="text-sm text-muted-foreground">Orçado: R$ 30.000,00 | Gasto: R$ 32.150,00</p>
                </div>
                <div className="text-right">
                  <div className="text-red-600 font-semibold">+7%</div>
                  <div className="text-sm text-muted-foreground">Acima do orçado</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Limpeza</h3>
                  <p className="text-sm text-muted-foreground">Orçado: R$ 25.000,00 | Gasto: R$ 24.860,00</p>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-semibold">-1%</div>
                  <div className="text-sm text-muted-foreground">Dentro do orçado</div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Upload e Análise de Excel</h3>
                <p className="text-sm text-muted-foreground">
                  Importe planilhas Excel automaticamente e faça a análise dos dados financeiros.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Comparação Automática Orçado vs Real</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize automaticamente as diferenças entre valores orçados e gastos reais.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Geração Automática de Relatórios</h3>
                <p className="text-sm text-muted-foreground">
                  Gere relatórios financeiros completos automaticamente com gráficos e análises.
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