import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PASS_TYPES = [
  { value: "", label: "Select Pass Type" },
  { value: "hourly", label: "Hourly" },
  { value: "10-hour", label: "10-Hour" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function PassesPage() {
  const [passes, setPasses] = useState([]);
  const [form, setForm] = useState({ type: '', date: '' });
  const [loading, setLoading] = useState(false);

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

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/passes', form);
      setPasses([res.data, ...passes]); // Add new pass to top
      setForm({ type: '', date: '' });
    } catch (err) {
      console.error('Error creating pass:', err);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Create New Pass</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          {PASS_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <input
          name="date"
          type="date"
          placeholder="Date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Pass'}
        </button>
      </form>

      <h3>All Passes</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {passes.map((pass) => (
            <tr key={pass.id || pass._id}>
              <td>{pass.type}</td>
              <td>{pass.date}</td>
              <td>{new Date(pass.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}