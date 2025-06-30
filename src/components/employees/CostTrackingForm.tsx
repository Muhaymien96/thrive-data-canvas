
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useCreateTransaction } from '@/hooks/useCreateTransaction';
import type { Employee } from '@/types/database';

interface CostTrackingFormProps {
  employees: Employee[];
  onClose: () => void;
  onSave?: () => void;
}

export const CostTrackingForm = ({ employees, onClose, onSave }: CostTrackingFormProps) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    cost_type: 'salary' as 'salary' | 'wages' | 'benefits' | 'bonus' | 'overtime',
    amount: 0,
    hours_worked: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer' as const
  });

  const createTransactionMutation = useCreateTransaction();
  const selectedEmployee = employees.find(emp => emp.id === formData.employee_id);

  const calculateAmount = () => {
    if (!selectedEmployee) return 0;
    
    if (formData.cost_type === 'wages' && formData.hours_worked > 0) {
      return (selectedEmployee.hourly_rate || 0) * formData.hours_worked;
    }
    
    return formData.amount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) {
      console.error('No employee selected');
      return;
    }

    const finalAmount = calculateAmount();
    if (finalAmount <= 0) {
      console.error('Amount must be greater than 0');
      return;
    }

    console.log('Submitting employee cost transaction with data:', {
      selectedEmployee,
      formData,
      finalAmount
    });

    try {
      const transactionData = {
        date: formData.date,
        business_id: selectedEmployee.business_id,
        type: 'salary' as const,
        amount: finalAmount,
        description: formData.description || `${formData.cost_type} payment for ${selectedEmployee.name}`,
        customer_name: selectedEmployee.name,
        payment_method: formData.payment_method,
        payment_status: 'paid' as const,
        employee_id: selectedEmployee.id,
        employee_name: selectedEmployee.name,
        cost_type: formData.cost_type,
        hours_worked: formData.cost_type === 'wages' ? formData.hours_worked : null,
        hourly_rate: formData.cost_type === 'wages' ? selectedEmployee.hourly_rate : null
      };

      console.log('Transaction data to be created:', transactionData);

      await createTransactionMutation.mutateAsync(transactionData);
      
      if (onSave) {
        onSave();
      }
      onClose();
    } catch (error) {
      console.error('Error creating employee cost transaction:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Record Employee Cost</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, employee_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="costType">Cost Type</Label>
              <Select
                value={formData.cost_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cost_type: value as typeof formData.cost_type }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="wages">Wages</SelectItem>
                  <SelectItem value="benefits">Benefits</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                  <SelectItem value="overtime">Overtime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            {formData.cost_type === 'wages' && selectedEmployee && (
              <div>
                <Label htmlFor="hoursWorked">Hours Worked</Label>
                <Input
                  id="hoursWorked"
                  type="number"
                  value={formData.hours_worked}
                  onChange={(e) => setFormData(prev => ({ ...prev, hours_worked: Number(e.target.value) }))}
                  min="0"
                  step="0.5"
                />
                {formData.hours_worked > 0 && (
                  <p className="text-sm text-slate-600 mt-1">
                    Calculated amount: R{((selectedEmployee.hourly_rate || 0) * formData.hours_worked).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {formData.cost_type !== 'wages' && (
              <div>
                <Label htmlFor="amount">Amount (R)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional notes about this payment..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!formData.employee_id || createTransactionMutation.isPending}
              >
                {createTransactionMutation.isPending ? 'Recording...' : 'Record Cost'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
