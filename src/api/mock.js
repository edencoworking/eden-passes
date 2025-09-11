/**
 * In-memory mock API layer - Step 1 of backend removal (ref: upcoming v1.2.0)
 * This provides ephemeral persistence for development purposes.
 * Data will be reset on page refresh.
 */

// In-memory data stores
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
    customer: { id: '1', name: 'John Doe' },
    createdAt: new Date('2024-01-15').toISOString() 
  },
  { 
    id: '2', 
    type: 'monthly', 
    date: '2024-01-20', 
    customer: { id: '2', name: 'Jane Smith' },
    createdAt: new Date('2024-01-20').toISOString() 
  },
];

let nextCustomerId = 4;
let nextPassId = 3;

/**
 * Search customers by name (case-insensitive substring match)
 * @param {string} query - Search query
 * @returns {Array} Array of matching customers
 */
export function searchCustomers(query) {
  if (!query || query.length < 2) {
    return [];
  }
  
  return customers.filter(customer =>
    customer.name.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * List all passes with customer information
 * @returns {Array} Array of passes with embedded customer objects
 */
export function listPasses() {
  return [...passes]; // Return a copy to prevent external mutation
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
  let associatedCustomer;

  if (customerId) {
    // Use existing customer
    associatedCustomer = customers.find(c => c.id === customerId);
    if (!associatedCustomer) {
      throw new Error('Customer not found');
    }
  } else if (customerName) {
    // Check if customer exists by name
    const existingCustomer = customers.find(
      customer => customer.name.toLowerCase() === customerName.trim().toLowerCase()
    );

    if (existingCustomer) {
      associatedCustomer = existingCustomer;
    } else {
      // Create new customer
      const newCustomer = {
        id: nextCustomerId.toString(),
        name: customerName.trim(),
        createdAt: new Date().toISOString()
      };
      customers.push(newCustomer);
      nextCustomerId++;
      associatedCustomer = newCustomer;
    }
  } else {
    throw new Error('Either customerId or customerName must be provided');
  }

  // Create new pass
  const newPass = {
    id: nextPassId.toString(),
    type: type.trim(),
    date: date,
    customer: { id: associatedCustomer.id, name: associatedCustomer.name },
    createdAt: new Date().toISOString()
  };

  passes.unshift(newPass); // Add to beginning for reverse chronological order
  nextPassId++;

  return newPass;
}