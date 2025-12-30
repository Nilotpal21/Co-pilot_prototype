/**
 * Mock data for Sales Proposal Agent UI
 */

import {
  Proposal,
  ProposalSection,
  Source,
  OpenQuestion,
  Nudge,
  ProposalStatus,
  ApprovalState,
  SourceType,
  Priority,
  NudgeType,
} from '../types';

/**
 * Mock sources
 */
export const mockSources: Source[] = [
  {
    id: 'src-001',
    type: SourceType.CRM,
    title: 'Contoso Manufacturing - Opportunity Record',
    reference: 'crm://opportunities/OPP-2024-1847',
    excerpt: 'Enterprise cloud migration, 5-year deal, $2.4M ARR. Primary contact: Sarah Chen, CTO. Pain points: legacy on-prem infrastructure, security concerns, scaling issues.',
    lastUpdated: new Date('2024-12-15T10:30:00Z'),
    relevanceScore: 0.95,
    author: 'John Miller',
  },
  {
    id: 'src-002',
    type: SourceType.MEETING_NOTES,
    title: 'Discovery Call with Contoso CTO - Dec 12, 2024',
    reference: 'meetings://notes/MTG-20241212-001',
    excerpt: 'Key requirements: 99.9% uptime SLA, HIPAA compliance for patient data, multi-region deployment (US East, EU West), integration with existing SAP ERP system.',
    lastUpdated: new Date('2024-12-12T15:45:00Z'),
    relevanceScore: 0.92,
    author: 'Jennifer Park',
  },
  {
    id: 'src-003',
    type: SourceType.PREVIOUS_PROPOSAL,
    title: 'GlobalTech Industries - Cloud Migration Proposal (Won)',
    reference: 'proposals://2024/Q3/PROP-2024-0782',
    excerpt: 'Similar manufacturing client, 3-phase migration approach, emphasized security and compliance, competitive pricing with volume discounts.',
    lastUpdated: new Date('2024-09-20T09:00:00Z'),
    relevanceScore: 0.88,
    author: 'Sales Engineering Team',
  },
  {
    id: 'src-004',
    type: SourceType.SALES_PLAYBOOK,
    title: 'Enterprise Manufacturing - Solution Framework',
    reference: 'playbook://verticals/manufacturing/enterprise',
    excerpt: 'Best practices for manufacturing sector: highlight IoT integration, predictive maintenance, supply chain optimization. Address data residency and compliance.',
    lastUpdated: new Date('2024-11-01T12:00:00Z'),
    relevanceScore: 0.85,
    author: 'Sales Enablement',
  },
  {
    id: 'src-005',
    type: SourceType.CUSTOMER_WEBSITE,
    title: 'Contoso Manufacturing - About Us',
    reference: 'https://contosomanufacturing.com/about',
    excerpt: 'Leading medical device manufacturer, 50+ years in business, 12 global manufacturing facilities, ISO 13485 certified, revenue $850M annually.',
    lastUpdated: new Date('2024-12-10T08:00:00Z'),
    relevanceScore: 0.78,
    author: 'Web Crawler',
  },
  {
    id: 'src-006',
    type: SourceType.DOCUMENT,
    title: 'Contoso IT Infrastructure Assessment',
    reference: 'documents://assessments/contoso-it-assessment.pdf',
    excerpt: 'Current environment: 200+ VMs on VMware, 50TB data, mixed Windows/Linux workloads, aging hardware (avg 7 years old), annual maintenance cost $450K.',
    lastUpdated: new Date('2024-12-08T14:20:00Z'),
    relevanceScore: 0.91,
    author: 'Technical Assessment Team',
  },
  {
    id: 'src-007',
    type: SourceType.EMAIL,
    title: 'RE: Security Requirements from CISO',
    reference: 'email://threads/THREAD-20241210-445',
    excerpt: 'Must meet: SOC 2 Type II, HIPAA, GDPR. Require encryption at rest and in transit, MFA for all access, quarterly penetration testing, 24/7 SOC monitoring.',
    lastUpdated: new Date('2024-12-10T16:55:00Z'),
    relevanceScore: 0.89,
    author: 'David Kumar (CISO, Contoso)',
  },
];

