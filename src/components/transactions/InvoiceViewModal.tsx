
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Calendar, User, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Transaction, Invoice } from '@/types/database';

interface InvoiceViewModalProps {
  transaction: Transaction;
  invoice?: Invoice;
  onClose: () => void;
}

export const InvoiceViewModal = ({ transaction, invoice, onClose }: InvoiceViewModalProps) => {
  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  const handleDownloadPDF = () => {
    const content = generateInvoiceContent();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${transaction.invoice_number || transaction.id}.html`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Invoice Downloaded",
      description: "Invoice has been downloaded as HTML file",
    });
  };

  const generateInvoiceContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${transaction.invoice_number || transaction.id}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #ddd; 
            padding-bottom: 20px;
          }
          .invoice-info { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 30px; 
          }
          .invoice-details { 
            background: #f9f9f9; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 30px;
          }
          .total { 
            font-size: 1.5em; 
            font-weight: bold; 
            text-align: right; 
            margin-top: 20px; 
            padding-top: 20px;
            border-top: 2px solid #ddd;
          }
          .status { 
            padding: 8px 16px; 
            border-radius: 4px; 
            font-weight: bold;
            display: inline-block;
            margin-top: 10px;
          }
          .status-paid { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-overdue { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <h2>${transaction.invoice_number || `INV-${transaction.id.slice(0, 8)}`}</h2>
        </div>
        
        <div class="invoice-info">
          <div>
            <h3>Bill To:</h3>
            <p><strong>${transaction.customer_name || 'Customer'}</strong></p>
          </div>
          <div>
            <h3>Invoice Date:</h3>
            <p>${formatDate(transaction.date)}</p>
            ${transaction.due_date ? `<h3>Due Date:</h3><p>${formatDate(transaction.due_date)}</p>` : ''}
          </div>
        </div>
        
        <div class="invoice-details">
          <h3>Transaction Details</h3>
          <p><strong>Type:</strong> ${transaction.type}</p>
          <p><strong>Payment Method:</strong> ${transaction.payment_method || 'Not specified'}</p>
          ${transaction.description ? `<p><strong>Description:</strong> ${transaction.description}</p>` : ''}
          ${transaction.yoco_transaction_id ? `<p><strong>Reference:</strong> ${transaction.yoco_transaction_id}</p>` : ''}
        </div>
        
        <div class="total">
          <p>Total Amount: ${formatCurrency(transaction.amount)}</p>
          <div class="status status-${transaction.payment_status || 'pending'}">
            Status: ${(transaction.payment_status || 'pending').toUpperCase()}
          </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
          <p>Thank you for your business!</p>
          <p><small>Invoice generated on ${formatDate(new Date().toISOString())}</small></p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} />
            Invoice #{transaction.invoice_number || transaction.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-sm">
                Invoice
              </Badge>
              <Badge 
                className={`text-sm ${
                  transaction.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                  transaction.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  transaction.payment_status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-slate-100 text-slate-800'
                }`}
              >
                {transaction.payment_status || 'pending'}
              </Badge>
            </div>
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download size={16} />
              Download
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
                <p className="text-lg font-medium">{transaction.customer_name || 'Customer'}</p>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-500" />
                <span className="text-sm font-medium">Invoice Date:</span>
                <span className="text-sm">{formatDate(transaction.date)}</span>
              </div>

              {transaction.due_date && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">Due Date:</span>
                  <span className="text-sm">{formatDate(transaction.due_date)}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-right">
                <h3 className="font-semibold text-lg mb-2">Invoice #</h3>
                <p className="text-lg font-mono">{transaction.invoice_number || `INV-${transaction.id.slice(0, 8)}`}</p>
              </div>

              {transaction.payment_method && (
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-medium">Payment Method:</span>
                  <span className="text-sm capitalize">{transaction.payment_method.replace('_', ' ')}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Transaction Details</h3>
            
            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Transaction Type:</span>
                <Badge variant="outline">{transaction.type}</Badge>
              </div>
              
              {transaction.description && (
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-sm text-slate-600">{transaction.description}</p>
                </div>
              )}

              {transaction.yoco_transaction_id && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Reference:</span>
                  <span className="text-sm font-mono">{transaction.yoco_transaction_id}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="text-right space-y-2">
            <div className="text-3xl font-bold flex items-center justify-end gap-2">
              <DollarSign size={24} />
              Total: {formatCurrency(transaction.amount)}
            </div>
            {transaction.payment_status && (
              <div className="text-sm text-slate-600">
                Payment Status: <span className="font-medium capitalize">{transaction.payment_status}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download size={16} />
              Download Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
