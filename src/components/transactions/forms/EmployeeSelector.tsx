
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { Employee } from '@/types/database';

interface EmployeeSelectorProps {
  employees: Employee[];
  selectedEmployeeId: string | null;
  hourlyRate: number | null;
  hoursWorked: number | null;
  onEmployeeSelect: (employeeId: string) => void;
  onHourlyRateChange: (rate: number) => void;
  onHoursWorkedChange: (hours: number) => void;
}

export const EmployeeSelector = ({ 
  employees, 
  selectedEmployeeId, 
  hourlyRate, 
  hoursWorked, 
  onEmployeeSelect, 
  onHourlyRateChange, 
  onHoursWorkedChange 
}: EmployeeSelectorProps) => {
  return (
    <>
      <div>
        <Label>Employee</Label>
        <Select value={selectedEmployeeId || 'none'} onValueChange={onEmployeeSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No employee selected</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name} {employee.position && `(${employee.position})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hourly_rate">Hourly Rate (R)</Label>
          <Input
            id="hourly_rate"
            type="number"
            value={hourlyRate || ''}
            onChange={(e) => onHourlyRateChange(Number(e.target.value))}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="hours_worked">Hours Worked</Label>
          <Input
            id="hours_worked"
            type="number"
            value={hoursWorked || ''}
            onChange={(e) => onHoursWorkedChange(Number(e.target.value))}
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </>
  );
};
