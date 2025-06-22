import type { AnalyticsSnapshot } from '../shared/types';

const API_BASE_URL = 'http://localhost:3000';

export async function uploadFile(
  file: File,
  onProgress: (snap: AnalyticsSnapshot) => void,
  rows = 10_000,
): Promise<AnalyticsSnapshot> {
  const form = new FormData();
  form.append('file', file);

  const resp = await fetch(`${API_BASE_URL}/aggregate?rows=${rows}`, {
    method: 'POST',
    body: form,
  });

  if (!resp.ok || !resp.body) {
    throw new Error(`Aggregate failed (${resp.status} ${resp.statusText})`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();

  let lastSnap: AnalyticsSnapshot = {
    total_spend_galactic: 0,
    rows_affected: 0,
    average_spend_galactic: 0,
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    for (const line of chunk.split('\n')) {
      if (!line.trim()) continue;

      try {
        const snap = JSON.parse(line) as AnalyticsSnapshot;
        onProgress(snap);
        lastSnap = snap;
      } catch {
        console.warn('Bad ND-JSON →', line);
      }
    }
  }

  return lastSnap;
}

interface GenerateOptions {
  sizeGB?: number;
  withErrors?: boolean;
  maxSpend?: number;
}

export async function requestTestReport(options: GenerateOptions = {}): Promise<Blob> {
  const params = new URLSearchParams({
    size: String(options.sizeGB ?? 1),
    withErrors: options.withErrors ? 'on' : 'off',
    maxSpend: String(options.maxSpend ?? 1_000),
  });

  const resp = await fetch(`${API_BASE_URL}/report?${params.toString()}`);
  if (!resp.ok) throw new Error(`Report generation failed: ${resp.statusText}`);

  return resp.blob();
}

export function downloadBlob(blob: Blob, name = 'intergalactic-report.csv') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
