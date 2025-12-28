import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, Shield, Bell, Activity, Volume2, VolumeX } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [waterLevel, setWaterLevel] = useState(4.2);
  const systemStatus = 'Active';

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [voiceEnabled]);

  useEffect(() => {
    // Simulate real-time water level changes
    const interval = setInterval(() => {
      setWaterLevel(prev => +(prev + (Math.random() - 0.5) * 0.1).toFixed(1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    
    if (newState) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance('SURAKSHA AI Voice Assistant activated. Monitoring flood risk in real-time.');
          utterance.lang = 'en-IN';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }, 100);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  useEffect(() => {
    if (voiceEnabled && waterLevel > 5.0) {
      speak(`Warning! Water level has reached ${waterLevel} meters. Early warning system activated.`);
    }
  }, [waterLevel, voiceEnabled, speak]);

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Next-Gen<br />
              <span className="hero-highlight">Flood Monitoring</span>
            </h1>
            <p className="hero-description">
              Real-time water level tracking, AI-powered predictions,
              and instant alerts to keep communities safe. Powered by
              satellite data and IoT sensors.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-primary"
                onClick={() => navigate('/live')}
              >
                🔴 Watch Live 24/7
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/simulation')}
              >
                Launch Dashboard
              </button>
            </div>
          </div>

          <div className="status-cards">
            <div className="status-card water-level-card">
              <div className="card-icon">
                <Waves size={32} />
              </div>
              <div className="card-content">
                <h3>{waterLevel}m</h3>
                <p>Water Level</p>
              </div>
              <button className="alert-btn">
                <Bell size={20} />
              </button>
            </div>

            <div className="status-card warning-card">
              <div className="warning-content">
                <h4>Early Warning</h4>
                <p>Predictive analysis detects risks 48h in advance.</p>
              </div>
            </div>

            <div className="status-card secure-card">
              <div className="card-icon">
                <Shield size={28} />
              </div>
              <div className="card-content">
                <h4>System Secure</h4>
                <p>AI surveillance active across all nodes.</p>
              </div>
            </div>

            <div className="status-card active-card">
              <div className="card-icon active-icon">
                <Activity size={32} />
              </div>
              <div className="card-content">
                <h3>{systemStatus}</h3>
                <p>Monitoring Status</p>
              </div>
            </div>

            <div className="voice-control-card">
              <button 
                className={`voice-btn ${voiceEnabled ? 'active' : ''}`}
                onClick={toggleVoice}
              >
                {voiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
              <div className="voice-status">
                <h4>Voice Assistant</h4>
                <p>{voiceEnabled ? 'Active - Listening' : 'Tap to activate'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-item">
            <div className="feature-icon">
              <Activity size={24} />
            </div>
            <h3>Real-Time Monitoring</h3>
            <p>24/7 water level tracking with IoT sensors</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Shield size={24} />
            </div>
            <h3>AI Predictions</h3>
            <p>85% accurate flood risk forecasting</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Bell size={24} />
            </div>
            <h3>Instant Alerts</h3>
            <p>Multi-channel emergency notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
