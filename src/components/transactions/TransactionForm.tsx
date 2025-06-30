
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Receipt } from 'lucide-react';
import type { Transaction, PaymentMethod, TransactionType } from '@/types/transaction';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  selectedBusiness?: string;
}

export const TransactionForm = ({ transaction, onClose, onSave, selectedBusiness }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    business: transaction?.business || selectedBusiness || 'Fish',
    type: transaction?.type || 'sale' as TransactionType,
    amount: transaction?.amount || 0,
    description: transaction?.description || '',
    customer: transaction?.customer || '',
    paymentMethod: transaction?.paymentMethod || 'card' as PaymentMethod,
    cashReceived: transaction?.cashReceived || 0,
    cashChange: transaction?.cashChange || 0,
    invoiceNumber: transaction?.invoiceNumber || '',
    generateInvoice: false
  });

  const [showCashFields, setShowCashFields] = useState(formData.paymentMethod === 'cash');

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
    setShowCashFields(method === 'cash');
  };

  const calculateCashChange = () => {
    if (formData.cashReceived > 0 && formData.amount > 0) {
      const change = formData.cashReceived - formData.amount;
      setFormData(prev => ({ ...prev, cashChange: Math.max(0, change) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransaction: Transaction = {
      id: transaction?.id || Date.now().toString(),
      date: formData.date,
      business: formData.business,
      type: formData.type,
      amount: formData.amount,
      description: formData.description,
      customer: formData.customer,
      paymentMethod: formData.paymentMethod,
      ...(formData.paymentMethod === 'cash' && {
        cashReceived: formData.cashReceived,
        cashChange: formData.cashChange
      }),
      ...(formData.generateInvoice && {
        invoiceNumber: formData.invoiceNumber || `INV-${Date.now()}`,
        invoiceGenerated: true,
        invoiceDate: formData.date
      })
    };

    onSave(newTransaction);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{transaction ? 'Edit Transaction' : 'New Transaction'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="business">Business</Label>
                <Select
                  value={formData.business}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, business: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fish">Fish</SelectItem>
                    <SelectItem value="Honey">Honey</SelectItem>
                    <SelectItem value="Mushrooms">Mushrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Transaction Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as TransactionType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="yoco">Yoco</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (R)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Input
                  id="customer"
                  value={formData.customer}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                  placeholder="Customer name"
                  required
                />
              </div>
            </div>

            {/* Cash Payment Fields */}
            {showCashFields && (
              <div className="space-y-4 p-4 border rounded-lg bg-green-50">
                <h3 className="font-medium text-slate-900 flex items-center">
                  <Receipt size={16} className="mr-2" />
                  Cash Payment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cashReceived">Cash Received (R)</Label>
                    <Input
                      id="cashReceived"
                      type="number"
                      value={formData.cashReceived}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, cashReceived: Number(e.target.value) }));
                      }}
                      onBlur={calculateCashChange}
                      min="0"
                      step="0.01"
                      required={showCashFields}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cashChange">Change Given (R)</Label>
                    <Input
                      id="cashChange"
                      type="number"
                      value={formData.cashChange}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
                {formData.cashReceived > 0 && formData.amount > 0 && formData.cashReceived < formData.amount && (
                  <div className="text-red-600 text-sm">
                    Insufficient cash received. Need R{(formData.amount - formData.cashReceived).toFixed(2)} more.
                  </div>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Transaction description"
                required
              />
            </div>

            {/* Invoice Generation */}
            {formData.type === 'sale' && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="generateInvoice"
                    checked={formData.generateInvoice}
                    onChange={(e) => setFormData(prev => ({ ...prev, generateInvoice: e.target.checked }))}
                  />
                  <Label htmlFor="generateInvoice">Generate Invoice</Label>
                </div>
                {formData.generateInvoice && (
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="Leave blank for auto-generation"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={showCashFields && formData.cashReceived < formData.amount}
              >
                {transaction ? 'Update Transaction' : 'Save Transaction'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
