
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUpdateTransaction } from '@/hooks/useUpdateTransaction';
import { toast } from '@/hooks/use-toast';
import { Calendar, User, Package, CreditCard, FileText, DollarSign } from 'lucide-react';
import type { Transaction } from '@/types/database';

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onClose: () => void;
  onTransactionUpdated?: (transaction: Transaction) => void;
}

export const TransactionDetailsModal = ({ transaction, onClose, onTransactionUpdated }: TransactionDetailsModalProps) => {
  const [paymentStatus, setPaymentStatus] = useState(transaction.payment_status || 'pending');
  const updateTransaction = useUpdateTransaction();

  const handleStatusUpdate = async () => {
    if (paymentStatus === transaction.payment_status) {
      toast({
        title: "No Changes",
        description: "Payment status is already set to this value.",
      });
      return;
    }

    try {
      const updatedTransaction = await updateTransaction.mutateAsync({
        id: transaction.id,
        payment_status: paymentStatus,
      });
      
      onTransactionUpdated?.(updatedTransaction);
      
      toast({
        title: "Status Updated",
        description: `Transaction status updated to ${paymentStatus}`,
      });
    } catch (error) {
      console.error('Error updating transaction status:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'default';
      case 'expense':
        return 'destructive';
      case 'salary':
        return 'secondary';
      case 'refund':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} />
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={getTransactionTypeColor(transaction.type)} className="text-sm">
                {transaction.type === 'salary' ? 'Employee Salary' : transaction.type}
              </Badge>
              <Badge className={`text-sm ${getStatusColor(transaction.payment_status || 'pending')}`}>
                {transaction.payment_status || 'pending'}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-right">
              {formatCurrency(transaction.amount)}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-500" />
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">{new Date(transaction.date).toLocaleDateString()}</span>
              </div>

              {transaction.customer_name && (
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">
                    {transaction.type === 'expense' ? 'Supplier:' : 
                     transaction.type === 'salary' ? 'Employee:' : 'Customer:'}
                  </span>
                  <span className="text-sm">{transaction.customer_name}</span>
                </div>
              )}

              {transaction.payment_method && (
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">Payment Method:</span>
                  <span className="text-sm capitalize">{transaction.payment_method.replace('_', ' ')}</span>
                </div>
              )}

              {transaction.invoice_number && (
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">Invoice:</span>
                  <span className="text-sm">{transaction.invoice_number}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {transaction.type === 'salary' && transaction.hours_worked && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Hours Worked:</span>
                    <span className="text-sm">{transaction.hours_worked}h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Hourly Rate:</span>
                    <span className="text-sm">{formatCurrency(transaction.hourly_rate || 0)}</span>
                  </div>
                </>
              )}

              {transaction.description?.includes('Product:') && (
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">Product Sale</span>
                </div>
              )}

              {transaction.yoco_transaction_id && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Yoco Transaction:</span>
                    <span className="text-sm font-mono">{transaction.yoco_transaction_id}</span>
                  </div>
                  {transaction.yoco_net_amount && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Net Amount:</span>
                      <span className="text-sm">{formatCurrency(transaction.yoco_net_amount)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {transaction.description && (
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <div className="mt-1 p-3 bg-slate-50 rounded-md text-sm">
                {transaction.description}
              </div>
            </div>
          )}

          {transaction.payment_status !== 'paid' && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium">Update Payment Status</Label>
                <div className="flex items-center gap-3">
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleStatusUpdate} 
                    disabled={updateTransaction.isPending || paymentStatus === transaction.payment_status}
                    size="sm"
                  >
                    {updateTransaction.isPending ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
