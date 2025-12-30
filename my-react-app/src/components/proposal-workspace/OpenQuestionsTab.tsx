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
import { Checkmark24Regular, Dismiss24Regular, QuestionCircle24Regular } from '@fluentui/react-icons';
import { OpenQuestion, Priority, Proposal } from '../../types';
import { useProposalStore } from '../../state/useProposalStore';

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', ...shorthands.gap(tokens.spacingVerticalM) },
  card: { ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM) },
  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', ...shorthands.gap(tokens.spacingHorizontalM) },
  actions: { display: 'flex', flexWrap: 'wrap', ...shorthands.gap(tokens.spacingHorizontalS), justifyContent: 'flex-end' },
  subtle: { color: tokens.colorNeutralForeground3 },
  empty: { textAlign: 'center', ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalL), color: tokens.colorNeutralForeground3 },
});

function priorityBadge(priority: Priority): { label: string; color: 'danger' | 'warning' | 'informative' } {
  switch (priority) {
    case Priority.HIGH:
      return { label: 'HIGH', color: 'danger' };
    case Priority.MEDIUM:
      return { label: 'MEDIUM', color: 'warning' };
    default:
      return { label: 'LOW', color: 'informative' };
  }
}

export function OpenQuestionsTab(props: { proposal: Proposal }) {
  const styles = useStyles();
  const { proposal } = props;

  const resolveQuestion = useProposalStore((s) => s.resolveQuestion);
  const dismissQuestion = useProposalStore((s) => s.dismissQuestion);

  const questions = React.useMemo(() => proposal.openQuestions.filter((q) => !q.dismissed), [proposal.openQuestions]);

  const onResolve = React.useCallback(
    (q: OpenQuestion) => resolveQuestion(proposal.id, q.id),
    [resolveQuestion, proposal.id]
  );

  const onDismiss = React.useCallback(
    (q: OpenQuestion) => dismissQuestion(proposal.id, q.id),
    [dismissQuestion, proposal.id]
  );

  if (questions.length === 0) {
    return (
      <div className={styles.empty}>
        <QuestionCircle24Regular />
        <div style={{ marginTop: tokens.spacingVerticalS }}>
          <Text weight="semibold">No open questions</Text>
        </div>
        <div style={{ marginTop: tokens.spacingVerticalXS }}>
          <Caption1>Copilot will surface questions when something blocks completion.</Caption1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {questions.map((q) => {
        const p = priorityBadge(q.priority);
        return (
          <Card key={q.id} className={styles.card}>
            <div className={styles.headerRow}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text weight="semibold">{q.question}</Text>
                <div style={{ marginTop: tokens.spacingVerticalXS }}>
                  <Badge appearance="tint" color={p.color}>
                    {p.label}
                  </Badge>
                </div>
                <Divider style={{ marginTop: tokens.spacingVerticalM, marginBottom: tokens.spacingVerticalM }} />
                <Text className={styles.subtle}>{q.rationale}</Text>
                {q.category && (
                  <div style={{ marginTop: tokens.spacingVerticalS }}>
                    <Caption1 className={styles.subtle}>Category: {q.category}</Caption1>
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                <Button appearance="primary" icon={<Checkmark24Regular />} onClick={() => onResolve(q)}>
                  Resolve
                </Button>
                <Button appearance="subtle" icon={<Dismiss24Regular />} onClick={() => onDismiss(q)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}


