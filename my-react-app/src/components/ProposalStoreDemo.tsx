/**
 * Demo component showing how to use the Zustand proposal store
 */

import * as React from 'react';
import {
  Button,
  Card,
  Input,
  Textarea,
  Badge,
  makeStyles,
  tokens,
  Title2,
  Body1,
  Caption1,
  Text,
} from '@fluentui/react-components';
import { Add20Regular, Delete20Regular, Checkmark20Regular } from '@fluentui/react-icons';
import { useProposalStore, proposalSelectors } from '../state/useProposalStore';
import { mockProposal } from '../data/mockData';
import { ApprovalState, Priority, NudgeType } from '../types';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalXXL,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    marginBottom: tokens.spacingVerticalXL,
  },
  card: {
    marginBottom: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalS,
  },
  buttonGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
  formGroup: {
    marginBottom: tokens.spacingVerticalM,
  },
});

const ProposalStoreDemo: React.FC = () => {
  const styles = useStyles();

  // Get store actions and state
  const {
    createProposal,
    importProposal,
    getActiveProposal,
    approveSection,
    rejectSection,
    addQuestion,
    dismissQuestion,
    addNudge,
    dismissNudge,
    clearAllData,
  } = useProposalStore();

  const activeProposal = getActiveProposal();
  const [newQuestionText, setNewQuestionText] = React.useState('');
  const [newNudgeText, setNewNudgeText] = React.useState('');

  // Load mock proposal on mount if no active proposal
  React.useEffect(() => {
    if (!activeProposal) {
      importProposal(mockProposal);
    }
  }, [activeProposal, importProposal]);

  const handleApproveSection = (sectionId: string) => {
    if (!activeProposal) return;
    approveSection(activeProposal.id, sectionId, 'Approved via demo');
  };

  const handleRejectSection = (sectionId: string) => {
    if (!activeProposal) return;
    rejectSection(activeProposal.id, sectionId, 'Needs improvement');
  };

  const handleAddQuestion = () => {
    if (!activeProposal || !newQuestionText.trim()) return;
    addQuestion(activeProposal.id, {
      question: newQuestionText,
      rationale: 'Added via demo component',
      priority: Priority.MEDIUM,
      relatedSectionIds: [],
    });
    setNewQuestionText('');
  };

  const handleAddNudge = () => {
    if (!activeProposal || !newNudgeText.trim()) return;
    addNudge(activeProposal.id, {
      type: NudgeType.SUGGESTION,
      message: newNudgeText,
      priority: Priority.MEDIUM,
    });
    setNewNudgeText('');
  };

  const handleCreateNewProposal = () => {
    const now = new Date();
    createProposal({
      title: 'New Proposal',
      clientName: 'New Client',
      clientId: 'new-client-1',
      opportunityValue: 500000,
      status: mockProposal.status,
      sections: [],
      openQuestions: [],
      nudges: [],
      createdAt: now,
      lastModified: now,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      owner: mockProposal.owner,
      overallConfidence: 0,
      totalWordCount: 0,
    });
  };

  if (!activeProposal) {
    return (
      <div className={styles.container}>
        <Body1>Loading proposal...</Body1>
      </div>
    );
  }

  const { questions, nudges } = proposalSelectors.getHighPriorityItems(activeProposal.id);
  const completion = proposalSelectors.getCompletionPercentage(activeProposal.id);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <Title2>{activeProposal.title}</Title2>
        <Body1>
          {activeProposal.clientName} • ${activeProposal.opportunityValue.toLocaleString()}
        </Body1>
        <Caption1>Completion: {completion}%</Caption1>

        <div className={styles.buttonGroup}>
          <Button appearance="primary" onClick={handleCreateNewProposal} icon={<Add20Regular />}>
            Create New Proposal
          </Button>
          <Button appearance="secondary" onClick={clearAllData} icon={<Delete20Regular />}>
            Clear All Data
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className={styles.section}>
        <Title2>Sections ({activeProposal.sections.length})</Title2>
        {activeProposal.sections.slice(0, 3).map((section) => (
          <Card key={section.id} className={styles.card}>
            <div className={styles.flexRow}>
              <div style={{ flex: 1 }}>
                <Text weight="semibold">{section.title}</Text>
                <Caption1>
                  Confidence: {Math.round(section.confidence * 100)}% •{' '}
                  <Badge
                    appearance="filled"
                    color={
                      section.approvalState === ApprovalState.APPROVED
                        ? 'success'
                        : section.approvalState === ApprovalState.REJECTED
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {section.approvalState}
                  </Badge>
                </Caption1>
              </div>
              <div className={styles.buttonGroup}>
                <Button
                  size="small"
                  appearance="primary"
                  onClick={() => handleApproveSection(section.id)}
                  disabled={section.approvalState === ApprovalState.APPROVED}
                  icon={<Checkmark20Regular />}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  appearance="secondary"
                  onClick={() => handleRejectSection(section.id)}
                  disabled={section.approvalState === ApprovalState.REJECTED}
                >
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* High Priority Questions */}
      <div className={styles.section}>
        <Title2>High Priority Questions ({questions.length})</Title2>
        {questions.map((question) => (
          <Card key={question.id} className={styles.card}>
            <Body1>{question.question}</Body1>
            <Caption1>{question.rationale}</Caption1>
            <div className={styles.buttonGroup}>
              <Button
                size="small"
                appearance="secondary"
                onClick={() => dismissQuestion(activeProposal.id, question.id)}
              >
                Dismiss
              </Button>
            </div>
          </Card>
        ))}

        <div className={styles.formGroup}>
          <Textarea
            placeholder="Add a new question..."
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            resize="vertical"
          />
          <div className={styles.buttonGroup}>
            <Button
              appearance="primary"
              onClick={handleAddQuestion}
              disabled={!newQuestionText.trim()}
              icon={<Add20Regular />}
            >
              Add Question
            </Button>
          </div>
        </div>
      </div>

      {/* High Priority Nudges */}
      <div className={styles.section}>
        <Title2>High Priority Nudges ({nudges.length})</Title2>
        {nudges.map((nudge) => (
          <Card key={nudge.id} className={styles.card}>
            <Body1>{nudge.message}</Body1>
            <Caption1>Type: {nudge.type}</Caption1>
            <div className={styles.buttonGroup}>
              <Button
                size="small"
                appearance="secondary"
                onClick={() => dismissNudge(activeProposal.id, nudge.id)}
              >
                Dismiss
              </Button>
            </div>
          </Card>
        ))}

        <div className={styles.formGroup}>
          <Textarea
            placeholder="Add a new nudge..."
            value={newNudgeText}
            onChange={(e) => setNewNudgeText(e.target.value)}
            resize="vertical"
          />
          <div className={styles.buttonGroup}>
            <Button
              appearance="primary"
              onClick={handleAddNudge}
              disabled={!newNudgeText.trim()}
              icon={<Add20Regular />}
            >
              Add Nudge
            </Button>
          </div>
        </div>
      </div>

      {/* Store State Info */}
      <div className={styles.section}>
        <Card className={styles.card}>
          <Text weight="semibold">Store State (persisted to localStorage)</Text>
          <Caption1>
            Active Proposal: {activeProposal.id}
            <br />
            Total Sections: {activeProposal.sections.length}
            <br />
            Open Questions: {activeProposal.openQuestions.filter((q) => !q.dismissed).length}
            <br />
            Active Nudges: {activeProposal.nudges.filter((n) => !n.dismissed).length}
            <br />
            Overall Confidence: {Math.round(activeProposal.overallConfidence * 100)}%
          </Caption1>
        </Card>
      </div>
    </div>
  );
};

export default ProposalStoreDemo;

