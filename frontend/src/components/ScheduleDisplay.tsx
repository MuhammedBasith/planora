import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import EventCard from './EventCard';
import type { ScheduleEvent } from '@/utils/api';
import { generateICSFile } from '@/utils/calendarGenerator';
import { toast } from 'sonner';

interface ScheduleDisplayProps {
  events: ScheduleEvent[];
  onEventsChange: (events: ScheduleEvent[]) => void;
  onReset: () => void;
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ events, onEventsChange, onReset }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(getTomorrow());
  const [sortedEvents, setSortedEvents] = useState<ScheduleEvent[]>([]);
  
  // Sort events by time whenever they change
  useEffect(() => {
    const sorted = [...events].sort((a, b) => {
      const aTime = a.startTime.split(':').map(Number);
      const bTime = b.startTime.split(':').map(Number);
      
      // Compare hours first
      if (aTime[0] !== bTime[0]) {
        return aTime[0] - bTime[0];
      }
      
      // If hours are equal, compare minutes
      return aTime[1] - bTime[1];
    });
    
    setSortedEvents(sorted);
    
    // Update the original events array if the order has changed
    if (JSON.stringify(sorted) !== JSON.stringify(events)) {
      onEventsChange(sorted);
    }
  }, [events, onEventsChange]);
  
  function getTomorrow(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  const updateEvent = (index: number, updatedEvent: ScheduleEvent) => {
    const newEvents = [...sortedEvents];
    newEvents[index] = updatedEvent;
    onEventsChange(newEvents);
  };

  const deleteEvent = (index: number) => {
    const newEvents = sortedEvents.filter((_, i) => i !== index);
    onEventsChange(newEvents);
  };

  const addNewEvent = () => {
    // Get the next available hour
    let startHour = 9; // Default to 9 AM
    
    if (events.length > 0) {
      // Find the latest end time and add 1 hour
      const latestEvent = events.reduce((latest, current) => {
        const [latestHour] = latest.endTime.split(':').map(Number);
        const [currentHour] = current.endTime.split(':').map(Number);
        return latestHour > currentHour ? latest : current;
      });
      
      startHour = parseInt(latestEvent.endTime.split(':')[0]) + 1;
      if (startHour > 23) startHour = 9; // Reset to 9 AM if past midnight
    }
    
    const endHour = startHour + 1 > 23 ? 23 : startHour + 1;
    
    const newEvent: ScheduleEvent = {
      title: 'New Event',
      startTime: `${startHour.toString().padStart(2, '0')}:00`,
      endTime: `${endHour.toString().padStart(2, '0')}:00`,
      location: '',
      notes: ''
    };
    
    onEventsChange([...events, newEvent]);
  };

  const downloadCalendar = () => {
    // Generate the ICS file with the selected date
    const icsContent = generateICSFile(events, selectedDate);
    
    // Create a Blob from the ICS content
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `schedule-${format(selectedDate, 'yyyy-MM-dd')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Calendar file downloaded successfully!");
  };

  const addToGoogleCalendar = () => {
    if (events.length === 0) {
      toast.error("No events to add.");
      return;
    }
  
    const baseUrl = "https://calendar.google.com/calendar/u/0/r/eventedit";
  
    events.forEach((event) => {
      const eventDate = new Date(selectedDate);
      const startTimeParts = event.startTime.split(":");
      const endTimeParts = event.endTime.split(":");
  
      eventDate.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]));
      const startDateTime = format(eventDate, "yyyyMMdd'T'HHmmss");
  
      eventDate.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));
      const endDateTime = format(eventDate, "yyyyMMdd'T'HHmmss");
  
      const eventUrl =
        `${baseUrl}?text=${encodeURIComponent(event.title)}` +
        `&dates=${startDateTime}/${endDateTime}` +
        (event.location ? `&location=${encodeURIComponent(event.location)}` : "") +
        (event.notes ? `&details=${encodeURIComponent(event.notes)}` : "");
  
      // Open each event in a new tab
      window.open(eventUrl, "_blank");
    });
  
    toast.success(`Added ${events.length} event${events.length > 1 ? "s" : ""} to Google Calendar!`);
  };
  
  

  return (
    <div className="w-full max-w-3xl mx-auto px-3 md:px-4 py-4 md:py-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Your Schedule</h2>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-start text-left text-sm font-normal bg-white/50 dark:bg-black/20 border-2 border-primary/20 input-focus"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1 relative">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-muted-foreground text-sm md:text-base">
              No events yet. Add some events or describe your day.
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 sm:left-6 top-4 bottom-4 w-0.5 bg-primary/20 z-0"></div>
              {sortedEvents.map((event, index) => (
                <EventCard
                  key={index}
                  event={event}
                  onUpdate={(updatedEvent) => updateEvent(index, updatedEvent)}
                  onDelete={() => deleteEvent(index)}
                  selectedDate={selectedDate}
                />
              ))}
            </div>
          )}

          <Button
            variant="outline"
            onClick={addNewEvent}
            className="w-full mt-3 py-4 md:py-6 bg-white/50 dark:bg-black/20 border-2 border-dashed border-primary/30 hover:border-primary/50 flex items-center justify-center transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={downloadCalendar}
            disabled={events.length === 0}
            className="flex-1 shadow-md shadow-primary/20 text-sm"
          >
            Download Calendar (.ics)
          </Button>
          
          <Button
            onClick={onReset}
            variant="ghost"
            className="flex-1 text-sm"
          >
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDisplay;
