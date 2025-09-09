import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const PASS_TYPES = [
  { value: "", label: "Select Pass Type" },
  { value: "hourly", label: "Hourly" },
  { value: "10-hour", label: "10-Hour" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function PassesPage() {
  const [passes, setPasses] = useState([]);
  const [passType, setPassType] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch passes list
  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const res = await axios.get('/api/passes');
        setPasses(res.data.reverse()); // Show newest first
      } catch (err) {
        console.error('Error fetching passes:', err);
      }
    };
    fetchPasses();
  }, []);

  // Validation
  function validate() {
    const newErrors = {};
    if (!passType) {
      newErrors.passType = "Pass Type is required.";
    }
    if (!date) {
      newErrors.date = "Date is required.";
    }
    return newErrors;
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const res = await axios.post('/api/passes', { type: passType, date });
        setPasses([res.data, ...passes]);
        setPassType("");
        setDate(new Date().toISOString().split("T")[0]);
        setSubmitted(true);
      } catch (err) {
        setErrors({ api: 'Error creating pass.' });
        setSubmitted(false);
      }
      setLoading(false);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div className="App">
      <h1>Eden Passes</h1>
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
            <label htmlFor="date">Date<span className="required">*</span></label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
            {errors.date && <div className="error">{errors.date}</div>}
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Pass'}
          </button>
          {submitted && (
            <div className="success-message">
              Pass created for <strong>{PASS_TYPES.find(pt => pt.value === passType)?.label}</strong> on <strong>{date}</strong>!
            </div>
          )}
          {errors.api && <div className="error">{errors.api}</div>}
        </form>
      </section>
      <section className="pass-list-section">
        <h3>All Passes</h3>
        <table border="0" cellPadding="8" style={{width: "100%", marginTop: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 1px 8px rgba(0,0,0,0.04)"}}>
          <thead>
            <tr style={{background: "#f9f9f9"}}>
              <th>Type</th>
              <th>Date</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {passes.length === 0 ? (
              <tr>
                <td colSpan={3} style={{textAlign: "center", color: "#888"}}>No passes found.</td>
              </tr>
            ) : (
              passes.map((pass) => (
                <tr key={pass.id || pass._id}>
                  <td>{pass.type}</td>
                  <td>{pass.date}</td>
                  <td>{pass.createdAt ? new Date(pass.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}