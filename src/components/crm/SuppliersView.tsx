
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SupplierForm } from './SupplierForm';
import { PaymentNotifications } from '@/components/notifications/PaymentNotifications';
import { getSuppliersByBusiness } from '@/lib/mockData';
import { Plus, Search, Mail, Phone, MapPin, TrendingUp } from 'lucide-react';
import type { BusinessWithAll } from '@/types/transaction';

interface SuppliersViewProps {
  selectedBusiness: BusinessWithAll;
}

export const SuppliersView = ({ selectedBusiness }: SuppliersViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const suppliers = getSuppliersByBusiness(selectedBusiness);
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Supplier Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Supplier</span>
        </Button>
      </div>

      {/* Payment Notifications */}
      <PaymentNotifications />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(suppliers.map(s => s.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Supplier categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{suppliers.reduce((sum, s) => sum + s.totalSpent, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {suppliers.length > 0 
                ? (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Supplier rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{supplier.name}</CardTitle>
                <Badge variant="secondary">{supplier.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Mail size={14} />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Phone size={14} />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <MapPin size={14} />
                  <span>{supplier.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm">
                  <div className="font-medium">Total Spent</div>
                  <div className="text-slate-600">R{supplier.totalSpent.toLocaleString()}</div>
                </div>
                <div className="text-sm text-right">
                  <div className="font-medium">Rating</div>
                  <div className="text-slate-600">{supplier.rating}/5</div>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Last order: {supplier.lastOrder}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSuppliers.length === 0 && (
          <div className="col-span-full text-center py-8 text-slate-500">
            {searchTerm ? `No suppliers found matching "${searchTerm}"` : 'No suppliers found. Add your first supplier to get started.'}
          </div>
        )}
      </div>

      {/* Supplier Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <SupplierForm 
              onClose={() => setShowForm(false)} 
              selectedBusiness={selectedBusiness}
            />
          </div>
        </div>
      )}
    </div>
  );
};
