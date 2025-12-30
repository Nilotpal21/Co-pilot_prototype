import * as React from 'react';
import { Badge, Tooltip, makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';
import { CheckmarkCircle16Regular, DismissCircle16Regular, Warning16Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  badgeContent: {
    display: 'inline-flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
  },
});

export type ConfidenceLevel = 'high' | 'medium' | 'low';

function level(confidence: number): ConfidenceLevel {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.6) return 'medium';
  return 'low';
}

function levelColor(lvl: ConfidenceLevel): 'success' | 'warning' | 'danger' {
  switch (lvl) {
    case 'high':
      return 'success';
    case 'medium':
      return 'warning';
    default:
      return 'danger';
  }
}

function levelIcon(lvl: ConfidenceLevel) {
  switch (lvl) {
    case 'high':
      return <CheckmarkCircle16Regular aria-hidden />;
    case 'medium':
      return <Warning16Regular aria-hidden />;
    default:
      return <DismissCircle16Regular aria-hidden />;
  }
}

function tooltipText(confidence: number): string {
  const pct = Math.round(confidence * 100);
  const lvl = level(confidence);
  if (lvl === 'high') {
    return `High confidence (${pct}%). Copilot has strong support for this content.`;
  }
  if (lvl === 'medium') {
    return `Medium confidence (${pct}%). Consider adding a source or tightening specifics.`;
  }
  return `Low confidence (${pct}%). Add provenance (sources) and validate claims before approval.`;
}

export function ConfidenceBadge(props: { confidence: number; size?: 'small' | 'medium' }) {
  const styles = useStyles();
  const { confidence, size = 'small' } = props;
  const lvl = level(confidence);
  const pct = Math.round(confidence * 100);

  return (
    <Tooltip content={tooltipText(confidence)} relationship="description">
      <Badge
        appearance="tint"
        color={levelColor(lvl)}
        size={size}
        aria-label={`${lvl} confidence ${pct} percent`}
      >
        <span className={styles.badgeContent}>
          {levelIcon(lvl)}
          <Text size={200} style={{ lineHeight: 1 }}>
            {pct}%
          </Text>
        </span>
      </Badge>
    </Tooltip>
  );
}

export default ConfidenceBadge;


