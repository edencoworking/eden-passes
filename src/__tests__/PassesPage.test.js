import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassesPage from '../pages/PassesPage';

// Mock the localStorage data layer
jest.mock('../services/api', () => ({
  getPasses: jest.fn(() => [
    { 
      id: '1', 
      type: 'weekly', 
      date: '2024-01-15', 
      customerId: '1',
      customerName: 'John Doe',
      createdAt: new Date().toISOString()
    }
  ]),
  searchCustomers: jest.fn(() => [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' }
  ]),
  createPass: jest.fn(() => ({
    id: '2',
    type: 'monthly',
    date: '2024-01-20',
    customerId: '2',
    customerName: 'Jane Smith',
    createdAt: new Date().toISOString()
  }))
}));

import { getPasses, searchCustomers, createPass } from '../services/api';

describe('PassesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders pass creation form with customer field', async () => {
    render(<PassesPage />);
    
    expect(screen.getByText('Pass Type')).toBeInTheDocument();
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Pass' })).toBeInTheDocument();
  });

  test('displays existing passes with customer names', async () => {
    render(<PassesPage />);
    
    // Check that getPasses was called during mount
    expect(getPasses).toHaveBeenCalled();
  });

  test('shows customer suggestions when typing', async () => {
    render(<PassesPage />);
    
    const customerInput = screen.getByRole('textbox', { name: /customer name/i });
    fireEvent.change(customerInput, { target: { value: 'Jo' } });
    
    await waitFor(() => {
      expect(searchCustomers).toHaveBeenCalledWith('Jo');
    });
  });
});