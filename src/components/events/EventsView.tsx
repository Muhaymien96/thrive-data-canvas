
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { EventForm } from './EventForm';
import { EventDetails } from './EventDetails';
import { getEventsByBusiness } from '@/lib/mockData';
import { Plus, Calendar as CalendarIcon, TrendingUp, DollarSign } from 'lucide-react';
import type { Business } from '@/components/AdminDashboard';
import { format, isSameDay } from 'date-fns';

interface EventsViewProps {
  selectedBusiness: Business;
}

export const EventsView = ({ selectedBusiness }: EventsViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const events = getEventsByBusiness(selectedBusiness);
  const todayEvents = events.filter(event => 
    isSameDay(new Date(event.date), new Date())
  );
  
  const totalRevenue = events.reduce((sum, event) => sum + event.totalRevenue, 0);
  const totalCosts = events.reduce((sum, event) => sum + event.marketCost, 0);
  const profit = totalRevenue - totalCosts;

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length === 1) {
        setSelectedEvent(dayEvents[0]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Event Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Event</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              Markets attended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From all events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalCosts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total market fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R{profit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue minus costs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              modifiers={{
                hasEvent: (date) => getEventsForDate(date).length > 0
              }}
              modifiersStyles={{
                hasEvent: { 
                  backgroundColor: '#3b82f6', 
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="mt-4">
              <h3 className="font-medium mb-2">
                Events on {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              {getEventsForDate(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="p-2 border rounded cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="font-medium">{event.name}</div>
                  <div className="text-sm text-slate-500">{event.location}</div>
                  <div className="text-sm text-green-600">R{event.totalRevenue}</div>
                </div>
              ))}
              {getEventsForDate(selectedDate).length === 0 && (
                <p className="text-slate-500 text-sm">No events scheduled</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Details or Today's Events */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedEvent ? 'Event Details' : "Today's Events"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvent ? (
              <EventDetails 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)}
              />
            ) : (
              <div className="space-y-4">
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border rounded cursor-pointer hover:bg-slate-50"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="font-medium">{event.name}</div>
                    <div className="text-sm text-slate-500">{event.location}</div>
                    <div className="text-sm text-green-600">Revenue: R{event.totalRevenue}</div>
                    <div className="text-sm text-red-600">Cost: R{event.marketCost}</div>
                  </div>
                ))}
                {todayEvents.length === 0 && (
                  <p className="text-slate-500">No events scheduled for today</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <EventForm 
              onClose={() => setShowForm(false)} 
              defaultBusiness={selectedBusiness}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};
