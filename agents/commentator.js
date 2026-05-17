const { GoogleGenAI } = require('@google/genai');

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const getCommentary = async (matchState, finalStrategy) => {
  const ai = getClient();
  const prompt = `You are an energetic, dramatic IPL cricket commentator.
The Captain has just made a crucial tactical decision.

${matchState}
Captain's Final Decision: ${finalStrategy}

CRITICAL RULE: Give a thrilling, enthusiastic commentary on this decision as if you are broadcasting live to millions of fans. Use cricketing jargon! Maximum 2 short lines.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};

module.exports = { getCommentary };
