/**
 * NudgeCenter - renders proactive nudges with "Why this appeared" explanations.
 */

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
import {
  Alert24Regular,
  Dismiss24Regular,
  Eye24Regular,
  Info24Regular,
} from '@fluentui/react-icons';
import { Nudge, NudgeType, Priority } from '../types';
import { useProposalStore } from '../state/useProposalStore';
import { CopilotPanelNavigation } from '../state/copilotPanelNav';

export interface NudgeCenterProps {
  onNavigate?: (nav: CopilotPanelNavigation) => void;
}

const useStyles = makeStyles({
  root: {
    height: '100%',
    overflow: 'auto',
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  card: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap(tokens.spacingHorizontalS),
    marginTop: tokens.spacingVerticalS,
  },
  why: {
    marginTop: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  whyHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    marginBottom: tokens.spacingVerticalXS,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalS),
    marginTop: tokens.spacingVerticalM,
  },
  empty: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalL),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
});

function priorityColor(priority: Priority): 'danger' | 'warning' | 'informative' | 'subtle' {
  switch (priority) {
    case Priority.HIGH:
      return 'danger';
    case Priority.MEDIUM:
      return 'warning';
    case Priority.LOW:
      return 'informative';
    default:
      return 'subtle';
  }
}

function nudgeTypeLabel(type: NudgeType): string {
  switch (type) {
    case NudgeType.COMPLIANCE:
      return 'Compliance';
    case NudgeType.WARNING:
      return 'Warning';
    case NudgeType.REMINDER:
      return 'Reminder';
    case NudgeType.BEST_PRACTICE:
      return 'Best practice';
    case NudgeType.INFO:
      return 'Info';
    case NudgeType.SUGGESTION:
    default:
      return 'Suggestion';
  }
}

function formatWhyThisAppeared(args: {
  nudge: Nudge;
  proposalTitle?: string;
  relatedSectionTitle?: string;
}): string {
  const { nudge, proposalTitle, relatedSectionTitle } = args;

  const parts: string[] = [];
  parts.push(`${nudgeTypeLabel(nudge.type)} nudge (${nudge.priority} priority)`);

  if (proposalTitle) {
    parts.push(`for “${proposalTitle}”`);
  }
  if (relatedSectionTitle) {
    parts.push(`related to section “${relatedSectionTitle}”`);
  } else if (nudge.relatedSectionId) {
    parts.push(`related to a specific section`);
  }

  if (nudge.actionType === 'navigate' && nudge.actionTarget) {
    parts.push(`suggested navigation to “${nudge.actionTarget}”`);
  }

  if (nudge.expiresAt) {
    const expires = new Date(nudge.expiresAt);
    parts.push(`expires on ${expires.toLocaleDateString()}`);
  }

  return parts.join(' · ');
}

export default function NudgeCenter(props: NudgeCenterProps) {
  const styles = useStyles();
  const { onNavigate } = props;

  const activeProposal = useProposalStore((s) => s.getActiveProposal());
  const dismissNudge = useProposalStore((s) => s.dismissNudge);

  const activeNudges = React.useMemo(() => {
    if (!activeProposal) return [];
    return activeProposal.nudges
      .filter((n) => !n.dismissed)
      .slice()
      .sort((a, b) => {
        const score = (p: Priority) => (p === Priority.HIGH ? 3 : p === Priority.MEDIUM ? 2 : 1);
        return score(b.priority) - score(a.priority);
      });
  }, [activeProposal]);

  const getSectionTitle = React.useCallback(
    (sectionId?: string) => {
      if (!activeProposal || !sectionId) return undefined;
      return activeProposal.sections.find((s) => s.id === sectionId)?.title;
    },
    [activeProposal]
  );

  return (
    <div className={styles.root} aria-label="Nudge Center">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Alert24Regular />
          <Text weight="semibold">Nudges</Text>
        </div>
        <Badge appearance="tint" color="subtle">
          {activeNudges.length} active
        </Badge>
      </div>

      <Divider />

      {!activeProposal ? (
        <div className={styles.empty}>
          <Text weight="semibold">No active proposal</Text>
          <div style={{ marginTop: tokens.spacingVerticalS }}>
            <Caption1>Create or select a proposal to see proactive nudges.</Caption1>
          </div>
        </div>
      ) : activeNudges.length === 0 ? (
        <div className={styles.empty}>
          <Text weight="semibold">All caught up</Text>
          <div style={{ marginTop: tokens.spacingVerticalS }}>
            <Caption1>No active nudges for “{activeProposal.title}”.</Caption1>
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {activeNudges.map((nudge) => {
            const relatedSectionTitle = getSectionTitle(nudge.relatedSectionId);
            const why = formatWhyThisAppeared({
              nudge,
              proposalTitle: activeProposal.title,
              relatedSectionTitle,
            });

            return (
              <Card key={nudge.id} className={styles.card}>
                <div className={styles.messageRow}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text weight="semibold">{nudge.message}</Text>
                    {nudge.actionLabel && (
                      <div style={{ marginTop: tokens.spacingVerticalXS }}>
                        <Caption1>Suggested action: {nudge.actionLabel}</Caption1>
                      </div>
                    )}

                    <div className={styles.badges}>
                      <Badge appearance="tint" color={priorityColor(nudge.priority)}>
                        {nudge.priority.toUpperCase()}
                      </Badge>
                      <Badge appearance="tint" color="brand">
                        {nudgeTypeLabel(nudge.type)}
                      </Badge>
                      {relatedSectionTitle && (
                        <Badge appearance="tint" color="informative">
                          {relatedSectionTitle}
                        </Badge>
                      )}
                    </div>

                    <div className={styles.why}>
                      <div className={styles.whyHeader}>
                        <Info24Regular />
                        <Text weight="semibold" size={200}>
                          Why this appeared
                        </Text>
                      </div>
                      <Caption1>{why}</Caption1>
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Button
                    appearance="secondary"
                    icon={<Eye24Regular />}
                    onClick={() => {
                      onNavigate?.({
                        kind: 'nudge',
                        proposalId: activeProposal.id,
                        nudgeId: nudge.id,
                        relatedSectionId: nudge.relatedSectionId,
                      });
                    }}
                  >
                    View
                  </Button>
                  <Button
                    appearance="subtle"
                    icon={<Dismiss24Regular />}
                    onClick={() => dismissNudge(activeProposal.id, nudge.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