/**
 * Mock proposal sections
 */
export const mockSections: ProposalSection[] = [
  {
    id: 'sec-001',
    title: 'Executive Summary',
    content: `Contoso Manufacturing is at a pivotal moment in its digital transformation journey. This proposal outlines a comprehensive cloud migration strategy designed to modernize your IT infrastructure, enhance operational efficiency, and position your organization for sustainable growth.

**The Challenge:** Your current on-premises infrastructure is constraining innovation, with aging hardware (7+ years old), rising maintenance costs ($450K annually), and limited scalability to support new IoT and analytics initiatives.

**Our Solution:** A phased, risk-mitigated migration to Azure cloud that delivers:
• 40% reduction in infrastructure costs over 3 years
• 99.95% uptime SLA with multi-region redundancy
• Full HIPAA, SOC 2 Type II, and GDPR compliance
• Seamless integration with existing SAP ERP system
• Foundation for AI-powered predictive maintenance and supply chain optimization

**Investment:** $2.4M over 5 years (ARR), with projected 3-year ROI of 285%.

This proposal reflects deep understanding of your requirements gathered through discovery sessions with your leadership team, technical assessments, and alignment with industry best practices for medical device manufacturers.`,
    confidence: 0.88,
    sources: [mockSources[0], mockSources[1], mockSources[2]],
    approvalState: ApprovalState.PENDING,
    order: 1,
    lastModified: new Date('2024-12-20T11:30:00Z'),
    modifiedBy: 'AI Copilot',
    wordCount: 187,
  },
  {
    id: 'sec-002',
    title: 'Understanding Your Business',
    content: `Contoso Manufacturing has established itself as a leader in medical device manufacturing over the past 50+ years, operating 12 manufacturing facilities globally and maintaining ISO 13485 certification. With annual revenue of $850M, you serve healthcare providers worldwide with innovative surgical instruments, diagnostic equipment, and patient monitoring systems.

**Current IT Environment:**
Your infrastructure assessment reveals a hybrid environment with 200+ virtual machines on VMware, managing 50TB of critical data across mixed Windows and Linux workloads. While this infrastructure has served you well, the average hardware age of 7 years presents increasing risks of downtime, security vulnerabilities, and inability to support modern applications.

**Strategic Imperatives:**
Based on our discovery sessions with Sarah Chen (CTO) and your leadership team, we understand your key priorities:

1. **Regulatory Compliance:** As a medical device manufacturer, maintaining HIPAA compliance for patient data and meeting GDPR requirements for European operations is non-negotiable.

2. **Operational Resilience:** Your manufacturing operations require 24/7 availability, with any downtime directly impacting production schedules and patient care.

3. **Innovation Enablement:** You're planning to expand IoT sensor deployment across manufacturing lines and implement AI-driven quality control—initiatives constrained by current infrastructure.

4. **Cost Optimization:** Annual maintenance costs of $450K for aging hardware represent significant capital that could be redirected toward innovation.`,
    confidence: 0.91,
    sources: [mockSources[0], mockSources[1], mockSources[4], mockSources[5]],
    approvalState: ApprovalState.APPROVED,
    order: 2,
    lastModified: new Date('2024-12-19T14:20:00Z'),
    modifiedBy: 'Jennifer Park',
    reviewerNotes: 'Excellent customer understanding. Approved.',
    wordCount: 234,
  },
  {
    id: 'sec-003',
    title: 'Proposed Solution Architecture',
    content: `Our Azure cloud solution is architected specifically for medical device manufacturers requiring enterprise-grade security, compliance, and performance.

**Core Infrastructure:**
• Multi-region deployment (US East 2, West Europe) ensuring <50ms latency for global operations
• Azure Virtual Machines optimized for your SAP ERP workload (E-series compute)
• Premium SSD storage with automatic geo-replication for 50TB+ data
• Azure Site Recovery for disaster recovery with 4-hour RTO, 15-minute RPO
• ExpressRoute dedicated connectivity (10 Gbps) for secure, low-latency hybrid access

**Security & Compliance:**
• Azure Security Center with 24/7 threat monitoring and automatic incident response
• Data encryption at rest (AES-256) and in transit (TLS 1.3)
• Azure Active Directory with MFA, conditional access, and privileged identity management
• Dedicated HIPAA-compliant Azure environment with Business Associate Agreement
• Quarterly penetration testing and compliance audits

**Integration & Extensibility:**
• Native integration with existing SAP ERP via Azure Logic Apps
• API gateway for future IoT sensor integration (10,000+ devices)
• Azure Machine Learning platform ready for predictive maintenance initiatives
• DevOps pipeline with Azure DevOps for continuous deployment

**Management & Monitoring:**
• Azure Monitor with custom dashboards for real-time visibility
• Automated backup with 30-day retention, 7-year archive for compliance
• Cost management tools with budget alerts and optimization recommendations
• 24/7 Azure support with 1-hour response time for critical issues`,
    confidence: 0.76,
    sources: [mockSources[1], mockSources[5], mockSources[6], mockSources[3]],
    approvalState: ApprovalState.NEEDS_REVISION,
    order: 3,
    lastModified: new Date('2024-12-20T09:45:00Z'),
    modifiedBy: 'AI Copilot',
    reviewerNotes: 'Need to validate specific VM sizing with technical team. Also verify ExpressRoute pricing.',
    wordCount: 245,
  },
  {
    id: 'sec-004',
    title: 'Migration Approach & Timeline',
    content: `We propose a three-phase migration strategy that minimizes risk and ensures business continuity:

**Phase 1: Foundation & Pilot (Months 1-3)**
• Azure landing zone setup with networking, security, and governance
• ExpressRoute connectivity establishment
• Migration of 2-3 non-critical workloads (development environments)
• Team training and runbook development
• Success criteria: Zero production impact, team readiness confirmed

**Phase 2: Core Workloads (Months 4-8)**
• SAP ERP migration using Azure Site Recovery (planned maintenance window)
• Database migration with Azure Database Migration Service
• File server and storage migration (50TB data)
• User acceptance testing and performance validation
• Success criteria: SAP performance meets baseline, all integrations validated

**Phase 3: Optimization & Scaling (Months 9-12)**
• Remaining workload migration
• Performance tuning and cost optimization
• IoT platform deployment and sensor integration
• Knowledge transfer and operational handoff
• Success criteria: All workloads migrated, operations team autonomous

**Risk Mitigation:**
• Comprehensive backup before each migration wave
• Rollback procedures tested and documented
• Weekend/off-hours migration windows for critical systems
• Dedicated war room support during cutover events`,
    confidence: 0.82,
    sources: [mockSources[2], mockSources[3], mockSources[5]],
    approvalState: ApprovalState.DRAFT,
    order: 4,
    lastModified: new Date('2024-12-20T10:15:00Z'),
    modifiedBy: 'AI Copilot',
    wordCount: 214,
  },
  {
    id: 'sec-005',
    title: 'Investment & ROI',
    content: `**Total Investment:** $2.4M over 5 years ($480K annual recurring)

**Year 1 Breakdown:**
• Azure infrastructure: $320K
• Migration services: $180K
• ExpressRoute: $45K
• Training & enablement: $35K
• **Total Year 1:** $580K

**Years 2-5:** $455K annually (infrastructure and support)

**Cost Savings & ROI:**
• Infrastructure maintenance: -$450K/year
• Hardware refresh avoidance: -$600K (3-year cycle)
• Reduced downtime: -$150K/year (estimated)
• Energy & facilities: -$80K/year
• **Total 3-year savings:** $2.28M

**3-Year Net ROI:** 285%
**Payback Period:** 18 months

**Beyond Cost Savings:**
• Time-to-market reduction: 40% faster deployment of new applications
• Scalability: Support for 5x data growth without infrastructure constraints
• Innovation platform: Foundation for AI, IoT, and advanced analytics initiatives

**Flexible Commercial Terms:**
• Annual payment option available
• 5% discount for 3-year prepayment commitment
• Consumption-based pricing for burst capacity`,
    confidence: 0.73,
    sources: [mockSources[0], mockSources[5]],
    approvalState: ApprovalState.DRAFT,
    order: 5,
    lastModified: new Date('2024-12-20T11:00:00Z'),
    modifiedBy: 'AI Copilot',
    wordCount: 189,
  },
];

