import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WindowParam = '15m' | '30m' | '1h' | '6h' | '24h';

interface SnapshotFiltersState {
  endpoints: string[];
  windowParam: WindowParam;
  autoRefresh: boolean;
  setWindowParam: (w: WindowParam) => void;
  setAutoRefresh: (v: boolean) => void;
  setEndpoints: (eps: string[]) => void;
  toggleEndpoint: (ep: string) => void;
}

export const useSnapshotFilters = create<SnapshotFiltersState>()(
  persist(
    (set, get) => ({
      endpoints: ['ticker'],
      windowParam: '30m',
      autoRefresh: false,
      setWindowParam: (w) => set({ windowParam: w }),
      setAutoRefresh: (v) => set({ autoRefresh: v }),
      setEndpoints: (eps) => set({ endpoints: eps }),
      toggleEndpoint: (ep) => {
        const curr = get().endpoints;
        set({ endpoints: curr.includes(ep) ? curr.filter((e) => e !== ep) : [...curr, ep] });
      },
    }),
    { name: 'snapshot-filters:v1' }
  )
);


