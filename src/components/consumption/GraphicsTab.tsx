import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Droplets, Zap, Flame, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GraphicsTabProps {
  selectedGraphType: string;
  setSelectedGraphType: (value: string) => void;
  graphPeriod: string;
  setGraphPeriod: (value: string) => void;
  getChartData: (type: string, period: string) => any[];
  getChartColor: (type: string) => string;
  monthlyWaterData: any[];
  monthlyElectricityData: any[];
  monthlyGasData: any[];
  currentReadings: {
    water: { value: number; date: string; trend: number };
    electricity: { value: number; date: string; trend: number };
    gas: { value: number; date: string; trend: number };
  };
  accountData?: any[];
}

export function GraphicsTab({
  selectedGraphType,
  setSelectedGraphType,
  graphPeriod,
  setGraphPeriod,
  getChartData,
  getChartColor,
  monthlyWaterData,
  monthlyElectricityData,
  monthlyGasData,
  currentReadings,
  accountData
}: GraphicsTabProps) {
  // Get latest bill data for summary statistics
  const getLatestBillForType = (type: string) => {
    if (!accountData || accountData.length === 0) return null;
    
    const bills = accountData
      .filter(bill => bill.utility_type === type)
      .sort((a, b) => new Date(b.month + '-01').getTime() - new Date(a.month + '-01').getTime());
    
    return bills.length > 0 ? bills[0] : null;
  };

  const latestWaterBill = getLatestBillForType('water');
  const latestElectricityBill = getLatestBillForType('electricity');
  const latestGasBill = getLatestBillForType('gas');
  return (
    <div className="space-y-6">
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
                <p className="text-sm font-medium">Water {latestWaterBill ? `(${new Date(latestWaterBill.month + '-01').toLocaleDateString('en-US', { month: 'short' })})` : ''}</p>
              </div>
              <p className="text-sm text-muted-foreground">{currentReadings.water.value.toFixed(1)} m³</p>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">R$ {latestWaterBill ? parseFloat(latestWaterBill.amount).toFixed(2) : '0.00'}</p>
              <p className={`text-xs ${currentReadings.water.trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {currentReadings.water.trend >= 0 ? '↑' : '↓'} {Math.abs(currentReadings.water.trend).toFixed(1)}% vs previous
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <p className="text-sm font-medium">Electricity {latestElectricityBill ? `(${new Date(latestElectricityBill.month + '-01').toLocaleDateString('en-US', { month: 'short' })})` : ''}</p>
              </div>
              <p className="text-sm text-muted-foreground">{currentReadings.electricity.value.toFixed(1)} kWh</p>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">R$ {latestElectricityBill ? parseFloat(latestElectricityBill.amount).toFixed(2) : '0.00'}</p>
              <p className={`text-xs ${currentReadings.electricity.trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {currentReadings.electricity.trend >= 0 ? '↑' : '↓'} {Math.abs(currentReadings.electricity.trend).toFixed(1)}% vs previous
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <p className="text-sm font-medium">Gas {latestGasBill ? `(${new Date(latestGasBill.month + '-01').toLocaleDateString('en-US', { month: 'short' })})` : ''}</p>
              </div>
              <p className="text-sm text-muted-foreground">{currentReadings.gas.value.toFixed(1)} m³</p>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">R$ {latestGasBill ? parseFloat(latestGasBill.amount).toFixed(2) : '0.00'}</p>
              <p className={`text-xs ${currentReadings.gas.trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {currentReadings.gas.trend >= 0 ? '↑' : '↓'} {Math.abs(currentReadings.gas.trend).toFixed(1)}% vs previous
              </p>
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
    </div>
  );
}