import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import axios from 'axios';
import './Simulation.css';

const Simulation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [loading, setLoading] = useState(false);
  const [currentTime] = useState(0);

  const generateSimulation = async () => {
    setLoading(true);
    try {
      await axios.post('/api/generate-simulation');
      alert('Simulation generated successfully!');
    } catch (error) {
      alert('Failed to generate simulation');
    }
    setLoading(false);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      speak('SURAKSHA AI Voice Agent activated');
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="page simulation">
      <div className="container">
        <header className="simulation-header">
          <h1>🗺️ Flood Risk Simulation</h1>
          <p>Real-Time Animated Geospatial Visualization</p>
        </header>

        <div className="controls-panel card">
          <div className="control-group">
            <button 
              className="btn btn-primary"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pause' : 'Play'} Simulation
            </button>

            <button 
              className={`btn ${voiceEnabled ? 'btn-danger' : 'btn-secondary'}`}
              onClick={toggleVoice}
            >
              {voiceEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
              {voiceEnabled ? 'Disable' : 'Enable'} Voice
            </button>

            <select 
              className="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en-IN">English</option>
              <option value="hi-IN">हिंदी</option>
            </select>

            <button 
              className="btn btn-secondary"
              onClick={generateSimulation}
              disabled={loading}
            >
              <RefreshCw size={20} />
              {loading ? 'Generating...' : 'Regenerate'}
            </button>
          </div>
        </div>

        <div className="status-panel card">
          <div className="status-item">
            <span className="label">Current Time:</span>
            <span className="value">Timestep {currentTime}</span>
          </div>
          <div className="status-item">
            <span className="label">Voice Agent:</span>
            <span className="value">{voiceEnabled ? 'Active' : 'Disabled'}</span>
          </div>
          <div className="status-item">
            <span className="label">Language:</span>
            <span className="value">{language === 'en-IN' ? 'English' : 'हिंदी'}</span>
          </div>
        </div>

        <div className="map-container card">
          <iframe 
            src="/flood_map.html"
            title="Flood Risk Map"
            className="map-frame"
          />
        </div>

        <div className="info-panel card">
          <h3>ℹ️ How to Use</h3>
          <ul>
            <li>Click <strong>Play Simulation</strong> to start the animated visualization</li>
            <li>Enable <strong>Voice Agent</strong> for audio narration of alerts</li>
            <li>Switch between <strong>English/Hindi</strong> for multilingual support</li>
            <li>Watch color-coded markers: 🟢 Low → 🟡 Moderate → 🟠 High → 🔴 Severe</li>
            <li>Severe alerts (&gt;80% risk) trigger emergency notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
