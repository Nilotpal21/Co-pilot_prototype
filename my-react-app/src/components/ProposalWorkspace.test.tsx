import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import ProposalWorkspace from './ProposalWorkspace';
import { useProposalStore } from '../state/useProposalStore';
import { ApprovalState, NudgeType, Priority, ProposalStatus, SourceType } from '../types';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

describe('ProposalWorkspace', () => {
  beforeEach(() => {
    useProposalStore.getState().clearAllData();
  });

  it('shows empty state when there is no active proposal', () => {
    render(<ProposalWorkspace />, { wrapper: Wrapper });
    expect(screen.getByText(/no active proposal yet/i)).toBeInTheDocument();
  });

  it('renders tabs and switches between them', async () => {
    const proposalId = useProposalStore.getState().createProposal({
      title: 'Contoso Manufacturing - Proposal',
      clientName: 'Contoso Manufacturing',
      clientId: 'CRM-contoso-manufacturing',
      opportunityValue: 2500000,
      status: ProposalStatus.IN_REVIEW,
      sections: [
        {
          id: 'sec-1',
          title: 'Executive Summary',
          content: 'Executive summary content',
          confidence: 0.55,
          sources: [
            {
              id: 'src-1',
              type: SourceType.CRM,
              title: 'Opportunity Notes',
              reference: 'CRM-OPP-123',
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
      ],
      openQuestions: [
        {
          id: 'q-1',
          question: 'What is the target go-live date?',
          rationale: 'Needed for timeline section.',
          priority: Priority.HIGH,
          relatedSectionIds: ['sec-1'],
          createdAt: new Date(),
          dismissed: false,
          category: 'Timeline',
        },
      ],
      nudges: [
        {
          id: 'n-1',
          type: NudgeType.SUGGESTION,
          message: 'Add ROI metric to Executive Summary.',
          priority: Priority.MEDIUM,
          relatedSectionId: 'sec-1',
          createdAt: new Date(),
          dismissed: false,
        },
      ],
      createdAt: new Date(),
      lastModified: new Date(),
      dueDate: new Date(),
      owner: { id: 'u1', name: 'User', email: 'user@test.com' },
      overallConfidence: 0.55,
      totalWordCount: 10,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<ProposalWorkspace />, { wrapper: Wrapper });

    expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /sections/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /open questions/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /approvals/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /sources/i })).toBeInTheDocument();

    // Default: overview includes next actions
    expect(screen.getByText(/copilot next actions/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: /open questions/i }));
    expect(screen.getByText(/what is the target go-live date/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: /sources/i }));
    expect(screen.getByText(/opportunity notes/i)).toBeInTheDocument();
  });

  it('opens section sources from Sections tab', async () => {
    const proposalId = useProposalStore.getState().createProposal({
      title: 'Contoso Manufacturing - Proposal',
      clientName: 'Contoso Manufacturing',
      clientId: 'CRM-contoso-manufacturing',
      opportunityValue: 2500000,
      status: ProposalStatus.IN_REVIEW,
      sections: [
        {
          id: 'sec-1',
          title: 'Executive Summary',
          content: 'Executive summary content',
          confidence: 0.55,
          sources: [
            {
              id: 'src-1',
              type: SourceType.EMAIL,
              title: 'Customer email thread',
              reference: 'https://example.com/thread',
              excerpt: 'Customer confirmed the go-live window is Q3.',
              lastUpdated: new Date(),
              relevanceScore: 0.8,
            },
          ],
          approvalState: ApprovalState.PENDING,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 10,
        },
      ],
      openQuestions: [],
      nudges: [],
      createdAt: new Date(),
      lastModified: new Date(),
      dueDate: new Date(),
      owner: { id: 'u1', name: 'User', email: 'user@test.com' },
      overallConfidence: 0.55,
      totalWordCount: 10,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<ProposalWorkspace />, { wrapper: Wrapper });

    await userEvent.click(screen.getByRole('tab', { name: /sections/i }));
    await userEvent.click(screen.getByRole('button', { name: /sources/i }));

    const panel = screen.getByLabelText(/sources panel/i);
    expect(panel).toBeInTheDocument();
    expect(screen.getByText(/customer email thread/i)).toBeInTheDocument();
    expect(screen.getByText(/go-live window is q3/i)).toBeInTheDocument();
  });

  it('Approvals tab hides approved sections', async () => {
    const proposalId = useProposalStore.getState().createProposal({
      title: 'Contoso Manufacturing - Proposal',
      clientName: 'Contoso Manufacturing',
      clientId: 'CRM-contoso-manufacturing',
      opportunityValue: 2500000,
      status: ProposalStatus.IN_REVIEW,
      sections: [
        {
          id: 'sec-1',
          title: 'Executive Summary',
          content: 'Executive summary content',
          confidence: 0.8,
          sources: [],
          approvalState: ApprovalState.APPROVED,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 10,
        },
        {
          id: 'sec-2',
          title: 'Security & Compliance',
          content: 'Security content',
          confidence: 0.7,
          sources: [],
          approvalState: ApprovalState.PENDING,
          order: 2,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 10,
        },
      ],
      openQuestions: [],
      nudges: [],
      createdAt: new Date(),
      lastModified: new Date(),
      dueDate: new Date(),
      owner: { id: 'u1', name: 'User', email: 'user@test.com' },
      overallConfidence: 0.75,
      totalWordCount: 20,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<ProposalWorkspace />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole('tab', { name: /approvals/i }));

    expect(screen.queryByText(/executive summary/i)).not.toBeInTheDocument();
    expect(screen.getByText(/security & compliance/i)).toBeInTheDocument();
  });
});


