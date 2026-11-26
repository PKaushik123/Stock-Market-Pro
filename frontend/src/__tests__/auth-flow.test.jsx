import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext.jsx';

const renderSignup = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    </MemoryRouter>,
  );

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  );

describe('Authentication forms', () => {
  it('shows a password length validation error on signup before submitting', async () => {
    renderSignup();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    });
  });

  it('shows a validation error for invalid login credentials before attempting the API call', async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });
});
