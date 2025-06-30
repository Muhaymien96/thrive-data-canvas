
import { useState, useEffect } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useProducts } from '@/hooks/useProducts';
import { useEmployees } from '@/hooks/useEmployees';
import type { Transaction } from '@/types/database';

interface UseTransactionFormProps {
  transaction?: Transaction | null;
  businessId: string;
}

export const useTransactionForm = ({ transaction, businessId }: UseTransactionFormProps) => {
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

  useEffect(() => {
    if (formData.type === 'salary' && formData.hourly_rate && formData.hours_worked) {
      const calculatedAmount = formData.hourly_rate * formData.hours_worked;
      setFormData(prev => ({
        ...prev,
        amount: calculatedAmount
      }));
    }
  }, [formData.hourly_rate, formData.hours_worked, formData.type]);

  return {
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
  };
};
