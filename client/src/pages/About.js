import React from 'react';
import { Brain, Map, Mic, Zap, Shield, TrendingUp } from 'lucide-react';
import './About.css';

const About = () => {
  const features = [
    {
      icon: <Brain size={32} />,
      title: 'AI-Powered Predictions',
      description: 'Random Forest + LSTM neural networks for 85% accurate flood risk classification'
    },
    {
      icon: <Map size={32} />,
      title: 'Geospatial Visualization',
      description: 'Interactive animated maps with Plotly showing real-time risk across 20+ cities'
    },
    {
      icon: <Mic size={32} />,
      title: 'Voice Alerts',
      description: 'Multi-language (English/Hindi) voice narration with emergency siren system'
    },
    {
      icon: <Zap size={32} />,
      title: 'Real-Time Processing',
      description: 'Live data processing with rolling windows and river rise detection'
    },
    {
      icon: <Shield size={32} />,
      title: 'Disaster Management',
      description: 'Proactive alert system for evacuation planning and emergency response'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Time-Series Forecasting',
      description: '7-day prediction windows using LSTM for early warning systems'
    }
  ];

  const techStack = [
    { category: 'Frontend', items: ['React', 'Plotly.js', 'Recharts', 'Framer Motion'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'Python Integration'] },
    { category: 'ML/AI', items: ['TensorFlow', 'scikit-learn', 'NumPy', 'Pandas'] },
    { category: 'Voice', items: ['Web Speech API', 'Multi-language Support'] }
  ];

  return (
    <div className="page about">
      <div className="container">
        <header className="about-header">
          <h1>🌧️ About SURAKSHA AI</h1>
          <p className="tagline">Protecting Communities Through Intelligent Flood Prediction</p>
        </header>

        <div className="card mission-card">
          <h2>Our Mission</h2>
          <p>
            SURAKSHA AI is an advanced flood risk prediction and alert system that combines 
            cutting-edge machine learning, geospatial visualization, and voice-based alerts 
            to protect communities from flood disasters. Our system monitors 20+ cities in 
            real-time, providing accurate predictions and timely warnings to save lives and 
            minimize property damage.
          </p>
        </div>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="feature-box card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="tech-section">
          <h2>Technology Stack</h2>
          <div className="grid grid-2">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-card card">
                <h3>{tech.category}</h3>
                <div className="tech-items">
                  {tech.items.map((item, i) => (
                    <span key={i} className="tech-badge">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <h2>Impact & Performance</h2>
          <div className="grid grid-4">
            <div className="stat-box card">
              <h3>85%</h3>
              <p>Prediction Accuracy</p>
            </div>
            <div className="stat-box card">
              <h3>20+</h3>
              <p>Cities Monitored</p>
            </div>
            <div className="stat-box card">
              <h3>7-Day</h3>
              <p>Forecast Window</p>
            </div>
            <div className="stat-box card">
              <h3>Real-time</h3>
              <p>Alert System</p>
            </div>
          </div>
        </section>

        <div className="card cta-card">
          <h2>Why SURAKSHA AI?</h2>
          <ul className="benefits-list">
            <li>✅ Combines AI + GIS + Voice + UX for comprehensive disaster management</li>
            <li>✅ Real-world relevance with immediate social impact</li>
            <li>✅ Scalable architecture ready for APIs, IoT, and satellite integration</li>
            <li>✅ Explainable AI with clear risk levels and voice narration</li>
            <li>✅ Fully offline capable with no cloud dependencies</li>
            <li>✅ Multi-language support for diverse communities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
