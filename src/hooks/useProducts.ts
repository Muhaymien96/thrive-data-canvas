
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ProductWithSupplier, ProductInsert, ProductVariantData } from '@/types/database';

export const useProducts = (businessId?: string) => {
  return useQuery({
    queryKey: ['products', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('products')
        .select(`
          *,
          supplier:suppliers(*),
          variants:products!parent_product_id(*,
            supplier:suppliers(*)
          ),
          parent_product:products!parent_product_id(*)
        `)
        .order('name', { ascending: true });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      // Transform the data to ensure proper typing
      const transformedData = data?.map(product => ({
        ...product,
        variants: Array.isArray(product.variants) ? product.variants : [],
        supplier: product.supplier || null,
        parent_product: product.parent_product || null
      })) || [];
      
      return transformedData as ProductWithSupplier[];
    },
    enabled: true,
  });
};

export const useParentProducts = (businessId?: string) => {
  return useQuery({
    queryKey: ['parent-products', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('products')
        .select('id, name')
        .is('parent_product_id', null)
        .eq('is_bulk_item', false)
        .order('name', { ascending: true });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching parent products:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!businessId && businessId !== 'All',
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: ProductInsert & { supplier_id: string } & ProductVariantData) => {
      // Remove the type field as it doesn't exist in the database
      const { type, ...dataWithoutType } = productData as any;
      
      const { data, error } = await supabase
        .from('products')
        .insert([dataWithoutType])
        .select(`
          *,
          supplier:suppliers(*)
        `)
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['parent-products'] });
      toast({
        title: "Product Added",
        description: `Successfully added product ${data.name}`,
      });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...productData }: Partial<ProductWithSupplier> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select(`
          *,
          supplier:suppliers(*)
        `)
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['parent-products'] });
      toast({
        title: "Product Updated",
        description: `Successfully updated product ${data.name}`,
      });
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });
};
