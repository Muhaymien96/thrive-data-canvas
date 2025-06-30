
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransactionTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TransactionTypeSelector = ({ value, onValueChange }: TransactionTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="type">Transaction Type</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sale">Sale</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="salary">Employee Salary</SelectItem>
          <SelectItem value="refund">Refund</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
