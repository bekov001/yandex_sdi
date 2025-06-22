/* src/app/store/useAppStore.ts */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AnalyticsSnapshot, HistoryEntry } from '../../shared/types';
import {
  uploadFile,
  requestTestReport,
  downloadBlob,
} from '../../api/analyticsAPI';

interface AppState {

  file: File | null;
  isParsing: boolean;
  progressResult: AnalyticsSnapshot | null;
  finalResult:    AnalyticsSnapshot | null;

  isGenerating: boolean;
  reportBlob: Blob | null;

  error: string | null;
  history: HistoryEntry[];


  setFile: (f: File | null) => void;
  uploadAndAnalyze: () => Promise<void>;

  generateReport: () => Promise<void>;
  downloadReport: () => void;

  clearUploadState: () => void;
  addHistoryEntry: (e: Omit<HistoryEntry, 'id' | 'uploadDate'>) => void;
  removeHistoryEntry: (id: string) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({

      file: null,
      isParsing: false,
      isGenerating: false,
      error: null,
      progressResult: null,
      finalResult: null,
      reportBlob: null,
      history: [],


      setFile: (file) =>
        set({ file, error: null, progressResult: null, finalResult: null }),

      uploadAndAnalyze: async () => {
        const { file } = get();
        if (!file) return;

        set({ isParsing: true, error: null, progressResult: null, finalResult: null });

        try {
          let lastSnap: AnalyticsSnapshot | null = null;

          const full: AnalyticsSnapshot = await uploadFile(file, (snap) => {
            lastSnap = snap;
            set({ progressResult: snap });
          });

          const bad =
            !lastSnap ||
            (lastSnap as AnalyticsSnapshot).rows_affected === 0 ||
            (lastSnap as AnalyticsSnapshot).total_spend_galactic == null;

          const status: HistoryEntry['status'] = bad ? 'fail' : 'success';

          set({ finalResult: full });
          get().addHistoryEntry({ fileName: file.name, status, ...full });

          if (bad) {
            set({ error: 'Сервер не смог посчитать метрики — проверьте CSV' });
          }
        } catch (e: any) {
          set({ error: e.message });
          get().addHistoryEntry({
            fileName: file.name,
            status: 'fail',
            total_spend_galactic: 0,
            rows_affected: 0,
            average_spend_galactic: 0,
          });
        } finally {
          set({ isParsing: false });
        }
      },

      clearUploadState: () =>
        set({ file: null, progressResult: null, finalResult: null, error: null }),


      generateReport: async () => {
        set({ isGenerating: true, error: null });
        try {
          const blob = await requestTestReport();
          set({ reportBlob: blob });
        } catch (e: any) {
          set({ error: e.message });
        } finally {
          set({ isGenerating: false });
        }
      },

      downloadReport: () => {
        const blob = get().reportBlob;
        if (!blob) return;
        downloadBlob(blob, 'intergalactic-report.csv');
        set({ reportBlob: null });
      },

      /* ----- history helpers ----- */
      addHistoryEntry: (entry) => {
        const newEntry: HistoryEntry = {
          ...entry,
          id: Date.now().toString(),
          uploadDate: new Date().toISOString(),
        };
        set((s) => ({ history: [newEntry, ...s.history] }));
      },

      removeHistoryEntry: (id) =>
        set((s) => ({ history: s.history.filter((h) => h.id !== id) })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'analyticsHistory',
      partialize: (s) => ({ history: s.history }),
    }
  )
);
