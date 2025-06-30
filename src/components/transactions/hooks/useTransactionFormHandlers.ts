
export const useTransactionFormHandlers = (
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  setShowQuickAddCustomer: React.Dispatch<React.SetStateAction<boolean>>,
  setShowQuickAddSupplier: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedProductId: React.Dispatch<React.SetStateAction<string>>,
  customers: any[],
  suppliers: any[],
  employees: any[]
) => {
  const handleTransactionTypeChange = (value: string) => {
    setFormData((prev: any) => ({ 
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
  };

  const handleCustomerCreated = (customerId: string, customerName: string) => {
    setFormData((prev: any) => ({
      ...prev,
      customer_id: customerId,
      customer_name: customerName
    }));
    setShowQuickAddCustomer(false);
  };

  const handleSupplierCreated = (supplierId: string, supplierName: string) => {
    setFormData((prev: any) => ({
      ...prev,
      supplier_id: supplierId,
      customer_name: supplierName
    }));
    setShowQuickAddSupplier(false);
  };

  const handleCustomerSelect = (customerId: string) => {
    if (customerId === 'none') return;
    const customer = customers.find(c => c.id === customerId);
    setFormData((prev: any) => ({
      ...prev,
      customer_id: customerId,
      customer_name: customer?.name || ''
    }));
  };

  const handleSupplierSelect = (supplierId: string) => {
    if (supplierId === 'none') return;
    const supplier = suppliers.find(s => s.id === supplierId);
    setFormData((prev: any) => ({
      ...prev,
      supplier_id: supplierId,
      customer_name: supplier?.name || ''
    }));
  };

  const handleEmployeeSelect = (employeeId: string) => {
    if (employeeId === 'none') return;
    const employee = employees.find(e => e.id === employeeId);
    setFormData((prev: any) => ({
      ...prev,
      employee_id: employeeId,
      customer_name: employee?.name || '',
      hourly_rate: employee?.hourly_rate || null
    }));
  };

  const handleProductSelect = (productId: string) => {
    if (productId === 'none') {
      setSelectedProductId('none');
      setFormData((prev: any) => ({
        ...prev,
        amount: 0,
        description: ''
      }));
    } else {
      setSelectedProductId(productId);
    }
  };

  return {
    handleTransactionTypeChange,
    handleCustomerCreated,
    handleSupplierCreated,
    handleCustomerSelect,
    handleSupplierSelect,
    handleEmployeeSelect,
    handleProductSelect
  };
};
