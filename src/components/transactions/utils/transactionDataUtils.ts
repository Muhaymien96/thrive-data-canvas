
import type { Transaction } from '@/types/database';

export const prepareTransactionData = (
  formData: Partial<Transaction>, 
  businessId: string, 
  selectedProductId: string, 
  quantity: number, 
  products: any[]
) => {
  const transactionData = {
    ...formData,
    business_id: businessId,
    invoice_generated: Boolean(formData.invoice_generated)
  };

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

  if (selectedProductId && selectedProductId !== 'none' && quantity > 0) {
    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (selectedProduct) {
      const productInfo = `Product: ${selectedProduct.name}, Quantity: ${quantity}, Unit Price: R${selectedProduct.price}`;
      transactionData.description = transactionData.description 
        ? `${transactionData.description} | ${productInfo}`
        : productInfo;
    }
  }

  return transactionData;
};
