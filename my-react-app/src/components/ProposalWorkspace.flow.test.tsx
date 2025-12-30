import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import ProposalWorkspace from './ProposalWorkspace';
import { useProposalStore } from '../state/useProposalStore';
import { ApprovalState, Priority, ProposalStatus, SourceType } from '../types';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

describe('ProposalWorkspace (simulation flow)', () => {
  beforeEach(() => {
    useProposalStore.getState().clearAllData();
  });

  it('simulates approving a section and resolving a question', async () => {
    const proposalId = useProposalStore.getState().createProposal({
      title: 'Fabrikam - Cloud Migration Proposal',
      clientName: 'Fabrikam',
      clientId: 'CRM-fabrikam',
      opportunityValue: 1200000,
      status: ProposalStatus.IN_REVIEW,
      sections: [
        {
          id: 'sec-1',
          title: 'Executive Summary',
          content: 'Exec summary',
          confidence: 0.55,
          sources: [
            {
              id: 'src-1',
              type: SourceType.CRM,
              title: 'CRM Notes',
              reference: 'CRM-OPP-777',
              lastUpdated: new Date(),
              relevanceScore: 0.9,
            },
          ],
          approvalState: ApprovalState.PENDING,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 10,
        },
        {
          id: 'sec-2',
          title: 'Solution Architecture',
          content: 'Architecture',
          confidence: 0.7,
          sources: [],
          approvalState: ApprovalState.PENDING,
          order: 2,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 20,
        },
      ],
      openQuestions: [
        {
          id: 'q-1',
          question: 'What is the target go-live date?',
          rationale: 'Needed to lock timeline and staffing.',
          priority: Priority.HIGH,
          relatedSectionIds: ['sec-2'],
          createdAt: new Date(),
          dismissed: false,
          category: 'Timeline',
        },
      ],
      nudges: [],
      createdAt: new Date(),
      lastModified: new Date(),
      dueDate: new Date(),
      owner: { id: 'u1', name: 'User', email: 'user@test.com' },
      overallConfidence: 0.62,
      totalWordCount: 30,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<ProposalWorkspace />, { wrapper: Wrapper });

    // Overview should show 0% complete (0/2 approved)
    expect(screen.getByText(/0% complete/i)).toBeInTheDocument();

    // Go to Approvals tab and approve one section
    userEvent.click(screen.getByRole('tab', { name: /approvals/i }));
    const approveButtons = screen.getAllByRole('button', { name: /^approve$/i });
    expect(approveButtons.length).toBeGreaterThan(0);
    userEvent.click(approveButtons[0]);

    // Back to overview: should now be 50% complete (1/2 approved)
    userEvent.click(screen.getByRole('tab', { name: /overview/i }));
    expect(screen.getByText(/50% complete/i)).toBeInTheDocument();

    // Resolve open question via Open Questions tab
    userEvent.click(screen.getByRole('tab', { name: /open questions/i }));
    expect(screen.getByText(/target go-live date/i)).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /resolve/i }));

    // Question should be gone from UI
    expect(screen.queryByText(/target go-live date/i)).not.toBeInTheDocument();

    // And store should have removed it (resolve deletes)
    const proposal = useProposalStore.getState().getProposal(proposalId);
    expect(proposal?.openQuestions.length).toBe(0);
  });
});


