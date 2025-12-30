import * as React from 'react';
import {
  Badge,
  Card,
  Caption1,
  Divider,
  Link,
  makeStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import { BookInformation24Regular } from '@fluentui/react-icons';
import { Proposal, Source, SourceType } from '../../types';
import { uniqueSources } from './helpers';

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', ...shorthands.gap(tokens.spacingVerticalM) },
  header: { display: 'flex', alignItems: 'center', ...shorthands.gap(tokens.spacingHorizontalS) },
  card: { ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM) },
  row: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', ...shorthands.gap(tokens.spacingHorizontalM) },
  meta: { display: 'flex', flexWrap: 'wrap', ...shorthands.gap(tokens.spacingHorizontalS), marginTop: tokens.spacingVerticalXS },
  subtle: { color: tokens.colorNeutralForeground3 },
});

function sourceTypeLabel(type: SourceType): string {
  switch (type) {
    case SourceType.CRM:
      return 'CRM';
    case SourceType.EMAIL:
      return 'Email';
    case SourceType.DOCUMENT:
      return 'Document';
    case SourceType.MEETING_NOTES:
      return 'Meeting notes';
    case SourceType.PREVIOUS_PROPOSAL:
      return 'Previous proposal';
    case SourceType.CUSTOMER_WEBSITE:
      return 'Customer website';
    case SourceType.INTERNAL_WIKI:
      return 'Internal wiki';
    case SourceType.SALES_PLAYBOOK:
      return 'Sales playbook';
    default:
      return type;
  }
}

function isProbablyUrl(ref: string): boolean {
  return /^https?:\/\//i.test(ref);
}

export function SourcesTab(props: { proposal: Proposal }) {
  const styles = useStyles();
  const { proposal } = props;
  const sources = React.useMemo(() => uniqueSources(proposal), [proposal]);

  if (sources.length === 0) {
    return (
      <Card className={styles.card}>
        <Text weight="semibold">No sources linked yet</Text>
        <div style={{ marginTop: tokens.spacingVerticalS }} className={styles.subtle}>
          <Caption1>
            Copilot can cite sources per section. Add sources to improve confidence and approvals.
          </Caption1>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <BookInformation24Regular />
        <Text weight="semibold">Sources</Text>
        <Badge appearance="tint" color="subtle">
          {sources.length}
        </Badge>
      </div>

      {sources.map((s: Source) => (
        <Card key={s.id} className={styles.card}>
          <div className={styles.row}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text weight="semibold">{s.title}</Text>
              <div className={styles.meta}>
                <Badge appearance="tint" color="informative">
                  {sourceTypeLabel(s.type)}
                </Badge>
                <Badge appearance="tint" color="subtle">
                  Relevance {(s.relevanceScore * 100).toFixed(0)}%
                </Badge>
                <Badge appearance="tint" color="subtle">
                  Updated {new Date(s.lastUpdated).toLocaleDateString()}
                </Badge>
              </div>

              <Divider style={{ marginTop: tokens.spacingVerticalM, marginBottom: tokens.spacingVerticalM }} />

              {s.excerpt && <Text className={styles.subtle}>{s.excerpt}</Text>}
              <div style={{ marginTop: tokens.spacingVerticalS }}>
                {isProbablyUrl(s.reference) ? (
                  <Link href={s.reference} target="_blank" rel="noreferrer">
                    Open source
                  </Link>
                ) : (
                  <Caption1 className={styles.subtle}>Reference: {s.reference}</Caption1>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}


