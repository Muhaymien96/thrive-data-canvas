
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Star, Mail, Phone, MapPin } from 'lucide-react';
import { SupplierForm } from './SupplierForm';
import { useSuppliers } from '@/hooks/useSupabaseData';
import type { BusinessWithAll, Supplier } from '@/types/database';

interface SuppliersViewProps {
  selectedBusiness: BusinessWithAll;
}

export const SuppliersView = ({ selectedBusiness }: SuppliersViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const businessId = selectedBusiness === 'All' ? undefined : selectedBusiness.id;
  const { data: suppliers = [], isLoading, error } = useSuppliers(businessId);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSuppliers = filteredSuppliers.length;
  const totalSpent = filteredSuppliers.reduce((sum, supplier) => sum + (supplier.total_spent || 0), 0);
  const averageRating = filteredSuppliers.length > 0 
    ? filteredSuppliers.reduce((sum, supplier) => sum + (supplier.rating || 0), 0) / filteredSuppliers.length 
    : 0;

  const handleSaveSupplier = (supplier: Supplier) => {
    // Handle save logic here
    setShowAddForm(false);
    setSelectedSupplier(null);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Suppliers</h2>
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
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Suppliers</h2>
          <p className="text-slate-600">Manage your supplier relationships and track spending</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={16} className="mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Active supplier relationships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across all suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
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
                placeholder="Search suppliers by name, email, or category..."
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
              <span className="ml-3 text-slate-600">Loading suppliers...</span>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No suppliers found. Add your first supplier to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600">{supplier.rating || 0}</span>
                      </div>
                    </div>
                    {supplier.category && (
                      <Badge variant="secondary" className="w-fit">
                        {supplier.category}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {supplier.email && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Mail size={14} />
                          <span>{supplier.email}</span>
                        </div>
                      )}
                      {supplier.phone && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Phone size={14} />
                          <span>{supplier.phone}</span>
                        </div>
                      )}
                      {supplier.address && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <MapPin size={14} />
                          <span className="truncate">{supplier.address}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-slate-900">
                          Total Spent: R{(supplier.total_spent || 0).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                          {supplier.last_order ? `Last order: ${new Date(supplier.last_order).toLocaleDateString()}` : 'No orders yet'}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedSupplier(supplier);
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddForm && (
        <SupplierForm
          supplier={selectedSupplier}
          onClose={() => {
            setShowAddForm(false);
            setSelectedSupplier(null);
          }}
          onSave={handleSaveSupplier}
        />
      )}
    </div>
  );
};
