
import { useState, useEffect } from 'react';
import { useBusinesses } from './useSupabaseData';

export const useBusinessData = () => {
  const { data: businesses = [], isLoading, error } = useBusinesses();
  const [selectedBusiness, setSelectedBusiness] = useState<string>('All');

  useEffect(() => {
    if (businesses.length > 0 && selectedBusiness === 'All') {
      setSelectedBusiness(businesses[0].id);
    }
  }, [businesses, selectedBusiness]);

  return {
    businesses,
    selectedBusiness,
    setSelectedBusiness,
    isLoading,
    error
  };
};
