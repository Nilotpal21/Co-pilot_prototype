import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { useProposalStore } from '../state/useProposalStore';
import { useAppStore } from '../state/useAppStore';
import { ApprovalState, ProposalStatus } from '../types';

describe('Export to Word flow', () => {
  beforeEach(() => {
    useProposalStore.getState().clearAllData();
    useAppStore.getState().setSurface('outlook');
    useAppStore.getState().clearWordExport();
  });

  it('exports active proposal to WordSurface preview', async () => {
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
          content: 'Exec summary content',
          confidence: 0.7,
          sources: [],
          approvalState: ApprovalState.PENDING,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 3,
        },
        {
          id: 'sec-2',
          title: 'Security & Compliance',
          content: 'Security content',
          confidence: 0.6,
          sources: [],
          approvalState: ApprovalState.DRAFT,
          order: 2,
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
      overallConfidence: 0.65,
      totalWordCount: 5,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: /export to word/i }));

    // Word preview should render and include section headings
    const preview = await screen.findByLabelText(/word export preview/i);
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveTextContent(/executive summary/i);
    expect(preview).toHaveTextContent(/security & compliance/i);
  });
});


