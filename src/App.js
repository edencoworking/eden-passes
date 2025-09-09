import React, { useState } from "react";
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
      setSubmitted(true);
      // Here you would typically handle the submission (e.g., API call)
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
          <button type="submit" className="submit-btn">Create Pass</button>
          {submitted && (
            <div className="success-message">
              Pass created for <strong>{PASS_TYPES.find(pt => pt.value === passType)?.label}</strong> on <strong>{date}</strong>!
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default App;