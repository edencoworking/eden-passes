import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './Autocomplete.css';

export default function PassesPage() {
  const [passes, setPasses] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [form, setForm] = useState({ type: '', startDate: '', endDate: '' });

  useEffect(() => {
    api.getPasses().then(data => setPasses(data));
  }, []);

  useEffect(() => {
    if (customerSearch) {
      api.getCustomers(customerSearch)
        .then(data => setCustomerSuggestions(data));
    } else {
      setCustomerSuggestions([]);
    }
  }, [customerSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type: form.type,
      date: form.startDate, // using startDate as the main date field
      customerId: selectedCustomer ? selectedCustomer.id : undefined,
      customerName: !selectedCustomer ? customerSearch : undefined
    };
    await api.createPass(payload);
    setForm({ type: '', startDate: '', endDate: '' });
    setCustomerSearch('');
    setSelectedCustomer(null);
    api.getPasses().then(data => setPasses(data));
  };

  return (
    <div>
      <h2>Create Pass</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Type"
          value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
        />
        <input
          type="date"
          value={form.startDate}
          onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
        />
        <input
          type="date"
          value={form.endDate}
          onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
        />
        <div className="autocomplete">
          <input
            placeholder="Customer"
            value={selectedCustomer ? selectedCustomer.name : customerSearch}
            onChange={e => {
              setCustomerSearch(e.target.value);
              setSelectedCustomer(null);
            }}
            autoComplete="off"
          />
          {customerSuggestions.length > 0 && !selectedCustomer && (
            <ul className="suggestions">
              {customerSuggestions.map(c => (
                <li
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setCustomerSuggestions([]);
                  }}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Create Pass</button>
      </form>

      <h3>Passes</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Customer</th>
          </tr>
        </thead>
        <tbody>
          {passes.map(pass => (
            <tr key={pass.id}>
              <td>{pass.type}</td>
              <td>{pass.date}</td>
              <td>{pass.endDate && pass.endDate.slice(0, 10)}</td>
              <td>{pass.customer ? pass.customer.name : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
