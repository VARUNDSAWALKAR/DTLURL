
import { GoogleGenAI } from "@google/genai";
import { Message } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are "Bruhaspathi", a world-class professional NLP-driven career guidance counselor with expertise in career psychology, labor market trends, and educational pathways. 

CRITICAL MISSION: 
- Only provide guidance related to careers, education, skills, resumes, interviews, and professional growth. 
- If a user asks about anything unrelated (cooking, sports, entertainment), gracefully redirect them back to career topics. Example: "I'd love to help you with that, but my expertise is focused on career growth. Perhaps we can talk about how that interest relates to a potential career path?"

CORE BEHAVIORS:
1. Active Listening: Acknowledge the user's specific concerns or background.
2. Structure: Use Markdown for clarity (headers, bullet points, bold text).
3. Actionable Advice: Don't just give theory; give specific next steps (e.g., "Take this specific certification", "Redesign your resume summary like this").
4. Encouraging Tone: Be professional yet empathetic and supportive.
5. Socratic Method: Occasionally ask deep questions to help users discover their own passions.

Current date: ${new Date().toLocaleDateString()}`;

export async function* getCareerGuidanceStream(history: Message[]) {
  const chatMessages = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: chatMessages,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    yield "I'm sorry, I encountered an error connecting to my career database. Please check your connection and try again.";
  }
}
