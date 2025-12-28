"""
Generate sample CSV datasets for testing SURAKSHA AI
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_sample_datasets():
    # Indian cities with coordinates
    cities_data = [
        ('Mumbai', 'Maharashtra', 19.0760, 72.8777),
        ('Delhi', 'Delhi', 28.7041, 77.1025),
        ('Kolkata', 'West Bengal', 22.5726, 88.3639),
        ('Chennai', 'Tamil Nadu', 13.0827, 80.2707),
        ('Bangalore', 'Karnataka', 12.9716, 77.5946),
        ('Hyderabad', 'Telangana', 17.3850, 78.4867),
        ('Ahmedabad', 'Gujarat', 23.0225, 72.5714),
        ('Pune', 'Maharashtra', 18.5204, 73.8567),
        ('Surat', 'Gujarat', 21.1702, 72.8311),
        ('Jaipur', 'Rajasthan', 26.9124, 75.7873),
    ]
    
    # Generate location mapping
    locations = pd.DataFrame(cities_data, columns=['city', 'state', 'latitude', 'longitude'])
    locations.to_csv('data/locations.csv', index=False)
    print("✓ Generated locations.csv")
    
    # Generate time series data
    start_date = datetime(2024, 1, 1)
    dates = [start_date + timedelta(days=i) for i in range(365)]
    
    rainfall_data = []
    river_data = []
    flood_data = []
    
    for date in dates:
        for city, state, lat, lon in cities_data:
            # Simulate monsoon season (June-September)
            month = date.month
            is_monsoon = 6 <= month <= 9
            
            # Rainfall (mm)
            base_rainfall = 50 if is_monsoon else 10
            rainfall = max(0, np.random.normal(base_rainfall, 20))
            
            rainfall_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'city': city,
                'rainfall': round(rainfall, 2)
            })
            
            # River level (meters)
            base_level = 5 if is_monsoon else 2
            river_level = max(0, np.random.normal(base_level, 1.5))
            
            river_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'city': city,
                'river_level': round(river_level, 2)
            })
            
            # Flood occurrence (binary)
            flood_prob = 0.15 if (rainfall > 80 and river_level > 7) else 0.02
            flood_occurred = 1 if np.random.random() < flood_prob else 0
            
            if flood_occurred:
                flood_data.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'city': city,
                    'flood_occurred': 1,
                    'severity': np.random.choice(['minor', 'moderate', 'severe'])
                })
    
    # Save datasets
    pd.DataFrame(rainfall_data).to_csv('data/rainfall.csv', index=False)
    print("✓ Generated rainfall.csv")
    
    pd.DataFrame(river_data).to_csv('data/river_levels.csv', index=False)
    print("✓ Generated river_levels.csv")
    
    pd.DataFrame(flood_data).to_csv('data/flood_records.csv', index=False)
    print("✓ Generated flood_records.csv")
    
    print("\n✅ All sample datasets generated successfully!")

if __name__ == "__main__":
    generate_sample_datasets()