/**
 * Mock open questions
 */
export const mockOpenQuestions: OpenQuestion[] = [
  {
    id: 'q-001',
    question: 'What is the exact VM sizing requirement for the SAP production environment?',
    rationale: 'Current proposal estimates E32s v3 instances, but precise CPU and memory requirements will impact both performance and cost significantly.',
    priority: Priority.HIGH,
    relatedSectionIds: ['sec-003', 'sec-005'],
    suggestedSources: [mockSources[5]],
    createdAt: new Date('2024-12-20T09:45:00Z'),
    dismissed: false,
    category: 'Technical',
  },
  {
    id: 'q-002',
    question: 'Has the customer confirmed the specific data residency requirements for European operations?',
    rationale: 'GDPR compliance may require all EU customer data to remain in EU regions, potentially impacting architecture and cost.',
    priority: Priority.HIGH,
    relatedSectionIds: ['sec-003'],
    suggestedSources: [mockSources[6]],
    createdAt: new Date('2024-12-20T10:00:00Z'),
    dismissed: false,
    category: 'Compliance',
  },
  {
    id: 'q-003',
    question: 'What is the customer\'s preferred maintenance window for SAP migration?',
    rationale: 'Migration timeline assumes weekend windows, but customer preferences could affect the schedule and require additional planning.',
    priority: Priority.MEDIUM,
    relatedSectionIds: ['sec-004'],
    createdAt: new Date('2024-12-20T10:30:00Z'),
    dismissed: false,
    category: 'Timeline',
  },
  {
    id: 'q-004',
    question: 'Are there any other compliance frameworks beyond HIPAA and GDPR?',
    rationale: 'Medical device manufacturers may need FDA 21 CFR Part 11 compliance or other industry-specific requirements.',
    priority: Priority.MEDIUM,
    relatedSectionIds: ['sec-003'],
    suggestedSources: [mockSources[6]],
    createdAt: new Date('2024-12-20T11:15:00Z'),
    dismissed: false,
    category: 'Compliance',
  },
  {
    id: 'q-005',
    question: 'What is the expected growth rate for data storage over the next 3 years?',
    rationale: 'Accurate growth projections will help size storage appropriately and provide more precise long-term cost estimates.',
    priority: Priority.LOW,
    relatedSectionIds: ['sec-003', 'sec-005'],
    createdAt: new Date('2024-12-20T11:20:00Z'),
    dismissed: false,
    category: 'Planning',
  },
];

