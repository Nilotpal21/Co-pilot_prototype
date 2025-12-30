/**
 * Zustand store for Sales Proposal state management
 * Includes localStorage persistence and comprehensive actions
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Proposal,
  ProposalSection,
  OpenQuestion,
  Nudge,
  ReviewRequest,
  ReviewComment,
  ApprovalState,
  ProposalStatus,
  Source,
  Priority,
  NudgeType,
} from '../types';

/**
 * Store state interface
 */
interface ProposalState {
  // State
  proposals: Record<string, Proposal>; // Map of proposal ID to proposal
  activeProposalId: string | null;

  // Computed getters
  getProposal: (id: string) => Proposal | undefined;
  getActiveProposal: () => Proposal | undefined;
  getAllProposals: () => Proposal[];

  // Proposal actions
  createProposal: (proposal: Omit<Proposal, 'id'> & { id?: string }) => string;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;
  setActiveProposal: (id: string | null) => void;
  duplicateProposal: (id: string) => string | null;

  // Section actions
  addSection: (proposalId: string, section: Omit<ProposalSection, 'id' | 'lastModified' | 'modifiedBy'>) => void;
  updateSection: (proposalId: string, sectionId: string, updates: Partial<ProposalSection>) => void;
  deleteSection: (proposalId: string, sectionId: string) => void;
  reorderSections: (proposalId: string, sectionIds: string[]) => void;
  approveSection: (proposalId: string, sectionId: string, reviewerNotes?: string) => void;
  rejectSection: (proposalId: string, sectionId: string, reviewerNotes: string) => void;
  requestRevisionSection: (proposalId: string, sectionId: string, reviewerNotes: string) => void;

  // Question actions
  addQuestion: (proposalId: string, question: Omit<OpenQuestion, 'id' | 'createdAt' | 'dismissed'>) => void;
  updateQuestion: (proposalId: string, questionId: string, updates: Partial<OpenQuestion>) => void;
  resolveQuestion: (proposalId: string, questionId: string) => void;
  dismissQuestion: (proposalId: string, questionId: string) => void;
  deleteQuestion: (proposalId: string, questionId: string) => void;

  // Nudge actions
  addNudge: (proposalId: string, nudge: Omit<Nudge, 'id' | 'createdAt' | 'dismissed'>) => void;
  updateNudge: (proposalId: string, nudgeId: string, updates: Partial<Nudge>) => void;
  dismissNudge: (proposalId: string, nudgeId: string) => void;
  deleteNudge: (proposalId: string, nudgeId: string) => void;
  clearExpiredNudges: (proposalId: string) => void;

  // Bulk operations
  clearAllData: () => void;
  importProposal: (proposal: Proposal) => void;

  // Failure/uncertainty handling
  applyStandardTemplate: (proposalId: string) => void;
  createReviewRequest: (proposalId: string, args: { reason: string; assignee: { id: string; name: string; email: string }; relatedSectionIds?: string[]; relatedQuestionIds?: string[] }) => string | null;
  addReviewComment: (proposalId: string, requestId: string, message: string) => void;
}

/**
 * Generate unique ID
 */
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Calculate overall confidence from sections
 */
const calculateOverallConfidence = (sections: ProposalSection[]): number => {
  if (sections.length === 0) return 0;
  const sum = sections.reduce((acc, section) => acc + section.confidence, 0);
  return Math.round((sum / sections.length) * 100) / 100;
};

/**
 * Calculate total word count
 */
const calculateTotalWordCount = (sections: ProposalSection[]): number => {
  return sections.reduce((sum, section) => sum + section.wordCount, 0);
};

const estimateWordCount = (text: string): number => {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
};

const STANDARD_SECTION_TITLES: Array<{ title: string; starter: (clientName: string) => string }> = [
  { title: 'Executive Summary', starter: (c) => `This proposal outlines our recommended approach for ${c}.` },
  { title: 'Business Context', starter: (c) => `Background on ${c}'s goals, constraints, and success criteria.` },
  { title: 'Requirements', starter: () => `Key functional and non-functional requirements captured from discovery.` },
  { title: 'Solution Overview', starter: () => `High-level solution approach and architecture overview.` },
  { title: 'Security & Compliance', starter: () => `Security controls, data protection, and compliance alignment.` },
  { title: 'Implementation Plan', starter: () => `Phases, milestones, timeline, and dependencies.` },
  { title: 'Pricing & Commercials', starter: () => `Commercial model, pricing assumptions, and options.` },
  { title: 'Risks & Mitigations', starter: () => `Key risks and mitigations (technical, schedule, compliance).` },
  { title: 'Next Steps', starter: () => `Decision points, stakeholder actions, and proposed schedule.` },
];

