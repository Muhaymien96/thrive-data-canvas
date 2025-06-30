
import { useEffect, useRef } from 'react';
import { useCreateSupplier } from '@/hooks/useSuppliers';
import type { Supplier } from '@/types/database';

export const useSupplierEnsurance = (
  suppliers: Supplier[],
  suppliersLoading: boolean,
  defaultBusiness?: string,
  refetchSuppliers?: () => void
) => {
  const createSupplier = useCreateSupplier();
  const selfSupplierCreated = useRef(false);

  useEffect(() => {
    const ensureSelfSupplier = async () => {
      if (!defaultBusiness || selfSupplierCreated.current || suppliersLoading) return;
      
      console.log('Checking for self-supplier. Current suppliers:', suppliers);
      
      const selfSupplier = suppliers.find(s => s.name === 'Self-Produced');
      if (!selfSupplier && suppliers.length >= 0) {
        console.log('Self-supplier not found, creating one...');
        selfSupplierCreated.current = true;
        try {
          await createSupplier.mutateAsync({
            business_id: defaultBusiness,
            name: 'Self-Produced',
            category: 'Internal Production',
            rating: 5,
            total_spent: 0,
            outstanding_balance: 0
          });
          // Refetch suppliers after creating self-supplier
          refetchSuppliers?.();
        } catch (error) {
          console.error('Failed to create self-supplier:', error);
          selfSupplierCreated.current = false;
        }
      }
    };

    ensureSelfSupplier();
  }, [suppliers, suppliersLoading, defaultBusiness, createSupplier, refetchSuppliers]);
};
