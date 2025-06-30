
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mockCustomers, mockProducts } from '@/lib/mockData';
import type { BusinessWithAll } from '@/types/transaction';

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  paymentTerms: z.number().min(0, 'Payment terms must be positive'),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
    total: z.number().min(0, 'Total must be positive'),
  })).min(1, 'At least one item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  selectedBusiness: BusinessWithAll;
  onClose: () => void;
  onSubmit?: (data: InvoiceFormData, isDraft: boolean) => void;
}

export const InvoiceForm = ({ selectedBusiness, onClose, onSubmit }: InvoiceFormProps) => {
  const [isDraft, setIsDraft] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      paymentTerms: 30,
      items: [{ productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const customerId = watch('customerId');

  // Auto-populate customer details when customer is selected
  React.useEffect(() => {
    if (customerId) {
      const customer = mockCustomers.find(c => c.id === customerId);
      if (customer) {
        setValue('customerName', customer.name);
        setValue('customerEmail', customer.email);
      }
    }
  }, [customerId, setValue]);

  // Calculate totals
  const subtotal = watchedItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const taxRate = 0.15; // 15% VAT
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Update item total when quantity or price changes
  const updateItemTotal = (index: number, quantity: number, unitPrice: number) => {
    const total = quantity * unitPrice;
    setValue(`items.${index}.total`, total);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, productId);
      setValue(`items.${index}.productName`, product.name);
      setValue(`items.${index}.unitPrice`, product.price);
      updateItemTotal(index, watchedItems[index].quantity, product.price);
    }
  };

  const handleFormSubmit = (data: InvoiceFormData) => {
    const invoiceData = {
      ...data,
      subtotal,
      tax,
      total,
      business: selectedBusiness === 'All' ? 'Fish' : selectedBusiness,
      status: isDraft ? 'draft' : 'sent',
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    console.log('Invoice data:', invoiceData);
    
    if (onSubmit) {
      onSubmit(data, isDraft);
    }

    toast({
      title: isDraft ? "Invoice Saved as Draft" : "Invoice Created",
      description: isDraft 
        ? "Invoice has been saved as a draft" 
        : `Invoice ${invoiceData.invoiceNumber} has been created and is ready to send`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-slate-900">Create Invoice</h2>
            <Button variant="outline" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select 
                    value={customerId} 
                    onValueChange={(value) => setValue('customerId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerId && (
                    <p className="text-sm text-red-600">{errors.customerId.message}</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
                  <Input
                    id="paymentTerms"
                    type="number"
                    min="0"
                    {...register('paymentTerms', { valueAsNumber: true })}
                  />
                  {errors.paymentTerms && (
                    <p className="text-sm text-red-600">{errors.paymentTerms.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoice Items</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 })}
                >
                  <Plus size={16} className="mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-4 items-end border-b pb-4">
                    <div className="col-span-4">
                      <Label>Product *</Label>
                      <Select
                        value={watchedItems[index]?.productId || ''}
                        onValueChange={(value) => handleProductSelect(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        {...register(`items.${index}.quantity`, { 
                          valueAsNumber: true,
                          onChange: (e) => updateItemTotal(index, parseInt(e.target.value) || 0, watchedItems[index].unitPrice)
                        })}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Unit Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(`items.${index}.unitPrice`, { 
                          valueAsNumber: true,
                          onChange: (e) => updateItemTotal(index, watchedItems[index].quantity, parseFloat(e.target.value) || 0)
                        })}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Total</Label>
                      <Input
                        type="number"
                        step="0.01"
                        readOnly
                        value={watchedItems[index]?.total?.toFixed(2) || '0.00'}
                        className="bg-slate-50"
                      />
                    </div>

                    <div className="col-span-2">
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
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
                placeholder="Add any additional notes or terms..."
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
              <Save size={16} className="mr-2" />
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
