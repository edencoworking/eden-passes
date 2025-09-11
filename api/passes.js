// Import data from customers API (in production, this would be database queries)
import { customers, passes, nextPassId } from './customers.js';

let currentNextPassId = nextPassId;

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Get all passes with customer information
    const passesWithCustomers = passes.map(pass => {
      const customer = customers.find(c => c.id === pass.customerId);
      return {
        ...pass,
        customer: customer ? { id: customer.id, name: customer.name } : null
      };
    });

    return res.status(200).json(passesWithCustomers);
  }

  if (req.method === 'POST') {
    const { type, date, customerId, customerName } = req.body;

    // Validate required fields
    if (!type || !date) {
      return res.status(400).json({ error: 'Type and date are required' });
    }

    let associatedCustomerId = customerId;

    // If no customerId provided but customerName is provided, create or find customer
    if (!customerId && customerName) {
      // Check if customer exists
      const existingCustomer = customers.find(
        customer => customer.name.toLowerCase() === customerName.trim().toLowerCase()
      );

      if (existingCustomer) {
        associatedCustomerId = existingCustomer.id;
      } else {
        // Create new customer
        const newCustomer = {
          id: (customers.length + 1).toString(),
          name: customerName.trim(),
          createdAt: new Date().toISOString()
        };
        customers.push(newCustomer);
        associatedCustomerId = newCustomer.id;
      }
    }

    // Create new pass
    const newPass = {
      id: currentNextPassId.toString(),
      type: type.trim(),
      date: date,
      customerId: associatedCustomerId,
      createdAt: new Date().toISOString()
    };

    passes.push(newPass);
    currentNextPassId++;

    // Return pass with customer information
    const customer = customers.find(c => c.id === associatedCustomerId);
    const passWithCustomer = {
      ...newPass,
      customer: customer ? { id: customer.id, name: customer.name } : null
    };

    return res.status(201).json(passWithCustomer);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}