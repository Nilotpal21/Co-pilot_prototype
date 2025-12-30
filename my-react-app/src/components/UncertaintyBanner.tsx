import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  Caption1,
  Divider,
  makeStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import { PeopleTeam24Regular, Warning24Regular, Wrench24Regular } from '@fluentui/react-icons';
import { useProposalStore } from '../state/useProposalStore';
import { useAppStore } from '../state/useAppStore';
import { ApprovalState, Priority } from '../types';
import { useAppToast } from './toast';

const useStyles = makeStyles({
  card: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorPaletteYellowBackground2,
    borderLeft: `4px solid ${tokens.colorPaletteYellowForeground1}`,
  },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...shorthands.gap(tokens.spacingHorizontalM) },
  headerLeft: { display: 'flex', alignItems: 'center', ...shorthands.gap(tokens.spacingHorizontalS) },
  subtle: { color: tokens.colorNeutralForeground3 },
  list: { marginTop: tokens.spacingVerticalS, paddingLeft: tokens.spacingHorizontalL },
  actions: { display: 'flex', flexWrap: 'wrap', ...shorthands.gap(tokens.spacingHorizontalS), marginTop: tokens.spacingVerticalM },
});

function isBlocked(args: {
  highQuestions: number;
  rejected: number;
  needsRevision: number;
}): boolean {
  return args.highQuestions > 0 || args.rejected > 0;
}

export default function UncertaintyBanner(props: { compact?: boolean }) {
  const styles = useStyles();
  const compact = props.compact ?? false;

  const proposal = useProposalStore((s) => s.getActiveProposal());
  const applyStandardTemplate = useProposalStore((s) => s.applyStandardTemplate);
  const createReviewRequest = useProposalStore((s) => s.createReviewRequest);

  const setSurface = useAppStore((s) => s.setSurface);
  const toast = useAppToast();

  if (!proposal) return null;

  const lowConfidence = proposal.sections.filter((s) => s.confidence < 0.6).length;
  const rejected = proposal.sections.filter((s) => s.approvalState === ApprovalState.REJECTED).length;
  const needsRevision = proposal.sections.filter((s) => s.approvalState === ApprovalState.NEEDS_REVISION).length;
  const highQuestions = proposal.openQuestions.filter((q) => !q.dismissed && q.priority === Priority.HIGH).length;

  const blocked = isBlocked({ highQuestions, rejected, needsRevision });
  const uncertain = lowConfidence > 0 || needsRevision > 0;

  if (!blocked && !uncertain) return null;

  const reasons: string[] = [];
  if (highQuestions > 0) reasons.push(`${highQuestions} high-priority open question(s)`);
  if (rejected > 0) reasons.push(`${rejected} rejected section(s)`);
  if (needsRevision > 0) reasons.push(`${needsRevision} section(s) needing revision`);
  if (lowConfidence > 0) reasons.push(`${lowConfidence} low-confidence section(s)`);

  return (
    <Card className={styles.card} aria-label="Uncertainty Banner">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Warning24Regular />
          <Text weight="semibold">{blocked ? 'Proposal blocked' : 'Proposal uncertain'}</Text>
        </div>
        <Badge appearance="tint" color={blocked ? 'danger' : 'warning'}>
          {blocked ? 'Action required' : 'Needs review'}
        </Badge>
      </div>

      {!compact && (
        <>
          <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalS }} />
          <Caption1 className={styles.subtle}>
            Copilot can’t confidently proceed without additional structure or human validation.
          </Caption1>
          <ul className={styles.list}>
            {reasons.map((r) => (
              <li key={r}>
                <Caption1>{r}</Caption1>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className={styles.actions}>
        <Button
          appearance="primary"
          icon={<Wrench24Regular />}
          onClick={() => {
            applyStandardTemplate(proposal.id);
            toast('Standard template applied.', 'success');
          }}
        >
          Apply standard template
        </Button>
        <Button
          appearance="secondary"
          icon={<PeopleTeam24Regular />}
          onClick={() => {
            createReviewRequest(proposal.id, {
              reason: `Uncertainty/blocked: ${reasons.join(', ')}`,
              assignee: { id: 'rev-1', name: 'Alex Wilbur', email: 'alex.wilbur@contoso.com' },
              relatedSectionIds: proposal.sections
                .filter((s) => s.approvalState === ApprovalState.REJECTED || s.confidence < 0.6)
                .map((s) => s.id),
              relatedQuestionIds: proposal.openQuestions.filter((q) => !q.dismissed).map((q) => q.id),
            });
            toast('Escalated for human review (simulated).', 'warning');
            // Show the escalation in Teams surface.
            setSurface('teams');
          }}
        >
          Escalate for human review
        </Button>
      </div>
    </Card>
  );
}


