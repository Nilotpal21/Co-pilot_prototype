/**
 * Outlook Email Surface with inline suggestions
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Button,
  Avatar,
  Badge,
  Text,
  Title3,
  Body1,
  Caption1,
  Textarea,
  Divider,
} from '@fluentui/react-components';
import {
  Send20Regular,
  Attach20Regular,
  MoreHorizontal20Regular,
  Lightbulb20Regular,
  Sparkle20Filled,
  ChevronDown20Regular,
} from '@fluentui/react-icons';
import InlineSuggestionCard from '../InlineSuggestionCard';
import ProposalStatusWidget from '../ProposalStatusWidget';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalXXL,
    maxWidth: '1000px',
    margin: '0 auto',
  },
  headerCard: {
    marginTop: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalL,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  emailCard: {
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalXL,
  },
  emailHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
  emailHeaderLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
    minWidth: 0,
    flex: 1,
  },
  emailMeta: {
    minWidth: 0,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  senderLine: {
    display: 'flex',
    alignItems: 'baseline',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  senderEmail: {
    color: tokens.colorNeutralForeground3,
  },
  toLine: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    color: tokens.colorNeutralForeground2,
  },
  emailHeaderRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: tokens.spacingVerticalXS,
    flexShrink: 0,
  },
  emailActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  emailDate: {
    color: tokens.colorNeutralForeground3,
  },
  emailBody: {
    marginTop: tokens.spacingVerticalL,
    lineHeight: '1.6',
  },
  emailSubject: {
    marginBottom: tokens.spacingVerticalM,
  },
  emailBodyStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  emailList: {
    margin: 0,
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  emailSignature: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    paddingTop: tokens.spacingVerticalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  composeCard: {
    padding: tokens.spacingVerticalXL,
  },
  composeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalL,
  },
  composeActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
  suggestionCard: {
    padding: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalM,
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
  },
  suggestionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
    color: tokens.colorBrandForeground1,
  },
  contextCard: {
    padding: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  contextList: {
    marginTop: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalL,
  },
  contextItem: {
    marginBottom: tokens.spacingVerticalXS,
  },
});

const OutlookSurface: React.FC = () => {
  const styles = useStyles();
  const [emailDraft, setEmailDraft] = React.useState('');

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: tokens.spacingVerticalL }}>
        <ProposalStatusWidget />
      </div>

      <div className={styles.headerCard}>
        <Title3>Email: Proposal Follow-up</Title3>
      </div>

      {/* Incoming Email */}
      <Card className={styles.emailCard}>
        <div className={styles.emailHeader}>
          <div className={styles.emailHeaderLeft}>
            <Avatar name="Sarah Chen" color="brand" badge={{ status: 'available' }} />
            <div className={styles.emailMeta}>
              <div className={styles.senderLine}>
                <Text weight="semibold">Sarah Chen</Text>
                <Caption1 className={styles.senderEmail}>&lt;sarah.chen@contoso.com&gt;</Caption1>
                <Badge appearance="tint" color="important">
                  CTO
                </Badge>
              </div>
              <div className={styles.toLine}>
                <Caption1>to Jennifer</Caption1>
                <ChevronDown20Regular aria-hidden />
              </div>
            </div>
          </div>

          <div className={styles.emailHeaderRight}>
            <Caption1 className={styles.emailDate}>Dec 20, 2024, 2:45 PM</Caption1>
          </div>
        </div>

        <div className={styles.emailSubject}>
          <Text weight="semibold" size={500}>
            Re: Cloud Migration Proposal - Questions
          </Text>
        </div>

        <div className={styles.emailBody}>
          <div className={styles.emailBodyStack}>
            <Body1>Hi Jennifer,</Body1>

            <Body1>
              Thanks for sending over the cloud migration proposal. The team has reviewed it and
              we&apos;re impressed with the comprehensive approach.
            </Body1>

            <Body1>Before we move forward, I have a few technical questions:</Body1>

            <ol className={styles.emailList}>
              <li>
                <Body1>
                  Can you clarify the exact VM sizing for our SAP production environment? We need to
                  ensure performance matches our current baseline.
                </Body1>
              </li>
              <li>
                <Body1>
                  What&apos;s the RTO/RPO guarantee for our disaster recovery setup? Our compliance requires
                  specific SLAs.
                </Body1>
              </li>
              <li>
                <Body1>
                  How will you handle the data migration for our 50TB database with minimal downtime?
                </Body1>
              </li>
            </ol>

            <Body1>
              Also, our CFO would like to see a more detailed cost breakdown for Year 1. Could you
              provide that?
            </Body1>

            <Body1>Looking forward to your response.</Body1>

            <div className={styles.emailSignature}>
              <Body1>
                <strong>Best regards,</strong>
              </Body1>
              <Body1>Sarah Chen</Body1>
            </div>
          </div>
        </div>
      </Card>

      <Divider />

      {/* Copilot Context Card */}
      <Card className={styles.contextCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
          <Sparkle20Filled style={{ color: tokens.colorBrandForeground1 }} />
          <Text weight="semibold">Copilot Context</Text>
        </div>
        <ul className={styles.contextList}>
          <li className={styles.contextItem}>
            <Caption1>
              📄 Found VM sizing details in Section 3 (Solution Architecture)
            </Caption1>
          </li>
          <li className={styles.contextItem}>
            <Caption1>
              ⏱️ RTO/RPO mentioned: 4-hour RTO, 15-minute RPO
            </Caption1>
          </li>
          <li className={styles.contextItem}>
            <Caption1>
              💾 Database migration strategy covered in Section 4 (Migration Approach)
            </Caption1>
          </li>
          <li className={styles.contextItem}>
            <Caption1>
              ⚠️ Year 1 cost breakdown needs more detail (flagged as open question)
            </Caption1>
          </li>
        </ul>
      </Card>

      {/* Copilot Suggestion */}
      <Card className={styles.suggestionCard}>
        <div className={styles.suggestionHeader}>
          <Lightbulb20Regular />
          <Text weight="semibold">Copilot Suggestion</Text>
        </div>
        <Body1>
          I've drafted a response addressing Sarah's technical questions using information from your
          proposal. The VM sizing is covered in Section 3, RTO/RPO in Section 3, and migration
          approach in Section 4. I've also noted that you'll need to request a detailed Year 1 cost
          breakdown from your finance team.
        </Body1>
        <Button
          appearance="primary"
          style={{ marginTop: tokens.spacingVerticalM }}
          icon={<Sparkle20Filled />}
        >
          Use Draft Response
        </Button>
      </Card>

      {/* Inline Suggestion: Create Follow-up Proposal */}
      <InlineSuggestionCard
        context="email"
        title="Create Follow-up Proposal for Phase 2?"
        description="Based on this conversation, Sarah's team may need a separate proposal for the Phase 2 IoT and Analytics expansion mentioned in your original proposal. Create a quick draft to get ahead."
        proposalData={{
          title: 'Contoso Manufacturing - Phase 2: IoT & Analytics Expansion',
          clientName: 'Contoso Manufacturing',
          clientId: 'CRM-ACCT-8847',
          opportunityValue: 850000,
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        }}
        onProposalCreated={(id) => {
          console.log('✅ Follow-up proposal created:', id);
        }}
      />

      {/* Reply Composer */}
      <Card className={styles.composeCard}>
        <div className={styles.composeHeader}>
          <Text weight="semibold">Reply to Sarah Chen</Text>
          <Button appearance="subtle" icon={<MoreHorizontal20Regular />} />
        </div>

        <Textarea
          placeholder="Compose your reply..."
          value={emailDraft}
          onChange={(e) => setEmailDraft(e.target.value)}
          rows={12}
          resize="vertical"
          style={{ width: '100%' }}
        />

        <div className={styles.composeActions}>
          <Button
            appearance="primary"
            icon={<Send20Regular />}
            disabled={emailDraft.trim().length === 0}
          >
            Send
          </Button>
          <Button appearance="secondary" icon={<Attach20Regular />}>
            Attach Proposal
          </Button>
          <Button appearance="subtle" icon={<Sparkle20Filled />}>
            Get AI Help
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OutlookSurface;

