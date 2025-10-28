import { CardDescription, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export type SnapshotHeaderProps = {
  latestP95Display: string;
  status: 'idle' | 'loading' | 'ok' | 'error';
  message: string;
  lastRefreshedAt: number | null;
};

export function SnapshotHeader(props: SnapshotHeaderProps) {
  const { latestP95Display, status, message, lastRefreshedAt } = props;
  return (
    <>
      <div className="flex items-center gap-2">
        <CardTitle className="text-2xl font-semibold">{latestP95Display}</CardTitle>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-1 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="How is this calculated?"
            >
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">Latest p95 Calculation</p>
              <p>
                This value is the average of p95 latencies across all selected endpoints at the most recent timestamp.
              </p>
              <p className="text-xs opacity-90">
                For example, if ticker shows 120ms and orderbook shows 80ms, the display shows 100ms p95.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <CardDescription>
        p95 latency and availability over a rolling window
        <div className="mt-1 text-xs text-muted-foreground">
          {status === 'loading' && 'Connecting…'}
          {status === 'ok' && (
            <>
              {message}
              {" "}·{" "}
              Last refreshed: {lastRefreshedAt ? new Date(lastRefreshedAt).toLocaleTimeString() : '—'}
            </>
          )}
          {status === 'error' && (
            <span className="text-destructive">{message}</span>
          )}
        </div>
      </CardDescription>
    </>
  );
}


