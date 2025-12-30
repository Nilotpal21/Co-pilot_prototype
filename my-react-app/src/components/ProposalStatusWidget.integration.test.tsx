import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import ProposalStatusWidget from './ProposalStatusWidget';
import CopilotPanelEnhanced from './CopilotPanelEnhanced';
import { useProposalStore } from '../state/useProposalStore';
import { useAppStore } from '../state/useAppStore';
import { ApprovalState, Priority, ProposalStatus } from '../types';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

function Harness() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ width: 360 }}>
        <CopilotPanelEnhanced />
      </div>
      <div style={{ width: 420 }}>
        <ProposalStatusWidget />
      </div>
    </div>
  );
}

describe('ProposalStatusWidget -> CopilotPanel navigation', () => {
  beforeEach(() => {
    useProposalStore.getState().clearAllData();
    useAppStore.getState().setCopilotPanelTab('chat');
    useAppStore.getState().clearCopilotNav();
  });

  it('clicking section link updates Copilot panel selection', async () => {
    const proposalId = useProposalStore.getState().createProposal({
      title: 'Contoso - Proposal',
      clientName: 'Contoso',
      clientId: 'CRM-contoso',
      opportunityValue: 1000000,
      status: ProposalStatus.IN_REVIEW,
      sections: [
        {
          id: 'sec-1',
          title: 'Security & Compliance',
          content: '...',
          confidence: 0.6,
          sources: [],
          approvalState: ApprovalState.PENDING,
          order: 1,
          lastModified: new Date(),
          modifiedBy: 'User',
          wordCount: 1,
        },
      ],
      openQuestions: [
        {
          id: 'q-1',
          question: 'What is the DR RPO/RTO requirement?',
          rationale: 'Needed for HA/DR design.',
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
      overallConfidence: 0.6,
      totalWordCount: 1,
    });
    useProposalStore.getState().setActiveProposal(proposalId);

    render(<Harness />, { wrapper: Wrapper });

    await userEvent.click(screen.getByRole('button', { name: /review section: security & compliance/i }));

    // Copilot panel should now show selection in Actions tab
    const selectedHeading = screen.getByText(/selected section/i);
    expect(selectedHeading).toBeInTheDocument();
    const selectionCard = selectedHeading.closest('.fui-Card') as HTMLElement | null;
    expect(selectionCard).toBeTruthy();
    expect(within(selectionCard as HTMLElement).getByText(/security & compliance/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear selection/i })).toBeInTheDocument();
  });
});


