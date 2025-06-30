
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SupplierForm } from './SupplierForm';
import { useSuppliers } from '@/hooks/useSupabaseData';
import { Search, Plus, Users, Star, Phone, Mail } from 'lucide-react';
import type { BusinessWithAll } from '@/types/database';

interface SuppliersViewProps {
  selectedBusiness: BusinessWithAll;
}

export const SuppliersView = ({ selectedBusiness }: SuppliersViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const businessId = selectedBusiness === 'All' ? undefined : selectedBusiness.id;
  const { data: suppliers = [], isLoading, error } = useSuppliers(businessId);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.category && supplier.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Suppliers</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading suppliers. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Suppliers</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Supplier</span>
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <SupplierForm onClose={() => setShowForm(false)} selectedBusiness={selectedBusiness} />
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search suppliers by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users size={20} />
            <span>Supplier Directory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-slate-600">Loading suppliers...</span>
            </div>
          ) : filteredSuppliers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
                      {supplier.rating && (
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm text-slate-600">{supplier.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    {supplier.category && (
                      <Badge variant="secondary" className="mb-2">
                        {supplier.category}
                      </Badge>
                    )}
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      {supplier.email && (
                        <div className="flex items-center space-x-2">
                          <Mail size={14} />
                          <span>{supplier.email}</span>
                        </div>
                      )}
                      {supplier.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone size={14} />
                          <span>{supplier.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Spent:</span>
                        <span className="font-medium">R{(supplier.total_spent || 0).toLocaleString()}</span>
                      </div>
                      {supplier.last_order && (
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-slate-500">Last Order:</span>
                          <span>{supplier.last_order}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No suppliers found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm 
                  ? `No suppliers match "${searchTerm}"`
                  : 'Start by adding your first supplier to manage your supply chain.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Add Your First Supplier</span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
