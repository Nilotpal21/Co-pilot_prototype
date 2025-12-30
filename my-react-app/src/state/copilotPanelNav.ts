export type CopilotPanelTab = 'chat' | 'nudges' | 'actions';

export type CopilotPanelNavigation =
  | { kind: 'none' }
  | { kind: 'nudge'; proposalId: string; nudgeId: string; relatedSectionId?: string }
  | { kind: 'section'; proposalId: string; sectionId: string }
  | { kind: 'question'; proposalId: string; questionId: string };


