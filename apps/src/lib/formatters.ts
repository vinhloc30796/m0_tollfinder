import { ethers } from "ethers";

export type AmountUnit = "M" | "wM"; // $M (6d) vs $wM (18d)

export function parseAmount(value: string | number, unit: AmountUnit): bigint {
  const s = typeof value === "number" ? String(value) : value;
  const decimals = unit === "M" ? 6 : 18;
  return ethers.parseUnits(s, decimals);
}

export function formatNative(valueWei: bigint, symbol = "ETH"): string {
  const eth = ethers.formatEther(valueWei);
  return `${eth} ${symbol}`;
}

export function formatMultiDenom(valueWei: bigint): {
  wei: string;
  gwei: string;
  eth: string;
} {
  return {
    wei: valueWei.toString(),
    gwei: ethers.formatUnits(valueWei, 9),
    eth: ethers.formatEther(valueWei),
  };
}


