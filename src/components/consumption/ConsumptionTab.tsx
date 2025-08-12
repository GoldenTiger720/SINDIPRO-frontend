import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Droplets, Zap, Flame, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConsumptionTabProps {
  selectedConsumptionType: string;
  setSelectedConsumptionType: (value: string) => void;
  gasCategory: string;
  setGasCategory: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  consumptionValue: string;
  setConsumptionValue: (value: string) => void;
  handleConsumptionSubmit: () => void;
  registerConsumptionMutation: any;
  currentReadings: {
    water: { value: number; date: string; trend: number };
    electricity: { value: number; date: string; trend: number };
    gas: { value: number; date: string; trend: number };
  };
  getDailyData: (type: string) => any[];
  getChartColor: (type: string) => string;
}

export function ConsumptionTab({
  selectedConsumptionType,
  setSelectedConsumptionType,
  gasCategory,
  setGasCategory,
  selectedDate,
  setSelectedDate,
  consumptionValue,
  setConsumptionValue,
  handleConsumptionSubmit,
  registerConsumptionMutation,
  currentReadings,
  getDailyData,
  getChartColor
}: ConsumptionTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Consumption Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Daily Consumption Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="consumption-type">Utility Type</Label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedConsumptionType}
                onChange={(e) => setSelectedConsumptionType(e.target.value)}
              >
                <option value="water">Water (m³)</option>
                <option value="electricity">Electricity (kWh)</option>
                <option value="gas">Gas (m³)</option>
              </select>
            </div>
            
            {selectedConsumptionType === 'gas' && (
              <div>
                <Label htmlFor="gas-category">Gas Usage Category</Label>
                <select 
                  className="w-full p-2 border rounded"
                  value={gasCategory}
                  onChange={(e) => setGasCategory(e.target.value)}
                >
                  <option value="units">🏠 Units (Apartments)</option>
                  <option value="common">🏊 Common Area (Pool)</option>
                  <option value="generator">⚡ Generator</option>
                </select>
              </div>
            )}
            
            <div>
              <Label htmlFor="consumption-date">Date</Label>
              <Input 
                id="consumption-date" 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="consumption-value">
                {selectedConsumptionType === 'water' ? 'Water Reading (m³)' : 
                 selectedConsumptionType === 'electricity' ? 'Electricity Reading (kWh)' : 
                 'Gas Reading (m³)'}
              </Label>
              <Input 
                id="consumption-value" 
                type="number" 
                step="0.001"
                placeholder="0.000"
                value={consumptionValue}
                onChange={(e) => setConsumptionValue(e.target.value)}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleConsumptionSubmit}
              disabled={!consumptionValue || !selectedDate || registerConsumptionMutation.isPending}
            >
              {registerConsumptionMutation.isPending ? 'Registering...' : 'Register Daily Consumption'}
            </Button>
            
            <div className="text-xs text-muted-foreground mt-2">
              ⚠️ System will alert if consumption increases by 10% or more
            </div>
          </CardContent>
        </Card>

        {/* Individual Inline Graph */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedConsumptionType === 'water' && <Droplets className="w-5 h-5 text-blue-500" />}
              {selectedConsumptionType === 'electricity' && <Zap className="w-5 h-5 text-yellow-500" />}
              {selectedConsumptionType === 'gas' && <Flame className="w-5 h-5 text-orange-500" />}
              {selectedConsumptionType === 'water' ? 'Water' : 
               selectedConsumptionType === 'electricity' ? 'Electricity' : 'Gas'} - Daily Evolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getDailyData(selectedConsumptionType)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} ${selectedConsumptionType === 'electricity' ? 'kWh' : 'm³'}`} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={getChartColor(selectedConsumptionType)} 
                  strokeWidth={2}
                  name={selectedConsumptionType === 'electricity' ? 'kWh' : 'm³'}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-center text-xs text-muted-foreground mt-2">
              Last 7 days consumption pattern
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Readings Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              {t("water")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currentReadings.water.value > 0 ? `${currentReadings.water.value.toFixed(3)} m³` : 'No reading'}
            </div>
            <p className="text-sm text-muted-foreground">
              {currentReadings.water.date ? `Reading from ${currentReadings.water.date}` : 'Latest Reading'}
            </p>
            {currentReadings.water.trend !== 0 && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${currentReadings.water.trend > 0 ? 'text-red-500' : 'text-green-500 rotate-180'}`} />
                <span className={`text-sm ${currentReadings.water.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {currentReadings.water.trend > 0 ? '+' : ''}{currentReadings.water.trend.toFixed(1)}% vs previous
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              {t("electricity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {currentReadings.electricity.value > 0 ? `${currentReadings.electricity.value.toFixed(3)} kWh` : 'No reading'}
            </div>
            <p className="text-sm text-muted-foreground">
              {currentReadings.electricity.date ? `Reading from ${currentReadings.electricity.date}` : 'Latest Reading'}
            </p>
            {currentReadings.electricity.trend !== 0 && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${currentReadings.electricity.trend > 0 ? 'text-red-500' : 'text-green-500 rotate-180'}`} />
                <span className={`text-sm ${currentReadings.electricity.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {currentReadings.electricity.trend > 0 ? '+' : ''}{currentReadings.electricity.trend.toFixed(1)}% vs previous
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              {t("gas")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {currentReadings.gas.value > 0 ? `${currentReadings.gas.value.toFixed(3)} m³` : 'No reading'}
            </div>
            <p className="text-sm text-muted-foreground">
              {currentReadings.gas.date ? `Reading from ${currentReadings.gas.date}` : 'Latest Reading'}
            </p>
            {currentReadings.gas.trend !== 0 && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${currentReadings.gas.trend > 0 ? 'text-red-500' : 'text-green-500 rotate-180'}`} />
                <span className={`text-sm ${currentReadings.gas.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {currentReadings.gas.trend > 0 ? '+' : ''}{currentReadings.gas.trend.toFixed(1)}% vs previous
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}