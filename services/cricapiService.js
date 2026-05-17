const axios = require('axios');

const getLiveMatches = async () => {
    try {
        const apiKey = process.env.CRICAPI_KEY;
        
        // If there is no key or it's just the placeholder, use smart fallback data for demo reliability
        if (!apiKey || apiKey === 'your_key_here') {
            console.log("No CRICAPI_KEY found or using placeholder. Using smart fallback demo matches.");
            return getFallbackMatches();
        }

        // Call CricAPI current matches endpoint
        // (Note: CricAPI actual format varies slightly, using standard v1/currentMatches format)
        const url = `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`;
        const response = await axios.get(url);
        
        if (response.data && response.data.status === "success" && response.data.data) {
            return response.data.data.map(match => normalizeMatchData(match));
        } else {
            console.warn("CricAPI response issue, using fallback.");
            return getFallbackMatches();
        }

    } catch (error) {
        console.error("Error fetching from CricAPI:", error.message);
        return getFallbackMatches(); // Graceful UI fallback
    }
};

const normalizeMatchData = (match) => {
    // Normalizes the chaotic API response to our app's structured format
    // Real CricAPI data has 'teamInfo', 'score', 'matchInfo' etc.
    
    // Attempt to extract live scores safely
    let currentScore = match.score && match.score.length > 0 ? match.score[match.score.length - 1] : null;
    
    // Smart Fallbacks if data is incomplete
    return {
        id: match.id || Date.now().toString(),
        name: match.name || "Unknown Match",
        battingTeam: currentScore ? currentScore.inning : (match.teams ? match.teams[0] : "Team A"),
        bowlingTeam: match.teams ? match.teams.find(t => t !== (currentScore ? currentScore.inning : null)) || match.teams[1] : "Team B",
        score: currentScore ? currentScore.r : "0",
        wickets: currentScore ? currentScore.w : "0",
        overs: currentScore ? currentScore.o : "0.0",
        striker: "Live Striker",           // Rarely directly provided by basic API without deeper scraping
        nonStriker: "Live Non-Striker",
        venue: match.venue || "Stadium",
        status: match.status || "Match in progress"
    };
};

const getFallbackMatches = () => {
    // Smart fallbacks to prevent breaking the demo
    return [
        {
            id: "fallback_1",
            name: "CSK vs MI (Demo Fallback)",
            battingTeam: "CSK",
            bowlingTeam: "MI",
            score: "172",
            wickets: "4",
            overs: "18.1",
            striker: "MS Dhoni",
            nonStriker: "Ravindra Jadeja",
            venue: "Wankhede Stadium",
            status: "CSK need 35 runs in 11 balls"
        },
        {
            id: "fallback_2",
            name: "RCB vs KKR (Demo Fallback)",
            battingTeam: "RCB",
            bowlingTeam: "KKR",
            score: "205",
            wickets: "2",
            overs: "19.3",
            striker: "Virat Kohli",
            nonStriker: "Faf du Plessis",
            venue: "M. Chinnaswamy Stadium",
            status: "First Innings"
        }
    ];
};

module.exports = {
    getLiveMatches
};
