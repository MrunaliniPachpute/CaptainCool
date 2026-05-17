const { GoogleGenAI } = require('@google/genai');

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const critiqueStrategy = async (matchState, strategy, statsAnalysis) => {
  const ai = getClient();
  const prompt = `You are a cynical, hyper-critical IPL "Devil's Advocate". 
Your sole purpose is to find flaws, risks, and holes in the Captain's proposed strategy.
You consider the stats provided by the analyst, but you focus on edge cases, psychological pressure, and what could go catastrophically wrong.

${matchState}
Captain's Strategy: ${strategy}
Stats Analyst Report: ${JSON.stringify(statsAnalysis)}

CRITICAL RULE: Provide a sharp, critical response explaining why this strategy might backfire. Maximum 2 short lines.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};

module.exports = { critiqueStrategy };
