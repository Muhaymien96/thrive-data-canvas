
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EventChecklistItem {
  id: string;
  event_id: string;
  business_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completed_at?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export const useEventChecklists = (eventId: string) => {
  return useQuery({
    queryKey: ['event-checklists', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_checklists')
        .select('*')
        .eq('event_id', eventId)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching event checklists:', error);
        throw error;
      }
      
      return data as EventChecklistItem[];
    },
    enabled: !!eventId,
  });
};

export const useCreateEventChecklistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemData: Omit<EventChecklistItem, 'id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
      const { data, error } = await supabase
        .from('event_checklists')
        .insert([itemData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating checklist item:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event-checklists', data.event_id] });
      toast({
        title: "Checklist Item Added",
        description: "New checklist item has been created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating checklist item:', error);
      toast({
        title: "Error",
        description: "Failed to create checklist item. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEventChecklistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<EventChecklistItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('event_checklists')
        .update({
          ...updateData,
          completed_at: updateData.completed ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating checklist item:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event-checklists', data.event_id] });
      toast({
        title: "Checklist Updated",
        description: "Checklist item has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating checklist item:', error);
      toast({
        title: "Error",
        description: "Failed to update checklist item. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteEventChecklistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('event_checklists')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting checklist item:', error);
        throw error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-checklists'] });
      toast({
        title: "Item Deleted",
        description: "Checklist item has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting checklist item:', error);
      toast({
        title: "Error",
        description: "Failed to delete checklist item. Please try again.",
        variant: "destructive",
      });
    },
  });
};
