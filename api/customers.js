// Simple in-memory data store (in production, this would be a database)
let customers = [
  { id: '1', name: 'John Doe', createdAt: new Date('2024-01-01').toISOString() },
  { id: '2', name: 'Jane Smith', createdAt: new Date('2024-01-02').toISOString() },
  { id: '3', name: 'Bob Johnson', createdAt: new Date('2024-01-03').toISOString() },
];

let passes = [
  { 
    id: '1', 
    type: 'weekly', 
    date: '2024-01-15', 
    customerId: '1', 
    createdAt: new Date('2024-01-15').toISOString() 
  },
  { 
    id: '2', 
    type: 'monthly', 
    date: '2024-01-20', 
    customerId: '2', 
    createdAt: new Date('2024-01-20').toISOString() 
  },
];

let nextCustomerId = 4;
let nextPassId = 3;

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Search customers
    const { search } = req.query;
    
    if (!search) {
      return res.status(200).json(customers);
    }

    const filteredCustomers = customers.filter(customer =>
      customer.name.toLowerCase().includes(search.toLowerCase())
    );

    return res.status(200).json(filteredCustomers);
  }

  if (req.method === 'POST') {
    // Create new customer
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    // Check if customer already exists
    const existingCustomer = customers.find(
      customer => customer.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingCustomer) {
      return res.status(200).json(existingCustomer);
    }

    // Create new customer
    const newCustomer = {
      id: nextCustomerId.toString(),
      name: name.trim(),
      createdAt: new Date().toISOString()
    };

    customers.push(newCustomer);
    nextCustomerId++;

    return res.status(201).json(newCustomer);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Export data for other API endpoints to use
export { customers, passes, nextPassId };