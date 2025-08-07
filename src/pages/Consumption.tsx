import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Droplets, Zap, Flame, TrendingUp, AlertTriangle, Building, Home, Zap as Generator, Calendar } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function Consumption() {
  const { t } = useTranslation();
  const [selectedConsumptionType, setSelectedConsumptionType] = useState('water');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [gasCategory, setGasCategory] = useState('units');
  const [consumptionValue, setConsumptionValue] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [previousConsumption, setPreviousConsumption] = useState({
    water: 2.2,
    gas: 1.1
  });

  // Mock function to check for consumption alerts
  const checkConsumptionAlert = (type, currentValue, previousValue) => {
    const increase = ((currentValue - previousValue) / previousValue) * 100;
    if (increase >= 10) {
      return {
        type: 'warning',
        message: `${type} consumption increased by ${increase.toFixed(1)}% - possible leak detected!`,
        timestamp: new Date().toLocaleString()
      };
    }
    return null;
  };

  const handleConsumptionSubmit = () => {
    const value = parseFloat(consumptionValue);
    if (!value || !selectedDate) return;

    if ((selectedConsumptionType === 'water' || selectedConsumptionType === 'gas') && selectedPeriod === 'daily') {
      const alert = checkConsumptionAlert(
        selectedConsumptionType,
        value,
        previousConsumption[selectedConsumptionType]
      );
      
      if (alert) {
        setAlerts(prev => [...prev, { ...alert, id: Date.now() }]);
      }
    }

    // Reset form
    setConsumptionValue('');
    setBillAmount('');
    setSelectedDate('');
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={t("adminSindipro")} />
      <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t("consumptionModule")}</h1>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-800 font-medium">{alert.message}</p>
                      <p className="text-red-600 text-sm mt-1">{alert.timestamp}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                {t("water")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2.450 m³</div>
              <p className="text-sm text-muted-foreground">Daily Reading (m³)</p>
              <div className="mt-2 text-lg font-semibold text-blue-800">R$ 890.50</div>
              <p className="text-xs text-muted-foreground">Monthly Bill Amount</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+5% {t("vsLastMonth")}</span>
              </div>
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
              <div className="text-2xl font-bold text-yellow-600">8.920 kWh</div>
              <p className="text-sm text-muted-foreground">Monthly Bill Only</p>
              <div className="mt-2 text-lg font-semibold text-yellow-800">R$ 1,245.80</div>
              <p className="text-xs text-muted-foreground">Monthly Bill Amount</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                <span className="text-sm text-red-600">-3% {t("vsLastMonth")}</span>
              </div>
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
              <div className="text-2xl font-bold text-orange-600">1.240 m³</div>
              <p className="text-sm text-muted-foreground">Daily Reading (m³)</p>
              <div className="mt-2 text-lg font-semibold text-orange-800">R$ 456.30</div>
              <p className="text-xs text-muted-foreground">Monthly Bill Amount</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+2% {t("vsLastMonth")}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Daily/Monthly Consumption Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="consumption-type">Consumption Type</Label>
                <select 
                  className="w-full p-2 border rounded"
                  value={selectedConsumptionType}
                  onChange={(e) => setSelectedConsumptionType(e.target.value)}
                >
                  <option value="water">Water (m³)</option>
                  <option value="electricity">Electricity (Monthly Bill Only)</option>
                  <option value="gas">Gas (m³)</option>
                </select>
              </div>
              
              {selectedConsumptionType !== 'electricity' && (
                <div>
                  <Label htmlFor="consumption-period">Period</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="daily">Daily Reading</option>
                    <option value="monthly">Monthly Bill</option>
                  </select>
                </div>
              )}
              
              {selectedConsumptionType === 'gas' && selectedPeriod === 'daily' && (
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
              
              {(selectedConsumptionType !== 'electricity' && selectedPeriod === 'daily') && (
                <div>
                  <Label htmlFor="consumption-value">
                    {selectedConsumptionType === 'water' ? 'Water Reading (m³)' : 'Gas Reading (m³)'}
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
              )}
              
              <div>
                <Label htmlFor="bill-amount">Monthly Bill Amount (R$)</Label>
                <Input 
                  id="bill-amount" 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                />
              </div>
              
              <Button className="w-full" onClick={handleConsumptionSubmit}>
                Register {selectedConsumptionType === 'electricity' ? 'Bill' : 'Consumption & Bill'}
              </Button>
              
              <div className="text-xs text-muted-foreground mt-2">
                ⚠️ System will alert if water/gas consumption increases by 10% or more
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Consumption Trend & Monthly Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Responsive chart representation */}
                <div className="h-48 sm:h-64 bg-muted rounded-lg p-2 sm:p-4 overflow-hidden">
                  <div className="h-full flex items-end justify-between gap-1 sm:gap-2 px-1">
                    {/* Mock chart bars for last 6 months - responsive sizing */}
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <div className="bg-blue-500 w-4 sm:w-6 lg:w-8 h-12 sm:h-16 rounded-t mb-1"></div>
                      <div className="bg-orange-500 w-4 sm:w-6 lg:w-8 h-8 sm:h-12 rounded-t mb-1"></div>
                      <div className="bg-yellow-500 w-4 sm:w-6 lg:w-8 h-6 sm:h-8 rounded-t mb-2"></div>
                      <div className="text-xs mt-1 font-medium">Jan</div>
                      <div className="text-xs text-muted-foreground hidden sm:block">R$2,592</div>
                      <div className="text-xs text-muted-foreground sm:hidden">2.5k</div>
                    </div>
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <div className="bg-blue-500 w-4 sm:w-6 lg:w-8 h-14 sm:h-18 rounded-t mb-1"></div>
                      <div className="bg-orange-500 w-4 sm:w-6 lg:w-8 h-10 sm:h-14 rounded-t mb-1"></div>
                      <div className="bg-yellow-500 w-4 sm:w-6 lg:w-8 h-7 sm:h-10 rounded-t mb-2"></div>
                      <div className="text-xs mt-1 font-medium">Feb</div>
                      <div className="text-xs text-muted-foreground hidden sm:block">R$2,745</div>
                      <div className="text-xs text-muted-foreground sm:hidden">2.7k</div>
                    </div>
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <div className="bg-blue-500 w-4 sm:w-6 lg:w-8 h-16 sm:h-20 rounded-t mb-1"></div>
                      <div className="bg-orange-500 w-4 sm:w-6 lg:w-8 h-7 sm:h-10 rounded-t mb-1"></div>
                      <div className="bg-yellow-500 w-4 sm:w-6 lg:w-8 h-8 sm:h-12 rounded-t mb-2"></div>
                      <div className="text-xs mt-1 font-medium">Mar</div>
                      <div className="text-xs text-muted-foreground hidden sm:block">R$2,890</div>
                      <div className="text-xs text-muted-foreground sm:hidden">2.9k</div>
                    </div>
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <div className="bg-blue-500 w-4 sm:w-6 lg:w-8 h-13 sm:h-17 rounded-t mb-1"></div>
                      <div className="bg-orange-500 w-4 sm:w-6 lg:w-8 h-9 sm:h-13 rounded-t mb-1"></div>
                      <div className="bg-yellow-500 w-4 sm:w-6 lg:w-8 h-8 sm:h-11 rounded-t mb-2"></div>
                      <div className="text-xs mt-1 font-medium">Apr</div>
                      <div className="text-xs text-muted-foreground hidden sm:block">R$2,654</div>
                      <div className="text-xs text-muted-foreground sm:hidden">2.7k</div>
                    </div>
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <div className="bg-blue-500 w-4 sm:w-6 lg:w-8 h-15 sm:h-19 rounded-t mb-1"></div>
                      <div className="bg-orange-500 w-4 sm:w-6 lg:w-8 h-11 sm:h-15 rounded-t mb-1"></div>
                      <div className="bg-yellow-500 w-4 sm:w-6 lg:w-8 h-9 sm:h-13 rounded-t mb-2"></div>
                      <div className="text-xs mt-1 font-medium">May</div>
                      <div className="text-xs text-muted-foreground hidden sm:block">R$2,983</div>
                      <div className="text-xs text-muted-foreground sm:hidden">3.0k</div>
                    </div>
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <div className="bg-blue-500 w-4 sm:w-6 lg:w-8 h-12 sm:h-16 rounded-t mb-1"></div>
                      <div className="bg-orange-500 w-4 sm:w-6 lg:w-8 h-8 sm:h-12 rounded-t mb-1"></div>
                      <div className="bg-yellow-500 w-4 sm:w-6 lg:w-8 h-10 sm:h-14 rounded-t mb-2"></div>
                      <div className="text-xs mt-1 font-medium">Jun</div>
                      <div className="text-xs text-muted-foreground hidden sm:block">R$2,735</div>
                      <div className="text-xs text-muted-foreground sm:hidden">2.7k</div>
                    </div>
                  </div>
                </div>
                
                {/* Responsive Legend */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded"></div>
                    <span>Water</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded"></div>
                    <span>Gas</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded"></div>
                    <span>Electricity</span>
                  </div>
                </div>
                
                <div className="text-center text-xs sm:text-sm text-muted-foreground px-2">
                  Monthly spending trends with consumption amounts
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Monthly Consumption & Bills History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">June 2024</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Water: 2.450 m³ - R$ 890.50</p>
                  <p>Electricity: 8.920 kWh - R$ 1,245.80</p>
                  <p>Gas: 1.240 m³ - R$ 456.30</p>
                  <div className="pt-2 border-t mt-2">
                    <p className="font-semibold">Total: R$ 2,592.60</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">May 2024</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Water: 2.320 m³ - R$ 845.20</p>
                  <p>Electricity: 9.200 kWh - R$ 1,289.40</p>
                  <p>Gas: 1.180 m³ - R$ 432.10</p>
                  <div className="pt-2 border-t mt-2">
                    <p className="font-semibold">Total: R$ 2,566.70</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold">Alert Settings</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>⚠️ Water: Alert at +10% increase</p>
                  <p>⚠️ Gas: Alert at +10% increase</p>
                  <p>📊 Automatic leak detection</p>
                  <p>📅 Daily readings required</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("relatedFeatures")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("directFieldAppEntry")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("directFieldAppEntryDesc")}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t("periodicConsumptionChart")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("periodicConsumptionChartDesc")}
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