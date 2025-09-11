import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassesPage from '../pages/PassesPage';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

import axios from 'axios';
const mockedAxios = axios;

// Mock data
const mockCustomers = [
  { _id: '1', name: 'John Doe' },
  { _id: '2', name: 'Jane Smith' }
];

const mockPasses = [
  { 
    _id: '1', 
    type: 'weekly', 
    date: '2024-01-15', 
    customer: { _id: '1', name: 'John Doe' },
    createdAt: new Date().toISOString()
  }
];

describe('PassesPage', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockPasses });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders pass creation form with customer field', async () => {
    render(<PassesPage />);
    
    expect(screen.getByLabelText(/Pass Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Pass/i })).toBeInTheDocument();
  });

  test('displays existing passes with customer names', async () => {
    render(<PassesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('weekly')).toBeInTheDocument();
    });
  });

  test('shows customer suggestions when typing', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPasses })
                   .mockResolvedValueOnce({ data: mockCustomers });

    render(<PassesPage />);
    
    const customerInput = screen.getByLabelText(/Customer Name/i);
    fireEvent.change(customerInput, { target: { value: 'Jo' } });
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/customers?search=Jo');
    });
  });
});