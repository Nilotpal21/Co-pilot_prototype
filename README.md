# Co-pilot_prototype

## Overview

This repo contains a **Copilot-native Sales Proposal Agent prototype** built with **React + TypeScript**, **Fluent UI v9**, and **Zustand**.

It simulates how a Copilot panel can drive and respond to work happening inside “host surfaces”:
- **Outlook**: email thread + Gmail-like email UI + Copilot context/suggestion + reply composer
- **Word**: proposal document editing + inline suggestions + export preview
- **Teams**: chat thread + Copilot suggestion/context + review thread + collapsible chat list

The core proposal domain is strongly typed (sections, sources, approvals, nudges, open questions) and the proposal state is persisted in `localStorage`.

## Quick start

### Prerequisites
- **Node.js**: recommended 18+ (works with CRA `react-scripts`)
- **npm**

### Install

```bash
cd my-react-app
npm install
```

### Run the dev server

```bash
cd my-react-app
npm start
```

Then open `http://localhost:3000`.

### Run tests

```bash
cd my-react-app
npm test
```

## Key product flows

### Create a proposal via Copilot chat
- Open the **Copilot panel → Chat**
- Try prompts like:
  - `Create proposal for Contoso worth $850K`
  - `List proposals`
  - `View proposal for Fabrikam`
- Copilot creates a proposal, sets it **active**, and shows an **outline preview**.

### Manage the proposal (Copilot-native workspace)
- In the Copilot panel, use the workspace tabs:
  - **Overview**: status + progress + next actions
  - **Sections**: edit sections, view confidence, open sources
  - **Open Questions**: resolve/dismiss
  - **Approvals**: approve / needs revision / reject with feedback
  - **Sources**: provenance list per section

### Host-surface navigation + status
- `ProposalStatusWidget` shows the active proposal and quick links.
- Clicking links can drive Copilot navigation (e.g., jump to a section needing review).

### Export to Word preview
- From Outlook/Teams, click **Export to Word** in the status widget.
- The app switches to **Word** and renders a structured document preview based on current sections.

### Uncertainty + escalation (HITL simulation)
- When sections are uncertain/blocked, an `UncertaintyBanner` offers:
  - **Apply standard template**
  - **Escalate for human review** (creates a review request + simple comment thread visible in Teams)

## Data model (domain types)

The core proposal domain is defined in:
- `my-react-app/src/types/proposal.ts`

Key concepts:
- **Proposal**: client + deal + status + sections + questions + nudges (+ review requests)
- **ProposalSection**: content, confidence, sources, and approval state
- **Source**: provenance for generated claims with excerpts/relevance
- **OpenQuestion**: blockers needed to finalize the proposal
- **Nudge**: proactive Copilot reminders/suggestions
- **ReviewRequest / ReviewComment**: simulated human-in-the-loop review thread

## State management

### App UI state (`useAppStore`)
- File: `my-react-app/src/state/useAppStore.ts`
- Owns:
  - active surface (`outlook` | `word` | `teams`)
  - Copilot panel tab + navigation selection
  - Word export state (switch surface + preview)

### Proposal state (`useProposalStore`)
- File: `my-react-app/src/state/useProposalStore.ts`
- Persists to `localStorage` under key **`proposal-store`**
- Owns:
  - proposals map + active proposal id
  - actions for CRUD, approvals, questions, nudges, templates, review requests
  - selectors for filtered views (pending approvals, active questions, etc.)

If you want a “fresh start”, clear:
- `localStorage["proposal-store"]`

## UI architecture (high level)

### Layout
- `my-react-app/src/components/AppShell.tsx`
  - Left: **Copilot panel**
  - Right: **Host surface** with a tab switcher (Outlook/Word/Teams)

### Copilot panel
- `my-react-app/src/components/CopilotPanelEnhanced.tsx`
  - Tabs: **Chat**, **Nudges**, **Actions**
  - Chat: `CopilotChatPanel` uses simple intent parsing and triggers store actions.

### Host surfaces
- `my-react-app/src/components/surfaces/OutlookSurface.tsx`
- `my-react-app/src/components/surfaces/WordSurface.tsx`
- `my-react-app/src/components/surfaces/TeamsSurface.tsx`

## Codebase map

```text
my-react-app/
  src/
    components/
      AppShell.tsx
      CopilotChatPanel.tsx
      CopilotPanelEnhanced.tsx
      InlineSuggestionCard.tsx
      ProposalStatusWidget.tsx
      ProposalWorkspace.tsx
      proposal-workspace/
        SectionCard.tsx
        ConfidenceBadge.tsx
        SourcesPanel.tsx
        ...tabs + helpers...
      surfaces/
        OutlookSurface.tsx
        WordSurface.tsx
        TeamsSurface.tsx
    data/
      mockData.ts
    state/
      useAppStore.ts
      useProposalStore.ts
      copilotPanelNav.ts
    types/
      proposal.ts
      index.ts
    utils/
      date.ts
      intentParser.ts
```

## Testing notes

- Tests use `@testing-library/react` + CRA Jest.
- Fluent UI icons are ESM; Jest is configured in `my-react-app/package.json` to map icons to CJS builds via `moduleNameMapper`.

## Docs in this repo

If you want deeper detail, see:
- `APPSHELL_SUMMARY.md`
- `COPILOT_CHAT_PANEL.md`
- `PROPOSAL_STORE_SUMMARY.md`
- `PROPOSAL_TYPES_SUMMARY.md`
- `TECHNICAL_SPEC.md` (separate HITL Inbox spec used during earlier prototyping)

## Contributing / housekeeping

- Workspace/tooling folders are ignored via root `.gitignore`:
  - `.cursor/`
  - `.npm-cache/`
  - `.specify/`