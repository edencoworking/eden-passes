import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Passes.css';

const API_BASE = 'http://localhost:3001/api';

const Passes = () => {
  const [passes, setPasses] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPass, setEditingPass] = useState(null);
  const [formData, setFormData] = useState({
    type: 'day',
    start_date: '',
    end_date: '',
    guest_id: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [passesRes, guestsRes] = await Promise.all([
        axios.get(`${API_BASE}/passes`),
        axios.get(`${API_BASE}/guests`)
      ]);
      setPasses(passesRes.data);
      setGuests(guestsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        guest_id: formData.guest_id || null
      };

      if (editingPass) {
        await axios.put(`${API_BASE}/passes/${editingPass.id}`, submitData);
      } else {
        await axios.post(`${API_BASE}/passes`, submitData);
      }
      
      await fetchData();
      resetForm();
    } catch (err) {
      console.error('Error saving pass:', err);
      alert('Failed to save pass. Please try again.');
    }
  };

  const handleEdit = (pass) => {
    setEditingPass(pass);
    setFormData({
      type: pass.type,
      start_date: pass.start_date.split('T')[0],
      end_date: pass.end_date.split('T')[0],
      guest_id: pass.guest_id || '',
      status: pass.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pass?')) return;
    
    try {
      await axios.delete(`${API_BASE}/passes/${id}`);
      await fetchData();
    } catch (err) {
      console.error('Error deleting pass:', err);
      alert('Failed to delete pass. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'day',
      start_date: '',
      end_date: '',
      guest_id: '',
      status: 'active'
    });
    setEditingPass(null);
    setShowForm(false);
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
    return <div className="passes"><div className="loading">Loading passes...</div></div>;
  }

  if (error) {
    return (
      <div className="passes">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="passes">
      <div className="passes-header">
        <h1>Passes Management</h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          ➕ Add New Pass
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingPass ? 'Edit Pass' : 'Add New Pass'}</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="pass-form">
              <div className="form-group">
                <label>Type</label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="day">Day Pass</option>
                  <option value="week">Week Pass</option>
                  <option value="month">Month Pass</option>
                  <option value="annual">Annual Pass</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Guest (Optional)</label>
                <select 
                  value={formData.guest_id} 
                  onChange={(e) => setFormData({...formData, guest_id: e.target.value})}
                >
                  <option value="">Select a guest...</option>
                  {guests.map(guest => (
                    <option key={guest.id} value={guest.id}>
                      {guest.name} ({guest.email})
                    </option>
                  ))}
                </select>
              </div>

              {editingPass && (
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPass ? 'Update Pass' : 'Create Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="passes-content">
        {passes.length > 0 ? (
          <div className="table-container">
            <table className="passes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passes.map((pass) => (
                  <tr key={pass.id}>
                    <td>#{pass.id}</td>
                    <td>
                      {pass.guest_name ? (
                        <div>
                          <div className="guest-name">{pass.guest_name}</div>
                          <div className="guest-email">{pass.guest_email}</div>
                        </div>
                      ) : (
                        <span className="no-guest">No guest assigned</span>
                      )}
                    </td>
                    <td className="pass-type">{pass.type}</td>
                    <td>{formatDate(pass.start_date)}</td>
                    <td>{formatDate(pass.end_date)}</td>
                    <td>{getPassStatusBadge(pass.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEdit(pass)}
                          className="btn btn-sm btn-secondary"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(pass.id)}
                          className="btn btn-sm btn-danger"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No passes found</h3>
            <p>Create your first pass to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Passes;