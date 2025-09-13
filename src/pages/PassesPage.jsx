import React, { useEffect, useState, useRef } from 'react';
import { getPasses, searchCustomers, createPass } from '../services/api';
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
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [customer, setCustomer] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const suggestionsRef = useRef();

  // Fetch passes list
  useEffect(() => {
    const fetchPasses = () => {
      try {
        const passesData = getPasses();
        setPasses(passesData);
      } catch (err) {
        console.error('Error fetching passes:', err);
      }
    };
    fetchPasses();
  }, []);

  // Customer autocomplete
  useEffect(() => {
    if (customer.length > 1) {
      try {
        const data = searchCustomers(customer);
        setCustomerSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error searching customers:', err);
        setCustomerSuggestions([]);
      }
    } else {
      setCustomerSuggestions([]);
      setShowSuggestions(false);
    }
  }, [customer]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Validation
  function validate() {
    const newErrors = {};
    if (!passType) newErrors.passType = "Pass Type is required.";
    if (!date) newErrors.date = "Date is required.";
    if (!customer.trim()) newErrors.customer = "Customer name is required.";
    return newErrors;
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setSubmitted(false);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Build payload sending ONLY one of customerId OR customerName
        const payload = {
          type: passType,
          date
        };
        if (customerId) {
          payload.customerId = customerId; // existing user
        } else {
          payload.customerName = customer.trim(); // new user name
        }

        const created = createPass(payload);

        // Update local state by prepending the new pass
        setPasses((prevPasses) => [created, ...(prevPasses || [])]);
        setPassType("");
        setDate(new Date().toISOString().split("T")[0]);
        setCustomer("");
        setCustomerId(null);
        setSubmitted(true);
        setErrors({});
      } catch (err) {
        console.error(err);
        setErrors({ api: err.message || 'Error creating pass.' });
      }
      setLoading(false);
    }
  };

  // Handle customer suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setCustomer(suggestion.name);
    setCustomerId(suggestion.id || suggestion._id);
    setShowSuggestions(false);
  };

  return (
    <div>
      <section className="new-pass-section">
        <h2>Create New Pass</h2>
        <form className="new-pass-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
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
          <div className="form-group" style={{position: "relative"}}>
            <label htmlFor="customer">Customer Name<span className="required">*</span></label>
            <input
              id="customer"
              type="text"
              value={customer}
              onChange={e => {
                setCustomer(e.target.value);
                setCustomerId(null); // typing invalidates prior selection
              }}
              autoComplete="off"
              required
              onFocus={() => (customerSuggestions || []).length > 0 && setShowSuggestions(true)}
            />
            {showSuggestions && (customerSuggestions || []).length > 0 && (
              <ul className="autocomplete-suggestions" ref={suggestionsRef} style={{
                position: 'absolute',
                top: 'calc(100% + 2px)',
                left: 0,
                right: 0,
                zIndex: 10,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {(customerSuggestions || []).map(suggestion => (
                  <li
                    key={suggestion.id || suggestion._id}
                    style={{
                      padding: '8px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
            {errors.customer && <div className="error">{errors.customer}</div>}
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Pass'}
          </button>
          {submitted && (
            <div className="success-message">
              Pass created!
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
              <th>Customer</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {(passes || []).length === 0 ? (
              <tr>
                <td colSpan={4} style={{textAlign: "center", color: "#888"}}>No passes found.</td>
              </tr>
            ) : (
              (passes || []).map((pass) => (
                <tr key={pass.id || pass._id}>
                  <td>{pass.type}</td>
                  <td>{pass.date || (pass.startDate ? pass.startDate.slice(0,10) : '')}</td>
                  <td>{pass.customerName || pass.customer?.name || '-'}</td>
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