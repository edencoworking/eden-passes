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

  // Fetch passes from API when component mounts
  useEffect(() => {
    fetchPasses();
  }, []);

  async function fetchPasses() {
    try {
      setLoading(true);
      const response = await axios.get('/api/passes');
      setPasses(response.data);
    } catch (error) {
      console.error('Error fetching passes:', error);
      // In case API is not available, use empty array
      setPasses([]);
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    const newErrors = {};
    if (!passType) {
      newErrors.passType = "Pass Type is required.";
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const newPass = {
          passType,
          date,
          createdAt: new Date().toISOString()
        };
        
        // Create new pass via API
        const response = await axios.post('/api/passes', newPass);
        
        // Add the new pass to the top of the list
        setPasses(prevPasses => [response.data, ...prevPasses]);
        
        setSubmitted(true);
        // Reset form
        setPassType("");
        setDate(() => {
          const today = new Date();
          return today.toISOString().split("T")[0];
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
        
      } catch (error) {
        console.error('Error creating pass:', error);
        setErrors({ submit: 'Failed to create pass. Please try again.' });
      } finally {
        setLoading(false);
      }
    } else {
      setSubmitted(false);
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
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Pass'}
          </button>
          {errors.submit && <div className="error">{errors.submit}</div>}
          {submitted && (
            <div className="success-message">
              Pass created successfully!
            </div>
          )}
        </form>
      </section>

      <section className="passes-list-section">
        <h2>All Passes</h2>
        {loading && passes.length === 0 ? (
          <div className="loading">Loading passes...</div>
        ) : (
          <div className="passes-table-container">
            {passes.length === 0 ? (
              <p>No passes found.</p>
            ) : (
              <table className="passes-table">
                <thead>
                  <tr>
                    <th>Pass Type</th>
                    <th>Date</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {passes.map((pass, index) => (
                    <tr key={pass.id || index}>
                      <td>{PASS_TYPES.find(pt => pt.value === pass.passType)?.label || pass.passType}</td>
                      <td>{new Date(pass.date).toLocaleDateString()}</td>
                      <td>{new Date(pass.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;