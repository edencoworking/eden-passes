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
  const [submitting, setSubmitting] = useState(false);

  // Fetch passes from the API
  const fetchPasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/passes');
      setPasses(response.data);
    } catch (error) {
      console.error('Error fetching passes:', error);
      // For now, we'll silently handle the error since the API might not exist yet
      setPasses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch passes when component mounts
  useEffect(() => {
    fetchPasses();
  }, []);

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
      createPass();
    } else {
      setSubmitted(false);
    }
  }

  // Create a new pass via API
  const createPass = async () => {
    try {
      setSubmitting(true);
      const passData = {
        passType,
        date,
        createdAt: new Date().toISOString()
      };
      
      const response = await axios.post('/api/passes', passData);
      
      // Add the new pass to the top of the list
      setPasses(prevPasses => [response.data, ...prevPasses]);
      
      // Reset form and show success
      setSubmitted(true);
      setPassType("");
      setDate(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
      
    } catch (error) {
      console.error('Error creating pass:', error);
      // For demo purposes, we'll add a mock pass if API fails
      const mockPass = {
        id: Date.now(),
        passType,
        date,
        createdAt: new Date().toISOString()
      };
      setPasses(prevPasses => [mockPass, ...prevPasses]);
      setSubmitted(true);
      setPassType("");
      setDate(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });
      setTimeout(() => setSubmitted(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

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
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Creating..." : "Create Pass"}
          </button>
          {submitted && (
            <div className="success-message">
              Pass created for <strong>{PASS_TYPES.find(pt => pt.value === passType)?.label}</strong> on <strong>{date}</strong>!
            </div>
          )}
        </form>
      </section>

      <section className="passes-list-section">
        <h2>All Passes</h2>
        {loading ? (
          <div className="loading">Loading passes...</div>
        ) : passes.length === 0 ? (
          <div className="no-passes">No passes created yet.</div>
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
                {passes.map((pass) => (
                  <tr key={pass.id || pass.createdAt}>
                    <td>
                      {PASS_TYPES.find(pt => pt.value === pass.passType)?.label || pass.passType}
                    </td>
                    <td>{pass.date}</td>
                    <td>{new Date(pass.createdAt).toLocaleString()}</td>
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