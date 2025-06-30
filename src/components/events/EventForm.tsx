
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateEvent, useUpdateEvent } from '@/hooks/useEvents';
import { useBusinessData } from '@/hooks/useBusinessData';
import { toast } from '@/hooks/use-toast';
import type { BusinessWithAll, Event } from '@/types/database';

interface EventFormProps {
  onClose: () => void;
  defaultBusiness: BusinessWithAll;
  selectedDate?: Date;
  initialData?: Event;
}

export const EventForm = ({ onClose, defaultBusiness, selectedDate, initialData }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    location: initialData?.location || '',
    date: initialData ? new Date(initialData.date) : (selectedDate || new Date()),
    business_id: initialData?.business_id || (defaultBusiness === 'All' ? '' : (typeof defaultBusiness === 'string' ? defaultBusiness : defaultBusiness.id)),
    description: initialData?.description || '',
    startTime: initialData?.time || '',
    endTime: '',
    type: (initialData?.type as any) || 'meeting' as const,
    status: (initialData?.status as any) || 'upcoming' as const
  });

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const { businesses, isLoading: businessesLoading } = useBusinessData();

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_id) {
      toast({
        title: "Validation Error",
        description: "Please select a business for this event.",
        variant: "destructive",
      });
      return;
    }

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: format(formData.date, 'yyyy-MM-dd'),
        time: formData.startTime || '09:00',
        location: formData.location,
        type: formData.type,
        status: formData.status,
        business_id: formData.business_id
      };

      if (isEditing && initialData) {
        await updateEvent.mutateAsync({
          id: initialData.id,
          ...eventData
        });
      } else {
        await createEvent.mutateAsync(eventData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} event. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {isEditing ? 'Edit Event' : 'Add New Event'}
        </h2>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Weekly Team Meeting"
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Conference Room A"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="business">Business *</Label>
            <Select
              value={formData.business_id}
              onValueChange={(value) => handleInputChange('business_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a business" />
              </SelectTrigger>
              <SelectContent>
                {businessesLoading ? (
                  <SelectItem value="loading" disabled>Loading businesses...</SelectItem>
                ) : businesses.length > 0 ? (
                  businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No businesses found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="market">Market Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && handleInputChange('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Event details and agenda..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={createEvent.isPending || updateEvent.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createEvent.isPending || updateEvent.isPending}
          >
            {createEvent.isPending || updateEvent.isPending 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Event' : 'Add Event')
            }
          </Button>
        </div>
      </form>
    </div>
  );
};
