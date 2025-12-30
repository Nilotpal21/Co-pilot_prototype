/**
 * Copilot Chat Panel with intent parsing and store actions
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Input,
  Text,
  Avatar,
  Card,
  Spinner,
} from '@fluentui/react-components';
import {
  Send24Regular,
  Sparkle24Filled,
} from '@fluentui/react-icons';
import { useProposalStore } from '../state/useProposalStore';
import { ProposalStatus, ApprovalState } from '../types';
import { parseIntent, generateClientId, getDefaultDueDate } from '../utils/intentParser';
import ProposalOutlineCard from './ProposalOutlineCard';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  proposalId?: string; // For messages with proposal previews
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  header: {
    padding: tokens.spacingVerticalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  transcript: {
    flex: 1,
    overflow: 'auto',
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  messageGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'flex-start',
  },
  messageGroupUser: {
    flexDirection: 'row-reverse',
  },
  messageContent: {
    flex: 1,
    maxWidth: '70%',
  },
  messageCard: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  messageCardUser: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalXS,
  },
  inputArea: {
    padding: tokens.spacingVerticalL,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  input: {
    flex: 1,
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

// Helper component to render proposal outline
const ProposalOutlinePreview: React.FC<{
  proposalId: string;
  onAddMessage: (role: 'user' | 'assistant', content: string) => void;
}> = ({ proposalId, onAddMessage }) => {
  const proposal = useProposalStore((s) => s.getProposal(proposalId));

  if (!proposal) return null;

  return (
    <ProposalOutlineCard
      proposal={proposal}
      onViewDetails={() => {
        onAddMessage('assistant', `Opening full details for ${proposal.clientName}...`);
      }}
      onEditSections={() => {
        onAddMessage('assistant', `Opening editor for ${proposal.title}...`);
      }}
    />
  );
};

export const CopilotChatPanel: React.FC = () => {
  const styles = useStyles();
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m your Proposal Copilot. You can ask me to:\n\n• Create proposal for [Client Name]\n• List all proposals\n• View proposal for [Client Name]',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const transcriptEndRef = React.useRef<HTMLDivElement>(null);

  const createProposal = useProposalStore((s) => s.createProposal);
  const setActiveProposal = useProposalStore((s) => s.setActiveProposal);
  const getAllProposals = useProposalStore((s) => s.getAllProposals);

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (transcriptEndRef.current && typeof transcriptEndRef.current.scrollIntoView === 'function') {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const addMessage = React.useCallback((role: 'user' | 'assistant', content: string, proposalId?: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        role,
        content,
        timestamp: new Date(),
        proposalId,
      },
    ]);
  }, []);

  const handleCreateProposal = React.useCallback(
    (clientName: string, opportunityValue: number) => {
      const now = new Date();
      // Capitalize client name for display
      const displayClientName = clientName
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const clientId = generateClientId(displayClientName);

      // Create proposal
      const proposalId = createProposal({
        title: `${displayClientName} - Proposal`,
        clientName: displayClientName,
        clientId,
        opportunityValue,
        status: ProposalStatus.DRAFT,
        sections: [
          {
            id: '',
            title: 'Executive Summary',
            content: `This proposal outlines our recommended approach for ${displayClientName}. We understand your requirements and have designed a solution that addresses your key business objectives.`,
            confidence: 0.6,
            sources: [],
            approvalState: ApprovalState.DRAFT,
            order: 1,
            lastModified: now,
            modifiedBy: 'AI Copilot',
            wordCount: 28,
          },
        ],
        openQuestions: [],
        nudges: [],
        createdAt: now,
        lastModified: now,
        dueDate: getDefaultDueDate(),
        owner: {
          id: 'user-1',
          name: 'Current User',
          email: 'user@company.com',
        },
        overallConfidence: 0.6,
        totalWordCount: 28,
      });

      // Set as active
      setActiveProposal(proposalId);

      // Add response with proposal preview
      addMessage(
        'assistant',
        `✅ I've created a new proposal for **${displayClientName}** worth $${(opportunityValue / 1000).toFixed(0)}K. Here's the outline:`,
        proposalId
      );

      console.log('✅ Proposal created via chat:', proposalId);
      return proposalId;
    },
    [createProposal, setActiveProposal, addMessage]
  );

  const handleListProposals = React.useCallback(() => {
    const proposals = getAllProposals();

    if (proposals.length === 0) {
      addMessage('assistant', 'You don\'t have any proposals yet. Try creating one with "Create proposal for [Client Name]"');
      return;
    }

    const list = proposals
      .map((p, idx) => `${idx + 1}. **${p.clientName}** - ${p.title} ($${(p.opportunityValue / 1000).toFixed(0)}K, ${p.status})`)
      .join('\n');

    addMessage('assistant', `Here are your proposals:\n\n${list}`);
  }, [getAllProposals, addMessage]);

  const handleViewProposal = React.useCallback(
    (query: string) => {
      const proposals = getAllProposals();
      const found = proposals.find((p) =>
        p.clientName.toLowerCase().includes(query.toLowerCase())
      );

      if (!found) {
        addMessage('assistant', `I couldn't find a proposal matching "${query}". Try "List all proposals" to see what's available.`);
        return;
      }

      addMessage('assistant', `Here's the proposal for **${found.clientName}**:`, found.id);
    },
    [getAllProposals, addMessage]
  );

  const processUserMessage = React.useCallback(
    async (input: string) => {
      // Add user message
      addMessage('user', input);
      setIsProcessing(true);

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Parse intent
      const intent = parseIntent(input);

      switch (intent.type) {
        case 'create_proposal':
          handleCreateProposal(
            intent.params.clientName as string,
            intent.params.opportunityValue as number
          );
          break;

        case 'list_proposals':
          handleListProposals();
          break;

        case 'view_proposal':
          handleViewProposal(intent.params.query as string);
          break;

        default:
          addMessage(
            'assistant',
            'I didn\'t quite understand that. Try:\n\n• "Create proposal for Acme Corp"\n• "Create proposal for TechCo worth $500K"\n• "List all proposals"\n• "View proposal for Acme"'
          );
      }

      setIsProcessing(false);
    },
    [addMessage, handleCreateProposal, handleListProposals, handleViewProposal]
  );

  const handleSend = React.useCallback(() => {
    if (!inputValue.trim() || isProcessing) return;

    processUserMessage(inputValue);
    setInputValue('');
  }, [inputValue, isProcessing, processUserMessage]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Sparkle24Filled style={{ color: tokens.colorBrandForeground1 }} />
        <Text weight="semibold" size={400}>
          Proposal Copilot
        </Text>
      </div>

      {/* Transcript */}
      <div className={styles.transcript}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageGroup} ${
              message.role === 'user' ? styles.messageGroupUser : ''
            }`}
          >
            <Avatar
              name={message.role === 'user' ? 'You' : 'Copilot'}
              color={message.role === 'user' ? 'brand' : 'colorful'}
              icon={message.role === 'assistant' ? <Sparkle24Filled /> : undefined}
            />
            <div className={styles.messageContent}>
              <div className={styles.messageHeader}>
                <Text weight="semibold" size={200}>
                  {message.role === 'user' ? 'You' : 'Copilot'}
                </Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </div>
              <Card
                className={`${styles.messageCard} ${
                  message.role === 'user' ? styles.messageCardUser : ''
                }`}
              >
                <Text style={{ whiteSpace: 'pre-wrap' }}>{message.content}</Text>
              </Card>

              {/* Show proposal outline if proposalId exists */}
              {message.proposalId && (
                <ProposalOutlinePreview
                  proposalId={message.proposalId}
                  onAddMessage={addMessage}
                />
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className={styles.messageGroup}>
            <Avatar name="Copilot" color="colorful" icon={<Sparkle24Filled />} />
            <div className={styles.loadingContainer}>
              <Spinner size="tiny" />
              <Text size={200}>Thinking...</Text>
            </div>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <Input
          className={styles.input}
          placeholder="Ask Copilot to create a proposal..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
        />
        <Button
          appearance="primary"
          icon={<Send24Regular />}
          onClick={handleSend}
          disabled={!inputValue.trim() || isProcessing}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default CopilotChatPanel;

