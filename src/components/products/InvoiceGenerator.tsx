
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Plus, Eye, Calendar, User, DollarSign } from 'lucide-react';
import { InvoiceViewModal } from '@/components/transactions/InvoiceViewModal';
import { InvoiceGenerationModal } from '@/components/transactions/InvoiceGenerationModal';
import type { BusinessWithAll, Invoice } from '@/types/database';

interface InvoiceGeneratorProps {
  selectedBusiness: BusinessWithAll;
}

export const InvoiceGenerator = ({ selectedBusiness }: InvoiceGeneratorProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  
  const businessId = selectedBusiness === 'All' ? undefined : selectedBusiness.id;

  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['invoices', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('invoices')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .order('created_at', { ascending: false });

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }
      
      return data as Invoice[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceView(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Create a temporary transaction object for the invoice view modal
    const tempTransaction = {
      id: invoice.id,
      amount: invoice.total,
      date: invoice.issue_date,
      due_date: invoice.due_date,
      customer_name: invoice.customer_name,
      description: `Invoice ${invoice.invoice_number}`,
      invoice_number: invoice.invoice_number,
      payment_status: invoice.status,
      payment_method: null,
      type: 'sale',
      business_id: invoice.business_id,
      customer_id: invoice.customer_id,
      supplier_id: null,
      employee_id: null,
      employee_name: null,
      hours_worked: null,
      hourly_rate: null,
      cost_type: null,
      yoco_transaction_id: null,
      yoco_card_type: null,
      yoco_reference: null,
      yoco_fee: null,
      yoco_net_amount: null,
      cash_received: null,
      cash_change: null,
      amount_paid: null,
      invoice_date: invoice.issue_date,
      invoice_generated: true,
      created_at: invoice.created_at,
      updated_at: invoice.updated_at
    };
    
    setSelectedInvoice(invoice);
    setShowInvoiceView(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText size={20} />
            <span>Invoice Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading invoices...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText size={20} />
            <span>Invoice Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-red-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Invoices</h3>
            <p className="text-slate-500">There was an error loading your invoice data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText size={20} />
              <span>Invoice Management</span>
            </div>
            <Button
              onClick={() => setShowCreateInvoice(true)}
              className="flex items-center space-x-2"
              disabled={!businessId}
            >
              <Plus size={16} />
              <span>Create Invoice</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="font-medium text-slate-900">
                        {invoice.invoice_number}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <User size={12} />
                        <span>{invoice.customer_name}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar size={12} />
                          <span>Issued: {formatDate(invoice.issue_date)}</span>
                        </div>
                        {invoice.due_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>Due: {formatDate(invoice.due_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`text-xs ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-lg font-medium">
                        <DollarSign size={16} />
                        <span>{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewInvoice(invoice)}
                        className="flex items-center space-x-1"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="flex items-center space-x-1"
                      >
                        <Download size={12} />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No invoices found</h3>
              <p className="text-slate-500 mb-4">
                Create your first invoice to get started with billing.
              </p>
              <Button
                onClick={() => setShowCreateInvoice(true)}
                className="flex items-center space-x-2"
                disabled={!businessId}
              >
                <Plus size={16} />
                <span>Create First Invoice</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showInvoiceView && selectedInvoice && (
        <InvoiceViewModal
          transaction={{
            id: selectedInvoice.id,
            amount: selectedInvoice.total,
            date: selectedInvoice.issue_date,
            due_date: selectedInvoice.due_date,
            customer_name: selectedInvoice.customer_name,
            description: `Invoice ${selectedInvoice.invoice_number}`,
            invoice_number: selectedInvoice.invoice_number,
            payment_status: selectedInvoice.status,
            payment_method: null,
            type: 'sale',
            business_id: selectedInvoice.business_id,
            customer_id: selectedInvoice.customer_id,
            supplier_id: null,
            employee_id: null,
            employee_name: null,
            hours_worked: null,
            hourly_rate: null,
            cost_type: null,
            yoco_transaction_id: null,
            yoco_card_type: null,
            yoco_reference: null,
            yoco_fee: null,
            yoco_net_amount: null,
            cash_received: null,
            cash_change: null,
            amount_paid: null,
            invoice_date: selectedInvoice.issue_date,
            invoice_generated: true,
            created_at: selectedInvoice.created_at,
            updated_at: selectedInvoice.updated_at
          }}
          invoice={selectedInvoice}
          onClose={() => {
            setShowInvoiceView(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </>
  );
};
