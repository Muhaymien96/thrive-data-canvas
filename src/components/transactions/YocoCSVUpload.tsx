
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import type { Transaction } from '@/types/database';

interface YocoTransaction {
  id: string;
  amount: number;
  fee: number;
  net_amount: number;
  currency: string;
  status: string;
  type: string;
  description: string;
  created_at: string;
  reference: string;
  card_type?: string;
}

interface YocoCSVUploadProps {
  onTransactionsImported: (transactions: Transaction[]) => void;
  businessId: string;
}

export const YocoCSVUpload = ({ onTransactionsImported, businessId }: YocoCSVUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<YocoTransaction[]>([]);
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
    }
  };

  const parseCSV = (csvText: string): YocoTransaction[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const transaction: any = {};
        
        headers.forEach((header, i) => {
          transaction[header] = values[i] || '';
        });

        return {
          id: transaction.id || `yoco-${index}`,
          amount: parseFloat(transaction.amount) || 0,
          fee: parseFloat(transaction.fee) || 0,
          net_amount: parseFloat(transaction.net_amount) || 0,
          currency: transaction.currency || 'ZAR',
          status: transaction.status || 'completed',
          type: transaction.type || 'payment',
          description: transaction.description || 'Yoco Payment',
          created_at: transaction.created_at || new Date().toISOString(),
          reference: transaction.reference || '',
          card_type: transaction.card_type
        };
      });
  };

  const convertToTransactions = (yocoTransactions: YocoTransaction[]): Transaction[] => {
    return yocoTransactions.map(yoco => ({
      id: `yoco-${yoco.id}`,
      business_id: businessId,
      type: 'sale',
      amount: yoco.amount,
      date: yoco.created_at.split('T')[0],
      description: yoco.description,
      payment_method: 'card',
      payment_status: yoco.status === 'successful' ? 'completed' : 'pending',
      yoco_transaction_id: yoco.id,
      yoco_fee: yoco.fee,
      yoco_net_amount: yoco.net_amount,
      yoco_reference: yoco.reference,
      yoco_card_type: yoco.card_type,
      customer_name: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Transaction));
  };

  const handleProcessFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const yocoData = parseCSV(text);
      setPreviewData(yocoData);
      setStep('preview');
      
      toast({
        title: "File processed successfully",
        description: `Found ${yocoData.length} transactions to import.`,
      });
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        title: "Error processing file",
        description: "Please check your CSV format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    const transactions = convertToTransactions(previewData);
    onTransactionsImported(transactions);
    setStep('complete');
    
    toast({
      title: "Transactions imported successfully",
      description: `${transactions.length} transactions have been imported.`,
    });
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewData([]);
    setStep('upload');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <CardTitle>Import Yoco Transactions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'upload' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Select Yoco CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-2"
              />
              <p className="text-sm text-slate-500 mt-1">
                Upload your Yoco transaction export CSV file
              </p>
            </div>

            {file && (
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                <FileText className="h-4 w-4 text-slate-600" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <Button 
              onClick={handleProcessFile} 
              disabled={!file || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                'Process File'
              )}
            </Button>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Preview Transactions</h3>
              <div className="text-sm text-slate-600">
                {previewData.length} transactions found
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Fee</th>
                      <th className="text-left p-3">Net</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((transaction, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{new Date(transaction.created_at).toLocaleDateString()}</td>
                        <td className="p-3">R{transaction.amount.toFixed(2)}</td>
                        <td className="p-3">R{transaction.fee.toFixed(2)}</td>
                        <td className="p-3">R{transaction.net_amount.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            transaction.status === 'successful' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="p-3 truncate max-w-48">{transaction.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length > 10 && (
                <div className="p-3 bg-slate-50 text-center text-sm text-slate-600">
                  ... and {previewData.length - 10} more transactions
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetUpload}>
                Cancel
              </Button>
              <Button onClick={handleImport}>
                Import {previewData.length} Transactions
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="text-lg font-medium">Import Complete!</h3>
            <p className="text-slate-600">
              Your Yoco transactions have been successfully imported.
            </p>
            <Button onClick={resetUpload}>
              Import Another File
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
