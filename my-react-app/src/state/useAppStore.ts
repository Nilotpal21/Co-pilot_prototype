import { create } from 'zustand';
import { CopilotPanelNavigation, CopilotPanelTab } from './copilotPanelNav';

export type HostSurfaceId = 'outlook' | 'word' | 'teams';

export type WordExportState =
  | {
      proposalId: string;
      exportedAt: string; // ISO string
    }
  | null;

type AppState = {
  surface: HostSurfaceId;
  setSurface: (surface: HostSurfaceId) => void;

  copilotDraft: string;
  setCopilotDraft: (value: string) => void;

  copilotPanelTab: CopilotPanelTab;
  setCopilotPanelTab: (tab: CopilotPanelTab) => void;
  copilotNav: CopilotPanelNavigation;
  navigateCopilot: (nav: CopilotPanelNavigation) => void;
  clearCopilotNav: () => void;

  wordExport: WordExportState;
  exportToWord: (proposalId: string) => void;
  clearWordExport: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  surface: 'outlook',
  setSurface: (surface) => set({ surface }),

  copilotDraft: '',
  setCopilotDraft: (value) => set({ copilotDraft: value }),

  copilotPanelTab: 'chat',
  setCopilotPanelTab: (tab) => set({ copilotPanelTab: tab }),

  copilotNav: { kind: 'none' },
  navigateCopilot: (nav) =>
    set(() => ({
      copilotNav: nav,
      copilotPanelTab: nav.kind === 'none' ? 'chat' : 'actions',
    })),
  clearCopilotNav: () => set({ copilotNav: { kind: 'none' } }),

  wordExport: null,
  exportToWord: (proposalId) =>
    set(() => ({
      surface: 'word',
      wordExport: { proposalId, exportedAt: new Date().toISOString() },
    })),
  clearWordExport: () => set({ wordExport: null }),
}));


