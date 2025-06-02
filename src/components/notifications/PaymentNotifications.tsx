
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { mockOutstandingPayments } from '@/lib/mockData';
import { AlertTriangle, Clock } from 'lucide-react';

interface PaymentNotificationsProps {
  context?: 'customers' | 'suppliers' | 'general';
}

export const PaymentNotifications = ({ context = 'general' }: PaymentNotificationsProps) => {
  const today = new Date();
  
  // Filter payments based on context
  let relevantPayments = mockOutstandingPayments;
  if (context === 'customers') {
    relevantPayments = mockOutstandingPayments.filter(payment => payment.type === 'receivable');
  } else if (context === 'suppliers') {
    relevantPayments = mockOutstandingPayments.filter(payment => payment.type === 'payable');
  }
  
  const urgentPayments = relevantPayments.filter(payment => {
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

  const getOverdueTitle = () => {
    if (context === 'customers') return `Overdue Customer Payments (${overduePayments.length})`;
    if (context === 'suppliers') return `Overdue Supplier Payments (${overduePayments.length})`;
    return `Overdue Payments (${overduePayments.length})`;
  };

  const getUpcomingTitle = () => {
    if (context === 'customers') return `Upcoming Customer Payments (${upcomingPayments.length})`;
    if (context === 'suppliers') return `Upcoming Supplier Payments (${upcomingPayments.length})`;
    return `Upcoming Payments (${upcomingPayments.length})`;
  };

  const getPaymentDescription = (payment: any) => {
    if (context === 'customers') {
      return `Money owed to you by ${payment.counterparty}`;
    } else if (context === 'suppliers') {
      return `Money you owe to ${payment.counterparty}`;
    } else {
      return payment.type === 'receivable' 
        ? `Money owed to you by ${payment.counterparty}`
        : `Money you owe to ${payment.counterparty}`;
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {overduePayments.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{getOverdueTitle()}</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              {overduePayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {getPaymentDescription(payment)}
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
          <Clock className="h-4 w-4" />
          <AlertTitle>{getUpcomingTitle()}</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {getPaymentDescription(payment)} 
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
