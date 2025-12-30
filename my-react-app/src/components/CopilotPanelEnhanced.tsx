/**
 * Enhanced Copilot Panel with Close Button and Chat
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  Button,
  TabList,
  Tab,
  Text,
  Card,
  Caption1,
  Divider,
} from '@fluentui/react-components';
import {
  ChatSparkle24Regular,
  Dismiss24Regular,
  Alert24Regular,
  Lightbulb24Regular,
} from '@fluentui/react-icons';
import CopilotChatPanel from './CopilotChatPanel';
import NudgeCenter from './NudgeCenter';
import { useProposalStore } from '../state/useProposalStore';
import { useAppStore } from '../state/useAppStore';
import { CopilotPanelNavigation } from '../state/copilotPanelNav';

interface CopilotPanelEnhancedProps {
  onClose?: () => void;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacingVerticalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  card: {
    padding: tokens.spacingVerticalM,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
  },
  inputArea: {
    padding: tokens.spacingVerticalL,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  inputBox: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'flex-end',
  },
});

const CopilotPanelEnhanced: React.FC<CopilotPanelEnhancedProps> = ({ onClose }) => {
  const styles = useStyles();
  const activeTab = useAppStore((s) => s.copilotPanelTab);
  const setActiveTab = useAppStore((s) => s.setCopilotPanelTab);
  const nav = useAppStore((s) => s.copilotNav);
  const navigateCopilot = useAppStore((s) => s.navigateCopilot);
  const clearCopilotNav = useAppStore((s) => s.clearCopilotNav);

  const activeProposal = useProposalStore((s) => s.getActiveProposal());
  const getProposal = useProposalStore((s) => s.getProposal);

  const handleTabSelect = React.useCallback((_: unknown, data: { value: unknown }) => {
    setActiveTab(data.value as any);
  }, [setActiveTab]);

  const handleNavigate = React.useCallback((next: CopilotPanelNavigation) => {
    navigateCopilot(next);
  }, [navigateCopilot]);

  const selectedNudge = React.useMemo(() => {
    if (nav.kind !== 'nudge') return undefined;
    const proposal = getProposal(nav.proposalId);
    return proposal?.nudges.find((n) => n.id === nav.nudgeId);
  }, [nav, getProposal]);

  const selectedSectionTitle = React.useMemo(() => {
    if (!activeProposal) return undefined;
    if (nav.kind === 'nudge' && nav.relatedSectionId) {
      return activeProposal.sections.find((s) => s.id === nav.relatedSectionId)?.title;
    }
    if (nav.kind === 'section') {
      return activeProposal.sections.find((s) => s.id === nav.sectionId)?.title;
    }
    return undefined;
  }, [nav, activeProposal]);

  const selectedQuestionText = React.useMemo(() => {
    if (!activeProposal) return undefined;
    if (nav.kind === 'question') {
      return activeProposal.openQuestions.find((q) => q.id === nav.questionId)?.question;
    }
    return undefined;
  }, [nav, activeProposal]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <ChatSparkle24Regular />
          <Text weight="semibold">Copilot</Text>
        </div>
        {onClose && (
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={onClose}
            title="Close panel"
          />
        )}
      </div>

      {/* Tab Switcher */}
      <div style={{ padding: `0 ${tokens.spacingHorizontalM}`, borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}>
        <TabList selectedValue={activeTab} onTabSelect={handleTabSelect}>
          <Tab value="chat" icon={<ChatSparkle24Regular />}>
            Chat
          </Tab>
          <Tab value="nudges" icon={<Alert24Regular />}>
            Nudges
          </Tab>
          <Tab value="actions" icon={<Lightbulb24Regular />}>
            Actions
          </Tab>
        </TabList>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'chat' ? (
        <CopilotChatPanel />
      ) : activeTab === 'nudges' ? (
        <NudgeCenter onNavigate={handleNavigate} />
      ) : (
        <div className={styles.content}>
          <Text weight="semibold">Quick Actions</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS, marginTop: tokens.spacingVerticalM }}>
            <Button appearance="secondary" size="small" onClick={() => setActiveTab('nudges')}>
              View nudges
            </Button>
            <Button appearance="secondary" size="small">
              Summarize proposal status
            </Button>
            <Button appearance="secondary" size="small">
              Review open questions
            </Button>
            <Button appearance="secondary" size="small">
              Check approval progress
            </Button>
          </div>

          {(nav.kind === 'nudge' || nav.kind === 'section' || nav.kind === 'question') && (
            <Card className={styles.card} style={{ marginTop: tokens.spacingVerticalL }}>
              <Text weight="semibold">Selection</Text>
              <Divider style={{ marginTop: tokens.spacingVerticalS, marginBottom: tokens.spacingVerticalS }} />
              {nav.kind === 'nudge' && selectedNudge && (
                <>
                  <Text weight="semibold" size={300}>
                    Selected nudge
                  </Text>
                  <Text style={{ display: 'block', marginTop: tokens.spacingVerticalXS }}>
                    {selectedNudge.message}
                  </Text>
                </>
              )}

              {nav.kind === 'section' && selectedSectionTitle && (
                <>
                  <Text weight="semibold" size={300}>
                    Selected section
                  </Text>
                  <Text style={{ display: 'block', marginTop: tokens.spacingVerticalXS }}>
                    {selectedSectionTitle}
                  </Text>
                </>
              )}

              {nav.kind === 'question' && selectedQuestionText && (
                <>
                  <Text weight="semibold" size={300}>
                    Selected question
                  </Text>
                  <Text style={{ display: 'block', marginTop: tokens.spacingVerticalXS }}>
                    {selectedQuestionText}
                  </Text>
                </>
              )}

              {selectedSectionTitle && nav.kind !== 'section' && (
                <div style={{ marginTop: tokens.spacingVerticalS }}>
                  <Caption1>Related section: {selectedSectionTitle}</Caption1>
                </div>
              )}
              <div style={{ marginTop: tokens.spacingVerticalM }}>
                <Button appearance="subtle" onClick={clearCopilotNav}>
                  Clear selection
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CopilotPanelEnhanced;

