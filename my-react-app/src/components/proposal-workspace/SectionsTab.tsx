import * as React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { Proposal } from '../../types';
import SectionCard from './SectionCard';

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', ...shorthands.gap(tokens.spacingVerticalM) },
});

export function SectionsTab(props: { proposal: Proposal }) {
  const styles = useStyles();
  const { proposal } = props;

  const sections = React.useMemo(() => {
    return proposal.sections.slice().sort((a, b) => a.order - b.order);
  }, [proposal.sections]);

  return (
    <div className={styles.root}>
      {sections.map((section) => (
        <SectionCard key={section.id} proposalId={proposal.id} section={section} variant="default" />
      ))}
    </div>
  );
}


