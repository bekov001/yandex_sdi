export interface AnalyticsHighlight {
  column: string;
  value: string | number;
  description: string;
}

// export interface AnalyticsResult {
//   highlights: AnalyticsHighlight[];
//   // Можно добавить другие поля, например, summary, charts и т.д.
// }

export interface HistoryEntry extends AnalyticsResult {
  id: string; // timestamp or uuid
  fileName: string;
  uploadDate: string;
  status: 'success' | 'fail';
}

export interface AnalyticsSnapshot {
  total_spend_galactic: number;
  rows_affected: number;
  average_spend_galactic: number;
  big_spent_at?: number;
  less_spent_at?: number;
  big_spent_value?: number;
  less_spent_value?: number;
  big_spent_civ?: string;
  less_spent_civ?: string;
}

/* итог, который кладём в историю */
export type AnalyticsResult = AnalyticsSnapshot;
