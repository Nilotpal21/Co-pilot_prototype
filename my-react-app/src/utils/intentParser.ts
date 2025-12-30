/**
 * Simple intent parser using string matching
 */

export interface ParsedIntent {
  type: 'create_proposal' | 'view_proposal' | 'list_proposals' | 'unknown';
  params: Record<string, string | number>;
  confidence: number;
}

/**
 * Parse user input to extract intent and parameters
 */
export function parseIntent(input: string): ParsedIntent {
  const normalizedInput = input.toLowerCase().trim();

  // Create proposal intent
  const createProposalMatch = normalizedInput.match(
    /create\s+(?:a\s+)?proposal\s+for\s+(.+?)(?:\s+worth\s+\$?([\d,]+)k?)?$/i
  );
  if (createProposalMatch) {
    const clientName = createProposalMatch[1].trim();
    const valueMatch = createProposalMatch[2];
    const opportunityValue = valueMatch 
      ? parseInt(valueMatch.replace(/,/g, '')) * 1000 
      : 1000000; // Default $1M

    return {
      type: 'create_proposal',
      params: {
        clientName,
        opportunityValue,
      },
      confidence: 0.9,
    };
  }

  // View proposal intent
  const viewProposalMatch = normalizedInput.match(
    /(?:show|view|open|display)\s+(?:the\s+)?proposal\s+(?:for\s+)?(.+)/i
  );
  if (viewProposalMatch) {
    return {
      type: 'view_proposal',
      params: {
        query: viewProposalMatch[1].trim(),
      },
      confidence: 0.85,
    };
  }

  // List proposals intent
  const listMatch = normalizedInput.match(
    /(?:list|show|display)\s+(?:all\s+)?(?:my\s+)?proposals?/i
  );
  if (listMatch) {
    return {
      type: 'list_proposals',
      params: {},
      confidence: 0.9,
    };
  }

  return {
    type: 'unknown',
    params: {},
    confidence: 0,
  };
}

/**
 * Generate client ID from client name
 */
export function generateClientId(clientName: string): string {
  return `CRM-${clientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

/**
 * Calculate default due date (30 days from now)
 */
export function getDefaultDueDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
}

