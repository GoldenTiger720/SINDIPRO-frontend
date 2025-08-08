import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Droplets, Zap, Flame, TrendingUp, AlertTriangle, Building, Home, Zap as Generator, Calendar, CreditCard, BarChart3 } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Consumption() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('consumption');
  const [selectedConsumptionType, setSelectedConsumptionType] = useState('water');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [gasCategory, setGasCategory] = useState('units');
  const [consumptionValue, setConsumptionValue] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedGraphType, setSelectedGraphType] = useState('water');
  const [graphPeriod, setGraphPeriod] = useState('monthly');
  const [alerts, setAlerts] = useState([]);
  const [previousConsumption, setPreviousConsumption] = useState({
    water: 2.2,
    gas: 1.1,
    electricity: 8.9
  });

  // Mock data for daily consumption (last 7 days)
  const dailyWaterData = [
    { day: 'Mon', value: 2.1, date: '12/02' },
    { day: 'Tue', value: 2.3, date: '12/03' },
    { day: 'Wed', value: 2.2, date: '12/04' },
    { day: 'Thu', value: 2.4, date: '12/05' },
    { day: 'Fri', value: 2.5, date: '12/06' },
    { day: 'Sat', value: 2.3, date: '12/07' },
    { day: 'Sun', value: 2.45, date: '12/08' }
  ];

  const dailyElectricityData = [
    { day: 'Mon', value: 18.5, date: '12/02' },
    { day: 'Tue', value: 19.2, date: '12/03' },
    { day: 'Wed', value: 18.8, date: '12/04' },
    { day: 'Thu', value: 20.1, date: '12/05' },
    { day: 'Fri', value: 19.5, date: '12/06' },
    { day: 'Sat', value: 17.9, date: '12/07' },
    { day: 'Sun', value: 18.9, date: '12/08' }
  ];

  const dailyGasData = [
    { day: 'Mon', value: 1.15, date: '12/02' },
    { day: 'Tue', value: 1.22, date: '12/03' },
    { day: 'Wed', value: 1.18, date: '12/04' },
    { day: 'Thu', value: 1.25, date: '12/05' },
    { day: 'Fri', value: 1.20, date: '12/06' },
    { day: 'Sat', value: 1.28, date: '12/07' },
    { day: 'Sun', value: 1.24, date: '12/08' }
  ];

  // Mock data for monthly consumption
  const monthlyWaterData = [
    { month: 'Jul', value: 68.5, bill: 798.90 },
    { month: 'Aug', value: 71.2, bill: 845.20 },
    { month: 'Sep', value: 69.8, bill: 812.45 },
    { month: 'Oct', value: 72.4, bill: 856.30 },
    { month: 'Nov', value: 74.1, bill: 878.90 },
    { month: 'Dec', value: 73.5, bill: 890.50 }
  ];

  const monthlyElectricityData = [
    { month: 'Jul', value: 245.6, bill: 1145.20 },
    { month: 'Aug', value: 268.9, bill: 1289.40 },
    { month: 'Sep', value: 252.3, bill: 1198.65 },
    { month: 'Oct', value: 275.4, bill: 1312.80 },
    { month: 'Nov', value: 280.2, bill: 1345.90 },
    { month: 'Dec', value: 276.5, bill: 1245.80 }
  ];

  const monthlyGasData = [
    { month: 'Jul', value: 35.2, bill: 398.45 },
    { month: 'Aug', value: 37.8, bill: 432.10 },
    { month: 'Sep', value: 36.1, bill: 412.30 },
    { month: 'Oct', value: 38.5, bill: 445.60 },
    { month: 'Nov', value: 39.2, bill: 452.80 },
    { month: 'Dec', value: 38.7, bill: 456.30 }
  ];

  // Mock data for yearly consumption
  const yearlyData = {
    water: [
      { year: '2020', value: 812.4, bill: 9845.60 },
      { year: '2021', value: 825.8, bill: 10125.40 },
      { year: '2022', value: 838.2, bill: 10456.80 },
      { year: '2023', value: 845.6, bill: 10678.90 },
      { year: '2024', value: 852.3, bill: 10892.50 }
    ],
    electricity: [
      { year: '2020', value: 2985.6, bill: 13456.80 },
      { year: '2021', value: 3024.8, bill: 13892.40 },
      { year: '2022', value: 3156.2, bill: 14325.60 },
      { year: '2023', value: 3098.4, bill: 14156.90 },
      { year: '2024', value: 3178.5, bill: 14789.30 }
    ],
    gas: [
      { year: '2020', value: 425.6, bill: 4856.30 },
      { year: '2021', value: 438.2, bill: 5012.40 },
      { year: '2022', value: 445.8, bill: 5156.80 },
      { year: '2023', value: 452.3, bill: 5289.60 },
      { year: '2024', value: 458.9, bill: 5423.70 }
    ]
  };

  const getDailyData = (type) => {
    switch(type) {
      case 'water': return dailyWaterData;
      case 'electricity': return dailyElectricityData;
      case 'gas': return dailyGasData;
      default: return dailyWaterData;
    }
  };

  const getMonthlyData = (type) => {
    switch(type) {
      case 'water': return monthlyWaterData;
      case 'electricity': return monthlyElectricityData;
      case 'gas': return monthlyGasData;
      default: return monthlyWaterData;
    }
  };

  const getYearlyData = (type) => {
    return yearlyData[type] || yearlyData.water;
  };

  const getChartData = (type, period) => {
    if (period === 'daily') return getDailyData(type);
    if (period === 'monthly') return getMonthlyData(type);
    if (period === 'yearly') return getYearlyData(type);
    return getDailyData(type);
  };

  const getChartColor = (type) => {
    switch(type) {
      case 'water': return '#3b82f6';
      case 'electricity': return '#eab308';
      case 'gas': return '#f97316';
      default: return '#3b82f6';
    }
  };

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

    const alert = checkConsumptionAlert(
      selectedConsumptionType,
      value,
      previousConsumption[selectedConsumptionType]
    );
    
    if (alert) {
      setAlerts(prev => [...prev, { ...alert, id: Date.now() }]);
    }

    setConsumptionValue('');
    setSelectedDate('');
  };

  const handleBillSubmit = () => {
    const amount = parseFloat(billAmount);
    if (!amount || !selectedMonth || !paymentDate) return;

    setBillAmount('');
    setSelectedMonth('');
    setPaymentDate('');
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="consumption" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Consumption</span>
              <span className="sm:hidden">Cons.</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
              <span className="sm:hidden">Acc.</span>
            </TabsTrigger>
            <TabsTrigger value="graphics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Graphics</span>
              <span className="sm:hidden">Graph</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consumption" className="space-y-6">
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
                  
                  <Button className="w-full" onClick={handleConsumptionSubmit}>
                    Register Daily Consumption
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
                  <div className="text-2xl font-bold text-blue-600">2.450 m³</div>
                  <p className="text-sm text-muted-foreground">Today's Reading</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">+5% vs yesterday</span>
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
                  <div className="text-2xl font-bold text-yellow-600">18.9 kWh</div>
                  <p className="text-sm text-muted-foreground">Today's Reading</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                    <span className="text-sm text-red-600">-3% vs yesterday</span>
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
                  <p className="text-sm text-muted-foreground">Today's Reading</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">+2% vs yesterday</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Bill Entry */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Monthly Bill Entry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bill-type">Utility Type</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={selectedConsumptionType}
                      onChange={(e) => setSelectedConsumptionType(e.target.value)}
                    >
                      <option value="water">Water Bill</option>
                      <option value="electricity">Electricity Bill</option>
                      <option value="gas">Gas Bill</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="bill-month">Bill Month/Year</Label>
                    <Input 
                      id="bill-month" 
                      type="month" 
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bill-amount">Bill Amount (R$)</Label>
                    <Input 
                      id="bill-amount" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="payment-date">Payment Due Date</Label>
                    <Input 
                      id="payment-date" 
                      type="date" 
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>
                  
                  <Button className="w-full" onClick={handleBillSubmit}>
                    Register Monthly Bill
                  </Button>
                </CardContent>
              </Card>

              {/* Current Bills Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Bills & Due Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Water - July 2024</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">R$ 890.50</div>
                        <div className="text-xs text-red-600">Due: Aug 15, 2024</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">Electricity - July 2024</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-yellow-600">R$ 1,245.80</div>
                        <div className="text-xs text-red-600">Due: Aug 20, 2024</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">Gas - July 2024</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-orange-600">R$ 456.30</div>
                        <div className="text-xs text-green-600">Paid ✓</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Pending:</span>
                      <span className="text-red-600">R$ 2,136.30</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Bills History */}
            <Card>
              <CardHeader>
                <CardTitle>Bills History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold">July 2024</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>Water: R$ 890.50 (Due: Aug 15)</p>
                      <p>Electricity: R$ 1,245.80 (Due: Aug 20)</p>
                      <p>Gas: R$ 456.30 (Paid ✓)</p>
                      <div className="pt-2 border-t mt-2">
                        <p className="font-semibold">Total: R$ 2,592.60</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <h3 className="font-semibold">June 2024</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>Water: R$ 845.20 (Paid ✓)</p>
                      <p>Electricity: R$ 1,289.40 (Paid ✓)</p>
                      <p>Gas: R$ 432.10 (Paid ✓)</p>
                      <div className="pt-2 border-t mt-2">
                        <p className="font-semibold">Total: R$ 2,566.70</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <h3 className="font-semibold">May 2024</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>Water: R$ 798.90 (Paid ✓)</p>
                      <p>Electricity: R$ 1,145.20 (Paid ✓)</p>
                      <p>Gas: R$ 398.45 (Paid ✓)</p>
                      <div className="pt-2 border-t mt-2">
                        <p className="font-semibold">Total: R$ 2,342.55</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graphics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Chart Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="graph-type">Select Utility</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={selectedGraphType}
                      onChange={(e) => setSelectedGraphType(e.target.value)}
                    >
                      <option value="water">Water Consumption</option>
                      <option value="electricity">Electricity Consumption</option>
                      <option value="gas">Gas Consumption</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="graph-period">Time Period</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={graphPeriod}
                      onChange={(e) => setGraphPeriod(e.target.value)}
                    >
                      <option value="daily">Daily (Last 30 days)</option>
                      <option value="monthly">Monthly (Last 12 months)</option>
                      <option value="yearly">Yearly (Last 5 years)</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-semibold mb-2">Current Selection:</h4>
                    <div className="flex items-center gap-2">
                      {selectedGraphType === 'water' && <Droplets className="w-4 h-4 text-blue-500" />}
                      {selectedGraphType === 'electricity' && <Zap className="w-4 h-4 text-yellow-500" />}
                      {selectedGraphType === 'gas' && <Flame className="w-4 h-4 text-orange-500" />}
                      <span className="capitalize">{selectedGraphType} - {graphPeriod} view</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Chart Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedGraphType === 'water' && <Droplets className="w-5 h-5 text-blue-500" />}
                    {selectedGraphType === 'electricity' && <Zap className="w-5 h-5 text-yellow-500" />}
                    {selectedGraphType === 'gas' && <Flame className="w-5 h-5 text-orange-500" />}
                    {selectedGraphType === 'water' ? 'Water' : 
                     selectedGraphType === 'electricity' ? 'Electricity' : 'Gas'} Evolution - {graphPeriod}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    {graphPeriod === 'daily' ? (
                      <LineChart data={getChartData(selectedGraphType, graphPeriod)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} ${selectedGraphType === 'electricity' ? 'kWh' : 'm³'}`} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={getChartColor(selectedGraphType)} 
                          strokeWidth={2}
                          name={selectedGraphType === 'electricity' ? 'kWh' : 'm³'}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={getChartData(selectedGraphType, graphPeriod)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={graphPeriod === 'monthly' ? 'month' : 'year'} />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'value' ? 
                              `${value} ${selectedGraphType === 'electricity' ? 'kWh' : 'm³'}` : 
                              `R$ ${value.toFixed(2)}`,
                            name === 'value' ? 'Consumption' : 'Bill Amount'
                          ]} 
                        />
                        <Bar dataKey="value" fill={getChartColor(selectedGraphType)} />
                        <Bar dataKey="bill" fill="#94a3b8" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                  <div className="text-center text-xs text-muted-foreground mt-2">
                    Individual {selectedGraphType} consumption evolution
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <p className="text-sm font-medium">Water Total (Dec)</p>
                    </div>
                    <p className="text-sm text-muted-foreground">73.5 m³</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-bold">R$ 890.50</p>
                    <p className="text-xs text-green-600">↓ 1.2% vs Nov</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <p className="text-sm font-medium">Electricity Total (Dec)</p>
                    </div>
                    <p className="text-sm text-muted-foreground">276.5 kWh</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-bold">R$ 1,245.80</p>
                    <p className="text-xs text-red-600">↑ 3.5% vs Nov</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <p className="text-sm font-medium">Gas Total (Dec)</p>
                    </div>
                    <p className="text-sm text-muted-foreground">38.7 m³</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-bold">R$ 456.30</p>
                    <p className="text-xs text-green-600">↓ 0.8% vs Nov</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Individual Charts in Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Water Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    Water - Monthly Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyWaterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#6366f1" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'value' ? `${value} m³` : `R$ ${value.toFixed(2)}`,
                          name === 'value' ? 'Consumption' : 'Bill Amount'
                        ]}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Consumption (m³)" />
                      <Bar yAxisId="right" dataKey="bill" fill="#dbeafe" name="Bill (R$)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Electricity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Electricity - Monthly Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyElectricityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#eab308" />
                      <YAxis yAxisId="right" orientation="right" stroke="#facc15" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'value' ? `${value} kWh` : `R$ ${value.toFixed(2)}`,
                          name === 'value' ? 'Consumption' : 'Bill Amount'
                        ]}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="value" fill="#eab308" name="Consumption (kWh)" />
                      <Bar yAxisId="right" dataKey="bill" fill="#fef3c7" name="Bill (R$)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gas Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Gas - Monthly Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyGasData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#f97316" />
                      <YAxis yAxisId="right" orientation="right" stroke="#fb923c" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'value' ? `${value} m³` : `R$ ${value.toFixed(2)}`,
                          name === 'value' ? 'Consumption' : 'Bill Amount'
                        ]}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="value" fill="#f97316" name="Consumption (m³)" />
                      <Bar yAxisId="right" dataKey="bill" fill="#fed7aa" name="Bill (R$)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      </div>
      </div>
    </div>
  );
}