# Proposal Store - Zustand State Management

This directory contains the Zustand store for managing Sales Proposal state with localStorage persistence.

## Overview

The `useProposalStore` provides centralized state management for proposals with:
- ✅ **localStorage Persistence** - State survives page refreshes
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Immutable Updates** - Predictable state changes
- ✅ **Computed Properties** - Auto-calculated confidence & word counts
- ✅ **Comprehensive Actions** - Full CRUD for all entities
- ✅ **Selectors** - Optimized queries for common use cases

## Store Structure

```typescript
interface ProposalState {
  // State
  proposals: Record<string, Proposal>;  // Map of ID → Proposal
  activeProposalId: string | null;      // Currently active proposal
  
  // Getters
  getProposal(id: string): Proposal | undefined;
  getActiveProposal(): Proposal | undefined;
  getAllProposals(): Proposal[];
  
  // Actions (see below)
}
```

## Usage

### Basic Usage

```typescript
import { useProposalStore } from './state/useProposalStore';

function MyComponent() {
  // Subscribe to specific state
  const activeProposal = useProposalStore((state) => state.getActiveProposal());
  
  // Get actions
  const { createProposal, updateSection, approveSection } = useProposalStore();
  
  // Use in your component...
}
```

### Optimized Selectors

```typescript
import { useProposalStore, proposalSelectors } from './state/useProposalStore';

function ProposalDashboard() {
  const proposal = useProposalStore((state) => state.getActiveProposal());
  
  if (!proposal) return null;
  
  // Use efficient selectors
  const completion = proposalSelectors.getCompletionPercentage(proposal.id);
  const { questions, nudges } = proposalSelectors.getHighPriorityItems(proposal.id);
  const draftSections = proposalSelectors.getSectionsByApprovalState(
    proposal.id,
    ApprovalState.DRAFT
  );
  
  return (
    <div>
      <h1>{proposal.title} - {completion}% Complete</h1>
      {/* ... */}
    </div>
  );
}
```

## Actions

### Proposal Actions

#### `createProposal(data)`
Create a new proposal and set it as active.

```typescript
const proposalId = createProposal({
  title: 'Q1 2025 Cloud Migration Proposal',
  clientName: 'Acme Corp',
  clientId: 'acme-123',
  opportunityValue: 1500000,
  status: ProposalStatus.DRAFT,
  sections: [],
  openQuestions: [],
  nudges: [],
  dueDate: new Date('2025-03-31'),
  owner: {
    id: 'user-1',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
  },
  overallConfidence: 0,
  totalWordCount: 0,
});
```

**Auto-calculated:**
- `id` - Generated if not provided
- `createdAt`, `lastModified` - Set to current time
- `overallConfidence` - Calculated from sections
- `totalWordCount` - Sum of section word counts

#### `updateProposal(id, updates)`
Update proposal metadata.

```typescript
updateProposal('prop-123', {
  status: ProposalStatus.APPROVED,
  opportunityValue: 2000000,
});
```

#### `deleteProposal(id)`
Permanently delete a proposal.

```typescript
deleteProposal('prop-123');
```

#### `duplicateProposal(id)`
Create a copy of an existing proposal (resets to DRAFT).

```typescript
const newProposalId = duplicateProposal('prop-123');
```

#### `setActiveProposal(id)`
Set which proposal is currently active.

```typescript
setActiveProposal('prop-456');
```

### Section Actions

#### `addSection(proposalId, section)`
Add a new section to a proposal.

```typescript
addSection('prop-123', {
  title: 'Executive Summary',
  content: 'This proposal outlines...',
  confidence: 0.85,
  sources: [source1, source2],
  approvalState: ApprovalState.DRAFT,
  order: 1,
  wordCount: 250,
});
```

**Auto-generated:**
- `id` - Unique section ID
- `lastModified` - Current timestamp
- `modifiedBy` - Proposal owner's name

#### `updateSection(proposalId, sectionId, updates)`
Update section properties.

```typescript
updateSection('prop-123', 'sec-456', {
  content: 'Updated content here...',
  confidence: 0.92,
  wordCount: 275,
});
```

#### `deleteSection(proposalId, sectionId)`
Remove a section.

```typescript
deleteSection('prop-123', 'sec-456');
```

