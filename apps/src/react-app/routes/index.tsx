import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { quoteViaPortal, quoteViaPortalLite, type QuoteResult } from "@/lib/quotes";
import { parseAmount, formatMultiDenom, type AmountUnit } from "@/lib/formatters";
import type { RouteKey, PortalRouteKey, PortalLiteRouteKey, RouteDef } from "@/lib/routes";
import { ROUTES } from "@/lib/routes";

export const Route = createFileRoute('/')({
  component: App,
})


export function App() {
  const [route, setRoute] = useState<RouteKey | null>(null);
  const [amount, setAmount] = useState<string>('1000000');
  const [unit, setUnit] = useState<AmountUnit>('M');
  const [recipient, setRecipient] = useState<string>('0x0000000000000000000000000000000000000000');
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const selectedConfig = route ? ROUTES[route] : null;

  function handleRouteSelect(routeKey: RouteKey) {
    setRoute(routeKey);
    setError('');
    setResult(null);
  }

  async function handleEstimate() {
    if (!route) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const config = ROUTES[route];
      if (!config) throw new Error('Invalid route');

      if (!config.needsAmount && !config.needsRecipient) {
        const q = await quoteViaPortal({ route: route as PortalRouteKey });
        setResult({ type: 'portal', ...q });
      } else {
        const amt = parseAmount(amount, unit);
        const q = await quoteViaPortalLite({ route: route as PortalLiteRouteKey, recipient, amount: amt });
        setResult({ type: 'portal-lite', ...q });
      }
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>m0_tollfinder — Bridge Fee Estimator</h1>

      <Card className="card">
        <CardHeader className="border-b">
          <CardTitle>Estimate Bridge Fees</CardTitle>
          <CardDescription>Configure your bridge parameters and view fees on-chain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Route Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Route</label>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.values(ROUTES).map((c) => {
                const config = c as unknown as RouteDef;
                const btn = (
                  <Button
                    key={config.key}
                    variant={route === config.key ? 'default' : 'outline'}
                    className="w-full h-auto flex-col items-start p-4 gap-1"
                    onClick={() => handleRouteSelect(config.key)}
                    disabled={!!config.disabled}
                  >
                    <span className="font-semibold">{config.label}</span>
                    <span className="text-xs opacity-70">{config.description}</span>
                  </Button>
                );

                if (!config.disabled) return btn;

                // Wrap disabled with tooltip and external link inside content
                return (
                  <Tooltip key={config.key}>
                    <TooltipTrigger >
                      <span>{btn}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {config.disabledReason ?? 'This route is currently unavailable.'}
                        </div>
                        {config.disabledLink && (
                          <a
                            href={config.disabledLink}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-xs"
                          >
                            View Wormhole chain IDs
                          </a>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Step 2: Amount (only for Portal-Lite) */}
          {selectedConfig?.needsAmount && (
            <div className="space-y-4 pb-4 border-b">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000000"
                    disabled={!route}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit</label>
                  <Select value={unit} onValueChange={(v) => setUnit(v as AmountUnit)} disabled={!route}>
                    <SelectTrigger><SelectValue placeholder="unit" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">$M (6 decimals)</SelectItem>
                      <SelectItem value="wM">$wM (18 decimals)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Recipient (only for Portal-Lite) */}
          {selectedConfig?.needsRecipient && (
            <div className="space-y-2 pb-4 border-b">
              <label className="text-sm font-medium">Recipient Address</label>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                disabled={!route}
              />
            </div>
          )}

          {/* Estimate Button */}
          {route && (
            <div>
              <Button onClick={handleEstimate} disabled={loading} className="w-full">
                {loading ? 'Estimating…' : 'Get Quote'}
              </Button>
            </div>
          )}

          {/* Results Section */}
          {loading && (
            <div className="text-center py-8 text-muted-foreground border-t">
              Fetching quote...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Quote Result</h3>
              <div className="p-4 bg-muted rounded space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Route</div>
                  <div className="font-medium">{selectedConfig?.label}</div>
                </div>

                {result.type === 'portal-lite' && (
                  <>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Amount</div>
                      <div className="font-medium">{amount} {unit}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Recipient</div>
                      <div className="font-mono text-xs break-all">{recipient}</div>
                    </div>
                  </>
                )}

                <div className="border-t pt-3">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Estimated Fee (msg.value)
                  </div>
                  {(() => {
                    const formatted = formatMultiDenom(result.feeWei);
                    return (
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{formatted.eth} ETH</div>
                        <div className="text-sm text-muted-foreground">{formatted.gwei} Gwei</div>
                        <div className="text-xs text-muted-foreground">{formatted.wei} Wei</div>
                      </div>
                    );
                  })()}
                </div>

                {result.type === 'portal-lite' && result.calldata && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Calldata</div>
                    <div className="font-mono text-xs break-all bg-background p-2 rounded border">
                      {result.calldata}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
