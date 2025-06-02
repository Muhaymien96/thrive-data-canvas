
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getInvoicesByBusiness } from '@/lib/mockData';
import { FileText, Download, Send, Eye } from 'lucide-react';
import type { Business } from '@/components/AdminDashboard';

interface InvoiceGeneratorProps {
  selectedBusiness: Business;
}

export const InvoiceGenerator = ({ selectedBusiness }: InvoiceGeneratorProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const invoices = getInvoicesByBusiness(selectedBusiness);

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

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`);
    // In a real app, this would generate and download a PDF
  };

  const handleSendInvoice = (invoiceId: string) => {
    console.log(`Sending invoice ${invoiceId}`);
    // In a real app, this would send the invoice via email
  };

  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoice(invoiceId);
  };

  const selectedInvoiceData = invoices.find(inv => inv.id === selectedInvoice);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className={`p-4 border rounded-lg hover:bg-slate-50 cursor-pointer ${
                  selectedInvoice === invoice.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                }`}
                onClick={() => handleViewInvoice(invoice.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-slate-500" />
                    <span className="font-medium text-slate-900">{invoice.id}</span>
                    <Badge className={`text-xs ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    R{invoice.total.toFixed(2)}
                  </span>
                </div>
                
                <div className="text-sm text-slate-600">
                  <div>Customer: {invoice.customerName}</div>
                  <div>Date: {invoice.date}</div>
                  {invoice.dueDate && (
                    <div>Due: {invoice.dueDate}</div>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadInvoice(invoice.id);
                    }}
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                  
                  {invoice.status !== 'paid' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendInvoice(invoice.id);
                      }}
                    >
                      <Send size={14} className="mr-1" />
                      Send
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {invoices.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No invoices found for this business.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedInvoiceData ? (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">INVOICE</h3>
                    <p className="text-slate-600">{selectedInvoiceData.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Date: {selectedInvoiceData.date}</p>
                    {selectedInvoiceData.dueDate && (
                      <p className="text-sm text-slate-600">Due: {selectedInvoiceData.dueDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Bill To:</h4>
                <div className="text-sm text-slate-600">
                  <p className="font-medium">{selectedInvoiceData.customerName}</p>
                  {selectedInvoiceData.customerEmail && (
                    <p>{selectedInvoiceData.customerEmail}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 text-sm font-medium text-slate-600">Item</th>
                      <th className="text-right py-2 text-sm font-medium text-slate-600">Qty</th>
                      <th className="text-right py-2 text-sm font-medium text-slate-600">Price</th>
                      <th className="text-right py-2 text-sm font-medium text-slate-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoiceData.items.map((item, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-2 text-sm">{item.productName}</td>
                        <td className="py-2 text-sm text-right">{item.quantity}</td>
                        <td className="py-2 text-sm text-right">R{item.unitPrice.toFixed(2)}</td>
                        <td className="py-2 text-sm text-right">R{item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal:</span>
                    <span>R{selectedInvoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (15%):</span>
                    <span>R{selectedInvoiceData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>R{selectedInvoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Eye size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select an invoice to preview</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
