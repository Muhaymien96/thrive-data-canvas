
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, DollarSign } from 'lucide-react';
import { EmployeeForm } from './EmployeeForm';
import { CostTrackingForm } from './CostTrackingForm';
import type { Employee, BusinessWithAll } from '@/types/database';

interface EmployeesViewProps {
  selectedBusiness: BusinessWithAll;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@business.com',
    phone: '+27 11 123 4567',
    business_id: 'fish-business-id',
    position: 'Sales Manager',
    hourly_rate: 150,
    salary: 25000,
    start_date: '2024-01-15',
    status: 'active',
    payment_method: 'bank_transfer',
    bank_details: {
      accountNumber: '1234567890',
      bankName: 'FNB',
      branchCode: '250655'
    },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@business.com',
    phone: '+27 11 234 5678',
    business_id: 'honey-business-id',
    position: 'Production Assistant',
    hourly_rate: 85,
    start_date: '2024-02-01',
    status: 'active',
    payment_method: 'cash',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  }
];

export const EmployeesView = ({ selectedBusiness }: EmployeesViewProps) => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCostForm, setShowCostForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBusiness = selectedBusiness === 'All' || emp.business_id === (selectedBusiness as any)?.id;
    return matchesSearch && matchesBusiness;
  });

  const totalMonthlyCosts = filteredEmployees.reduce((sum, emp) => {
    return sum + ((emp.salary || 0) + ((emp.hourly_rate || 0) * 160)); // Assume 160 hours/month
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Employee Management</h2>
          <p className="text-slate-600">Manage staff and track employment costs</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCostForm(true)} variant="outline">
            <DollarSign size={16} className="mr-2" />
            Record Cost
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={16} className="mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{filteredEmployees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {filteredEmployees.filter(emp => emp.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Monthly Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">R{totalMonthlyCosts.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Name</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Position</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Rate/Salary</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Status</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-slate-100">
                    <td className="py-2 px-4">
                      <div>
                        <div className="font-medium text-slate-900">{employee.name}</div>
                        <div className="text-sm text-slate-600">{employee.email}</div>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-sm">{employee.position}</td>
                    <td className="py-2 px-4 text-sm">
                      {employee.salary ? `R${employee.salary.toLocaleString()}/month` : `R${employee.hourly_rate}/hour`}
                    </td>
                    <td className="py-2 px-4">
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowAddForm(true);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={() => {
            setShowAddForm(false);
            setSelectedEmployee(null);
          }}
          onSave={(employee) => {
            if (selectedEmployee) {
              setEmployees(prev => prev.map(emp => emp.id === employee.id ? employee : emp));
            } else {
              setEmployees(prev => [...prev, { ...employee, id: Date.now().toString() }]);
            }
            setShowAddForm(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {showCostForm && (
        <CostTrackingForm
          employees={filteredEmployees}
          onClose={() => setShowCostForm(false)}
          onSave={() => setShowCostForm(false)}
        />
      )}
    </div>
  );
};
