import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import UncertaintyBanner from './UncertaintyBanner';
import { useProposalStore } from '../state/useProposalStore';
import { useAppStore } from '../state/useAppStore';
import { ApprovalState, Priority, ProposalStatus } from '../types';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

describe('UncertaintyBanner', () => {
  beforeEach(() => {
    useProposalStore.getState().clearAllData();
    useAppStore.getState().setSurface('outlook');
  });

  it('appears when proposal is blocked/uncertain and can apply template', async () => {
    const proposalId = useProposalStore.getState().createProposal({
      title: 'Test Proposal',
      clientName: 'Contoso',
      clientId: 'CRM-contoso',
      opportunityValue: 1000000,
      status: ProposalStatus.DRAFT,
      sections: [
        {
          id: 'sec-1',
          title: 'Executive Summary',
          content: 'Some content',
          confidence: 0.4, // low confidence triggers uncertainty
          sources: [],
          approvalState: ApprovalState.DRAFT,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 2,
        },
      ],
      openQuestions: [
        {
          id: 'q-1',
          question: 'What is the go-live date?',
          rationale: 'Timeline depends on it.',
          priority: Priority.HIGH,
          relatedSectionIds: ['sec-1'],
          createdAt: new Date(),
          dismissed: false,
        },
      ],
      nudges: [],
      createdAt: new Date(),
      lastModified: new Date(),
      dueDate: new Date(),
      owner: { id: 'u1', name: 'User', email: 'user@test.com' },
      overallConfidence: 0.4,
      totalWordCount: 2,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<UncertaintyBanner />, { wrapper: Wrapper });
    expect(screen.getByText(/proposal blocked|proposal uncertain/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /apply standard template/i }));

    const updated = useProposalStore.getState().getProposal(proposalId)!;
    // Template should add at least one missing standard section
    expect(updated.sections.length).toBeGreaterThan(1);
  });

  it('escalation creates a review request and switches to Teams', async () => {
    const proposalId = useProposalStore.getState().createProposal({
      title: 'Test Proposal',
      clientName: 'Contoso',
      clientId: 'CRM-contoso',
      opportunityValue: 1000000,
      status: ProposalStatus.DRAFT,
      sections: [
        {
          id: 'sec-1',
          title: 'Executive Summary',
          content: 'Some content',
          confidence: 0.4,
          sources: [],
          approvalState: ApprovalState.REJECTED,
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
      overallConfidence: 0.4,
      totalWordCount: 2,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<UncertaintyBanner />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole('button', { name: /escalate for human review/i }));

    const updated = useProposalStore.getState().getProposal(proposalId)!;
    expect(updated.reviewRequests?.length).toBe(1);
    expect(useAppStore.getState().surface).toBe('teams');
  });
});


