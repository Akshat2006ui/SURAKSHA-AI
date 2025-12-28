import { useState, useEffect } from 'react';
import { Tv, Radio, Video, Users, Eye, Signal } from 'lucide-react';
import './LiveTV.css';

const LiveTV = () => {
  const [activeChannel, setActiveChannel] = useState(1);
  const [viewers, setViewers] = useState(1247);

  useEffect(() => {
    // Simulate viewer count changes
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const channels = [
    {
      id: 1,
      name: 'Main Feed',
      description: 'Primary monitoring station',
      location: 'Mumbai Central',
      status: 'live',
      viewers: 1247
    },
    {
      id: 2,
      name: 'Satellite View',
      description: 'Real-time satellite imagery',
      location: 'ISRO Station',
      status: 'live',
      viewers: 892
    },
    {
      id: 3,
      name: 'Drone Coverage',
      description: 'Aerial surveillance',
      location: 'Multiple Locations',
      status: 'live',
      viewers: 654
    },
    {
      id: 4,
      name: 'Emergency Ops',
      description: 'Command center feed',
      location: 'Control Room',
      status: 'live',
      viewers: 423
    }
  ];

  return (
    <div className="livetv-page">
      <div className="livetv-container">
        <div className="tv-header">
          <div className="header-left">
            <h1>📺 Live TV Broadcast</h1>
            <div className="live-badge-tv">
              <span className="pulse-dot-tv"></span>
              <span>LIVE</span>
            </div>
          </div>
          <div className="viewer-count">
            <Eye size={20} />
            <span>{viewers.toLocaleString()} watching</span>
          </div>
        </div>

        <div className="tv-main-content">
          <div className="video-player">
            <div className="video-screen">
              <div className="video-overlay-effects">
                <div className="scan-line-tv"></div>
                <div className="grid-overlay-tv"></div>
                <div className="vignette"></div>
              </div>
              
              <div className="video-info-overlay">
                <div className="channel-info">
                  <Signal size={16} />
                  <span>{channels[activeChannel - 1].name}</span>
                </div>
                <div className="location-info">
                  📍 {channels[activeChannel - 1].location}
                </div>
              </div>

              <div className="video-stats-overlay">
                <div className="stat-item-tv">
                  <span>Quality:</span>
                  <strong>4K UHD</strong>
                </div>
                <div className="stat-item-tv">
                  <span>FPS:</span>
                  <strong>60</strong>
                </div>
                <div className="stat-item-tv">
                  <span>Latency:</span>
                  <strong>8ms</strong>
                </div>
              </div>

              <div className="live-indicator-overlay">
                <div className="rec-dot"></div>
                <span>REC</span>
              </div>
            </div>

            <div className="video-controls">
              <button className="control-btn">
                <Radio size={20} />
                <span>Audio</span>
              </button>
              <button className="control-btn">
                <Video size={20} />
                <span>Quality</span>
              </button>
              <button className="control-btn">
                <Users size={20} />
                <span>Chat</span>
              </button>
              <button className="control-btn primary">
                <Tv size={20} />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>

          <div className="channels-sidebar">
            <h3>Available Channels</h3>
            <div className="channels-list">
              {channels.map(channel => (
                <div
                  key={channel.id}
                  className={`channel-card ${activeChannel === channel.id ? 'active' : ''}`}
                  onClick={() => setActiveChannel(channel.id)}
                >
                  <div className="channel-thumbnail">
                    <div className="thumbnail-overlay">
                      <Signal size={24} />
                    </div>
                    {channel.status === 'live' && (
                      <div className="live-badge-small">LIVE</div>
                    )}
                  </div>
                  <div className="channel-info-card">
                    <h4>{channel.name}</h4>
                    <p>{channel.description}</p>
                    <div className="channel-meta">
                      <span className="location">📍 {channel.location}</span>
                      <span className="viewers">
                        <Eye size={12} />
                        {channel.viewers}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="live-chat-section">
          <h3>💬 Live Chat</h3>
          <div className="chat-messages">
            <div className="chat-message">
              <span className="user">Admin</span>
              <span className="message">Welcome to SURAKSHA AI Live Broadcast</span>
              <span className="time">Just now</span>
            </div>
            <div className="chat-message">
              <span className="user">Viewer_123</span>
              <span className="message">Water levels looking stable in Mumbai</span>
              <span className="time">1 min ago</span>
            </div>
            <div className="chat-message">
              <span className="user">Emergency_Team</span>
              <span className="message">All systems operational. Monitoring continues.</span>
              <span className="time">2 min ago</span>
            </div>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Type a message..." />
            <button>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTV;
