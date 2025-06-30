
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, CreditCard, Calendar, Tag } from 'lucide-react';
import type { Customer } from '@/types/database';

interface CustomerDetailsProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetails = ({ customer, isOpen, onClose }: CustomerDetailsProps) => {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{customer.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.email && (
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-slate-500" />
                  <span className="text-sm">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-slate-500" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-slate-500" />
                  <span className="text-sm">{customer.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Total Purchases</div>
                  <div className="text-lg font-semibold">R{(customer.total_purchases || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Outstanding Balance</div>
                  <div className={`text-lg font-semibold ${
                    (customer.outstanding_balance || 0) > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    R{(customer.outstanding_balance || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Credit Limit</div>
                  <div className="text-lg font-semibold">R{(customer.credit_limit || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Payment Terms</div>
                  <div className="text-lg font-semibold">{customer.payment_terms || 30} days</div>
                </div>
              </div>

              {customer.last_purchase && (
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-slate-500" />
                  <span className="text-sm">Last Purchase: {customer.last_purchase}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Tag size={18} />
                  <span>Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoice Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <CreditCard size={16} className="text-slate-500" />
                <span className="text-sm">
                  Invoice Preference: {customer.invoice_preference || 'email'}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
