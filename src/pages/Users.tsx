import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings, Users as UsersIcon, Shield, Plus, UserCheck, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Users() {
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
            <Settings className="w-6 h-6 text-pink-500" />
            <h1 className="text-3xl font-bold">Gestão de Usuários e Permissões</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Adicionar Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="user-name">Nome Completo</Label>
                <Input id="user-name" placeholder="Digite o nome completo" />
              </div>
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input id="user-email" type="email" placeholder="usuario@email.com" />
              </div>
              <div>
                <Label htmlFor="user-phone">Telefone</Label>
                <Input id="user-phone" placeholder="(11) 99999-9999" />
              </div>
              <div>
                <Label htmlFor="user-role">Papel/Função</Label>
                <select id="user-role" className="w-full p-2 border rounded">
                  <option value="master">Master (Acesso Total)</option>
                  <option value="manager">Gerente (Acesso Administrativo)</option>
                  <option value="field">Campo (Acesso Limitado)</option>
                  <option value="readonly">Somente Leitura</option>
                </select>
              </div>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Usuário
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Permissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Permissões por Papel</Label>
                <div className="mt-2 space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">Master</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Acesso completo a todos os módulos, configurações e relatórios
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">Gerente</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Acesso administrativo exceto configurações críticas do sistema
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold">Campo</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Acesso a registros de campo, solicitações e consumo apenas
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">João Silva</h3>
                    <p className="text-sm text-muted-foreground">joao.silva@sindipro.com • Master</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Desativar</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Maria Santos</h3>
                    <p className="text-sm text-muted-foreground">maria.santos@sindipro.com • Gerente</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Desativar</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Key className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Carlos Oliveira</h3>
                    <p className="text-sm text-muted-foreground">carlos.oliveira@sindipro.com • Campo</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Desativar</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ana Costa</h3>
                    <p className="text-sm text-muted-foreground">ana.costa@sindipro.com • Somente Leitura • Inativo</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Reativar</Button>
                  <Button variant="outline" size="sm" className="text-red-600">Excluir</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Matriz de Permissões Detalhadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Módulo</th>
                    <th className="text-center p-2">Master</th>
                    <th className="text-center p-2">Gerente</th>
                    <th className="text-center p-2">Campo</th>
                    <th className="text-center p-2">Somente Leitura</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Registro de Edifícios</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">❌ Negado</td>
                    <td className="text-center p-2">👁️ Visualizar</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Gestão Financeira</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">❌ Negado</td>
                    <td className="text-center p-2">👁️ Visualizar</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Equipamentos</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">✏️ Editar</td>
                    <td className="text-center p-2">👁️ Visualizar</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Solicitações de Campo</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">👁️ Visualizar</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Relatórios</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">👁️ Visualizar</td>
                    <td className="text-center p-2">👁️ Visualizar</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Configurações</td>
                    <td className="text-center p-2">✅ Total</td>
                    <td className="text-center p-2">❌ Negado</td>
                    <td className="text-center p-2">❌ Negado</td>
                    <td className="text-center p-2">❌ Negado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}