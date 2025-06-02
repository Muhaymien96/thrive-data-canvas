
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Trash2, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Business } from '@/components/AdminDashboard';

interface ComplianceDocument {
  id: string;
  name: string;
  type: 'license' | 'permit' | 'certificate' | 'insurance' | 'other';
  business: Business;
  uploadDate: Date;
  expiryDate?: Date;
  status: 'valid' | 'expiring' | 'expired';
  size: string;
  fileUrl?: string;
}

interface ComplianceViewProps {
  selectedBusiness: Business;
}

export const ComplianceView = ({ selectedBusiness }: ComplianceViewProps) => {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([
    {
      id: '1',
      name: 'Food Safety Certificate',
      type: 'certificate',
      business: 'Fish',
      uploadDate: new Date('2024-01-15'),
      expiryDate: new Date('2024-12-15'),
      status: 'valid',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Business License',
      type: 'license',
      business: 'Fish',
      uploadDate: new Date('2024-02-01'),
      expiryDate: new Date('2024-07-15'),
      status: 'expiring',
      size: '1.8 MB',
    },
    {
      id: '3',
      name: 'Honey Production Permit',
      type: 'permit',
      business: 'Honey',
      uploadDate: new Date('2024-03-01'),
      expiryDate: new Date('2025-03-01'),
      status: 'valid',
      size: '3.2 MB',
    },
    {
      id: '4',
      name: 'Public Liability Insurance',
      type: 'insurance',
      business: 'Mushrooms',
      uploadDate: new Date('2024-01-01'),
      expiryDate: new Date('2024-06-01'),
      status: 'expired',
      size: '1.1 MB',
    },
  ]);

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const filteredDocuments = documents.filter(doc => 
    selectedBusiness === 'All' || doc.business === selectedBusiness
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(prev => [...prev, ...files]);
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'license': return 'bg-blue-100 text-blue-800';
      case 'permit': return 'bg-purple-100 text-purple-800';
      case 'certificate': return 'bg-green-100 text-green-800';
      case 'insurance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="h-4 w-4" />;
      case 'expiring': return <AlertTriangle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance Documents</h1>
          <p className="text-slate-600">Manage licenses, permits, certificates, and other compliance documents</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="document-upload" className="cursor-pointer">
                  <span className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Upload compliance documents
                  </span>
                  <input
                    id="document-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PDF, DOC, DOCX, JPG, PNG up to 10MB each
              </p>
            </div>
          </div>

          {uploadFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Files to Upload:</h4>
              {uploadFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadFile(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button className="w-full mt-4">
                Upload {uploadFiles.length} Document{uploadFiles.length > 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(doc.status)}
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge className={getTypeColor(doc.type)}>
                        {doc.type}
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{doc.size}</span>
                      <span className="text-sm text-gray-500">
                        Uploaded: {format(doc.uploadDate, 'MMM d, yyyy')}
                      </span>
                      {doc.expiryDate && (
                        <span className="text-sm text-gray-500">
                          Expires: {format(doc.expiryDate, 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteDocument(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No compliance documents found for {selectedBusiness === 'All' ? 'any business' : selectedBusiness}.</p>
                <p className="text-sm">Upload your first document above!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
