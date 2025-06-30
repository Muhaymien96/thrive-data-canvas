
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';
import { useEventChecklists, useCreateEventChecklistItem, useUpdateEventChecklistItem, useDeleteEventChecklistItem } from '@/hooks/useEventChecklists';
import type { EventChecklistItem } from '@/hooks/useEventChecklists';

interface EventChecklistProps {
  eventId: string;
  businessId: string;
  isMarketEvent?: boolean;
}

const MARKET_PREPARATION_TEMPLATES = [
  { title: 'Confirm inventory stock levels', priority: 'high' as const, description: 'Check all product quantities before market day' },
  { title: 'Prepare display materials', priority: 'medium' as const, description: 'Banners, signs, and product displays' },
  { title: 'Pack transportation supplies', priority: 'high' as const, description: 'Tables, chairs, cash float, POS system' },
  { title: 'Confirm market stall booking', priority: 'high' as const, description: 'Double-check stall number and payment' },
  { title: 'Weather contingency plan', priority: 'medium' as const, description: 'Prepare for rain/wind protection' },
  { title: 'Staff briefing and scheduling', priority: 'medium' as const, description: 'Ensure all staff know their roles' },
  { title: 'Price labels and signage', priority: 'low' as const, description: 'Clear pricing for all products' },
  { title: 'Cash register and payment setup', priority: 'high' as const, description: 'Card reader, cash float, receipt printer' },
];

export const EventChecklist = ({ eventId, businessId, isMarketEvent = false }: EventChecklistProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newItemDueDate, setNewItemDueDate] = useState('');

  const { data: checklistItems = [], isLoading, error } = useEventChecklists(eventId);
  const createItem = useCreateEventChecklistItem();
  const updateItem = useUpdateEventChecklistItem();
  const deleteItem = useDeleteEventChecklistItem();

  const handleAddItem = async () => {
    if (!newItemTitle.trim()) return;

    try {
      await createItem.mutateAsync({
        event_id: eventId,
        business_id: businessId,
        title: newItemTitle,
        description: newItemDescription || undefined,
        priority: newItemPriority,
        due_date: newItemDueDate || undefined,
        completed: false,
      });

      setNewItemTitle('');
      setNewItemDescription('');
      setNewItemPriority('medium');
      setNewItemDueDate('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating checklist item:', error);
    }
  };

  const handleToggleComplete = async (item: EventChecklistItem) => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        completed: !item.completed,
      });
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem.mutateAsync(itemId);
    } catch (error) {
      console.error('Error deleting checklist item:', error);
    }
  };

  const addMarketPreparationItems = async () => {
    try {
      for (const template of MARKET_PREPARATION_TEMPLATES) {
        await createItem.mutateAsync({
          event_id: eventId,
          business_id: businessId,
          title: template.title,
          description: template.description,
          priority: template.priority,
          completed: false,
        });
      }
    } catch (error) {
      console.error('Error adding market preparation items:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={14} className="text-red-600" />;
      case 'medium':
        return <Clock size={14} className="text-yellow-600" />;
      case 'low':
        return <Circle size={14} className="text-green-600" />;
      default:
        return <Circle size={14} className="text-slate-600" />;
    }
  };

  // Sort items by priority (high -> medium -> low) and then by completion status
  const sortedItems = [...checklistItems].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // If same priority, put incomplete items first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    return 0;
  });

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle size={20} />
            <span>Event Checklist</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading checklist...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle size={20} />
            <span>Event Checklist</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading checklist. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle size={20} />
            <span>Event Checklist</span>
            {totalCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {completedCount}/{totalCount} completed
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isMarketEvent && checklistItems.length === 0 && (
              <Button
                onClick={addMarketPreparationItems}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Add Market Prep
              </Button>
            )}
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Add Item</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showAddForm && (
          <Card className="p-4 bg-slate-50">
            <div className="space-y-3">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Enter task title..."
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="Additional details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newItemPriority} onValueChange={setNewItemPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date (optional)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newItemDueDate}
                    onChange={(e) => setNewItemDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleAddItem}
                  disabled={!newItemTitle.trim() || createItem.isPending}
                  size="sm"
                >
                  {createItem.isPending ? 'Adding...' : 'Add Task'}
                </Button>
                <Button
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {sortedItems.length > 0 ? (
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                }`}
              >
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleComplete(item)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {getPriorityIcon(item.priority)}
                      <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                  {item.description && (
                    <p className={`text-sm ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                      {item.description}
                    </p>
                  )}
                  {item.due_date && (
                    <p className="text-xs text-slate-400 mt-1">
                      Due: {new Date(item.due_date).toLocaleDateString()}
                    </p>
                  )}
                  {item.completed && item.completed_at && (
                    <p className="text-xs text-green-600 mt-1">
                      Completed: {new Date(item.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleDeleteItem(item.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <CheckCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium mb-2">No checklist items yet</p>
            <p className="text-sm">
              {isMarketEvent 
                ? "Add market preparation tasks to stay organized for your event."
                : "Add tasks to keep track of your event preparation."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
