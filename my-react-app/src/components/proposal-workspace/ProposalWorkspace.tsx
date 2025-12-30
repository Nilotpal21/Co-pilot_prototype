import * as React from 'react';
import {
  Card,
  makeStyles,
  shorthands,
  Tab,
  TabList,
  Text,
  tokens,
} from '@fluentui/react-components';
import {
  BookInformation24Regular,
  CheckmarkCircle24Regular,
  Document24Regular,
  QuestionCircle24Regular,
  Sparkle24Regular,
} from '@fluentui/react-icons';
import { useProposalStore } from '../../state/useProposalStore';
import { Proposal } from '../../types';
import { ProposalWorkspaceTab, ProposalWorkspaceProps } from './types';
import { OverviewTab } from './OverviewTab';
import { SectionsTab } from './SectionsTab';
import { OpenQuestionsTab } from './OpenQuestionsTab';
import { ApprovalsTab } from './ApprovalsTab';
import { SourcesTab } from './SourcesTab';

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: '980px',
    margin: '0 auto',
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
  },
  shell: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalM),
    flexWrap: 'wrap',
    marginBottom: tokens.spacingVerticalM,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  tabs: { marginBottom: tokens.spacingVerticalM },
  empty: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalL),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
});

function resolveProposal(args: {
  proposal?: Proposal;
  proposalId?: string;
  activeProposal?: Proposal;
}): Proposal | undefined {
  if (args.proposal) return args.proposal;
  if (args.proposalId) return args.activeProposal && args.activeProposal.id === args.proposalId ? args.activeProposal : undefined;
  return args.activeProposal;
}

export default function ProposalWorkspace(props: ProposalWorkspaceProps) {
  const styles = useStyles();
  const [tab, setTab] = React.useState<ProposalWorkspaceTab>('overview');

  const activeProposal = useProposalStore((s) => s.getActiveProposal());

  const proposal = resolveProposal({
    proposal: props.proposal,
    proposalId: props.proposalId,
    activeProposal,
  });

  const onTabSelect = React.useCallback((_: unknown, data: { value: unknown }) => {
    setTab(data.value as ProposalWorkspaceTab);
  }, []);

  if (!proposal) {
    return (
      <div className={styles.root} aria-label="Proposal Workspace">
        <Card className={styles.shell}>
          <div className={styles.empty}>
            <Sparkle24Regular />
            <div style={{ marginTop: tokens.spacingVerticalS }}>
              <Text weight="semibold">No active proposal yet</Text>
            </div>
            <div style={{ marginTop: tokens.spacingVerticalS }}>
              <Text>
                Create one via the Copilot chat (e.g. “Create proposal for Contoso worth $2.5M”), then come back here to
                manage sections, approvals, questions, and sources.
              </Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.root} aria-label="Proposal Workspace">
      <Card className={styles.shell}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Sparkle24Regular />
            <Text weight="semibold">Proposal Workspace</Text>
          </div>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            Copilot-native controls for quality, approvals, and traceability
          </Text>
        </div>

        <TabList className={styles.tabs} selectedValue={tab} onTabSelect={onTabSelect} aria-label="Proposal workspace tabs">
          <Tab value="overview" icon={<Sparkle24Regular />}>
            Overview
          </Tab>
          <Tab value="sections" icon={<Document24Regular />}>
            Sections
          </Tab>
          <Tab value="questions" icon={<QuestionCircle24Regular />}>
            Open Questions
          </Tab>
          <Tab value="approvals" icon={<CheckmarkCircle24Regular />}>
            Approvals
          </Tab>
          <Tab value="sources" icon={<BookInformation24Regular />}>
            Sources
          </Tab>
        </TabList>

        {tab === 'overview' && (
          <OverviewTab
            proposal={proposal}
            onGoToApprovals={() => setTab('approvals')}
            onGoToQuestions={() => setTab('questions')}
            onGoToSections={() => setTab('sections')}
          />
        )}
        {tab === 'sections' && <SectionsTab proposal={proposal} />}
        {tab === 'questions' && <OpenQuestionsTab proposal={proposal} />}
        {tab === 'approvals' && <ApprovalsTab proposal={proposal} />}
        {tab === 'sources' && <SourcesTab proposal={proposal} />}
      </Card>
    </div>
  );
}


