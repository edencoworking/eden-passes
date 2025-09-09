import React, { useState } from "react";
import "./App.css";

function App() {
  const [passType, setPassType] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

  const passTypeOptions = [
    { value: "", label: "Select a pass type..." },
    { value: "hourly", label: "Hourly" },
    { value: "10-hour", label: "10-Hour" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!passType) {
      newErrors.passType = "Pass Type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, handle submission
      alert(`Pass created successfully!\nType: ${passType}\nDate: ${date}`);
      console.log("Form submitted:", { passType, date });
    }
  };

  const handlePassTypeChange = (e) => {
    setPassType(e.target.value);
    // Clear error when user selects a value
    if (errors.passType && e.target.value) {
      setErrors({ ...errors, passType: "" });
    }
  };

  return (
    <div className="App">
      <h1>Eden Passes</h1>
      <p>Welcome to your minimal React app!</p>
      
      <div className="form-container">
        <h2>Create New Pass</h2>
        <form onSubmit={handleSubmit} className="pass-form">
          <div className="form-group">
            <label htmlFor="passType">Pass Type *</label>
            <select
              id="passType"
              value={passType}
              onChange={handlePassTypeChange}
              className={errors.passType ? "error" : ""}
            >
              {passTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.passType && <span className="error-message">{errors.passType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-button">
            Create Pass
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;