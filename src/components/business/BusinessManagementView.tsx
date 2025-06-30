
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { BusinessForm } from './BusinessForm';
import type { BusinessWithAll } from '@/types/transaction';

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

interface BusinessManagementViewProps {
  selectedBusiness: BusinessWithAll;
}

const mockBusinesses: BusinessEntity[] = [
  {
    id: '1',
    name: 'Fish Business',
    description: 'Fresh seafood supply and distribution',
    industry: 'Food & Beverage',
    address: '123 Harbor View, Cape Town',
    phone: '+27 21 555 0101',
    email: 'info@fishbusiness.co.za',
    website: 'www.fishbusiness.co.za',
    registrationNumber: 'CK2024/001234/07',
    taxNumber: '9876543210',
    vatNumber: '4567890123',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Honey Business',
    description: 'Premium organic honey production',
    industry: 'Agriculture',
    address: '456 Farm Road, Stellenbosch',
    phone: '+27 21 555 0202',
    email: 'contact@honeybusiness.co.za',
    website: 'www.honeybusiness.co.za',
    registrationNumber: 'CK2024/005678/07',
    taxNumber: '1234567890',
    vatNumber: '7890123456',
    status: 'active',
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    name: 'Mushrooms Business',
    description: 'Gourmet mushroom cultivation and sales',
    industry: 'Agriculture',
    address: '789 Green Valley, Paarl',
    phone: '+27 21 555 0303',
    email: 'hello@mushroomsbusiness.co.za',
    registrationNumber: 'CK2024/009012/07',
    taxNumber: '5678901234',
    status: 'active',
    createdAt: '2024-03-01'
  }
];

export const BusinessManagementView = ({ selectedBusiness }: BusinessManagementViewProps) => {
  const [businesses, setBusinesses] = useState<BusinessEntity[]>(mockBusinesses);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBusinessEntity, setSelectedBusinessEntity] = useState<BusinessEntity | null>(null);

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.industry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const activeBusinesses = filteredBusinesses.filter(b => b.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Business Management</h2>
          <p className="text-slate-600">Manage all your business entities and their information</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={16} className="mr-2" />
          Add Business
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBusinesses.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered business entities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              Currently operating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industries</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...new Set(filteredBusinesses.map(b => b.industry))].length}
            </div>
            <p className="text-xs text-muted-foreground">
              Different sectors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Business List */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="border border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    <Badge variant={business.status === 'active' ? 'default' : 'secondary'}>
                      {business.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{business.description}</p>
                  <p className="text-xs text-slate-500 font-medium">{business.industry}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <MapPin size={14} />
                      <span className="truncate">{business.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Phone size={14} />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Mail size={14} />
                      <span className="truncate">{business.email}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Created: {new Date(business.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBusinessEntity(business);
                          setShowAddForm(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <BusinessForm
          business={selectedBusinessEntity}
          onClose={() => {
            setShowAddForm(false);
            setSelectedBusinessEntity(null);
          }}
          onSave={(business) => {
            if (selectedBusinessEntity) {
              setBusinesses(prev => prev.map(b => b.id === business.id ? business : b));
            } else {
              setBusinesses(prev => [...prev, { ...business, id: Date.now().toString() }]);
            }
            setShowAddForm(false);
            setSelectedBusinessEntity(null);
          }}
        />
      )}
    </div>
  );
};
