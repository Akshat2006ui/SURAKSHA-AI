"""
Geospatial Simulation Generator using Plotly
"""
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

class FloodSimulation:
    def __init__(self, data_path=None):
        self.data = None
        self.rf_model = None
        self.alert_data = []
        if data_path:
            self.data = pd.read_csv(data_path)
    
    def load_models(self, rf_path, lstm_path):
        """Load trained ML models"""
        import joblib
        try:
            self.rf_model = joblib.load(rf_path)
        except:
            print("  ⚠ Could not load models, using simulated predictions")
    
    def generate_sample_data(self, num_cities=20, num_timesteps=50):
        """Generate sample simulation data with ML predictions"""
        # Real Indian cities
        real_cities = [
            ('Mumbai', 19.0760, 72.8777),
            ('Delhi', 28.7041, 77.1025),
            ('Kolkata', 22.5726, 88.3639),
            ('Chennai', 13.0827, 80.2707),
            ('Bangalore', 12.9716, 77.5946),
            ('Hyderabad', 17.3850, 78.4867),
            ('Ahmedabad', 23.0225, 72.5714),
            ('Pune', 18.5204, 73.8567),
            ('Surat', 21.1702, 72.8311),
            ('Jaipur', 26.9124, 75.7873),
            ('Lucknow', 26.8467, 80.9462),
            ('Kanpur', 26.4499, 80.3319),
            ('Nagpur', 21.1458, 79.0882),
            ('Indore', 22.7196, 75.8577),
            ('Bhopal', 23.2599, 77.4126),
            ('Patna', 25.5941, 85.1376),
            ('Vadodara', 22.3072, 73.1812),
            ('Ghaziabad', 28.6692, 77.4538),
            ('Ludhiana', 30.9010, 75.8573),
            ('Agra', 27.1767, 78.0081),
        ]
        
        cities = [c[0] for c in real_cities[:num_cities]]
        lats = [c[1] for c in real_cities[:num_cities]]
        lons = [c[2] for c in real_cities[:num_cities]]
        
        data = []
        for t in range(num_timesteps):
            for i, city in enumerate(cities):
                # Simulate realistic patterns
                base_risk = 0.15 + (t / num_timesteps) * 0.6
                seasonal = 0.2 * np.sin(t / 10)  # Seasonal variation
                noise = np.random.normal(0, 0.08)
                
                rainfall = max(0, 30 + base_risk * 80 + np.random.normal(0, 15))
                river_level = max(0, 2 + base_risk * 8 + np.random.normal(0, 1))
                
                # Use ML model if available
                if self.rf_model:
                    features = [rainfall, river_level, rainfall * 0.8, rainfall * 0.6, 0.5]
                    try:
                        risk = self.rf_model.predict_proba([features])[0][1]
                    except:
                        risk = np.clip(base_risk + seasonal + noise, 0, 1)
                else:
                    risk = np.clip(base_risk + seasonal + noise, 0, 1)
                
                data.append({
                    'timestep': t,
                    'city': city,
                    'lat': lats[i],
                    'lon': lons[i],
                    'flood_risk': risk,
                    'rainfall': round(rainfall, 1),
                    'river_level': round(river_level, 2)
                })
        
        self.data = pd.DataFrame(data)
        return self.data
    
    def generate_alert_data(self):
        """Generate alert data for voice agent"""
        if self.data is None:
            return
        
        # Get high-risk events
        high_risk = self.data[self.data['flood_risk'] >= 0.6].copy()
        
        alerts = []
        for _, row in high_risk.iterrows():
            risk_level = 'SEVERE' if row['flood_risk'] >= 0.8 else 'HIGH'
            alerts.append({
                'timestep': row['timestep'],
                'city': row['city'],
                'risk_level': risk_level,
                'probability': row['flood_risk'],
                'rainfall': row['rainfall'],
                'river_level': row['river_level']
            })
        
        # Save for JavaScript
        alert_df = pd.DataFrame(alerts)
        alert_df.to_json('visualization/alerts.json', orient='records')
        self.alert_data = alerts
        print(f"  ✓ Generated {len(alerts)} alert events")
    
    def create_animated_map(self, output_path='visualization/flood_map.html'):
        """Create animated geospatial visualization"""
        if self.data is None:
            self.generate_sample_data()
        
        # Add risk categories
        self.data['risk_level'] = pd.cut(
            self.data['flood_risk'],
            bins=[0, 0.4, 0.6, 0.8, 1.0],
            labels=['LOW', 'MODERATE', 'HIGH', 'SEVERE']
        )
        
        # Create animated scatter map
        fig = px.scatter_map(
            self.data,
            lat='lat',
            lon='lon',
            color='flood_risk',
            size='flood_risk',
            animation_frame='timestep',
            hover_name='city',
            hover_data={
                'flood_risk': ':.2%',
                'rainfall': ':.1f',
                'river_level': ':.2f',
                'lat': False,
                'lon': False
            },
            color_continuous_scale=['green', 'yellow', 'orange', 'red'],
            range_color=[0, 1],
            zoom=4,
            center={'lat': 20, 'lon': 78},
            title='SURAKSHA AI - Real-Time Flood Risk Simulation'
        )
        
        fig.update_layout(
            height=700,
            font=dict(size=14),
            mapbox_style='open-street-map'
        )
        
        fig.write_html(output_path)
        print(f"Simulation saved to {output_path}")
        return fig

if __name__ == "__main__":
    sim = FloodSimulation()
    sim.generate_sample_data()
    sim.create_animated_map()
