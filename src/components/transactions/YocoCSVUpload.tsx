
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { YocoTransaction } from '@/types/transaction';
import type { Business } from '@/components/AdminDashboard';

interface YocoCSVUploadProps {
  onClose: () => void;
}

interface ProcessedYocoTransaction {
  transactionId: string;
  date: string;
  amount: number;
  processingFee: number;
  netAmount: number;
  cardType: string;
  settlementDate: string;
  reference: string;
}

export const YocoCSVUpload = ({ onClose }: YocoCSVUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ProcessedYocoTransaction[]>([]);
  const [defaultBusiness, setDefaultBusiness] = useState<Business>('Fish');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file from your Yoco dashboard",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        toast({
          title: "Empty File",
          description: "The CSV file appears to be empty",
          variant: "destructive",
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Validate Yoco CSV format
      const expectedHeaders = ['Transaction Date', 'Transaction ID', 'Amount', 'Processing Fee', 'Net Amount'];
      const hasRequiredHeaders = expectedHeaders.every(header => 
        headers.some(h => h.includes(header.replace(' ', '')))
      );
      
      if (!hasRequiredHeaders) {
        toast({
          title: "Invalid Yoco CSV Format",
          description: "This doesn't appear to be a Yoco export file. Please download the CSV from your Yoco dashboard.",
          variant: "destructive",
        });
        return;
      }

      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        return row as YocoTransaction;
      }).filter(row => row['Transaction ID']);

      const processed = processYocoData(data);
      setPreview(processed);
      validateYocoData(processed);
    };
    
    reader.readAsText(uploadedFile);
  };

  const processYocoData = (data: YocoTransaction[]): ProcessedYocoTransaction[] => {
    return data.map(row => ({
      transactionId: row['Transaction ID'],
      date: row['Transaction Date'],
      amount: parseFloat(row['Amount'].replace(/[R,]/g, '')) || 0,
      processingFee: parseFloat(row['Processing Fee'].replace(/[R,]/g, '')) || 0,
      netAmount: parseFloat(row['Net Amount'].replace(/[R,]/g, '')) || 0,
      cardType: row['Card Type'] || 'Unknown',
      settlementDate: row['Settlement Date'] || '',
      reference: row['Reference'] || ''
    }));
  };

  const validateYocoData = (data: ProcessedYocoTransaction[]) => {
    const errors: string[] = [];
    
    data.forEach((row, index) => {
      if (!row.transactionId) {
        errors.push(`Row ${index + 2}: Missing transaction ID`);
      }
      if (row.amount <= 0) {
        errors.push(`Row ${index + 2}: Invalid amount`);
      }
      if (!row.date) {
        errors.push(`Row ${index + 2}: Missing transaction date`);
      }
    });

    setValidationErrors(errors);
  };

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Errors",
        description: "Please fix all validation errors before importing",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing Yoco transactions
    setTimeout(() => {
      const totalAmount = preview.reduce((sum, t) => sum + t.amount, 0);
      const totalFees = preview.reduce((sum, t) => sum + t.processingFee, 0);
      const netRevenue = preview.reduce((sum, t) => sum + t.netAmount, 0);
      
      toast({
        title: "Yoco Import Successful",
        description: `Imported ${preview.length} transactions. Gross: R${totalAmount.toFixed(2)}, Fees: R${totalFees.toFixed(2)}, Net: R${netRevenue.toFixed(2)}`,
      });
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="text-blue-600" size={24} />
          <h3 className="text-lg font-semibold text-slate-900">Import Yoco Transactions</h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close upload dialog"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">How to get your Yoco data:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Log into your Yoco dashboard</li>
              <li>Go to Reports → Transactions</li>
              <li>Select your date range</li>
              <li>Click "Export to CSV"</li>
              <li>Upload the downloaded file here</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Default Business Selection */}
      <div className="space-y-2">
        <Label>Assign all transactions to business:</Label>
        <Select value={defaultBusiness} onValueChange={(value) => setDefaultBusiness(value as Business)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fish">Fish</SelectItem>
            <SelectItem value="Honey">Honey</SelectItem>
            <SelectItem value="Mushrooms">Mushrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="yoco-csv">Upload Yoco CSV Export</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="yoco-csv"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="flex-1"
          />
          <Upload size={20} className="text-slate-400" />
        </div>
      </div>

      {/* Validation Summary */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {validationErrors.length === 0 ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <AlertCircle className="text-red-600" size={20} />
              )}
              <span>
                Validation {validationErrors.length === 0 ? 'Passed' : 'Failed'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Transactions:</span> {preview.length}
              </div>
              <div>
                <span className="font-medium">Total Amount:</span> R{preview.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Processing Fees:</span> R{preview.reduce((sum, t) => sum + t.processingFee, 0).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Validation Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {validationErrors.map((error, index) => (
                <div key={index} className="text-sm text-red-600">
                  {error}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Yoco Transaction Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Transaction ID</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Fee</th>
                    <th className="text-left py-2 px-2">Net</th>
                    <th className="text-left py-2 px-2">Card Type</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-1 px-2">{row.date}</td>
                      <td className="py-1 px-2 font-mono text-xs">{row.transactionId}</td>
                      <td className="py-1 px-2">R{row.amount.toFixed(2)}</td>
                      <td className="py-1 px-2 text-red-600">R{row.processingFee.toFixed(2)}</td>
                      <td className="py-1 px-2 font-medium">R{row.netAmount.toFixed(2)}</td>
                      <td className="py-1 px-2">{row.cardType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 5 && (
                <p className="text-xs text-slate-600 mt-2">
                  Showing first 5 of {preview.length} transactions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={!file || validationErrors.length > 0 || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Importing...' : `Import ${preview.length} Transactions`}
        </Button>
      </div>
    </div>
  );
};
