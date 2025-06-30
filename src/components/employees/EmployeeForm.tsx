
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import type { Employee } from '@/types/transaction';

interface EmployeeFormProps {
  employee?: Employee | null;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

export const EmployeeForm = ({ employee, onClose, onSave }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: employee?.name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    business: employee?.business || 'Fish',
    position: employee?.position || '',
    hourlyRate: employee?.hourlyRate || 0,
    salary: employee?.salary || 0,
    startDate: employee?.startDate || new Date().toISOString().split('T')[0],
    status: employee?.status || 'active',
    paymentMethod: employee?.paymentMethod || 'bank_transfer',
    bankDetails: employee?.bankDetails || {
      accountNumber: '',
      bankName: '',
      branchCode: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Employee);
  };

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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business">Business</Label>
                <Select
                  value={formData.business}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, business: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fish">Fish</SelectItem>
                    <SelectItem value="Honey">Honey</SelectItem>
                    <SelectItem value="Mushrooms">Mushrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (R)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="salary">Monthly Salary (R)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}
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
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.paymentMethod === 'bank_transfer' && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium text-slate-900">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.bankDetails?.accountNumber || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails!, accountNumber: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankDetails?.bankName || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails!, bankName: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="branchCode">Branch Code</Label>
                    <Input
                      id="branchCode"
                      value={formData.bankDetails?.branchCode || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails!, branchCode: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {employee ? 'Update Employee' : 'Add Employee'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
