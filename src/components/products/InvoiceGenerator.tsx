
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { InvoiceManagement } from '@/components/invoices/InvoiceManagement';
import { getInvoicesByBusiness } from '@/lib/mockData';
import { FileText, Download, Send, Eye, Plus } from 'lucide-react';
import type { BusinessWithAll } from '@/types/transaction';
import type { Invoice } from '@/types/transaction';

interface InvoiceGeneratorProps {
  selectedBusiness: BusinessWithAll;
}

export const InvoiceGenerator = ({ selectedBusiness }: InvoiceGeneratorProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [activeTab, setActiveTab] = useState('management');
  
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

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice.id);
    setActiveTab('preview');
  };

  const selectedInvoiceData = invoices.find(inv => inv.id === selectedInvoice);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoice System</h2>
          {selectedBusiness !== 'All' && (
            <p className="text-sm text-slate-600 mt-1">
              Managing invoices for {selectedBusiness} business
            </p>
          )}
        </div>
        <Button 
          onClick={() => setShowInvoiceForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Create Invoice</span>
        </Button>
      </div>

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <InvoiceForm
          selectedBusiness={selectedBusiness}
          onClose={() => setShowInvoiceForm(false)}
          onSubmit={(data, isDraft) => {
            console.log('Invoice submitted:', data, isDraft);
            // In a real app, this would save the invoice
          }}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management">Invoice Management</TabsTrigger>
          <TabsTrigger value="preview">Invoice Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          <InvoiceManagement
            selectedBusiness={selectedBusiness}
            onCreateInvoice={() => setShowInvoiceForm(true)}
            onViewInvoice={handleViewInvoice}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
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
                        <p className="text-slate-600">{selectedInvoiceData.invoiceNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Date: {selectedInvoiceData.issueDate}</p>
                        {selectedInvoiceData.dueDate && (
                          <p className="text-sm text-slate-600">Due: {selectedInvoiceData.dueDate}</p>
                        )}
                        <Badge className={`mt-2 ${getStatusColor(selectedInvoiceData.status)}`}>
                          {selectedInvoiceData.status}
                        </Badge>
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
                            <td className="py-2 text-sm">{item.description}</td>
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

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadInvoice(selectedInvoiceData.id)}
                    >
                      <Download size={16} className="mr-2" />
                      Download PDF
                    </Button>
                    
                    {selectedInvoiceData.status !== 'paid' && (
                      <Button
                        onClick={() => handleSendInvoice(selectedInvoiceData.id)}
                      >
                        <Send size={16} className="mr-2" />
                        Send Invoice
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Eye size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select an invoice from the management tab to preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