/**
 * Proposal store with persistence
 */
export const useProposalStore = create<ProposalState>()(
  persist(
    (set, get) => ({
      // Initial state
      proposals: {},
      activeProposalId: null,

      // Computed getters
      getProposal: (id: string) => {
        return get().proposals[id];
      },

      getActiveProposal: () => {
        const { activeProposalId, proposals } = get();
        if (!activeProposalId) return undefined;
        return proposals[activeProposalId];
      },

      getAllProposals: () => {
        return Object.values(get().proposals);
      },

      // Proposal actions
      createProposal: (proposalData) => {
        const id = proposalData.id || generateId('prop');
        const now = new Date();

        const proposal: Proposal = {
          ...proposalData,
          id,
          createdAt: proposalData.createdAt || now,
          lastModified: now,
          overallConfidence: calculateOverallConfidence(proposalData.sections),
          totalWordCount: calculateTotalWordCount(proposalData.sections),
        };

        set((state) => ({
          proposals: {
            ...state.proposals,
            [id]: proposal,
          },
          activeProposalId: id,
        }));

        return id;
      },

      updateProposal: (id, updates) => {
        set((state) => {
          const proposal = state.proposals[id];
          if (!proposal) return state;

          const updatedProposal: Proposal = {
            ...proposal,
            ...updates,
            lastModified: new Date(),
            overallConfidence: updates.sections
              ? calculateOverallConfidence(updates.sections)
              : proposal.overallConfidence,
            totalWordCount: updates.sections
              ? calculateTotalWordCount(updates.sections)
              : proposal.totalWordCount,
          };

          return {
            proposals: {
              ...state.proposals,
              [id]: updatedProposal,
            },
          };
        });
      },

      deleteProposal: (id) => {
        set((state) => {
          const { [id]: deleted, ...rest } = state.proposals;
          return {
            proposals: rest,
            activeProposalId: state.activeProposalId === id ? null : state.activeProposalId,
          };
        });
      },

      setActiveProposal: (id) => {
        set({ activeProposalId: id });
      },

      duplicateProposal: (id) => {
        const proposal = get().proposals[id];
        if (!proposal) return null;

        const newId = generateId('prop');
        const now = new Date();

        const duplicated: Proposal = {
          ...proposal,
          id: newId,
          title: `${proposal.title} (Copy)`,
          createdAt: now,
          lastModified: now,
          status: ProposalStatus.DRAFT,
          sections: proposal.sections.map((section) => ({
            ...section,
            id: generateId('sec'),
            approvalState: ApprovalState.DRAFT,
            reviewerNotes: undefined,
          })),
          openQuestions: proposal.openQuestions.map((q) => ({
            ...q,
            id: generateId('q'),
            dismissed: false,
          })),
          nudges: proposal.nudges.map((n) => ({
            ...n,
            id: generateId('n'),
            dismissed: false,
          })),
        };

        set((state) => ({
          proposals: {
            ...state.proposals,
            [newId]: duplicated,
          },
        }));

        return newId;
      },

      // Section actions
      addSection: (proposalId, sectionData) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const newSection: ProposalSection = {
            ...sectionData,
            id: generateId('sec'),
            lastModified: new Date(),
            modifiedBy: proposal.owner.name,
            approvalState: sectionData.approvalState || ApprovalState.DRAFT,
          };

          const sections = [...proposal.sections, newSection];

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                sections,
                lastModified: new Date(),
                overallConfidence: calculateOverallConfidence(sections),
                totalWordCount: calculateTotalWordCount(sections),
              },
            },
          };
        });
      },

      updateSection: (proposalId, sectionId, updates) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const sections = proposal.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  ...updates,
                  lastModified: new Date(),
                  modifiedBy: updates.modifiedBy || section.modifiedBy,
                }
              : section
          );

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                sections,
                lastModified: new Date(),
                overallConfidence: calculateOverallConfidence(sections),
                totalWordCount: calculateTotalWordCount(sections),
              },
            },
          };
        });
      },

      deleteSection: (proposalId, sectionId) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const sections = proposal.sections.filter((s) => s.id !== sectionId);

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                sections,
                lastModified: new Date(),
                overallConfidence: calculateOverallConfidence(sections),
                totalWordCount: calculateTotalWordCount(sections),
              },
            },
          };
        });
      },

      reorderSections: (proposalId, sectionIds) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const sectionMap = new Map(proposal.sections.map((s) => [s.id, s]));
          const sections = sectionIds
            .map((id, index) => {
              const section = sectionMap.get(id);
              return section ? { ...section, order: index + 1 } : null;
            })
            .filter((s): s is ProposalSection => s !== null);

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                sections,
                lastModified: new Date(),
              },
            },
          };
        });
      },

      approveSection: (proposalId, sectionId, reviewerNotes) => {
        get().updateSection(proposalId, sectionId, {
          approvalState: ApprovalState.APPROVED,
          reviewerNotes,
        });
      },

      rejectSection: (proposalId, sectionId, reviewerNotes) => {
        get().updateSection(proposalId, sectionId, {
          approvalState: ApprovalState.REJECTED,
          reviewerNotes,
        });
      },

      requestRevisionSection: (proposalId, sectionId, reviewerNotes) => {
        get().updateSection(proposalId, sectionId, {
          approvalState: ApprovalState.NEEDS_REVISION,
          reviewerNotes,
        });
      },

      // Question actions
      addQuestion: (proposalId, questionData) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const newQuestion: OpenQuestion = {
            ...questionData,
            id: generateId('q'),
            createdAt: new Date(),
            dismissed: false,
          };

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                openQuestions: [...proposal.openQuestions, newQuestion],
                lastModified: new Date(),
              },
            },
          };
        });
      },

      updateQuestion: (proposalId, questionId, updates) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const openQuestions = proposal.openQuestions.map((q) =>
            q.id === questionId ? { ...q, ...updates } : q
          );

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                openQuestions,
                lastModified: new Date(),
              },
            },
          };
        });
      },

      resolveQuestion: (proposalId, questionId) => {
        get().deleteQuestion(proposalId, questionId);
      },

      dismissQuestion: (proposalId, questionId) => {
        get().updateQuestion(proposalId, questionId, { dismissed: true });
      },

      deleteQuestion: (proposalId, questionId) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                openQuestions: proposal.openQuestions.filter((q) => q.id !== questionId),
                lastModified: new Date(),
              },
            },
          };
        });
      },

      // Nudge actions
      addNudge: (proposalId, nudgeData) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const newNudge: Nudge = {
            ...nudgeData,
            id: generateId('n'),
            createdAt: new Date(),
            dismissed: false,
          };

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                nudges: [...proposal.nudges, newNudge],
                lastModified: new Date(),
              },
            },
          };
        });
      },

      updateNudge: (proposalId, nudgeId, updates) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const nudges = proposal.nudges.map((n) => (n.id === nudgeId ? { ...n, ...updates } : n));

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                nudges,
                lastModified: new Date(),
              },
            },
          };
        });
      },

      dismissNudge: (proposalId, nudgeId) => {
        get().updateNudge(proposalId, nudgeId, { dismissed: true });
      },

      deleteNudge: (proposalId, nudgeId) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                nudges: proposal.nudges.filter((n) => n.id !== nudgeId),
                lastModified: new Date(),
              },
            },
          };
        });
      },

      clearExpiredNudges: (proposalId) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const now = new Date();
          const nudges = proposal.nudges.filter(
            (n) => !n.expiresAt || new Date(n.expiresAt) > now
          );

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                nudges,
                lastModified: new Date(),
              },
            },
          };
        });
      },

      // Bulk operations
      clearAllData: () => {
        set({
          proposals: {},
          activeProposalId: null,
        });
      },

      importProposal: (proposal) => {
        set((state) => ({
          proposals: {
            ...state.proposals,
            [proposal.id]: proposal,
          },
        }));
      },

      applyStandardTemplate: (proposalId) => {
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const existingByTitle = new Map(proposal.sections.map((s) => [s.title.toLowerCase(), s]));
          const nextSections: ProposalSection[] = proposal.sections.slice();

          for (const spec of STANDARD_SECTION_TITLES) {
            const key = spec.title.toLowerCase();
            if (existingByTitle.has(key)) continue;
            const content = spec.starter(proposal.clientName);
            nextSections.push({
              id: generateId('sec'),
              title: spec.title,
              content,
              confidence: 0.5,
              sources: [],
              approvalState: ApprovalState.DRAFT,
              order: nextSections.length + 1,
              lastModified: new Date(),
              modifiedBy: proposal.owner.name,
              wordCount: estimateWordCount(content),
            });
          }

          // Normalize order
          const ordered = nextSections
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s, idx) => ({ ...s, order: idx + 1 }));

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                sections: ordered,
                lastModified: new Date(),
                overallConfidence: calculateOverallConfidence(ordered),
                totalWordCount: calculateTotalWordCount(ordered),
              },
            },
          };
        });
      },

      createReviewRequest: (proposalId, args) => {
        const proposal = get().proposals[proposalId];
        if (!proposal) return null;
        const now = new Date();
        const requestId = generateId('rev');

        const createdBy = {
          id: proposal.owner.id,
          name: proposal.owner.name,
          email: proposal.owner.email,
        };

        const request: ReviewRequest = {
          id: requestId,
          createdAt: now,
          createdBy,
          assignee: args.assignee,
          reason: args.reason,
          relatedSectionIds: args.relatedSectionIds,
          relatedQuestionIds: args.relatedQuestionIds,
          status: 'assigned',
          comments: [
            {
              id: generateId('c'),
              author: createdBy,
              message: `Escalated for review: ${args.reason}`,
              createdAt: now,
            } satisfies ReviewComment,
          ],
        };

        get().updateProposal(proposalId, {
          reviewRequests: [...(proposal.reviewRequests || []), request],
        });

        return requestId;
      },

      addReviewComment: (proposalId, requestId, message) => {
        if (!message.trim()) return;
        set((state) => {
          const proposal = state.proposals[proposalId];
          if (!proposal) return state;

          const requests = (proposal.reviewRequests || []).map((r) => {
            if (r.id !== requestId) return r;
            const comment: ReviewComment = {
              id: generateId('c'),
              author: {
                id: proposal.owner.id,
                name: proposal.owner.name,
                email: proposal.owner.email,
              },
              message: message.trim(),
              createdAt: new Date(),
            };
            return { ...r, comments: [...r.comments, comment] };
          });

          return {
            proposals: {
              ...state.proposals,
              [proposalId]: {
                ...proposal,
                reviewRequests: requests,
                lastModified: new Date(),
              },
            },
          };
        });
      },
    }),
    {
      name: 'proposal-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Serialize/deserialize dates properly
      partialize: (state) => ({
        proposals: state.proposals,
        activeProposalId: state.activeProposalId,
      }),
    }
  )
);

