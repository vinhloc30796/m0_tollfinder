import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSnapshotFilters, type WindowParam } from "@/hooks/use-snapshot-filters";

const refreshSecondsInterval = 15;

export function SnapshotControls(props: { onRefresh: () => void }) {
  const { onRefresh } = props;
  const windowParam = useSnapshotFilters((s) => s.windowParam);
  const setWindowParam = useSnapshotFilters((s) => s.setWindowParam);
  const autoRefresh = useSnapshotFilters((s) => s.autoRefresh);
  const setAutoRefresh = useSnapshotFilters((s) => s.setAutoRefresh);
  const endpoints = useSnapshotFilters((s) => s.endpoints);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2 @[320px]/card-header:flex-row @[320px]/card-header:overflow-x-auto @[320px]/card-header:whitespace-nowrap">
        <Select value={windowParam} onValueChange={(v) => setWindowParam(v as WindowParam)}>
          <SelectTrigger aria-label="window" className="w-full @[320px]/card-header:w-[120px]" size="default">
            <SelectValue placeholder="Window" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15m">15m</SelectItem>
            <SelectItem value="30m">30m</SelectItem>
            <SelectItem value="1h">1h</SelectItem>
            <SelectItem value="6h">6h</SelectItem>
            <SelectItem value="24h">24h</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2 @[320px]/card-header:flex-row @[320px]/card-header:items-center @[320px]/card-header:overflow-x-auto @[320px]/card-header:whitespace-nowrap">
        <Button size="sm" className="w-full @[320px]/card-header:w-auto" onClick={onRefresh} disabled={endpoints.length === 0}>Refresh</Button>
        <div className="flex items-center gap-2">
          <Checkbox id="auto-refresh" checked={autoRefresh} onCheckedChange={(v: any) => setAutoRefresh(!!v)} />
          <Label htmlFor="auto-refresh" className="text-xs">Auto ({refreshSecondsInterval}s)</Label>
        </div>
      </div>
    </div>
  );
}


