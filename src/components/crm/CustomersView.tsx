
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CustomerForm } from './CustomerForm';
import { mockCustomers } from '@/lib/mockData';
import { Search, ArrowUp } from 'lucide-react';

export const CustomersView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <ArrowUp size={16} />
          <span>Add Customer</span>
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CustomerForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search customers by name, email, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Total Purchases</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Money Owed</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Credit Limit</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Last Purchase</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Tags</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm font-medium">{customer.name}</td>
                    <td className="py-3 px-4 text-sm">{customer.email}</td>
                    <td className="py-3 px-4 text-sm font-medium">R{customer.totalPurchases.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">
                      {customer.outstandingBalance > 0 ? (
                        <Badge variant="destructive">
                          R{customer.outstandingBalance.toLocaleString()}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">R0</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">R{customer.creditLimit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">{customer.lastPurchase}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
