import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Guests.css';

const API_BASE = 'http://localhost:3001/api';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/guests`);
      setGuests(response.data);
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGuest) {
        await axios.put(`${API_BASE}/guests/${editingGuest.id}`, formData);
      } else {
        await axios.post(`${API_BASE}/guests`, formData);
      }
      
      await fetchGuests();
      resetForm();
    } catch (err) {
      console.error('Error saving guest:', err);
      if (err.response?.status === 409) {
        alert('Email already exists. Please use a different email.');
      } else {
        alert('Failed to save guest. Please try again.');
      }
    }
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      email: guest.email,
      phone: guest.phone || '',
      company: guest.company || '',
      notes: guest.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) return;
    
    try {
      await axios.delete(`${API_BASE}/guests/${id}`);
      await fetchGuests();
    } catch (err) {
      console.error('Error deleting guest:', err);
      if (err.response?.status === 409) {
        alert('Cannot delete guest with existing passes. Please remove or reassign passes first.');
      } else {
        alert('Failed to delete guest. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      notes: ''
    });
    setEditingGuest(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="guests"><div className="loading">Loading guests...</div></div>;
  }

  if (error) {
    return (
      <div className="guests">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchGuests} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="guests">
      <div className="guests-header">
        <h1>Guests Management</h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          ➕ Add New Guest
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="guest-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input 
                    type="text" 
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes or preferences..."
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGuest ? 'Update Guest' : 'Create Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="guests-content">
        {guests.length > 0 ? (
          <div className="guests-grid">
            {guests.map((guest) => (
              <div key={guest.id} className="guest-card">
                <div className="guest-header">
                  <div className="guest-avatar">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="guest-info">
                    <h3 className="guest-name">{guest.name}</h3>
                    <p className="guest-email">{guest.email}</p>
                  </div>
                </div>
                
                <div className="guest-details">
                  {guest.phone && (
                    <div className="detail-item">
                      <span className="detail-label">📞 Phone:</span>
                      <span className="detail-value">{guest.phone}</span>
                    </div>
                  )}
                  {guest.company && (
                    <div className="detail-item">
                      <span className="detail-label">🏢 Company:</span>
                      <span className="detail-value">{guest.company}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">📅 Member since:</span>
                    <span className="detail-value">{formatDate(guest.created_at)}</span>
                  </div>
                  {guest.notes && (
                    <div className="detail-item">
                      <span className="detail-label">📝 Notes:</span>
                      <span className="detail-value">{guest.notes}</span>
                    </div>
                  )}
                </div>

                <div className="guest-stats">
                  <div className="stat">
                    <span className="stat-number">{guest.total_passes || 0}</span>
                    <span className="stat-label">Total Passes</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{guest.active_passes || 0}</span>
                    <span className="stat-label">Active Passes</span>
                  </div>
                </div>

                <div className="guest-actions">
                  <button 
                    onClick={() => handleEdit(guest)}
                    className="btn btn-sm btn-secondary"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(guest.id)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No guests found</h3>
            <p>Add your first guest to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests;