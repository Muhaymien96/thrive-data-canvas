import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { Business } from '@/components/AdminDashboard';

const transactionSchema = z.object({
  business: z.enum(['Fish', 'Honey', 'Mushrooms'], {
    required_error: 'Please select a business',
  }),
  type: z.enum(['cash', 'yoco', 'credit'], {
    required_error: 'Please select a payment type',
  }),
  date: z.date({
    required_error: 'Please select a date',
  }).refine((date) => date <= new Date(), {
    message: 'Date cannot be in the future',
  }),
  amount: z.number().positive('Amount must be positive'),
  customer: z.string().min(2, 'Customer name must be at least 2 characters'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onClose: () => void;
  defaultBusiness?: Business;
}

export const TransactionForm = ({ onClose, defaultBusiness }: TransactionFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      business: defaultBusiness !== 'All' ? defaultBusiness as 'Fish' | 'Honey' | 'Mushrooms' : undefined,
    },
  });

  const selectedDate = watch('date');
  const selectedBusiness = watch('business');
  const selectedType = watch('type');

  const onSubmit = (data: TransactionFormData) => {
    console.log('Transaction submitted:', data);
    toast({
      title: "Transaction Added",
      description: `Successfully added ${data.type} transaction for R${data.amount}`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Add Transaction</h3>
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

      {/* Business Selector */}
      <div className="space-y-2">
        <Label htmlFor="business">Business *</Label>
        <Select 
          value={selectedBusiness}
          onValueChange={(value) => setValue('business', value as any)}
        >
          <SelectTrigger 
            id="business"
            aria-describedby={errors.business ? "business-error" : undefined}
            className={errors.business ? "border-red-500" : ""}
          >
            <SelectValue placeholder={defaultBusiness === 'All' ? "Select business" : undefined} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fish">Fish</SelectItem>
            <SelectItem value="Honey">Honey</SelectItem>
            <SelectItem value="Mushrooms">Mushrooms</SelectItem>
          </SelectContent>
        </Select>
        {errors.business && (
          <p id="business-error" className="text-sm text-red-600" role="alert">
            {errors.business.message}
          </p>
        )}
      </div>

      {/* Payment Type Radio Group */}
      <div className="space-y-3">
        <Label htmlFor="payment-type">Payment Type *</Label>
        <RadioGroup
          value={selectedType}
          onValueChange={(value) => setValue('type', value as any)}
          className="flex flex-col space-y-2"
          aria-describedby={errors.type ? "type-error" : undefined}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yoco" id="yoco" />
            <Label htmlFor="yoco" className="cursor-pointer">Yoco (Card)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit" className="cursor-pointer">Credit</Label>
          </div>
        </RadioGroup>
        {errors.type && (
          <p id="type-error" className="text-sm text-red-600" role="alert">
            {errors.type.message}
          </p>
        )}
      </div>

      {/* Date Picker */}
      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                errors.date && "border-red-500"
              )}
              aria-describedby={errors.date ? "date-error" : undefined}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setValue('date', date!)}
              disabled={(date) => date > new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p id="date-error" className="text-sm text-red-600" role="alert">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (R) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
          aria-describedby={errors.amount ? "amount-error" : undefined}
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && (
          <p id="amount-error" className="text-sm text-red-600" role="alert">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Customer Input */}
      <div className="space-y-2">
        <Label htmlFor="customer">Customer Name *</Label>
        <Input
          id="customer"
          placeholder="Enter customer name"
          {...register('customer')}
          aria-describedby={errors.customer ? "customer-error" : undefined}
          className={errors.customer ? "border-red-500" : ""}
        />
        {errors.customer && (
          <p id="customer-error" className="text-sm text-red-600" role="alert">
            {errors.customer.message}
          </p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Transaction
        </Button>
      </div>
    </form>
  );
};
