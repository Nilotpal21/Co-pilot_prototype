/**
 * Tests for InlineSuggestionCard component
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import InlineSuggestionCard from './InlineSuggestionCard';
import { useProposalStore } from '../state/useProposalStore';

// Wrapper with FluentProvider
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

describe('InlineSuggestionCard', () => {
  const mockProposalData = {
    title: 'Test Proposal',
    clientName: 'Test Client',
    clientId: 'test-123',
    opportunityValue: 500000,
    dueDate: new Date('2025-12-31'),
  };

  beforeEach(() => {
    // Clear store before each test
    useProposalStore.getState().clearAllData();
  });

  it('renders suggestion card with all details', () => {
    render(
      <InlineSuggestionCard
        context="email"
        title="Create Follow-up Proposal"
        description="This is a test suggestion"
        proposalData={mockProposalData}
      />,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(/copilot suggestion/i)).toBeInTheDocument();
    expect(screen.getByText('Create Follow-up Proposal')).toBeInTheDocument();
    expect(screen.getByText('This is a test suggestion')).toBeInTheDocument();
    expect(screen.getByText(/test client/i)).toBeInTheDocument();
    expect(screen.getByText(/\$500K/i)).toBeInTheDocument();
  });

  it('creates proposal when button is clicked', () => {
    const onProposalCreated = jest.fn();

    render(
      <InlineSuggestionCard
        context="email"
        title="Create Proposal"
        description="Test description"
        proposalData={mockProposalData}
        onProposalCreated={onProposalCreated}
      />,
      { wrapper: Wrapper }
    );

    const createButton = screen.getByRole('button', { name: /create proposal/i });
    userEvent.click(createButton);

    // Wait for proposal to be created
    waitFor(() => {
      const proposals = useProposalStore.getState().getAllProposals();
      expect(proposals.length).toBe(1);
      expect(proposals[0].title).toBe('Test Proposal');
      expect(proposals[0].clientName).toBe('Test Client');
      expect(onProposalCreated).toHaveBeenCalled();
    });
  });

  it('sets created proposal as active', () => {
    render(
      <InlineSuggestionCard
        context="document"
        title="Create Proposal"
        description="Test"
        proposalData={mockProposalData}
      />,
      { wrapper: Wrapper }
    );

    const createButton = screen.getByRole('button', { name: /create proposal/i });
    userEvent.click(createButton);

    waitFor(() => {
      const activeProposal = useProposalStore.getState().getActiveProposal();
      expect(activeProposal).toBeDefined();
      expect(activeProposal?.title).toBe('Test Proposal');
    });
  });

  it('shows success message after creation', async () => {
    render(
      <InlineSuggestionCard
        context="email"
        title="Create Proposal"
        description="Test"
        proposalData={mockProposalData}
      />,
      { wrapper: Wrapper }
    );

    const createButton = screen.getByRole('button', { name: /create proposal/i });
    userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText(/proposal created and set as active/i)).toBeInTheDocument();
    });
  });

  it('can be dismissed when dismissible is true', () => {
    render(
      <InlineSuggestionCard
        context="email"
        title="Create Proposal"
        description="Test"
        proposalData={mockProposalData}
        dismissible={true}
      />,
      { wrapper: Wrapper }
    );

    const dismissButton = screen.getByTitle(/dismiss suggestion/i);
    expect(dismissButton).toBeInTheDocument();

    userEvent.click(dismissButton);

    // Card should be removed from DOM
    waitFor(() => {
      expect(screen.queryByText('Create Proposal')).not.toBeInTheDocument();
    });
  });

  it('hides dismiss button when dismissible is false', () => {
    render(
      <InlineSuggestionCard
        context="email"
        title="Create Proposal"
        description="Test"
        proposalData={mockProposalData}
        dismissible={false}
      />,
      { wrapper: Wrapper }
    );

    expect(screen.queryByTitle(/dismiss suggestion/i)).not.toBeInTheDocument();
  });

  it('creates proposal with initial section', () => {
    render(
      <InlineSuggestionCard
        context="document"
        title="Create Proposal"
        description="Test"
        proposalData={mockProposalData}
      />,
      { wrapper: Wrapper }
    );

    const createButton = screen.getByRole('button', { name: /create proposal/i });
    userEvent.click(createButton);

    waitFor(() => {
      const proposals = useProposalStore.getState().getAllProposals();
      expect(proposals[0].sections).toHaveLength(1);
      expect(proposals[0].sections[0].title).toBe('Executive Summary');
    });
  });
});

