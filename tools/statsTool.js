const mockData = require('./cricketStats');

const getPlayerStats = (playerName) => {
  // Normalize player name for matching
  const key = playerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  // Try to find an exact or partial match
  const playerKey = Object.keys(mockData.players).find(k => k.includes(key) || key.includes(k));
  
  if (playerKey) {
    return mockData.players[playerKey];
  }
  return { error: `Player stats not found for ${playerName}.` };
};

const getVenueStats = (venueName) => {
  const key = venueName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  const venueKey = Object.keys(mockData.venues).find(k => k.includes(key) || key.includes(k));
  
  if (venueKey) {
    return mockData.venues[venueKey];
  }
  return { error: `Venue stats not found for ${venueName}.` };
};

const toolsConfig = [{
  name: "getPlayerStats",
  description: "Get cricket statistics for a specific player.",
  parameters: {
    type: "object",
    properties: {
      player: {
        type: "string",
        description: "The name of the player (e.g. 'MS Dhoni', 'Virat Kohli')"
      }
    },
    required: ["player"]
  }
}, {
  name: "getVenueStats",
  description: "Get statistics and pitch information for a specific venue/stadium.",
  parameters: {
    type: "object",
    properties: {
      venue: {
        type: "string",
        description: "The name of the stadium/venue (e.g. 'Wankhede', 'Chepauk')"
      }
    },
    required: ["venue"]
  }
}];

// For executing the functions dynamically based on Gemini response
const executeTool = (functionName, args) => {
  if (functionName === 'getPlayerStats') {
    return getPlayerStats(args.player);
  } else if (functionName === 'getVenueStats') {
    return getVenueStats(args.venue);
  }
  return { error: "Unknown function call" };
};

module.exports = {
  getPlayerStats,
  getVenueStats,
  toolsConfig,
  executeTool
};
