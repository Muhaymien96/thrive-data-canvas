
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const customerSchema = z.object({
  name: z.string().min(2, 'Customer name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  tags: z.string().optional(),
  creditLimit: z.number().min(0, 'Credit limit must be positive').optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onClose: () => void;
}

export const CustomerForm = ({ onClose }: CustomerFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      creditLimit: 0,
    },
  });

  const onSubmit = (data: CustomerFormData) => {
    console.log('Customer submitted:', data);
    toast({
      title: "Customer Added",
      description: `Successfully added customer ${data.name}`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Add Customer</h3>
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
        <Label htmlFor="name">Customer Name *</Label>
        <Input
          id="name"
          placeholder="Enter customer name"
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
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="customer@example.com"
          {...register('email')}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="creditLimit">Credit Limit (R)</Label>
        <Input
          id="creditLimit"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('creditLimit', { valueAsNumber: true })}
          aria-describedby={errors.creditLimit ? "creditLimit-error" : undefined}
          className={errors.creditLimit ? "border-red-500" : ""}
        />
        {errors.creditLimit && (
          <p id="creditLimit-error" className="text-sm text-red-600" role="alert">
            {errors.creditLimit.message}
          </p>
        )}
        <p className="text-xs text-slate-500">
          Maximum amount this customer can owe you at one time
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (optional)</Label>
        <Input
          id="tags"
          placeholder="e.g. Frequent Buyer, Wholesale (comma separated)"
          {...register('tags')}
        />
        <p className="text-xs text-slate-500">
          Separate multiple tags with commas
        </p>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Customer
        </Button>
      </div>
    </form>
  );
};
