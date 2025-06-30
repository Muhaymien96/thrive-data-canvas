
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SupplierForm } from './SupplierForm';
import { SupplierPaymentDialog } from './SupplierPaymentDialog';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Plus, MapPin, Phone, Mail, Star, DollarSign, Calendar, Truck, CreditCard } from 'lucide-react';
import type { BusinessWithAll, Supplier } from '@/types/database';

interface SuppliersViewProps {
  selectedBusiness: BusinessWithAll;
}

export const SuppliersView = ({ selectedBusiness }: SuppliersViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const businessId = selectedBusiness === 'All' ? undefined : selectedBusiness.id;
  const { data: suppliers = [], isLoading, error } = useSuppliers(businessId);

  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  const handleMakePayment = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowPaymentDialog(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Suppliers</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading suppliers...</p>
        </div>
      </div>
    );
  }

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
          disabled={!businessId}
        >
          <Plus size={16} />
          <span>Add Supplier</span>
        </Button>
      </div>

      {suppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                      {supplier.name}
                    </CardTitle>
                    {supplier.category && (
                      <Badge variant="secondary" className="text-xs">
                        {supplier.category}
                      </Badge>
                    )}
                  </div>
                  {supplier.rating && supplier.rating > 0 && (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact Information - Always reserve space */}
                <div className="min-h-[60px] space-y-2">
                  {supplier.email && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Mail size={14} />
                      <span className="truncate">{supplier.email}</span>
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
                  {!supplier.email && !supplier.phone && !supplier.address && (
                    <div className="flex items-center justify-center h-[60px] text-sm text-slate-400">
                      No contact details available
                    </div>
                  )}
                </div>

                {/* Financial Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 mb-1">
                      <DollarSign size={12} />
                      <span className="text-xs">Total Spent</span>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(supplier.total_spent || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-slate-500 mb-1">
                      <CreditCard size={12} />
                      <span className="text-xs">Outstanding</span>
                    </div>
                    <div className={`font-medium ${
                      (supplier.outstanding_balance || 0) > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(supplier.outstanding_balance || 0)}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <Truck size={10} />
                      <span>Last Order</span>
                    </div>
                    <div>{formatDate(supplier.last_order)}</div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <Calendar size={10} />
                      <span>Last Payment</span>
                    </div>
                    <div>{formatDate(supplier.last_payment_date)}</div>
                  </div>
                </div>

                {/* Action Buttons - Always at bottom */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMakePayment(supplier)}
                      className="flex-1 text-xs"
                      disabled={supplier.name === 'Self-Produced'}
                    >
                      Make Payment
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Truck size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No suppliers found</h3>
              <p className="text-slate-500 mb-4">
                Add your first supplier to start managing your supply chain.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2"
                disabled={!businessId}
              >
                <Plus size={16} />
                <span>Add Your First Supplier</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <SupplierForm
              onClose={() => setShowForm(false)}
              defaultBusiness={businessId}
            />
          </div>
        </div>
      )}

      {showPaymentDialog && selectedSupplier && (
        <SupplierPaymentDialog
          supplier={selectedSupplier}
          onClose={() => {
            setShowPaymentDialog(false);
            setSelectedSupplier(null);
          }}
        />
      )}
    </div>
  );
};
