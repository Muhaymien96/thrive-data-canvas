
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface BusinessEntity {
  id: string;
  name: string;
  description: string;
  industry: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  registrationNumber?: string;
  taxNumber?: string;
  vatNumber?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface BusinessFormProps {
  business?: BusinessEntity | null;
  onClose: () => void;
  onSave: (business: BusinessEntity) => void;
}

const industries = [
  'Agriculture',
  'Food & Beverage',
  'Technology',
  'Manufacturing',
  'Retail',
  'Services',
  'Healthcare',
  'Education',
  'Finance',
  'Real Estate',
  'Transportation',
  'Other'
];

export const BusinessForm = ({ business, onClose, onSave }: BusinessFormProps) => {
  const [formData, setFormData] = useState<Partial<BusinessEntity>>({
    name: business?.name || '',
    description: business?.description || '',
    industry: business?.industry || '',
    address: business?.address || '',
    phone: business?.phone || '',
    email: business?.email || '',
    website: business?.website || '',
    registrationNumber: business?.registrationNumber || '',
    taxNumber: business?.taxNumber || '',
    vatNumber: business?.vatNumber || '',
    status: business?.status || 'active',
    createdAt: business?.createdAt || new Date().toISOString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as BusinessEntity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{business ? 'Edit Business' : 'Add New Business'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </div>

            {/* Registration Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Registration Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="registrationNumber">Company Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    placeholder="CK2024/000000/07"
                  />
                </div>
                <div>
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxNumber: e.target.value }))}
                    placeholder="0000000000"
                  />
                </div>
                <div>
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input
                    id="vatNumber"
                    value={formData.vatNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, vatNumber: e.target.value }))}
                    placeholder="4000000000"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Status</h3>
              <div className="w-32">
                <Label htmlFor="status">Business Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {business ? 'Update Business' : 'Add Business'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
