import { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Generate mock news data
    const mockNews = [
      {
        id: 1,
        title: 'Heavy Rainfall Alert: Mumbai Braces for Monsoon Impact',
        category: 'alert',
        source: 'Weather Bureau',
        time: '2 hours ago',
        image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400',
        excerpt: 'Meteorological department issues red alert for Mumbai as heavy rainfall expected in next 48 hours...',
        priority: 'high'
      },
      {
        id: 2,
        title: 'AI-Powered Flood Prediction System Shows 95% Accuracy',
        category: 'technology',
        source: 'Tech Today',
        time: '5 hours ago',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        excerpt: 'New machine learning models demonstrate unprecedented accuracy in predicting flood events...',
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Chennai Successfully Evacuates 10,000 Residents',
        category: 'update',
        source: 'Emergency Services',
        time: '8 hours ago',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        excerpt: 'Coordinated evacuation effort saves thousands as water levels rise in low-lying areas...',
        priority: 'high'
      },
      {
        id: 4,
        title: 'IoT Sensors Network Expanded to 50 New Cities',
        category: 'technology',
        source: 'Infrastructure News',
        time: '12 hours ago',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400',
        excerpt: 'Government announces major expansion of real-time monitoring infrastructure...',
        priority: 'medium'
      },
      {
        id: 5,
        title: 'Flood Relief Operations: 24/7 Helpline Activated',
        category: 'update',
        source: 'Disaster Management',
        time: '1 day ago',
        image: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=400',
        excerpt: 'Emergency response teams on standby with round-the-clock support services...',
        priority: 'high'
      },
      {
        id: 6,
        title: 'Satellite Imagery Reveals Rising Water Levels in 15 Districts',
        category: 'alert',
        source: 'Space Agency',
        time: '1 day ago',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
        excerpt: 'Latest satellite data shows concerning trends in multiple regions...',
        priority: 'high'
      }
    ];

    setNews(mockNews);
  }, []);

  const categories = [
    { id: 'all', label: 'All News', icon: Newspaper },
    { id: 'alert', label: 'Alerts', icon: AlertCircle },
    { id: 'update', label: 'Updates', icon: TrendingUp },
    { id: 'technology', label: 'Technology', icon: Clock }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="news-page">
      <div className="news-container">
        <div className="news-header">
          <h1>📰 Latest News & Updates</h1>
          <p>Stay informed with real-time flood monitoring news</p>
        </div>

        <div className="category-filter">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon size={20} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="news-grid">
          {filteredNews.map(item => (
            <div key={item.id} className="news-card">
              <div className="news-image" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="news-badge" style={{ background: getPriorityColor(item.priority) }}>
                  {item.priority.toUpperCase()}
                </div>
              </div>
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-source">{item.source}</span>
                  <span className="news-time">
                    <Clock size={14} />
                    {item.time}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <button className="read-more-btn">
                  Read More
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="breaking-news-ticker">
          <div className="ticker-label">BREAKING</div>
          <div className="ticker-content">
            <span>🔴 Heavy rainfall warning issued for 5 districts • Water levels rising in Mumbai • Emergency services on high alert • 24/7 helpline: 1800-XXX-XXXX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
