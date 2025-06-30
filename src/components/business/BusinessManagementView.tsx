
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { BusinessForm } from './BusinessForm';
import { useBusinesses } from '@/hooks/useSupabaseData';
import type { BusinessWithAll, Business } from '@/types/database';

interface BusinessManagementViewProps {
  selectedBusiness: BusinessWithAll;
}

export const BusinessManagementView = ({ selectedBusiness }: BusinessManagementViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBusinessEntity, setSelectedBusinessEntity] = useState<Business | null>(null);

  const { data: businesses = [], isLoading, error } = useBusinesses();

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const activeBusinesses = filteredBusinesses.length;

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Business Management</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading businesses. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {[...new Set(filteredBusinesses.map(b => b.type))].length}
            </div>
            <p className="text-xs text-muted-foreground">
              Different sectors
            </p>
          </CardContent>
        </Card>
      </div>

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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-slate-600">Loading businesses...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBusinesses.map((business) => (
                <Card key={business.id} className="border border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <Badge variant="default">
                        active
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{business.description}</p>
                    <p className="text-xs text-slate-500 font-medium">{business.type}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        Created: {new Date(business.created_at).toLocaleDateString()}
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
          )}
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
            setShowAddForm(false);
            setSelectedBusinessEntity(null);
          }}
        />
      )}
    </div>
  );
};
