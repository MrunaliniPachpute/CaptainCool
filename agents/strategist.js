const { GoogleGenAI } = require('@google/genai');

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const getInitialStrategy = async (matchState) => {
  const ai = getClient();
  const prompt = `You are a brilliant, aggressive IPL cricket strategist and captain. 
Given the following match state, propose a bold tactical decision to turn the game in your favor. 
Adhere to the requested "Captaincy Style Directive" mentioned in the Match State.
CRITICAL RULE: Keep your response strictly to a maximum of 2 short lines.

${matchState}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};

const getRevisedStrategy = async (matchState, initialStrategy, analystFeedback, devilsAdvocateCritique) => {
  const ai = getClient();
  const prompt = `You are the captain and IPL cricket strategist. You previously proposed a strategy.
Now, consider the feedback from your Stats Analyst and the critique from your Devil's Advocate.

${matchState}
Your Initial Strategy: ${initialStrategy}
Stats Analyst Feedback: ${JSON.stringify(analystFeedback)}
Devil's Advocate Critique: ${devilsAdvocateCritique}

Based on this new information, either confidently stick to your original plan (with justification) or pivot to a new revised strategy. 
CRITICAL RULE: Keep your final decision strictly to a maximum of 4 short lines.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};

module.exports = { getInitialStrategy, getRevisedStrategy };
