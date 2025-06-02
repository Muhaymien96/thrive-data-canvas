
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const supplierSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  productType: z.string().min(2, 'Product type must be at least 2 characters'),
  contactEmail: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  lastOrderDate: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  supplier?: any;
  onClose: () => void;
}

export const SupplierForm = ({ supplier, onClose }: SupplierFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: supplier || {},
  });

  const onSubmit = (data: SupplierFormData) => {
    console.log('Supplier submitted:', data);
    toast({
      title: supplier ? "Supplier Updated" : "Supplier Added",
      description: `Successfully ${supplier ? 'updated' : 'added'} ${data.name}`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {supplier ? 'Edit Supplier' : 'Add Supplier'}
        </h3>
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

      <div className="space-y-2">
        <Label htmlFor="name">Supplier Name *</Label>
        <Input
          id="name"
          placeholder="Enter supplier name"
          {...register('name')}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="productType">Product Type *</Label>
        <Input
          id="productType"
          placeholder="e.g., Fresh Fish, Raw Honey"
          {...register('productType')}
          aria-describedby={errors.productType ? "productType-error" : undefined}
          className={errors.productType ? "border-red-500" : ""}
        />
        {errors.productType && (
          <p id="productType-error" className="text-sm text-red-600" role="alert">
            {errors.productType.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail">Email *</Label>
        <Input
          id="contactEmail"
          type="email"
          placeholder="supplier@example.com"
          {...register('contactEmail')}
          aria-describedby={errors.contactEmail ? "contactEmail-error" : undefined}
          className={errors.contactEmail ? "border-red-500" : ""}
        />
        {errors.contactEmail && (
          <p id="contactEmail-error" className="text-sm text-red-600" role="alert">
            {errors.contactEmail.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          placeholder="+1-555-0123"
          {...register('phone')}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-red-600" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastOrderDate">Last Order Date</Label>
        <Input
          id="lastOrderDate"
          type="date"
          {...register('lastOrderDate')}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          {supplier ? 'Update' : 'Add'} Supplier
        </Button>
      </div>
    </form>
  );
};
