import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, MapPin, Activity } from 'lucide-react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, alertsRes, citiesRes] = await Promise.all([
        axios.get('/api/model-stats'),
        axios.get('/api/alerts'),
        axios.get('/api/cities')
      ]);

      setStats(statsRes.data.data);
      setAlerts(alertsRes.data.data.slice(0, 5));
      setCities(citiesRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 0.8) return '#ef4444';
    if (risk >= 0.6) return '#f59e0b';
    if (risk >= 0.4) return '#eab308';
    return '#10b981';
  };

  const getRiskLevel = (risk) => {
    if (risk >= 0.8) return 'SEVERE';
    if (risk >= 0.6) return 'HIGH';
    if (risk >= 0.4) return 'MODERATE';
    return 'LOW';
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page dashboard">
      <div className="container">
        <header className="dashboard-header">
          <h1>🌧️ SURAKSHA AI Dashboard</h1>
          <p>Real-Time Flood Risk Monitoring & Prediction</p>
        </header>

        <div className="grid grid-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>
              <MapPin size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats?.citiesMonitored || 20}</h3>
              <p>Cities Monitored</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}>
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <h3>{(stats?.randomForest.accuracy * 100).toFixed(0)}%</h3>
              <p>Model Accuracy</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f59e0b' }}>
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <h3>{alerts.length}</h3>
              <p>Active Alerts</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#8b5cf6' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>Real-time</h3>
              <p>Predictions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h2>🚨 Recent Alerts</h2>
            <div className="alerts-list">
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className="alert-item"
                    style={{ borderLeftColor: getRiskColor(alert.probability) }}
                  >
                    <div className="alert-header">
                      <strong>{alert.city}</strong>
                      <span className="risk-badge" style={{ background: getRiskColor(alert.probability) }}>
                        {getRiskLevel(alert.probability)}
                      </span>
                    </div>
                    <div className="alert-details">
                      <span>Risk: {(alert.probability * 100).toFixed(1)}%</span>
                      <span>Rainfall: {alert.rainfall}mm</span>
                      <span>River: {alert.river_level}m</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No active alerts</p>
              )}
            </div>
          </div>

          <div className="card">
            <h2>📊 Model Performance</h2>
            {stats && (
              <div className="model-stats">
                <div className="model-section">
                  <h3>Random Forest Classifier</h3>
                  <div className="metrics">
                    <div className="metric">
                      <span>Accuracy</span>
                      <strong>{(stats.randomForest.accuracy * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="metric">
                      <span>Precision</span>
                      <strong>{(stats.randomForest.precision * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="metric">
                      <span>Recall</span>
                      <strong>{(stats.randomForest.recall * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="metric">
                      <span>F1 Score</span>
                      <strong>{(stats.randomForest.f1Score * 100).toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>

                <div className="model-section">
                  <h3>LSTM Neural Network</h3>
                  <div className="metrics">
                    <div className="metric">
                      <span>Accuracy</span>
                      <strong>{(stats.lstm.accuracy * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="metric">
                      <span>Loss</span>
                      <strong>{stats.lstm.loss.toFixed(3)}</strong>
                    </div>
                    <div className="metric">
                      <span>Val Accuracy</span>
                      <strong>{(stats.lstm.valAccuracy * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="metric">
                      <span>Val Loss</span>
                      <strong>{stats.lstm.valLoss.toFixed(3)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2>🗺️ Monitored Cities</h2>
          <div className="cities-grid">
            {cities.slice(0, 10).map((city, index) => (
              <div key={index} className="city-card">
                <MapPin size={16} />
                <div>
                  <strong>{city.city}</strong>
                  <small>{city.state}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
