import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AppShell with Copilot Panel and tabs', () => {
  render(<App />);
  
  // Check tabs are present (using getAllByRole since there may be hidden tabs)
  const tabs = screen.getAllByRole('tab');
  expect(tabs.length).toBeGreaterThanOrEqual(3);
  
  // Check for chat panel input (default tab)
  expect(screen.getByPlaceholderText(/ask copilot/i)).toBeInTheDocument();
  
  // Check default Outlook surface content renders
  expect(screen.getByText(/proposal follow-up/i)).toBeInTheDocument();
});

test('renders Copilot chat features', () => {
  render(<App />);
  
  // Check for Copilot chat panel (default tab)
  expect(screen.getByPlaceholderText(/ask copilot/i)).toBeInTheDocument();
  
  // Check for multiple send buttons (one in chat, others in surfaces)
  expect(screen.getAllByRole('button', { name: /send/i }).length).toBeGreaterThan(0);
  
  // Check for inline AI features in Outlook surface
  expect(screen.getAllByText(/copilot/i).length).toBeGreaterThan(0);
});
