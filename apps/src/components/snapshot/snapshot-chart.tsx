import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

export type ChartPoint = {
  ts_ms: number;
  time: string;
  [key: string]: number | string | null;
};

export function SnapshotChart(props: {
  points: ChartPoint[];
  endpoints: string[];
  chartConfig: ChartConfig;
  allEndpoints: string[];
  onLegendToggle: (endpoint: string) => void;
  longRange?: boolean;
}) {
  const { points, endpoints, chartConfig, allEndpoints, onLegendToggle, longRange } = props;

  const chartData = points;

  const handleLegendClick = (o: any) => {
    const ep = o?.value as string | undefined;
    if (ep) onLegendToggle(ep);
  };

  const formatTick = (value: number) =>
    longRange
      ? new Date(Number(value)).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit' })
      : new Date(Number(value)).toLocaleTimeString();

  return (
    <ChartContainer config={chartConfig} className="h-full">
      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <Legend layout="vertical" align="left" verticalAlign="middle" onClick={handleLegendClick} />
        <defs>
          {allEndpoints.map((ep) => (
            <linearGradient key={`grad-${ep}-p95`} id={`fill-${ep}-p95`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`var(--color-${ep})`} stopOpacity={0.2} />
              <stop offset="95%" stopColor={`var(--color-${ep})`} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="ts_ms"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          tick={{ fontSize: 10 }}
          minTickGap={8}
          tickFormatter={formatTick}
        />
        <YAxis tick={{ fontSize: 10 }} width={28} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(_, payload) => {
                const ts = payload?.[0]?.payload?.ts_ms;
                return ts ? new Date(Number(ts)).toLocaleTimeString() : "";
              }}
            />
          }
        />
        {allEndpoints.map((ep) => (
          <Area
            key={`area-${ep}-p95`}
            type="monotone"
            name={ep}
            dataKey={`${ep}_p95`}
            stroke={`var(--color-${ep})`}
            fill={`url(#fill-${ep}-p95)`}
            strokeWidth={2}
            hide={!endpoints.includes(ep)}
            isAnimationActive={false}
            connectNulls
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}


