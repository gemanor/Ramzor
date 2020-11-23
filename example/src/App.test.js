import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const header = screen.getByText(/Start use Sherlock/i);
  expect(header).toBeInTheDocument();
});
