
import { ScheduleEvent } from './nlpProcessor';
import { format } from 'date-fns';

// Generate an ICS file from events
export const generateICSFile = (events: ScheduleEvent[], selectedDate: Date): string => {
  // ICS file format: https://tools.ietf.org/html/rfc5545
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Natural Day Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ].join('\r\n');

  // Add each event to the calendar
  events.forEach(event => {
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    
    // Parse the time strings and set the hours and minutes
    const [startHours, startMinutes] = event.startTime.split(':').map(Number);
    const [endHours, endMinutes] = event.endTime.split(':').map(Number);
    
    startDate.setHours(startHours, startMinutes, 0, 0);
    endDate.setHours(endHours, endMinutes, 0, 0);
    
    // Format the dates to ICS format: YYYYMMDDTHHMMSSZ
    const startDateFormatted = format(startDate, "yyyyMMdd'T'HHmmss");
    const endDateFormatted = format(endDate, "yyyyMMdd'T'HHmmss");
    
    // Create a unique identifier for the event
    const uid = `${Date.now()}-${Math.floor(Math.random() * 1000000)}@naturaldayplanner.app`;
    
    // Add the event to the ICS content
    icsContent += '\r\n' + [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}`,
      `DTSTART:${startDateFormatted}`,
      `DTEND:${endDateFormatted}`,
      `SUMMARY:${event.title}`,
      event.location ? `LOCATION:${event.location}` : '',
      event.notes ? `DESCRIPTION:${event.notes}` : '',
      'END:VEVENT'
    ].filter(Boolean).join('\r\n');
  });

  // Close the calendar
  icsContent += '\r\nEND:VCALENDAR';
  
  return icsContent;
};

// Generate Google Calendar URL
export const generateGoogleCalendarUrl = (event: ScheduleEvent, selectedDate: Date): string => {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  
  const startDate = new Date(selectedDate);
  const endDate = new Date(selectedDate);
  
  const [startHours, startMinutes] = event.startTime.split(':').map(Number);
  const [endHours, endMinutes] = event.endTime.split(':').map(Number);
  
  startDate.setHours(startHours, startMinutes, 0, 0);
  endDate.setHours(endHours, endMinutes, 0, 0);
  
  const startDateFormatted = format(startDate, "yyyyMMdd'T'HHmmss");
  const endDateFormatted = format(endDate, "yyyyMMdd'T'HHmmss");
  
  let url = `${baseUrl}&text=${encodeURIComponent(event.title)}&dates=${startDateFormatted}/${endDateFormatted}`;
  
  if (event.location) {
    url += `&location=${encodeURIComponent(event.location)}`;
  }
  
  if (event.notes) {
    url += `&details=${encodeURIComponent(event.notes)}`;
  }
  
  return url;
};

// Generate Apple Calendar URL (webcal)
export const generateAppleCalendarUrl = (events: ScheduleEvent[], selectedDate: Date): string => {
  // Generate ICS content
  const icsContent = generateICSFile(events, selectedDate);
  
  // In a real app, this would upload the ICS file to a server and return the webcal:// URL
  // For this demo, we'll return a dummy URL
  return `webcal://example.com/calendar.ics`;
};
