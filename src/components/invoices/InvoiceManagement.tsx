
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { InvoiceForm } from './InvoiceForm';
import { FileText, Plus, Search, AlertTriangle } from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';
import type { BusinessWithAll } from '@/types/database';

interface InvoiceManagementProps {
  selectedBusiness: BusinessWithAll;
}

export const InvoiceManagement = ({ selectedBusiness }: InvoiceManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const businessId = selectedBusiness === 'All' ? undefined : selectedBusiness.id;
  const { data: invoices = [], isLoading, error } = useInvoices(businessId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Invoice Management</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Invoice Management</h2>
        </div>
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto text-red-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Invoices</h3>
          <p className="text-slate-500">There was an error loading your invoice data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Invoice Management</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Create Invoice</span>
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <InvoiceForm 
              onClose={() => setShowForm(false)} 
              onSave={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search invoices by customer or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText size={20} />
            <span>Invoices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Invoice #</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Issue Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium">{invoice.invoice_number}</td>
                      <td className="py-3 px-4 text-sm">{invoice.customer_name}</td>
                      <td className="py-3 px-4 text-sm">{invoice.issue_date}</td>
                      <td className="py-3 px-4 text-sm">{invoice.due_date || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm font-medium">R{invoice.total.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge className={`text-xs ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No invoices found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm 
                  ? `No invoices match "${searchTerm}"`
                  : 'Create your first invoice to start billing customers.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Create Your First Invoice</span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
