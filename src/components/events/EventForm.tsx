
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
import type { BusinessWithAll } from '@/types/transaction';

interface EventFormProps {
  onClose: () => void;
  defaultBusiness: BusinessWithAll;
  selectedDate?: Date;
}

export const EventForm = ({ onClose, defaultBusiness, selectedDate }: EventFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: selectedDate || new Date(),
    business: defaultBusiness === 'All' ? 'Fish' : defaultBusiness,
    marketCost: '',
    totalRevenue: '',
    notes: '',
    startTime: '',
    endTime: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event data:', formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateProfit = () => {
    const revenue = parseFloat(formData.totalRevenue) || 0;
    const cost = parseFloat(formData.marketCost) || 0;
    return revenue - cost;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add New Event</h2>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Weekend Farmers Market"
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Central Park Market"
              required
            />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="business">Business *</Label>
            <Select
              value={formData.business}
              onValueChange={(value) => handleInputChange('business', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fish">Fish</SelectItem>
                <SelectItem value="Honey">Honey</SelectItem>
                <SelectItem value="Mushrooms">Mushrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="marketCost">Market Cost (R)</Label>
            <Input
              id="marketCost"
              type="number"
              step="0.01"
              value={formData.marketCost}
              onChange={(e) => handleInputChange('marketCost', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="totalRevenue">Total Revenue (R)</Label>
            <Input
              id="totalRevenue"
              type="number"
              step="0.01"
              value={formData.totalRevenue}
              onChange={(e) => handleInputChange('totalRevenue', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        {(formData.marketCost || formData.totalRevenue) && (
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Expected Profit:</span>
              <span className={`font-medium ${calculateProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R{calculateProfit().toFixed(2)}
              </span>
            </div>
            {formData.marketCost && formData.totalRevenue && (
              <div className="text-xs text-slate-500 mt-1">
                Profit Margin: {((calculateProfit() / (parseFloat(formData.totalRevenue) || 1)) * 100).toFixed(1)}%
              </div>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes about the event..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add Event
          </Button>
        </div>
      </form>
    </div>
  );
};
