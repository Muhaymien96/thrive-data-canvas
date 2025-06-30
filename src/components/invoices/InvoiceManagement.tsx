
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInvoicesByBusiness } from '@/lib/mockData';
import { Search, Filter, Plus, Eye, Edit, Send, Check, AlertTriangle } from 'lucide-react';
import type { BusinessWithAll } from '@/types/transaction';
import type { Invoice } from '@/types/transaction';

interface InvoiceManagementProps {
  selectedBusiness: BusinessWithAll;
  onCreateInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const InvoiceManagement = ({ selectedBusiness, onCreateInvoice, onViewInvoice }: InvoiceManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check size={14} />;
      case 'sent':
        return <Send size={14} />;
      case 'overdue':
        return <AlertTriangle size={14} />;
      default:
        return null;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsPaid = (invoiceId: string) => {
    console.log(`Marking invoice ${invoiceId} as paid`);
    // In a real app, this would update the invoice status
  };

  const handleSendInvoice = (invoiceId: string) => {
    console.log(`Sending invoice ${invoiceId}`);
    // In a real app, this would send the invoice via email
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing bulk action: ${action} on invoices:`, selectedInvoices);
    // In a real app, this would perform the bulk action
    setSelectedInvoices([]);
  };

  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const getTotalAmount = () => {
    return filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  };

  const getStatusCounts = () => {
    return {
      total: filteredInvoices.length,
      draft: filteredInvoices.filter(i => i.status === 'draft').length,
      sent: filteredInvoices.filter(i => i.status === 'sent').length,
      paid: filteredInvoices.filter(i => i.status === 'paid').length,
      overdue: filteredInvoices.filter(i => i.status === 'overdue').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoice Management</h2>
          {selectedBusiness !== 'All' && (
            <p className="text-sm text-slate-600 mt-1">
              Managing invoices for {selectedBusiness} business
            </p>
          )}
        </div>
        <Button onClick={onCreateInvoice} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Create Invoice</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{statusCounts.total}</div>
            <div className="text-sm text-slate-600">Total Invoices</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-600">{statusCounts.draft}</div>
            <div className="text-sm text-slate-600">Draft</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.sent}</div>
            <div className="text-sm text-slate-600">Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statusCounts.paid}</div>
            <div className="text-sm text-slate-600">Paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statusCounts.overdue}</div>
            <div className="text-sm text-slate-600">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search invoices by number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter size={16} className="mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedInvoices.length} invoice(s) selected
          </span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('send')}
            >
              Send Selected
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('mark-paid')}
            >
              Mark as Paid
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setSelectedInvoices([])}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Invoices</span>
            <span className="text-sm font-normal text-slate-600">
              Total Value: R{getTotalAmount().toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 w-8">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvoices(filteredInvoices.map(i => i.id));
                          } else {
                            setSelectedInvoices([]);
                          }
                        }}
                        checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Invoice #</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => toggleInvoiceSelection(invoice.id)}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4 text-sm">{invoice.customerName}</td>
                      <td className="py-3 px-4 text-sm">{invoice.issueDate}</td>
                      <td className="py-3 px-4 text-sm">{invoice.dueDate}</td>
                      <td className="py-3 px-4 text-sm font-medium">R{invoice.total.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge className={`text-xs flex items-center gap-1 w-fit ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewInvoice(invoice)}
                          >
                            <Eye size={14} />
                          </Button>
                          
                          {invoice.status !== 'paid' && (
                            <>
                              {invoice.status === 'draft' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSendInvoice(invoice.id)}
                                >
                                  <Send size={14} />
                                </Button>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsPaid(invoice.id)}
                              >
                                <Check size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No invoices match your search criteria.' 
                  : 'No invoices found. Create your first invoice to get started.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
