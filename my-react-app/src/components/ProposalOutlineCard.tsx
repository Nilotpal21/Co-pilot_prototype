/**
 * Proposal Outline Preview Card
 * Shows a preview of created proposal with next steps
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Button,
  Text,
  Badge,
  Divider,
} from '@fluentui/react-components';
import {
  CheckmarkCircle20Regular,
  Document20Regular,
  Edit20Regular,
  Send20Regular,
} from '@fluentui/react-icons';
import { Proposal } from '../types';
import { formatLocaleDate } from '../utils/date';

interface ProposalOutlineCardProps {
  proposal: Proposal;
  onViewDetails?: () => void;
  onEditSections?: () => void;
}

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalM,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  badges: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  outline: {
    marginTop: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
  },
  outlineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
  },
  nextSteps: {
    marginTop: tokens.spacingVerticalM,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    marginTop: tokens.spacingVerticalM,
  },
});

export const ProposalOutlineCard: React.FC<ProposalOutlineCardProps> = ({
  proposal,
  onViewDetails,
  onEditSections,
}) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Document20Regular />
          <Text weight="semibold">{proposal.title}</Text>
        </div>
      </div>

      <div className={styles.badges}>
        <Badge appearance="tint" color="brand">
          {proposal.clientName}
        </Badge>
        <Badge appearance="tint" color="informative">
          ${(proposal.opportunityValue / 1000).toFixed(0)}K
        </Badge>
        <Badge appearance="tint" color="success">
          {proposal.status}
        </Badge>
        <Badge appearance="tint" color="subtle">
          Due: {formatLocaleDate(proposal.dueDate)}
        </Badge>
      </div>

      <Divider style={{ marginTop: tokens.spacingVerticalM, marginBottom: tokens.spacingVerticalM }} />

      <div className={styles.outline}>
        <Text weight="semibold">Proposal Outline:</Text>
        {proposal.sections.map((section, index) => (
          <div key={section.id} className={styles.outlineItem}>
            <CheckmarkCircle20Regular style={{ color: tokens.colorPaletteGreenForeground1 }} />
            <div>
              <Text>
                {index + 1}. {section.title}
              </Text>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                {' '}
                ({section.wordCount} words)
              </Text>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.nextSteps}>
        <Text weight="semibold">Next Steps:</Text>
        <div className={styles.outlineItem}>
          <Text>1. Review and edit the Executive Summary</Text>
        </div>
        <div className={styles.outlineItem}>
          <Text>2. Add additional sections (Solution, Pricing, Timeline)</Text>
        </div>
        <div className={styles.outlineItem}>
          <Text>3. Submit for approval</Text>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          appearance="primary"
          icon={<Edit20Regular />}
          onClick={onEditSections}
        >
          Edit Sections
        </Button>
        <Button
          appearance="secondary"
          icon={<Document20Regular />}
          onClick={onViewDetails}
        >
          View Full Details
        </Button>
        <Button
          appearance="secondary"
          icon={<Send20Regular />}
        >
          Share Preview
        </Button>
      </div>
    </Card>
  );
};

export default ProposalOutlineCard;

