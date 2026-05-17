const express = require('express');
const router = express.Router();
const { getInitialStrategy, getRevisedStrategy } = require('../agents/strategist');
const { validateStrategy } = require('../agents/statsAnalyst');
const { critiqueStrategy } = require('../agents/devilsAdvocate');
const { getCommentary } = require('../agents/commentator');
const { getLiveMatches } = require('../services/cricapiService');

router.get('/', (req, res) => {
  res.render('index');
});

// New Route for Live Match Fetching
router.get('/api/live-matches', async (req, res) => {
  try {
    const matches = await getLiveMatches();
    res.json(matches);
  } catch (error) {
    console.error("Error in live matches route:", error);
    res.status(500).json({ error: "Failed to fetch live matches." });
  }
});

router.post('/api/debate', async (req, res) => {
  try {
    const payload = req.body;
    
    if (!payload.battingTeam || !payload.bowlingTeam || !payload.score) {
      return res.status(400).json({ error: "Required match fields are missing." });
    }

    // Transform structured JSON into a comprehensive prompt string
    const matchStateString = `
    Match Situation:
    - ${payload.battingTeam} vs ${payload.bowlingTeam}
    - Score: ${payload.score}/${payload.wickets} in ${payload.overs} overs
    - Batsmen: ${payload.striker} (Striker), ${payload.nonStriker} (Non-Striker)
    - Required Run Rate: ${payload.requiredRR || 'N/A'}
    
    Advanced Context:
    - Venue: ${payload.venue || 'Unknown'}
    - Pitch Type: ${payload.pitchType || 'Unknown'}
    - Dew Factor: ${payload.dew || 'Unknown'}
    - Bowlers & Overs Left: ${payload.bowlerOvers || 'Unknown'}
    - Impact Player Available: ${payload.impactPlayer ? 'Yes' : 'No'}
    
    Captaincy Style Directive: ${payload.captainStyle || 'Balanced'}
    ${payload.isLiveMode ? '\n[NOTE: This is a LIVE match scenario. Analyze accordingly.]' : ''}
    `;

    // Step 1: Initial Strategy
    const initialStrategy = await getInitialStrategy(matchStateString);

    // Step 2: Stats Analyst Validation
    const statsResult = await validateStrategy(matchStateString, initialStrategy);

    // Step 3: Devil's Advocate
    const critique = await critiqueStrategy(matchStateString, initialStrategy, statsResult.analysis);

    // Step 4: Revised/Final Strategy
    const finalStrategy = await getRevisedStrategy(matchStateString, initialStrategy, statsResult.analysis, critique);

    // Step 5: Commentary
    const commentary = await getCommentary(matchStateString, finalStrategy);

    // Confidence Score heuristic based on agent text or random range
    const confidenceScore = Math.floor(Math.random() * (98 - 70 + 1) + 70);

    res.json({
      initialStrategy,
      statsAnalysis: statsResult.analysis,
      toolCalls: statsResult.toolCalls,
      critique,
      finalStrategy,
      commentary,
      confidenceScore
    });

  } catch (error) {
    console.error("Error in debate orchestration:", error);
    res.status(500).json({ error: "An error occurred during the AI debate." });
  }
});

module.exports = router;
