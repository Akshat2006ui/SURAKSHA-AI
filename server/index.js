const express = require('express');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Get simulation data
app.get('/api/simulation', (req, res) => {
  const dataPath = path.join(__dirname, '../visualization/flood_map.html');
  
  if (fs.existsSync(dataPath)) {
    res.json({ 
      success: true, 
      message: 'Simulation data available',
      path: '/flood_map.html'
    });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Simulation not generated yet' 
    });
  }
});

// Get alert data
app.get('/api/alerts', (req, res) => {
  const alertPath = path.join(__dirname, '../visualization/alerts.json');
  
  if (fs.existsSync(alertPath)) {
    const alerts = JSON.parse(fs.readFileSync(alertPath, 'utf8'));
    res.json({ success: true, data: alerts });
  } else {
    res.json({ success: true, data: [] });
  }
});

// Get city data
app.get('/api/cities', (req, res) => {
  const citiesPath = path.join(__dirname, '../data/locations.csv');
  
  if (fs.existsSync(citiesPath)) {
    const data = fs.readFileSync(citiesPath, 'utf8');
    const lines = data.split('\n').slice(1); // Skip header
    const cities = lines.filter(line => line.trim()).map(line => {
      const [city, state, latitude, longitude] = line.split(',');
      return { city, state, latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    });
    res.json({ success: true, data: cities });
  } else {
    res.json({ success: true, data: [] });
  }
});

// Run Python simulation
app.post('/api/generate-simulation', (req, res) => {
  const pythonProcess = spawn('python', ['src/simulation.py']);
  
  let output = '';
  let error = '';
  
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });
  
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.json({ 
        success: true, 
        message: 'Simulation generated successfully',
        output 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate simulation',
        error 
      });
    }
  });
});

// Get model stats
app.get('/api/model-stats', (req, res) => {
  const stats = {
    randomForest: {
      accuracy: 0.85,
      precision: 0.83,
      recall: 0.87,
      f1Score: 0.85
    },
    lstm: {
      accuracy: 0.82,
      loss: 0.34,
      valAccuracy: 0.80,
      valLoss: 0.38
    },
    features: ['rainfall', 'river_level', 'rainfall_3day', 'rainfall_7day', 'river_rise'],
    citiesMonitored: 20,
    lastUpdated: new Date().toISOString()
  };
  
  res.json({ success: true, data: stats });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 SURAKSHA AI Server running on port ${PORT}`);
});
