# Type Relationships - Sales Proposal Agent

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          PROPOSAL                                │
│─────────────────────────────────────────────────────────────────│
│ + id: string                                                     │
│ + title: string                                                  │
│ + clientName: string                                            │
│ + opportunityValue: number                                      │
│ + status: ProposalStatus                                        │
│ + overallConfidence: number (0-1)                               │
│ + dueDate: Date                                                 │
│ + owner: { id, name, email, avatarUrl }                         │
│ + stakeholders: Array<{ name, title, email }>                   │
└────┬────────────────┬─────────────────┬──────────────────────┘
     │                │                 │
     │ 1..*           │ 0..*            │ 0..*
     │                │                 │
     ▼                ▼                 ▼
┌─────────────┐  ┌──────────────┐  ┌────────────┐
│  SECTION    │  │   QUESTION   │  │   NUDGE    │
└─────────────┘  └──────────────┘  └────────────┘
```

## Core Type: PROPOSAL

The central entity containing all proposal data.

**Relationships:**
- **1:N** with ProposalSection (sections[])
- **1:N** with OpenQuestion (openQuestions[])
- **1:N** with Nudge (nudges[])

**Computed Properties:**
- `overallConfidence` - Aggregate of section confidences
- `totalWordCount` - Sum of all section word counts

---

## PROPOSAL SECTION

```
┌──────────────────────────────────────────────────────────┐
│                    PROPOSAL SECTION                       │
│──────────────────────────────────────────────────────────│
│ + id: string                                              │
│ + title: string                                           │
│ + content: string (rich text)                             │
│ + confidence: number (0-1)                                │
│ + approvalState: ApprovalState                            │
│ + order: number                                           │
│ + wordCount: number                                       │
│ + lastModified: Date                                      │
│ + modifiedBy: string                                      │
│ + reviewerNotes?: string                                  │
└────┬───────────────────────────────────────────────────┘
     │
     │ 1..*
     │
     ▼
┌──────────┐
│  SOURCE  │
└──────────┘
```

**Relationships:**
- **N:M** with Source (sources[]) - Multiple sources per section
- **1:N** from Proposal - Each section belongs to one proposal

**Approval States:**
```
DRAFT → PENDING → APPROVED
                    ↓
              NEEDS_REVISION → PENDING
                    ↓
                 REJECTED
```

**Confidence Interpretation:**
- `0.9 - 1.0` 🟢 High confidence - Ready for review
- `0.75 - 0.89` 🟡 Good confidence - Minor review needed
- `0.6 - 0.74` 🟠 Moderate confidence - Detailed review needed
- `< 0.6` 🔴 Low confidence - Significant gaps

---

## SOURCE

```
┌──────────────────────────────────────────────────────────┐
│                         SOURCE                            │
│──────────────────────────────────────────────────────────│
│ + id: string                                              │
│ + type: SourceType                                        │
│ + title: string                                           │
│ + reference: string (URL/path/ID)                         │
│ + excerpt: string                                         │
│ + relevanceScore: number (0-1)                            │
│ + lastUpdated: Date                                       │
│ + author?: string                                         │
└──────────────────────────────────────────────────────────┘
```

**Source Types:**
```
📊 CRM                  - Customer data from Salesforce/Dynamics
📄 DOCUMENT             - PDFs, assessments, specifications
📧 EMAIL                - Email threads and correspondence
📝 MEETING_NOTES        - Discovery call notes
📋 PREVIOUS_PROPOSAL    - Past proposals (especially wins)
🌐 CUSTOMER_WEBSITE     - Public customer information
📚 INTERNAL_WIKI        - Knowledge base articles
📖 SALES_PLAYBOOK       - Templates and best practices
```

**Relationships:**
- **N:M** with ProposalSection - Reusable across sections
- **1:N** with OpenQuestion (suggestedSources[])

---

## OPEN QUESTION

```
┌──────────────────────────────────────────────────────────┐
│                     OPEN QUESTION                         │
│──────────────────────────────────────────────────────────│
│ + id: string                                              │
│ + question: string                                        │
│ + rationale: string                                       │
│ + priority: Priority                                      │
│ + relatedSectionIds: string[]                             │
│ + suggestedSources?: Source[]                             │
│ + category?: string                                       │
│ + dismissed: boolean                                      │
│ + createdAt: Date                                         │
└──────────────────────────────────────────────────────────┘
```

**Relationships:**
- **N:1** from Proposal - Each question belongs to one proposal
- **N:M** with ProposalSection via relatedSectionIds[]
- **N:M** with Source (suggestedSources[])

**Priority Levels:**
```
🔴 HIGH   - Blocks approval, significant impact
🟡 MEDIUM - Should address, quality improvement
🟢 LOW    - Nice-to-have, polish
```

**Common Categories:**
- Technical (architecture, sizing, integration)
- Compliance (regulatory, legal requirements)
- Timeline (deadlines, milestones)
- Pricing (costs, terms, discounts)
- Planning (strategy, roadmap)

---

## NUDGE

```
┌──────────────────────────────────────────────────────────┐
│                          NUDGE                            │
│──────────────────────────────────────────────────────────│
│ + id: string                                              │
│ + type: NudgeType                                         │
│ + message: string                                         │
│ + actionLabel?: string                                    │
│ + actionType?: 'navigate' | 'edit' | 'review' | 'dismiss'│
│ + actionTarget?: string (section ID)                      │
│ + priority: Priority                                      │
│ + relatedSectionId?: string                               │
│ + dismissed: boolean                                      │
│ + createdAt: Date                                         │
│ + expiresAt?: Date                                        │
└──────────────────────────────────────────────────────────┘
```

**Relationships:**
- **N:1** from Proposal - Each nudge belongs to one proposal
- **N:1** with ProposalSection (optional, via relatedSectionId)

**Nudge Types:**
```
💡 SUGGESTION     - Helpful recommendation
⏰ REMINDER       - Time-sensitive action
⚠️  WARNING        - Potential issue
ℹ️  INFO           - Useful information
✅ BEST_PRACTICE  - Industry best practice
📋 COMPLIANCE     - Legal/regulatory requirement
```

**Action Types:**
```
navigate → Go to specific section
edit     → Open editor for section/field
review   → Request/provide review
dismiss  → Hide the nudge
```

---

## Enums and Status Types

### ProposalStatus (Workflow)

```
DRAFT
  ↓
