"""
Complete ML Training Pipeline for SURAKSHA AI
Trains both Random Forest and LSTM models
"""
import os
import sys
from pathlib import Path

def ensure_directories():
    Path('models').mkdir(exist_ok=True)
    Path('data').mkdir(exist_ok=True)

def train_models():
    print("="*60)
    print("🤖 SURAKSHA AI - ML Model Training")
    print("="*60)
    
    # Generate data if needed
    if not os.path.exists('data/locations.csv'):
        print("\n📊 Generating training datasets...")
        from data.sample_data_generator import generate_sample_datasets
        generate_sample_datasets()
    
    print("\n📥 Loading and processing data...")
    from src.data_processing import FloodDataProcessor
    
    processor = FloodDataProcessor()
    processor.load_data(
        'data/rainfall.csv',
        'data/river_levels.csv',
        'data/flood_records.csv',
        'data/locations.csv'
    )
    
    data = processor.prepare_training_data()
    print(f"  ✓ Loaded {len(data)} records")
    print(f"  ✓ Features engineered: rolling windows, river rise detection")
    
    # Prepare features
    feature_cols = ['rainfall', 'river_level', 'rainfall_3day', 'rainfall_7day', 'river_rise']
    X = data[feature_cols].fillna(0)
    y = data['flood_occurred']
    
    print(f"\n🎯 Training data prepared:")
    print(f"  • Features: {len(feature_cols)}")
    print(f"  • Samples: {len(X)}")
    print(f"  • Flood events: {y.sum()}")
    
    # Train Random Forest
    print("\n🌲 Training Random Forest Classifier...")
    from src.train_models import FloodModelTrainer
    
    trainer = FloodModelTrainer()
    trainer.train_random_forest(X, y)
    
    # Train LSTM
    print("\n🧠 Training LSTM for time-series forecasting...")
    X_seq, y_seq = processor.create_sequences(data, feature_cols, timesteps=7)
    print(f"  • Sequences created: {len(X_seq)}")
    print(f"  • Timesteps: 7")
    
    trainer.train_lstm(X_seq, y_seq, timesteps=7, features=len(feature_cols))
    
    # Save models
    print("\n💾 Saving models...")
    trainer.save_models()
    
    print("\n" + "="*60)
    print("✅ Training Complete!")
    print("="*60)
    print("\nModels saved:")
    print("  • models/rf_model.pkl (Random Forest)")
    print("  • models/lstm_model.h5 (LSTM)")
    print("\nReady for predictions! Run: python run_suraksha.py")

if __name__ == "__main__":
    try:
        ensure_directories()
        train_models()
    except Exception as e:
        print(f"\n❌ Training failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
