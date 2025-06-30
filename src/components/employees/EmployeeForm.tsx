
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployees';
import { toast } from '@/hooks/use-toast';
import type { Employee, EmployeeInsert } from '@/types/database';

interface BankDetails {
  accountNumber: string;
  bankName: string;
  branchCode: string;
}

interface EmployeeFormProps {
  employee?: Employee | null;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

// Helper function to safely convert database Json to BankDetails
const convertToBankDetails = (bankDetails: any): BankDetails => {
  if (!bankDetails || typeof bankDetails !== 'object') {
    return {
      accountNumber: '',
      bankName: '',
      branchCode: ''
    };
  }
  
  return {
    accountNumber: bankDetails.accountNumber || '',
    bankName: bankDetails.bankName || '',
    branchCode: bankDetails.branchCode || ''
  };
};

export const EmployeeForm = ({ employee, onClose, onSave }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: employee?.name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    business_id: employee?.business_id || '',
    position: employee?.position || '',
    hourly_rate: employee?.hourly_rate || 0,
    salary: employee?.salary || 0,
    start_date: employee?.start_date || new Date().toISOString().split('T')[0],
    status: employee?.status || 'active',
    payment_method: employee?.payment_method || 'bank_transfer',
    bank_details: convertToBankDetails(employee?.bank_details)
  });

  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();

  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Employee name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.business_id?.trim()) {
      toast({
        title: "Validation Error",
        description: "Business ID is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.position?.trim()) {
      toast({
        title: "Validation Error",
        description: "Position is required",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const employeeData = {
        name: formData.name!.trim(),
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        business_id: formData.business_id!.trim(),
        position: formData.position?.trim() || null,
        hourly_rate: formData.hourly_rate || null,
        salary: formData.salary || null,
        start_date: formData.start_date || null,
        status: formData.status || 'active',
        payment_method: formData.payment_method || 'bank_transfer',
        bank_details: formData.bank_details || null
      };

      if (employee) {
        const updatedEmployee = await updateEmployeeMutation.mutateAsync({
          id: employee.id,
          ...employeeData
        });
        onSave(updatedEmployee);
      } else {
        const newEmployee = await createEmployeeMutation.mutateAsync(employeeData as EmployeeInsert);
        onSave(newEmployee);
      }
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Error",
        description: "Failed to save employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = createEmployeeMutation.isPending || updateEmployeeMutation.isPending;

  const updateBankDetails = (field: keyof BankDetails, value: string) => {
    const currentBankDetails = convertToBankDetails(formData.bank_details);
    setFormData(prev => ({
      ...prev,
      bank_details: {
        ...currentBankDetails,
        [field]: value
      }
    }));
  };

  const currentBankDetails = convertToBankDetails(formData.bank_details);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (R)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourly_rate || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: Number(e.target.value) }))}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="salary">Monthly Salary (R)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.payment_method === 'bank_transfer' && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium text-slate-900">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={currentBankDetails.accountNumber}
                      onChange={(e) => updateBankDetails('accountNumber', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={currentBankDetails.bankName}
                      onChange={(e) => updateBankDetails('bankName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="branchCode">Branch Code</Label>
                    <Input
                      id="branchCode"
                      value={currentBankDetails.branchCode}
                      onChange={(e) => updateBankDetails('branchCode', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (employee ? 'Update Employee' : 'Add Employee')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
