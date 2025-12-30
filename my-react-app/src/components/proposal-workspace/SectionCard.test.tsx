import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { useProposalStore } from '../../state/useProposalStore';
import { ApprovalState, ProposalStatus } from '../../types';
import SectionCard from './SectionCard';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

describe('SectionCard', () => {
  beforeEach(() => {
    useProposalStore.getState().clearAllData();
  });

  it('supports inline editing and saves to store', async () => {
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
          content: 'Old content',
          confidence: 0.7,
          sources: [],
          approvalState: ApprovalState.DRAFT,
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
      overallConfidence: 0.7,
      totalWordCount: 2,
    });

    const section = useProposalStore.getState().getProposal(proposalId)!.sections[0];

    render(<SectionCard proposalId={proposalId} section={section} />, { wrapper: Wrapper });

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));

    const contentBox = screen.getByRole('textbox', { name: /content/i });
    await userEvent.clear(contentBox);
    await userEvent.type(contentBox, 'New content with more words');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    const updated = useProposalStore.getState().getProposal(proposalId)!.sections[0];
    expect(updated.content).toBe('New content with more words');
    expect(updated.wordCount).toBeGreaterThan(2);
  });

  it('rejects a section with feedback and updates store', async () => {
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
          content: 'Content',
          confidence: 0.7,
          sources: [],
          approvalState: ApprovalState.PENDING,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 1,
        },
      ],
      openQuestions: [],
      nudges: [],
      createdAt: new Date(),
      lastModified: new Date(),
      dueDate: new Date(),
      owner: { id: 'u1', name: 'User', email: 'user@test.com' },
      overallConfidence: 0.7,
      totalWordCount: 1,
    });

    const section = useProposalStore.getState().getProposal(proposalId)!.sections[0];

    render(<SectionCard proposalId={proposalId} section={section} />, { wrapper: Wrapper });

    // Open reject dialog (trigger button)
    await userEvent.click(screen.getAllByRole('button', { name: /^reject$/i })[0]);

    // Scope to dialog content to avoid ambiguity with the trigger button
    const dialogTitle = screen.getByText(/reject section/i);
    const dialog =
      (dialogTitle.closest('[role="dialog"]') as HTMLElement | null) ??
      (dialogTitle.parentElement as HTMLElement | null) ??
      document.body;
    const scoped = within(dialog);

    const feedback = scoped.getByRole('textbox', { name: /feedback/i });
    await userEvent.type(feedback, 'This section needs concrete ROI numbers and cited sources.');

    // Click the primary reject inside dialog (there are multiple "Reject" buttons)
    await userEvent.click(scoped.getAllByRole('button', { name: /^reject$/i })[0]);

    const updated = useProposalStore.getState().getProposal(proposalId)!.sections[0];
    expect(updated.approvalState).toBe(ApprovalState.REJECTED);
    expect(updated.reviewerNotes).toMatch(/concrete roi numbers/i);
  });
});


