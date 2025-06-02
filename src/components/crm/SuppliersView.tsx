
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SupplierForm } from './SupplierForm';
import { PaymentNotifications } from '@/components/notifications/PaymentNotifications';
import { mockSuppliers, mockTransactions } from '@/lib/mockData';
import { Plus, Search, Eye } from 'lucide-react';
import type { Business } from '@/components/AdminDashboard';

interface SuppliersViewProps {
  selectedBusiness: Business;
}

export const SuppliersView = ({ selectedBusiness }: SuppliersViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Filter suppliers by business
  const getFilteredSuppliers = () => {
    let filtered = mockSuppliers;
    
    if (selectedBusiness !== 'All') {
      // Map business to product type for filtering
      const businessToProductType = {
        'Fish': 'Fresh Fish',
        'Honey': 'Raw Honey', 
        'Mushrooms': 'Organic Mushrooms'
      };
      filtered = filtered.filter(supplier => 
        supplier.productType === businessToProductType[selectedBusiness]
      );
    }

    return filtered.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.productType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredSuppliers = getFilteredSuppliers();

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  const handleViewDetails = (supplier: any) => {
    setSelectedSupplier(supplier);
  };

  const getSupplierTransactions = (supplierName: string) => {
    return mockTransactions.filter(transaction => 
      transaction.customer === supplierName || 
      transaction.customer.toLowerCase().includes(supplierName.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Suppliers</h2>
          {selectedBusiness !== 'All' && (
            <p className="text-sm text-slate-600 mt-1">
              Showing suppliers for {selectedBusiness} business
            </p>
          )}
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Supplier</span>
        </Button>
      </div>

      <PaymentNotifications context="suppliers" />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Supplier Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <SupplierForm 
              supplier={editingSupplier} 
              onClose={handleCloseForm} 
            />
          </div>
        </div>
      )}

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">{selectedSupplier.name}</h3>
              <Button variant="outline" onClick={() => setSelectedSupplier(null)}>
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="text-slate-900">{selectedSupplier.contactEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phone</label>
                    <p className="text-slate-900">{selectedSupplier.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Product Type</label>
                    <p className="text-slate-900">{selectedSupplier.productType}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Outstanding Balance</label>
                    <p className="text-slate-900 font-medium">
                      {selectedSupplier.outstandingBalance > 0 ? (
                        <Badge variant="destructive">
                          R{selectedSupplier.outstandingBalance.toLocaleString()}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">R0</Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Credit Terms</label>
                    <p className="text-slate-900">{selectedSupplier.creditTerms} days</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Last Order Date</label>
                    <p className="text-slate-900">{selectedSupplier.lastOrderDate}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {getSupplierTransactions(selectedSupplier.name).length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-2 px-4 font-medium text-slate-600">Date</th>
                          <th className="text-left py-2 px-4 font-medium text-slate-600">Business</th>
                          <th className="text-left py-2 px-4 font-medium text-slate-600">Type</th>
                          <th className="text-left py-2 px-4 font-medium text-slate-600">Amount</th>
                          <th className="text-left py-2 px-4 font-medium text-slate-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSupplierTransactions(selectedSupplier.name).map((transaction) => (
                          <tr key={transaction.id} className="border-b border-slate-100">
                            <td className="py-2 px-4 text-sm">{transaction.date}</td>
                            <td className="py-2 px-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.business === 'Fish' ? 'bg-blue-100 text-blue-800' :
                                transaction.business === 'Honey' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {transaction.business}
                              </span>
                            </td>
                            <td className="py-2 px-4 text-sm capitalize">{transaction.type}</td>
                            <td className="py-2 px-4 text-sm font-medium">R{transaction.amount.toLocaleString()}</td>
                            <td className="py-2 px-4 text-sm">
                              <Badge variant={transaction.paymentStatus === 'paid' ? 'secondary' : 'destructive'}>
                                {transaction.paymentStatus}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-slate-500 text-center py-8">No transactions found for this supplier.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSuppliers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Product Type</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Last Order Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Outstanding</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium">{supplier.name}</td>
                      <td className="py-3 px-4 text-sm">{supplier.productType}</td>
                      <td className="py-3 px-4 text-sm">{supplier.lastOrderDate}</td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <div>{supplier.contactEmail}</div>
                          <div className="text-slate-500">{supplier.phone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {supplier.outstandingBalance > 0 ? (
                          <Badge variant="destructive">
                            R{supplier.outstandingBalance.toLocaleString()}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">R0</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(supplier)}
                            className="flex items-center gap-2"
                          >
                            <Eye size={14} />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(supplier)}
                          >
                            Edit
                          </Button>
                        </div>
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
                  ? 'No suppliers found.' 
                  : `No suppliers found for ${selectedBusiness} business.`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
