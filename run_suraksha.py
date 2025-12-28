"""
SURAKSHA AI - Main Execution Script
Run this to generate simulation and launch dashboard
"""
import os
import sys
import webbrowser
from pathlib import Path

def setup_directories():
    """Create necessary directories"""
    dirs = ['data', 'models', 'visualization']
    for d in dirs:
        Path(d).mkdir(exist_ok=True)
    print("✓ Directories ready")

def generate_sample_data():
    """Generate sample datasets if not present"""
    if not os.path.exists('data/locations.csv'):
        print("\n📊 Generating sample datasets...")
        from data.sample_data_generator import generate_sample_datasets
        generate_sample_datasets()
    else:
        print("✓ Data files found")

def train_ml_models():
    """Train ML models if not present"""
    if not os.path.exists('models/rf_model.pkl'):
        print("\n🤖 Training ML models...")
        from src.data_processing import FloodDataProcessor
        from src.train_models import FloodModelTrainer
        
        # Load and process data
        processor = FloodDataProcessor()
        processor.load_data(
            'data/rainfall.csv',
            'data/river_levels.csv', 
            'data/flood_records.csv',
            'data/locations.csv'
        )
        data = processor.prepare_training_data()
        
        # Prepare features
        feature_cols = ['rainfall', 'river_level', 'rainfall_3day', 'rainfall_7day', 'river_rise']
        X = data[feature_cols].fillna(0)
        y = data['flood_occurred']
        
        # Train models
        trainer = FloodModelTrainer()
        trainer.train_random_forest(X, y)
        
        # Prepare LSTM sequences
        X_seq, y_seq = processor.create_sequences(data, feature_cols, timesteps=7)
        trainer.train_lstm(X_seq, y_seq, timesteps=7, features=len(feature_cols))
        
        trainer.save_models()
        print("✓ Models trained and saved")
    else:
        print("✓ ML models found")

def run_simulation():
    """Generate flood simulation with ML predictions"""
    print("\n🗺️ Generating AI-powered geospatial simulation...")
    from src.simulation import FloodSimulation
    
    sim = FloodSimulation()
    
    # Use ML models if available
    if os.path.exists('models/rf_model.pkl'):
        sim.load_models('models/rf_model.pkl', 'models/lstm_model.h5')
        print("  ✓ ML models loaded")
    
    sim.generate_sample_data(num_cities=20, num_timesteps=80)
    sim.create_animated_map()
    sim.generate_alert_data()
    print("✓ Simulation generated with AI predictions")

def launch_dashboard():
    """Open dashboard in browser"""
    dashboard_path = os.path.abspath('visualization/dashboard.html')
    
    if os.path.exists(dashboard_path):
        print("\n🚀 Launching SURAKSHA AI Dashboard...")
        webbrowser.open(f'file://{dashboard_path}')
        print("✓ Dashboard opened in browser")
        print("\n" + "="*60)
        print("SURAKSHA AI is now running!")
        print("="*60)
        print("\n📌 Features:")
        print("  • Click 'Play Simulation' to start animation")
        print("  • Enable 'Voice Agent' for audio alerts")
        print("  • Switch between English/Hindi narration")
        print("  • Watch real-time flood risk predictions")
        print("\n⚠️  Note: Voice agent requires browser permissions")
    else:
        print("❌ Dashboard file not found. Run simulation first.")

def main():
    print("="*60)
    print("🌧️  SURAKSHA AI - Flood Risk Prediction System")
    print("="*60)
    
    try:
        setup_directories()
        generate_sample_data()
        train_ml_models()
        run_simulation()
        launch_dashboard()
        
        print("\n💡 Pro Tips:")
        print("  • Voice agent works best in Chrome/Edge")
        print("  • Grant microphone permissions when prompted")
        print("  • Severe alerts trigger emergency siren")
        print("  • Animation shows 80 timesteps of predictions")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        print("\nMake sure you've installed dependencies:")
        print("  pip install -r requirements.txt")
        sys.exit(1)

if __name__ == "__main__":
    main()
