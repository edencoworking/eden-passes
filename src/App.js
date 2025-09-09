import React, { useState, useEffect } from "react";
import "./App.css";

const PASS_TYPES = [
  { value: "", label: "Select Pass Type" },
  { value: "hourly", label: "Hourly" },
  { value: "10-hour", label: "10-Hour" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

// Helper functions for localStorage
const loadPasses = () => {
  try {
    const passes = localStorage.getItem('eden-passes');
    return passes ? JSON.parse(passes) : [];
  } catch (error) {
    console.error('Error loading passes:', error);
    return [];
  }
};

const loadCustomers = () => {
  try {
    const customers = localStorage.getItem('eden-customers');
    return customers ? JSON.parse(customers) : [];
  } catch (error) {
    console.error('Error loading customers:', error);
    return [];
  }
};

const savePasses = (passes) => {
  try {
    localStorage.setItem('eden-passes', JSON.stringify(passes));
  } catch (error) {
    console.error('Error saving passes:', error);
  }
};

const saveCustomers = (customers) => {
  try {
    localStorage.setItem('eden-customers', JSON.stringify(customers));
  } catch (error) {
    console.error('Error saving customers:', error);
  }
};

function App() {
  const [passType, setPassType] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [customerName, setCustomerName] = useState("");
  const [passes, setPasses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [lastCreatedPass, setLastCreatedPass] = useState(null);

  // Load data on component mount
  useEffect(() => {
    setPasses(loadPasses());
    setCustomers(loadCustomers());
  }, []);

  function validate() {
    const newErrors = {};
    if (!passType) {
      newErrors.passType = "Pass Type is required.";
    }
    if (!customerName.trim()) {
      newErrors.customerName = "Customer Name is required.";
    }
    return newErrors;
  }

  function findOrCreateCustomer(name) {
    const trimmedName = name.trim();
    let customer = customers.find(c => c.name.toLowerCase() === trimmedName.toLowerCase());
    
    if (!customer) {
      // Create new customer
      customer = {
        id: Date.now(), // Simple ID generation
        name: trimmedName,
        createdAt: new Date().toISOString()
      };
      const updatedCustomers = [...customers, customer];
      setCustomers(updatedCustomers);
      saveCustomers(updatedCustomers);
    }
    
    return customer;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const customer = findOrCreateCustomer(customerName);
      
      const newPass = {
        id: Date.now(), // Simple ID generation
        type: passType,
        date: date,
        customerId: customer.id,
        customerName: customer.name,
        createdAt: new Date().toISOString()
      };
      
      const updatedPasses = [newPass, ...passes]; // Add to beginning for newest first
      setPasses(updatedPasses);
      savePasses(updatedPasses);
      
      // Store created pass info for success message
      setLastCreatedPass({
        customerName: customer.name,
        passType: passType,
        date: date
      });
      
      // Reset form
      setPassType("");
      setDate(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });
      setCustomerName("");
      setSubmitted(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
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
            <label htmlFor="customerName">Customer Name<span className="required">*</span></label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              list="customer-suggestions"
              required
            />
            <datalist id="customer-suggestions">
              {customers.map(customer => (
                <option key={customer.id} value={customer.name} />
              ))}
            </datalist>
            {errors.customerName && <div className="error">{errors.customerName}</div>}
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
          {submitted && lastCreatedPass && (
            <div className="success-message">
              Pass created for <strong>{lastCreatedPass.customerName}</strong> ({PASS_TYPES.find(pt => pt.value === lastCreatedPass.passType)?.label}) on <strong>{lastCreatedPass.date}</strong>!
            </div>
          )}
        </form>
      </section>

      <section className="passes-table-section">
        <h2>All Passes ({passes.length})</h2>
        {passes.length === 0 ? (
          <p className="no-passes">No passes created yet. Create your first pass above!</p>
        ) : (
          <div className="table-container">
            <table className="passes-table">
              <thead>
                <tr>
                  <th>Pass Type</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {passes.map((pass) => (
                  <tr key={pass.id}>
                    <td>{PASS_TYPES.find(pt => pt.value === pass.type)?.label || pass.type}</td>
                    <td>{pass.customerName}</td>
                    <td>{new Date(pass.date).toLocaleDateString()}</td>
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