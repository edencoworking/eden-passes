import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassesPage from '../pages/PassesPage';

// Test uses real localStorage instead of mocking the service layer
describe('PassesPage', () => {
  beforeEach(() => {
    // Clear localStorage and set up deterministic test data
    localStorage.clear();
    localStorage.setItem('EDEN_CUSTOMERS', JSON.stringify([
      { id: 'c1', name: 'John Doe' },
      { id: 'c2', name: 'Jane Smith' }
    ]));
    localStorage.setItem('EDEN_PASSES', JSON.stringify([
      { 
        id: 'p1', 
        type: 'weekly', 
        date: '2025-01-01', 
        customerId: 'c1', 
        customerName: 'John Doe', 
        createdAt: '2025-01-02T00:00:00.000Z' 
      }
    ]));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders heading and form fields', () => {
    render(<PassesPage />);
    
    expect(screen.getByText('Create New Pass')).toBeInTheDocument();
    expect(screen.getByLabelText(/pass type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create pass/i })).toBeInTheDocument();
  });

  test('displays existing pass from localStorage', async () => {
    render(<PassesPage />);
    
    // Wait for the pass to be displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('weekly')).toBeInTheDocument();
      expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    });
  });

  test('shows customer suggestions when typing partial name', async () => {
    render(<PassesPage />);
    
    const customerInput = screen.getByLabelText(/customer name/i);
    fireEvent.change(customerInput, { target: { value: 'Ja' } });
    
    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('creates new pass with new customer name and updates UI', async () => {
    render(<PassesPage />);
    
    // Fill out the form with a new customer
    const passTypeSelect = screen.getByLabelText(/pass type/i);
    const dateInput = screen.getByLabelText(/date/i);
    const customerInput = screen.getByLabelText(/customer name/i);
    const submitButton = screen.getByRole('button', { name: /create pass/i });
    
    fireEvent.change(passTypeSelect, { target: { value: 'monthly' } });
    fireEvent.change(dateInput, { target: { value: '2025-01-15' } });
    fireEvent.change(customerInput, { target: { value: 'New Customer' } });
    
    fireEvent.click(submitButton);
    
    // Wait for success message and new pass to appear in table
    await waitFor(() => {
      expect(screen.getByText('Pass created!')).toBeInTheDocument();
      expect(screen.getByText('New Customer')).toBeInTheDocument();
      expect(screen.getByText('monthly')).toBeInTheDocument();
    });
    
    // Verify data was persisted to localStorage
    const customers = JSON.parse(localStorage.getItem('EDEN_CUSTOMERS'));
    const passes = JSON.parse(localStorage.getItem('EDEN_PASSES'));
    
    expect(customers).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'New Customer' })
    ]));
    expect(passes).toEqual(expect.arrayContaining([
      expect.objectContaining({ 
        type: 'monthly',
        date: '2025-01-15',
        customerName: 'New Customer'
      })
    ]));
  });

  test('selecting existing customer suggestion uses existing customer', async () => {
    render(<PassesPage />);
    
    const customerInput = screen.getByLabelText(/customer name/i);
    fireEvent.change(customerInput, { target: { value: 'Ja' } });
    
    // Wait for suggestions and click on Jane Smith
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    
    const janeOption = screen.getByText('Jane Smith');
    fireEvent.mouseDown(janeOption);
    
    // Verify the input was filled
    await waitFor(() => {
      expect(customerInput.value).toBe('Jane Smith');
    });
  });
});