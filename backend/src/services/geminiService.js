import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


const schema = {
  description: "A schedule represented as a JSON array of events",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      title: {
        type: SchemaType.STRING,
        description: "Brief descriptive name (max 50 chars)",
        maxLength: 50,
        nullable: false,
      },
      startTime: {
        type: SchemaType.STRING,
        description: "Start time in 24-hour format (HH:mm)",
        pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", // Ensures valid HH:mm format
        nullable: false,
      },
      duration: {
        type: SchemaType.INTEGER,
        description: "Duration in minutes (minimum 0)",
        minimum: 0,
        nullable: false,
      },
      type: {
        type: SchemaType.STRING,
        description: "Event type",
        enum: ["exercise", "work", "meeting", "meal", "leisure"], // Restricts values
        nullable: false,
      },
    },
    required: ["title", "startTime", "duration", "type"],
  },
};


const PROMPT_TEMPLATE = `You are a JSON schedule generator. Your task is to convert the input text into a schedule.
ONLY respond with a valid JSON array. DO NOT include any other text, markdown formatting, or explanations.
Each event in the array must follow this exact structure:
{
  "title": "Brief descriptive name (max 50 chars)",
  "startTime": "HH:mm",
  "duration": number,
  "type": "exercise" | "work" | "meeting" | "meal" | "leisure"
}

Input text: {text}

Remember:
1. ONLY output the JSON array
2. NO additional text or formatting
3. Ensure all times are in 24-hour format (HH:mm)
4. Duration must be in minutes (minimum 0)
5. Type must be one of: exercise, work, meeting, meal, leisure
6. Keep titles concise but descriptive, max 50 characters`;

export const generateSchedule = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }, });
    
    const prompt = PROMPT_TEMPLATE.replace('{text}', text);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();
    console.log(responseText);
    
    
    // Clean up the response if it contains any markdown or extra text
    if (responseText.includes('```')) {
      responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    }
    
    try {
      const schedule = JSON.parse(responseText);
      
      // Validate the structure of each event
      if (!Array.isArray(schedule)) {
        throw new Error('Response is not an array');
      }
      
      return schedule.map(event => {
        // Check required fields exist
        if (!event.hasOwnProperty('title') || 
            !event.hasOwnProperty('startTime') || 
            !event.hasOwnProperty('duration') || 
            !event.hasOwnProperty('type')) {
          console.error('Invalid event:', event);
          throw new Error(`Missing required fields in event: ${JSON.stringify(event)}`);
        }
        
        // Ensure startTime is in correct format
        if (!/^\d{2}:\d{2}$/.test(event.startTime)) {
          throw new Error(`Invalid time format in event: ${JSON.stringify(event)}`);
        }
        
        // Ensure duration is a number and not negative
        const duration = Number(event.duration);
        if (isNaN(duration) || duration < 0) {
          throw new Error(`Invalid duration in event: ${JSON.stringify(event)}`);
        }
        
        // Validate event type
        const validTypes = ['exercise', 'work', 'meeting', 'meal', 'leisure'];
        const type = event.type.toLowerCase();
        if (!validTypes.includes(type)) {
          throw new Error(`Invalid event type in event: ${JSON.stringify(event)}`);
        }
        
        return {
          title: event.title,
          startTime: event.startTime,
          duration: duration,
          type: type
        };
      });
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw Response:', responseText);
      throw new Error(parseError.message || 'Failed to parse AI response as valid JSON');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    // Detect Gemini model overload (rate limit or quota exceeded)
    if (
      error.message &&
      (error.message.includes('quota') ||
        error.message.includes('overloaded') ||
        error.message.includes('rate limit') ||
        error.message.includes('429'))
    ) {
      const overloadError = new Error('GEMINI_MODEL_OVERLOADED');
      overloadError.code = 'GEMINI_MODEL_OVERLOADED';
      throw overloadError;
    }
    throw new Error(error.message || 'Failed to generate schedule with AI');
  }
};