
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Building, Hash, User } from 'lucide-react';
import { useUpdateSupplier } from '@/hooks/useSuppliers';
import type { Supplier, SupplierPaymentDetails } from '@/types/database';

interface SupplierPaymentDialogProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
}

export const SupplierPaymentDialog = ({ supplier, isOpen, onClose }: SupplierPaymentDialogProps) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(supplier.outstanding_balance || 0);
  const updateSupplier = useUpdateSupplier();

  const paymentDetails = supplier.payment_details as SupplierPaymentDetails || {};

  const handleMarkAsPaid = async () => {
    try {
      const newBalance = (supplier.outstanding_balance || 0) - paymentAmount;
      await updateSupplier.mutateAsync({
        id: supplier.id,
        outstanding_balance: Math.max(0, newBalance),
        last_payment_date: new Date().toISOString().split('T')[0]
      });
      onClose();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleClearBalance = async () => {
    try {
      await updateSupplier.mutateAsync({
        id: supplier.id,
        outstanding_balance: 0,
        last_payment_date: new Date().toISOString().split('T')[0]
      });
      onClose();
    } catch (error) {
      console.error('Error clearing balance:', error);
    }
  };

  const isLoading = updateSupplier.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard size={20} />
            <span>Pay Supplier</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg">{supplier.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-slate-600">Outstanding Balance:</span>
              <Badge variant={supplier.outstanding_balance && supplier.outstanding_balance > 0 ? "destructive" : "secondary"}>
                R{(supplier.outstanding_balance || 0).toFixed(2)}
              </Badge>
            </div>
          </div>

          {Object.keys(paymentDetails).length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Building size={16} />
                  <span>Payment Details</span>
                </h4>
                <div className="space-y-2 text-sm">
                  {paymentDetails.bank_name && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bank:</span>
                      <span>{paymentDetails.bank_name}</span>
                    </div>
                  )}
                  {paymentDetails.account_holder && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 flex items-center space-x-1">
                        <User size={14} />
                        <span>Account Holder:</span>
                      </span>
                      <span>{paymentDetails.account_holder}</span>
                    </div>
                  )}
                  {paymentDetails.account_number && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 flex items-center space-x-1">
                        <Hash size={14} />
                        <span>Account Number:</span>
                      </span>
                      <span className="font-mono">{paymentDetails.account_number}</span>
                    </div>
                  )}
                  {paymentDetails.swift_code && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">SWIFT Code:</span>
                      <span className="font-mono">{paymentDetails.swift_code}</span>
                    </div>
                  )}
                  {paymentDetails.reference && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Reference:</span>
                      <span>{paymentDetails.reference}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentAmount">Payment Amount</Label>
              <Input
                id="paymentAmount"
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleMarkAsPaid}
                disabled={isLoading || paymentAmount <= 0}
                className="flex-1"
              >
                {isLoading ? 'Processing...' : 'Mark as Paid'}
              </Button>
              
              {supplier.outstanding_balance && supplier.outstanding_balance > 0 && (
                <Button
                  onClick={handleClearBalance}
                  variant="outline"
                  disabled={isLoading}
                  className="flex-1"
                >
                  Clear Balance
                </Button>
              )}
            </div>

            <Button variant="ghost" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
