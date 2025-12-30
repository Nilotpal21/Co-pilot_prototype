import * as React from 'react';
import {
  Body1,
  Button,
  Field,
  makeStyles,
  shorthands,
  Textarea,
  Title3,
  tokens,
} from '@fluentui/react-components';
import { Send24Regular, Sparkle24Regular } from '@fluentui/react-icons';
import { useAppStore } from '../state/useAppStore';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ...shorthands.gap(tokens.spacingVerticalM),
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  headerTitle: { display: 'flex', alignItems: 'center', ...shorthands.gap(tokens.spacingHorizontalS) },
  grow: { flexGrow: 1 },
  footer: {
    display: 'flex',
    alignItems: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
});

export function CopilotPanel() {
  const styles = useStyles();
  const copilotDraft = useAppStore((s) => s.copilotDraft);
  const setCopilotDraft = useAppStore((s) => s.setCopilotDraft);

  const onSend = React.useCallback(() => {
    // Shell only: no backend wired yet.
    // Keep the input so it feels like a persistent draft.
  }, []);

  return (
    <aside className={styles.root} aria-label="Copilot Panel">
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Sparkle24Regular aria-hidden />
          <Title3>Copilot Panel</Title3>
        </div>
        <Button appearance="subtle" size="small">
          New chat
        </Button>
      </div>

      <Body1>
        This is a placeholder area for Copilot experiences. Use the tabs on the right to simulate different
        host surfaces (Outlook, Word, Teams).
      </Body1>

      <div className={styles.grow} />

      <Field label="Draft" hint="Local state via Zustand (no network calls).">
        <Textarea
          value={copilotDraft}
          onChange={(e) => setCopilotDraft(e.target.value)}
          placeholder="Ask Copilot to summarize, draft, or take an action…"
          resize="vertical"
        />
      </Field>

      <div className={styles.footer}>
        <Button icon={<Send24Regular />} appearance="primary" onClick={onSend}>
          Send
        </Button>
      </div>
    </aside>
  );
}


