
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useParentProducts } from '@/hooks/useProducts';
import { VariantForm } from './VariantForm';
import { BasicProductInfo } from './forms/BasicProductInfo';
import { PricingAndStock } from './forms/PricingAndStock';
import { useProductSubmission } from './forms/ProductSubmissionHandler';
import { useSupplierEnsurance } from '@/hooks/useSupplierEnsurance';
import type { ProductType } from '@/types/database';
import type { ProductFormData, VariantFormData } from '@/types/product';

interface ProductFormProps {
  onClose: () => void;
  defaultBusiness?: string;
}

export const ProductForm = ({ onClose, defaultBusiness }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    cost: '',
    price: '',
    category: '',
    unit: '',
    currentStock: '',
    minStockLevel: '',
    maxStock: '',
    supplierId: '',
    expiryDate: '',
    sku: ''
  });

  const [productType, setProductType] = useState<ProductType>('standalone');
  const [parentProductId, setParentProductId] = useState<string>('');
  const [variants, setVariants] = useState<VariantFormData[]>([]);

  const { data: suppliers = [], isLoading: suppliersLoading, refetch: refetchSuppliers } = useSuppliers(defaultBusiness);
  const { data: parentProducts = [] } = useParentProducts(defaultBusiness);
  const { handleSubmit, isSubmitting } = useProductSubmission(onClose);

  useSupplierEnsurance(suppliers, suppliersLoading, defaultBusiness, refetchSuppliers);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await handleSubmit({
      formData,
      productType,
      parentProductId,
      variants,
      suppliers,
      defaultBusiness: defaultBusiness || ''
    });
  };

  const showPricingFields = productType === 'standalone' || productType === 'variant' || productType === 'bulk';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Add New Product
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <VariantForm
            productType={productType}
            onProductTypeChange={setProductType}
            parentProductId={parentProductId}
            onParentProductChange={setParentProductId}
            variants={variants}
            onVariantsChange={setVariants}
            availableParents={parentProducts}
            baseProductName={formData.name}
          />

          <BasicProductInfo
            formData={formData}
            onInputChange={handleInputChange}
            suppliers={suppliers}
            suppliersLoading={suppliersLoading}
          />

          {showPricingFields && (
            <PricingAndStock
              formData={formData}
              onInputChange={handleInputChange}
            />
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
