import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, User, LogOut } from 'lucide-react';
import GoogleLogin from './GoogleLogin';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/live', label: '🔴 Live 24/7' },
    { path: '/tv', label: '📺 Live TV' },
    { path: '/satellite', label: '🛰️ Satellite' },
    { path: '/news', label: '📰 News' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/about', label: 'About' }
  ];

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <Activity size={28} />
            <span>SURAKSHA</span>
          </Link>

          <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {user ? (
              <div className="user-menu">
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span className="user-name">{user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                <User size={18} />
                Login
              </button>
            )}
          </div>

          <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </nav>

      {showLogin && (
        <GoogleLogin 
          onClose={() => setShowLogin(false)} 
          onLogin={handleLogin}
        />
      )}
    </>
  );
};

export default Navbar;
