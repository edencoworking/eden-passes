/**
 * Integration-style tests for PassesPage using the real localStorage-backed
 * service layer (no mocking of ../services/api). Each test seeds localStorage
 * directly to ensure deterministic state.
 */
import { render, screen, fireEvent, within } from '@testing-library/react';
import PassesPage from '../pages/PassesPage';
import { getPasses } from '../services/api';

// Helper to seed storage
function seedStorage({ customers = [], passes = [] } = {}) {
  localStorage.clear();
  localStorage.setItem('EDEN_CUSTOMERS', JSON.stringify(customers));
  localStorage.setItem('EDEN_PASSES', JSON.stringify(passes));
}

describe('PassesPage (localStorage integration)', () => {
  beforeEach(() => {
    seedStorage({
      customers: [
        { id: 'c1', name: 'John Doe' },
        { id: 'c2', name: 'Jane Smith' }
      ],
      passes: [
        {
          id: 'p1',
          type: 'weekly',
            date: '2025-01-01',
          customerId: 'c1',
          customerName: 'John Doe',
          createdAt: '2025-01-02T00:00:00.000Z'
        }
      ]
    });
  });

  test('renders form fields and existing pass', () => {
    render(<PassesPage />);

    expect(screen.getByText('Create New Pass')).toBeInTheDocument();
    expect(screen.getByLabelText(/Pass Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Pass/i })).toBeInTheDocument();

    // Existing seeded pass
    expect(screen.getByText('weekly')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('autocomplete shows matching suggestions (substring case-insensitive)', () => {
    render(<PassesPage />);

    const customerInput = screen.getByLabelText(/Customer Name/i);
    fireEvent.change(customerInput, { target: { value: 'ja' } });

    // Suggestion list appears with Jane Smith
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('creating a pass with new customer creates both pass and customer', () => {
    // Start with no passes/customers except seeds
    render(<PassesPage />);

    const passTypeSelect = screen.getByLabelText(/Pass Type/i);
    fireEvent.change(passTypeSelect, { target: { value: 'monthly' } });

    const customerInput = screen.getByLabelText(/Customer Name/i);
    fireEvent.change(customerInput, { target: { value: 'Alice Cooper' } });

    // Date defaults to today; keep it or modify if needed
    const submitBtn = screen.getByRole('button', { name: /Create Pass/i });
    fireEvent.click(submitBtn);

    // Success message
    expect(screen.getByText(/Pass created!/i)).toBeInTheDocument();

    // New pass row (monthly + Alice Cooper) should appear
    expect(screen.getByText('monthly')).toBeInTheDocument();
    expect(screen.getByText('Alice Cooper')).toBeInTheDocument();

    // Confirm persistence by re-reading passes via service
    const stored = getPasses();
    const hasAlice = stored.some(p => p.customerName === 'Alice Cooper');
    expect(hasAlice).toBe(true);
  });

  test('selecting existing customer via suggestions does not duplicate customer', () => {
    render(<PassesPage />);

    const passTypeSelect = screen.getByLabelText(/Pass Type/i);
    fireEvent.change(passTypeSelect, { target: { value: 'hourly' } });

    const customerInput = screen.getByLabelText(/Customer Name/i);
    fireEvent.change(customerInput, { target: { value: 'Jane' } });

    const suggestion = screen.getByText('Jane Smith');
    // Use mouseDown to avoid blur hiding the list before click
    fireEvent.mouseDown(suggestion);

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Create Pass/i });
    fireEvent.click(submitBtn);

    // Row with hourly + Jane Smith appears
    expect(screen.getByText('hourly')).toBeInTheDocument();
    expect(screen.getAllByText('Jane Smith').length).toBeGreaterThanOrEqual(1);

    // Ensure no duplicate customers in storage
    const customers = JSON.parse(localStorage.getItem('EDEN_CUSTOMERS') || '[]');
    const janeCount = customers.filter(c => c.name === 'Jane Smith').length;
    expect(janeCount).toBe(1);
  });

  test('empty state message appears when no passes', () => {
    seedStorage({
      customers: [
        { id: 'c1', name: 'John Doe' }
      ],
      passes: []
    });
    render(<PassesPage />);
    expect(screen.getByText(/No passes yet. Create one above./i)).toBeInTheDocument();
  });

  test('new pass prepends to list (most recent first)', () => {
    render(<PassesPage />);

    // Create new pass
    fireEvent.change(screen.getByLabelText(/Pass Type/i), { target: { value: 'hourly' } });
    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'Zeta User' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Pass/i }));

    // Table first data row should now include 'hourly' & 'Zeta User'
    const rows = screen.getAllByRole('row');
    // Row[0] is header, first data row is rows[1]
    const firstDataCells = within(rows[1]).getAllByRole('cell');
    expect(firstDataCells[0].textContent).toBe('hourly');
    expect(firstDataCells[2].textContent).toBe('Zeta User');
  });
});
