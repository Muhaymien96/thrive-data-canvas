import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventForm } from './EventForm';
import { EventDetails } from './EventDetails';
import { EventChecklist } from './EventChecklist';
import { useEvents } from '@/hooks/useEvents';
import { Plus, Calendar, Clock, MapPin, CheckSquare, Eye } from 'lucide-react';
import type { BusinessWithAll, Event } from '@/types/database';

interface EventsViewProps {
  selectedBusiness: BusinessWithAll;
}

export const EventsView = ({ selectedBusiness }: EventsViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  
  const businessId = selectedBusiness === 'All' ? undefined : (typeof selectedBusiness === 'string' ? selectedBusiness : selectedBusiness.id);
  const { data: events = [], isLoading, error } = useEvents(businessId);

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const completedEvents = events.filter(event => event.status === 'completed');
  const todayEvents = events.filter(event => {
    const today = new Date().toISOString().split('T')[0];
    return event.date === today && event.status === 'upcoming';
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'short',
      month: 'short',
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

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const handleShowChecklist = (event: Event) => {
    setSelectedEvent(event);
    setShowChecklist(true);
  };

  if (selectedBusiness === 'All') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Events & Calendar</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-slate-500">
              Please select a specific business to manage events.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Events & Calendar</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading events. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Events & Calendar</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Event</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Events scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Future events planned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Events completed
            </p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <EventForm 
              defaultBusiness={businessId! as any}
              onClose={() => setShowForm(false)} 
              onSave={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showDetails && selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => {
            setShowDetails(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {showChecklist && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <EventChecklist
              event={selectedEvent}
              onClose={() => {
                setShowChecklist(false);
                setSelectedEvent(null);
              }}
            />
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar size={20} />
            <span>All Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-slate-600">Loading events...</span>
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs text-blue-500 uppercase">
                        {new Date(event.date).toLocaleDateString('en-ZA', { month: 'short' })}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{event.title}</div>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Clock size={12} />
                        <span>{formatTime(event.time)}</span>
                        {event.location && (
                          <>
                            <MapPin size={12} />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                          {event.status}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(event.type)}`}>
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {event.type === 'market' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShowChecklist(event)}
                        className="flex items-center space-x-1"
                      >
                        <CheckSquare size={12} />
                        <span>Checklist</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewEvent(event)}
                      className="flex items-center space-x-1"
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No events found</h3>
              <p className="text-slate-500 mb-4">
                Create your first event to start organizing your business activities.
              </p>
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Create Your First Event</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
