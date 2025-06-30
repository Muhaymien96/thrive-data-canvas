
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Package, Activity, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BusinessWithAll } from '@/types/database';

interface StockMovementsProps {
  selectedBusiness: BusinessWithAll;
}

interface StockMovementWithProduct {
  id: string;
  product_id: string;
  business_id: string;
  type: string;
  quantity: number;
  reason: string;
  reference: string | null;
  date: string;
  created_at: string;
  products: {
    name: string;
    sku: string | null;
    current_stock: number | null;
  } | null;
}

export const StockMovements = ({ selectedBusiness }: StockMovementsProps) => {
  const businessId = selectedBusiness === 'All' ? undefined : selectedBusiness.id;
  
  const { data: movements = [], isLoading, error } = useQuery({
    queryKey: ['stock-movements', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('stock_movements')
        .select(`
          *,
          products!inner(
            name,
            sku,
            current_stock,
            businesses!inner(owner_id)
          )
        `)
        .eq('products.businesses.owner_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching stock movements:', error);
        throw error;
      }
      
      return data as StockMovementWithProduct[];
    },
  });
  
  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'out':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'adjustment':
        return <Package className="h-4 w-4 text-blue-600" />;
      default:
        return <Package className="h-4 w-4 text-slate-600" />;
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'bg-green-100 text-green-800';
      case 'out':
        return 'bg-red-100 text-red-800';
      case 'adjustment':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity size={20} />
            <span>Stock Movement History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading stock movements...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity size={20} />
            <span>Stock Movement History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto text-red-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Stock Movements</h3>
            <p className="text-slate-500">There was an error loading your stock movement data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity size={20} />
          <span>Stock Movement History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {movements.length > 0 ? (
          <div className="space-y-4">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <div className="flex items-center space-x-4">
                  {getMovementIcon(movement.type)}
                  <div>
                    <div className="font-medium text-slate-900">
                      {movement.products?.name || 'Unknown Product'}
                    </div>
                    {movement.products?.sku && (
                      <div className="text-sm text-slate-400">
                        SKU: {movement.products.sku}
                      </div>
                    )}
                    <div className="text-sm text-slate-500">
                      {movement.reason}
                    </div>
                    {movement.reference && (
                      <div className="text-xs text-slate-400 mt-1">
                        {movement.reference}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={`text-xs ${getMovementTypeColor(movement.type)}`}>
                      {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                    </Badge>
                    <span className={`text-sm font-medium ${
                      movement.type === 'in' ? 'text-green-600' : 
                      movement.type === 'out' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                      {movement.quantity}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-400">
                    {formatDate(movement.date)}
                  </div>
                  
                  {movement.products?.current_stock !== null && (
                    <div className="text-xs text-slate-500 mt-1">
                      Stock: {movement.products.current_stock}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No stock movements found</h3>
            <p className="text-slate-500">
              Stock movements will appear here when you start tracking inventory changes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
