
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import type { Employee, Transaction } from '@/types/transaction';

interface CostTrackingFormProps {
  employees: Employee[];
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

export const CostTrackingForm = ({ employees, onClose, onSave }: CostTrackingFormProps) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    costType: 'salary' as 'salary' | 'wages' | 'benefits' | 'bonus' | 'overtime',
    amount: 0,
    hoursWorked: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer' as const
  });

  const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

  const calculateAmount = () => {
    if (!selectedEmployee) return 0;
    
    if (formData.costType === 'wages' && formData.hoursWorked > 0) {
      return selectedEmployee.hourlyRate * formData.hoursWorked;
    }
    
    return formData.amount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: formData.date,
      business: selectedEmployee.business,
      type: 'employee_cost',
      amount: calculateAmount(),
      description: formData.description || `${formData.costType} payment for ${selectedEmployee.name}`,
      customer: selectedEmployee.name,
      paymentMethod: formData.paymentMethod,
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      costType: formData.costType,
      hoursWorked: formData.hoursWorked,
      hourlyRate: selectedEmployee.hourlyRate
    };

    onSave(transaction);
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
                value={formData.employeeId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, employeeId: value }))}
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
                value={formData.costType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, costType: value as typeof formData.costType }))}
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

            {formData.costType === 'wages' && selectedEmployee && (
              <div>
                <Label htmlFor="hoursWorked">Hours Worked</Label>
                <Input
                  id="hoursWorked"
                  type="number"
                  value={formData.hoursWorked}
                  onChange={(e) => setFormData(prev => ({ ...prev, hoursWorked: Number(e.target.value) }))}
                  min="0"
                  step="0.5"
                />
                {formData.hoursWorked > 0 && (
                  <p className="text-sm text-slate-600 mt-1">
                    Calculated amount: R{(selectedEmployee.hourlyRate * formData.hoursWorked).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {formData.costType !== 'wages' && (
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
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as any }))}
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
              <Button type="submit" disabled={!formData.employeeId}>
                Record Cost
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
