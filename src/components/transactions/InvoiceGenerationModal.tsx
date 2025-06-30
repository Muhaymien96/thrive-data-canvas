
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateInvoice } from '@/hooks/useInvoices';
import { toast } from '@/hooks/use-toast';
import type { Transaction } from '@/types/database';

interface InvoiceGenerationModalProps {
  transaction: Transaction;
  onClose: () => void;
  onInvoiceGenerated?: (invoiceData: any) => void;
}

export const InvoiceGenerationModal = ({ 
  transaction, 
  onClose, 
  onInvoiceGenerated 
}: InvoiceGenerationModalProps) => {
  const [formData, setFormData] = useState({
    customerName: transaction.customer_name || '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    itemDescription: transaction.description || 'Service/Product',
    notes: '',
    invoiceNumber: `INV-${Date.now()}-${transaction.id.slice(0, 8)}`
  });

  const createInvoice = useCreateInvoice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const invoiceData = {
        invoice_number: formData.invoiceNumber,
        customer_name: formData.customerName,
        customer_id: transaction.customer_id,
        business_id: transaction.business_id,
        issue_date: formData.issueDate,
        due_date: formData.dueDate || null,
        subtotal: transaction.amount,
        tax: 0, // You can add tax calculation logic here
        total: transaction.amount,
        status: 'draft' as const
      };

      await createInvoice.mutateAsync(invoiceData);
      
      // Update the transaction to mark invoice as generated
      onInvoiceGenerated?.({
        ...invoiceData,
        transactionId: transaction.id,
        itemDescription: formData.itemDescription,
        notes: formData.notes
      });

      toast({
        title: "Invoice Generated",
        description: `Invoice ${formData.invoiceNumber} has been created successfully.`,
      });

      onClose();
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Invoice from Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
              required
            />
          </div>

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
              placeholder="Additional notes for the invoice..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={createInvoice.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createInvoice.isPending}
            >
              {createInvoice.isPending ? 'Generating...' : 'Generate Invoice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
