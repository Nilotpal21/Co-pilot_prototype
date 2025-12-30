/**
 * Teams Chat Surface with inline suggestions
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Button,
  Avatar,
  Text,
  Title3,
  Body1,
  Caption1,
  Input,
  Tag,
  TagGroup,
} from '@fluentui/react-components';
import {
  Send20Regular,
  Attach20Regular,
  Emoji20Regular,
  Sparkle20Filled,
  Calendar20Regular,
  Video20Regular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from '@fluentui/react-icons';
import ProposalStatusWidget from '../ProposalStatusWidget';
import { useProposalStore } from '../../state/useProposalStore';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    minHeight: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    position: 'relative',
  },
  chatList: {
    width: '280px',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    transitionProperty: 'width, border-right-color',
    transitionDuration: '180ms',
    transitionTimingFunction: 'ease',
    overflow: 'hidden',
  },
  chatListCollapsed: {
    width: '0px',
    borderRightColor: 'transparent',
  },
  chatListHeader: {
    padding: tokens.spacingVerticalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  chatListItems: {
    // Let the outer surface scroll (Word-like) instead of introducing a nested scrollbar.
  },
  chatItem: {
    padding: tokens.spacingVerticalM,
    cursor: 'pointer',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  chatItemActive: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  chatContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    padding: tokens.spacingVerticalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  collapseChatsBtn: {
    minWidth: 'auto',
    flexShrink: 0,
  },
  headerMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  participantChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
  },
  chatHeaderActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  messagesContainer: {
    // Let AppShell's `surfaceContainer` handle scrolling (Word-like).
    padding: tokens.spacingVerticalXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  message: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    maxWidth: '80%',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalXS,
  },
  messageBody: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
  },
  richMessage: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    lineHeight: '1.6',
  },
  emailHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  emailSubject: {
    color: tokens.colorNeutralForeground1,
  },
  emailMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  emailMetaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    alignItems: 'baseline',
  },
  emailMetaLabel: {
    color: tokens.colorNeutralForeground3,
    minWidth: '52px',
  },
  emailMetaValue: {
    color: tokens.colorNeutralForeground2,
  },
  richList: {
    margin: 0,
    paddingLeft: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  signature: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    paddingTop: tokens.spacingVerticalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  messageBodyOwn: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  copilotSuggestion: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
  },
  suggestionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
    color: tokens.colorBrandForeground1,
  },
  suggestionDraft: {
    padding: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  suggestionActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
  composeArea: {
    padding: tokens.spacingVerticalL,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  composeBox: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'flex-end',
  },
  composeInput: {
    flex: 1,
  },
  composeActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  contextCard: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
    borderRadius: tokens.borderRadiusMedium,
    marginTop: tokens.spacingVerticalS,
    boxShadow: tokens.shadow4,
  },
  contextHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
    color: tokens.colorBrandForeground1,
  },
  contextBody: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  contextList: {
    margin: 0,
    paddingLeft: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  reviewCard: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalS,
  },
  commentThread: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalS,
  },
  commentRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'flex-start',
  },
  commentBubble: {
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalS,
    flex: 1,
  },
  commentInputRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
  },
});

const TeamsSurface: React.FC = () => {
  const styles = useStyles();
  const [message, setMessage] = React.useState('');
  const [reviewComment, setReviewComment] = React.useState('');
  const [isChatListCollapsed, setIsChatListCollapsed] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const proposal = useProposalStore((s) => s.getActiveProposal());
  const addReviewComment = useProposalStore((s) => s.addReviewComment);

  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className={styles.container}>
      {/* Chat List Sidebar */}
      <div
        className={`${styles.chatList} ${isChatListCollapsed ? styles.chatListCollapsed : ''}`}
        aria-label="Chats sidebar"
      >
        <div className={styles.chatListHeader}>
          <Title3>Chats</Title3>
        </div>
        <div className={styles.chatListItems}>
          <div className={`${styles.chatItem} ${styles.chatItemActive}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalXS }}>
              <Avatar name="Contoso Team" size={32} />
              <div style={{ flex: 1 }}>
                <Text weight="semibold">Contoso - Proposal Team</Text>
                <Caption1>3 members</Caption1>
              </div>
            </div>
          </div>
          <div className={styles.chatItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
              <Avatar name="Sales Team" size={32} color="brand" />
              <div style={{ flex: 1 }}>
                <Text>Sales Team - Q1 Deals</Text>
                <Caption1>12 members</Caption1>
              </div>
            </div>
          </div>
          <div className={styles.chatItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
              <Avatar name="Sarah Chen" size={32} color="colorful" />
              <div style={{ flex: 1 }}>
                <Text>Sarah Chen</Text>
                <Caption1>Available</Caption1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className={styles.chatContent}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <Button
              appearance="subtle"
              className={styles.collapseChatsBtn}
              icon={isChatListCollapsed ? <ChevronRight20Regular /> : <ChevronLeft20Regular />}
              onClick={() => setIsChatListCollapsed((v) => !v)}
              aria-label={isChatListCollapsed ? 'Show chats sidebar' : 'Hide chats sidebar'}
              title={isChatListCollapsed ? 'Show chats' : 'Hide chats'}
            />
            <Avatar name="Contoso Team" size={40} />
            <div className={styles.headerMeta}>
              <Text weight="semibold">Contoso - Proposal Team</Text>
              <TagGroup aria-label="Chat participants" className={styles.participantChips}>
                <Tag size="small" appearance="outline">
                  Sarah Chen
                </Tag>
                <Tag size="small" appearance="outline">
                  Michael Rodriguez
                </Tag>
                <Tag size="small" appearance="outline">
                  You
                </Tag>
              </TagGroup>
            </div>
          </div>
          <div className={styles.chatHeaderActions}>
            <Button appearance="subtle" icon={<Video20Regular />} />
            <Button appearance="subtle" icon={<Calendar20Regular />} />
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messagesContainer}>
          <div aria-label="Active proposal">
            <ProposalStatusWidget />
          </div>

          <Card className={styles.copilotSuggestion} aria-label="Copilot Suggestion">
            <div className={styles.suggestionHeader}>
              <Sparkle20Filled style={{ color: tokens.colorBrandForeground1 }} />
              <Text weight="semibold">Copilot Suggestion</Text>
            </div>
            <Body1>
              Based on the conversation, here's a suggested response addressing their concerns:
            </Body1>
            <div className={styles.suggestionDraft}>
              <Body1>
                &quot;Thanks Sarah and Michael! I&apos;d be happy to walk through the technical details. For the VM
                sizing, we&apos;ve specified E32s v3 instances for your SAP production environment based on
                your current CPU/memory requirements from the assessment. The DR setup provides 4-hour
                RTO and 15-minute RPO with Azure Site Recovery.
                <br /><br />
                For the detailed Year 1 cost breakdown, I&apos;ll coordinate with our finance team and have
                that ready for Thursday&apos;s call. How about 2 PM PT?&quot;
              </Body1>
            </div>
            <div className={styles.suggestionActions}>
              <Button appearance="primary" size="small">
                Send This Message
              </Button>
              <Button appearance="secondary" size="small">
                Edit &amp; Send
              </Button>
            </div>
          </Card>

          {proposal?.reviewRequests && proposal.reviewRequests.length > 0 && (
            <div className={styles.reviewCard} aria-label="Review Requests">
              <div className={styles.reviewHeader}>
                <div>
                  <Text weight="semibold">Human review requested</Text>
                  <Caption1>
                    Assigned to {proposal.reviewRequests[proposal.reviewRequests.length - 1].assignee.name}
                  </Caption1>
                </div>
                <Caption1>
                  Status: {proposal.reviewRequests[proposal.reviewRequests.length - 1].status}
                </Caption1>
              </div>
              <Caption1>
                Reason: {proposal.reviewRequests[proposal.reviewRequests.length - 1].reason}
              </Caption1>

              <div className={styles.commentThread}>
                {proposal.reviewRequests[proposal.reviewRequests.length - 1].comments.map((c) => (
                  <div key={c.id} className={styles.commentRow}>
                    <Avatar name={c.author.name} size={28} />
                    <div className={styles.commentBubble}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacingHorizontalS }}>
                        <Text weight="semibold">{c.author.name}</Text>
                        <Caption1>{new Date(c.createdAt).toLocaleTimeString()}</Caption1>
                      </div>
                      <Body1>{c.message}</Body1>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.commentInputRow}>
                <Input
                  placeholder="Add a comment for the reviewer…"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
                <Button
                  appearance="primary"
                  onClick={() => {
                    const req = proposal.reviewRequests![proposal.reviewRequests!.length - 1];
                    addReviewComment(proposal.id, req.id, reviewComment);
                    setReviewComment('');
                  }}
                  disabled={reviewComment.trim().length === 0}
                >
                  Comment
                </Button>
              </div>
            </div>
          )}

          {/* Message 1 */}
          <div className={styles.message}>
            <Avatar name="Sarah Chen" color="brand" />
            <div className={styles.messageContent}>
              <div className={styles.messageHeader}>
                <Text weight="semibold">Sarah Chen</Text>
                <Caption1>10:32 AM</Caption1>
              </div>
              <div className={styles.messageBody}>
                <div className={styles.richMessage}>
                  <div className={styles.emailHeader}>
                    <Text weight="semibold" size={400} className={styles.emailSubject}>
                      Re: Cloud Migration Proposal - Questions
                    </Text>
                    <div className={styles.emailMeta}>
                      <div className={styles.emailMetaRow}>
                        <Caption1 className={styles.emailMetaLabel}>From</Caption1>
                        <Caption1 className={styles.emailMetaValue}>Sarah Chen</Caption1>
                      </div>
                      <div className={styles.emailMetaRow}>
                        <Caption1 className={styles.emailMetaLabel}>To</Caption1>
                        <Caption1 className={styles.emailMetaValue}>Jennifer</Caption1>
                      </div>
                    </div>
                  </div>

                  <Body1>Hi Jennifer,</Body1>

                  <Body1>
                    Thanks for sending over the cloud migration proposal. The team has reviewed it and
                    we&apos;re impressed with the comprehensive approach.
                  </Body1>

                  <Body1>Before we move forward, I have a few technical questions:</Body1>

                  <ul className={styles.richList}>
                    <li>
                      <Body1>
                        Can you clarify the exact VM sizing for our SAP production environment? We need
                        to ensure performance matches our current baseline.
                      </Body1>
                    </li>
                    <li>
                      <Body1>
                        What&apos;s the RTO/RPO guarantee for our disaster recovery setup? Our compliance
                        requires specific SLAs.
                      </Body1>
                    </li>
                    <li>
                      <Body1>
                        How will you handle the data migration for our 50TB database with minimal
                        downtime?
                      </Body1>
                    </li>
                  </ul>

                  <Body1>
                    Also, our CFO would like to see a more detailed cost breakdown for Year 1. Could
                    you provide that?
                  </Body1>

                  <Body1>Looking forward to your response.</Body1>

                  <div className={styles.signature}>
                    <Body1>Best regards,</Body1>
                    <Body1>Sarah Chen</Body1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message 2 */}
          <div className={styles.message}>
            <Avatar name="Michael Rodriguez" color="colorful" />
            <div className={styles.messageContent}>
              <div className={styles.messageHeader}>
                <Text weight="semibold">Michael Rodriguez</Text>
                <Caption1>10:35 AM</Caption1>
              </div>
              <div className={styles.messageBody}>
                <Body1>
                  I'm available Thursday afternoon. The cost breakdown section is what our CFO is most
                  interested in reviewing.
                </Body1>
              </div>
            </div>
          </div>

          {/* Context Card */}
          <Card className={styles.contextCard}>
            <div className={styles.contextHeader}>
              <Sparkle20Filled aria-hidden />
              <Text weight="semibold">Relevant Context</Text>
            </div>
            <div className={styles.contextBody}>
              <ul className={styles.contextList}>
                <li>
                  <Caption1>Proposal Section 3: VM sizing (E32s v3 instances)</Caption1>
                </li>
                <li>
                  <Caption1>Proposal Section 3: DR setup (4hr RTO, 15min RPO)</Caption1>
                </li>
                <li>
                  <Caption1>Open Question: Year 1 detailed cost breakdown (HIGH priority)</Caption1>
                </li>
                <li>
                  <Caption1>Your calendar: Available Thu 2–4 PM</Caption1>
                </li>
              </ul>
            </div>
          </Card>

          <div ref={messagesEndRef} />
        </div>

        {/* Compose Area */}
        <div className={styles.composeArea}>
          <div className={styles.composeBox}>
            <Input
              className={styles.composeInput}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  if (message.trim().length === 0) {
                    e.preventDefault();
                    return;
                  }
                  // Demo surface: no real send action; keep UX consistent by clearing.
                  e.preventDefault();
                  setMessage('');
                }
              }}
              contentAfter={
                <div className={styles.composeActions}>
                  <Button appearance="subtle" icon={<Emoji20Regular />} size="small" />
                  <Button appearance="subtle" icon={<Attach20Regular />} size="small" />
                  <Button appearance="subtle" icon={<Sparkle20Filled />} size="small" />
                </div>
              }
            />
            <Button
              appearance="primary"
              icon={<Send20Regular />}
              disabled={message.trim().length === 0}
              onClick={() => setMessage('')}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsSurface;

