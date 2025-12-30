import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import TeamsSurface from './TeamsSurface';
import { useProposalStore } from '../../state/useProposalStore';
import { ApprovalState, ProposalStatus } from '../../types';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

describe('TeamsSurface review thread', () => {
  beforeEach(() => {
    useProposalStore.getState().clearAllData();
  });

  it('renders review request and allows adding a comment', async () => {
    const proposalId = useProposalStore.getState().createProposal({
      title: 'Test Proposal',
      clientName: 'Contoso',
      clientId: 'CRM-contoso',
      opportunityValue: 1000000,
      status: ProposalStatus.IN_REVIEW,
      sections: [
        {
          id: 'sec-1',
          title: 'Executive Summary',
          content: 'Some content',
          confidence: 0.5,
          sources: [],
          approvalState: ApprovalState.PENDING,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 2,
        },
      ],
      openQuestions: [],
      nudges: [],
      createdAt: new Date(),
      lastModified: new Date(),
      dueDate: new Date(),
      owner: { id: 'u1', name: 'User', email: 'user@test.com' },
      overallConfidence: 0.5,
      totalWordCount: 2,
      reviewRequests: [
        {
          id: 'rev-1',
          createdAt: new Date(),
          createdBy: { id: 'u1', name: 'User', email: 'user@test.com' },
          assignee: { id: 'rev-1', name: 'Alex Wilbur', email: 'alex.wilbur@contoso.com' },
          reason: 'Needs validation of security claims.',
          status: 'assigned',
          comments: [
            {
              id: 'c-1',
              author: { id: 'u1', name: 'User', email: 'user@test.com' },
              message: 'Escalated for review: Needs validation of security claims.',
              createdAt: new Date(),
            },
          ],
        },
      ],
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<TeamsSurface />, { wrapper: Wrapper });

    expect(screen.getByLabelText(/review requests/i)).toBeInTheDocument();
    expect(screen.getByText(/human review requested/i)).toBeInTheDocument();
    expect(screen.getByText(/alex wilbur/i)).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/add a comment for the reviewer/i), 'Here are the updated constraints.');
    await userEvent.click(screen.getByRole('button', { name: /comment/i }));

    // New comment should appear
    expect(screen.getByText(/here are the updated constraints/i)).toBeInTheDocument();
  });
});