IN_REVIEW
  ↓
PENDING_APPROVAL
  ↓
APPROVED
  ↓
SENT → ACCEPTED
       ↓
    DECLINED
  ↓
REJECTED (back to DRAFT)
```

### Priority (Universal)

Used by both Questions and Nudges:
```
HIGH   - Urgent, blocks progress
MEDIUM - Important, address soon
LOW    - Optional, nice-to-have
```

---

## Data Flow Example

**Scenario: AI Generates a Proposal Section**

```
1. AI analyzes Sources
   ├─ CRM data (relevance: 0.95)
   ├─ Meeting notes (relevance: 0.92)
   └─ Previous proposals (relevance: 0.88)

2. AI generates ProposalSection
   ├─ content: "..." (AI-written text)
   ├─ confidence: 0.88 (based on source quality)
   ├─ sources: [src-001, src-002, src-003]
   └─ approvalState: DRAFT

3. AI creates OpenQuestion (if gaps found)
   ├─ "What is the VM sizing requirement?"
   ├─ priority: HIGH
   ├─ relatedSectionIds: [sec-003]
   └─ suggestedSources: [src-006]

4. AI creates Nudge (proactive suggestion)
   ├─ "ROI section has low confidence"
   ├─ type: WARNING
   ├─ actionLabel: "Review Section"
   └─ relatedSectionId: sec-005

5. User reviews and approves
   ├─ Section approvalState: DRAFT → PENDING → APPROVED
   ├─ Question dismissed: true
   └─ Overall proposal overallConfidence updated
```

---

## Type Safety Benefits

### Compile-Time Validation
```typescript
// ✅ Type-safe
const section: ProposalSection = {
  confidence: 0.88,
  approvalState: ApprovalState.PENDING,
  // ... other required fields
};

// ❌ TypeScript error - invalid confidence
const badSection: ProposalSection = {
  confidence: 150, // ERROR: Type 'number' not in range 0-1
};

// ❌ TypeScript error - invalid enum
const badStatus: ProposalStatus = 'in-progress'; // ERROR: Not a valid ProposalStatus
```

### IntelliSense Support
```typescript
// IDE autocomplete shows all valid properties
proposal.sections[0].| // Shows: id, title, content, confidence, sources, etc.

// IDE validates enum values
section.approvalState = ApprovalState.| // Shows: DRAFT, PENDING, APPROVED, etc.
```

### Refactoring Safety
If you rename `confidence` to `confidenceScore`, TypeScript catches all usages:
```typescript
// Before
section.confidence

// After rename
section.confidenceScore // All references updated automatically
```

---

## Mock Data Statistics

**Sample Proposal: Contoso Manufacturing**
- 📝 5 sections (1,069 total words)
- 📊 7 sources (avg relevance: 0.88)
- ❓ 5 questions (2 high, 2 medium, 1 low priority)
- 💡 6 nudges (3 high, 2 medium, 1 low priority)
- ✅ 1 approved section (20% completion)
- 🎯 82% overall confidence

This realistic mock data covers a $2.4M cloud migration deal with authentic sources, actionable questions, and proactive nudges.

