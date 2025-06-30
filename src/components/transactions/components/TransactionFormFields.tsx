
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TransactionTypeSelector } from '../forms/TransactionTypeSelector';
import { ProductSelector } from '../forms/ProductSelector';
import { CustomerSelector } from '../forms/CustomerSelector';
import { SupplierSelector } from '../forms/SupplierSelector';
import { EmployeeSelector } from '../forms/EmployeeSelector';
import { PaymentFields } from '../forms/PaymentFields';

interface TransactionFormFieldsProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  selectedProductId: string;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  customers: any[];
  suppliers: any[];
  products: any[];
  employees: any[];
  setShowQuickAddCustomer: React.Dispatch<React.SetStateAction<boolean>>;
  setShowQuickAddSupplier: React.Dispatch<React.SetStateAction<boolean>>;
  showQuickAddCustomer: boolean;
  showQuickAddSupplier: boolean;
  handlers: {
    handleTransactionTypeChange: (value: string) => void;
    handleCustomerSelect: (customerId: string) => void;
    handleSupplierSelect: (supplierId: string) => void;
    handleEmployeeSelect: (employeeId: string) => void;
    handleProductSelect: (productId: string) => void;
  };
}

export const TransactionFormFields = ({
  formData,
  setFormData,
  selectedProductId,
  quantity,
  setQuantity,
  customers,
  suppliers,
  products,
  employees,
  setShowQuickAddCustomer,
  setShowQuickAddSupplier,
  showQuickAddCustomer,
  showQuickAddSupplier,
  handlers
}: TransactionFormFieldsProps) => {
  return (
    <>
      <TransactionTypeSelector 
        value={formData.type || 'sale'} 
        onValueChange={handlers.handleTransactionTypeChange} 
      />

      {formData.type === 'sale' && (
        <ProductSelector
          products={products}
          selectedProductId={selectedProductId}
          quantity={quantity}
          onProductSelect={handlers.handleProductSelect}
          onQuantityChange={setQuantity}
          showQuantity={selectedProductId !== '' && selectedProductId !== 'none'}
        />
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

      {formData.type === 'sale' && (
        <CustomerSelector
          customers={customers}
          selectedCustomerId={formData.customer_id}
          onCustomerSelect={handlers.handleCustomerSelect}
          onAddNewClick={() => setShowQuickAddCustomer(!showQuickAddCustomer)}
        />
      )}

      {formData.type === 'expense' && (
        <SupplierSelector
          suppliers={suppliers}
          selectedSupplierId={formData.supplier_id}
          onSupplierSelect={handlers.handleSupplierSelect}
          onAddNewClick={() => setShowQuickAddSupplier(!showQuickAddSupplier)}
        />
      )}

      {formData.type === 'salary' && (
        <EmployeeSelector
          employees={employees}
          selectedEmployeeId={formData.employee_id}
          hourlyRate={formData.hourly_rate}
          hoursWorked={formData.hours_worked}
          onEmployeeSelect={handlers.handleEmployeeSelect}
          onHourlyRateChange={(rate) => setFormData(prev => ({ ...prev, hourly_rate: rate }))}
          onHoursWorkedChange={(hours) => setFormData(prev => ({ ...prev, hours_worked: hours }))}
        />
      )}

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

      <PaymentFields
        paymentMethod={formData.payment_method || 'cash'}
        paymentStatus={formData.payment_status || 'pending'}
        onPaymentMethodChange={(method) => setFormData(prev => ({ ...prev, payment_method: method }))}
        onPaymentStatusChange={(status) => setFormData(prev => ({ ...prev, payment_status: status }))}
      />

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
    </>
  );
};
