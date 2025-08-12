import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, AlertTriangle, CreditCard, BarChart3 } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRegisterDailyConsumption, useRegisterMonthlyBill, useGetConsumptionData, useGetAccountData } from "@/hooks/useConsumption";

// Import the new tab components
import { ConsumptionTab } from "@/components/consumption/ConsumptionTab";
import { AccountTab } from "@/components/consumption/AccountTab";
import { GraphicsTab } from "@/components/consumption/GraphicsTab";

export default function Consumption() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // React Query hooks for consumption and bill registration
  const registerConsumptionMutation = useRegisterDailyConsumption();
  const registerBillMutation = useRegisterMonthlyBill();
  
  // React Query hooks for fetching data on page load
  const { data: consumptionData, isLoading: isLoadingConsumption, error: consumptionError } = useGetConsumptionData();
  const { data: accountData, isLoading: isLoadingAccount, error: accountError } = useGetAccountData();

  // Transform backend consumption data for use in components
  const transformedConsumptionData = useMemo(() => {
    if (!consumptionData) return { water: [], electricity: [], gas: [] };

    const groupedData = {
      water: [] as Array<{ date: string; value: number; day?: string }>,
      electricity: [] as Array<{ date: string; value: number; day?: string }>,
      gas: [] as Array<{ date: string; value: number; day?: string }>
    };

    consumptionData.forEach(item => {
      const utilityType = item.utility_type as 'water' | 'electricity' | 'gas';
      const value = parseFloat(item.value);
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

      if (groupedData[utilityType]) {
        groupedData[utilityType].push({
          date: item.date,
          value,
          day: dayName,
          dateStr
        });
      }
    });

    // Sort by date (newest first) and take last 7 days for daily view
    Object.keys(groupedData).forEach(key => {
      groupedData[key as keyof typeof groupedData] = groupedData[key as keyof typeof groupedData]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7)
        .reverse(); // Show chronological order (oldest to newest)
    });

    return groupedData;
  }, [consumptionData]);

  // Calculate current readings from backend data
  const currentReadings = useMemo(() => {
    if (!consumptionData) {
      return {
        water: { value: 0, date: '', trend: 0 },
        electricity: { value: 0, date: '', trend: 0 },
        gas: { value: 0, date: '', trend: 0 }
      };
    }

    const latestReadings = {
      water: { value: 0, date: '', trend: 0 },
      electricity: { value: 0, date: '', trend: 0 },
      gas: { value: 0, date: '', trend: 0 }
    };

    // Get the latest reading for each utility type
    ['water', 'electricity', 'gas'].forEach(utilityType => {
      const readings = consumptionData
        .filter(item => item.utility_type === utilityType)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (readings.length > 0) {
        const latest = readings[0];
        const previous = readings[1];
        
        latestReadings[utilityType as keyof typeof latestReadings] = {
          value: parseFloat(latest.value),
          date: latest.date,
          trend: previous ? 
            ((parseFloat(latest.value) - parseFloat(previous.value)) / parseFloat(previous.value)) * 100 : 
            0
        };
      }
    });

    return latestReadings;
  }, [consumptionData]);
  
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
  
  // Transform backend account data for current bills and history
  const transformedAccountData = useMemo(() => {
    if (!accountData) return { currentBills: [], billsHistory: [] };

    // Get current date for comparison
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Separate bills into current (unpaid or recent) and history
    const currentBillsList: Array<{
      utilityType: 'water' | 'electricity' | 'gas';
      month: string;
      amount: number;
      paymentDate: string;
      isPaid: boolean;
    }> = [];

    // Group bills by month for history
    const billsByMonth: Record<string, Array<{
      utilityType: 'water' | 'electricity' | 'gas';
      amount: number;
      isPaid: boolean;
    }>> = {};

    accountData.forEach(bill => {
      const paymentDate = new Date(bill.payment_date);
      const isPaid = paymentDate < currentDate;
      
      const billData = {
        utilityType: bill.utility_type as 'water' | 'electricity' | 'gas',
        month: bill.month,
        amount: parseFloat(bill.amount),
        paymentDate: bill.payment_date,
        isPaid
      };

      // Add to current bills if unpaid or payment date is within 30 days
      const daysDiff = Math.floor((currentDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (!isPaid || daysDiff <= 30) {
        currentBillsList.push(billData);
      }

      // Add to history grouped by month
      const monthYear = new Date(bill.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!billsByMonth[monthYear]) {
        billsByMonth[monthYear] = [];
      }
      billsByMonth[monthYear].push({
        utilityType: bill.utility_type as 'water' | 'electricity' | 'gas',
        amount: parseFloat(bill.amount),
        isPaid
      });
    });

    // Convert history to array format
    const billsHistoryArray = Object.entries(billsByMonth)
      .map(([month, bills]) => ({ month, bills }))
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());

    return {
      currentBills: currentBillsList,
      billsHistory: billsHistoryArray
    };
  }, [accountData]);

  // State for current bills (will be updated from user input)
  const [currentBills, setCurrentBills] = useState<Array<{
    utilityType: 'water' | 'electricity' | 'gas';
    month: string;
    amount: number;
    paymentDate: string;
    isPaid: boolean;
  }>>(transformedAccountData.currentBills);
  
  // State for bills history (will be updated from user input)
  const [billsHistoryData, setBillsHistoryData] = useState<Array<{
    month: string;
    bills: Array<{
      utilityType: 'water' | 'electricity' | 'gas';
      amount: number;
      isPaid: boolean;
    }>;
  }>>(transformedAccountData.billsHistory);

  // Update states when backend data changes
  useEffect(() => {
    if (accountData) {
      setCurrentBills(transformedAccountData.currentBills);
      setBillsHistoryData(transformedAccountData.billsHistory);
    }
  }, [accountData, transformedAccountData]);


  // Transform consumption and account data for monthly and yearly graphs
  const graphData = useMemo(() => {
    // Helper to aggregate consumption data by month
    const aggregateByMonth = (data: any[], utilityType: string) => {
      const monthlyAgg: Record<string, { sum: number; count: number; bill?: number }> = {};
      
      data.forEach(item => {
        if (item.utility_type === utilityType) {
          const date = new Date(item.date);
          const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
          
          if (!monthlyAgg[monthKey]) {
            monthlyAgg[monthKey] = { sum: 0, count: 0 };
          }
          
          monthlyAgg[monthKey].sum += parseFloat(item.value);
          monthlyAgg[monthKey].count += 1;
        }
      });

      // Add bill data from accountData
      if (accountData) {
        accountData.forEach(bill => {
          if (bill.utility_type === utilityType && monthlyAgg[bill.month]) {
            monthlyAgg[bill.month].bill = parseFloat(bill.amount);
          }
        });
      }

      // Convert to array and sort by date
      return Object.entries(monthlyAgg)
        .map(([month, data]) => ({
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
          value: parseFloat((data.sum / data.count).toFixed(2)), // Average daily consumption
          bill: data.bill || 0
        }))
        .sort((a, b) => {
          const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
        })
        .slice(-6); // Last 6 months
    };

    // Helper to aggregate by year
    const aggregateByYear = (data: any[], utilityType: string) => {
      const yearlyAgg: Record<string, { sum: number; count: number; billSum: number }> = {};
      
      data.forEach(item => {
        if (item.utility_type === utilityType) {
          const year = new Date(item.date).getFullYear().toString();
          
          if (!yearlyAgg[year]) {
            yearlyAgg[year] = { sum: 0, count: 0, billSum: 0 };
          }
          
          yearlyAgg[year].sum += parseFloat(item.value);
          yearlyAgg[year].count += 1;
        }
      });

      // Add bill data from accountData
      if (accountData) {
        accountData.forEach(bill => {
          if (bill.utility_type === utilityType) {
            const year = bill.month.substring(0, 4);
            if (yearlyAgg[year]) {
              yearlyAgg[year].billSum += parseFloat(bill.amount);
            }
          }
        });
      }

      // Convert to array and sort by year
      return Object.entries(yearlyAgg)
        .map(([year, data]) => ({
          year,
          value: parseFloat(data.sum.toFixed(2)),
          bill: data.billSum
        }))
        .sort((a, b) => parseInt(a.year) - parseInt(b.year))
        .slice(-5); // Last 5 years
    };

    if (!consumptionData) {
      return {
        monthlyWater: [],
        monthlyElectricity: [],
        monthlyGas: [],
        yearlyData: { water: [], electricity: [], gas: [] }
      };
    }

    return {
      monthlyWater: aggregateByMonth(consumptionData, 'water'),
      monthlyElectricity: aggregateByMonth(consumptionData, 'electricity'),
      monthlyGas: aggregateByMonth(consumptionData, 'gas'),
      yearlyData: {
        water: aggregateByYear(consumptionData, 'water'),
        electricity: aggregateByYear(consumptionData, 'electricity'),
        gas: aggregateByYear(consumptionData, 'gas')
      }
    };
  }, [consumptionData, accountData]);

  const monthlyWaterData = graphData.monthlyWater;
  const monthlyElectricityData = graphData.monthlyElectricity;
  const monthlyGasData = graphData.monthlyGas;
  const yearlyData = graphData.yearlyData;

  const getDailyData = (type) => {
    const data = transformedConsumptionData[type as keyof typeof transformedConsumptionData] || [];
    // For daily view, show the last 30 days of data
    if (data.length === 0 && consumptionData) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return consumptionData
        .filter(item => 
          item.utility_type === type && 
          new Date(item.date) >= thirtyDaysAgo
        )
        .map(item => ({
          date: item.date,
          value: parseFloat(item.value),
          day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return data;
  };

  const getMonthlyData = (type) => {
    switch(type) {
      case 'water': return monthlyWaterData.length > 0 ? monthlyWaterData : [];
      case 'electricity': return monthlyElectricityData.length > 0 ? monthlyElectricityData : [];
      case 'gas': return monthlyGasData.length > 0 ? monthlyGasData : [];
      default: return [];
    }
  };

  const getYearlyData = (type) => {
    return yearlyData[type] || [];
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

  const handleConsumptionSubmit = async () => {
    const value = parseFloat(consumptionValue);
    if (!value || !selectedDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Calculate trend vs latest reading from backend data
    const currentReading = currentReadings[selectedConsumptionType as keyof typeof currentReadings];
    const previousValue = currentReading.value || previousConsumption[selectedConsumptionType as keyof typeof previousConsumption];
    const trendPercentage = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0;

    // Check for alerts
    const alert = checkConsumptionAlert(
      selectedConsumptionType,
      value,
      previousValue
    );
    
    if (alert) {
      setAlerts(prev => [...prev, { ...alert, id: Date.now() }]);
    }

    // Use ReactQuery mutation to send authenticated POST request
    try {
      await registerConsumptionMutation.mutateAsync({
        utilityType: selectedConsumptionType as 'water' | 'electricity' | 'gas',
        gasCategory: selectedConsumptionType === 'gas' ? gasCategory as 'units' | 'common' | 'generator' : undefined,
        date: selectedDate,
        value
      });

      // Clear form
      setConsumptionValue('');
      setSelectedDate('');

    } catch (error) {
      // Error is already handled by the mutation
      console.error('Failed to submit consumption:', error);
    }
  };

  const handleBillSubmit = async () => {
    const amount = parseFloat(billAmount);
    if (!amount || !selectedMonth || !paymentDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create new bill object for optimistic update
    const newBill = {
      utilityType: selectedConsumptionType as 'water' | 'electricity' | 'gas',
      month: selectedMonth,
      amount,
      paymentDate,
      isPaid: false
    };

    // Update current bills immediately (optimistic update)
    setCurrentBills(prev => {
      const filtered = prev.filter(bill => 
        !(bill.utilityType === newBill.utilityType && bill.month === newBill.month)
      );
      return [...filtered, newBill];
    });

    // Update bills history immediately
    const monthYear = new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    setBillsHistoryData(prev => {
      const existingMonthIndex = prev.findIndex(item => item.month === monthYear);
      
      if (existingMonthIndex >= 0) {
        const updated = [...prev];
        const existingBillIndex = updated[existingMonthIndex].bills.findIndex(
          bill => bill.utilityType === newBill.utilityType
        );
        
        if (existingBillIndex >= 0) {
          updated[existingMonthIndex].bills[existingBillIndex] = {
            utilityType: newBill.utilityType,
            amount: newBill.amount,
            isPaid: false
          };
        } else {
          updated[existingMonthIndex].bills.push({
            utilityType: newBill.utilityType,
            amount: newBill.amount,
            isPaid: false
          });
        }
        
        return updated;
      } else {
        return [...prev, {
          month: monthYear,
          bills: [{
            utilityType: newBill.utilityType,
            amount: newBill.amount,
            isPaid: false
          }]
        }].sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
      }
    });

    // Use ReactQuery mutation to send authenticated POST request
    try {
      await registerBillMutation.mutateAsync({
        utilityType: selectedConsumptionType as 'water' | 'electricity' | 'gas',
        month: selectedMonth,
        amount,
        paymentDate
      });

      // Clear form on success
      setBillAmount('');
      setSelectedMonth('');
      setPaymentDate('');

    } catch (error) {
      // If API call fails, revert the optimistic updates
      setCurrentBills(prev => prev.filter(bill => 
        !(bill.utilityType === newBill.utilityType && bill.month === newBill.month)
      ));
      
      // Revert bills history update
      setBillsHistoryData(prev => {
        return prev.map(monthData => {
          if (monthData.month === monthYear) {
            return {
              ...monthData,
              bills: monthData.bills.filter(bill => bill.utilityType !== newBill.utilityType)
            };
          }
          return monthData;
        }).filter(monthData => monthData.bills.length > 0);
      });
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Show loading state while fetching data
  if (isLoadingConsumption || isLoadingAccount) {
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
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading consumption data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <ConsumptionTab
              selectedConsumptionType={selectedConsumptionType}
              setSelectedConsumptionType={setSelectedConsumptionType}
              gasCategory={gasCategory}
              setGasCategory={setGasCategory}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              consumptionValue={consumptionValue}
              setConsumptionValue={setConsumptionValue}
              handleConsumptionSubmit={handleConsumptionSubmit}
              registerConsumptionMutation={registerConsumptionMutation}
              currentReadings={currentReadings}
              getDailyData={getDailyData}
              getChartColor={getChartColor}
            />
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <AccountTab
              selectedConsumptionType={selectedConsumptionType}
              setSelectedConsumptionType={setSelectedConsumptionType}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              billAmount={billAmount}
              setBillAmount={setBillAmount}
              paymentDate={paymentDate}
              setPaymentDate={setPaymentDate}
              handleBillSubmit={handleBillSubmit}
              registerBillMutation={registerBillMutation}
              currentBills={currentBills}
              billsHistoryData={billsHistoryData}
            />
          </TabsContent>

          <TabsContent value="graphics" className="space-y-6">
            <GraphicsTab
              selectedGraphType={selectedGraphType}
              setSelectedGraphType={setSelectedGraphType}
              graphPeriod={graphPeriod}
              setGraphPeriod={setGraphPeriod}
              getChartData={getChartData}
              getChartColor={getChartColor}
              monthlyWaterData={monthlyWaterData}
              monthlyElectricityData={monthlyElectricityData}
              monthlyGasData={monthlyGasData}
              currentReadings={currentReadings}
              accountData={accountData}
            />
          </TabsContent>
        </Tabs>

      </div>
      </div>
    </div>
  );
}