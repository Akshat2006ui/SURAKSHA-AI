import { useState, useEffect } from 'react';
import { Satellite, Globe, Layers, Zap, MapPin, Camera, Radar } from 'lucide-react';
import './SatelliteView.css';

const SatelliteView = () => {
  const [selectedLayer, setSelectedLayer] = useState('thermal');
  const [zoom, setZoom] = useState(5);
  const [rotation, setRotation] = useState(0);
  const [satelliteData, setSatelliteData] = useState([]);

  useEffect(() => {
    // Simulate satellite data updates
    const interval = setInterval(() => {
      const newData = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        lat: 15 + Math.random() * 15,
        lon: 70 + Math.random() * 20,
        intensity: Math.random() * 100,
        type: ['flood', 'rain', 'clear'][Math.floor(Math.random() * 3)]
      }));
      setSatelliteData(newData);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-rotate satellite view
    const rotateInterval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);

    return () => clearInterval(rotateInterval);
  }, []);

  const layers = [
    { id: 'thermal', name: 'Thermal Imaging', icon: Zap, color: '#ef4444' },
    { id: 'radar', name: 'Weather Radar', icon: Radar, color: '#3b82f6' },
    { id: 'optical', name: 'Optical View', icon: Camera, color: '#10b981' },
    { id: 'terrain', name: 'Terrain Map', icon: Layers, color: '#f59e0b' }
  ];

  const getMarkerColor = (type) => {
    switch(type) {
      case 'flood': return '#ef4444';
      case 'rain': return '#3b82f6';
      default: return '#10b981';
    }
  };

  return (
    <div className="satellite-page">
      <div className="satellite-container">
        <div className="satellite-header">
          <div className="header-left">
            <h1>🛰️ Satellite Monitoring</h1>
            <div className="live-badge-sat">
              <span className="pulse-dot-sat"></span>
              <span>LIVE FEED</span>
            </div>
          </div>
          <div className="satellite-info">
            <div className="info-item">
              <Globe size={20} />
              <span>Coverage: India</span>
            </div>
            <div className="info-item">
              <Satellite size={20} />
              <span>Altitude: 705km</span>
            </div>
          </div>
        </div>

        <div className="satellite-main">
          <div className="satellite-viewer">
            <div className="earth-container" style={{ transform: `rotate(${rotation}deg)` }}>
              <div className="earth-sphere">
                <div className="earth-glow"></div>
                <div className="earth-grid"></div>
                <div className="earth-clouds"></div>
                
                {satelliteData.map(point => (
                  <div
                    key={point.id}
                    className="satellite-marker"
                    style={{
                      left: `${(point.lon - 70) * 3}%`,
                      top: `${(point.lat - 15) * 3}%`,
                      background: getMarkerColor(point.type),
                      opacity: point.intensity / 100
                    }}
                  >
                    <div className="marker-pulse" style={{ borderColor: getMarkerColor(point.type) }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="satellite-overlay">
              <div className="scan-grid"></div>
              <div className="crosshair">
                <div className="crosshair-h"></div>
                <div className="crosshair-v"></div>
              </div>
            </div>

            <div className="satellite-controls">
              <div className="zoom-controls">
                <button onClick={() => setZoom(Math.min(zoom + 1, 10))}>+</button>
                <span>Zoom: {zoom}x</span>
                <button onClick={() => setZoom(Math.max(zoom - 1, 1))}>-</button>
              </div>
              <div className="rotation-info">
                Rotation: {rotation.toFixed(1)}°
              </div>
            </div>
          </div>

          <div className="satellite-sidebar">
            <div className="layer-selector">
              <h3>Imaging Layers</h3>
              <div className="layers-list">
                {layers.map(layer => {
                  const Icon = layer.icon;
                  return (
                    <button
                      key={layer.id}
                      className={`layer-btn ${selectedLayer === layer.id ? 'active' : ''}`}
                      onClick={() => setSelectedLayer(layer.id)}
                      style={{ borderColor: selectedLayer === layer.id ? layer.color : 'transparent' }}
                    >
                      <Icon size={20} style={{ color: layer.color }} />
                      <span>{layer.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="detection-panel">
              <h3>🎯 Active Detections</h3>
              <div className="detections-list">
                <div className="detection-item flood">
                  <div className="detection-icon">🌊</div>
                  <div className="detection-info">
                    <h4>Flood Zone</h4>
                    <p>Mumbai - High Risk</p>
                    <span className="detection-time">2 min ago</span>
                  </div>
                </div>
                <div className="detection-item rain">
                  <div className="detection-icon">🌧️</div>
                  <div className="detection-info">
                    <h4>Heavy Rainfall</h4>
                    <p>Chennai - Moderate</p>
                    <span className="detection-time">5 min ago</span>
                  </div>
                </div>
                <div className="detection-item clear">
                  <div className="detection-icon">☀️</div>
                  <div className="detection-info">
                    <h4>Clear Skies</h4>
                    <p>Delhi - Normal</p>
                    <span className="detection-time">8 min ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="satellite-stats">
              <h3>📊 Statistics</h3>
              <div className="stats-grid-sat">
                <div className="stat-box-sat">
                  <span className="stat-value">{satelliteData.length}</span>
                  <span className="stat-label">Active Points</span>
                </div>
                <div className="stat-box-sat">
                  <span className="stat-value">98%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat-box-sat">
                  <span className="stat-value">15s</span>
                  <span className="stat-label">Refresh Rate</span>
                </div>
                <div className="stat-box-sat">
                  <span className="stat-value">4K</span>
                  <span className="stat-label">Resolution</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="satellite-footer">
          <div className="footer-item">
            <MapPin size={16} />
            <span>Coordinates: 20.5937° N, 78.9629° E</span>
          </div>
          <div className="footer-item">
            <Camera size={16} />
            <span>Last Capture: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="footer-item">
            <Satellite size={16} />
            <span>Satellite: SURAKSHA-SAT-1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteView;
