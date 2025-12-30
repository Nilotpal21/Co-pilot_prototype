/**
 * Example component demonstrating usage of Proposal domain types
 * This is a reference implementation showing how to work with the types
 */

import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Text,
  Title3,
  Body1,
  Caption1,
  makeStyles,
  tokens,
  Tag,
  ProgressBar,
} from '@fluentui/react-components';
import {
  CheckmarkCircle20Regular,
  Warning20Regular,
  Question20Regular,
  Info20Regular,
} from '@fluentui/react-icons';
import { mockProposal, getCompletionPercentage, getHighPriorityItems } from '../data/mockData';
import { Proposal, ApprovalState, Priority, NudgeType } from '../types';
import { formatLocaleDate } from '../utils/date';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalXXL,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: tokens.spacingVerticalXL,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalXL,
  },
  statCard: {
    padding: tokens.spacingVerticalL,
  },
  section: {
    marginBottom: tokens.spacingVerticalXL,
  },
  sectionCard: {
    marginBottom: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
  },
  confidenceBar: {
    marginTop: tokens.spacingVerticalS,
  },
  nudgeCard: {
    marginBottom: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalM,
  },
  questionCard: {
    marginBottom: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalM,
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalS,
  },
  badge: {
    marginRight: tokens.spacingHorizontalS,
  },
});

const ProposalExample: React.FC = () => {
  const styles = useStyles();
  const [proposal] = React.useState<Proposal>(mockProposal);
  const completionPercent = getCompletionPercentage(proposal);
  const { questions, nudges } = getHighPriorityItems(proposal);

  const getApprovalStateColor = (state: ApprovalState) => {
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
        return 'subtle';
    }
  };

  const getNudgeIcon = (type: NudgeType) => {
    switch (type) {
      case NudgeType.WARNING:
        return <Warning20Regular />;
      case NudgeType.INFO:
        return <Info20Regular />;
      case NudgeType.SUGGESTION:
      case NudgeType.BEST_PRACTICE:
        return <CheckmarkCircle20Regular />;
      default:
        return <Info20Regular />;
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatConfidence = (confidence: number): string => {
    return `${Math.round(confidence * 100)}%`;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Title3>{proposal.title}</Title3>
        <Body1>
          {proposal.clientName} • {formatCurrency(proposal.opportunityValue)} • Due{' '}
          {formatLocaleDate(proposal.dueDate)}
        </Body1>
        <div className={styles.flexRow}>
          <Tag appearance="filled" color="brand">
            {proposal.status}
          </Tag>
          <Caption1>
            Overall Confidence: {formatConfidence(proposal.overallConfidence)}
          </Caption1>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <Text weight="semibold">Completion</Text>
          <Title3>{completionPercent}%</Title3>
          <ProgressBar value={completionPercent / 100} />
        </Card>
        <Card className={styles.statCard}>
          <Text weight="semibold">Sections</Text>
          <Title3>{proposal.sections.length}</Title3>
          <Caption1>
            {proposal.sections.filter((s) => s.approvalState === ApprovalState.APPROVED).length}{' '}
            approved
          </Caption1>
        </Card>
        <Card className={styles.statCard}>
          <Text weight="semibold">Open Questions</Text>
          <Title3>{questions.length}</Title3>
          <Caption1>High priority</Caption1>
        </Card>
        <Card className={styles.statCard}>
          <Text weight="semibold">Active Nudges</Text>
          <Title3>{nudges.length}</Title3>
          <Caption1>Need attention</Caption1>
        </Card>
      </div>

      {/* High Priority Nudges */}
      {nudges.length > 0 && (
        <div className={styles.section}>
          <Title3>High Priority Nudges</Title3>
          {nudges.map((nudge) => (
            <Card key={nudge.id} className={styles.nudgeCard} appearance="filled">
              <div className={styles.flexRow}>
                {getNudgeIcon(nudge.type)}
                <div style={{ flex: 1 }}>
                  <Text weight="semibold">{nudge.type.toUpperCase()}</Text>
                  <Body1>{nudge.message}</Body1>
                </div>
                {nudge.actionLabel && (
                  <Button appearance="primary" size="small">
                    {nudge.actionLabel}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* High Priority Questions */}
      {questions.length > 0 && (
        <div className={styles.section}>
          <Title3>High Priority Questions</Title3>
          {questions.map((question) => (
            <Card key={question.id} className={styles.questionCard}>
              <div className={styles.flexRow}>
                <Question20Regular />
                <div style={{ flex: 1 }}>
                  <Text weight="semibold">{question.question}</Text>
                  <Caption1>{question.rationale}</Caption1>
                  {question.category && (
                    <div style={{ marginTop: tokens.spacingVerticalXS }}>
                      <Tag size="small">{question.category}</Tag>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sections */}
      <div className={styles.section}>
        <Title3>Proposal Sections</Title3>
        {proposal.sections.map((section) => (
          <Card key={section.id} className={styles.sectionCard}>
            <CardHeader
              header={<Text weight="semibold">{section.title}</Text>}
              description={
                <div className={styles.flexRow}>
                  <Badge
                    appearance="filled"
                    color={getApprovalStateColor(section.approvalState)}
                    className={styles.badge}
                  >
                    {section.approvalState}
                  </Badge>
                  <Caption1>
                    {formatConfidence(section.confidence)} confidence • {section.wordCount} words •{' '}
                    {section.sources.length} sources
                  </Caption1>
                </div>
              }
            />
            <div className={styles.confidenceBar}>
              <Caption1>Confidence</Caption1>
              <ProgressBar value={section.confidence} color={section.confidence > 0.8 ? 'success' : 'warning'} />
            </div>
            {section.reviewerNotes && (
              <Caption1 style={{ marginTop: tokens.spacingVerticalS, fontStyle: 'italic' }}>
                Note: {section.reviewerNotes}
              </Caption1>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProposalExample;

