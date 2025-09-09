import React, { useState } from "react";
import "./App.css";

function App() {
  const [passType, setPassType] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  const [errors, setErrors] = useState({});

  const passTypes = [
    { value: "", label: "Select Pass Type" },
    { value: "hourly", label: "Hourly" },
    { value: "10-hour", label: "10-Hour" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
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
      alert(`Pass created!\nType: ${passTypes.find(pt => pt.value === passType)?.label}\nDate: ${date}`);
      // Here you would typically send the data to an API
    }
  };

  const handlePassTypeChange = (e) => {
    setPassType(e.target.value);
    // Clear error when user selects a value
    if (errors.passType && e.target.value) {
      setErrors(prev => ({ ...prev, passType: "" }));
    }
  };

  return (
    <div className="App">
      <h1>Eden Passes</h1>
      <p>Welcome to your minimal React app!</p>
      
      <div className="create-pass-form">
        <h2>Create New Pass</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="passType">Pass Type *</label>
            <select
              id="passType"
              value={passType}
              onChange={handlePassTypeChange}
              className={errors.passType ? "error" : ""}
            >
              {passTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
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