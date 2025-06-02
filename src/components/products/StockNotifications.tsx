
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, Clock } from 'lucide-react';
import { getProductsByBusiness } from '@/lib/mockData';
import type { Business } from '@/components/AdminDashboard';

interface StockNotificationsProps {
  selectedBusiness: Business;
}

export const StockNotifications = ({ selectedBusiness }: StockNotificationsProps) => {
  const products = getProductsByBusiness(selectedBusiness);
  
  const outOfStockProducts = products.filter(p => p.currentStock === 0);
  const lowStockProducts = products.filter(p => p.currentStock > 0 && p.currentStock <= p.minStockLevel);
  const expiringSoonProducts = products.filter(p => {
    if (!p.expiryDate) return false;
    const expiry = new Date(p.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });

  const criticalAlerts = outOfStockProducts.length + lowStockProducts.length + expiringSoonProducts.length;

  if (criticalAlerts === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-green-500" />
            <span>Stock Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-green-600 font-medium">All stock levels are healthy!</div>
            <p className="text-sm text-slate-500 mt-2">No immediate action required</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Stock Alerts</span>
          </div>
          <Badge variant="destructive">{criticalAlerts}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Out of Stock */}
        {outOfStockProducts.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="font-medium text-red-800 mb-2">Out of Stock ({outOfStockProducts.length})</div>
              <div className="space-y-1">
                {outOfStockProducts.map(product => (
                  <div key={product.id} className="text-sm text-red-700">
                    • {product.name} - {product.supplier}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Low Stock */}
        {lowStockProducts.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <div className="font-medium text-orange-800 mb-2">Low Stock ({lowStockProducts.length})</div>
              <div className="space-y-1">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="text-sm text-orange-700">
                    • {product.name} - {product.currentStock} {product.unit} remaining (Min: {product.minStockLevel})
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Expiring Soon */}
        {expiringSoonProducts.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <div className="font-medium text-yellow-800 mb-2">Expiring Soon ({expiringSoonProducts.length})</div>
              <div className="space-y-1">
                {expiringSoonProducts.map(product => (
                  <div key={product.id} className="text-sm text-yellow-700">
                    • {product.name} - Expires {product.expiryDate}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
