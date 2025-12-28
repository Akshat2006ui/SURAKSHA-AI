import { useState, useEffect, useCallback } from 'react';
import { Activity, Droplets, Wind, AlertTriangle, TrendingUp, MapPin, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './LiveMonitoring.css';

const LiveMonitoring = () => {
  const [waterLevels, setWaterLevels] = useState([]);
  const [rainfall, setRainfall] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    avgWaterLevel: 4.2,
    totalRainfall: 125,
    activeAlerts: 3,
    citiesMonitored: 20
  });

  // Generate realistic water level data
  const generateWaterLevel = useCallback(() => {
    const time = new Date().toLocaleTimeString();
    const value = 3 + Math.sin(Date.now() / 10000) * 2 + Math.random() * 0.5;
    
    setWaterLevels(prev => {
      const newData = [...prev, { time, value: value.toFixed(2) }];
      return newData.slice(-20); // Keep last 20 points
    });
  }, []);

  // Generate rainfall data
  const generateRainfall = useCallback(() => {
    const time = new Date().toLocaleTimeString();
    const value = Math.random() * 50 + 20;
    
    setRainfall(prev => {
      const newData = [...prev, { time, value: value.toFixed(1) }];
      return newData.slice(-15);
    });
  }, []);

  // Generate city monitoring data
  const generateCityData = useCallback(() => {
    const cities = ['Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad'];
    const newData = cities.map(city => ({
      city,
      risk: Math.random() * 100,
      water: (Math.random() * 8).toFixed(1),
      rainfall: (Math.random() * 60).toFixed(1)
    }));
    setCityData(newData);
  }, []);

  // Generate radar data
  const generateRadarData = useCallback(() => {
    const metrics = ['Water Level', 'Rainfall', 'Wind Speed', 'Humidity', 'Pressure', 'Temperature'];
    const newData = metrics.map(metric => ({
      metric,
      value: Math.random() * 100
    }));
    setRadarData(newData);
  }, []);

  // Generate alerts
  const generateAlerts = useCallback(() => {
    const alertTypes = [
      { type: 'HIGH', message: 'High water level detected in Mumbai', color: '#f59e0b' },
      { type: 'SEVERE', message: 'Severe flood risk in Chennai', color: '#ef4444' },
      { type: 'WARNING', message: 'Heavy rainfall expected in Delhi', color: '#fbbf24' },
      { type: 'MODERATE', message: 'Moderate risk in Bangalore', color: '#3b82f6' }
    ];
    
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    setAlerts(prev => {
      const newAlerts = [{ ...randomAlert, time: new Date().toLocaleTimeString(), id: Date.now() }, ...prev];
      return newAlerts.slice(0, 5);
    });
  }, []);

  // Update stats
  const updateStats = useCallback(() => {
    setStats(prev => ({
      avgWaterLevel: (3 + Math.random() * 3).toFixed(1),
      totalRainfall: Math.floor(100 + Math.random() * 50),
      activeAlerts: Math.floor(Math.random() * 5) + 1,
      citiesMonitored: 20
    }));
  }, []);

  // Initialize and update data
  useEffect(() => {
    // Initial data
    generateWaterLevel();
    generateRainfall();
    generateCityData();
    generateRadarData();
    generateAlerts();

    // Real-time updates
    const waterInterval = setInterval(generateWaterLevel, 2000);
    const rainfallInterval = setInterval(generateRainfall, 3000);
    const cityInterval = setInterval(generateCityData, 5000);
    const radarInterval = setInterval(generateRadarData, 4000);
    const alertInterval = setInterval(generateAlerts, 8000);
    const statsInterval = setInterval(updateStats, 3000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(waterInterval);
      clearInterval(rainfallInterval);
      clearInterval(cityInterval);
      clearInterval(radarInterval);
      clearInterval(alertInterval);
      clearInterval(statsInterval);
      clearInterval(timeInterval);
    };
  }, [generateWaterLevel, generateRainfall, generateCityData, generateRadarData, generateAlerts, updateStats]);

  return (
    <div className="live-monitoring">
      <div className="monitoring-header">
        <div className="header-content">
          <h1>🔴 LIVE 24/7 Monitoring</h1>
          <div className="live-indicator">
            <span className="pulse-dot"></span>
            <span>LIVE</span>
          </div>
        </div>
        <div className="current-time">
          {currentTime.toLocaleString()}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card vibrant-blue">
          <div className="stat-icon">
            <Droplets size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.avgWaterLevel}m</h3>
            <p>Avg Water Level</p>
          </div>
          <div className="stat-trend">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="stat-card vibrant-purple">
          <div className="stat-icon">
            <Wind size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalRainfall}mm</h3>
            <p>Total Rainfall</p>
          </div>
          <div className="stat-trend">
            <Activity size={20} />
          </div>
        </div>

        <div className="stat-card vibrant-orange">
          <div className="stat-icon">
            <AlertTriangle size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.activeAlerts}</h3>
            <p>Active Alerts</p>
          </div>
          <div className="stat-trend pulse">
            <Zap size={20} />
          </div>
        </div>

        <div className="stat-card vibrant-green">
          <div className="stat-icon">
            <MapPin size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.citiesMonitored}</h3>
            <p>Cities Monitored</p>
          </div>
          <div className="stat-trend">
            <Activity size={20} />
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card vibrant-card">
          <div className="chart-header">
            <h3>🌊 Real-Time Water Levels</h3>
            <span className="live-badge">LIVE</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={waterLevels}>
              <defs>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorWater)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card vibrant-card">
          <div className="chart-header">
            <h3>🌧️ Rainfall Intensity</h3>
            <span className="live-badge">LIVE</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={rainfall}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card vibrant-card">
          <div className="chart-header">
            <h3>🏙️ City Risk Levels</h3>
            <span className="live-badge">LIVE</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="city" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="risk" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card vibrant-card">
          <div className="chart-header">
            <h3>📡 Multi-Sensor Radar</h3>
            <span className="live-badge">LIVE</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis dataKey="metric" stroke="#fff" fontSize={11} />
              <PolarRadiusAxis stroke="#fff" />
              <Radar name="Sensors" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="alerts-section">
        <div className="alerts-header">
          <h3>🚨 Live Alerts Feed</h3>
          <span className="alert-count">{alerts.length} Active</span>
        </div>
        <div className="alerts-list">
          {alerts.map(alert => (
            <div key={alert.id} className="alert-item" style={{ borderLeftColor: alert.color }}>
              <div className="alert-badge" style={{ background: alert.color }}>
                {alert.type}
              </div>
              <div className="alert-content">
                <p>{alert.message}</p>
                <span className="alert-time">{alert.time}</span>
              </div>
              <div className="alert-pulse" style={{ background: alert.color }}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="video-simulation">
        <div className="video-header">
          <h3>📹 Live Satellite Feed</h3>
          <span className="recording-badge">● REC</span>
        </div>
        <div className="video-container">
          <div className="video-overlay">
            <div className="scan-line"></div>
            <div className="grid-overlay"></div>
          </div>
          <div className="video-stats">
            <div className="video-stat">
              <span>FPS:</span>
              <strong>60</strong>
            </div>
            <div className="video-stat">
              <span>Quality:</span>
              <strong>4K</strong>
            </div>
            <div className="video-stat">
              <span>Latency:</span>
              <strong>12ms</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
