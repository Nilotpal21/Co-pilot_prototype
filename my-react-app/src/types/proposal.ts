/**
 * Domain types for Copilot-native Sales Proposal Agent UI
 */

/**
 * Status of a proposal in the workflow
 */
export enum ProposalStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

/**
 * Approval state for individual proposal sections
 */
export enum ApprovalState {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision',
}

/**
 * Types of sources that can inform proposal content
 */
export enum SourceType {
  CRM = 'crm',
  DOCUMENT = 'document',
  EMAIL = 'email',
  MEETING_NOTES = 'meeting_notes',
  PREVIOUS_PROPOSAL = 'previous_proposal',
  CUSTOMER_WEBSITE = 'customer_website',
  INTERNAL_WIKI = 'internal_wiki',
  SALES_PLAYBOOK = 'sales_playbook',
}

/**
 * Priority levels for questions and nudges
 */
export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Types of nudges the Copilot can provide
 */
export enum NudgeType {
  SUGGESTION = 'suggestion',
  REMINDER = 'reminder',
  WARNING = 'warning',
  INFO = 'info',
  BEST_PRACTICE = 'best_practice',
  COMPLIANCE = 'compliance',
}

/**
 * Source reference with metadata
 */
export interface Source {
  id: string;
  type: SourceType;
  title: string;
  /** URL, file path, or CRM record ID */
  reference: string;
  /** Short excerpt or summary of relevant content */
  excerpt?: string;
  lastUpdated: Date;
  /** Relevance score 0-1 */
  relevanceScore: number;
  /** Author or owner of the source */
  author?: string;
}

/**
 * A section of the proposal with AI-generated content
 */
export interface ProposalSection {
  id: string;
  /** Section title (e.g., "Executive Summary", "Solution Overview") */
  title: string;
  /** Rich text content of the section */
  content: string;
  /** AI confidence in the generated content (0-1) */
  confidence: number;
  /** Sources used to generate this section */
  sources: Source[];
  /** Current approval state */
  approvalState: ApprovalState;
  /** Order/position in the proposal */
  order: number;
  lastModified: Date;
  modifiedBy: string;
  /** Optional feedback from reviewer */
  reviewerNotes?: string;
  /** Word count for the section */
  wordCount: number;
}

/**
 * Open questions that need answers to improve the proposal
 */
export interface OpenQuestion {
  id: string;
  question: string;
  /** Why this question matters */
  rationale: string;
  priority: Priority;
  /** Which section(s) this relates to */
  relatedSectionIds: string[];
  /** Suggested sources to consult */
  suggestedSources?: Source[];
  createdAt: Date;
  /** Whether user has dismissed this question */
  dismissed: boolean;
  /** Optional category (e.g., "Pricing", "Technical", "Timeline") */
  category?: string;
}

/**
 * Proactive nudges from the Copilot
 */
export interface Nudge {
  id: string;
  type: NudgeType;
  message: string;
  /** Label for the action button (e.g., "Review Section", "Add Details") */
  actionLabel?: string;
  /** What happens when user acts on the nudge */
  actionType?: 'navigate' | 'edit' | 'review' | 'dismiss';
  /** Where to navigate if action is 'navigate' */
  actionTarget?: string;
  priority: Priority;
  /** Optional section this nudge relates to */
  relatedSectionId?: string;
  createdAt: Date;
  dismissed: boolean;
  /** Optional expiry for time-sensitive nudges */
  expiresAt?: Date;
}

/**
 * A review request created when Copilot is uncertain / blocked and needs human input.
 */
export interface ReviewComment {
  id: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  message: string;
  createdAt: Date;
}

export interface ReviewRequest {
  id: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  assignee: {
    id: string;
    name: string;
    email: string;
  };
  /** Why escalation happened */
  reason: string;
  /** Optional context pointers */
  relatedSectionIds?: string[];
  relatedQuestionIds?: string[];
  status: 'assigned' | 'in_progress' | 'resolved';
  comments: ReviewComment[];
}

/**
 * Main proposal object
 */
export interface Proposal {
  id: string;
  title: string;
  /** Client/customer company name */
  clientName: string;
  /** CRM opportunity or account ID */
  clientId: string;
  /** Deal value in USD */
  opportunityValue: number;
  /** Current workflow status */
  status: ProposalStatus;
  /** All sections of the proposal */
  sections: ProposalSection[];
  /** Outstanding questions to improve quality */
  openQuestions: OpenQuestion[];
  /** Proactive suggestions and reminders */
  nudges: Nudge[];
  /** Human review requests created for escalation */
  reviewRequests?: ReviewRequest[];
  createdAt: Date;
  lastModified: Date;
  /** Proposal due date */
  dueDate: Date;
  /** Sales rep or account owner */
  owner: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  /** Industry vertical */
  industry?: string;
  /** Key stakeholders on customer side */
  stakeholders?: Array<{
    name: string;
    title: string;
    email: string;
  }>;
  /** Overall AI confidence in the proposal (0-1) */
  overallConfidence: number;
  /** Total word count across all sections */
  totalWordCount: number;
}

