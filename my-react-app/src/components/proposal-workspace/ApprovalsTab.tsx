import * as React from 'react';
import {
  Card,
  Divider,
  makeStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import { Proposal, ApprovalState } from '../../types';
import SectionCard from './SectionCard';

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', ...shorthands.gap(tokens.spacingVerticalM) },
  card: { ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM) },
  subtle: { color: tokens.colorNeutralForeground3 },
});

export function ApprovalsTab(props: { proposal: Proposal }) {
  const styles = useStyles();
  const { proposal } = props;
  const needsApproval = React.useMemo(() => {
    return proposal.sections
      .filter((s) => s.approvalState !== ApprovalState.APPROVED)
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [proposal.sections]);

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <Text weight="semibold">Sections needing approval</Text>
        <div className={styles.subtle} style={{ marginTop: tokens.spacingVerticalXS }}>
          <Text size={200}>
            Review, request revision, reject with feedback, or approve. Approved sections are hidden.
          </Text>
        </div>
        <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalM }} />

        {needsApproval.length === 0 ? (
          <Text className={styles.subtle}>All sections are approved.</Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM }}>
            {needsApproval.map((section) => (
              <SectionCard key={section.id} proposalId={proposal.id} section={section} variant="compact" />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}


