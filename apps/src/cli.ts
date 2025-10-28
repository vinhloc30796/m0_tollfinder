#!/usr/bin/env node
import { Command } from "commander";
import { quoteViaPortal, quoteViaPortalLite } from "@/lib/quotes";
import { parseAmount, formatNative, type AmountUnit } from "@/lib/formatters";

// Load env in Node context
try { await import("dotenv/config"); } catch {}

const program = new Command();
program
  .name("m0_tollfinder")
  .description("M0 Bridge Fee Estimator (read-only)")
  .option("--route <route>", "Route: eth-arb|eth-opt|eth-plume|eth-hyperevm")
  .option("--amount <num>", "Amount in selected unit (default unit M)")
  .option("--unit <unit>", "Amount unit: M|wM", "M")
  .option("--gas-limit <num>", "Gas limit for Portal routes (default env DEFAULT_GAS_LIMIT)")
  .option("--recipient <address>", "Recipient for Portal-Lite routes")
  .parse(process.argv);

type Opts = {
  route?: string;
  amount?: string;
  unit?: AmountUnit;
  gasLimit?: string;
  recipient?: string;
};

const opts = program.opts<Opts>();

async function main() {
  const route = (opts.route ?? "").toLowerCase();
  if (!route) throw new Error("--route is required");

  if (route === "eth-arb" || route === "eth-opt") {
    const gasLimit = opts.gasLimit ? BigInt(Number(opts.gasLimit)) : undefined;
    const q = await quoteViaPortal({ route: route as any, gasLimit });
    console.log("🌉 m0_tollfinder (Portal)");
    console.log(`Route: ${route}`);
    console.log(`Gas Limit: ${q.gasLimit.toString()}`);
    console.log(`Estimated msg.value: ${formatNative(q.feeWei)}`);
    return;
  }

  if (route === "eth-plume" || route === "eth-hyperevm") {
    if (!opts.amount) throw new Error("--amount is required for portal-lite routes");
    if (!opts.recipient) throw new Error("--recipient is required for portal-lite routes");
    const unit = (opts.unit ?? "M") as AmountUnit;
    const amount = parseAmount(opts.amount, unit);
    const q = await quoteViaPortalLite({ route: route as any, recipient: opts.recipient, amount });
    console.log("🌉 m0_tollfinder (Portal-Lite)");
    console.log(`Route: ${route}`);
    console.log(`Amount: ${opts.amount} ${unit}`);
    console.log(`Estimated fee: ${formatNative(q.feeWei)}`);
    console.log(`Calldata: ${q.calldata}`);
    return;
  }

  throw new Error(`Unsupported route: ${route}`);
}

main().catch((e) => {
  console.error(`Error: ${e?.message ?? String(e)}`);
  process.exitCode = 1;
});


