import { Proposal } from '../../types';

export type ProposalWorkspaceTab =
  | 'overview'
  | 'sections'
  | 'questions'
  | 'approvals'
  | 'sources';

export interface ProposalWorkspaceProps {
  proposal?: Proposal;
  /** If not provided, component will use store active proposal */
  proposalId?: string;
}


