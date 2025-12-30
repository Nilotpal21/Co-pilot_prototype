import * as React from 'react';
import {
  Badge,
  Caption1,
  Card,
  Divider,
  Link,
  makeStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import { BookInformation24Regular, Open24Regular } from '@fluentui/react-icons';
import { ProposalSection, Source, SourceType } from '../../types';

const useStyles = makeStyles({
  root: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  headerLeft: { display: 'flex', alignItems: 'center', ...shorthands.gap(tokens.spacingHorizontalS) },
  list: { display: 'flex', flexDirection: 'column', ...shorthands.gap(tokens.spacingVerticalM) },
  sourceCard: { ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM) },
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

export function SourcesPanel(props: { section: ProposalSection }) {
  const styles = useStyles();
  const { section } = props;

  return (
    <div className={styles.root} aria-label="Sources Panel">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <BookInformation24Regular />
          <Text weight="semibold">Provenance</Text>
        </div>
        <Badge appearance="tint" color="subtle">
          {section.sources.length} sources
        </Badge>
      </div>

      <div>
        <Text weight="semibold">{section.title}</Text>
        <div className={styles.subtle}>
          <Caption1>Sources Copilot used (or recommends) for this section.</Caption1>
        </div>
      </div>

      <Divider />

      {section.sources.length === 0 ? (
        <Card className={styles.sourceCard}>
          <Text weight="semibold">No sources linked</Text>
          <div style={{ marginTop: tokens.spacingVerticalS }} className={styles.subtle}>
            <Caption1>
              Add sources to increase confidence and make approvals easier (CRM notes, emails, prior proposals, etc.).
            </Caption1>
          </div>
        </Card>
      ) : (
        <div className={styles.list}>
          {section.sources.map((s: Source) => (
            <Card key={s.id} className={styles.sourceCard}>
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

              {s.excerpt && (
                <div style={{ marginTop: tokens.spacingVerticalS }}>
                  <Text className={styles.subtle}>{s.excerpt}</Text>
                </div>
              )}

              <div style={{ marginTop: tokens.spacingVerticalS }}>
                {isProbablyUrl(s.reference) ? (
                  <Link href={s.reference} target="_blank" rel="noreferrer">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
                      Open source <Open24Regular aria-hidden />
                    </span>
                  </Link>
                ) : (
                  <Caption1 className={styles.subtle}>Reference: {s.reference}</Caption1>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default SourcesPanel;


