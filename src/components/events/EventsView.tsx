
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventForm } from './EventForm';
import { Plus, Calendar, Clock, MapPin } from 'lucide-react';
import type { BusinessWithAll, Event } from '@/types/database';

interface EventsViewProps {
  selectedBusiness: BusinessWithAll;
}

export const EventsView = ({ selectedBusiness }: EventsViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const events: Event[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Events & Schedule</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Event</span>
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <EventForm onClose={() => setShowForm(false)} defaultBusiness={selectedBusiness} />
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar size={20} />
            <span>Upcoming Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-slate-900">{event.title}</h3>
                      <p className="text-sm text-slate-500">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin size={12} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No events scheduled</h3>
              <p className="text-slate-500 mb-4">
                Start by adding your first event to keep track of important dates and meetings.
              </p>
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Add Your First Event</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
