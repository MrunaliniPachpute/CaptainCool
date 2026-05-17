document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const form = document.getElementById('match-form');
    const submitBtn = document.getElementById('submit-btn');
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedContent = document.getElementById('advanced-content');
    
    // Mode Switcher Elements
    const btnManualMode = document.getElementById('btn-manual-mode');
    const btnLiveMode = document.getElementById('btn-live-mode');
    const liveMatchSection = document.getElementById('live-match-section');
    const demoButtonsSection = document.getElementById('demo-buttons-section');
    const btnFetchLive = document.getElementById('btn-fetch-live');
    const liveLoading = document.getElementById('live-loading');
    const liveDropdownGroup = document.getElementById('live-dropdown-group');
    const liveMatchSelect = document.getElementById('liveMatchSelect');
    const liveStatusIndicator = document.getElementById('live-status-indicator');
    
    let isLiveMode = false;
    let currentLiveMatches = [];

    // Cards
    const cards = {
        strat1: document.getElementById('card-strategist-1'),
        stats: document.getElementById('card-stats'),
        devil: document.getElementById('card-devil'),
        final: document.getElementById('card-strategist-final'),
        comm: document.getElementById('card-commentary')
    };

    // Mode Toggle Logic
    btnManualMode.addEventListener('click', () => {
        isLiveMode = false;
        btnManualMode.classList.add('active');
        btnLiveMode.classList.remove('active');
        
        liveMatchSection.classList.add('hidden');
        demoButtonsSection.classList.remove('hidden');
        liveStatusIndicator.classList.add('hidden');
        submitBtn.classList.remove('live-active');
        submitBtn.textContent = 'Initialize War Room';
    });

    btnLiveMode.addEventListener('click', () => {
        isLiveMode = true;
        btnLiveMode.classList.add('active');
        btnManualMode.classList.remove('active');
        
        demoButtonsSection.classList.add('hidden');
        liveMatchSection.classList.remove('hidden');
        submitBtn.classList.add('live-active');
        submitBtn.textContent = 'Analyze Live Match';
    });

    // Fetch Live Matches
    btnFetchLive.addEventListener('click', async () => {
        btnFetchLive.disabled = true;
        liveLoading.classList.remove('hidden');
        liveDropdownGroup.style.display = 'none';

        try {
            const response = await fetch('/api/live-matches');
            if (!response.ok) throw new Error("Failed to fetch live matches");
            
            const matches = await response.json();
            currentLiveMatches = matches;
            
            liveMatchSelect.innerHTML = '<option value="">-- Choose a live match --</option>';
            matches.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = `${m.name} (${m.status})`;
                liveMatchSelect.appendChild(opt);
            });

            liveDropdownGroup.style.display = 'block';
            
            // Show Status Indicator
            liveStatusIndicator.classList.remove('hidden');
            const now = new Date();
            document.getElementById('last-updated-time').textContent = now.toLocaleTimeString();

        } catch (error) {
            console.error("Live fetch error:", error);
            alert("Error fetching live data. Using fallbacks.");
        } finally {
            btnFetchLive.disabled = false;
            liveLoading.classList.add('hidden');
        }
    });

    // Auto-fill form on match select
    liveMatchSelect.addEventListener('change', (e) => {
        const matchId = e.target.value;
        const match = currentLiveMatches.find(m => m.id === matchId);
        if (match) {
            document.getElementById('battingTeam').value = match.battingTeam;
            document.getElementById('bowlingTeam').value = match.bowlingTeam;
            document.getElementById('score').value = match.score;
            document.getElementById('wickets').value = match.wickets;
            document.getElementById('overs').value = match.overs;
            document.getElementById('striker').value = match.striker;
            document.getElementById('nonStriker').value = match.nonStriker;
            document.getElementById('venue').value = match.venue;
            
            // Optional: you could make fields readonly in live mode, but leaving them editable is good for tweaking.
        }
    });


    // Accordion Logic
    advancedToggle.addEventListener('click', () => {
        advancedContent.classList.toggle('active');
        const icon = advancedToggle.querySelector('.icon');
        icon.textContent = advancedContent.classList.contains('active') ? '▲' : '▼';
    });

    // Demo Scenarios
    const scenarios = {
        kohli: {
            battingTeam: 'RCB', bowlingTeam: 'CSK', score: '175', wickets: '4', overs: '18',
            striker: 'Virat Kohli', nonStriker: 'Dinesh Karthik', venue: 'Chinnaswamy', bowlerOvers: 'Pathirana (1), Mustafizur (1)',
            pitchType: 'Batting Paradise', dew: 'Light', requiredRR: '12.5', impactPlayer: false, captainStyle: 'Aggressive Mode'
        },
        dhoni: {
            battingTeam: 'CSK', bowlingTeam: 'MI', score: '150', wickets: '6', overs: '19',
            striker: 'MS Dhoni', nonStriker: 'Ravindra Jadeja', venue: 'Wankhede', bowlerOvers: 'Bumrah (1)',
            pitchType: 'Two-Paced', dew: 'Heavy', requiredRR: '18.0', impactPlayer: false, captainStyle: 'Dhoni Mode'
        },
        russell: {
            battingTeam: 'KKR', bowlingTeam: 'SRH', score: '190', wickets: '5', overs: '17.2',
            striker: 'Andre Russell', nonStriker: 'Rinku Singh', venue: 'Eden Gardens', bowlerOvers: 'Cummins (1), Natarajan (1.4)',
            pitchType: 'Batting Paradise', dew: 'None', requiredRR: '', impactPlayer: true, captainStyle: 'Aggressive Mode'
        },
        bumrah: {
            battingTeam: 'GT', bowlingTeam: 'MI', score: '160', wickets: '5', overs: '18',
            striker: 'Shubman Gill', nonStriker: 'Rashid Khan', venue: 'Narendra Modi Stadium', bowlerOvers: 'Bumrah (2)',
            pitchType: 'Pacer Friendly', dew: 'None', requiredRR: '9.0', impactPlayer: false, captainStyle: 'Rohit Mode'
        }
    };

    document.querySelectorAll('.demo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const s = scenarios[e.target.dataset.scenario];
            if(s) {
                document.getElementById('battingTeam').value = s.battingTeam;
                document.getElementById('bowlingTeam').value = s.bowlingTeam;
                document.getElementById('score').value = s.score;
                document.getElementById('wickets').value = s.wickets;
                document.getElementById('overs').value = s.overs;
                document.getElementById('striker').value = s.striker;
                document.getElementById('nonStriker').value = s.nonStriker;
                document.getElementById('venue').value = s.venue;
                document.getElementById('bowlerOvers').value = s.bowlerOvers;
                document.getElementById('pitchType').value = s.pitchType;
                document.getElementById('dew').value = s.dew;
                document.getElementById('requiredRR').value = s.requiredRR;
                document.getElementById('impactPlayer').checked = s.impactPlayer;
                document.getElementById('captainStyle').value = s.captainStyle;
            }
        });
    });

    const setCardState = (card, state, text = '') => {
        const contentDiv = card.querySelector('.content');
        if (state === 'loading') {
            card.classList.remove('hidden');
            contentDiv.innerHTML = `<div class="loader-container"><div class="cricket-ball"></div> ${text}</div>`;
        } else if (state === 'done') {
            contentDiv.innerHTML = text;
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect Data
        const payload = {
            isLiveMode: isLiveMode,
            battingTeam: document.getElementById('battingTeam').value,
            bowlingTeam: document.getElementById('bowlingTeam').value,
            score: document.getElementById('score').value,
            wickets: document.getElementById('wickets').value,
            overs: document.getElementById('overs').value,
            striker: document.getElementById('striker').value,
            nonStriker: document.getElementById('nonStriker').value,
            venue: document.getElementById('venue').value,
            bowlerOvers: document.getElementById('bowlerOvers').value,
            pitchType: document.getElementById('pitchType').value,
            dew: document.getElementById('dew').value,
            requiredRR: document.getElementById('requiredRR').value,
            impactPlayer: document.getElementById('impactPlayer').checked,
            captainStyle: document.getElementById('captainStyle').value
        };

        // UI Reset
        submitBtn.disabled = true;
        submitBtn.textContent = 'Simulating War Room...';
        
        Object.values(cards).forEach(c => c.classList.add('hidden'));
        cards.final.classList.remove('active-glow');
        document.getElementById('confidence-bar').style.width = '0%';
        document.getElementById('confidence-score-text').textContent = '--%';

        setCardState(cards.strat1, 'loading', 'Analyzing match state...');

        try {
            const response = await fetch('/api/debate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();

            // Sequence Reveal
            setCardState(cards.strat1, 'done', data.initialStrategy);

            setTimeout(() => {
                setCardState(cards.stats, 'loading', 'Querying database...');
                setTimeout(() => {
                    setCardState(cards.stats, 'done', data.statsAnalysis);
                    const toolDiv = cards.stats.querySelector('.tool-calls');
                    if(data.toolCalls && data.toolCalls.length > 0) {
                        toolDiv.style.display = 'block';
                        toolDiv.innerHTML = data.toolCalls.map(c => `> CALL: ${c.name}()`).join('<br>');
                    } else {
                        toolDiv.style.display = 'none';
                    }
                }, 1000);
            }, 1000);

            setTimeout(() => {
                setCardState(cards.devil, 'loading', 'Finding weaknesses...');
                setTimeout(() => {
                    setCardState(cards.devil, 'done', data.critique);
                }, 1000);
            }, 3000);

            setTimeout(() => {
                cards.final.classList.remove('hidden');
                setCardState(cards.final, 'loading', 'Finalizing captaincy move...');
                
                setTimeout(() => {
                    setCardState(cards.final, 'done', data.finalStrategy);
                    cards.final.classList.add('active-glow');
                    
                    const confScore = data.confidenceScore || 85;
                    document.getElementById('confidence-score-text').textContent = `${confScore}%`;
                    document.getElementById('confidence-bar').style.width = `${confScore}%`;
                    
                    if(confScore < 70) document.getElementById('confidence-bar').style.background = 'linear-gradient(90deg, #ef4444, #fbbf24)';
                    else document.getElementById('confidence-bar').style.background = 'linear-gradient(90deg, var(--accent-cyan), var(--accent-green))';

                }, 1500);
            }, 5500);

            setTimeout(() => {
                setCardState(cards.comm, 'loading', 'Adjusting mic...');
                setTimeout(() => {
                    setCardState(cards.comm, 'done', `"${data.commentary}"`);
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = isLiveMode ? 'Analyze Live Match' : 'Initialize War Room';
                }, 1000);
            }, 8500);

        } catch (error) {
            console.error(error);
            setCardState(cards.strat1, 'done', `<span style="color:var(--accent-red)">Error: Connection to War Room lost.</span>`);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Retry';
        }
    });
});
