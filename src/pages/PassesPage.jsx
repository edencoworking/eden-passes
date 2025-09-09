import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PassesPage() {
  const [passes, setPasses] = useState([]);
  const [form, setForm] = useState({ type: '', date: '', customer: '' });
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch passes list
  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const res = await axios.get('/passes');
        setPasses(res.data.reverse()); // Show newest first
      } catch (err) {
        console.error('Error fetching passes:', err);
      }
    };
    fetchPasses();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle customer input change and search
  const handleCustomerChange = async (e) => {
    const value = e.target.value;
    setForm({ ...form, customer: value });
    setSelectedCustomer(null);

    if (value.trim().length > 0) {
      try {
        const res = await axios.get(`/customers?name_like=${encodeURIComponent(value)}`);
        setCustomers(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error searching customers:', err);
        setCustomers([]);
      }
    } else {
      setCustomers([]);
      setShowSuggestions(false);
    }
  };

  // Handle customer selection from dropdown
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setForm({ ...form, customer: customer.name });
    setShowSuggestions(false);
    setCustomers([]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let customerId = selectedCustomer?.id;
      let customerName = selectedCustomer?.name;

      // If no customer selected but name entered, create new customer
      if (!selectedCustomer && form.customer.trim()) {
        try {
          const customerRes = await axios.post('/customers', {
            name: form.customer.trim(),
            createdAt: new Date().toISOString()
          });
          customerId = customerRes.data.id;
          customerName = customerRes.data.name;
        } catch (err) {
          console.error('Error creating customer:', err);
        }
      }

      const newPass = {
        type: form.type,
        date: form.date,
        customerId: customerId,
        createdAt: new Date().toISOString(),
        customer: customerId ? { id: customerId, name: customerName } : null
      };

      const res = await axios.post('/passes', newPass);
      setPasses([res.data, ...passes]); // Add new pass to top
      setForm({ type: '', date: '', customer: '' });
      setSelectedCustomer(null);
      setShowSuggestions(false);
      setCustomers([]);
    } catch (err) {
      console.error('Error creating pass:', err);
    }
    setLoading(false);
  };

  // Hide suggestions when clicking outside
  const handleClickOutside = () => {
    setShowSuggestions(false);
  };

  return (
    <div>
      <h2>Create New Pass</h2>
      <form onSubmit={handleSubmit} className="pass-form">
        <div className="form-group">
          <input
            name="type"
            placeholder="Pass Type"
            value={form.type}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            name="date"
            type="date"
            placeholder="Date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group customer-input-group">
          <input
            name="customer"
            placeholder="Customer Name"
            value={form.customer}
            onChange={handleCustomerChange}
            onBlur={handleClickOutside}
            autoComplete="off"
          />
          {showSuggestions && customers.length > 0 && (
            <div className="customer-suggestions">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="suggestion-item"
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur
                  onClick={() => handleCustomerSelect(customer)}
                >
                  {customer.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Pass'}
        </button>
      </form>

      <h3>All Passes</h3>
      <table border="1" cellPadding="6" className="passes-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {passes.map((pass) => (
            <tr key={pass.id || pass._id}>
              <td>{pass.type}</td>
              <td>{pass.customer ? pass.customer.name : 'N/A'}</td>
              <td>{pass.date}</td>
              <td>{new Date(pass.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
