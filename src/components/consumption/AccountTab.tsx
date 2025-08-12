import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Zap, Flame, CreditCard, Calendar } from "lucide-react";

interface AccountTabProps {
  selectedConsumptionType: string;
  setSelectedConsumptionType: (value: string) => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  billAmount: string;
  setBillAmount: (value: string) => void;
  paymentDate: string;
  setPaymentDate: (value: string) => void;
  handleBillSubmit: () => void;
  registerBillMutation: any;
  currentBills: Array<{
    utilityType: 'water' | 'electricity' | 'gas';
    month: string;
    amount: number;
    paymentDate: string;
    isPaid: boolean;
  }>;
  billsHistoryData: Array<{
    month: string;
    bills: Array<{
      utilityType: 'water' | 'electricity' | 'gas';
      amount: number;
      isPaid: boolean;
    }>;
  }>;
}

export function AccountTab({
  selectedConsumptionType,
  setSelectedConsumptionType,
  selectedMonth,
  setSelectedMonth,
  billAmount,
  setBillAmount,
  paymentDate,
  setPaymentDate,
  handleBillSubmit,
  registerBillMutation,
  currentBills,
  billsHistoryData
}: AccountTabProps) {
  return (
    <div className="space-y-6">
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
            
            <Button 
              className="w-full" 
              onClick={handleBillSubmit}
              disabled={!billAmount || !selectedMonth || !paymentDate || registerBillMutation.isPending}
            >
              {registerBillMutation.isPending ? 'Registering...' : 'Register Monthly Bill'}
            </Button>
          </CardContent>
        </Card>

        {/* Current Bills Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Current Bills & Due Dates</CardTitle>
          </CardHeader>
          <CardContent>
            {currentBills.length > 0 ? (
              <div className="space-y-4">
                {currentBills.map((bill, index) => {
                  const IconComponent = bill.utilityType === 'water' ? Droplets : 
                                      bill.utilityType === 'electricity' ? Zap : Flame;
                  const colorClass = bill.utilityType === 'water' ? 'text-blue-500' : 
                                    bill.utilityType === 'electricity' ? 'text-yellow-500' : 'text-orange-500';
                  const amountColorClass = bill.utilityType === 'water' ? 'text-blue-600' : 
                                         bill.utilityType === 'electricity' ? 'text-yellow-600' : 'text-orange-600';
                  const monthYear = new Date(bill.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  
                  return (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${colorClass}`} />
                        <span className="font-medium capitalize">{bill.utilityType} - {monthYear}</span>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${amountColorClass}`}>R$ {bill.amount.toFixed(2)}</div>
                        <div className={`text-xs ${bill.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                          {bill.isPaid ? 'Paid ✓' : `Due: ${new Date(bill.paymentDate).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Pending:</span>
                    <span className="text-red-600">
                      R$ {currentBills.filter(bill => !bill.isPaid).reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No bills registered yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add your first bill using the form on the left</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Bills History */}
      <Card>
        <CardHeader>
          <CardTitle>Bills History</CardTitle>
        </CardHeader>
        <CardContent>
          {billsHistoryData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {billsHistoryData.map((monthData, index) => {
                const totalAmount = monthData.bills.reduce((sum, bill) => sum + bill.amount, 0);
                const allPaid = monthData.bills.every(bill => bill.isPaid);
                
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`w-5 h-5 ${allPaid ? 'text-green-500' : 'text-blue-500'}`} />
                      <h3 className="font-semibold">{monthData.month}</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      {monthData.bills.map((bill, billIndex) => (
                        <p key={billIndex} className="capitalize">
                          {bill.utilityType}: R$ {bill.amount.toFixed(2)} {bill.isPaid ? '(Paid ✓)' : '(Pending)'}
                        </p>
                      ))}
                      <div className="pt-2 border-t mt-2">
                        <p className="font-semibold">Total: R$ {totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">No bills history yet</p>
              <p className="text-xs text-muted-foreground mt-1">Bills you register will appear here by month</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}