import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  Caption1,
  Divider,
  makeStyles,
  ProgressBar,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import { ArrowRight24Regular, DocumentArrowUpRegular, Sparkle24Regular } from '@fluentui/react-icons';
import { useProposalStore } from '../state/useProposalStore';
import { useAppStore } from '../state/useAppStore';
import { ApprovalState, ProposalStatus } from '../types';
import UncertaintyBanner from './UncertaintyBanner';
import { useAppToast } from './toast';

const useStyles = makeStyles({
  card: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalM),
    flexWrap: 'wrap',
  },
  headerLeft: { display: 'flex', alignItems: 'center', ...shorthands.gap(tokens.spacingHorizontalS) },
  badges: { display: 'flex', flexWrap: 'wrap', ...shorthands.gap(tokens.spacingHorizontalS) },
  subtle: { color: tokens.colorNeutralForeground3 },
  links: { display: 'flex', flexDirection: 'column', ...shorthands.gap(tokens.spacingVerticalXS) },
  linkBtn: { justifyContent: 'flex-start', width: '100%', textAlign: 'left' },
});

function statusColor(status: ProposalStatus): 'subtle' | 'brand' | 'warning' | 'success' | 'danger' {
  switch (status) {
    case ProposalStatus.APPROVED:
    case ProposalStatus.ACCEPTED:
      return 'success';
    case ProposalStatus.PENDING_APPROVAL:
    case ProposalStatus.IN_REVIEW:
      return 'warning';
    case ProposalStatus.REJECTED:
    case ProposalStatus.DECLINED:
      return 'danger';
    default:
      return 'brand';
  }
}

export default function ProposalStatusWidget() {
  const styles = useStyles();
  const proposal = useProposalStore((s) => s.getActiveProposal());
  const navigateCopilot = useAppStore((s) => s.navigateCopilot);
  const exportToWord = useAppStore((s) => s.exportToWord);
  const surface = useAppStore((s) => s.surface);
  const toast = useAppToast();

  if (!proposal) {
    return (
      <Card className={styles.card} aria-label="Proposal Status Widget">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Sparkle24Regular />
            <Text weight="semibold">Active proposal</Text>
          </div>
          <Badge appearance="tint" color="subtle">
            none
          </Badge>
        </div>
        <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalS }} />
        <Caption1 className={styles.subtle}>
          Create a proposal via Copilot chat (e.g. “Create proposal for Contoso worth $2.5M”) to see status here.
        </Caption1>
      </Card>
    );
  }

  const total = proposal.sections.length || 1;
  const approved = proposal.sections.filter((s) => s.approvalState === ApprovalState.APPROVED).length;
  const pct = Math.round((approved / total) * 100);

  const needsApproval = proposal.sections
    .filter((s) => s.approvalState !== ApprovalState.APPROVED)
    .slice()
    .sort((a, b) => a.order - b.order);
  const firstNeedsApproval = needsApproval[0];

  const openQuestions = proposal.openQuestions.filter((q) => !q.dismissed);
  const firstQuestion = openQuestions[0];

  return (
    <Card className={styles.card} aria-label="Proposal Status Widget">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Sparkle24Regular />
          <Text weight="semibold">Active proposal</Text>
        </div>
        <div className={styles.badges}>
          <Badge appearance="tint" color={statusColor(proposal.status)}>
            {proposal.status}
          </Badge>
          <Badge appearance="tint" color="subtle">
            ${(proposal.opportunityValue / 1000).toFixed(0)}K
          </Badge>
        </div>
      </div>

      <div style={{ marginTop: tokens.spacingVerticalS }}>
        <Text weight="semibold">{proposal.clientName}</Text>
        <div className={styles.subtle}>
          <Caption1>{proposal.title}</Caption1>
        </div>
      </div>

      <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalS }} />

      <Text size={200} className={styles.subtle}>
        Progress
      </Text>
      <ProgressBar value={pct} max={100} />
      <div style={{ marginTop: tokens.spacingVerticalXS }} className={styles.subtle}>
        <Caption1>
          {pct}% complete · {needsApproval.length} sections need approval · {openQuestions.length} open questions
        </Caption1>
      </div>

      <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalS }} />

      <div className={styles.links}>
        {surface !== 'word' && (
          <Button
            appearance="subtle"
            size="small"
            className={styles.linkBtn}
            icon={<DocumentArrowUpRegular />}
            onClick={() => {
              exportToWord(proposal.id);
              toast('Exported to Word', 'success');
            }}
            aria-label="Export to Word"
          >
            Export to Word
          </Button>
        )}
        {firstNeedsApproval && (
          <Button
            appearance="subtle"
            size="small"
            className={styles.linkBtn}
            icon={<ArrowRight24Regular />}
            iconPosition="after"
            onClick={() =>
              navigateCopilot({ kind: 'section', proposalId: proposal.id, sectionId: firstNeedsApproval.id })
            }
          >
            Review section: {firstNeedsApproval.title}
          </Button>
        )}
        {firstQuestion && (
          <Button
            appearance="subtle"
            size="small"
            className={styles.linkBtn}
            icon={<ArrowRight24Regular />}
            iconPosition="after"
            onClick={() => navigateCopilot({ kind: 'question', proposalId: proposal.id, questionId: firstQuestion.id })}
          >
            Open question: {firstQuestion.question}
          </Button>
        )}
      </div>

      <div style={{ marginTop: tokens.spacingVerticalS }}>
        <UncertaintyBanner compact />
      </div>
    </Card>
  );
}


