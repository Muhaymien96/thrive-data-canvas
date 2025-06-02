
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, AlertTriangle } from 'lucide-react';
import type { Product } from '@/lib/mockData';
import type { Business } from '@/components/AdminDashboard';

interface ProductTableProps {
  products: Product[];
  selectedBusiness: Business;
}

export const ProductTable = ({ products }: ProductTableProps) => {
  const getStockStatus = (currentStock: number, minStockLevel: number) => {
    if (currentStock <= minStockLevel) {
      return { status: 'Low Stock', color: 'bg-red-100 text-red-800' };
    } else if (currentStock <= minStockLevel * 1.5) {
      return { status: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'Good Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Product</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Category</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Cost Price</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Selling Price</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Markup</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product.currentStock, product.minStockLevel);
                const expiringSoon = isExpiringSoon(product.expiryDate);
                
                return (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium text-slate-900">{product.name}</div>
                          <div className="text-sm text-slate-500">{product.supplier}</div>
                          {expiringSoon && (
                            <div className="flex items-center text-xs text-orange-600 mt-1">
                              <AlertTriangle size={12} className="mr-1" />
                              Expires {product.expiryDate}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{product.category}</td>
                    <td className="py-3 px-4 text-sm">R{product.costPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm font-medium">R{product.sellingPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="text-green-600 font-medium">
                        {product.markupPercentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {product.currentStock} {product.unit}
                      <div className="text-xs text-slate-500">
                        Min: {product.minStockLevel} {product.unit}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`text-xs ${stockStatus.color}`}>
                        {stockStatus.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Edit size={16} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 px-4 text-center text-slate-500">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
