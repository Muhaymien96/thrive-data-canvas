
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, User, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { EmployeeForm } from './EmployeeForm';
import { CostTrackingForm } from './CostTrackingForm';
import { useEmployees } from '@/hooks/useSupabaseData';
import type { BusinessWithAll, Employee } from '@/types/database';

interface EmployeesViewProps {
  selectedBusiness: BusinessWithAll;
}

// Create a mock employee that matches the database schema
const createMockEmployee = (): Partial<Employee> => ({
  id: 'mock-id',
  name: '',
  email: '',
  phone: '',
  business_id: '',
  position: '',
  hourly_rate: 0,
  salary: 0, // Add missing salary field
  start_date: new Date().toISOString().split('T')[0],
  status: 'active',
  payment_method: 'bank_transfer',
  bank_details: null, // Add missing bank_details field
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export const EmployeesView = ({ selectedBusiness }: EmployeesViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCostTracking, setShowCostTracking] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const businessId = selectedBusiness === 'All' ? undefined : selectedBusiness.id;
  const { data: employees = [], isLoading, error } = useEmployees(businessId);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(emp => emp.status === 'active').length;
  const totalSalary = filteredEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  const totalHourlyWages = filteredEmployees.reduce((sum, emp) => sum + (emp.hourly_rate || 0), 0);

  const handleSaveEmployee = (employee: Employee) => {
    setShowAddForm(false);
    setSelectedEmployee(null);
  };

  const handleSaveCost = (transaction: any) => {
    setShowCostTracking(false);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Employees</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading employees. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Employees</h2>
          <p className="text-slate-600">Manage your team and track employee costs</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowCostTracking(true)}>
            <DollarSign size={16} className="mr-2" />
            Record Cost
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={16} className="mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Registered employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Currently employed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Salaries</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalSalary.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total monthly commitment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hourly Rates</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalHourlyWages.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Combined hourly rates
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search employees by name, email, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-slate-600">Loading employees...</span>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No employees found. Add your first employee to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </div>
                    {employee.position && (
                      <p className="text-sm text-slate-600">{employee.position}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {employee.email && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <span>Email: {employee.email}</span>
                        </div>
                      )}
                      {employee.phone && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <span>Phone: {employee.phone}</span>
                        </div>
                      )}
                      {employee.start_date && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Calendar size={14} />
                          <span>Started: {new Date(employee.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100">
                      <div className="space-y-2 mb-3">
                        {employee.salary && employee.salary > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Monthly Salary:</span>
                            <span className="font-medium">R{employee.salary.toFixed(2)}</span>
                          </div>
                        )}
                        {employee.hourly_rate && employee.hourly_rate > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Hourly Rate:</span>
                            <span className="font-medium">R{employee.hourly_rate.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Payment:</span>
                          <div className="flex items-center space-x-1">
                            <CreditCard size={14} />
                            <span className="text-sm">{employee.payment_method?.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={() => {
            setShowAddForm(false);
            setSelectedEmployee(null);
          }}
          onSave={handleSaveEmployee}
        />
      )}

      {showCostTracking && (
        <CostTrackingForm
          employees={employees}
          onClose={() => setShowCostTracking(false)}
          onSave={handleSaveCost}
        />
      )}
    </div>
  );
};
