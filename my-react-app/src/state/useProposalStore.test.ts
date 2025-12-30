/**
 * Tests for proposal store
 */

import { renderHook, act } from '@testing-library/react';
import { useProposalStore, proposalSelectors } from './useProposalStore';
import { mockProposal } from '../data/mockData';
import { ProposalStatus, ApprovalState, Priority, NudgeType } from '../types';

// Helper to reset store between tests
const resetStore = () => {
  act(() => {
    useProposalStore.getState().clearAllData();
  });
};

describe('useProposalStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('Proposal CRUD', () => {
    it('should create a new proposal', () => {
      const { result } = renderHook(() => useProposalStore());

      let proposalId: string = '';
      act(() => {
        const now = new Date();
        proposalId = result.current.createProposal({
          title: 'Test Proposal',
          clientName: 'Test Client',
          clientId: 'test-client-1',
          opportunityValue: 100000,
          status: ProposalStatus.DRAFT,
          sections: [],
          openQuestions: [],
          nudges: [],
          createdAt: now,
          lastModified: now,
          dueDate: new Date('2025-12-31'),
          owner: {
            id: 'user-1',
            name: 'Test User',
            email: 'test@example.com',
          },
          overallConfidence: 0,
          totalWordCount: 0,
        });
      });

      expect(proposalId).toBeTruthy();
      expect(result.current.getProposal(proposalId)).toBeDefined();
      expect(result.current.getProposal(proposalId)?.title).toBe('Test Proposal');
      expect(result.current.activeProposalId).toBe(proposalId);
    });

    it('should update a proposal', () => {
      const { result } = renderHook(() => useProposalStore());

      let proposalId: string = '';
      act(() => {
        proposalId = result.current.createProposal({
          ...mockProposal,
          id: undefined,
        });
      });

      act(() => {
        result.current.updateProposal(proposalId, {
          status: ProposalStatus.APPROVED,
          title: 'Updated Title',
        });
      });

      const updated = result.current.getProposal(proposalId);
      expect(updated?.status).toBe(ProposalStatus.APPROVED);
      expect(updated?.title).toBe('Updated Title');
    });

    it('should delete a proposal', () => {
      const { result } = renderHook(() => useProposalStore());

      let proposalId: string = '';
      act(() => {
        proposalId = result.current.createProposal({
          ...mockProposal,
          id: undefined,
        });
      });

      act(() => {
        result.current.deleteProposal(proposalId);
      });

      expect(result.current.getProposal(proposalId)).toBeUndefined();
      expect(result.current.activeProposalId).toBeNull();
    });

    it('should duplicate a proposal', () => {
      const { result } = renderHook(() => useProposalStore());

      let proposalId: string = '';
      act(() => {
        proposalId = result.current.createProposal({
          ...mockProposal,
          id: undefined,
        });
      });

      let duplicatedId: string | null = null;
      act(() => {
        duplicatedId = result.current.duplicateProposal(proposalId);
      });

      expect(duplicatedId).toBeTruthy();
      const original = result.current.getProposal(proposalId);
      const duplicate = result.current.getProposal(duplicatedId!);

      expect(duplicate?.title).toBe(`${original?.title} (Copy)`);
      expect(duplicate?.status).toBe(ProposalStatus.DRAFT);
      expect(duplicate?.id).not.toBe(original?.id);
    });

    it('should set active proposal', () => {
      const { result } = renderHook(() => useProposalStore());

      let proposalId: string = '';
      act(() => {
        proposalId = result.current.createProposal({
          ...mockProposal,
          id: undefined,
        });
      });

      act(() => {
        result.current.setActiveProposal(proposalId);
      });

      expect(result.current.activeProposalId).toBe(proposalId);
      expect(result.current.getActiveProposal()?.id).toBe(proposalId);
    });
  });

  describe('Section Management', () => {
    let proposalId: string = '';

    beforeEach(() => {
      const { result } = renderHook(() => useProposalStore());
      act(() => {
        proposalId = result.current.createProposal({
          ...mockProposal,
          id: undefined,
        });
      });
    });

    it('should add a section', () => {
      const { result } = renderHook(() => useProposalStore());
      const initialCount = result.current.getProposal(proposalId)?.sections.length || 0;

      act(() => {
        result.current.addSection(proposalId, {
          title: 'New Section',
          content: 'Test content',
          confidence: 0.85,
          sources: [],
          approvalState: ApprovalState.DRAFT,
          order: initialCount + 1,
          wordCount: 100,
        });
      });

      const proposal = result.current.getProposal(proposalId);
      expect(proposal?.sections.length).toBe(initialCount + 1);
      expect(proposal?.sections[proposal.sections.length - 1].title).toBe('New Section');
    });

    it('should update a section', () => {
      const { result } = renderHook(() => useProposalStore());
      const sectionId = result.current.getProposal(proposalId)?.sections[0].id!;

      act(() => {
        result.current.updateSection(proposalId, sectionId, {
          content: 'Updated content',
          confidence: 0.95,
        });
      });

      const section = result.current
        .getProposal(proposalId)
        ?.sections.find((s) => s.id === sectionId);
      expect(section?.content).toBe('Updated content');
      expect(section?.confidence).toBe(0.95);
    });

    it('should delete a section', () => {
      const { result } = renderHook(() => useProposalStore());
      const sectionId = result.current.getProposal(proposalId)?.sections[0].id!;
      const initialCount = result.current.getProposal(proposalId)?.sections.length || 0;

      act(() => {
        result.current.deleteSection(proposalId, sectionId);
      });

      const proposal = result.current.getProposal(proposalId);
      expect(proposal?.sections.length).toBe(initialCount - 1);
      expect(proposal?.sections.find((s) => s.id === sectionId)).toBeUndefined();
    });

    it('should approve a section', () => {
      const { result } = renderHook(() => useProposalStore());
      const sectionId = result.current.getProposal(proposalId)?.sections[0].id!;

      act(() => {
        result.current.approveSection(proposalId, sectionId, 'Looks good!');
      });

      const section = result.current
        .getProposal(proposalId)
        ?.sections.find((s) => s.id === sectionId);
      expect(section?.approvalState).toBe(ApprovalState.APPROVED);
      expect(section?.reviewerNotes).toBe('Looks good!');
    });

    it('should reject a section', () => {
      const { result } = renderHook(() => useProposalStore());
      const sectionId = result.current.getProposal(proposalId)?.sections[0].id!;

      act(() => {
        result.current.rejectSection(proposalId, sectionId, 'Needs major changes');
      });

      const section = result.current
        .getProposal(proposalId)
        ?.sections.find((s) => s.id === sectionId);
      expect(section?.approvalState).toBe(ApprovalState.REJECTED);
      expect(section?.reviewerNotes).toBe('Needs major changes');
    });

    it('should request revision for a section', () => {
      const { result } = renderHook(() => useProposalStore());
      const sectionId = result.current.getProposal(proposalId)?.sections[0].id!;

      act(() => {
        result.current.requestRevisionSection(proposalId, sectionId, 'Please clarify XYZ');
      });

      const section = result.current
        .getProposal(proposalId)
        ?.sections.find((s) => s.id === sectionId);
      expect(section?.approvalState).toBe(ApprovalState.NEEDS_REVISION);
      expect(section?.reviewerNotes).toBe('Please clarify XYZ');
    });

    it('should reorder sections', () => {
      const { result } = renderHook(() => useProposalStore());
      const sections = result.current.getProposal(proposalId)?.sections || [];
      const sectionIds = sections.map((s) => s.id);
      const reorderedIds = [...sectionIds].reverse();

      act(() => {
        result.current.reorderSections(proposalId, reorderedIds);
      });

      const reorderedSections = result.current.getProposal(proposalId)?.sections || [];
      expect(reorderedSections[0].id).toBe(reorderedIds[0]);
      expect(reorderedSections[0].order).toBe(1);
    });

    it('should recalculate overall confidence when sections change', () => {
      const { result } = renderHook(() => useProposalStore());

      act(() => {
        result.current.addSection(proposalId, {
          title: 'High Confidence Section',
          content: 'Test',
          confidence: 1.0,
          sources: [],
          approvalState: ApprovalState.DRAFT,
          order: 99,
          wordCount: 50,
        });
      });

      const proposal = result.current.getProposal(proposalId);
      expect(proposal?.overallConfidence).toBeGreaterThan(0);
      expect(proposal?.overallConfidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Question Management', () => {
    let proposalId: string = '';

    beforeEach(() => {
      const { result } = renderHook(() => useProposalStore());
      act(() => {
        proposalId = result.current.createProposal({
          ...mockProposal,
          id: undefined,
        });
      });
    });

    it('should add a question', () => {
      const { result } = renderHook(() => useProposalStore());
      const initialCount = result.current.getProposal(proposalId)?.openQuestions.length || 0;

      act(() => {
        result.current.addQuestion(proposalId, {
          question: 'What is the timeline?',
          rationale: 'Need to set expectations',
          priority: Priority.HIGH,
          relatedSectionIds: [],
        });
      });

      const proposal = result.current.getProposal(proposalId);
      expect(proposal?.openQuestions.length).toBe(initialCount + 1);
      expect(proposal?.openQuestions[proposal.openQuestions.length - 1].question).toBe(
        'What is the timeline?'
      );
    });

    it('should update a question', () => {
      const { result } = renderHook(() => useProposalStore());
      const questionId = result.current.getProposal(proposalId)?.openQuestions[0].id!;

      act(() => {
        result.current.updateQuestion(proposalId, questionId, {
          priority: Priority.LOW,
        });
      });

      const question = result.current
        .getProposal(proposalId)
        ?.openQuestions.find((q) => q.id === questionId);
      expect(question?.priority).toBe(Priority.LOW);
    });

    it('should dismiss a question', () => {
      const { result } = renderHook(() => useProposalStore());
      const questionId = result.current.getProposal(proposalId)?.openQuestions[0].id!;

      act(() => {
        result.current.dismissQuestion(proposalId, questionId);
      });

      const question = result.current
        .getProposal(proposalId)
        ?.openQuestions.find((q) => q.id === questionId);
      expect(question?.dismissed).toBe(true);
    });

    it('should resolve (delete) a question', () => {
      const { result } = renderHook(() => useProposalStore());
      const questionId = result.current.getProposal(proposalId)?.openQuestions[0].id!;
      const initialCount = result.current.getProposal(proposalId)?.openQuestions.length || 0;

      act(() => {
        result.current.resolveQuestion(proposalId, questionId);
      });

      const proposal = result.current.getProposal(proposalId);
      expect(proposal?.openQuestions.length).toBe(initialCount - 1);
      expect(proposal?.openQuestions.find((q) => q.id === questionId)).toBeUndefined();
    });
  });

  describe('Nudge Management', () => {
    let proposalId: string = '';

    beforeEach(() => {
      const { result } = renderHook(() => useProposalStore());
      act(() => {
        proposalId = result.current.createProposal({
          ...mockProposal,
          id: undefined,
        });
      });
    });

    it('should add a nudge', () => {
      const { result } = renderHook(() => useProposalStore());
      const initialCount = result.current.getProposal(proposalId)?.nudges.length || 0;

      act(() => {
        result.current.addNudge(proposalId, {
          type: NudgeType.SUGGESTION,
          message: 'Consider adding a case study',
          priority: Priority.MEDIUM,
        });
      });

      const proposal = result.current.getProposal(proposalId);
      expect(proposal?.nudges.length).toBe(initialCount + 1);
      expect(proposal?.nudges[proposal.nudges.length - 1].message).toBe(
        'Consider adding a case study'
      );
    });

    it('should update a nudge', () => {
      const { result } = renderHook(() => useProposalStore());
      const nudgeId = result.current.getProposal(proposalId)?.nudges[0].id!;

      act(() => {
        result.current.updateNudge(proposalId, nudgeId, {
          priority: Priority.LOW,
        });
      });

      const nudge = result.current.getProposal(proposalId)?.nudges.find((n) => n.id === nudgeId);
      expect(nudge?.priority).toBe(Priority.LOW);
    });

    it('should dismiss a nudge', () => {
      const { result } = renderHook(() => useProposalStore());
      const nudgeId = result.current.getProposal(proposalId)?.nudges[0].id!;

      act(() => {
        result.current.dismissNudge(proposalId, nudgeId);
      });

      const nudge = result.current.getProposal(proposalId)?.nudges.find((n) => n.id === nudgeId);
      expect(nudge?.dismissed).toBe(true);
    });

    it('should delete a nudge', () => {
      const { result } = renderHook(() => useProposalStore());
      const nudgeId = result.current.getProposal(proposalId)?.nudges[0].id!;
      const initialCount = result.current.getProposal(proposalId)?.nudges.length || 0;

      act(() => {
        result.current.deleteNudge(proposalId, nudgeId);
      });

      const proposal = result.current.getProposal(proposalId);
      expect(proposal?.nudges.length).toBe(initialCount - 1);
      expect(proposal?.nudges.find((n) => n.id === nudgeId)).toBeUndefined();
    });

    it('should clear expired nudges', () => {
      const { result } = renderHook(() => useProposalStore());

      // Add a nudge that expired yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      act(() => {
        result.current.addNudge(proposalId, {
          type: NudgeType.REMINDER,
          message: 'Expired nudge',
          priority: Priority.HIGH,
          expiresAt: yesterday,
        });
      });

      const beforeCount = result.current.getProposal(proposalId)?.nudges.length || 0;

      act(() => {
        result.current.clearExpiredNudges(proposalId);
      });

      const afterCount = result.current.getProposal(proposalId)?.nudges.length || 0;
      expect(afterCount).toBeLessThan(beforeCount);
    });
  });

  describe('Selectors', () => {
    let proposalId: string = '';

    beforeEach(() => {
      const { result } = renderHook(() => useProposalStore());
      act(() => {
        proposalId = result.current.createProposal({
          ...mockProposal,
          id: undefined,
        });
      });
    });

    it('should get proposals by status', () => {
      const drafts = proposalSelectors.getProposalsByStatus(ProposalStatus.DRAFT);
      const inReview = proposalSelectors.getProposalsByStatus(ProposalStatus.IN_REVIEW);

      expect(inReview.length).toBeGreaterThan(0);
      expect(inReview.every((p) => p.status === ProposalStatus.IN_REVIEW)).toBe(true);
    });

    it('should get sections by approval state', () => {
      const approved = proposalSelectors.getSectionsByApprovalState(
        proposalId,
        ApprovalState.APPROVED
      );
      expect(approved.every((s) => s.approvalState === ApprovalState.APPROVED)).toBe(true);
    });

    it('should get active questions', () => {
      const activeQuestions = proposalSelectors.getActiveQuestions(proposalId);
      expect(activeQuestions.every((q) => !q.dismissed)).toBe(true);
    });

    it('should get active questions by priority', () => {
      const highPriorityQuestions = proposalSelectors.getActiveQuestions(
        proposalId,
        Priority.HIGH
      );
      expect(highPriorityQuestions.every((q) => q.priority === Priority.HIGH)).toBe(true);
    });

    it('should get active nudges', () => {
      const activeNudges = proposalSelectors.getActiveNudges(proposalId);
      expect(activeNudges.every((n) => !n.dismissed)).toBe(true);
    });

    it('should calculate completion percentage', () => {
      const completion = proposalSelectors.getCompletionPercentage(proposalId);
      expect(completion).toBeGreaterThanOrEqual(0);
      expect(completion).toBeLessThanOrEqual(100);
    });

    it('should get high priority items', () => {
      const { questions, nudges } = proposalSelectors.getHighPriorityItems(proposalId);
      expect(questions.every((q) => q.priority === Priority.HIGH && !q.dismissed)).toBe(true);
      expect(nudges.every((n) => n.priority === Priority.HIGH && !n.dismissed)).toBe(true);
    });
  });

  describe('Bulk Operations', () => {
    it('should import a proposal', () => {
      const { result } = renderHook(() => useProposalStore());

      act(() => {
        result.current.importProposal(mockProposal);
      });

      const imported = result.current.getProposal(mockProposal.id);
      expect(imported).toBeDefined();
      expect(imported?.id).toBe(mockProposal.id);
    });

    it('should clear all data', () => {
      const { result } = renderHook(() => useProposalStore());

      act(() => {
        result.current.createProposal({ ...mockProposal, id: undefined });
        result.current.createProposal({ ...mockProposal, id: undefined });
      });

      expect(result.current.getAllProposals().length).toBeGreaterThan(0);

      act(() => {
        result.current.clearAllData();
      });

      expect(result.current.getAllProposals().length).toBe(0);
      expect(result.current.activeProposalId).toBeNull();
    });
  });
});

