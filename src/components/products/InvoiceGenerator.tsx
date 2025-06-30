
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus } from 'lucide-react';
import type { BusinessWithAll, Invoice } from '@/types/database';

interface InvoiceGeneratorProps {
  selectedBusiness: BusinessWithAll;
}

export const InvoiceGenerator = ({ selectedBusiness }: InvoiceGeneratorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const invoices: Invoice[] = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText size={20} />
          <span>Invoice Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Create Invoice</span>
          </Button>
        </div>

        {invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <div>
                  <div className="font-medium text-slate-900">
                    Invoice #{invoice.invoice_number}
                  </div>
                  <div className="text-sm text-slate-500">
                    {invoice.customer_name} • {invoice.issue_date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">R{invoice.total.toLocaleString()}</div>
                  <div className={`text-sm ${
                    invoice.status === 'paid' ? 'text-green-600' :
                    invoice.status === 'overdue' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {invoice.status}
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
              Create your first invoice to start billing customers.
            </p>
            <Button className="flex items-center space-x-2">
              <Plus size={16} />
              <span>Create Your First Invoice</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
