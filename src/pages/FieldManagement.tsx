import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageSquare, Camera, MapPin, Clock, Mail, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function FieldManagement() {
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
            <MessageSquare className="w-6 h-6 text-purple-500" />
            <h1 className="text-3xl font-bold">Gestão de Campo/Solicitações</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Registro de Campo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photo-upload">Foto do Problema/Solicitação</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Clique para tirar foto ou fazer upload</p>
                  <Button variant="outline" className="mt-2">
                    <Camera className="w-4 h-4 mr-2" />
                    Adicionar Foto
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="request-title">Título da Solicitação</Label>
                <Input id="request-title" placeholder="Ex: Vazamento no banheiro do 3º andar" />
              </div>
              <div>
                <Label htmlFor="request-description">Descrição do Problema</Label>
                <textarea 
                  className="w-full p-2 border rounded resize-none" 
                  rows={4}
                  placeholder="Descreva detalhadamente o problema encontrado..."
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localização e Timestamp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">Localização Automática</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lat: -23.5505, Long: -46.6333<br/>
                  Endereço: Rua das Flores, 123 - São Paulo, SP
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">Registro Automático de Tempo</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Data: 15/03/2024<br/>
                  Horário: 14:32:15
                </p>
              </div>
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <select className="w-full p-2 border rounded">
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Criar Solicitação
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Envio Automático de Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="internal-email">Email Interno (Administração)</Label>
                <Input id="internal-email" type="email" placeholder="admin@condominio.com" />
              </div>
              <div>
                <Label htmlFor="contractor-email">Email da Construtora/Fornecedor</Label>
                <Input id="contractor-email" type="email" placeholder="manutencao@empresa.com" />
              </div>
            </div>
            <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                📧 As solicitações serão enviadas automaticamente por email para os responsáveis, 
                incluindo fotos, localização e todos os detalhes registrados.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Solicitações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">Vazamento no banheiro - Apto 302</h3>
                    <p className="text-sm text-muted-foreground">Criado por: João Silva (Zelador)</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">Alta Prioridade</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span><MapPin className="w-3 h-3 inline mr-1" />3º Andar - Bloco A</span>
                  <span><Clock className="w-3 h-3 inline mr-1" />15/03/2024 14:32</span>
                  <span><Mail className="w-3 h-3 inline mr-1" />Enviado para manutenção</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">Lâmpada queimada - Hall principal</h3>
                    <p className="text-sm text-muted-foreground">Criado por: Maria Santos (Portaria)</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">Média Prioridade</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span><MapPin className="w-3 h-3 inline mr-1" />Térreo - Hall</span>
                  <span><Clock className="w-3 h-3 inline mr-1" />14/03/2024 09:15</span>
                  <span><Mail className="w-3 h-3 inline mr-1" />Aguardando resposta</span>
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
                <h3 className="font-semibold mb-2">Controle de Papel Baseado em Permissões</h3>
                <p className="text-sm text-muted-foreground">
                  Sistema de permissões para master/gerente/campo com diferentes níveis de acesso.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Gestão de Histórico de Solicitações</h3>
                <p className="text-sm text-muted-foreground">
                  Mantenha um histórico completo de todas as solicitações e seu status de resolução.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Relatório de Registro de Inspeção</h3>
                <p className="text-sm text-muted-foreground">
                  Gere relatórios detalhados das inspeções de campo e solicitações registradas.
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