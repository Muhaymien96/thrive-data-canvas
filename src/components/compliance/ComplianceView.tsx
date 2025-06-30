
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, FileText, Plus } from 'lucide-react';
import { useComplianceItems } from '@/hooks/useCompliance';
import type { BusinessWithAll } from '@/types/database';

interface ComplianceViewProps {
  selectedBusiness: BusinessWithAll;
}

export const ComplianceView = ({ selectedBusiness }: ComplianceViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const businessId = selectedBusiness === 'All' ? undefined : selectedBusiness.id;
  const { data: complianceItems = [], isLoading, error } = useComplianceItems(businessId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Compliance Management</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading compliance items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Compliance Management</h2>
        </div>
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto text-red-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Compliance Items</h3>
          <p className="text-slate-500">There was an error loading your compliance data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Compliance Management</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Compliance Item</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Compliance items tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {complianceItems.filter(item => item.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {complianceItems.filter(item => item.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items completed this period
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Items</CardTitle>
        </CardHeader>
        <CardContent>
          {complianceItems.length > 0 ? (
            <div className="space-y-4">
              {complianceItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(item.status)}
                    <div>
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-500">{item.description}</div>
                      {item.due_date && (
                        <div className="text-xs text-slate-400 mt-1">
                          Due: {item.due_date}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No compliance items found</h3>
              <p className="text-slate-500 mb-4">
                Start by adding your first compliance item to track important deadlines and requirements.
              </p>
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Add Your First Compliance Item</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
