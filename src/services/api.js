// src/services/api.js
// Lightweight in-browser data layer replacing the removed backend.
// All data is persisted to localStorage so the app behaves statefully between reloads.
// This can later be swapped for real API calls (REST, GraphQL, Firebase, Supabase, etc.).

import { v4 as uuid } from 'uuid';

const PASS_STORAGE_KEY = 'EDEN_PASSES';
const CUSTOMER_STORAGE_KEY = 'EDEN_CUSTOMERS';

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to parse localStorage key', key, e);
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Seed some demo customers if empty
(function seedCustomers() {
  const customers = read(CUSTOMER_STORAGE_KEY);
  if (customers.length === 0) {
    const seed = [
      { id: uuid(), name: 'Alice Demo' },
      { id: uuid(), name: 'Bob Remote' },
      { id: uuid(), name: 'Charlie Nomad' }
    ];
    write(CUSTOMER_STORAGE_KEY, seed);
  }
})();

export function getPasses() {
  // Return newest first
  return read(PASS_STORAGE_KEY).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getCustomers() {
  return read(CUSTOMER_STORAGE_KEY).sort((a, b) => a.name.localeCompare(b.name));
}

export function searchCustomers(term) {
  if (!term) return [];
  const lower = term.toLowerCase();
  return getCustomers().filter(c => c.name.toLowerCase().includes(lower));
}

export function createPass({ type, date, customerId, customerName }) {
  if (!type || !date) throw new Error('type and date are required');

  let finalCustomerId = customerId;
  const customers = getCustomers();
  const passes = getPasses();
  const now = new Date().toISOString();

  // Create new customer if name provided without id
  if (!finalCustomerId && customerName) {
    const newCustomer = { id: uuid(), name: customerName };
    const updatedCustomers = [...customers, newCustomer];
    write(CUSTOMER_STORAGE_KEY, updatedCustomers);
    finalCustomerId = newCustomer.id;
  }

  const customer = customers.find(c => c.id === finalCustomerId) || (customerName ? { id: finalCustomerId, name: customerName } : null);

  const newPass = {
    id: uuid(),
    type,
    date, // stored as YYYY-MM-DD
    customerId: customer ? customer.id : null,
    customerName: customer ? customer.name : customerName || null,
    createdAt: now
  };

  write(PASS_STORAGE_KEY, [newPass, ...passes]);
  return newPass;
}