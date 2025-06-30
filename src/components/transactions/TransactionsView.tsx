
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TransactionForm } from './TransactionForm';
import { CSVUpload } from './CSVUpload';
import { YocoCSVUpload } from './YocoCSVUpload';
import { InvoiceFromTransactionModal } from './InvoiceFromTransactionModal';
import { mockTransactions } from '@/lib/mockData';
import { Plus, Upload, CreditCard, FileText, Eye } from 'lucide-react';
import type { BusinessWithAll, Transaction } from '@/types/transaction';

interface TransactionsViewProps {
  selectedBusiness: BusinessWithAll;
}

export const TransactionsView = ({ selectedBusiness }: TransactionsViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showYocoUpload, setShowYocoUpload] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const filteredTransactions = selectedBusiness === 'All' 
    ? mockTransactions 
    : mockTransactions.filter(t => t.business === selectedBusiness);

  const handleSaveTransaction = (transaction: Transaction) => {
    console.log('Saving transaction:', transaction);
    // TODO: Implement actual save logic with Supabase
    setShowForm(false);
  };

  const handleGenerateInvoice = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowInvoiceModal(true);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    console.log('Viewing transaction details:', transaction);
    // TODO: Implement transaction detail view
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

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
            setShowInvoiceModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Business</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Invoice</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm">{transaction.date}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.business === 'Fish' ? 'bg-blue-100 text-blue-800' :
                        transaction.business === 'Honey' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {transaction.business}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm capitalize">{transaction.type}</td>
                    <td className="py-3 px-4 text-sm font-medium">R{transaction.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">{transaction.customer}</td>
                    <td className="py-3 px-4 text-sm">
                      {transaction.paymentStatus && (
                        <Badge className={`text-xs ${getStatusColor(transaction.paymentStatus)}`}>
                          {transaction.paymentStatus}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {transaction.invoiceGenerated ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {transaction.invoiceNumber}
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
                        {transaction.type === 'sale' && !transaction.invoiceGenerated && (
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
        </CardContent>
      </Card>
    </div>
  );
};
