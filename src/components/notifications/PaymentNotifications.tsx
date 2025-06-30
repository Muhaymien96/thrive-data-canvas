
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, DollarSign } from 'lucide-react';

export const PaymentNotifications = () => {
  const overduePayments = [
    {
      id: '1',
      supplier: 'Ocean Fresh Seafood',
      amount: 15000,
      dueDate: '2024-12-15',
      daysOverdue: 5,
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: '2',
      supplier: 'Premium Honey Co',
      amount: 8500,
      dueDate: '2024-12-20',
      daysOverdue: 2,
      invoiceNumber: 'INV-2024-002'
    }
  ];

  const upcomingPayments = [
    {
      id: '1',
      supplier: 'Mushroom Farms Ltd',
      amount: 12000,
      dueDate: '2024-12-28',
      daysUntilDue: 3,
      invoiceNumber: 'INV-2024-003'
    }
  ];

  if (overduePayments.length === 0 && upcomingPayments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Overdue Payments */}
      {overduePayments.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle size={18} />
              <span>Overdue Payments</span>
              <Badge variant="destructive">{overduePayments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overduePayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">{payment.supplier}</div>
                    <div className="text-sm text-slate-600">
                      {payment.invoiceNumber} • {payment.daysOverdue} days overdue
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">R{payment.amount.toLocaleString()}</div>
                    <Button size="sm" variant="outline" className="mt-1">
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Payments */}
      {upcomingPayments.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-yellow-700">
              <Calendar size={18} />
              <span>Upcoming Payments</span>
              <Badge className="bg-yellow-100 text-yellow-800">{upcomingPayments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">{payment.supplier}</div>
                    <div className="text-sm text-slate-600">
                      {payment.invoiceNumber} • Due in {payment.daysUntilDue} days
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-yellow-600">R{payment.amount.toLocaleString()}</div>
                    <Button size="sm" variant="outline" className="mt-1">
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
