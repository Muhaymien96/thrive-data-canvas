
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
import { format, addDays } from 'date-fns';
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
  paymentStatus: z.enum(['paid', 'partial', 'pending']),
  amountPaid: z.number().optional(),
  dueDate: z.date().optional(),
  creditTerms: z.number().min(1).max(90).optional(),
}).refine((data) => {
  if (data.paymentStatus === 'partial' && (!data.amountPaid || data.amountPaid >= data.amount)) {
    return false;
  }
  if (data.type === 'credit' && data.paymentStatus !== 'paid' && !data.dueDate) {
    return false;
  }
  return true;
}, {
  message: 'Please provide valid payment details',
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
      paymentStatus: 'paid',
    },
  });

  const selectedDate = watch('date');
  const selectedBusiness = watch('business');
  const selectedType = watch('type');
  const paymentStatus = watch('paymentStatus');
  const creditTerms = watch('creditTerms');
  const amount = watch('amount');

  React.useEffect(() => {
    if (selectedType === 'credit' && creditTerms && selectedDate) {
      setValue('dueDate', addDays(selectedDate, creditTerms));
    }
  }, [selectedType, creditTerms, selectedDate, setValue]);

  const onSubmit = (data: TransactionFormData) => {
    console.log('Transaction submitted:', data);
    
    const statusText = data.paymentStatus === 'paid' ? 'paid' : 
                     data.paymentStatus === 'partial' ? 'partially paid' : 'pending payment';
    
    toast({
      title: "Sale Recorded",
      description: `Successfully added ${statusText} sale for R${data.amount}`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Record Sale</h3>
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
        <Label htmlFor="business">Business *</Label>
        <Select 
          value={selectedBusiness}
          onValueChange={(value) => setValue('business', value as any)}
        >
          <SelectTrigger 
            id="business"
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
          <p className="text-sm text-red-600">{errors.business.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label>Payment Method *</Label>
        <RadioGroup
          value={selectedType}
          onValueChange={(value) => setValue('type', value as any)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="cursor-pointer">Cash Payment</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yoco" id="yoco" />
            <Label htmlFor="yoco" className="cursor-pointer">Card Payment (Yoco)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit" className="cursor-pointer">Credit Sale (Pay Later)</Label>
          </div>
        </RadioGroup>
        {errors.type && (
          <p className="text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Sale Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                errors.date && "border-red-500"
              )}
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
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Total Amount (R) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer">Customer Name *</Label>
        <Input
          id="customer"
          placeholder="Enter customer name"
          {...register('customer')}
          className={errors.customer ? "border-red-500" : ""}
        />
        {errors.customer && (
          <p className="text-sm text-red-600">{errors.customer.message}</p>
        )}
      </div>

      {selectedType === 'credit' && (
        <>
          <div className="space-y-2">
            <Label>Payment Status *</Label>
            <RadioGroup
              value={paymentStatus}
              onValueChange={(value) => setValue('paymentStatus', value as any)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending" className="cursor-pointer">Not Paid Yet</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial" className="cursor-pointer">Partially Paid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid" className="cursor-pointer">Fully Paid</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentStatus === 'partial' && (
            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Received (R)</Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                min="0"
                max={amount}
                placeholder="0.00"
                {...register('amountPaid', { valueAsNumber: true })}
              />
            </div>
          )}

          {paymentStatus !== 'paid' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="creditTerms">Payment Terms (Days)</Label>
                <Select 
                  value={creditTerms?.toString()}
                  onValueChange={(value) => setValue('creditTerms', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="21">21 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </>
      )}

      <div className="flex space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Record Sale
        </Button>
      </div>
    </form>
  );
};
