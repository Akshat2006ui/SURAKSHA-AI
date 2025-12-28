// SURAKSHA AI Voice Agent - Web Speech API Integration

class SurakshaVoiceAgent {
    constructor() {
        this.enabled = false;
        this.language = 'en-IN';
        this.synthesis = window.speechSynthesis;
        this.currentFrame = 0;
        this.lastAlert = null;
        
        this.initializeControls();
    }
    
    initializeControls() {
        const voiceToggle = document.getElementById('voiceToggle');
        const languageSelect = document.getElementById('languageSelect');
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        voiceToggle.addEventListener('click', () => this.toggleVoice());
        languageSelect.addEventListener('change', (e) => {
            this.language = e.target.value;
        });
        
        playBtn.addEventListener('click', () => this.startSimulation());
        pauseBtn.addEventListener('click', () => this.pauseSimulation());
    }
    
    toggleVoice() {
        this.enabled = !this.enabled;
        const status = document.getElementById('voiceStatus');
        const btn = document.getElementById('voiceToggle');
        
        if (this.enabled) {
            status.textContent = 'Active';
            btn.textContent = '🔇 Disable Voice Agent';
            this.speak('SURAKSHA AI Voice Agent activated', this.language);
        } else {
            status.textContent = 'Disabled';
            btn.textContent = '🔊 Enable Voice Agent';
            this.synthesis.cancel();
        }
    }
    
    speak(text, lang = 'en-IN') {
        if (!this.enabled) return;
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Select appropriate voice
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
        if (voice) utterance.voice = voice;
        
        this.synthesis.speak(utterance);
    }
    
    announceAlert(city, riskLevel, probability, language) {
        const messages = {
            'en-IN': {
                'SEVERE': `Severe flood alert for ${city}. Risk level ${Math.round(probability * 100)} percent. Immediate evacuation recommended.`,
                'HIGH': `High flood risk detected in ${city}. Risk level ${Math.round(probability * 100)} percent. Prepare for evacuation.`,
                'MODERATE': `Moderate flood risk in ${city}. Risk level ${Math.round(probability * 100)} percent. Stay alert.`,
                'LOW': `Low flood risk in ${city}. Situation normal.`
            },
            'hi-IN': {
                'SEVERE': `${city} में गंभीर बाढ़ चेतावनी। जोखिम स्तर ${Math.round(probability * 100)} प्रतिशत। तुरंत निकासी की सिफारिश।`,
                'HIGH': `${city} में उच्च बाढ़ जोखिम। जोखिम स्तर ${Math.round(probability * 100)} प्रतिशत। निकासी के लिए तैयार रहें।`,
                'MODERATE': `${city} में मध्यम बाढ़ जोखिम। जोखिम स्तर ${Math.round(probability * 100)} प्रतिशत। सतर्क रहें।`,
                'LOW': `${city} में कम बाढ़ जोखिम। स्थिति सामान्य।`
            }
        };
        
        const message = messages[language][riskLevel];
        this.speak(message, language);
        
        // Trigger siren for severe alerts
        if (riskLevel === 'SEVERE') {
            this.playSiren();
        }
    }
    
    playSiren() {
        const siren = document.getElementById('sirenAudio');
        if (siren) {
            siren.play().catch(e => console.log('Siren playback failed:', e));
        }
    }
    
    startSimulation() {
        this.currentFrame = 0;
        if (this.enabled) {
            const msg = this.language === 'hi-IN' 
                ? 'बाढ़ जोखिम सिमुलेशन शुरू हो रहा है'
                : 'Starting flood risk simulation with AI predictions';
            this.speak(msg, this.language);
        }
        
        // Load and process alerts
        this.loadAlerts();
    }
    
    async loadAlerts() {
        try {
            const response = await fetch('alerts.json');
            const alerts = await response.json();
            
            // Simulate processing alerts over time
            let index = 0;
            const interval = setInterval(() => {
                if (index >= alerts.length) {
                    clearInterval(interval);
                    return;
                }
                
                const alert = alerts[index];
                if (this.enabled && alert.risk_level !== 'LOW') {
                    this.announceAlert(
                        alert.city,
                        alert.risk_level,
                        alert.probability,
                        this.language
                    );
                }
                
                this.updateAlertPanel([alert]);
                index++;
            }, 3000); // Alert every 3 seconds
            
        } catch (e) {
            console.log('Alerts file not found, using demo mode');
        }
    }
    
    pauseSimulation() {
        if (this.enabled) {
            this.speak('Simulation paused', this.language);
        }
    }
    
    updateAlertPanel(alerts) {
        const alertList = document.getElementById('alertList');
        
        alerts.forEach(alert => {
            const div = document.createElement('div');
            div.className = `alert-item ${alert.risk_level.toLowerCase()}`;
            
            const icon = alert.risk_level === 'SEVERE' ? '🚨' : 
                        alert.risk_level === 'HIGH' ? '🔴' : '🟡';
            
            div.innerHTML = `
                <strong>${icon} ${alert.city}</strong><br>
                Risk: ${(alert.probability * 100).toFixed(1)}% | 
                Rainfall: ${alert.rainfall}mm | 
                River: ${alert.river_level}m
            `;
            
            alertList.insertBefore(div, alertList.firstChild);
            
            // Keep only last 5 alerts
            while (alertList.children.length > 5) {
                alertList.removeChild(alertList.lastChild);
            }
        });
        
        // Update high risk count
        const highRiskCount = alerts.filter(a => a.risk_level !== 'LOW').length;
        document.getElementById('highRiskCount').textContent = highRiskCount;
    }
}

// Initialize voice agent when page loads
let voiceAgent;
window.addEventListener('DOMContentLoaded', () => {
    voiceAgent = new SurakshaVoiceAgent();
    
    // Wait for voices to load
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            console.log('Voices loaded');
        };
    }
});
