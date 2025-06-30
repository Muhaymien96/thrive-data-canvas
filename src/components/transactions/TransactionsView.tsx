
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionForm } from './TransactionForm';
import { CSVUpload } from './CSVUpload';
import { YocoCSVUpload } from './YocoCSVUpload';
import { mockTransactions } from '@/lib/mockData';
import { Plus, Upload, CreditCard } from 'lucide-react';
import type { Business } from '@/types/transaction';

interface TransactionsViewProps {
  selectedBusiness: Business;
}

export const TransactionsView = ({ selectedBusiness }: TransactionsViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showYocoUpload, setShowYocoUpload] = useState(false);
  
  const filteredTransactions = selectedBusiness === 'All' 
    ? mockTransactions 
    : mockTransactions.filter(t => t.business === selectedBusiness);

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
