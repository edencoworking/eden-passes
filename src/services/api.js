import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';

// Initial seed data
const INITIAL_CUSTOMERS = [
  { id: '1', name: 'John Doe', createdAt: new Date('2024-01-01').toISOString() },
  { id: '2', name: 'Jane Smith', createdAt: new Date('2024-01-02').toISOString() },
  { id: '3', name: 'Bob Johnson', createdAt: new Date('2024-01-03').toISOString() },
];

const INITIAL_PASSES = [
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

// Initialize data from localStorage or use defaults
const getCustomers = () => storage.get('customers', INITIAL_CUSTOMERS);
const getPasses = () => storage.get('passes', INITIAL_PASSES);

const setCustomers = (customers) => storage.set('customers', customers);
const setPasses = (passes) => storage.set('passes', passes);

// API functions
export const api = {
  // Get customers with optional search filtering
  getCustomers: (searchTerm = '') => {
    const customers = getCustomers();
    if (!searchTerm) {
      return Promise.resolve(customers);
    }
    
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return Promise.resolve(filtered);
  },

  // Create a new customer
  createCustomer: ({ name, email }) => {
    if (!name || !name.trim()) {
      return Promise.reject(new Error('Customer name is required'));
    }

    const customers = getCustomers();
    const trimmedName = name.trim();
    
    // Check if customer already exists (case-insensitive)
    const existingCustomer = customers.find(
      customer => customer.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingCustomer) {
      return Promise.resolve(existingCustomer);
    }

    // Create new customer
    const newCustomer = {
      id: uuidv4(),
      name: trimmedName,
      email: email || '',
      createdAt: new Date().toISOString()
    };

    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    
    return Promise.resolve(newCustomer);
  },

  // Create a new pass
  createPass: ({ type, date, customerName, customerId }) => {
    if (!type || !date) {
      return Promise.reject(new Error('Type and date are required'));
    }

    const customers = getCustomers();
    const passes = getPasses();
    let associatedCustomerId = customerId;

    // If no customerId provided but customerName is provided, create or find customer
    if (!customerId && customerName) {
      const existingCustomer = customers.find(
        customer => customer.name.toLowerCase() === customerName.trim().toLowerCase()
      );

      if (existingCustomer) {
        associatedCustomerId = existingCustomer.id;
      } else {
        // Create new customer
        const newCustomer = {
          id: uuidv4(),
          name: customerName.trim(),
          createdAt: new Date().toISOString()
        };
        const updatedCustomers = [...customers, newCustomer];
        setCustomers(updatedCustomers);
        associatedCustomerId = newCustomer.id;
      }
    }

    // Create new pass
    const newPass = {
      id: uuidv4(),
      type: type.trim(),
      date: date,
      customerId: associatedCustomerId,
      createdAt: new Date().toISOString()
    };

    const updatedPasses = [...passes, newPass];
    setPasses(updatedPasses);

    // Return pass with customer information
    const customer = getCustomers().find(c => c.id === associatedCustomerId);
    const passWithCustomer = {
      ...newPass,
      customer: customer ? { id: customer.id, name: customer.name } : null
    };

    return Promise.resolve(passWithCustomer);
  },

  // Get all passes with customer information
  getPasses: () => {
    const passes = getPasses();
    const customers = getCustomers();

    const passesWithCustomers = passes.map(pass => {
      const customer = customers.find(c => c.id === pass.customerId);
      return {
        ...pass,
        customer: customer ? { id: customer.id, name: customer.name } : null
      };
    });

    return Promise.resolve(passesWithCustomers);
  },

  // Clear all data (for testing/reset purposes)
  clearAllData: () => {
    storage.clear();
    return Promise.resolve();
  }
};