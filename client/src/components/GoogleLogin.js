import { useState } from 'react';
import { User, Mail, Lock, Chrome } from 'lucide-react';
import './GoogleLogin.css';

const GoogleLogin = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      const user = {
        name: 'Demo User',
        email: 'demo@suraksha.ai',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=3b82f6&color=fff'
      };
      onLogin(user);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const user = {
        name: email.split('@')[0],
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=10b981&color=fff`
      };
      onLogin(user);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="login-header">
          <div className="login-logo">
            <User size={40} />
          </div>
          <h2>Welcome to SURAKSHA AI</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        <div className="login-content">
          <button className="google-login-btn" onClick={handleGoogleLogin} disabled={isLoading}>
            <Chrome size={20} />
            <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <form onSubmit={handleEmailLogin}>
            <div className="input-group">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="email-login-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
            </button>
          </form>

          <div className="login-footer">
            <a href="#forgot">Forgot password?</a>
            <span>•</span>
            <a href="#signup">Create account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;
