import React, { useState } from "react";
import "./App.css";

const PASS_TYPES = [
  { value: "", label: "Select Pass Type" },
  { value: "hourly", label: "Hourly" },
  { value: "10-hour", label: "10-Hour" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

// Mock customer data for autocomplete
const INITIAL_CUSTOMERS = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Alice Johnson" },
  { id: 4, name: "Bob Wilson" },
  { id: 5, name: "Carol Brown" },
];

function App() {
  const [passType, setPassType] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [customerName, setCustomerName] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [passes, setPasses] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Handle customer name input with autocomplete
  function handleCustomerNameChange(value) {
    setCustomerName(value);
    
    if (value.trim()) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCustomers([]);
      setShowDropdown(false);
    }
  }

  // Select customer from dropdown
  function selectCustomer(customer) {
    setCustomerName(customer.name);
    setShowDropdown(false);
    setFilteredCustomers([]);
  }

  // Create new customer if name doesn't exist
  function createCustomerIfNeeded(name) {
    const exists = customers.some(customer => 
      customer.name.toLowerCase() === name.toLowerCase()
    );
    
    if (!exists && name.trim()) {
      const newCustomer = {
        id: Math.max(...customers.map(c => c.id), 0) + 1,
        name: name.trim()
      };
      setCustomers([...customers, newCustomer]);
      return newCustomer;
    }
    
    return customers.find(customer => 
      customer.name.toLowerCase() === name.toLowerCase()
    );
  }

  function validate() {
    const newErrors = {};
    if (!passType) {
      newErrors.passType = "Pass Type is required.";
    }
    if (!customerName.trim()) {
      newErrors.customerName = "Customer name is required.";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Create or find customer
      const customer = createCustomerIfNeeded(customerName);
      
      // Create new pass
      const newPass = {
        id: passes.length + 1,
        type: passType,
        date: date,
        customerName: customer.name,
        customerId: customer.id,
        createdAt: new Date().toISOString()
      };
      
      setPasses([newPass, ...passes]);
      setSubmitted(true);
      
      // Reset form
      setTimeout(() => {
        setPassType("");
        setCustomerName("");
        setDate(() => {
          const today = new Date();
          return today.toISOString().split("T")[0];
        });
        setSubmitted(false);
      }, 2000);
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
            <label htmlFor="customerName">Customer Name<span className="required">*</span></label>
            <div className="autocomplete-container">
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={e => handleCustomerNameChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onFocus={() => customerName && setShowDropdown(true)}
                placeholder="Enter customer name"
                required
              />
              {showDropdown && filteredCustomers.length > 0 && (
                <div className="autocomplete-dropdown">
                  {filteredCustomers.map(customer => (
                    <div
                      key={customer.id}
                      className="autocomplete-item"
                      onClick={() => selectCustomer(customer)}
                    >
                      {customer.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.customerName && <div className="error">{errors.customerName}</div>}
          </div>
          
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
              Pass created for <strong>{customerName}</strong> - <strong>{PASS_TYPES.find(pt => pt.value === passType)?.label}</strong> on <strong>{date}</strong>!
            </div>
          )}
        </form>
      </section>

      {passes.length > 0 && (
        <section className="passes-list-section">
          <h2>Recent Passes</h2>
          <div className="passes-table-container">
            <table className="passes-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Pass Type</th>
                  <th>Date</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {passes.map(pass => (
                  <tr key={pass.id}>
                    <td className="customer-name">{pass.customerName}</td>
                    <td>{PASS_TYPES.find(pt => pt.value === pass.type)?.label}</td>
                    <td>{pass.date}</td>
                    <td>{new Date(pass.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;