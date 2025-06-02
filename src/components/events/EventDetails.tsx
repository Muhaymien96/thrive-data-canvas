
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, ClockIcon, DollarSignIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: number;
  name: string;
  location: string;
  date: string;
  business: string;
  marketCost: number;
  totalRevenue: number;
  notes?: string;
  startTime?: string;
  endTime?: string;
}

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
}

export const EventDetails = ({ event, onClose }: EventDetailsProps) => {
  const profit = event.totalRevenue - event.marketCost;
  const profitMargin = event.totalRevenue > 0 ? ((profit / event.totalRevenue) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{event.name}</h3>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <MapPinIcon className="h-4 w-4 text-slate-500" />
          <span>{event.location}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-slate-500" />
          <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
        </div>

        {(event.startTime || event.endTime) && (
          <div className="flex items-center space-x-2 text-sm">
            <ClockIcon className="h-4 w-4 text-slate-500" />
            <span>
              {event.startTime && event.endTime 
                ? `${event.startTime} - ${event.endTime}`
                : event.startTime || event.endTime}
            </span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Badge variant="outline">{event.business}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Market Cost:</span>
            <span className="font-medium text-red-600">R{event.marketCost.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Total Revenue:</span>
            <span className="font-medium text-green-600">R{event.totalRevenue.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-medium">Net Profit:</span>
            <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R{profit.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Profit Margin:</span>
            <span className={`text-sm ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {event.notes && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Notes:</h4>
          <p className="text-sm text-slate-600">{event.notes}</p>
        </div>
      )}
    </div>
  );
};
