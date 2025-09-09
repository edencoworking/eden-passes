import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import edenLogo from '../assets/eden-logo.svg';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <img src={edenLogo} alt="Eden Coworking" className="logo" />
        <div className="brand-text">
          <span className="brand-title">Eden Passes</span>
          <span className="brand-subtitle">Management System</span>
        </div>
      </div>
      
      <div className="nav-links">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        <Link 
          to="/passes" 
          className={`nav-link ${isActive('/passes') ? 'active' : ''}`}
        >
          <span className="nav-icon">🎫</span>
          Passes
        </Link>
        <Link 
          to="/guests" 
          className={`nav-link ${isActive('/guests') ? 'active' : ''}`}
        >
          <span className="nav-icon">👥</span>
          Guests
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;