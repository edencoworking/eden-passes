import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_BASE = 'http://localhost:3001/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    passes: { total: 0, active: 0, expired: 0, today: 0 },
    guests: { total: 0, withActivePasses: 0, newThisMonth: 0 }
  });
  const [recentPasses, setRecentPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [passStatsRes, guestStatsRes, passesRes] = await Promise.all([
        axios.get(`${API_BASE}/passes/stats/overview`),
        axios.get(`${API_BASE}/guests/stats/overview`),
        axios.get(`${API_BASE}/passes?limit=5`)
      ]);

      setStats({
        passes: passStatsRes.data,
        guests: guestStatsRes.data
      });
      setRecentPasses(passesRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPassStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-badge status-active',
      expired: 'status-badge status-expired',
      cancelled: 'status-badge status-cancelled'
    };
    return <span className={statusClasses[status] || 'status-badge'}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Eden Coworking Passes Management</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <h3>Total Passes</h3>
            <div className="stat-number">{stats.passes.total}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Active Passes</h3>
            <div className="stat-number">{stats.passes.active}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Guests</h3>
            <div className="stat-number">{stats.guests.total}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Today's Passes</h3>
            <div className="stat-number">{stats.passes.today}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Passes</h2>
        {recentPasses.length > 0 ? (
          <div className="table-container">
            <table className="passes-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPasses.map((pass) => (
                  <tr key={pass.id}>
                    <td>{pass.guest_name || 'Guest'}</td>
                    <td className="pass-type">{pass.type}</td>
                    <td>{formatDate(pass.start_date)}</td>
                    <td>{formatDate(pass.end_date)}</td>
                    <td>{getPassStatusBadge(pass.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No recent passes found</p>
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={fetchDashboardData} 
          className="btn btn-secondary"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;