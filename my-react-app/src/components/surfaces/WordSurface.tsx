/**
 * Word Document Surface with inline suggestions
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Button,
  Text,
  Title1,
  Title3,
  Body1,
  Caption1,
  Divider,
  Skeleton,
  SkeletonItem,
} from '@fluentui/react-components';
import {
  Edit20Regular,
  Comment20Regular,
  Sparkle20Filled,
  Add20Regular,
} from '@fluentui/react-icons';
import InlineSuggestionCard from '../InlineSuggestionCard';
import ProposalWorkspace from '../ProposalWorkspace';
import ProposalStatusWidget from '../ProposalStatusWidget';
import { useAppStore } from '../../state/useAppStore';
import { useProposalStore } from '../../state/useProposalStore';
import ProposalDocumentPreview from '../proposal-workspace/ProposalDocumentPreview';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalXXL,
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  documentHeader: {
    marginBottom: tokens.spacingVerticalXL,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  documentTitle: {
    marginBottom: tokens.spacingVerticalS,
  },
  documentMeta: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    marginTop: tokens.spacingVerticalM,
  },
  documentContent: {
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXXL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: '800px',
  },
  section: {
    marginBottom: tokens.spacingVerticalXXL,
  },
  paragraph: {
    marginBottom: tokens.spacingVerticalL,
    lineHeight: '1.8',
  },
  inlineSuggestion: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    padding: `2px ${tokens.spacingHorizontalXS}`,
    borderRadius: tokens.borderRadiusSmall,
    position: 'relative',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorPaletteYellowBackground3,
    },
  },
  suggestionPopup: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 1000,
    marginTop: tokens.spacingVerticalS,
    width: '350px',
  },
  suggestionCard: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
  },
  suggestionActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
  contextHighlight: {
    backgroundColor: tokens.colorBrandBackground2,
    padding: `2px ${tokens.spacingHorizontalXS}`,
    borderRadius: tokens.borderRadiusSmall,
    borderBottom: `2px solid ${tokens.colorBrandForeground1}`,
  },
  aiInsight: {
    padding: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalL,
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `4px solid ${tokens.colorBrandForeground1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
    color: tokens.colorBrandForeground1,
  },
  insightActions: {
    marginTop: tokens.spacingVerticalM,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
});

const WordSurface: React.FC = () => {
  const styles = useStyles();
  const [showSuggestion, setShowSuggestion] = React.useState(false);
  const wordExport = useAppStore((s) => s.wordExport);
  const clearWordExport = useAppStore((s) => s.clearWordExport);
  const proposal = useProposalStore((s) =>
    wordExport ? s.getProposal(wordExport.proposalId) : s.getActiveProposal()
  );
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);

  const worthLabel = React.useMemo(() => {
    const value = proposal?.opportunityValue;
    if (typeof value !== 'number') return undefined;
    if (value >= 1_000_000) return `Worth $${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `Worth $${(value / 1_000).toFixed(0)}K`;
    return `Worth $${value.toFixed(0)}`;
  }, [proposal?.opportunityValue]);

  React.useEffect(() => {
    if (!wordExport) return;
    setIsPreviewLoading(true);
    const t = window.setTimeout(() => setIsPreviewLoading(false), 450);
    return () => window.clearTimeout(t);
  }, [wordExport?.exportedAt]);

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: tokens.spacingVerticalL }}>
        <ProposalStatusWidget />
      </div>

      {/* Document Header */}
      <div className={styles.documentHeader}>
        <Title1 className={styles.documentTitle}>
          {wordExport && proposal ? 'Word Export Preview' : 'Cloud Migration & Modernization Proposal'}
        </Title1>
        <div>
          <Caption1>{proposal?.clientName || 'Contoso Manufacturing'}</Caption1>
          <Caption1>{worthLabel || 'Worth $1.2M'}</Caption1>
        </div>
        <div className={styles.documentMeta}>
          <Caption1>
            {proposal ? `Status: ${proposal.status}` : 'Last modified: Dec 20, 2024'}
          </Caption1>
          <Caption1>
            {wordExport?.exportedAt ? `Exported: ${new Date(wordExport.exportedAt).toLocaleString()}` : 'Version 3.2'}
          </Caption1>
          <Caption1>{proposal ? `Owner: ${proposal.owner.name}` : 'Owner: Jennifer Park'}</Caption1>
        </div>
        {wordExport && (
          <div style={{ marginTop: tokens.spacingVerticalM }}>
            <Button appearance="secondary" size="small" onClick={clearWordExport}>
              Exit preview
            </Button>
          </div>
        )}
      </div>

      {/* Document Content */}
      <div className={styles.documentContent}>
        {wordExport && proposal ? (
          isPreviewLoading ? (
            <div aria-label="Word Export Skeleton">
              <Skeleton>
                <SkeletonItem style={{ width: '60%', height: 28 }} />
                <SkeletonItem style={{ width: '40%', height: 16, marginTop: tokens.spacingVerticalS }} />
                <SkeletonItem style={{ width: '100%', height: 120, marginTop: tokens.spacingVerticalM }} />
                <SkeletonItem style={{ width: '100%', height: 120, marginTop: tokens.spacingVerticalM }} />
              </Skeleton>
            </div>
          ) : (
            <ProposalDocumentPreview proposal={proposal} exportedAtIso={wordExport.exportedAt} />
          )
        ) : (
          <>
        {/* Executive Summary Section */}
        <div className={styles.section}>
          <Title3 style={{ marginBottom: tokens.spacingVerticalL }}>Executive Summary</Title3>

          <div className={styles.paragraph}>
            <Body1>
              Contoso Manufacturing is at a pivotal moment in its digital transformation journey. This
              proposal outlines a comprehensive cloud migration strategy designed to modernize your IT
              infrastructure, enhance operational efficiency, and position your organization for
              sustainable growth.
            </Body1>
          </div>

          <div className={styles.paragraph}>
            <Body1>
              <strong>The Challenge:</strong> Your current on-premises infrastructure is constraining
              innovation, with{' '}
              <span className={styles.contextHighlight}>
                aging hardware (7+ years old)
              </span>
              , rising maintenance costs{' '}
              <span className={styles.contextHighlight}>
                ($450K annually)
              </span>
              , and limited scalability to support new IoT and analytics initiatives.
            </Body1>
          </div>

          <div className={styles.paragraph}>
            <Body1>
              <strong>Our Solution:</strong> A phased, risk-mitigated migration to Azure cloud that
              delivers:
            </Body1>
            <ul style={{ marginTop: tokens.spacingVerticalM, paddingLeft: tokens.spacingHorizontalXL }}>
              <li>
                <Body1>
                  <span
                    className={styles.inlineSuggestion}
                    onClick={() => setShowSuggestion(!showSuggestion)}
                  >
                    40% reduction in infrastructure costs
                  </span>
                  {showSuggestion && (
                    <div className={styles.suggestionPopup}>
                      <Card className={styles.suggestionCard}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
                          <Sparkle20Filled style={{ color: tokens.colorBrandForeground1 }} />
                          <Text weight="semibold">Copilot Suggestion</Text>
                        </div>
                        <Caption1 style={{ marginTop: tokens.spacingVerticalS }}>
                          Consider adding "over 3 years" to provide clear timeframe context and
                          strengthen the business case.
                        </Caption1>
                        <div className={styles.suggestionActions}>
                          <Button appearance="primary" size="small">
                            Accept
                          </Button>
                          <Button appearance="secondary" size="small" onClick={() => setShowSuggestion(false)}>
                            Dismiss
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                  {' '}over 3 years
                </Body1>
              </li>
              <li>
                <Body1>
                  <span className={styles.contextHighlight}>
                    99.95% uptime SLA
                  </span>
                  {' '}with multi-region redundancy
                </Body1>
              </li>
              <li>
                <Body1>
                  Full HIPAA, SOC 2 Type II, and GDPR compliance
                </Body1>
              </li>
              <li>
                <Body1>
                  Seamless integration with existing SAP ERP system
                </Body1>
              </li>
            </ul>
          </div>

          {/* AI Insight */}
          <div className={styles.aiInsight}>
            <div className={styles.insightHeader}>
              <Sparkle20Filled />
              <Text weight="semibold">Copilot Insight</Text>
            </div>
            <Caption1>
              Based on similar manufacturing proposals, consider adding a specific ROI timeline
              (e.g., "projected 3-year ROI of 285%") to this section. This strengthens the executive
              summary and aligns with CFO expectations from recent customer feedback.
            </Caption1>
            <div className={styles.insightActions}>
              <Button appearance="primary" icon={<Add20Regular />}>
                Add ROI Metric
              </Button>
            </div>
          </div>
        </div>

        <Divider />

        {/* Inline Suggestion: Create Compliance Addendum */}
        <InlineSuggestionCard
          context="document"
          title="Create Compliance & Security Addendum?"
          description="This proposal has extensive HIPAA, SOC 2, and GDPR requirements. Create a dedicated compliance addendum document to provide detailed security framework, audit reports, and certification details."
          proposalData={{
            title: 'Contoso Manufacturing - Compliance & Security Addendum',
            clientName: 'Contoso Manufacturing',
            clientId: 'CRM-ACCT-8847',
            opportunityValue: 0, // Addendum, not separate deal
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          }}
          onProposalCreated={(id) => {
            console.log('✅ Compliance addendum created:', id);
          }}
        />

        {/* Solution Architecture Section (Preview) */}
        <div className={styles.section}>
          <Title3 style={{ marginBottom: tokens.spacingVerticalL }}>
            Proposed Solution Architecture
          </Title3>

          <div className={styles.paragraph}>
            <Body1>
              Our Azure cloud solution is architected specifically for medical device manufacturers
              requiring enterprise-grade security, compliance, and performance.
            </Body1>
          </div>

          <div className={styles.paragraph}>
            <Body1>
              <strong>Core Infrastructure:</strong>
            </Body1>
            <ul style={{ marginTop: tokens.spacingVerticalM, paddingLeft: tokens.spacingHorizontalXL }}>
              <li>
                <Body1>
                  Multi-region deployment (US East 2, West Europe) ensuring &lt;50ms latency for global
                  operations
                </Body1>
              </li>
              <li>
                <Body1>
                  Azure Virtual Machines optimized for your{' '}
                  <span className={styles.contextHighlight}>
                    SAP ERP workload (E-series compute)
                  </span>
                </Body1>
              </li>
              <li>
                <Body1>
                  Premium SSD storage with automatic geo-replication for{' '}
                  <span className={styles.contextHighlight}>
                    50TB+ data
                  </span>
                </Body1>
              </li>
            </ul>
          </div>

          {/* Context Card */}
          <Card style={{
            marginTop: tokens.spacingVerticalL,
            padding: tokens.spacingVerticalM,
            backgroundColor: tokens.colorNeutralBackground3,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalS }}>
              <Comment20Regular />
              <Text weight="semibold">Referenced Context</Text>
            </div>
            <Caption1>
              • IT Infrastructure Assessment (Dec 8): Current environment details
            </Caption1>
            <Caption1>
              • Discovery Call Notes (Dec 12): Technical requirements from CTO
            </Caption1>
            <Caption1>
              • Sales Playbook: Enterprise manufacturing best practices
            </Caption1>
          </Card>
        </div>
          </>
        )}
      </div>

      <Divider style={{ marginTop: tokens.spacingVerticalXXL, marginBottom: tokens.spacingVerticalXL }} />

      {/* Proposal Workspace (Copilot-native management surface) */}
      <ProposalWorkspace />
    </div>
  );
};

export default WordSurface;

