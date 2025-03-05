
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScheduleEvent } from '@/utils/nlpProcessor';

interface EventCardProps {
  event: ScheduleEvent;
  onUpdate: (updatedEvent: ScheduleEvent) => void;
  onDelete: () => void;
  selectedDate: Date;
}

const EventCard: React.FC<EventCardProps> = ({ event, onUpdate, onDelete, selectedDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({ ...event });
  
  const handleInputChange = (field: keyof ScheduleEvent, value: string) => {
    setEditedEvent(prev => ({ ...prev, [field]: value }));
  };
  
  const saveChanges = () => {
    onUpdate(editedEvent);
    setIsEditing(false);
  };
  
  const startDate = new Date(selectedDate);
  startDate.setHours(
    parseInt(editedEvent.startTime.split(':')[0]),
    parseInt(editedEvent.startTime.split(':')[1])
  );
  
  const endDate = new Date(selectedDate);
  endDate.setHours(
    parseInt(editedEvent.endTime.split(':')[0]),
    parseInt(editedEvent.endTime.split(':')[1])
  );
  
  const formatTimeForDisplay = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Create a date to handle formatting
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    
    return format(date, 'h:mm a');
  };

  return (
    <div className="glass rounded-lg md:rounded-xl p-3 md:p-4 mb-3 animate-scale-in relative group before:absolute before:left-0 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 md:before:w-3 md:before:h-3 before:bg-primary before:rounded-full before:z-10 before:shadow-md border-2 border-primary/20 shadow-lg shadow-primary/5 ml-6 md:ml-8">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedEvent.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-white/80 dark:bg-black/30 border-2 border-primary/20 input-focus"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={editedEvent.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="bg-white/80 dark:bg-black/30 border-2 border-primary/20 input-focus"
              />
            </div>
            
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={editedEvent.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="bg-white/80 dark:bg-black/30 border-2 border-primary/20 input-focus"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={editedEvent.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Add location"
              className="bg-white/80 dark:bg-black/30 border-2 border-primary/20 input-focus"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={editedEvent.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add notes"
              className="bg-white/80 dark:bg-black/30 border-2 border-primary/20 input-focus"
            />
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveChanges}>Save</Button>
          </div>
        </div>
      ) : (
        <>
          <button 
            onClick={onDelete}
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete event"
          >
            <X className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground hover:text-destructive" />
          </button>
          
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium truncate text-sm md:text-base">{event.title}</h3>
          </div>
          
          <div className="flex items-center text-xs md:text-sm text-muted-foreground mb-1">
            <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-primary/70" />
            <div className="mr-auto">
              {formatTimeForDisplay(event.startTime)} - {formatTimeForDisplay(event.endTime)}
            </div>
          </div>
          
          {event.location && (
            <div className="flex items-center text-xs md:text-sm text-muted-foreground mb-1">
              <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-primary/70" />
              {event.location}
            </div>
          )}
          
          {event.notes && (
            <div className="text-xs md:text-sm text-muted-foreground mt-2 border-t border-primary/10 pt-2">
              {event.notes}
            </div>
          )}
          
          <Button
            variant="ghost"
            className="p-0 h-auto mt-2 text-primary text-xs md:text-sm hover:text-primary hover:bg-transparent underline"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </>
      )}
    </div>
  );
};

export default EventCard;