#### `approveSection(proposalId, sectionId, reviewerNotes?)`
Approve a section (sets state to APPROVED).

```typescript
approveSection('prop-123', 'sec-456', 'Looks great!');
```

#### `rejectSection(proposalId, sectionId, reviewerNotes)`
Reject a section (sets state to REJECTED).

```typescript
rejectSection('prop-123', 'sec-456', 'Needs significant rework');
```

#### `requestRevisionSection(proposalId, sectionId, reviewerNotes)`
Request changes (sets state to NEEDS_REVISION).

```typescript
requestRevisionSection('prop-123', 'sec-456', 'Please add more detail on pricing');
```

#### `reorderSections(proposalId, sectionIds)`
Change section order.

```typescript
// Move section 3 to position 1
const sectionIds = ['sec-3', 'sec-1', 'sec-2'];
reorderSections('prop-123', sectionIds);
```

### Question Actions

#### `addQuestion(proposalId, question)`
Add an open question.

```typescript
addQuestion('prop-123', {
  question: 'What is the customer's preferred go-live date?',
  rationale: 'Need to align timeline with their fiscal year',
  priority: Priority.HIGH,
  relatedSectionIds: ['sec-timeline'],
  category: 'Timeline',
});
```

#### `updateQuestion(proposalId, questionId, updates)`
Update question properties.

```typescript
updateQuestion('prop-123', 'q-456', {
  priority: Priority.LOW, // Downgraded priority
});
```

#### `dismissQuestion(proposalId, questionId)`
Mark a question as dismissed (not deleted, just hidden).

```typescript
dismissQuestion('prop-123', 'q-456');
```

#### `resolveQuestion(proposalId, questionId)`
Permanently remove a resolved question.

```typescript
resolveQuestion('prop-123', 'q-456');
```

### Nudge Actions

#### `addNudge(proposalId, nudge)`
Add a proactive nudge.

```typescript
addNudge('prop-123', {
  type: NudgeType.WARNING,
  message: 'Proposal due in 2 days - 3 sections still in draft',
  actionLabel: 'Review Sections',
  actionType: 'navigate',
  actionTarget: 'sections',
  priority: Priority.HIGH,
  expiresAt: new Date('2025-01-15'),
});
```

#### `updateNudge(proposalId, nudgeId, updates)`
Update nudge properties.

```typescript
updateNudge('prop-123', 'n-456', {
  dismissed: false, // Un-dismiss
});
```

#### `dismissNudge(proposalId, nudgeId)`
Hide a nudge (user acknowledged it).

```typescript
dismissNudge('prop-123', 'n-456');
```

#### `deleteNudge(proposalId, nudgeId)`
Permanently remove a nudge.

```typescript
deleteNudge('prop-123', 'n-456');
```

#### `clearExpiredNudges(proposalId)`
Remove all nudges past their expiration date.

```typescript
clearExpiredNudges('prop-123');
```

### Bulk Operations

#### `importProposal(proposal)`
Import an external proposal (e.g., from API or file).

```typescript
import { mockProposal } from '../data/mockData';

importProposal(mockProposal);
```

#### `clearAllData()`
⚠️ **Warning:** Clears all proposals and resets store.

```typescript
clearAllData();
```

## Selectors

Optimized selector functions for common queries.

### `proposalSelectors.getProposalsByStatus(status)`
Get all proposals with a specific status.

```typescript
const drafts = proposalSelectors.getProposalsByStatus(ProposalStatus.DRAFT);
const approved = proposalSelectors.getProposalsByStatus(ProposalStatus.APPROVED);
```

### `proposalSelectors.getSectionsByApprovalState(proposalId, state)`
Get sections filtered by approval state.

```typescript
const pending = proposalSelectors.getSectionsByApprovalState(
  'prop-123',
  ApprovalState.PENDING
);
```

### `proposalSelectors.getActiveQuestions(proposalId, priority?)`
Get non-dismissed questions, optionally filtered by priority.

```typescript
// All active questions
const allQuestions = proposalSelectors.getActiveQuestions('prop-123');

// Only high priority
const urgentQuestions = proposalSelectors.getActiveQuestions('prop-123', Priority.HIGH);
```

### `proposalSelectors.getActiveNudges(proposalId, priority?)`
Get non-dismissed nudges, optionally filtered by priority.

