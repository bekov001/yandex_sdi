/* src/app/store/useAppStore.ts */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AnalyticsSnapshot, HistoryEntry } from '../../shared/types';
import { uploadFile, requestTestReport, downloadBlob } from '../../api/analyticsAPI';

/**
 * Safely extracts a human‑readable message from unknown error‑like inputs.
 */
function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

interface AppState {
  /* ===== Upload ===== */
  file: File | null;
  isParsing: boolean;
  progressResult: AnalyticsSnapshot | null;
  finalResult: AnalyticsSnapshot | null;

  /* ===== CSV generator ===== */
  isGenerating: boolean;
  reportBlob: Blob | null;

  /* ===== Status / History ===== */
  error: string | null;
  history: HistoryEntry[];
  clearError: () => void;

  /* ===== Actions ===== */
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
      /* ===== State ===== */
      file: null,
      isParsing: false,
      isGenerating: false,
      error: null,
      progressResult: null,
      finalResult: null,
      reportBlob: null,
      history: [],

      /* ===== Mutators ===== */
      setFile: (file) => set({ file, error: null, progressResult: null, finalResult: null }),

      uploadAndAnalyze: async () => {
        const { file } = get();
        if (!file) return;

        set({ isParsing: true, error: null, progressResult: null, finalResult: null });

        try {
          // Получаем финальный снапшот и одновременно стримим прогресс в стор
          const full: AnalyticsSnapshot = await uploadFile(file, (snap) => {
            set({ progressResult: snap });
          });

          const isBad = full.rows_affected === 0 || full.total_spend_galactic == null;

          const status: HistoryEntry['status'] = isBad ? 'fail' : 'success';

          set({ finalResult: full });
          get().addHistoryEntry({ fileName: file.name, status, ...full });

          if (isBad) {
            set({ error: 'Сервер не смог посчитать метрики — проверьте CSV' });
          }
        } catch (err) {
          set({ error: getErrorMessage(err) });
          get().addHistoryEntry({
            fileName: file?.name ?? 'unknown',
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

      clearError: () => set({ error: null }),

      generateReport: async () => {
        set({ isGenerating: true, error: null });
        try {
          const blob = await requestTestReport();
          set({ reportBlob: blob });
        } catch (err) {
          set({ error: getErrorMessage(err) });
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

      removeHistoryEntry: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'analyticsHistory',
      partialize: (s) => ({ history: s.history }),
    },
  ),
);
