/**
 * Tests for CopilotChatPanel
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import CopilotChatPanel from './CopilotChatPanel';
import { useProposalStore } from '../state/useProposalStore';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

describe('CopilotChatPanel', () => {
  beforeEach(() => {
    // Clear store before each test
    useProposalStore.getState().clearAllData();
  });

  it('renders chat panel', () => {
    render(<CopilotChatPanel />, { wrapper: Wrapper });

    expect(screen.getByPlaceholderText(/ask copilot/i)).toBeInTheDocument();
  });

  it('renders input and send button', () => {
    render(<CopilotChatPanel />, { wrapper: Wrapper });

    expect(screen.getByPlaceholderText(/ask copilot/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<CopilotChatPanel />, { wrapper: Wrapper });

    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('creates proposal from chat command and shows in store', async () => {
    render(<CopilotChatPanel />, { wrapper: Wrapper });

    const input = screen.getByPlaceholderText(/ask copilot/i);

    // Type command
    userEvent.type(input, 'Create proposal for Acme Corp');
    
    // Click send
    const sendButton = screen.getByRole('button', { name: /send/i });
    userEvent.click(sendButton);

    // Wait for response (with generous timeout)
    await waitFor(
      () => {
        const proposals = useProposalStore.getState().getAllProposals();
        expect(proposals.length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    // Verify proposal details
    const proposals = useProposalStore.getState().getAllProposals();
    expect(proposals[0].clientName).toBe('Acme Corp');
  });
});
