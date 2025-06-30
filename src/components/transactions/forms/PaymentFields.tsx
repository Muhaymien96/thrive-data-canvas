
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentFieldsProps {
  paymentMethod: string;
  paymentStatus: string;
  onPaymentMethodChange: (method: string) => void;
  onPaymentStatusChange: (status: string) => void;
}

export const PaymentFields = ({ 
  paymentMethod, 
  paymentStatus, 
  onPaymentMethodChange, 
  onPaymentStatusChange 
}: PaymentFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="payment_method">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="payment_status">Payment Status</Label>
        <Select value={paymentStatus} onValueChange={onPaymentStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
