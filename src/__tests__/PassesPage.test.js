import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassesPage from '../pages/PassesPage';
import { api } from '../services/api';

// Mock the API module
jest.mock('../services/api', () => ({
  api: {
    getPasses: jest.fn(),
    getCustomers: jest.fn(),
    createPass: jest.fn()
  }
}));

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
    customerId: '1',
    customer: { id: '1', name: 'John Doe' },
    createdAt: new Date().toISOString()
  }
];

describe('PassesPage', () => {
  beforeEach(() => {
    api.getPasses.mockResolvedValue(mockPasses);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders pass creation form with customer field', async () => {
    render(<PassesPage />);
    
    expect(screen.getByLabelText(/Pass Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Name/i)).toBeInTheDocument();
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
    api.getPasses.mockResolvedValueOnce(mockPasses);
    api.getCustomers.mockResolvedValueOnce(mockCustomers);

    render(<PassesPage />);
    
    const customerInput = screen.getByLabelText(/Customer Name/i);
    fireEvent.change(customerInput, { target: { value: 'Jo' } });
    
    await waitFor(() => {
      expect(api.getCustomers).toHaveBeenCalledWith('Jo');
    });
  });
});