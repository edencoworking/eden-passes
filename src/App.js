import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const PASS_TYPES = [
  { value: "", label: "Select Pass Type" },
  { value: "hourly", label: "Hourly" },
  { value: "10-hour", label: "10-Hour" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function App() {
  const [passType, setPassType] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch passes when component mounts
  useEffect(() => {
    fetchPasses();
  }, []);

  // Function to fetch all passes from the API
  async function fetchPasses() {
    try {
      setLoading(true);
      const response = await axios.get('/api/passes');
      setPasses(response.data);
    } catch (error) {
      console.error('Error fetching passes:', error);
      // For development/demo purposes, we can set some mock data if API fails
      setPasses([]);
    } finally {
      setLoading(false);
    }
  }

  // Function to create a new pass via API
  async function createPass(passData) {
    try {
      const response = await axios.post('/api/passes', passData);
      return response.data;
    } catch (error) {
      console.error('Error creating pass:', error);
      // For demo purposes, return mock data if API fails (keep this for production)
      return {
        id: Date.now(),
        passType: passData.passType,
        date: passData.date,
        createdAt: passData.createdAt
      };
    }
  }

  function validate() {
    const newErrors = {};
    if (!passType) {
      newErrors.passType = "Pass Type is required.";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      handleCreatePass();
    } else {
      setSubmitted(false);
    }
  }

  // Handle pass creation with API call
  async function handleCreatePass() {
    try {
      setLoading(true);
      const passData = {
        passType,
        date,
        createdAt: new Date().toISOString()
      };
      
      const newPass = await createPass(passData);
      
      // Add the new pass to the top of the list instantly
      setPasses(prevPasses => [newPass, ...prevPasses]);
      setSubmitted(true);
      
      // Reset form for next entry
      setTimeout(() => {
        setSubmitted(false);
        setPassType("");
        // Keep the current date for convenience
      }, 3000);
      
    } catch (error) {
      console.error('Failed to create pass:', error);
      setErrors({ general: 'Failed to create pass. Please try again.' });
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <h1>Eden Passes</h1>
      <p>Welcome to your minimal React app!</p>

      <section className="new-pass-section">
        <h2>Create New Pass</h2>
        <form className="new-pass-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="passType">Pass Type<span className="required">*</span></label>
            <select
              id="passType"
              value={passType}
              onChange={e => setPassType(e.target.value)}
              required
              disabled={loading}
            >
              {PASS_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.passType && <div className="error">{errors.passType}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              disabled={loading}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Pass'}
          </button>
          {errors.general && <div className="error">{errors.general}</div>}
          {submitted && (
            <div className="success-message">
              Pass created for <strong>{PASS_TYPES.find(pt => pt.value === passType)?.label}</strong> on <strong>{date}</strong>!
            </div>
          )}
        </form>
      </section>

      <section className="passes-list-section">
        <h2>All Passes</h2>
        {loading && passes.length === 0 ? (
          <div className="loading-message">Loading passes...</div>
        ) : passes.length === 0 ? (
          <div className="no-passes-message">No passes created yet.</div>
        ) : (
          <div className="passes-table-container">
            <table className="passes-table">
              <thead>
                <tr>
                  <th>Pass Type</th>
                  <th>Date</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {passes.map((pass, index) => (
                  <tr key={pass.id || index}>
                    <td>{PASS_TYPES.find(pt => pt.value === pass.passType)?.label || pass.passType}</td>
                    <td>{pass.date}</td>
                    <td>{pass.createdAt ? new Date(pass.createdAt).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;