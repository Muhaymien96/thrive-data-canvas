
export interface VariantFormData {
  variant_type: string;
  variant_value: string;
  sku: string;
  cost: string;
  price: string;
  currentStock: string;
  minStockLevel: string;
  maxStock: string;
  conversionFactor: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  cost: string;
  price: string;
  category: string;
  unit: string;
  currentStock: string;
  minStockLevel: string;
  maxStock: string;
  supplierId: string;
  expiryDate: string;
  sku: string;
}
