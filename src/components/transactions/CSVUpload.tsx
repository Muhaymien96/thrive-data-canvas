
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CSVUploadProps {
  onClose: () => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export const CSVUpload = ({ onClose }: CSVUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const row: any = { rowNumber: index + 2 };
        headers.forEach((header, i) => {
          row[header] = values[i];
        });
        return row;
      }).filter(row => Object.values(row).some(val => val !== ''));

      setPreview(data);
      validateData(data);
    };
    
    reader.readAsText(uploadedFile);
  };

  const validateData = (data: any[]) => {
    const errors: ValidationError[] = [];
    
    data.forEach((row, index) => {
      // Validate required fields
      if (!row.business) {
        errors.push({ row: row.rowNumber, field: 'business', message: 'Business is required' });
      } else if (!['Fish', 'Honey', 'Mushrooms'].includes(row.business)) {
        errors.push({ row: row.rowNumber, field: 'business', message: 'Business must be Fish, Honey, or Mushrooms' });
      }

      if (!row.type) {
        errors.push({ row: row.rowNumber, field: 'type', message: 'Type is required' });
      } else if (!['cash', 'yoco', 'credit'].includes(row.type)) {
        errors.push({ row: row.rowNumber, field: 'type', message: 'Type must be cash, yoco, or credit' });
      }

      if (!row.amount) {
        errors.push({ row: row.rowNumber, field: 'amount', message: 'Amount is required' });
      } else if (isNaN(parseFloat(row.amount)) || parseFloat(row.amount) <= 0) {
        errors.push({ row: row.rowNumber, field: 'amount', message: 'Amount must be a positive number' });
      }

      if (!row.customer || row.customer.length < 2) {
        errors.push({ row: row.rowNumber, field: 'customer', message: 'Customer name must be at least 2 characters' });
      }

      // Validate and normalize date
      if (!row.date) {
        errors.push({ row: row.rowNumber, field: 'date', message: 'Date is required' });
      } else {
        const date = new Date(row.date);
        if (isNaN(date.getTime())) {
          errors.push({ row: row.rowNumber, field: 'date', message: 'Invalid date format' });
        } else if (date > new Date()) {
          errors.push({ row: row.rowNumber, field: 'date', message: 'Date cannot be in the future' });
        }
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
    
    // Simulate processing
    setTimeout(() => {
      toast({
        title: "Import Successful",
        description: `Successfully imported ${preview.length} transactions`,
      });
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Import CSV Transactions</h3>
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

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="csv-file">Upload CSV File</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="flex-1"
          />
          <Upload size={20} className="text-slate-400" />
        </div>
        <p className="text-xs text-slate-600">
          Expected columns: date, business, type, amount, customer
        </p>
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
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Rows:</span> {preview.length}
              </div>
              <div>
                <span className="font-medium">Errors:</span> {validationErrors.length}
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
                  Row {error.row}, {error.field}: {error.message}
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
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Business</th>
                    <th className="text-left py-2 px-2">Type</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-1 px-2">{row.date}</td>
                      <td className="py-1 px-2">{row.business}</td>
                      <td className="py-1 px-2">{row.type}</td>
                      <td className="py-1 px-2">{row.amount}</td>
                      <td className="py-1 px-2">{row.customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 5 && (
                <p className="text-xs text-slate-600 mt-2">
                  Showing first 5 rows of {preview.length} total rows
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
          {isProcessing ? 'Importing...' : 'Import Data'}
        </Button>
      </div>
    </div>
  );
};
