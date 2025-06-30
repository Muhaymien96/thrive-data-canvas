
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductForm } from './ProductForm';
import { ProductTable } from './ProductTable';
import { StockMovements } from './StockMovements';
import { InvoiceGenerator } from './InvoiceGenerator';
import { StockNotifications } from './StockNotifications';
import { useProducts } from '@/hooks/useProducts';
import { Plus, Package, TrendingUp, FileText } from 'lucide-react';
import type { BusinessWithAll } from '@/types/database';

interface ProductsViewProps {
  selectedBusiness: BusinessWithAll;
}

export const ProductsView = ({ selectedBusiness }: ProductsViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'stock' | 'invoices'>('products');
  
  const businessId = selectedBusiness === 'All' ? undefined : (typeof selectedBusiness === 'string' ? selectedBusiness : selectedBusiness.id);
  const { data: products = [], isLoading, error } = useProducts(businessId);
  
  const lowStockProducts = products.filter(p => 
    (p.current_stock || 0) <= (p.min_stock_level || 0)
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Product Management</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading products. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Product Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
          disabled={!businessId}
        >
          <Plus size={16} />
          <span>Add Product</span>
        </Button>
      </div>

      <StockNotifications selectedBusiness={selectedBusiness} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Active products in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Products below minimum level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Markup</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.length > 0 
                ? (products.reduce((sum, p) => sum + (p.markup_percentage || 0), 0) / products.length).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average markup percentage
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'stock'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Stock Movements
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'invoices'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Invoices
        </button>
      </div>

      {activeTab === 'products' && (
        <ProductTable 
          products={products} 
          selectedBusiness={selectedBusiness}
        />
      )}
      
      {activeTab === 'stock' && (
        <StockMovements selectedBusiness={selectedBusiness} />
      )}
      
      {activeTab === 'invoices' && (
        <InvoiceGenerator selectedBusiness={selectedBusiness} />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ProductForm 
              onClose={() => setShowForm(false)} 
              defaultBusiness={businessId}
            />
          </div>
        </div>
      )}
    </div>
  );
};
