
// This is a simplified version that mimics NLP processing
// In a real app, this would call an API like OpenAI/GPT

export interface ScheduleEvent {
  title: string;
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string; // Format: "HH:MM" (24-hour)
  location?: string;
  notes?: string;
}

// Sample data for demonstration
const mockEvents: ScheduleEvent[] = [
  {
    title: "Morning Gym",
    startTime: "07:00",
    endTime: "08:00",
    location: "Fitness Center",
    notes: "Remember to bring water bottle"
  },
  {
    title: "Coffee with Sarah",
    startTime: "10:00",
    endTime: "11:00",
    location: "Starbucks Downtown",
    notes: "Discuss project timeline"
  },
  {
    title: "Work on Project",
    startTime: "11:30",
    endTime: "13:00",
    notes: "Focus on UI components"
  },
  {
    title: "Lunch Break",
    startTime: "13:00",
    endTime: "14:00",
    location: "Deli on 5th"
  },
  {
    title: "Evening Walk",
    startTime: "18:00",
    endTime: "18:30",
    location: "Central Park"
  }
];

// Common time expressions for basic NLP parsing
const timeExpressions: Record<string, string> = {
  "7 am": "07:00",
  "7am": "07:00",
  "8 am": "08:00",
  "8am": "08:00",
  "9 am": "09:00",
  "9am": "09:00",
  "10 am": "10:00",
  "10am": "10:00",
  "11 am": "11:00",
  "11am": "11:00",
  "12 pm": "12:00", 
  "12pm": "12:00",
  "1 pm": "13:00",
  "1pm": "13:00",
  "2 pm": "14:00",
  "2pm": "14:00",
  "3 pm": "15:00",
  "3pm": "15:00",
  "4 pm": "16:00",
  "4pm": "16:00",
  "5 pm": "17:00",
  "5pm": "17:00",
  "6 pm": "18:00",
  "6pm": "18:00",
  "7 pm": "19:00",
  "7pm": "19:00",
  "8 pm": "20:00",
  "8pm": "20:00",
  "9 pm": "21:00",
  "9pm": "21:00",
  "10 pm": "22:00",
  "10pm": "22:00",
  "11 pm": "23:00",
  "11pm": "23:00",
  "midnight": "00:00",
  "noon": "12:00",
};

// Simple function to detect if the input includes certain activity keywords
const extractEvents = (input: string): ScheduleEvent[] => {
  // For now, we'll return a deterministic set of events based on keywords
  const normalizedInput = input.toLowerCase();
  
  // In a real app, this would be more sophisticated NLP
  // Instead, we'll check for common patterns
  if (normalizedInput.includes("gym") || normalizedInput.includes("workout")) {
    return mockEvents; // Return all mock events if gym is mentioned
  } else if (normalizedInput.includes("coffee")) {
    return mockEvents.filter(e => e.title.includes("Coffee")); // Return coffee event
  } else if (normalizedInput.includes("walk")) {
    return mockEvents.filter(e => e.title.includes("Walk")); // Return walking event
  } else {
    // Default case: extract what we can find
    const events: ScheduleEvent[] = [];
    
    // Try to find time patterns in the text
    const timeRegex = /(\d{1,2})(:\d{2})?\s*(am|pm)/gi;
    let match;
    let lastStartTime = "";
    
    while ((match = timeRegex.exec(normalizedInput)) !== null) {
      const timeString = match[0].toLowerCase();
      const standardizedTime = timeExpressions[timeString] || "09:00"; // Default to 9am if not found
      
      if (!lastStartTime) {
        // This is a start time
        lastStartTime = standardizedTime;
      } else {
        // This is an end time - create an event
        const eventTitle = normalizedInput.includes("coffee") ? "Coffee Meeting" :
                           normalizedInput.includes("lunch") ? "Lunch Break" :
                           normalizedInput.includes("work") ? "Work Session" :
                           normalizedInput.includes("gym") ? "Gym Workout" :
                           normalizedInput.includes("meeting") ? "Meeting" :
                           "Scheduled Activity";
        
        events.push({
          title: eventTitle,
          startTime: lastStartTime,
          endTime: standardizedTime,
          location: normalizedInput.includes("at") ? "Mentioned Location" : undefined
        });
        
        lastStartTime = ""; // Reset for next event
      }
    }
    
    // If we found at least one time but not a pair, add a 1-hour event
    if (lastStartTime && events.length === 0) {
      const endHour = parseInt(lastStartTime.split(':')[0]) + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;
      
      events.push({
        title: "Scheduled Activity",
        startTime: lastStartTime,
        endTime: endTime,
      });
    }
    
    return events.length > 0 ? events : mockEvents; // Fallback to mock data if no events were extracted
  }
};

export const processNaturalLanguage = async (input: string): Promise<ScheduleEvent[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const events = extractEvents(input);
      resolve(events);
    }, 1500); // 1.5 seconds delay to simulate processing
  });
};
