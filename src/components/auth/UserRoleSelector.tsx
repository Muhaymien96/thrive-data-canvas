import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Users } from 'lucide-react';

interface UserRoleSelectorProps {
  onRoleSelect: (role: 'owner' | 'employee') => void;
}

export const UserRoleSelector = ({ onRoleSelect }: UserRoleSelectorProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to VentureHub</h1>
          <p className="text-slate-600">Are you a business owner or an employee?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-400"
            onClick={() => onRoleSelect('owner')}
          >
            <CardContent className="flex flex-col items-center justify-center h-48 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg mb-2">Business Owner</CardTitle>
              <p className="text-sm text-slate-600 text-center">
                Create and manage your own business
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-400"
            onClick={() => onRoleSelect('employee')}
          >
            <CardContent className="flex flex-col items-center justify-center h-48 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg mb-2">Employee</CardTitle>
              <p className="text-sm text-slate-600 text-center">
                Join an existing business with an invite code
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 