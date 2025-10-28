import { useEffect } from 'react';
import { useSnapshotFilters } from "@/hooks/use-snapshot-filters";

export function ExportCsvListener() {
  const endpoints = useSnapshotFilters((s) => s.endpoints);
  const windowParam = useSnapshotFilters((s) => s.windowParam);

  useEffect(() => {
    async function exportCsv(selectedEndpoints: string[], win: string) {
      const apiBase = (import.meta as any).env?.VITE_API_BASE ?? '';
      const api = (path: string) => `${apiBase}${path}`;

      const results = await Promise.all(selectedEndpoints.map(async (e) => {
        const res = await fetch(api(`/snapshot?endpoint=${encodeURIComponent(e)}&window=${encodeURIComponent(win)}`));
        if (!res.ok) throw new Error(`Export failed: HTTP ${res.status}`);
        const arr: any[] = await res.json();
        return arr.map((x) => ({ ...x, endpoint: e }));
      }));

      const rows = results.flat().sort((a, b) => a.ts_ms - b.ts_ms || (a as any).endpoint.localeCompare((b as any).endpoint));
      const header = ["ts_iso","ts_ms","endpoint","p95_ms","availability_pct","samples","region"];
      const csvLines = [header.join(',')].concat(rows.map((r: any) => [
        new Date(r.ts_ms).toISOString(),
        r.ts_ms,
        r.endpoint,
        r.p95_ms,
        r.availability_pct,
        r.samples,
        r.region ?? ''
      ].join(',')));
      const csv = csvLines.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const filename = `hyv_${selectedEndpoints.join('+')}_${win}_${new Date().toISOString().replace(/[:.]/g,'-')}.csv`;
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    }

    const handler = () => {
      if (endpoints.length === 0) return;
      void exportCsv(endpoints, windowParam);
    };

    window.addEventListener('export-csv', handler);
    return () => window.removeEventListener('export-csv', handler);
  }, [endpoints, windowParam]);

  return null;
}


