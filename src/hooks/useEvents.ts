
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Event } from '@/types/database';

export const useEvents = (businessId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['events', businessId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, businessId]);

  return useQuery({
    queryKey: ['events', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('events')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .order('date', { ascending: true });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      return data as Event[];
    },
    enabled: true,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event Added",
        description: `Successfully added event ${data.title}`,
      });
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      });
    },
  });
};
