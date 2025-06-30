
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useEventChecklists, useCreateEventChecklistItem, useUpdateEventChecklistItem, useDeleteEventChecklistItem } from '@/hooks/useEventChecklists';
import { toast } from '@/hooks/use-toast';
import type { Event } from '@/types/database';

interface EventChecklistProps {
  event: Event;
  onClose: () => void;
}

const marketPreparationTemplates = [
  { title: 'Setup market stall/display area', priority: 'high' as const, description: 'Arrange tables, chairs, and display materials' },
  { title: 'Prepare product inventory', priority: 'high' as const, description: 'Count and organize products to bring' },
  { title: 'Check weather forecast', priority: 'medium' as const, description: 'Plan for weather conditions and bring appropriate gear' },
  { title: 'Prepare change float', priority: 'high' as const, description: 'Ensure adequate cash for making change' },
  { title: 'Load transport vehicle', priority: 'medium' as const, description: 'Pack products and equipment efficiently' },
  { title: 'Bring payment processing equipment', priority: 'high' as const, description: 'Card reader, receipt printer, etc.' },
  { title: 'Pack marketing materials', priority: 'low' as const, description: 'Business cards, flyers, banners' },
  { title: 'Prepare product price lists', priority: 'medium' as const, description: 'Clear pricing information for customers' }
];

export const EventChecklist = ({ event, onClose }: EventChecklistProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });

  const { data: checklistItems = [], isLoading } = useEventChecklists(event.id);
  const createItemMutation = useCreateEventChecklistItem();
  const updateItemMutation = useUpdateEventChecklistItem();
  const deleteItemMutation = useDeleteEventChecklistItem();

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the checklist item",
        variant: "destructive",
      });
      return;
    }

    try {
      await createItemMutation.mutateAsync({
        event_id: event.id,
        business_id: event.business_id,
        title: newItem.title.trim(),
        description: newItem.description.trim() || undefined,
        priority: newItem.priority,
        completed: false,
        due_date: newItem.due_date || undefined
      });

      setNewItem({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating checklist item:', error);
    }
  };

  const handleToggleComplete = async (itemId: string, completed: boolean) => {
    try {
      await updateItemMutation.mutateAsync({
        id: itemId,
        completed: completed
      });
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this checklist item?')) {
      try {
        await deleteItemMutation.mutateAsync(itemId);
      } catch (error) {
        console.error('Error deleting checklist item:', error);
      }
    }
  };

  const addTemplateItems = async () => {
    try {
      for (const template of marketPreparationTemplates) {
        await createItemMutation.mutateAsync({
          event_id: event.id,
          business_id: event.business_id,
          title: template.title,
          description: template.description,
          priority: template.priority,
          completed: false
        });
      }
      toast({
        title: "Template Added",
        description: "Market preparation checklist has been added to your event",
      });
    } catch (error) {
      console.error('Error adding template items:', error);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={14} className="text-red-500" />;
      case 'medium':
        return <Clock size={14} className="text-yellow-500" />;
      case 'low':
        return <CheckCircle2 size={14} className="text-green-500" />;
      default:
        return <Clock size={14} className="text-gray-500" />;
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
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort items by priority (high, medium, low) then by creation date
  const sortedItems = [...checklistItems].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }
    
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading checklist...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Event Checklist</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{event.title}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Template Addition */}
          {checklistItems.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No checklist items yet</h3>
              <p className="text-gray-600 mb-4">Get started quickly with our market preparation template</p>
              <Button onClick={addTemplateItems} className="mb-2">
                Add Market Preparation Template
              </Button>
              <p className="text-sm text-gray-500">or create your own custom items below</p>
            </div>
          )}

          {/* Add New Item Form */}
          {showAddForm && (
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-4">
                <form onSubmit={handleCreateItem} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Additional details about this task..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={newItem.priority} 
                        onValueChange={(value: 'high' | 'medium' | 'low') => 
                          setNewItem(prev => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="due_date">Due Date</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={newItem.due_date}
                        onChange={(e) => setNewItem(prev => ({ ...prev, due_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createItemMutation.isPending}>
                      {createItemMutation.isPending ? 'Adding...' : 'Add Item'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Add New Item Button */}
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add New Checklist Item
            </Button>
          )}

          {/* Checklist Items */}
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <Card key={item.id} className={`${item.completed ? 'opacity-75' : ''}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) => 
                        handleToggleComplete(item.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={`text-xs ${getPriorityColor(item.priority)}`}>
                            <div className="flex items-center space-x-1">
                              {getPriorityIcon(item.priority)}
                              <span className="capitalize">{item.priority}</span>
                            </div>
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      {item.description && (
                        <p className={`text-sm text-gray-600 mb-2 ${item.completed ? 'line-through' : ''}`}>
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        {item.due_date && (
                          <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>
                        )}
                        {item.completed_at && (
                          <span>Completed: {new Date(item.completed_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          {checklistItems.length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {checklistItems.filter(item => item.completed).length} of {checklistItems.length} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(checklistItems.filter(item => item.completed).length / checklistItems.length) * 100}%`
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
