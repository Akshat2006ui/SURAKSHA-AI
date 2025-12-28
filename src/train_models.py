"""
ML Model Training Pipeline - Random Forest + LSTM
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

class FloodModelTrainer:
    def __init__(self):
        self.rf_model = None
        self.lstm_model = None
    
    def train_random_forest(self, X, y):
        """Train Random Forest for flood risk classification"""
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        self.rf_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        
        self.rf_model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.rf_model.predict(X_test)
        print("Random Forest Performance:")
        print(classification_report(y_test, y_pred))
        
        return self.rf_model
    
    def train_lstm(self, X_seq, y_seq, timesteps=7, features=4):
        """Train LSTM for time-series flood forecasting"""
        X_train, X_test, y_train, y_test = train_test_split(
            X_seq, y_seq, test_size=0.2, random_state=42
        )
        
        self.lstm_model = Sequential([
            LSTM(64, activation='relu', input_shape=(timesteps, features), return_sequences=True),
            Dropout(0.2),
            LSTM(32, activation='relu'),
            Dropout(0.2),
            Dense(16, activation='relu'),
            Dense(1, activation='sigmoid')
        ])
        
        self.lstm_model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        self.lstm_model.fit(
            X_train, y_train,
            epochs=20,
            batch_size=32,
            validation_split=0.2,
            verbose=1
        )
        
        # Evaluate
        loss, accuracy = self.lstm_model.evaluate(X_test, y_test)
        print(f"LSTM Performance - Loss: {loss:.4f}, Accuracy: {accuracy:.4f}")
        
        return self.lstm_model
    
    def save_models(self, rf_path='models/rf_model.pkl', lstm_path='models/lstm_model.h5'):
        """Save trained models"""
        if self.rf_model:
            joblib.dump(self.rf_model, rf_path)
            print(f"Random Forest saved to {rf_path}")
        
        if self.lstm_model:
            self.lstm_model.save(lstm_path)
            print(f"LSTM saved to {lstm_path}")

if __name__ == "__main__":
    # Example usage
    print("Model training pipeline ready. Load your data and call train methods.")
