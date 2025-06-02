
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CustomerForm } from './CustomerForm';
import { CustomerDetails } from './CustomerDetails';
import { PaymentNotifications } from '@/components/notifications/PaymentNotifications';
import { mockCustomers, Customer, mockTransactions } from '@/lib/mockData';
import { Search, ArrowUp, Eye } from 'lucide-react';
import type { Business } from '@/components/AdminDashboard';

interface CustomersViewProps {
  selectedBusiness: Business;
}

export const CustomersView = ({ selectedBusiness }: CustomersViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Filter customers by business based on their transaction history
  const getFilteredCustomers = () => {
    let filtered = mockCustomers;
    
    if (selectedBusiness !== 'All') {
      // Get customer names that have transactions for the selected business
      const businessCustomers = mockTransactions
        .filter(transaction => transaction.business === selectedBusiness)
        .map(transaction => transaction.customer);
      
      filtered = filtered.filter(customer => 
        businessCustomers.includes(customer.name)
      );
    }

    return filtered.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredCustomers = getFilteredCustomers();

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
          {selectedBusiness !== 'All' && (
            <p className="text-sm text-slate-600 mt-1">
              Showing customers for {selectedBusiness} business
            </p>
          )}
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <ArrowUp size={16} />
          <span>Add Customer</span>
        </Button>
      </div>

      <PaymentNotifications context="customers" />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CustomerForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <CustomerDetails 
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

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
          {filteredCustomers.length > 0 ? (
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(customer)}
                          className="flex items-center gap-2"
                        >
                          <Eye size={14} />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">
                {selectedBusiness === 'All' 
                  ? 'No customers found.' 
                  : `No customers found for ${selectedBusiness} business.`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
