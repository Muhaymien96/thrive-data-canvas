
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TransactionForm } from './TransactionForm';
import { CSVUpload } from './CSVUpload';
import { YocoCSVUpload } from './YocoCSVUpload';
import { InvoiceFromTransactionModal } from './InvoiceFromTransactionModal';
import { useTransactions } from '@/hooks/useSupabaseData';
import { Plus, Upload, CreditCard, FileText, Eye, Receipt } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { BusinessWithAll, Transaction } from '@/types/database';

interface TransactionsViewProps {
  selectedBusiness: BusinessWithAll;
}

export const TransactionsView = ({ selectedBusiness }: TransactionsViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showYocoUpload, setShowYocoUpload] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const businessId = selectedBusiness === 'All' ? undefined : selectedBusiness;
  const { data: transactions = [], isLoading, error } = useTransactions(businessId);

  const handleSaveTransaction = (transactionData: any) => {
    console.log('Saving transaction:', transactionData);
    toast({
      title: "Transaction Saved",
      description: "Transaction has been successfully saved.",
    });
    setShowForm(false);
  };

  const handleGenerateInvoice = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowInvoiceModal(true);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    console.log('Viewing transaction details:', transaction);
    toast({
      title: "Transaction Details",
      description: `Viewing details for transaction ${transaction.id.slice(0, 8)}...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Transactions</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading transactions. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Transactions</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowYocoUpload(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <CreditCard size={16} />
            <span>Import Yoco</span>
          </Button>
          <Button
            onClick={() => setShowCSVUpload(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Upload size={16} />
            <span>Import CSV</span>
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <TransactionForm 
              onClose={() => setShowForm(false)} 
              onSave={handleSaveTransaction}
            />
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCSVUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CSVUpload onClose={() => setShowCSVUpload(false)} />
          </div>
        </div>
      )}

      {/* Yoco Upload Modal */}
      {showYocoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <YocoCSVUpload onClose={() => setShowYocoUpload(false)} />
          </div>
        </div>
      )}

      {/* Invoice Generation Modal */}
      {showInvoiceModal && selectedTransaction && (
        <InvoiceFromTransactionModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedTransaction(null);
          }}
          onSubmit={(invoiceData) => {
            console.log('Invoice generated from transaction:', invoiceData);
            toast({
              title: "Invoice Generated",
              description: "Invoice has been successfully generated from transaction.",
            });
            setShowInvoiceModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt size={20} />
            <span>Transaction History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-slate-600">Loading transactions...</span>
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Invoice</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm">{transaction.date}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="capitalize">{transaction.type}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        R{transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {transaction.customer_name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge className={`text-xs ${getStatusColor(transaction.payment_status || 'pending')}`}>
                          {transaction.payment_status || 'pending'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {transaction.invoice_generated ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {transaction.invoice_number || 'Generated'}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-xs">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            <Eye size={14} />
                          </Button>
                          {transaction.type === 'sale' && !transaction.invoice_generated && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateInvoice(transaction)}
                            >
                              <FileText size={14} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions found</h3>
              <p className="text-slate-500 mb-4">
                {selectedBusiness === 'All' 
                  ? 'Start by adding your first transaction to track your business activity.'
                  : 'No transactions found for the selected business.'
                }
              </p>
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Add Your First Transaction</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
