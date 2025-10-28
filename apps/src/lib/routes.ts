export type RouteKey = "eth-arb" | "eth-opt" | "arb-eth" | "opt-eth" | "eth-plume" | "plume-eth" | "eth-hyperevm" | "hyperevm-eth";

export type RouteDef = {
  key: RouteKey;
  type: "portal" | "portal-lite";
  targetChainId: number;
  // For routes that require a specific source chain contract instance
  sourceChain?: "eth" | "arb" | "opt" | "plume" | "hyperevm";
  label: string;
  description: string;
  needsAmount: boolean;
  needsRecipient: boolean;
  // Optional UI gating
  disabled?: boolean;
  disabledReason?: string;
  disabledLink?: string;
};

export const ROUTES = {
  "eth-arb": {
    key: "eth-arb",
    type: "portal",
    targetChainId: 23,
    sourceChain: "eth",
    label: "ETH → Arbitrum",
    description: "Portal",
    needsAmount: false,
    needsRecipient: false,
  },
  "eth-opt": {
    key: "eth-opt",
    type: "portal",
    targetChainId: 24,
    sourceChain: "eth",
    label: "ETH → Optimism",
    description: "Portal",
    needsAmount: false,
    needsRecipient: false,
  },
  "arb-eth": {
    key: "arb-eth",
    type: "portal",
    targetChainId: 2,
    sourceChain: "arb",
    label: "Arbitrum → ETH",
    description: "Portal",
    needsAmount: false,
    needsRecipient: false,
  },
  "opt-eth": {
    key: "opt-eth",
    type: "portal",
    targetChainId: 2,
    sourceChain: "opt",
    label: "Optimism → ETH",
    description: "Portal",
    needsAmount: false,
    needsRecipient: false,
  },
  "eth-plume": {
    key: "eth-plume",
    type: "portal-lite",
    targetChainId: 98866,
    sourceChain: "eth",
    label: "ETH → Plume",
    description: "Portal-Lite",
    needsAmount: true,
    needsRecipient: true,
  },
  "plume-eth": {
    key: "plume-eth",
    type: "portal-lite",
    targetChainId: 1,
    sourceChain: "plume",
    label: "Plume → ETH",
    description: "Portal-Lite",
    needsAmount: true,
    needsRecipient: true,
  },
  "eth-hyperevm": {
    key: "eth-hyperevm",
    type: "portal-lite",
    targetChainId: 47,
    sourceChain: "eth",
    label: "ETH → HyperEVM",
    description: "Portal-Lite",
    needsAmount: true,
    needsRecipient: true,
    disabled: true,
    disabledReason: "HyperEVM is experimental on Wormhole.",
    disabledLink: "https://wormhole.com/docs/products/reference/chain-ids/",
  },
  "hyperevm-eth": {
    key: "hyperevm-eth",
    type: "portal-lite",
    targetChainId: 47,
    sourceChain: "hyperevm",
    label: "HyperEVM → ETH",
    description: "Portal-Lite",
    needsAmount: true,
    needsRecipient: true,
    disabled: true,
    disabledReason: "HyperEVM is experimental on Wormhole.",
    disabledLink: "https://wormhole.com/docs/products/reference/chain-ids/",
  },
} as const satisfies Record<RouteKey, RouteDef>;

// Unified: routes and their UI config now live together in ROUTES

export type RoutesMap = typeof ROUTES;
export type PortalRouteKey = {
  [K in keyof RoutesMap]: RoutesMap[K]["type"] extends "portal" ? K : never
}[keyof RoutesMap];
export type PortalLiteRouteKey = {
  [K in keyof RoutesMap]: RoutesMap[K]["type"] extends "portal-lite" ? K : never
}[keyof RoutesMap];

export function isPortalRoute(key: RouteKey): key is PortalRouteKey {
  return ROUTES[key].type === "portal";
}

export function isPortalLiteRoute(key: RouteKey): key is PortalLiteRouteKey {
  return ROUTES[key].type === "portal-lite";
}
