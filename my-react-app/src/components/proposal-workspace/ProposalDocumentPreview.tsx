import * as React from 'react';
import {
  Badge,
  Caption1,
  Divider,
  makeStyles,
  shorthands,
  Text,
  Title2,
  Title3,
  tokens,
} from '@fluentui/react-components';
import { ApprovalState, Proposal, ProposalSection, ProposalStatus } from '../../types';
import ConfidenceBadge from './ConfidenceBadge';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalM),
    flexWrap: 'wrap',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap(tokens.spacingHorizontalS),
    marginTop: tokens.spacingVerticalXS,
  },
  subtle: { color: tokens.colorNeutralForeground3 },
  toc: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  sectionMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap(tokens.spacingHorizontalS),
    marginTop: tokens.spacingVerticalXS,
  },
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

function approvalColor(state: ApprovalState): 'subtle' | 'brand' | 'warning' | 'success' | 'danger' {
  switch (state) {
    case ApprovalState.APPROVED:
      return 'success';
    case ApprovalState.PENDING:
      return 'warning';
    case ApprovalState.REJECTED:
      return 'danger';
    case ApprovalState.NEEDS_REVISION:
      return 'warning';
    default:
      return 'brand';
  }
}

export default function ProposalDocumentPreview(props: {
  proposal: Proposal;
  exportedAtIso: string;
}) {
  const styles = useStyles();
  const { proposal, exportedAtIso } = props;
  const exportedAt = new Date(exportedAtIso);

  const sections = React.useMemo(() => proposal.sections.slice().sort((a, b) => a.order - b.order), [proposal.sections]);

  return (
    <div className={styles.root} aria-label="Word Export Preview">
      <div className={styles.header}>
        <div>
          <Title2>{proposal.title}</Title2>
          <div className={styles.subtle}>
            <Caption1>
              Client: {proposal.clientName} · Exported {exportedAt.toLocaleString()}
            </Caption1>
          </div>
          <div className={styles.meta}>
            <Badge appearance="tint" color={statusColor(proposal.status)}>
              {proposal.status}
            </Badge>
            <Badge appearance="tint" color="subtle">
              ${(proposal.opportunityValue / 1000).toFixed(0)}K
            </Badge>
            <Badge appearance="tint" color="subtle">
              Overall confidence {(proposal.overallConfidence * 100).toFixed(0)}%
            </Badge>
          </div>
        </div>
      </div>

      <div className={styles.toc}>
        <Text weight="semibold">Table of contents</Text>
        <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalS }} />
        {sections.map((s, idx) => (
          <Text key={s.id} className={styles.subtle}>
            {idx + 1}. {s.title}
          </Text>
        ))}
      </div>

      {sections.map((section: ProposalSection, idx) => (
        <div key={section.id}>
          <Title3>
            {idx + 1}. {section.title}
          </Title3>
          <div className={styles.sectionMeta}>
            <Badge appearance="tint" color={approvalColor(section.approvalState)}>
              {section.approvalState}
            </Badge>
            <ConfidenceBadge confidence={section.confidence} />
            <Badge appearance="tint" color="subtle">
              {section.sources.length} sources
            </Badge>
          </div>
          <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalS }} />
          <Text>{section.content || 'No content yet.'}</Text>
        </div>
      ))}
    </div>
  );
}


