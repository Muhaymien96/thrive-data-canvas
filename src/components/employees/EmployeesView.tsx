
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmployeeForm } from './EmployeeForm';
import { CostTrackingForm } from './CostTrackingForm';
import { useEmployees } from '@/hooks/useEmployees';
import { Plus, Users, DollarSign, Clock, TrendingUp, Calculator } from 'lucide-react';
import type { BusinessWithAll, Employee } from '@/types/database';

interface EmployeesViewProps {
  selectedBusiness: BusinessWithAll;
}

export const EmployeesView = ({ selectedBusiness }: EmployeesViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showCostTracking, setShowCostTracking] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const businessId = selectedBusiness === 'All' ? undefined : (typeof selectedBusiness === 'string' ? selectedBusiness : selectedBusiness.id);
  const { data: employees = [], isLoading, error } = useEmployees(businessId);

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const totalSalaryBudget = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  const totalHourlyBudget = employees.reduce((sum, emp) => sum + ((emp.hourly_rate || 0) * 40 * 4), 0); // Assuming 40 hours/week

  const handleCostTrackingClose = () => {
    setShowCostTracking(false);
    setSelectedEmployee(null);
  };

  const handleCostTrackingSave = () => {
    setShowCostTracking(false);
    setSelectedEmployee(null);
  };

  if (selectedBusiness === 'All') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Employee Management</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-slate-500">
              Please select a specific business to manage employees.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Employee Management</h2>
        </div>
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
        <h2 className="text-2xl font-bold text-slate-900">Employee Management</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowCostTracking(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Calculator size={16} />
            <span>Track Costs</span>
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeEmployees.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Salary Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalSalaryBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Fixed salaries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hourly Budget</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalHourlyBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Est. monthly (160h)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Hourly Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{employees.length > 0 
                ? (employees.reduce((sum, emp) => sum + (emp.hourly_rate || 0), 0) / employees.length).toFixed(0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per hour average
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users size={20} />
            <span>Employee Directory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-slate-600">Loading employees...</span>
            </div>
          ) : employees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Salary</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Hourly Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-slate-900">{employee.name}</div>
                          {employee.start_date && (
                            <div className="text-xs text-slate-500">
                              Started: {new Date(employee.start_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{employee.position || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          {employee.email && <div>{employee.email}</div>}
                          {employee.phone && <div className="text-xs text-slate-500">{employee.phone}</div>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {employee.salary ? `R${employee.salary.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {employee.hourly_rate ? `R${employee.hourly_rate}/hr` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge 
                          variant={employee.status === 'active' ? 'default' : 'secondary'}
                          className={employee.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {employee.status || 'active'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowCostTracking(true);
                            }}
                          >
                            Pay
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No employees found</h3>
              <p className="text-slate-500 mb-4">
                Add your first employee to start managing your team.
              </p>
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Add Your First Employee</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <EmployeeForm 
              onClose={() => setShowForm(false)} 
              businessId={businessId!}
              onSave={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showCostTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CostTrackingForm 
              employees={employees}
              onClose={handleCostTrackingClose}
              onSave={handleCostTrackingSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};
