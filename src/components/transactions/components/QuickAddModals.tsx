
import React from 'react';
import { QuickAddCustomer } from '../QuickAddCustomer';
import { QuickAddSupplier } from '../QuickAddSupplier';

interface QuickAddModalsProps {
  showQuickAddCustomer: boolean;
  showQuickAddSupplier: boolean;
  businessId: string;
  onCustomerCreated: (customerId: string, customerName: string) => void;
  onSupplierCreated: (supplierId: string, supplierName: string) => void;
  onCustomerCancel: () => void;
  onSupplierCancel: () => void;
}

export const QuickAddModals = ({
  showQuickAddCustomer,
  showQuickAddSupplier,
  businessId,
  onCustomerCreated,
  onSupplierCreated,
  onCustomerCancel,
  onSupplierCancel
}: QuickAddModalsProps) => {
  return (
    <>
      {showQuickAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <QuickAddCustomer
              businessId={businessId}
              onCustomerCreated={onCustomerCreated}
              onCancel={onCustomerCancel}
            />
          </div>
        </div>
      )}

      {showQuickAddSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <QuickAddSupplier
              businessId={businessId}
              onSupplierCreated={onSupplierCreated}
              onCancel={onSupplierCancel}
            />
          </div>
        </div>
      )}
    </>
  );
};
