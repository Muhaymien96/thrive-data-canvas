
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format, differenceInDays, parseISO } from 'date-fns';

export const PaymentNotifications = () => {
  const { data: overdueTransactions } = useQuery({
    queryKey: ['overdue-transactions'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'sale')
        .eq('payment_status', 'overdue')
        .lt('due_date', today)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: upcomingTransactions } = useQuery({
    queryKey: ['upcoming-transactions'],
    queryFn: async () => {
      const today = new Date();
      const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'sale')
        .eq('payment_status', 'pending')
        .gte('due_date', today.toISOString().split('T')[0])
        .lte('due_date', threeDaysLater.toISOString().split('T')[0])
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handlePaymentAction = (transactionId: string, action: 'pay' | 'schedule') => {
    toast({
      title: `Payment ${action === 'pay' ? 'Processed' : 'Scheduled'}`,
      description: `Payment has been ${action === 'pay' ? 'marked as paid' : 'scheduled'} for transaction ${transactionId.slice(0, 8)}...`,
    });
  };

  const getOverdueDays = (dueDate: string) => {
    return differenceInDays(new Date(), parseISO(dueDate));
  };

  const getDaysUntilDue = (dueDate: string) => {
    return differenceInDays(parseISO(dueDate), new Date());
  };

  if ((!overdueTransactions || overdueTransactions.length === 0) && 
      (!upcomingTransactions || upcomingTransactions.length === 0)) {
    return (
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-green-600">
            <Clock size={20} className="mr-2" />
            <span>All payments are up to date!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overdue Payments */}
      {overdueTransactions && overdueTransactions.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle size={18} />
              <span>Overdue Payments</span>
              <Badge variant="destructive">{overdueTransactions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">
                      {transaction.customer_name || 'Unknown Customer'}
                    </div>
                    <div className="text-sm text-slate-600">
                      {transaction.invoice_number || `Transaction ${transaction.id.slice(0, 8)}`} • 
                      {getOverdueDays(transaction.due_date!)} days overdue
                    </div>
                    <div className="text-xs text-slate-500">
                      Due: {format(parseISO(transaction.due_date!), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">
                      R{transaction.amount.toLocaleString()}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-1"
                      onClick={() => handlePaymentAction(transaction.id, 'pay')}
                    >
                      Mark Paid
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Payments */}
      {upcomingTransactions && upcomingTransactions.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-yellow-700">
              <Calendar size={18} />
              <span>Upcoming Payments</span>
              <Badge className="bg-yellow-100 text-yellow-800">{upcomingTransactions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">
                      {transaction.customer_name || 'Unknown Customer'}
                    </div>
                    <div className="text-sm text-slate-600">
                      {transaction.invoice_number || `Transaction ${transaction.id.slice(0, 8)}`} • 
                      Due in {getDaysUntilDue(transaction.due_date!)} days
                    </div>
                    <div className="text-xs text-slate-500">
                      Due: {format(parseISO(transaction.due_date!), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-yellow-600">
                      R{transaction.amount.toLocaleString()}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-1"
                      onClick={() => handlePaymentAction(transaction.id, 'schedule')}
                    >
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
