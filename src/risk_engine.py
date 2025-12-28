"""
Risk Analytics Engine - Converts ML output to human-readable alerts
"""
import joblib
import numpy as np
from tensorflow import keras

class RiskAnalyticsEngine:
    def __init__(self, rf_model_path='models/rf_model.pkl', lstm_model_path='models/lstm_model.h5'):
        try:
            self.rf_model = joblib.load(rf_model_path)
            self.lstm_model = keras.models.load_model(lstm_model_path)
        except:
            print("Models not found. Train models first.")
            self.rf_model = None
            self.lstm_model = None
    
    def predict_risk(self, features):
        """Predict flood risk using Random Forest"""
        if self.rf_model is None:
            return 0.5  # Default moderate risk
        
        risk_prob = self.rf_model.predict_proba([features])[0][1]
        return risk_prob
    
    def forecast_timeseries(self, sequence):
        """Forecast using LSTM"""
        if self.lstm_model is None:
            return 0.5
        
        prediction = self.lstm_model.predict(np.array([sequence]), verbose=0)[0][0]
        return prediction
    
    def get_risk_level(self, probability):
        """Convert probability to risk category"""
        if probability >= 0.8:
            return "SEVERE", "red"
        elif probability >= 0.6:
            return "HIGH", "orange"
        elif probability >= 0.4:
            return "MODERATE", "yellow"
        else:
            return "LOW", "green"
    
    def generate_alert(self, city, probability, language='en'):
        """Generate human-readable alert message"""
        risk_level, color = self.get_risk_level(probability)
        
        alerts = {
            'en': {
                'SEVERE': f"⚠️ SEVERE FLOOD ALERT for {city}! Immediate evacuation recommended. Risk: {probability*100:.1f}%",
                'HIGH': f"🔴 HIGH flood risk in {city}. Prepare for evacuation. Risk: {probability*100:.1f}%",
                'MODERATE': f"🟡 MODERATE flood risk in {city}. Stay alert. Risk: {probability*100:.1f}%",
                'LOW': f"🟢 LOW flood risk in {city}. Situation normal. Risk: {probability*100:.1f}%"
            },
            'hi': {
                'SEVERE': f"⚠️ {city} में गंभीर बाढ़ चेतावनी! तुरंत निकासी की सिफारिश। जोखिम: {probability*100:.1f}%",
                'HIGH': f"🔴 {city} में उच्च बाढ़ जोखिम। निकासी के लिए तैयार रहें। जोखिम: {probability*100:.1f}%",
                'MODERATE': f"🟡 {city} में मध्यम बाढ़ जोखिम। सतर्क रहें। जोखिम: {probability*100:.1f}%",
                'LOW': f"🟢 {city} में कम बाढ़ जोखिम। स्थिति सामान्य। जोखिम: {probability*100:.1f}%"
            }
        }
        
        return alerts[language][risk_level], color
