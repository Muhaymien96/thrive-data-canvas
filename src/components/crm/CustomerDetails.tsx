
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Customer, mockTransactions } from '@/lib/mockData';
import { Mail, Phone, CreditCard, ShoppingBag, AlertCircle, Calendar, TrendingUp } from 'lucide-react';

interface CustomerDetailsProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetails = ({ customer, isOpen, onClose }: CustomerDetailsProps) => {
  if (!customer) return null;

  const customerTransactions = mockTransactions.filter(t => t.customer === customer.name);
  const paidTransactions = customerTransactions.filter(t => t.paymentStatus === 'paid');
  const pendingTransactions = customerTransactions.filter(t => t.paymentStatus === 'pending' || t.paymentStatus === 'partial');

  const creditUtilization = (customer.outstandingBalance / customer.creditLimit) * 100;
  const availableCredit = customer.creditLimit - customer.outstandingBalance;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-labelledby="customer-details-title">
        <DialogHeader>
          <DialogTitle id="customer-details-title" className="text-2xl font-bold text-slate-900">
            Customer Profile: {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Customer Information */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Email</p>
                    <a 
                      href={`mailto:${customer.email}`} 
                      className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label={`Send email to ${customer.email}`}
                    >
                      {customer.email}
                    </a>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Customer Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Credit Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Credit Limit</p>
                    <p className="text-lg font-bold text-slate-900">R{customer.creditLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Available Credit</p>
                    <p className="text-lg font-bold text-green-600">R{availableCredit.toLocaleString()}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700">Outstanding Balance</p>
                    {customer.outstandingBalance > 0 && (
                      <AlertCircle className="h-4 w-4 text-amber-500" aria-label="Has outstanding balance" />
                    )}
                  </div>
                  <p className={`text-lg font-bold ${customer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    R{customer.outstandingBalance.toLocaleString()}
                  </p>
                  
                  {customer.outstandingBalance > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Credit Utilization</span>
                        <span>{creditUtilization.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${creditUtilization > 80 ? 'bg-red-500' : creditUtilization > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(creditUtilization, 100)}%` }}
                          role="progressbar"
                          aria-valuenow={creditUtilization}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Credit utilization: ${creditUtilization.toFixed(1)}%`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase History and Statistics */}
          <div className="lg:col-span-2 space-y-4">
            {/* Purchase Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Total Purchases</p>
                      <p className="text-xl font-bold text-slate-900">R{customer.totalPurchases.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-green-600" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Last Purchase</p>
                      <p className="text-xl font-bold text-slate-900">{customer.lastPurchase}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-purple-600" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Total Orders</p>
                      <p className="text-xl font-bold text-slate-900">{customerTransactions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {customerTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {customerTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">{transaction.business} - {transaction.date}</p>
                            <p className="text-lg font-bold text-slate-900">R{transaction.amount.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {transaction.type.toUpperCase()}
                            </Badge>
                            <Badge 
                              variant={
                                transaction.paymentStatus === 'paid' ? 'default' : 
                                transaction.paymentStatus === 'partial' ? 'secondary' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {transaction.paymentStatus === 'paid' ? 'Paid' :
                               transaction.paymentStatus === 'partial' ? 'Partially Paid' : 'Pending'}
                            </Badge>
                            {transaction.dueDate && (
                              <span className="text-xs text-slate-500">Due: {transaction.dueDate}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {customerTransactions.length > 5 && (
                      <p className="text-sm text-slate-500 text-center pt-2">
                        Showing 5 of {customerTransactions.length} transactions
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>No transactions found for this customer</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Outstanding Payments Alert */}
            {pendingTransactions.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                    <AlertCircle className="h-5 w-5" />
                    Outstanding Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pendingTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between text-sm">
                        <span className="text-amber-800">
                          {transaction.business} - {transaction.date}
                          {transaction.dueDate && ` (Due: ${transaction.dueDate})`}
                        </span>
                        <Badge variant="outline" className="border-amber-300 text-amber-800">
                          R{(transaction.amount - (transaction.amountPaid || 0)).toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Send Payment Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
