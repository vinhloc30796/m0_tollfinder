import { ethers } from "ethers";
import { getProvider, type ChainKey } from "@/lib/providers";
import { PortalABI } from "@/abis/Portal";
import { PortalLiteABI } from "@/abis/PortalLite";
import { getEnv } from "./env";

export function getPortalContract(chain: ChainKey = "eth") {
  const address = getEnv("PORTAL_ADDRESS");
  if (!address) throw new Error("PORTAL_ADDRESS not set: got " + address);
  const provider = getProvider(chain);
  const contract = new ethers.Contract(address, PortalABI, provider);
  console.log("getPortalContract debug:", {
    address,
    chain,
    provider,
    contract,
  });
  return contract;
}

export function getPortalLiteContract(chain: ChainKey = "eth") {
  const address = getEnv("PORTAL_LITE_ADDRESS");
  if (!address) throw new Error("PORTAL_LITE_ADDRESS not set: got " + address);
  const provider = getProvider(chain);
  const contract = new ethers.Contract(address, PortalLiteABI, provider);
  console.log("getPortalLiteContract debug:", {
    address,
    chain,
    provider,
    contract,
  });
  return contract;
}
