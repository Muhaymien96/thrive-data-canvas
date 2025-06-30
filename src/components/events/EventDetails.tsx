
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, X, CheckSquare, Edit3, Trash2 } from 'lucide-react';
import { EventForm } from './EventForm';
import { EventChecklist } from './EventChecklist';
import { useUpdateEvent, useDeleteEvent } from '@/hooks/useEvents';
import { toast } from '@/hooks/use-toast';
import type { Event } from '@/types/database';

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
}

export const EventDetails = ({ event, onClose }: EventDetailsProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'market':
        return 'bg-purple-100 text-purple-800';
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'delivery':
        return 'bg-orange-100 text-orange-800';
      case 'inspection':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleStatusUpdate = async (newStatus: 'upcoming' | 'completed' | 'cancelled') => {
    try {
      await updateEventMutation.mutateAsync({
        id: event.id,
        status: newStatus
      });
      toast({
        title: "Event Updated",
        description: `Event status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await deleteEventMutation.mutateAsync(event.id);
        toast({
          title: "Event Deleted",
          description: "The event has been successfully deleted",
        });
        onClose();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (showEditForm) {
    return (
      <EventForm
        defaultBusiness={event.business_id as any}
        onClose={() => setShowEditForm(false)}
        initialData={event}
      />
    );
  }

  if (showChecklist) {
    return (
      <EventChecklist
        event={event}
        onClose={() => setShowChecklist(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <Badge className={getStatusColor(event.status)}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
              <Badge variant="outline" className={getTypeColor(event.type)}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <Calendar size={20} />
              <div>
                <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                <p className="text-sm">Event Date</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-600">
              <Clock size={20} />
              <div>
                <p className="font-medium text-gray-900">{formatTime(event.time)}</p>
                <p className="text-sm">Event Time</p>
              </div>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start space-x-3 text-gray-600">
              <MapPin size={20} className="mt-1" />
              <div>
                <p className="font-medium text-gray-900">{event.location}</p>
                <p className="text-sm">Location</p>
              </div>
            </div>
          )}

          {event.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              onClick={() => setShowChecklist(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <CheckSquare size={16} />
              <span>Checklist</span>
            </Button>
            
            <Button
              onClick={() => setShowEditForm(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Edit3 size={16} />
              <span>Edit</span>
            </Button>
            
            <Button
              onClick={handleDelete}
              variant="outline"
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </Button>
          </div>

          {event.status !== 'completed' && event.status !== 'cancelled' && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleStatusUpdate('completed')}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={updateEventMutation.isPending}
                >
                  Mark Completed
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('cancelled')}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  disabled={updateEventMutation.isPending}
                >
                  Cancel Event
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
