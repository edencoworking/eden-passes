import React, { useState, useEffect } from "react";
import "./App.css";

// Pass Types
const PASS_TYPES = [
  "Hourly",
  "10-Hours",
  "Weekly",
  "Monthly"
];

// Helper to load and save passes from localStorage
const loadPasses = () => {
  try {
    const saved = localStorage.getItem("edenPasses");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const savePasses = (passes) => {
  localStorage.setItem("edenPasses", JSON.stringify(passes));
};

function App() {
  const [passes, setPasses] = useState([]);
  const [form, setForm] = useState({
    customer: "",
    type: PASS_TYPES[0],
    date: "",
    time: ""
  });

  useEffect(() => {
    setPasses(loadPasses());
  }, []);

  useEffect(() => {
    savePasses(passes);
  }, [passes]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddPass = (e) => {
    e.preventDefault();
    if (!form.customer || !form.date || !form.time) return;
    setPasses([
      ...passes,
      {
        id: Date.now(),
        ...form
      }
    ]);
    setForm({
      customer: "",
      type: PASS_TYPES[0],
      date: "",
      time: ""
    });
  };

  const handleDeletePass = (id) => {
    setPasses(passes.filter(pass => pass.id !== id));
  };

  return (
    <div className="eden-container">
      <header>
        <h1>Eden Passes</h1>
        <p>Sell and manage passes for Eden Coworking.</p>
      </header>

      <section className="form-section">
        <h2>Add New Pass</h2>
        <form onSubmit={handleAddPass} className="pass-form">
          <label>
            Customer Name
            <input
              type="text"
              name="customer"
              value={form.customer}
              onChange={handleInput}
              required
              placeholder="Enter customer name"
            />
          </label>
          <label>
            Pass Type
            <select
              name="type"
              value={form.type}
              onChange={handleInput}
            >
              {PASS_TYPES.map(type => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            Start Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInput}
              required
            />
          </label>
          <label>
            Start Time
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleInput}
              required
            />
          </label>
          <button type="submit" className="add-btn">Add Pass</button>
        </form>
      </section>

      <section className="list-section">
        <h2>All Passes</h2>
        {passes.length === 0 ? (
          <p className="empty-list">No passes yet.</p>
        ) : (
          <ul className="passes-list">
            {passes.map(pass => (
              <li key={pass.id} className="pass-item">
                <div>
                  <strong>{pass.customer}</strong> — <span className="type">{pass.type}</span><br />
                  <span>Date: {pass.date}, Time: {pass.time}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDeletePass(pass.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer>
        <span className="footer">Eden Coworking &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default App;