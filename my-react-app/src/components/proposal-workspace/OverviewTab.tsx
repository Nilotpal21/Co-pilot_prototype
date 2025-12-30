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
import { CheckmarkCircle24Regular, QuestionCircle24Regular, Sparkle24Regular } from '@fluentui/react-icons';
import { Proposal, ProposalStatus, Priority } from '../../types';
import { activeNudges, activeQuestions, completionPercentage, countByPriority, lowConfidenceSectionIds } from './helpers';
import { formatLocaleDate } from '../../utils/date';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalM),
    flexWrap: 'wrap',
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 900px)': { gridTemplateColumns: '1fr' },
  },
  card: { ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM) },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap(tokens.spacingHorizontalS),
    marginTop: tokens.spacingVerticalS,
  },
  subtle: { color: tokens.colorNeutralForeground3 },
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

export function OverviewTab(props: {
  proposal: Proposal;
  onGoToApprovals: () => void;
  onGoToQuestions: () => void;
  onGoToSections: () => void;
}) {
  const styles = useStyles();
  const { proposal, onGoToApprovals, onGoToQuestions, onGoToSections } = props;

  const pct = completionPercentage(proposal);
  const qs = activeQuestions(proposal);
  const nudges = activeNudges(proposal);
  const qCounts = countByPriority(qs);
  const nCounts = countByPriority(nudges);
  const lowConf = lowConfidenceSectionIds(proposal).length;

  const hasApprovalWork = proposal.sections.some((s) => s.approvalState !== 'approved');

  return (
    <div className={styles.root}>
      <div className={styles.topRow}>
        <div>
          <Text weight="semibold" size={500}>
            {proposal.title}
          </Text>
          <div className={styles.subtle}>
            <Caption1>
              Client: {proposal.clientName} · Due {formatLocaleDate(proposal.dueDate)}
            </Caption1>
          </div>
        </div>

        <div className={styles.badges}>
          <Badge appearance="tint" color={statusColor(proposal.status)}>
            {proposal.status}
          </Badge>
          <Badge appearance="tint" color="informative">
            ${(proposal.opportunityValue / 1000).toFixed(0)}K
          </Badge>
          <Badge appearance="tint" color="subtle">
            Confidence: {(proposal.overallConfidence * 100).toFixed(0)}%
          </Badge>
        </div>
      </div>

      <Card className={styles.card}>
        <Text weight="semibold">Progress</Text>
        <div style={{ marginTop: tokens.spacingVerticalS }}>
          <ProgressBar value={pct} max={100} />
        </div>
        <div style={{ marginTop: tokens.spacingVerticalS }} className={styles.subtle}>
          <Caption1>
            {pct}% complete · {proposal.sections.length} sections · {proposal.totalWordCount} words
          </Caption1>
        </div>
      </Card>

      <div className={styles.grid}>
        <Card className={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
            <Sparkle24Regular />
            <Text weight="semibold">Copilot next actions</Text>
          </div>
          <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalS }} />

          <Caption1 className={styles.subtle}>
            Based on your current draft, approvals, and unresolved questions.
          </Caption1>

          <div className={styles.actions}>
            <Button appearance="primary" icon={<CheckmarkCircle24Regular />} onClick={onGoToApprovals} disabled={!hasApprovalWork}>
              Review approvals
            </Button>
            <Button appearance="secondary" icon={<QuestionCircle24Regular />} onClick={onGoToQuestions} disabled={qs.length === 0}>
              Resolve questions ({qs.length})
            </Button>
            <Button appearance="secondary" onClick={onGoToSections} disabled={lowConf === 0}>
              Improve low-confidence sections ({lowConf})
            </Button>
          </div>
        </Card>

        <Card className={styles.card}>
          <Text weight="semibold">Signals</Text>
          <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalS }} />

          <Text>
            <Text weight="semibold">Open questions:</Text> {qs.length} (High {qCounts[Priority.HIGH]}, Med{' '}
            {qCounts[Priority.MEDIUM]})
          </Text>
          <Text>
            <Text weight="semibold">Active nudges:</Text> {nudges.length} (High {nCounts[Priority.HIGH]}, Med{' '}
            {nCounts[Priority.MEDIUM]})
          </Text>
          <Text>
            <Text weight="semibold">Low-confidence sections:</Text> {lowConf}
          </Text>
        </Card>
      </div>
    </div>
  );
}


