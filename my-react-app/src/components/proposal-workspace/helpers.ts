import { ApprovalState, Nudge, OpenQuestion, Priority, Proposal, Source } from '../../types';

export function completionPercentage(proposal: Proposal): number {
  if (proposal.sections.length === 0) return 0;
  const approvedCount = proposal.sections.filter((s) => s.approvalState === ApprovalState.APPROVED).length;
  return Math.round((approvedCount / proposal.sections.length) * 100);
}

export function countByPriority<T extends { priority: Priority }>(items: T[]) {
  return items.reduce(
    (acc, item) => {
      acc[item.priority] += 1;
      return acc;
    },
    { [Priority.HIGH]: 0, [Priority.MEDIUM]: 0, [Priority.LOW]: 0 } as Record<Priority, number>
  );
}

export function activeQuestions(proposal: Proposal): OpenQuestion[] {
  return proposal.openQuestions.filter((q) => !q.dismissed);
}

export function activeNudges(proposal: Proposal): Nudge[] {
  return proposal.nudges.filter((n) => !n.dismissed);
}

export function uniqueSources(proposal: Proposal): Source[] {
  const map = new Map<string, Source>();
  for (const section of proposal.sections) {
    for (const source of section.sources) {
      if (!map.has(source.id)) map.set(source.id, source);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export function lowConfidenceSectionIds(proposal: Proposal, threshold = 0.6): string[] {
  return proposal.sections.filter((s) => s.confidence < threshold).map((s) => s.id);
}


