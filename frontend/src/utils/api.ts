const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ScheduleEvent {
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: 'exercise' | 'work' | 'meeting' | 'meal' | 'leisure' | string;
  location?: string;
  notes?: string;
}

export const generateSchedule = async (text: string): Promise<ScheduleEvent[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      // Check for Gemini overload error from backend
      if (error.error === 'GEMINI_MODEL_OVERLOADED') {
        const overloadError = new Error('GEMINI_MODEL_OVERLOADED');
        overloadError.name = 'GEMINI_MODEL_OVERLOADED';
        throw overloadError;
      }
      throw new Error(error.message || 'Failed to generate schedule');
    }

    const data = await response.json();
    
    // Calculate endTime for each event based on startTime and duration
    return data.map((event: ScheduleEvent) => {
      const [hours, minutes] = event.startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0);
      
      const endDate = new Date(startDate.getTime() + event.duration * 60000);
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      return {
        ...event,
        endTime,
      };
    });
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
