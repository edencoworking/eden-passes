import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassesPage from '../pages/PassesPage';

// Mock the mock API module
jest.mock('../api/mock', () => ({
  searchCustomers: jest.fn(),
  listPasses: jest.fn(),
  createPass: jest.fn()
}));

import { searchCustomers, listPasses, createPass } from '../api/mock';

// Mock data
const mockCustomers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' }
];

const mockPasses = [
  { 
    id: '1', 
    type: 'weekly', 
    date: '2024-01-15', 
    customer: { id: '1', name: 'John Doe' },
    createdAt: new Date().toISOString()
  }
];

describe('PassesPage', () => {
  beforeEach(() => {
    listPasses.mockReturnValue(mockPasses);
    searchCustomers.mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders pass creation form with customer field', async () => {
    render(<PassesPage />);
    
    expect(screen.getByRole('combobox', { name: 'Pass Type*' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Customer Name*' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Pass' })).toBeInTheDocument();
  });

  test('displays existing passes with customer names', async () => {
    render(<PassesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('weekly')).toBeInTheDocument();
    });
  });

  test('shows customer suggestions when typing', async () => {
    searchCustomers.mockReturnValue(mockCustomers);

    render(<PassesPage />);
    
    const customerInput = screen.getByRole('textbox', { name: 'Customer Name*' });
    fireEvent.change(customerInput, { target: { value: 'Jo' } });
    
    await waitFor(() => {
      expect(searchCustomers).toHaveBeenCalledWith('Jo');
    });
  });
});