/**
 * Selectors for common queries
 */
export const proposalSelectors = {
  // Get proposals by status
  getProposalsByStatus: (status: ProposalStatus) => {
    return useProposalStore.getState().getAllProposals().filter((p) => p.status === status);
  },

  // Get sections by approval state
  getSectionsByApprovalState: (proposalId: string, state: ApprovalState) => {
    const proposal = useProposalStore.getState().getProposal(proposalId);
    return proposal?.sections.filter((s) => s.approvalState === state) || [];
  },

  // Get active (non-dismissed) questions
  getActiveQuestions: (proposalId: string, priority?: Priority) => {
    const proposal = useProposalStore.getState().getProposal(proposalId);
    let questions = proposal?.openQuestions.filter((q) => !q.dismissed) || [];
    if (priority) {
      questions = questions.filter((q) => q.priority === priority);
    }
    return questions;
  },

  // Get active (non-dismissed) nudges
  getActiveNudges: (proposalId: string, priority?: Priority) => {
    const proposal = useProposalStore.getState().getProposal(proposalId);
    let nudges = proposal?.nudges.filter((n) => !n.dismissed) || [];
    if (priority) {
      nudges = nudges.filter((n) => n.priority === priority);
    }
    return nudges;
  },

  // Get completion percentage
  getCompletionPercentage: (proposalId: string): number => {
    const proposal = useProposalStore.getState().getProposal(proposalId);
    if (!proposal || proposal.sections.length === 0) return 0;

    const approvedCount = proposal.sections.filter(
      (s) => s.approvalState === ApprovalState.APPROVED
    ).length;
    return Math.round((approvedCount / proposal.sections.length) * 100);
  },

  // Get high priority items
  getHighPriorityItems: (proposalId: string) => {
    return {
      questions: proposalSelectors.getActiveQuestions(proposalId, Priority.HIGH),
      nudges: proposalSelectors.getActiveNudges(proposalId, Priority.HIGH),
    };
  },
};

