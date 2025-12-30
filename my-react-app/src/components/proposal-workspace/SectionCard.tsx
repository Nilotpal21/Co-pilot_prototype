import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  Caption1,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Field,
  Input,
  Textarea,
  makeStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import {
  BookInformation24Regular,
  Checkmark24Regular,
  Dismiss24Regular,
  Edit24Regular,
  Save24Regular,
  Warning24Regular,
} from '@fluentui/react-icons';
import { ApprovalState, ProposalSection } from '../../types';
import { useProposalStore } from '../../state/useProposalStore';
import ConfidenceBadge from './ConfidenceBadge';
import SourcesPanel from './SourcesPanel';
import { useAppToast } from '../toast';

const useStyles = makeStyles({
  card: { ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM) },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap(tokens.spacingHorizontalS),
    marginTop: tokens.spacingVerticalXS,
  },
  actions: { display: 'flex', flexWrap: 'wrap', ...shorthands.gap(tokens.spacingHorizontalS), justifyContent: 'flex-end' },
  subtle: { color: tokens.colorNeutralForeground3 },
  editArea: { display: 'flex', flexDirection: 'column', ...shorthands.gap(tokens.spacingVerticalM) },
});

function approvalBadgeColor(state: ApprovalState): 'subtle' | 'warning' | 'success' | 'danger' | 'brand' {
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
      return 'brand';
  }
}

function estimateWordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export interface SectionCardProps {
  proposalId: string;
  section: ProposalSection;
  /** Render fewer details/actions (for approvals lists). */
  variant?: 'default' | 'compact';
}

export function SectionCard(props: SectionCardProps) {
  const styles = useStyles();
  const { proposalId, section, variant = 'default' } = props;

  const approveSection = useProposalStore((s) => s.approveSection);
  const rejectSection = useProposalStore((s) => s.rejectSection);
  const requestRevisionSection = useProposalStore((s) => s.requestRevisionSection);
  const updateSection = useProposalStore((s) => s.updateSection);
  const toast = useAppToast();

  const [isEditing, setIsEditing] = React.useState(false);
  const [draftTitle, setDraftTitle] = React.useState(section.title);
  const [draftContent, setDraftContent] = React.useState(section.content);
  const [rejectNotes, setRejectNotes] = React.useState('');
  const [isRejectOpen, setIsRejectOpen] = React.useState(false);

  React.useEffect(() => {
    // If section changes externally, reset drafts when not actively editing.
    if (!isEditing) {
      setDraftTitle(section.title);
      setDraftContent(section.content);
    }
  }, [section.title, section.content, isEditing]);

  const onApprove = React.useCallback(() => {
    approveSection(proposalId, section.id, 'Approved via Proposal Workspace.');
    toast(`Approved: ${section.title}`, 'success');
  }, [approveSection, proposalId, section.id]);

  const onNeedsRevision = React.useCallback(() => {
    requestRevisionSection(proposalId, section.id, 'Please revise for clarity and add supporting sources.');
    toast(`Requested revision: ${section.title}`, 'warning');
  }, [requestRevisionSection, proposalId, section.id]);

  const onSave = React.useCallback(() => {
    updateSection(proposalId, section.id, {
      title: draftTitle.trim() || section.title,
      content: draftContent,
      wordCount: estimateWordCount(draftContent),
      modifiedBy: 'User',
    });
    setIsEditing(false);
    toast(`Saved changes: ${draftTitle.trim() || section.title}`, 'success');
  }, [updateSection, proposalId, section.id, draftTitle, draftContent, section.title]);

  const onCancel = React.useCallback(() => {
    setDraftTitle(section.title);
    setDraftContent(section.content);
    setIsEditing(false);
  }, [section.title, section.content]);

  return (
    <Card className={styles.card} aria-label={`Section ${section.title}`}>
      <div className={styles.row}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text weight="semibold">
            {section.order}. {section.title}
          </Text>

          <div className={styles.meta}>
            <Badge appearance="tint" color={approvalBadgeColor(section.approvalState)}>
              {section.approvalState}
            </Badge>
            <ConfidenceBadge confidence={section.confidence} />
            <Badge appearance="tint" color="subtle">
              {section.wordCount} words
            </Badge>
            <Badge appearance="tint" color="informative">
              {section.sources.length} sources
            </Badge>
          </div>

          {section.reviewerNotes && (
            <div style={{ marginTop: tokens.spacingVerticalS }}>
              <Caption1 className={styles.subtle}>Reviewer feedback: {section.reviewerNotes}</Caption1>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {/* Sources */}
          <Dialog>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary" icon={<BookInformation24Regular />}>
                Sources
              </Button>
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Sources</DialogTitle>
                <DialogContent>
                  <SourcesPanel section={section} />
                </DialogContent>
              </DialogBody>
            </DialogSurface>
          </Dialog>

          {/* Edit (inline) */}
          {variant === 'default' && !isEditing && (
            <Button appearance="secondary" icon={<Edit24Regular />} onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}

          {isEditing && (
            <>
              <Button appearance="primary" icon={<Save24Regular />} onClick={onSave}>
                Save
              </Button>
              <Button appearance="subtle" icon={<Dismiss24Regular />} onClick={onCancel}>
                Cancel
              </Button>
            </>
          )}

          {/* Approval controls */}
          <Button appearance="secondary" icon={<Warning24Regular />} onClick={onNeedsRevision}>
            Needs revision
          </Button>

          <Dialog open={isRejectOpen} onOpenChange={(_, data) => setIsRejectOpen(data.open)}>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary" icon={<Dismiss24Regular />}>
                Reject
              </Button>
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Reject section</DialogTitle>
                <DialogContent>
                  <div className={styles.editArea}>
                    <Caption1 className={styles.subtle}>
                      Provide feedback so Copilot can revise this section with traceability.
                    </Caption1>
                    <Field label="Feedback (required)">
                      <Textarea
                        value={rejectNotes}
                        onChange={(e) => setRejectNotes(e.target.value)}
                        placeholder="What needs to change? Cite sources or constraints where possible…"
                        resize="vertical"
                      />
                    </Field>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    appearance="primary"
                    icon={<Dismiss24Regular />}
                    disabled={rejectNotes.trim().length === 0}
                    onClick={() => {
                      rejectSection(proposalId, section.id, rejectNotes.trim());
                      toast(`Rejected: ${section.title}`, 'error');
                      setRejectNotes('');
                      setIsRejectOpen(false);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    appearance="secondary"
                    onClick={() => {
                      setRejectNotes('');
                      setIsRejectOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>

          <Button appearance="primary" icon={<Checkmark24Regular />} onClick={onApprove}>
            Approve
          </Button>
        </div>
      </div>

      <Divider style={{ marginTop: tokens.spacingVerticalM, marginBottom: tokens.spacingVerticalM }} />

      {isEditing ? (
        <div className={styles.editArea}>
          <Field label="Title">
            <Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
          </Field>
          <Field label="Content">
            <Textarea value={draftContent} onChange={(e) => setDraftContent(e.target.value)} resize="vertical" />
          </Field>
        </div>
      ) : (
        <Text className={styles.subtle}>
          {section.content.length > 220 ? `${section.content.slice(0, 220)}…` : section.content || 'No content yet.'}
        </Text>
      )}
    </Card>
  );
}

export default SectionCard;