/**
 * Mock nudges
 */
export const mockNudges: Nudge[] = [
  {
    id: 'n-001',
    type: NudgeType.WARNING,
    message: 'The ROI section has lower confidence (73%) due to missing detailed cost breakdown from finance. Consider requesting a formal quote from Azure pricing team.',
    actionLabel: 'Review Section',
    actionType: 'navigate',
    actionTarget: 'sec-005',
    priority: Priority.HIGH,
    relatedSectionId: 'sec-005',
    createdAt: new Date('2024-12-20T11:30:00Z'),
    dismissed: false,
  },
  {
    id: 'n-002',
    type: NudgeType.SUGGESTION,
    message: 'Similar won proposals for manufacturing clients included a "Customer Success Stories" section. This could strengthen your proposal.',
    actionLabel: 'Add Section',
    actionType: 'edit',
    priority: Priority.MEDIUM,
    createdAt: new Date('2024-12-20T11:35:00Z'),
    dismissed: false,
  },
  {
    id: 'n-003',
    type: NudgeType.REMINDER,
    message: 'Proposal due date is in 5 days (Dec 25). The Solution Architecture section still needs technical review approval.',
    actionLabel: 'Request Review',
    actionType: 'review',
    actionTarget: 'sec-003',
    priority: Priority.HIGH,
    relatedSectionId: 'sec-003',
    createdAt: new Date('2024-12-20T08:00:00Z'),
    dismissed: false,
    expiresAt: new Date('2024-12-25T23:59:59Z'),
  },
  {
    id: 'n-004',
    type: NudgeType.BEST_PRACTICE,
    message: 'For enterprise deals over $2M, including an executive sponsor from our side (VP or above) in the proposal increases win rate by 34%.',
    actionLabel: 'Add Executive Sponsor',
    actionType: 'edit',
    priority: Priority.MEDIUM,
    createdAt: new Date('2024-12-20T09:00:00Z'),
    dismissed: false,
  },
  {
    id: 'n-005',
    type: NudgeType.COMPLIANCE,
    message: 'This proposal mentions HIPAA compliance. Ensure a Business Associate Agreement (BAA) is included in the final contract terms.',
    actionLabel: 'Review Compliance',
    actionType: 'review',
    priority: Priority.HIGH,
    createdAt: new Date('2024-12-20T10:00:00Z'),
    dismissed: false,
  },
  {
    id: 'n-006',
    type: NudgeType.INFO,
    message: 'The CTO (Sarah Chen) opened this proposal 3 times in the last 24 hours. High engagement signal—consider scheduling a follow-up call.',
    actionLabel: 'Dismiss',
    actionType: 'dismiss',
    priority: Priority.LOW,
    createdAt: new Date('2024-12-20T07:30:00Z'),
    dismissed: false,
  },
];

