import { ethers } from "ethers";
import { getEnv } from "./env";

export type ChainKey = "eth" | "arb" | "opt" | "plume" | "hyperevm";

export function getProvider(chain: ChainKey): ethers.JsonRpcProvider {
  const map: Record<ChainKey, string | undefined> = {
    eth: getEnv("RPC_URL_ETH"),
    arb: getEnv("RPC_URL_ARB"),
    opt: getEnv("RPC_URL_OPT"),
    plume: getEnv("RPC_URL_PLUME"),
    hyperevm: getEnv("RPC_URL_HYPEREVM"),
  };
  const url = map[chain];
  if (!url) {
    throw new Error(`Missing RPC URL for ${chain} (set RPC_URL_${chain.toUpperCase()})`);
  }
  return new ethers.JsonRpcProvider(url);
}

export function getDefaultGasLimit(): bigint {
  const raw = getEnv("DEFAULT_GAS_LIMIT");
  const v = raw ? Number(raw) : 200000;
  return BigInt(v);
}

