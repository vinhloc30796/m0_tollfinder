import { getPortalContract, getPortalLiteContract } from "@/lib/contracts";
import { ROUTES, type RouteKey, type PortalRouteKey, type PortalLiteRouteKey } from "@/lib/routes";

export type PortalQuoteInput = { route: PortalRouteKey };

export type PortalQuote = {
  route: RouteKey;
  feeWei: bigint;
};

export async function quoteViaPortal(input: PortalQuoteInput): Promise<PortalQuote> {
  const route = ROUTES[input.route];
  if (!route || route.type !== "portal") throw new Error("Invalid portal route");
  const portal = await getPortalContract(route.sourceChain ?? "eth");
  const [_fees, total]: [bigint[], bigint] =
    await portal.quoteDeliveryPrice(route.targetChainId, "0x00");
  const feeWei = total;
  return { route: input.route, feeWei };
}

export type PortalLiteQuoteInput = { route: PortalLiteRouteKey; recipient: string; amount: bigint };

export type PortalLiteQuote = {
  route: RouteKey;
  recipient: string;
  amount: bigint;
  feeWei: bigint;
  calldata?: string;
};

export async function quoteViaPortalLite(input: PortalLiteQuoteInput): Promise<PortalLiteQuote> {
  const route = ROUTES[input.route];
  if (!route || route.type !== "portal-lite") throw new Error("Invalid portal-lite route");
  const portalLite = await getPortalLiteContract(route.sourceChain ?? "eth");
  const feeWei: bigint = await portalLite.quoteTransfer(
    input.amount,
    BigInt(route.targetChainId),
    input.recipient,
    { from: "0x0000000000000000000000000000000000000000" }
  );
  return { route: input.route, recipient: input.recipient, amount: input.amount, feeWei };
}

export type QuoteResult =
  | ({ type: "portal" } & PortalQuote)
  | ({ type: "portal-lite" } & PortalLiteQuote);