/**
 * Main mock proposal
 */
export const mockProposal: Proposal = {
  id: 'prop-2024-1847',
  title: 'Cloud Migration & Modernization Proposal',
  clientName: 'Contoso Manufacturing',
  clientId: 'CRM-ACCT-8847',
  opportunityValue: 2400000,
  status: ProposalStatus.IN_REVIEW,
  sections: mockSections,
  openQuestions: mockOpenQuestions,
  nudges: mockNudges,
  createdAt: new Date('2024-12-15T09:00:00Z'),
  lastModified: new Date('2024-12-20T11:30:00Z'),
  dueDate: new Date('2024-12-25T17:00:00Z'),
  owner: {
    id: 'user-1234',
    name: 'Jennifer Park',
    email: 'jennifer.park@company.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=jennifer.park',
  },
  industry: 'Medical Devices Manufacturing',
  stakeholders: [
    {
      name: 'Sarah Chen',
      title: 'Chief Technology Officer',
      email: 'sarah.chen@contoso.com',
    },
    {
      name: 'Michael Rodriguez',
      title: 'VP of Operations',
      email: 'michael.rodriguez@contoso.com',
    },
    {
      name: 'David Kumar',
      title: 'Chief Information Security Officer',
      email: 'david.kumar@contoso.com',
    },
  ],
  overallConfidence: 0.82,
  totalWordCount: mockSections.reduce((sum, section) => sum + section.wordCount, 0),
};

/**
 * Helper function to get sections by approval state
 */
export function getSectionsByApprovalState(
  proposal: Proposal,
  state: ApprovalState
): ProposalSection[] {
  return proposal.sections.filter((section) => section.approvalState === state);
}

/**
 * Helper function to get high priority items
 */
export function getHighPriorityItems(proposal: Proposal): {
  questions: OpenQuestion[];
  nudges: Nudge[];
} {
  return {
    questions: proposal.openQuestions.filter(
      (q) => q.priority === Priority.HIGH && !q.dismissed
    ),
    nudges: proposal.nudges.filter(
      (n) => n.priority === Priority.HIGH && !n.dismissed
    ),
  };
}

/**
 * Helper function to calculate completion percentage
 */
export function getCompletionPercentage(proposal: Proposal): number {
  const totalSections = proposal.sections.length;
  const approvedSections = getSectionsByApprovalState(
    proposal,
    ApprovalState.APPROVED
  ).length;
  return Math.round((approvedSections / totalSections) * 100);
}

