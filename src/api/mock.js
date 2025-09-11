import { v4 as uuidv4 } from 'uuid';

// Simple in-memory data store (ephemeral - resets on page refresh)
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

/**
 * Search customers by name
 * @param {string} search - Search query string
 * @returns {Array} Array of matching customers
 */
export function searchCustomers(search = '') {
  if (!search) {
    return customers;
  }
  
  return customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );
}

/**
 * Get all passes with customer information
 * @returns {Array} Array of passes with customer details
 */
export function listPasses() {
  return passes.map(pass => {
    const customer = customers.find(c => c.id === pass.customerId);
    return {
      ...pass,
      customer: customer ? { id: customer.id, name: customer.name } : null
    };
  });
}

/**
 * Create a new pass
 * @param {Object} passData - Pass data
 * @param {string} passData.type - Pass type
 * @param {string} passData.date - Pass date
 * @param {string} [passData.customerId] - Existing customer ID
 * @param {string} [passData.customerName] - New customer name (if customerId not provided)
 * @returns {Object} Created pass with customer information
 */
export function createPass({ type, date, customerId, customerName }) {
  // Validate required fields
  if (!type || !date) {
    throw new Error('Type and date are required');
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
        id: nextCustomerId.toString(),
        name: customerName.trim(),
        createdAt: new Date().toISOString()
      };
      customers.push(newCustomer);
      associatedCustomerId = newCustomer.id;
      nextCustomerId++;
    }
  }

  // Create new pass
  const newPass = {
    id: nextPassId.toString(),
    type: type.trim(),
    date: date,
    customerId: associatedCustomerId,
    createdAt: new Date().toISOString()
  };

  passes.push(newPass);
  nextPassId++;

  // Return pass with customer information
  const customer = customers.find(c => c.id === associatedCustomerId);
  return {
    ...newPass,
    customer: customer ? { id: customer.id, name: customer.name } : null
  };
}