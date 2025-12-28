"""
Data Processing & Feature Engineering for SURAKSHA AI
"""
import pandas as pd
import numpy as np

class FloodDataProcessor:
    def __init__(self):
        self.features = []
    
    def load_data(self, rainfall_path, river_path, flood_path, location_path):
        """Load all datasets"""
        self.rainfall = pd.read_csv(rainfall_path)
        self.river_levels = pd.read_csv(river_path)
        self.flood_records = pd.read_csv(flood_path)
        self.locations = pd.read_csv(location_path)
        return self
    
    def engineer_features(self, df):
        """Create rolling windows and river rise detection"""
        # Rolling rainfall windows
        df['rainfall_3day'] = df.groupby('city')['rainfall'].transform(
            lambda x: x.rolling(window=3, min_periods=1).sum()
        )
        df['rainfall_7day'] = df.groupby('city')['rainfall'].transform(
            lambda x: x.rolling(window=7, min_periods=1).sum()
        )
        
        # River rise detection
        df['river_rise'] = df.groupby('city')['river_level'].transform(
            lambda x: x.diff().fillna(0)
        )
        
        # Flood probability score (simple heuristic)
        df['flood_score'] = (
            (df['rainfall_3day'] / 100) * 0.4 +
            (df['river_level'] / 10) * 0.4 +
            (df['river_rise'] / 2) * 0.2
        ).clip(0, 1)
        
        return df
    
    def prepare_training_data(self):
        """Merge datasets and prepare features for ML"""
        # Merge datasets
        data = self.rainfall.merge(self.river_levels, on=['date', 'city'])
        data = data.merge(self.flood_records, on=['date', 'city'], how='left')
        data = data.merge(self.locations, on='city')
        
        # Engineer features
        data = self.engineer_features(data)
        
        # Fill missing flood labels
        data['flood_occurred'] = data['flood_occurred'].fillna(0)
        
        return data
    
    def create_sequences(self, data, feature_cols, timesteps=7):
        """Create time-series sequences for LSTM"""
        sequences = []
        labels = []
        
        for city in data['city'].unique():
            city_data = data[data['city'] == city].sort_values('date')
            
            for i in range(len(city_data) - timesteps):
                seq = city_data[feature_cols].iloc[i:i+timesteps].values
                label = city_data['flood_occurred'].iloc[i+timesteps]
                
                sequences.append(seq)
                labels.append(label)
        
        return np.array(sequences), np.array(labels)
