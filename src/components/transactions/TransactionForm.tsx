
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import { QuickAddCustomer } from './QuickAddCustomer';
import { QuickAddSupplier } from './QuickAddSupplier';
import { useCustomers } from '@/hooks/useCustomers';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useProducts } from '@/hooks/useProducts';
import { useEmployees } from '@/hooks/useEmployees';
import type { Transaction } from '@/types/database';

interface TransactionFormProps {
  transaction?: Transaction | null;
  businessId: string;
  onClose: () => void;
  onSave: (transaction: Partial<Transaction>) => void;
}

export const TransactionForm = ({ transaction, businessId, onClose, onSave }: TransactionFormProps) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: transaction?.type || 'sale',
    amount: transaction?.amount || 0,
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    customer_name: transaction?.customer_name || '',
    payment_method: transaction?.payment_method || 'cash',
    payment_status: transaction?.payment_status || 'pending',
    customer_id: transaction?.customer_id || null,
    supplier_id: transaction?.supplier_id || null,
    employee_id: transaction?.employee_id || null,
    hourly_rate: transaction?.hourly_rate || null,
    hours_worked: transaction?.hours_worked || null,
    invoice_generated: transaction?.invoice_generated || false
  });

  const [showQuickAddCustomer, setShowQuickAddCustomer] = useState(false);
  const [showQuickAddSupplier, setShowQuickAddSupplier] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const { data: customers = [] } = useCustomers(businessId);
  const { data: suppliers = [] } = useSuppliers(businessId);
  const { data: products = [] } = useProducts(businessId);
  const { data: employees = [] } = useEmployees(businessId);

  // Auto-calculate amount when product and quantity change
  useEffect(() => {
    if (selectedProductId && selectedProductId !== 'none' && quantity > 0) {
      const selectedProduct = products.find(p => p.id === selectedProductId);
      if (selectedProduct) {
        const calculatedAmount = selectedProduct.price * quantity;
        setFormData(prev => ({
          ...prev,
          amount: calculatedAmount,
          description: prev.description || `${selectedProduct.name} (${quantity} x R${selectedProduct.price})`
        }));
      }
    }
  }, [selectedProductId, quantity, products]);

  // Auto-calculate amount for salary transactions
  useEffect(() => {
    if (formData.type === 'salary' && formData.hourly_rate && formData.hours_worked) {
      const calculatedAmount = formData.hourly_rate * formData.hours_worked;
      setFormData(prev => ({
        ...prev,
        amount: calculatedAmount
      }));
    }
  }, [formData.hourly_rate, formData.hours_worked, formData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare transaction data
    const transactionData = {
      ...formData,
      business_id: businessId,
      invoice_generated: Boolean(formData.invoice_generated)
    };

    // Clear unused fields based on transaction type
    if (formData.type === 'sale') {
      transactionData.supplier_id = null;
      transactionData.employee_id = null;
      transactionData.hourly_rate = null;
      transactionData.hours_worked = null;
    } else if (formData.type === 'expense') {
      transactionData.customer_id = null;
      transactionData.employee_id = null;
      transactionData.hourly_rate = null;
      transactionData.hours_worked = null;
    } else if (formData.type === 'salary') {
      transactionData.customer_id = null;
      transactionData.supplier_id = null;
    } else if (formData.type === 'refund') {
      transactionData.supplier_id = null;
      transactionData.employee_id = null;
      transactionData.hourly_rate = null;
      transactionData.hours_worked = null;
    }

    // Add product information to description if a product was selected
    if (selectedProductId && selectedProductId !== 'none' && quantity > 0) {
      const selectedProduct = products.find(p => p.id === selectedProductId);
      if (selectedProduct) {
        const productInfo = `Product: ${selectedProduct.name}, Quantity: ${quantity}, Unit Price: R${selectedProduct.price}`;
        transactionData.description = transactionData.description 
          ? `${transactionData.description} | ${productInfo}`
          : productInfo;
      }
    }

    onSave(transactionData);
  };

  const handleCustomerCreated = (customerId: string, customerName: string) => {
    setFormData(prev => ({
      ...prev,
      customer_id: customerId,
      customer_name: customerName
    }));
    setShowQuickAddCustomer(false);
  };

  const handleSupplierCreated = (supplierId: string, supplierName: string) => {
    setFormData(prev => ({
      ...prev,
      supplier_id: supplierId,
      customer_name: supplierName
    }));
    setShowQuickAddSupplier(false);
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customer_id: customerId,
      customer_name: customer?.name || ''
    }));
  };

  const handleSupplierSelect = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setFormData(prev => ({
      ...prev,
      supplier_id: supplierId,
      customer_name: supplier?.name || ''
    }));
  };

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    setFormData(prev => ({
      ...prev,
      employee_id: employeeId,
      customer_name: employee?.name || '',
      hourly_rate: employee?.hourly_rate || null
    }));
  };

  const handleProductSelect = (productId: string) => {
    if (productId === 'none') {
      setSelectedProductId('none');
      setFormData(prev => ({
        ...prev,
        amount: 0,
        description: ''
      }));
    } else {
      setSelectedProductId(productId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Transaction Type</Label>
              <Select
                value={formData.type || 'sale'}
                onValueChange={(value) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    type: value,
                    customer_id: null,
                    supplier_id: null,
                    employee_id: null,
                    customer_name: '',
                    hourly_rate: null,
                    hours_worked: null
                  }));
                  setShowQuickAddCustomer(false);
                  setShowQuickAddSupplier(false);
                  setSelectedProductId('none');
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="salary">Employee Salary</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Selection for Sales */}
            {formData.type === 'sale' && (
              <div>
                <Label htmlFor="product">Product (Optional)</Label>
                <Select
                  value={selectedProductId || 'none'}
                  onValueChange={handleProductSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No product selected</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - R{product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity field - only show if product is selected */}
            {selectedProductId && selectedProductId !== 'none' && formData.type === 'sale' && (
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  step="1"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (R)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  min="0"
                  step="0.01"
                  required
                  disabled={formData.type === 'salary' && formData.hourly_rate && formData.hours_worked}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Customer Selection for Sales */}
            {formData.type === 'sale' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Customer</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuickAddCustomer(!showQuickAddCustomer)}
                  >
                    <Plus size={14} className="mr-1" />
                    Add New
                  </Button>
                </div>
                <Select
                  value={formData.customer_id || 'none'}
                  onValueChange={(value) => value !== 'none' && handleCustomerSelect(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer or add new" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No customer selected</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} {customer.email && `(${customer.email})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Supplier Selection for Expenses */}
            {formData.type === 'expense' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Supplier</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuickAddSupplier(!showQuickAddSupplier)}
                  >
                    <Plus size={14} className="mr-1" />
                    Add New
                  </Button>
                </div>
                <Select
                  value={formData.supplier_id || 'none'}
                  onValueChange={(value) => value !== 'none' && handleSupplierSelect(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier or add new" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No supplier selected</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name} {supplier.category && `(${supplier.category})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Employee Selection for Salary */}
            {formData.type === 'salary' && (
              <>
                <div>
                  <Label>Employee</Label>
                  <Select
                    value={formData.employee_id || 'none'}
                    onValueChange={(value) => value !== 'none' && handleEmployeeSelect(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No employee selected</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} {employee.position && `(${employee.position})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate (R)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={formData.hourly_rate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: Number(e.target.value) }))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hours_worked">Hours Worked</Label>
                    <Input
                      id="hours_worked"
                      type="number"
                      value={formData.hours_worked || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, hours_worked: Number(e.target.value) }))}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Generic Customer Name for manual entry */}
            {(formData.type === 'refund' || 
              (formData.type === 'sale' && !formData.customer_id) ||
              (formData.type === 'expense' && !formData.supplier_id) ||
              (formData.type === 'salary' && !formData.employee_id)) && (
              <div>
                <Label htmlFor="customer_name">
                  {formData.type === 'expense' ? 'Supplier Name' : 
                   formData.type === 'salary' ? 'Employee Name' : 'Customer Name'}
                </Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                  placeholder="Optional - for manual entry"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={formData.payment_method || 'cash'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                >
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
                <Select
                  value={formData.payment_status || 'pending'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_status: value }))}
                >
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

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Transaction details..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {transaction ? 'Update Transaction' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Add Components */}
      {showQuickAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <QuickAddCustomer
              businessId={businessId}
              onCustomerCreated={handleCustomerCreated}
              onCancel={() => setShowQuickAddCustomer(false)}
            />
          </div>
        </div>
      )}

      {showQuickAddSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <QuickAddSupplier
              businessId={businessId}
              onSupplierCreated={handleSupplierCreated}
              onCancel={() => setShowQuickAddSupplier(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
