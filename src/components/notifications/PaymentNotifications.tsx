
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { mockOutstandingPayments } from '@/lib/mockData';
import { AlertTriangle, Bell } from 'lucide-react';

export const PaymentNotifications = () => {
  const today = new Date();
  
  const urgentPayments = mockOutstandingPayments.filter(payment => {
    const dueDate = new Date(payment.dueDate);
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 7;
  });

  const overduePayments = urgentPayments.filter(payment => {
    const dueDate = new Date(payment.dueDate);
    return dueDate < today;
  });

  const upcomingPayments = urgentPayments.filter(payment => {
    const dueDate = new Date(payment.dueDate);
    return dueDate >= today;
  });

  if (urgentPayments.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {overduePayments.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Overdue Payments ({overduePayments.length})</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              {overduePayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {payment.type === 'receivable' ? 'Money owed by' : 'Money you owe'} {payment.counterparty}
                  </span>
                  <Badge variant="destructive">R{payment.amount.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {upcomingPayments.length > 0 && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>Upcoming Payments ({upcomingPayments.length})</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {payment.type === 'receivable' ? 'Money due from' : 'Payment due to'} {payment.counterparty} 
                    ({new Date(payment.dueDate).toLocaleDateString()})
                  </span>
                  <Badge variant="secondary">R{payment.amount.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
