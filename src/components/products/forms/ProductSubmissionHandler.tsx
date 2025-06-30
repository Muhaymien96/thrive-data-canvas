
import { toast } from '@/hooks/use-toast';
import { useCreateProduct } from '@/hooks/useProducts';
import type { ProductFormData, VariantFormData } from '@/types/product';
import type { ProductType, Supplier } from '@/types/database';

interface ProductSubmissionData {
  formData: ProductFormData;
  productType: ProductType;
  parentProductId: string;
  variants: VariantFormData[];
  suppliers: Supplier[];
  defaultBusiness: string;
}

export const useProductSubmission = (onClose: () => void) => {
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: ProductSubmissionData) => {
    const { formData, productType, parentProductId, variants, suppliers, defaultBusiness } = data;

    if (!defaultBusiness) {
      toast({
        title: "Error",
        description: "Business ID is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.supplierId) {
      toast({
        title: "Error",
        description: "Please select a supplier",
        variant: "destructive",
      });
      return;
    }

    try {
      if (productType === 'parent' && variants.length > 0) {
        // Create parent product first
        const parentProductData = {
          business_id: defaultBusiness,
          name: formData.name,
          description: formData.description || null,
          cost: 0,
          price: 0,
          category: formData.category || null,
          unit: formData.unit || null,
          current_stock: 0,
          min_stock_level: 0,
          max_stock: null,
          supplier_id: formData.supplierId,
          supplier_name: suppliers.find(s => s.id === formData.supplierId)?.name || null,
          expiry_date: null,
          markup_percentage: null,
          sku: formData.sku || null,
          parent_product_id: null,
          variant_type: null,
          variant_value: null,
          is_bulk_item: false,
          conversion_factor: 1,
          type: productType
        };

        console.log('Creating parent product:', parentProductData);
        const parentProduct = await createProduct.mutateAsync(parentProductData);

        // Create variant products
        for (const variant of variants) {
          const variantProductData = {
            business_id: defaultBusiness,
            name: `${formData.name} ${variant.variant_value}`,
            description: formData.description || null,
            cost: parseFloat(variant.cost) || 0,
            price: parseFloat(variant.price) || 0,
            category: formData.category || null,
            unit: formData.unit || null,
            current_stock: parseInt(variant.currentStock) || 0,
            min_stock_level: parseInt(variant.minStockLevel) || 0,
            max_stock: parseInt(variant.maxStock) || null,
            supplier_id: formData.supplierId,
            supplier_name: suppliers.find(s => s.id === formData.supplierId)?.name || null,
            expiry_date: formData.expiryDate || null,
            markup_percentage: variant.cost && variant.price ? 
              ((parseFloat(variant.price) - parseFloat(variant.cost)) / parseFloat(variant.cost) * 100) : null,
            sku: variant.sku || null,
            parent_product_id: parentProduct.id,
            variant_type: variant.variant_type,
            variant_value: variant.variant_value,
            is_bulk_item: false,
            conversion_factor: parseFloat(variant.conversionFactor) || 1,
            type: 'variant' as ProductType
          };

          console.log('Creating variant product:', variantProductData);
          await createProduct.mutateAsync(variantProductData);
        }

        toast({
          title: "Products Created",
          description: `Successfully created parent product with ${variants.length} variants`,
        });
      } else {
        // Create single product (standalone, variant, or bulk)
        const productData = {
          business_id: defaultBusiness,
          name: formData.name,
          description: formData.description || null,
          cost: parseFloat(formData.cost) || 0,
          price: parseFloat(formData.price) || 0,
          category: formData.category || null,
          unit: formData.unit || null,
          current_stock: parseInt(formData.currentStock) || 0,
          min_stock_level: parseInt(formData.minStockLevel) || 0,
          max_stock: parseInt(formData.maxStock) || null,
          supplier_id: formData.supplierId,
          supplier_name: suppliers.find(s => s.id === formData.supplierId)?.name || null,
          expiry_date: formData.expiryDate || null,
          markup_percentage: formData.cost && formData.price ? 
            ((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.cost) * 100) : null,
          sku: formData.sku || null,
          parent_product_id: productType === 'variant' ? parentProductId : null,
          variant_type: null,
          variant_value: null,
          is_bulk_item: productType === 'bulk',
          conversion_factor: 1,
          type: productType
        };

        console.log('Creating product with data:', productData);
        await createProduct.mutateAsync(productData);
      }

      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleSubmit,
    isSubmitting: createProduct.isPending
  };
};
