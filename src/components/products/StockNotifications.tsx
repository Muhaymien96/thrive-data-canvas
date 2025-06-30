
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useSupabaseData';
import { AlertTriangle, Package } from 'lucide-react';
import type { BusinessWithAll } from '@/types/database';

interface StockNotificationsProps {
  selectedBusiness: BusinessWithAll;
}

export const StockNotifications = ({ selectedBusiness }: StockNotificationsProps) => {
  const businessId = selectedBusiness === 'All' ? undefined : (typeof selectedBusiness === 'string' ? selectedBusiness : selectedBusiness.id);
  const { data: products = [] } = useProducts(businessId);
  
  const lowStockProducts = products.filter(p => 
    (p.current_stock || 0) <= (p.min_stock_level || 0)
  );

  const expiringSoonProducts = products.filter(p => {
    if (!p.expiry_date) return false;
    const expiryDate = new Date(p.expiry_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  });

  if (lowStockProducts.length === 0 && expiringSoonProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {lowStockProducts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle size={20} />
              <span>Low Stock Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-red-900">{product.name}</span>
                    <span className="text-sm text-red-700 ml-2">
                      Stock: {product.current_stock || 0} (Min: {product.min_stock_level || 0})
                    </span>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {expiringSoonProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Package size={20} />
              <span>Expiring Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoonProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-yellow-900">{product.name}</span>
                    <span className="text-sm text-yellow-700 ml-2">
                      Expires: {product.expiry_date}
                    </span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Expiring</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
