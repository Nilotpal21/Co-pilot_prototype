/**
 * Tests for intent parser
 */

import { parseIntent, generateClientId, getDefaultDueDate } from './intentParser';

describe('intentParser', () => {
  describe('parseIntent', () => {
    it('should parse "create proposal for" intent', () => {
      const result = parseIntent('Create proposal for Acme Corp');
      
      expect(result.type).toBe('create_proposal');
      expect(result.params.clientName).toBe('acme corp');
      expect(result.params.opportunityValue).toBe(1000000); // Default $1M
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should parse "create proposal for" with value', () => {
      const result = parseIntent('Create proposal for TechCo worth $500K');
      
      expect(result.type).toBe('create_proposal');
      expect(result.params.clientName).toBe('techco');
      expect(result.params.opportunityValue).toBe(500000);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should parse "create proposal for" with value without dollar sign', () => {
      const result = parseIntent('Create proposal for GlobalTech worth 2,500k');
      
      expect(result.type).toBe('create_proposal');
      expect(result.params.clientName).toBe('globaltech');
      expect(result.params.opportunityValue).toBe(2500000);
    });

    it('should handle "create a proposal for" variant', () => {
      const result = parseIntent('create a proposal for Contoso Manufacturing');
      
      expect(result.type).toBe('create_proposal');
      expect(result.params.clientName).toBe('contoso manufacturing');
    });

    it('should parse "view proposal for" intent', () => {
      const result = parseIntent('View proposal for Acme Corp');
      
      expect(result.type).toBe('view_proposal');
      expect(result.params.query).toBe('acme corp');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should parse "show proposal" variants', () => {
      const variants = [
        'show proposal for Acme',
        'open proposal for Acme',
        'display proposal for Acme',
        'show the proposal for Acme',
      ];

      variants.forEach((variant) => {
        const result = parseIntent(variant);
        expect(result.type).toBe('view_proposal');
      });
    });

    it('should parse "list proposals" intent', () => {
      const result = parseIntent('List all proposals');
      
      expect(result.type).toBe('list_proposals');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should parse "list proposals" variants', () => {
      const variants = [
        'list proposals',
        'show proposals',
        'display my proposals',
        'list all my proposals',
      ];

      variants.forEach((variant) => {
        const result = parseIntent(variant);
        expect(result.type).toBe('list_proposals');
      });
    });

    it('should return unknown for unrecognized input', () => {
      const result = parseIntent('Tell me a joke');
      
      expect(result.type).toBe('unknown');
      expect(result.confidence).toBe(0);
    });

    it('should be case insensitive', () => {
      const variants = [
        'CREATE PROPOSAL FOR ACME',
        'Create Proposal For Acme',
        'create proposal for acme',
      ];

      variants.forEach((variant) => {
        const result = parseIntent(variant);
        expect(result.type).toBe('create_proposal');
      });
    });
  });

  describe('generateClientId', () => {
    it('should generate CRM ID from client name', () => {
      expect(generateClientId('Acme Corp')).toBe('CRM-acme-corp');
      expect(generateClientId('TechCo Inc.')).toBe('CRM-techco-inc');
      expect(generateClientId('Global-Tech')).toBe('CRM-global-tech');
    });

    it('should handle special characters', () => {
      expect(generateClientId('O\'Reilly & Associates')).toBe('CRM-o-reilly-associates');
      expect(generateClientId('Smith & Sons, LLC')).toBe('CRM-smith-sons-llc');
    });

    it('should handle multiple spaces', () => {
      expect(generateClientId('Acme   Corp')).toBe('CRM-acme-corp');
    });
  });

  describe('getDefaultDueDate', () => {
    it('should return date 30 days in future', () => {
      const dueDate = getDefaultDueDate();
      const today = new Date();
      const expected = new Date(today);
      expected.setDate(expected.getDate() + 30);

      // Compare dates (ignoring time)
      expect(dueDate.toDateString()).toBe(expected.toDateString());
    });

    it('should return a Date object', () => {
      const dueDate = getDefaultDueDate();
      expect(dueDate instanceof Date).toBe(true);
    });
  });
});

