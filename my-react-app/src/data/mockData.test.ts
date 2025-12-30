/**
 * Tests for mock data and type safety
 */

import {
  mockProposal,
  mockSources,
  mockSections,
  mockOpenQuestions,
  mockNudges,
  getSectionsByApprovalState,
  getHighPriorityItems,
  getCompletionPercentage,
} from './mockData';
import {
  ProposalStatus,
  ApprovalState,
  Priority,
  SourceType,
  NudgeType,
} from '../types';

describe('Mock Data', () => {
  describe('mockProposal', () => {
    it('should have all required fields', () => {
      expect(mockProposal.id).toBeTruthy();
      expect(mockProposal.title).toBeTruthy();
      expect(mockProposal.clientName).toBe('Contoso Manufacturing');
      expect(mockProposal.opportunityValue).toBe(2400000);
      expect(mockProposal.status).toBe(ProposalStatus.IN_REVIEW);
    });

    it('should have sections with correct structure', () => {
      expect(mockProposal.sections).toHaveLength(5);
      mockProposal.sections.forEach((section) => {
        expect(section.id).toBeTruthy();
        expect(section.title).toBeTruthy();
        expect(section.content).toBeTruthy();
        expect(section.confidence).toBeGreaterThanOrEqual(0);
        expect(section.confidence).toBeLessThanOrEqual(1);
        expect(Array.isArray(section.sources)).toBe(true);
      });
    });

    it('should have open questions', () => {
      expect(mockProposal.openQuestions.length).toBeGreaterThan(0);
      mockProposal.openQuestions.forEach((question) => {
        expect(question.id).toBeTruthy();
        expect(question.question).toBeTruthy();
        expect(question.priority).toBeDefined();
      });
    });

    it('should have nudges', () => {
      expect(mockProposal.nudges.length).toBeGreaterThan(0);
      mockProposal.nudges.forEach((nudge) => {
        expect(nudge.id).toBeTruthy();
        expect(nudge.type).toBeDefined();
        expect(nudge.message).toBeTruthy();
      });
    });

    it('should have valid owner information', () => {
      expect(mockProposal.owner.id).toBeTruthy();
      expect(mockProposal.owner.name).toBe('Jennifer Park');
      expect(mockProposal.owner.email).toBeTruthy();
    });

    it('should have stakeholders', () => {
      expect(mockProposal.stakeholders).toBeDefined();
      expect(mockProposal.stakeholders!.length).toBeGreaterThan(0);
    });
  });

  describe('mockSources', () => {
    it('should have valid sources', () => {
      expect(mockSources.length).toBeGreaterThan(0);
      mockSources.forEach((source) => {
        expect(source.id).toBeTruthy();
        expect(Object.values(SourceType)).toContain(source.type);
        expect(source.relevanceScore).toBeGreaterThanOrEqual(0);
        expect(source.relevanceScore).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Helper Functions', () => {
    it('getSectionsByApprovalState should filter correctly', () => {
      const pendingSections = getSectionsByApprovalState(
        mockProposal,
        ApprovalState.PENDING
      );
      const approvedSections = getSectionsByApprovalState(
        mockProposal,
        ApprovalState.APPROVED
      );

      expect(pendingSections.every((s) => s.approvalState === ApprovalState.PENDING)).toBe(
        true
      );
      expect(approvedSections.every((s) => s.approvalState === ApprovalState.APPROVED)).toBe(
        true
      );
    });

    it('getHighPriorityItems should return only high priority items', () => {
      const highPriority = getHighPriorityItems(mockProposal);

      expect(
        highPriority.questions.every(
          (q) => q.priority === Priority.HIGH && !q.dismissed
        )
      ).toBe(true);
      expect(
        highPriority.nudges.every(
          (n) => n.priority === Priority.HIGH && !n.dismissed
        )
      ).toBe(true);
    });

    it('getCompletionPercentage should calculate correctly', () => {
      const percentage = getCompletionPercentage(mockProposal);
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);

      const approvedCount = getSectionsByApprovalState(
        mockProposal,
        ApprovalState.APPROVED
      ).length;
      const expectedPercentage = Math.round(
        (approvedCount / mockProposal.sections.length) * 100
      );
      expect(percentage).toBe(expectedPercentage);
    });
  });

  describe('Data Integrity', () => {
    it('section sources should reference valid source IDs', () => {
      const allSourceIds = mockSources.map((s) => s.id);
      mockSections.forEach((section) => {
        section.sources.forEach((source) => {
          expect(allSourceIds).toContain(source.id);
        });
      });
    });

    it('total word count should match sum of section word counts', () => {
      const calculatedWordCount = mockSections.reduce(
        (sum, section) => sum + section.wordCount,
        0
      );
      expect(mockProposal.totalWordCount).toBe(calculatedWordCount);
    });

    it('nudges with relatedSectionId should reference valid sections', () => {
      const sectionIds = mockSections.map((s) => s.id);
      mockNudges.forEach((nudge) => {
        if (nudge.relatedSectionId) {
          expect(sectionIds).toContain(nudge.relatedSectionId);
        }
      });
    });

    it('questions with relatedSectionIds should reference valid sections', () => {
      const sectionIds = mockSections.map((s) => s.id);
      mockOpenQuestions.forEach((question) => {
        question.relatedSectionIds.forEach((sectionId) => {
          expect(sectionIds).toContain(sectionId);
        });
      });
    });
  });
});