```typescript
const allNudges = proposalSelectors.getActiveNudges('prop-123');
const urgentNudges = proposalSelectors.getActiveNudges('prop-123', Priority.HIGH);
```

### `proposalSelectors.getCompletionPercentage(proposalId)`
Calculate approval completion percentage.

```typescript
const completion = proposalSelectors.getCompletionPercentage('prop-123'); // 40
```

### `proposalSelectors.getHighPriorityItems(proposalId)`
Get all high-priority questions and nudges.

```typescript
const { questions, nudges } = proposalSelectors.getHighPriorityItems('prop-123');
console.log(`${questions.length} urgent questions, ${nudges.length} urgent nudges`);
```

## Auto-Calculated Properties

The store automatically recalculates derived properties:

### Overall Confidence
Average of all section confidences (0-1 scale).

```typescript
// Recalculated whenever sections change
const proposal = getActiveProposal();
console.log(proposal.overallConfidence); // 0.84
```

### Total Word Count
Sum of all section word counts.

```typescript
// Recalculated whenever sections change
console.log(proposal.totalWordCount); // 1,247
```

### Last Modified
Timestamp updated on any change to the proposal.

```typescript
console.log(proposal.lastModified); // 2025-01-10T14:32:15Z
```

## localStorage Persistence

State is automatically persisted to `localStorage` under the key `proposal-store`.

### How It Works
- ✅ State saved on every change
- ✅ Restored on page load
- ✅ Survives browser refresh
- ✅ Dates properly serialized/deserialized

### Storage Key
```typescript
localStorage.getItem('proposal-store')
```

### Clear Persisted Data
```typescript
// Clear via store
clearAllData();

// Or manually
localStorage.removeItem('proposal-store');
```

## Testing

Comprehensive test suite with 31 tests covering all actions and selectors.

```bash
npm test useProposalStore.test.ts
```

**Test Coverage:**
- ✅ Proposal CRUD (5 tests)
- ✅ Section management (8 tests)
- ✅ Question management (4 tests)
- ✅ Nudge management (5 tests)
- ✅ Selectors (7 tests)
- ✅ Bulk operations (2 tests)

## Performance Tips

### 1. Use Specific Selectors
Avoid subscribing to entire store:

```typescript
// ❌ Bad - re-renders on any store change
const store = useProposalStore();

// ✅ Good - only re-renders when active proposal changes
const activeProposal = useProposalStore((state) => state.getActiveProposal());
```

### 2. Memoize Expensive Computations
```typescript
const highPriorityItems = React.useMemo(() => {
  if (!proposal) return { questions: [], nudges: [] };
  return proposalSelectors.getHighPriorityItems(proposal.id);
}, [proposal?.id]);
```

### 3. Use Shallow Equality for Objects
```typescript
import { shallow } from 'zustand/shallow';

const { createProposal, updateSection } = useProposalStore(
  (state) => ({
    createProposal: state.createProposal,
    updateSection: state.updateSection,
  }),
  shallow
);
```

## Migration from Mock Data

If you're currently using `mockData.ts`, here's how to migrate:

```typescript
// Before
import { mockProposal } from './data/mockData';
const [proposal, setProposal] = useState(mockProposal);

// After
import { useProposalStore } from './state/useProposalStore';
const proposal = useProposalStore((state) => state.getActiveProposal());
const { importProposal } = useProposalStore();

// Load mock on mount
useEffect(() => {
  if (!proposal) {
    importProposal(mockProposal);
  }
}, []);
```

## Example Component

See `ProposalStoreDemo.tsx` for a working example showing:
- Creating proposals
- Approving/rejecting sections
- Adding questions and nudges
- Dismissing items
- Displaying store state

## Troubleshooting

### State not persisting?
Check browser localStorage is enabled and not full.

### Dates not working?
Store uses JSON serialization. Dates are strings in storage but converted on load.

### Performance issues?
- Use specific selectors instead of subscribing to entire store
- Memoize expensive computations
- Check for unnecessary re-renders with React DevTools

### Need to debug?
```typescript
// Log entire store state
console.log(useProposalStore.getState());

// Log specific proposal
console.log(useProposalStore.getState().getProposal('prop-123'));
```

