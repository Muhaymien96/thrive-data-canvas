
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinesses } from '@/hooks/useSupabaseData';

const customerSchema = z.object({
  name: z.string().min(2, 'Customer name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  business_id: z.string().min(1, 'Please select a business'),
  credit_limit: z.number().min(0, 'Credit limit must be positive').optional(),
  payment_terms: z.number().min(0, 'Payment terms must be positive').optional(),
  tags: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerForm = ({ onClose, onSuccess }: CustomerFormProps) => {
  const { user } = useAuth();
  const { data: businesses, isLoading: businessesLoading } = useBusinesses();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      credit_limit: 0,
      payment_terms: 30,
    },
  });

  const selectedBusinessId = watch('business_id');

  const onSubmit = async (data: CustomerFormData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add customers.",
        variant: "destructive",
      });
      return;
    }

    try {
      const customerData = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        business_id: data.business_id,
        credit_limit: data.credit_limit || 0,
        payment_terms: data.payment_terms || 30,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        total_spent: 0,
        total_purchases: 0,
        outstanding_balance: 0,
        invoice_preference: 'email' as const,
      };

      const { error } = await supabase
        .from('customers')
        .insert([customerData]);

      if (error) {
        console.error('Error adding customer:', error);
        toast({
          title: "Error",
          description: "Failed to add customer. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Customer Added",
        description: `Successfully added customer ${data.name}`,
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
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
        <Label htmlFor="business_id">Business *</Label>
        <Select onValueChange={(value) => setValue('business_id', value)} disabled={businessesLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select a business" />
          </SelectTrigger>
          <SelectContent>
            {businesses?.map((business) => (
              <SelectItem key={business.id} value={business.id}>
                {business.name} ({business.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.business_id && (
          <p className="text-sm text-red-600" role="alert">
            {errors.business_id.message}
          </p>
        )}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
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
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+27 123 456 789"
            {...register('phone')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Customer address"
          {...register('address')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="credit_limit">Credit Limit (R)</Label>
          <Input
            id="credit_limit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('credit_limit', { valueAsNumber: true })}
            aria-describedby={errors.credit_limit ? "creditLimit-error" : undefined}
            className={errors.credit_limit ? "border-red-500" : ""}
          />
          {errors.credit_limit && (
            <p id="creditLimit-error" className="text-sm text-red-600" role="alert">
              {errors.credit_limit.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_terms">Payment Terms (days)</Label>
          <Input
            id="payment_terms"
            type="number"
            min="0"
            placeholder="30"
            {...register('payment_terms', { valueAsNumber: true })}
          />
        </div>
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
        <Button type="submit" className="flex-1" disabled={isSubmitting || !selectedBusinessId}>
          {isSubmitting ? 'Adding...' : 'Add Customer'}
        </Button>
      </div>
    </form>
  );
};
