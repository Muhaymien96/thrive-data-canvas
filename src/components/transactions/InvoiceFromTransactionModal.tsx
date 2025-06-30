
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, FileText, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mockCustomers } from '@/lib/mockData';
import type { Transaction } from '@/types/transaction';

const invoiceSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
  itemDescription: z.string().min(1, 'Item description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

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
  const [isDraft, setIsDraft] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: transaction.customer,
      customerEmail: mockCustomers.find(c => c.name === transaction.customer)?.email || '',
      itemDescription: transaction.description,
      quantity: 1,
      unitPrice: transaction.amount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    },
  });

  const watchedQuantity = watch('quantity');
  const watchedUnitPrice = watch('unitPrice');

  // Calculate totals
  const subtotal = watchedQuantity * watchedUnitPrice;
  const taxRate = 0.15; // 15% VAT
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleFormSubmit = (data: InvoiceFormData) => {
    const invoiceData = {
      ...data,
      transactionId: transaction.id,
      subtotal,
      tax,
      total,
      business: transaction.business,
      status: isDraft ? 'draft' : 'sent',
      invoiceNumber: `INV-${Date.now()}`,
      issueDate: new Date().toISOString().split('T')[0],
      items: [{
        id: `item-${Date.now()}`,
        description: data.itemDescription,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        total: subtotal,
      }],
    };

    console.log('Invoice data from transaction:', invoiceData);
    
    onSubmit(invoiceData);

    toast({
      title: isDraft ? "Invoice Saved as Draft" : "Invoice Created",
      description: isDraft 
        ? "Invoice has been saved as a draft" 
        : `Invoice ${invoiceData.invoiceNumber} has been created from transaction`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-slate-900">Generate Invoice from Transaction</h2>
            <Button variant="outline" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>

          {/* Transaction Reference */}
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg">Source Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-600">Date:</span>
                  <span className="ml-2">{transaction.date}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Amount:</span>
                  <span className="ml-2">R{transaction.amount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Customer:</span>
                  <span className="ml-2">{transaction.customer}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Business:</span>
                  <span className="ml-2">{transaction.business}</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-slate-600">Description:</span>
                <span className="ml-2">{transaction.description}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    {...register('customerName')}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-600">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...register('customerEmail')}
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-red-600">{errors.customerEmail.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-600">{errors.dueDate.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Item */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="itemDescription">Description *</Label>
                <Input
                  id="itemDescription"
                  {...register('itemDescription')}
                />
                {errors.itemDescription && (
                  <p className="text-sm text-red-600">{errors.itemDescription.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    {...register('quantity', { valueAsNumber: true })}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-600">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="unitPrice">Unit Price *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('unitPrice', { valueAsNumber: true })}
                  />
                  {errors.unitPrice && (
                    <p className="text-sm text-red-600">{errors.unitPrice.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax (15%):</span>
                  <span>R{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional notes..."
                {...register('notes')}
                className="min-h-20"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              onClick={() => setIsDraft(true)}
            >
              <FileText size={16} className="mr-2" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              onClick={() => setIsDraft(false)}
            >
              <Send size={16} className="mr-2" />
              Create & Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
