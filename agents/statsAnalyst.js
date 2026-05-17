const { GoogleGenAI } = require('@google/genai');
const { toolsConfig, executeTool } = require('../tools/statsTool');

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const validateStrategy = async (matchState, strategy) => {
  const ai = getClient();
  
  const systemInstruction = "You are a data-driven IPL Stats Analyst. Your job is to validate the captain's strategy using stats. Use the available tools to fetch data about players or venues mentioned. CRITICAL RULE: provide a concise validation or warning in a maximum of 2 short lines.";
  
  let chat;
  try {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: toolsConfig }]
      }
    });
  } catch (e) {
      console.warn("Could not create chat session, using generateContent directly.", e.message);
  }

  const prompt = `Match State:\n${matchState}\n\nCaptain's Proposed Strategy: ${strategy}\n\nPlease validate this strategy using data. Fetch stats if needed.`;
  
  let response;
  if (chat) {
    response = await chat.sendMessage({ message: prompt });
  } else {
    response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: toolsConfig }]
      }
    });
  }

  let toolCalls = [];
  let toolResultsText = "";

  if (response.functionCalls && response.functionCalls.length > 0) {
    for (const call of response.functionCalls) {
      const result = executeTool(call.name, call.args);
      toolCalls.push({ name: call.name, args: call.args, result });
      
      if (chat) {
          response = await chat.sendMessage({
              message: [{
                  functionResponse: {
                      name: call.name,
                      response: result
                  }
              }]
          });
      } else {
           toolResultsText += `\nData retrieved via ${call.name}: ${JSON.stringify(result)}`;
      }
    }
  }

  if (!chat && toolCalls.length > 0) {
     response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt + toolResultsText + "\nProvide final brief validation based on this data. Max 2 short lines.",
        config: { systemInstruction }
     });
  }

  return {
    analysis: response.text || "No specific insight provided.",
    toolCalls: toolCalls
  };
};

module.exports = { validateStrategy };
