import { response, Router } from 'express';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";
const router = Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

// POST /api/activities
router.post('/', async (req, res) => {
console.log('Activities router initialized');
  const { mood } = req.body;
  
  try {
    // Call Gemini AI
    const prompt = `Suggest 3 activities to help someone who feels: ${mood}. Only return the activity suggestions as a list.`;
    const response = await ai.models.generateContent({
      model: 'gemini-pro',
      contents: `${prompt}`,
    });


    res.json({suggestions: response.text});
    console.log('Suggestions sent to client:', response.text);

  } catch (error) {
    console.error('Gemini API error!');
    console.error(error);
    res.status(500).json({ suggestions: ['Error fetching suggestions from Gemini AI.'] });
  }
});

export default router;
