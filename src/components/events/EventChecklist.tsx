
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface EventChecklistProps {
  eventId: number;
}

export const EventChecklist = ({ eventId }: EventChecklistProps) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', task: 'Prepare inventory for transport', completed: false, priority: 'high' },
    { id: '2', task: 'Check market permit/license', completed: true, priority: 'high' },
    { id: '3', task: 'Pack display materials', completed: false, priority: 'medium' },
    { id: '4', task: 'Prepare cash float', completed: false, priority: 'medium' },
    { id: '5', task: 'Load vehicle with products', completed: false, priority: 'high' },
    { id: '6', task: 'Print price labels', completed: false, priority: 'low' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const addTask = () => {
    if (newTask.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        task: newTask.trim(),
        completed: false,
        priority: newPriority,
      };
      setChecklist([...checklist, newItem]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteTask = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const completedTasks = checklist.filter(item => item.completed).length;
  const totalTasks = checklist.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Event Checklist</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">
              {completedTasks}/{totalTasks} completed
            </span>
            <div className="w-20 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new task */}
        <div className="flex space-x-2">
          <Input
            placeholder="Add new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1"
          />
          <select 
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <Button onClick={addTask} size="sm">
            <Plus size={16} />
          </Button>
        </div>

        {/* Checklist items */}
        <div className="space-y-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-3 border rounded-lg ${
                item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleTask(item.id)}
              />
              <div className="flex-1">
                <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.task}
                </span>
              </div>
              <Badge className={getPriorityColor(item.priority)}>
                {item.priority}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>

        {checklist.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No tasks yet. Add your first task above!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
