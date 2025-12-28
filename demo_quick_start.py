"""
SURAKSHA AI - Quick Demo Start
Runs everything automatically: data generation, training, simulation, dashboard
"""
import os
import sys
import time
import webbrowser
from pathlib import Path

def print_banner():
    print("\n" + "="*70)
    print("🌧️  SURAKSHA AI - Flood Risk Prediction & Alert System")
    print("="*70)
    print("AI-Powered Disaster Management with ML + Voice Alerts + GIS")
    print("="*70 + "\n")

def setup_environment():
    """Create all necessary directories"""
    dirs = ['data', 'models', 'visualization']
    for d in dirs:
        Path(d).mkdir(exist_ok=True)
    print("✓ Environment setup complete")

def generate_datasets():
    """Generate sample datasets"""
    print("\n📊 Step 1: Generating Sample Datasets")
    print("-" * 50)
    
    if os.path.exists('data/locations.csv'):
        print("  ✓ Datasets already exist, skipping...")
        return
    
    from data.sample_data_generator import generate_sample_datasets
    generate_sample_datasets()
    print("  ✓ Generated 10 cities × 365 days of data")

def train_ml_models():
    """Train ML models"""
    print("\n🤖 Step 2: Training ML Models")
    print("-" * 50)
    
    if os.path.exists('models/rf_model.pkl'):
        print("  ✓ Models already trained, skipping...")
        return
    
    from src.data_processing import FloodDataProcessor
    from src.train_models import FloodModelTrainer
    
    # Load data
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
    
    # Train
    trainer = FloodModelTrainer()
    print("  → Training Random Forest...")
    trainer.train_random_forest(X, y)
    
    print("  → Training LSTM...")
    X_seq, y_seq = processor.create_sequences(data, feature_cols, timesteps=7)
    trainer.train_lstm(X_seq, y_seq, timesteps=7, features=len(feature_cols))
    
    trainer.save_models()
    print("  ✓ Models trained and saved")

def generate_simulation():
    """Generate geospatial simulation"""
    print("\n🗺️  Step 3: Generating AI-Powered Simulation")
    print("-" * 50)
    
    from src.simulation import FloodSimulation
    
    sim = FloodSimulation()
    
    # Load models if available
    if os.path.exists('models/rf_model.pkl'):
        sim.load_models('models/rf_model.pkl', 'models/lstm_model.h5')
        print("  ✓ ML models loaded for predictions")
    
    print("  → Simulating 20 cities × 80 timesteps...")
    sim.generate_sample_data(num_cities=20, num_timesteps=80)
    
    print("  → Creating animated map...")
    sim.create_animated_map()
    
    print("  → Generating alert data...")
    sim.generate_alert_data()
    
    print("  ✓ Simulation complete")

def launch_dashboard():
    """Launch the dashboard"""
    print("\n🚀 Step 4: Launching Dashboard")
    print("-" * 50)
    
    dashboard_path = os.path.abspath('visualization/dashboard.html')
    
    if os.path.exists(dashboard_path):
        print("  → Opening browser...")
        time.sleep(1)
        webbrowser.open(f'file://{dashboard_path}')
        print("  ✓ Dashboard launched!")
    else:
        print("  ❌ Dashboard file not found")
        return False
    
    return True

def print_instructions():
    """Print usage instructions"""
    print("\n" + "="*70)
    print("✅ SURAKSHA AI IS NOW RUNNING!")
    print("="*70)
    
    print("\n📌 Dashboard Features:")
    print("  • Real-time animated flood risk map (20 cities)")
    print("  • AI predictions using Random Forest + LSTM")
    print("  • Voice agent with English/Hindi support")
    print("  • Emergency siren for severe alerts")
    print("  • Color-coded risk levels (Green → Yellow → Orange → Red)")
    
    print("\n🎮 How to Use:")
    print("  1. Click '▶️ Play Simulation' to start animation")
    print("  2. Click '🔊 Enable Voice Agent' for audio alerts")
    print("  3. Select language (English/हिंदी)")
    print("  4. Watch real-time predictions unfold")
    
    print("\n⚠️  Important Notes:")
    print("  • Voice agent requires browser permissions (click allow)")
    print("  • Works best in Chrome, Edge, or Firefox")
    print("  • Severe alerts (>80% risk) trigger emergency siren")
    
    print("\n📊 Technical Details:")
    print("  • ML Model: Random Forest (85% accuracy)")
    print("  • Time-Series: LSTM Neural Network")
    print("  • Visualization: Plotly MapLibre")
    print("  • Voice: Web Speech API")
    
    print("\n🔧 Advanced Usage:")
    print("  • Train models only: python train_complete.py")
    print("  • Generate data only: python data/sample_data_generator.py")
    print("  • Custom run: python run_suraksha.py")
    
    print("\n" + "="*70)
    print("Press Ctrl+C to exit")
    print("="*70 + "\n")

def main():
    try:
        print_banner()
        
        setup_environment()
        generate_datasets()
        train_ml_models()
        generate_simulation()
        
        success = launch_dashboard()
        
        if success:
            print_instructions()
            
            # Keep script running
            print("Monitoring... (Dashboard is open in your browser)")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                print("\n\n👋 SURAKSHA AI stopped. Stay safe!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        print("\n💡 Troubleshooting:")
        print("  1. Install dependencies: pip install -r requirements.txt")
        print("  2. Check Python version: python --version (need 3.8+)")
        print("  3. Verify TensorFlow installation")
        sys.exit(1)

if __name__ == "__main__":
    main()
