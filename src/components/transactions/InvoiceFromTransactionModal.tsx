
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Transaction } from '@/types/database';

interface InvoiceFromTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSubmit: (invoiceData: any) => void;
}

export const InvoiceFromTransactionModal = ({ 
  transaction, 
  onClose, 
  onSubmit 
}: InvoiceFromTransactionModalProps) => {
  const [formData, setFormData] = useState({
    customerName: transaction.customer_name || '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    itemDescription: transaction.description || 'Service/Product',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoiceData = {
      ...formData,
      amount: transaction.amount,
      invoiceNumber: `INV-${transaction.id.slice(0, 8)}`,
      transactionId: transaction.id
    };
    
    onSubmit(invoiceData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Invoice from Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="itemDescription">Item Description</Label>
            <Input
              id="itemDescription"
              value={formData.itemDescription}
              onChange={(e) => setFormData({...formData, itemDescription: e.target.value})}
              required
            />
          </div>

          <div>
            <Label>Amount</Label>
            <Input
              value={`R${transaction.amount.toLocaleString()}`}
              readOnly
              className="bg-slate-50"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Generate Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
