import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, BarChart3, Calculator, Plus, Edit } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTranslation } from "react-i18next";

interface CollectionAccount {
  id: number;
  name: string;
  purpose: string;
  monthlyAmount: number;
  startDate: string;
  active: boolean;
}

interface CondominiumCalculationsProps {
  // User permissions
  isMaster: boolean;
  
  // Collection accounts
  collectionAccounts: CollectionAccount[];
  setEditingCollection: (collection: any) => void;
  setShowCollectionDialog: (show: boolean) => void;
  
  // Data and functions from parent
  brazilianData: any;
}

export function CondominiumCalculations({
  isMaster,
  collectionAccounts,
  setEditingCollection,
  setShowCollectionDialog,
  brazilianData
}: CondominiumCalculationsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Collection Accounts Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {t("collectionAccounts")}
            </span>
            {isMaster && (
              <Button
                onClick={() => {
                  setEditingCollection({
                    id: null,
                    name: '',
                    purpose: '',
                    monthlyAmount: 0,
                    startDate: new Date().toISOString().split('T')[0],
                    active: true
                  });
                  setShowCollectionDialog(true);
                }}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t("addCollection")}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {collectionAccounts.map((collection) => (
              <div key={collection.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{collection.name}</h4>
                    <p className="text-sm text-muted-foreground">{collection.purpose}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={collection.active ? "default" : "secondary"}>
                      {collection.active ? t("active") : t("inactive")}
                    </Badge>
                    {isMaster && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCollection(collection);
                          setShowCollectionDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("monthlyAmount")}: R$ {collection.monthlyAmount.toLocaleString('pt-BR')}</span>
                  <span className="text-muted-foreground">{t("startDate")}: {collection.startDate}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collection Accounts Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t("collectionAccountsChart")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={collectionAccounts.filter(c => c.active).map(collection => ({
              name: collection.name.length > 12 ? collection.name.substring(0, 12) + '...' : collection.name,
              amount: collection.monthlyAmount
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Bar key="amount" dataKey="amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Financial Flow Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t("financialFlowAnalysis")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { month: 'Jan', expenses: 45000, collections: 50000, balance: 5000 },
              { month: 'Fev', expenses: 48000, collections: 50000, balance: 2000 },
              { month: 'Mar', expenses: 47000, collections: 50000, balance: 3000 },
              { month: 'Abr', expenses: 46000, collections: 50000, balance: 4000 },
              { month: 'Mai', expenses: 49000, collections: 50000, balance: 1000 },
              { month: 'Jun', expenses: 45000, collections: 50000, balance: 5000 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar key="expenses" dataKey="expenses" fill="#ef4444" name={t("expenses")} />
              <Bar key="collections" dataKey="collections" fill="#10b981" name={t("collections")} />
              <Bar key="balance" dataKey="balance" fill="#3b82f6" name={t("balance")} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {isMaster && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
              <Calculator className="w-5 h-5" />
              {t("expenseDistributionCalculator")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Cost Distribution by Unit */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {t("costDistributionByUnit")}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      key="unitDistribution"
                      data={brazilianData.units.slice(0, 6).map((unit: any) => ({
                        name: `Unidade ${unit.number}`,
                        value: unit.area * 45, // Simplified calculation
                        area: unit.area
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {brazilianData.units.slice(0, 6).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Unit Comparison Radar */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("unitComparisonRadar")}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { subject: 'Manutenção', unit101: 120, unit102: 110, unit201: 130 },
                    { subject: 'Limpeza', unit101: 98, unit102: 130, unit201: 115 },
                    { subject: 'Segurança', unit101: 86, unit102: 130, unit201: 125 },
                    { subject: 'Administração', unit101: 99, unit102: 100, unit201: 105 },
                    { subject: 'Elevador', unit101: 85, unit102: 90, unit201: 95 },
                    { subject: 'Água', unit101: 65, unit102: 85, unit201: 75 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 150]} />
                    <Radar key="unit101" name="Unit 101" dataKey="unit101" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Radar key="unit102" name="Unit 102" dataKey="unit102" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    <Radar key="unit201" name="Unit 201" dataKey="unit201" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}