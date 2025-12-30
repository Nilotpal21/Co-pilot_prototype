# Sales Proposal Agent - Domain Types

This directory contains TypeScript domain types for a Copilot-native Sales Proposal Agent UI.

## Overview

The type system models a comprehensive sales proposal workflow with AI-generated content, confidence scoring, approval workflows, and proactive nudges.

## Core Types

### `Proposal`

The main proposal entity representing a complete sales proposal document.

**Key Properties:**
- `id`: Unique identifier
- `title`: Proposal title
- `clientName`: Customer company name
- `opportunityValue`: Deal value in USD
- `status`: Current workflow status (draft, in_review, approved, etc.)
- `sections`: Array of proposal sections
- `openQuestions`: Questions that need answers to improve quality
- `nudges`: Proactive suggestions and reminders from Copilot
- `owner`: Sales rep or account owner
- `overallConfidence`: AI confidence score (0-1) for the entire proposal

### `ProposalSection`

Individual sections of the proposal (e.g., Executive Summary, Solution Architecture).

**Key Properties:**
- `title`: Section heading
- `content`: Rich text content (AI-generated)
- `confidence`: AI confidence score (0-1) for this section
- `sources`: Array of sources used to generate content
- `approvalState`: Current approval status (draft, pending, approved, rejected, needs_revision)
- `wordCount`: Section word count
- `reviewerNotes`: Optional feedback from reviewer

**Confidence Score Guidelines:**
- `0.9 - 1.0`: High confidence - AI used authoritative, recent sources
- `0.75 - 0.89`: Good confidence - Content well-supported but may need validation
- `0.6 - 0.74`: Moderate confidence - Review recommended, missing some details
- `< 0.6`: Low confidence - Significant gaps in information

### `Source`

Reference to information sources used to generate proposal content.

**Source Types:**
- `CRM`: Customer relationship management system data
- `DOCUMENT`: Internal documents, assessments, specifications
- `EMAIL`: Email threads and correspondence
- `MEETING_NOTES`: Notes from discovery calls and meetings
- `PREVIOUS_PROPOSAL`: Past proposals (especially won deals)
- `CUSTOMER_WEBSITE`: Customer's public information
- `INTERNAL_WIKI`: Internal knowledge base articles
- `SALES_PLAYBOOK`: Best practices and templates

**Key Properties:**
- `type`: Source category
- `title`: Human-readable source name
- `reference`: URL, file path, or CRM record ID
- `excerpt`: Short summary of relevant content (1-2 sentences)
- `relevanceScore`: How relevant this source is (0-1)
- `lastUpdated`: When the source was last modified

### `OpenQuestion`

Questions that, if answered, would improve the proposal quality.

**Key Properties:**
- `question`: The question text
- `rationale`: Why this matters for the proposal
- `priority`: HIGH, MEDIUM, or LOW
- `relatedSectionIds`: Which sections this affects
- `suggestedSources`: Where to find the answer
- `category`: Optional categorization (Technical, Compliance, Timeline, etc.)

**Priority Guidelines:**
- `HIGH`: Blocks approval, significant quality/accuracy impact
- `MEDIUM`: Should be addressed but not blocking
- `LOW`: Nice-to-have, improves polish

### `Nudge`

Proactive suggestions, reminders, and best practices from the Copilot.

**Nudge Types:**
- `SUGGESTION`: Helpful recommendation to improve the proposal
- `REMINDER`: Time-sensitive action or deadline
- `WARNING`: Potential issue that needs attention
- `INFO`: Useful information or insight
- `BEST_PRACTICE`: Industry/company best practice
- `COMPLIANCE`: Compliance or legal requirement

**Key Properties:**
- `type`: Nudge category
- `message`: Explanation or description
- `actionLabel`: Button text (e.g., "Review Section", "Add Details")
- `actionType`: What happens on click (navigate, edit, review, dismiss)
- `actionTarget`: Where to navigate (section ID)
- `priority`: HIGH, MEDIUM, or LOW
- `expiresAt`: Optional expiry for time-sensitive nudges

## Enums

### `ProposalStatus`
Workflow states for proposals:
- `DRAFT` - Initial creation, not ready for review
- `IN_REVIEW` - Under internal review
- `PENDING_APPROVAL` - Awaiting final approval
- `APPROVED` - Approved and ready to send
- `REJECTED` - Rejected, needs major rework
- `SENT` - Sent to customer
- `ACCEPTED` - Customer accepted
- `DECLINED` - Customer declined

### `ApprovalState`
Section-level approval states:
- `DRAFT` - Initial AI generation
- `PENDING` - Submitted for review
- `APPROVED` - Reviewer approved
- `REJECTED` - Reviewer rejected
- `NEEDS_REVISION` - Needs specific changes

### `Priority`
Priority levels:
- `HIGH` - Urgent, blocks progress
- `MEDIUM` - Important, should address soon
- `LOW` - Optional, nice-to-have

## Usage Examples

### Accessing Mock Data

```typescript
import { mockProposal, getHighPriorityItems, getCompletionPercentage } from '../data/mockData';

// Get the proposal
const proposal = mockProposal;

// Calculate completion
const completionPercent = getCompletionPercentage(proposal);

// Get high priority items that need attention
const { questions, nudges } = getHighPriorityItems(proposal);
```

### Filtering Sections

```typescript
import { getSectionsByApprovalState } from '../data/mockData';
import { ApprovalState } from '../types';

// Get sections that need review
const pendingSections = getSectionsByApprovalState(proposal, ApprovalState.PENDING);

// Get approved sections
const approvedSections = getSectionsByApprovalState(proposal, ApprovalState.APPROVED);
```

### Working with Sources

```typescript
// Find CRM sources
const crmSources = proposal.sections
  .flatMap(s => s.sources)
  .filter(source => source.type === SourceType.CRM);

// Find high relevance sources
const highRelevanceSources = proposal.sections
  .flatMap(s => s.sources)
  .filter(source => source.relevanceScore > 0.85);
```

### Checking Confidence

```typescript
// Find low confidence sections
const lowConfidenceSections = proposal.sections
  .filter(section => section.confidence < 0.75);

// Calculate average confidence
const avgConfidence = proposal.sections
  .reduce((sum, s) => sum + s.confidence, 0) / proposal.sections.length;
```

## Type Safety Benefits

1. **IntelliSense Support**: IDE autocomplete for all properties
2. **Compile-Time Validation**: Catch errors before runtime
3. **Refactoring Safety**: Rename/modify types with confidence
4. **Documentation**: Types serve as living documentation
5. **API Contract**: Types define the shape of data from backend APIs

## Design Principles

1. **Immutability**: Types encourage immutable data patterns
2. **Explicit Over Implicit**: All fields clearly defined
3. **Domain-Driven**: Types reflect real business concepts
4. **Extensibility**: Easy to add new fields without breaking changes
5. **Testability**: Types make it easy to write comprehensive tests

## Mock Data

See `../data/mockData.ts` for a realistic sample proposal with:
- 5 proposal sections (Executive Summary, Business Understanding, Solution Architecture, Migration Approach, Investment & ROI)
- 7 authoritative sources (CRM, meeting notes, documents, emails, etc.)
- 5 open questions across technical, compliance, and planning categories
- 6 proactive nudges including warnings, suggestions, and reminders

The mock data represents a $2.4M cloud migration proposal for a medical device manufacturer with realistic content, confidence scores, and approval states.

## Testing

Run type safety and data integrity tests:

```bash
npm test mockData.test.ts
```

Tests validate:
- Type structure and required fields
- Data integrity (valid references between entities)
- Helper function correctness
- Business logic (calculations, filtering)

