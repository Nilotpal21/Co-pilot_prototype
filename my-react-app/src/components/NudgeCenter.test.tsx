import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import NudgeCenter from './NudgeCenter';
import { useProposalStore } from '../state/useProposalStore';
import { NudgeType, Priority, ProposalStatus, ApprovalState } from '../types';
import { CopilotPanelNavigation } from '../state/copilotPanelNav';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

describe('NudgeCenter', () => {
  beforeEach(() => {
    useProposalStore.getState().clearAllData();
  });

  it('shows empty state when there is no active proposal', () => {
    render(<NudgeCenter />, { wrapper: Wrapper });
    expect(screen.getByText(/no active proposal/i)).toBeInTheDocument();
  });

  it('renders active nudges and allows dismiss', async () => {
    const proposalId = useProposalStore.getState().createProposal({
      title: 'Test Proposal',
      clientName: 'Contoso Manufacturing',
      clientId: 'CRM-contoso-manufacturing',
      opportunityValue: 1000000,
      status: ProposalStatus.DRAFT,
      sections: [
        {
          id: 'sec-1',
          title: 'Security & Compliance',
          content: '...',
          confidence: 0.5,
          sources: [],
          approvalState: ApprovalState.DRAFT,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 1,
        },
      ],
      openQuestions: [],
      nudges: [
        {
          id: 'n-1',
          type: NudgeType.COMPLIANCE,
          message: 'Add SOC 2 report link to Security & Compliance section.',
          priority: Priority.HIGH,
          relatedSectionId: 'sec-1',
          createdAt: new Date(),
          dismissed: false,
        },
      ],
      createdAt: new Date(),
      lastModified: new Date(),
      dueDate: new Date(),
      owner: { id: 'u1', name: 'User', email: 'user@test.com' },
      overallConfidence: 0.5,
      totalWordCount: 1,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<NudgeCenter />, { wrapper: Wrapper });

    expect(screen.getByText(/add soc 2 report link/i)).toBeInTheDocument();
    expect(screen.getByText(/why this appeared/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }));

    // Should be marked dismissed in store
    const proposal = useProposalStore.getState().getProposal(proposalId);
    expect(proposal?.nudges.find((n) => n.id === 'n-1')?.dismissed).toBe(true);
  });

  it('calls onNavigate when View is clicked', async () => {
    const onNavigate = jest.fn<void, [CopilotPanelNavigation]>();

    const proposalId = useProposalStore.getState().createProposal({
      title: 'Test Proposal',
      clientName: 'Contoso Manufacturing',
      clientId: 'CRM-contoso-manufacturing',
      opportunityValue: 1000000,
      status: ProposalStatus.DRAFT,
      sections: [
        {
          id: 'sec-1',
          title: 'Security & Compliance',
          content: '...',
          confidence: 0.5,
          sources: [],
          approvalState: ApprovalState.DRAFT,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 1,
        },
      ],
      openQuestions: [],
      nudges: [
        {
          id: 'n-1',
          type: NudgeType.COMPLIANCE,
          message: 'Add SOC 2 report link to Security & Compliance section.',
          priority: Priority.HIGH,
          relatedSectionId: 'sec-1',
          createdAt: new Date(),
          dismissed: false,
        },
      ],
      createdAt: new Date(),
      lastModified: new Date(),
      dueDate: new Date(),
      owner: { id: 'u1', name: 'User', email: 'user@test.com' },
      overallConfidence: 0.5,
      totalWordCount: 1,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<NudgeCenter onNavigate={onNavigate} />, { wrapper: Wrapper });

    await userEvent.click(screen.getByRole('button', { name: /view/i }));

    expect(onNavigate).toHaveBeenCalledWith({
      kind: 'nudge',
      proposalId,
      nudgeId: 'n-1',
      relatedSectionId: 'sec-1',
    });
  });
});


