/**
 * Main AppShell with Copilot Panel and Host Surfaces
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Tab,
  TabList,
  Caption1,
} from '@fluentui/react-components';
import {
  ChevronLeft24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-icons';
import { useAppStore } from '../state/useAppStore';
import CopilotPanelEnhanced from './CopilotPanelEnhanced';
import OutlookSurface from './surfaces/OutlookSurface';
import WordSurface from './surfaces/WordSurface';
import TeamsSurface from './surfaces/TeamsSurface';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  copilotPanel: {
    width: '380px',
    height: '100%',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'margin-left 0.3s ease',
  },
  copilotPanelCollapsed: {
    marginLeft: '-380px',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '60px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  toggleButton: {
    minWidth: 'auto',
  },
  tabContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  surfaceContainer: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

const AppShell: React.FC = () => {
  const styles = useStyles();
  const [isPanelCollapsed, setIsPanelCollapsed] = React.useState(false);
  const activeSurface = useAppStore((s) => s.surface);
  const setActiveSurface = useAppStore((s) => s.setSurface);

  const handleTabSelect = React.useCallback((_: unknown, data: { value: unknown }) => {
    setActiveSurface(data.value as any);
  }, [setActiveSurface]);

  const togglePanel = React.useCallback(() => {
    setIsPanelCollapsed((prev) => !prev);
  }, []);

  const renderSurface = () => {
    switch (activeSurface) {
      case 'outlook':
        return <OutlookSurface />;
      case 'word':
        return <WordSurface />;
      case 'teams':
        return <TeamsSurface />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.root}>
      {/* Copilot Panel */}
      <div
        className={`${styles.copilotPanel} ${
          isPanelCollapsed ? styles.copilotPanelCollapsed : ''
        }`}
      >
        <CopilotPanelEnhanced onClose={togglePanel} />
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Header with Surface Tabs */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              appearance="subtle"
              icon={isPanelCollapsed ? <ChevronRight24Regular /> : <ChevronLeft24Regular />}
              onClick={togglePanel}
              className={styles.toggleButton}
              title={isPanelCollapsed ? 'Show Copilot Panel' : 'Hide Copilot Panel'}
              aria-label={isPanelCollapsed ? 'Show Copilot Panel' : 'Hide Copilot Panel'}
            />
            <div className={styles.tabContainer}>
              <Caption1>Host Surface:</Caption1>
              <TabList selectedValue={activeSurface} onTabSelect={handleTabSelect} aria-label="Host surface switcher">
                <Tab value="outlook">Outlook</Tab>
                <Tab value="word">Word</Tab>
                <Tab value="teams">Teams</Tab>
              </TabList>
            </div>
          </div>
        </div>

        {/* Surface Content */}
        <div className={styles.surfaceContainer}>{renderSurface()}</div>
      </div>
    </div>
  );
};

export default AppShell;

