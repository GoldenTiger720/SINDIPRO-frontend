import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, TrendingUp, BarChart3, Calculator, DollarSign, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTranslation } from "react-i18next";

interface MarketingValuesProps {
  // Building selection
  selectedBuilding: any;
  
  // Market calculation
  marketCalculationType: 'sale' | 'rental' | 'condominium';
  setMarketCalculationType: (type: 'sale' | 'rental' | 'condominium') => void;
  
  // Market values
  marketValues: any;
  setMarketValues: (values: any) => void;
  
  // Unit custom values
  unitCustomValues: any;
  setUnitCustomValues: (values: any) => void;
  
  // Brazilian data
  brazilianData: any;
  
  // Functions
  exportToExcel: () => void;
}

export function MarketingValues({
  selectedBuilding,
  marketCalculationType,
  setMarketCalculationType,
  marketValues,
  setMarketValues,
  unitCustomValues,
  setUnitCustomValues,
  brazilianData,
  exportToExcel
}: MarketingValuesProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Building and Location Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {t("buildingInformation")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedBuilding ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p><strong>{t("building")}:</strong> {selectedBuilding.building_name}</p>
                {selectedBuilding.address && (
                  <>
                    <p><strong>{t("neighborhood")}:</strong> {selectedBuilding.address.neighborhood}</p>
                    <p><strong>{t("city")}:</strong> {selectedBuilding.address.city}</p>
                  </>
                )}
              </div>
              <div>
                <Label>{t("calculationMethod")}</Label>
                <Select 
                  value={marketCalculationType} 
                  onValueChange={(value) => setMarketCalculationType(value as 'sale' | 'rental' | 'condominium')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">{t("saleValue")}</SelectItem>
                    <SelectItem value="rental">{t("rentalValue")}</SelectItem>
                    <SelectItem value="condominium">{t("condominiumValue")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">{t("selectBuildingFirst")}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Market Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t("marketValueRanges")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("saleMin")} (R$/m²)</Label>
              <Input
                type="number"
                value={marketValues.saleMin}
                onChange={(e) => setMarketValues({...marketValues, saleMin: parseFloat(e.target.value) || 0})}
                placeholder="11000"
              />
            </div>
            <div>
              <Label>{t("saleMax")} (R$/m²)</Label>
              <Input
                type="number"
                value={marketValues.saleMax}
                onChange={(e) => setMarketValues({...marketValues, saleMax: parseFloat(e.target.value) || 0})}
                placeholder="13000"
              />
            </div>
            <div>
              <Label>{t("rentalMin")} (R$/m²)</Label>
              <Input
                type="number"
                value={marketValues.rentalMin}
                onChange={(e) => setMarketValues({...marketValues, rentalMin: parseFloat(e.target.value) || 0})}
                placeholder="45"
              />
            </div>
            <div>
              <Label>{t("rentalMax")} (R$/m²)</Label>
              <Input
                type="number"
                value={marketValues.rentalMax}
                onChange={(e) => setMarketValues({...marketValues, rentalMax: parseFloat(e.target.value) || 0})}
                placeholder="60"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Values Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t("marketValuesComparison")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brazilianData.units.slice(0, 8).map((unit: any) => {
              const customValues = unitCustomValues[unit.id] || {};
              
              const defaultRentalPerM2 = marketValues.rentalMin && marketValues.rentalMax ?
                (marketValues.rentalMin + marketValues.rentalMax) / 2 : 50;
              const defaultSalePerM2 = marketValues.saleMin && marketValues.saleMax ?
                (marketValues.saleMin + marketValues.saleMax) / 2 : 12000;
              const defaultCondoPerM2 = 15;

              const rentalPerM2 = customValues.rentalPerM2 || defaultRentalPerM2;
              const salePerM2 = customValues.salePerM2 || defaultSalePerM2;
              const condoPerM2 = customValues.condoPerM2 || defaultCondoPerM2;

              return {
                name: unit.number,
                rental: unit.area * rentalPerM2,
                condoFee: unit.area * condoPerM2,
                saleValue: (unit.area * salePerM2) / 1000 // Divide by 1000 for better visualization
              };
            })}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                if (name === t("monthlyRental") || name === t("condoFee")) return `R$ ${value.toLocaleString('pt-BR')}`;
                return `R$ ${((value as number) * 1000).toLocaleString('pt-BR')}`;
              }} />
              <Legend />
              <Bar key="rental" yAxisId="left" dataKey="rental" fill="#8884d8" name={t("monthlyRental")} />
              <Bar key="condoFee" yAxisId="left" dataKey="condoFee" fill="#ff7300" name={t("condoFee")} />
              <Bar key="saleValue" yAxisId="right" dataKey="saleValue" fill="#82ca9d" name={t("saleValueThousands")} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Unit Values Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {t("unitValuesTable")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">{t("unit")}</th>
                  <th className="border border-gray-300 p-2 text-left">{t("area")} (m²)</th>
                  <th className="border border-gray-300 p-2 text-left">{t("saleValue")}</th>
                  <th className="border border-gray-300 p-2 text-left">{t("rentalValue")}</th>
                  <th className="border border-gray-300 p-2 text-left">{t("condoFee")}</th>
                </tr>
              </thead>
              <tbody>
                {brazilianData.units.map((unit: any) => {
                  const customValues = unitCustomValues[unit.id] || {};
                  
                  const defaultRentalPerM2 = marketValues.rentalMin && marketValues.rentalMax ?
                    (marketValues.rentalMin + marketValues.rentalMax) / 2 : 50;
                  const defaultSalePerM2 = marketValues.saleMin && marketValues.saleMax ?
                    (marketValues.saleMin + marketValues.saleMax) / 2 : 12000;
                  const defaultCondoPerM2 = 15;

                  const rentalPerM2 = customValues.rentalPerM2 || defaultRentalPerM2;
                  const salePerM2 = customValues.salePerM2 || defaultSalePerM2;
                  const condoPerM2 = customValues.condoPerM2 || defaultCondoPerM2;

                  return (
                    <tr key={unit.id}>
                      <td className="border border-gray-300 p-2 font-medium">{unit.number}</td>
                      <td className="border border-gray-300 p-2">{unit.area}</td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex items-center gap-2">
                          <span>R$ {(unit.area * salePerM2).toLocaleString('pt-BR')}</span>
                          <Input
                            type="number"
                            className="w-20 h-6 text-xs"
                            placeholder={salePerM2.toString()}
                            value={customValues.salePerM2 || ''}
                            onChange={(e) => setUnitCustomValues({
                              ...unitCustomValues,
                              [unit.id]: {
                                ...customValues,
                                salePerM2: parseFloat(e.target.value) || defaultSalePerM2
                              }
                            })}
                          />
                          <span className="text-xs text-muted-foreground">/m²</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex items-center gap-2">
                          <span>R$ {(unit.area * rentalPerM2).toLocaleString('pt-BR')}</span>
                          <Input
                            type="number"
                            className="w-20 h-6 text-xs"
                            placeholder={rentalPerM2.toString()}
                            value={customValues.rentalPerM2 || ''}
                            onChange={(e) => setUnitCustomValues({
                              ...unitCustomValues,
                              [unit.id]: {
                                ...customValues,
                                rentalPerM2: parseFloat(e.target.value) || defaultRentalPerM2
                              }
                            })}
                          />
                          <span className="text-xs text-muted-foreground">/m²</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex items-center gap-2">
                          <span>R$ {(unit.area * condoPerM2).toLocaleString('pt-BR')}</span>
                          <Input
                            type="number"
                            className="w-20 h-6 text-xs"
                            placeholder={condoPerM2.toString()}
                            value={customValues.condoPerM2 || ''}
                            onChange={(e) => setUnitCustomValues({
                              ...unitCustomValues,
                              [unit.id]: {
                                ...customValues,
                                condoPerM2: parseFloat(e.target.value) || defaultCondoPerM2
                              }
                            })}
                          />
                          <span className="text-xs text-muted-foreground">/m²</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={exportToExcel} size="sm">
              <Download className="w-4 h-4 mr-2" />
              {t("exportToExcel")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Market Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t("marketTrends")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { month: 'Jan 2024', salePrice: 11500, rentalPrice: 52, condoFee: 15 },
              { month: 'Fev 2024', salePrice: 11800, rentalPrice: 53, condoFee: 15 },
              { month: 'Mar 2024', salePrice: 12000, rentalPrice: 54, condoFee: 16 },
              { month: 'Abr 2024', salePrice: 12200, rentalPrice: 55, condoFee: 16 },
              { month: 'Mai 2024', salePrice: 12400, rentalPrice: 56, condoFee: 17 },
              { month: 'Jun 2024', salePrice: 12600, rentalPrice: 57, condoFee: 17 },
              { month: 'Jul 2024', salePrice: 12800, rentalPrice: 58, condoFee: 18 },
              { month: 'Ago 2024', salePrice: 13000, rentalPrice: 59, condoFee: 18 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                if (name.includes('Price')) return `R$ ${value.toLocaleString('pt-BR')}/m²`;
                return `R$ ${value}/m²`;
              }} />
              <Legend />
              <Line key="salePrice" yAxisId="left" type="monotone" dataKey="salePrice" stroke="#8884d8" name={t("salePrice")} strokeWidth={2} />
              <Line key="rentalPrice" yAxisId="right" type="monotone" dataKey="rentalPrice" stroke="#82ca9d" name={t("rentalPrice")} strokeWidth={2} />
              <Line key="condoFee" yAxisId="right" type="monotone" dataKey="condoFee" stroke="#ff7300" name={t("condoFeePerM2")} strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}