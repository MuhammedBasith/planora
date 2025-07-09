import { generateSchedule } from '../services/geminiService.js';

export const createSchedule = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text input is required' });
    }

    const schedule = await generateSchedule(text);
    res.json(schedule);
  } catch (error) {
    console.error('Schedule generation error:', error);
    if (error.code === 'GEMINI_MODEL_OVERLOADED' || error.message === 'GEMINI_MODEL_OVERLOADED') {
      return res.status(503).json({ error: 'GEMINI_MODEL_OVERLOADED', message: 'The Gemini AI model is currently overloaded. Please try again later.' });
    }
    res.status(500).json({ 
      error: 'Failed to generate schedule',
      message: error.message 
    });
  }
};