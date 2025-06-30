
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CustomerForm } from './CustomerForm';
import { CustomerDetails } from './CustomerDetails';
import { PaymentNotifications } from '@/components/notifications/PaymentNotifications';
import { useCustomers } from '@/hooks/useCustomers';
import { Search, Plus, Eye, Users } from 'lucide-react';
import type { Customer, BusinessWithAll } from '@/types/database';

interface CustomersViewProps {
  selectedBusiness: BusinessWithAll;
}

export const CustomersView = ({ selectedBusiness }: CustomersViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const businessId = selectedBusiness === 'All' ? undefined : (typeof selectedBusiness === 'string' ? selectedBusiness : selectedBusiness.id);
  const { data: customers = [], isLoading, error } = useCustomers(businessId);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.tags && customer.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading customers. Please try again later.
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
          <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
          {selectedBusiness !== 'All' && (
            <p className="text-sm text-slate-600 mt-1">
              Showing customers for selected business
            </p>
          )}
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Customer</span>
        </Button>
      </div>

      <PaymentNotifications />

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
          <CardTitle className="flex items-center space-x-2">
            <Users size={20} />
            <span>Customer Directory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-slate-600">Loading customers...</span>
            </div>
          ) : filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Total Purchases</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Outstanding Balance</th>
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
                      <td className="py-3 px-4 text-sm">{customer.email || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        R{(customer.total_purchases || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {(customer.outstanding_balance || 0) > 0 ? (
                          <Badge variant="destructive">
                            R{(customer.outstanding_balance || 0).toLocaleString()}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">R0</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        R{(customer.credit_limit || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {customer.last_purchase || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {customer.tags && customer.tags.length > 0 ? (
                            customer.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs">No tags</span>
                          )}
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
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No customers found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm 
                  ? `No customers match "${searchTerm}"`
                  : selectedBusiness === 'All' 
                    ? 'Start by adding your first customer to track sales and relationships.'
                    : 'No customers found for the selected business.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Add Your First Customer</span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
