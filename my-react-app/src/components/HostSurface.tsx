import * as React from 'react';
import {
  Body1,
  Card,
  CardHeader,
  Caption1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { HostSurfaceId } from '../state/useAppStore';

const useStyles = makeStyles({
  root: {
    height: '100%',
    overflow: 'auto',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
  },
  card: {
    maxWidth: '100%',
  },
  surfaceBody: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
  },
});

function surfaceTitle(surface: HostSurfaceId) {
  switch (surface) {
    case 'outlook':
      return 'Outlook';
    case 'word':
      return 'Word';
    case 'teams':
      return 'Teams';
    default: {
      const _exhaustive: never = surface;
      return _exhaustive;
    }
  }
}

export function HostSurface(props: { surface: HostSurfaceId }) {
  const styles = useStyles();

  const title = surfaceTitle(props.surface);
  const subtitle = `Simulated host surface: ${title}`;

  return (
    <div className={styles.root} aria-label="Host Surface">
      <Card className={styles.card}>
        <CardHeader header={<Body1 as="h2">{title}</Body1>} description={<Caption1>{subtitle}</Caption1>} />
        <div className={styles.surfaceBody}>
          {props.surface === 'outlook' && (
            <>
              <Body1>
                Inbox view placeholder. Imagine this surface providing selected email context + actions (reply, summarize,
                triage).
              </Body1>
              <Caption1>Context: Selected message, thread, attachments.</Caption1>
            </>
          )}

          {props.surface === 'word' && (
            <>
              <Body1>
                Document editor placeholder. Imagine this surface providing selection context (paragraph, section) and
                allowing insert/replace actions.
              </Body1>
              <Caption1>Context: Cursor position, selection, document outline.</Caption1>
            </>
          )}

          {props.surface === 'teams' && (
            <>
              <Body1>
                Chat/channel placeholder. Imagine this surface providing conversation context and allowing “post message”
                or “create task” actions.
              </Body1>
              <Caption1>Context: Channel, thread, participants.</Caption1>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}


