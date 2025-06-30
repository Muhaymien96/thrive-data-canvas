
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStockMovements, mockProducts } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';
import type { BusinessWithAll } from '@/types/transaction';

interface StockMovementsProps {
  selectedBusiness: BusinessWithAll;
}

export const StockMovements = ({ selectedBusiness }: StockMovementsProps) => {
  const movements = getStockMovements(undefined, selectedBusiness);
  
  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'sale':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'adjustment':
        return <Package className="h-4 w-4 text-blue-600" />;
      default:
        return <Package className="h-4 w-4 text-slate-600" />;
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-100 text-green-800';
      case 'sale':
        return 'bg-red-100 text-red-800';
      case 'adjustment':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getProductName = (productId: number) => {
    const product = mockProducts.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Movement History</CardTitle>
      </CardHeader>
      <CardContent>
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
                    {getProductName(movement.productId)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {movement.notes}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Reference: {movement.reference}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge className={`text-xs ${getMovementTypeColor(movement.type)}`}>
                    {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                  </Badge>
                  <span className={`text-sm font-medium ${
                    movement.type === 'purchase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.type === 'purchase' ? '+' : '-'}{movement.quantity}
                  </span>
                </div>
                
                {movement.unitCost && (
                  <div className="text-xs text-slate-500">
                    Cost: R{movement.unitCost}/unit
                  </div>
                )}
                
                {movement.unitPrice && (
                  <div className="text-xs text-slate-500">
                    Price: R{movement.unitPrice}/unit
                  </div>
                )}
                
                <div className="text-xs text-slate-400 mt-1">
                  {movement.date}
                </div>
              </div>
            </div>
          ))}
          
          {movements.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No stock movements found for this business.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
