
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTransactionForm } from './hooks/useTransactionForm';
import { useTransactionFormHandlers } from './hooks/useTransactionFormHandlers';
import { prepareTransactionData } from './utils/transactionDataUtils';
import { TransactionFormFields } from './components/TransactionFormFields';
import { QuickAddModals } from './components/QuickAddModals';
import type { Transaction } from '@/types/database';

interface TransactionFormProps {
  transaction?: Transaction | null;
  businessId: string;
  onClose: () => void;
  onSave: (transaction: Partial<Transaction>) => void;
}

export const TransactionForm = ({ transaction, businessId, onClose, onSave }: TransactionFormProps) => {
  const {
    formData,
    setFormData,
    showQuickAddCustomer,
    setShowQuickAddCustomer,
    showQuickAddSupplier,
    setShowQuickAddSupplier,
    selectedProductId,
    setSelectedProductId,
    quantity,
    setQuantity,
    customers,
    suppliers,
    products,
    employees
  } = useTransactionForm({ transaction, businessId });

  const handlers = useTransactionFormHandlers(
    setFormData,
    setShowQuickAddCustomer,
    setShowQuickAddSupplier,
    setSelectedProductId,
    customers,
    suppliers,
    employees
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = prepareTransactionData(
      formData,
      businessId,
      selectedProductId,
      quantity,
      products
    );

    onSave(transactionData);
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
            <TransactionFormFields
              formData={formData}
              setFormData={setFormData}
              selectedProductId={selectedProductId}
              quantity={quantity}
              setQuantity={setQuantity}
              customers={customers}
              suppliers={suppliers}
              products={products}
              employees={employees}
              setShowQuickAddCustomer={setShowQuickAddCustomer}
              setShowQuickAddSupplier={setShowQuickAddSupplier}
              showQuickAddCustomer={showQuickAddCustomer}
              showQuickAddSupplier={showQuickAddSupplier}
              handlers={handlers}
            />

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

      <QuickAddModals
        showQuickAddCustomer={showQuickAddCustomer}
        showQuickAddSupplier={showQuickAddSupplier}
        businessId={businessId}
        onCustomerCreated={handlers.handleCustomerCreated}
        onSupplierCreated={handlers.handleSupplierCreated}
        onCustomerCancel={() => setShowQuickAddCustomer(false)}
        onSupplierCancel={() => setShowQuickAddSupplier(false)}
      />
    </div>
  );
};
