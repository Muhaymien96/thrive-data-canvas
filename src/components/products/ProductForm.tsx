
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { calculateMarkup, calculateSellingPrice } from '@/lib/mockData';
import type { Business } from '@/types/transaction';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  business: z.enum(['Fish', 'Honey', 'Mushrooms'], {
    required_error: 'Please select a business',
  }),
  category: z.string().min(2, 'Category is required'),
  unit: z.string().min(1, 'Unit is required'),
  costPrice: z.number().positive('Cost price must be positive'),
  sellingPrice: z.number().positive('Selling price must be positive'),
  currentStock: z.number().min(0, 'Stock cannot be negative'),
  minStockLevel: z.number().min(0, 'Minimum stock level cannot be negative'),
  supplier: z.string().min(2, 'Supplier is required'),
  expiryDate: z.string().optional(),
}).refine((data) => data.sellingPrice > data.costPrice, {
  message: 'Selling price must be higher than cost price',
  path: ['sellingPrice'],
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onClose: () => void;
  defaultBusiness?: Business;
}

export const ProductForm = ({ onClose, defaultBusiness }: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      business: defaultBusiness !== 'All' ? defaultBusiness as 'Fish' | 'Honey' | 'Mushrooms' : undefined,
    },
  });

  const selectedBusiness = watch('business');
  const costPrice = watch('costPrice');
  const sellingPrice = watch('sellingPrice');

  React.useEffect(() => {
    if (costPrice && sellingPrice) {
      const markup = calculateMarkup(costPrice, sellingPrice);
      console.log(`Markup: ${markup.toFixed(1)}%`);
    }
  }, [costPrice, sellingPrice]);

  const handleMarkupChange = (markupPercentage: number) => {
    if (costPrice) {
      const newSellingPrice = calculateSellingPrice(costPrice, markupPercentage);
      setValue('sellingPrice', Math.round(newSellingPrice * 100) / 100);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    console.log('Product added:', data);
    
    toast({
      title: "Product Added",
      description: `Successfully added ${data.name} to inventory`,
    });
    onClose();
  };

  const getUnitsForBusiness = (business: string) => {
    switch (business) {
      case 'Fish':
        return ['kg', 'piece', 'box'];
      case 'Honey':
        return ['L', 'kg', 'jar'];
      case 'Mushrooms':
        return ['kg', 'box', 'punnet'];
      default:
        return ['kg', 'L', 'piece', 'box'];
    }
  };

  const getCategoriesForBusiness = (business: string) => {
    switch (business) {
      case 'Fish':
        return ['Fresh Fish', 'Premium Fish', 'Seafood', 'Shellfish'];
      case 'Honey':
        return ['Raw Honey', 'Premium Honey', 'Flavored Honey', 'Comb Honey'];
      case 'Mushrooms':
        return ['Fresh Mushrooms', 'Exotic Mushrooms', 'Dried Mushrooms', 'Organic Mushrooms'];
      default:
        return ['General'];
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Add New Product</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close form"
        >
          <X size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            placeholder="Enter product name"
            {...register('name')}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="business">Business *</Label>
          <Select 
            value={selectedBusiness}
            onValueChange={(value) => setValue('business', value as any)}
          >
            <SelectTrigger 
              id="business"
              className={errors.business ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fish">Fish</SelectItem>
              <SelectItem value="Honey">Honey</SelectItem>
              <SelectItem value="Mushrooms">Mushrooms</SelectItem>
            </SelectContent>
          </Select>
          {errors.business && (
            <p className="text-sm text-red-600">{errors.business.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select onValueChange={(value) => setValue('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {selectedBusiness && getCategoriesForBusiness(selectedBusiness).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit *</Label>
          <Select onValueChange={(value) => setValue('unit', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {selectedBusiness && getUnitsForBusiness(selectedBusiness).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unit && (
            <p className="text-sm text-red-600">{errors.unit.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price (R) *</Label>
          <Input
            id="costPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('costPrice', { valueAsNumber: true })}
            className={errors.costPrice ? "border-red-500" : ""}
          />
          {errors.costPrice && (
            <p className="text-sm text-red-600">{errors.costPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price (R) *</Label>
          <Input
            id="sellingPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('sellingPrice', { valueAsNumber: true })}
            className={errors.sellingPrice ? "border-red-500" : ""}
          />
          {errors.sellingPrice && (
            <p className="text-sm text-red-600">{errors.sellingPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Quick Markup Buttons</Label>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarkupChange(25)}
            >
              +25%
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarkupChange(50)}
            >
              +50%
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarkupChange(75)}
            >
              +75%
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarkupChange(100)}
            >
              +100%
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentStock">Current Stock *</Label>
          <Input
            id="currentStock"
            type="number"
            min="0"
            placeholder="0"
            {...register('currentStock', { valueAsNumber: true })}
            className={errors.currentStock ? "border-red-500" : ""}
          />
          {errors.currentStock && (
            <p className="text-sm text-red-600">{errors.currentStock.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStockLevel">Minimum Stock Level *</Label>
          <Input
            id="minStockLevel"
            type="number"
            min="0"
            placeholder="0"
            {...register('minStockLevel', { valueAsNumber: true })}
            className={errors.minStockLevel ? "border-red-500" : ""}
          />
          {errors.minStockLevel && (
            <p className="text-sm text-red-600">{errors.minStockLevel.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier *</Label>
          <Input
            id="supplier"
            placeholder="Enter supplier name"
            {...register('supplier')}
            className={errors.supplier ? "border-red-500" : ""}
          />
          {errors.supplier && (
            <p className="text-sm text-red-600">{errors.supplier.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
          <Input
            id="expiryDate"
            type="date"
            {...register('expiryDate')}
          />
        </div>
      </div>

      {costPrice && sellingPrice && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600">
            Markup: <span className="font-medium">{calculateMarkup(costPrice, sellingPrice).toFixed(1)}%</span>
          </p>
          <p className="text-sm text-slate-600">
            Profit per unit: <span className="font-medium">R{(sellingPrice - costPrice).toFixed(2)}</span>
          </p>
        </div>
      )}

      <div className="flex space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Product
        </Button>
      </div>
    </form>
  );
};
