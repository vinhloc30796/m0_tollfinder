### m0_tollfinder — M0 Bridge Fee Estimator (ethers.js read-only)

Build a lightweight CLI and web interface that queries on-chain M0 bridge contracts to estimate cross-chain transfer costs. Calls `quoteDeliveryPrice` (Portal) and `quoteTransfer` (Portal-Lite) for common routes, displays estimated `msg.value` and transaction calldata preview. Reference implementation for feature-flag/canary awareness and practical cross-chain ergonomics.

### TL;DR
- **CLI**: Node.js script accepts route and amount, queries Portal/Portal-Lite contracts via ethers.js v6, displays estimated gas and msg.value in human-readable format.
- **Web UI**: Simple single-page interface with route selector, amount input, and real-time fee estimation.
- **RPC**: Free-tier providers (Ankr, QuickNode, or public endpoints) for Ethereum mainnet and L2s.
- **Contracts**: Portal and Portal-Lite ABIs from M0 docs/repos. No wallet signing required (read-only queries).
- **Routes**: ETH→ARB, ETH→OPT, ETH→Plume, ETH→HyperEVM. Amounts in $M/$wM.
- **Dev**: Works locally with just Node.js 18+. Optional Docker for consistent environment.
- **Cost**: Free (uses public RPC endpoints and read-only queries).

### Why ethers.js and not web3.js
- Uses ethers.js v6 for modern TypeScript support, better documentation, and ergonomic contract interactions.
- Read-only queries keep it simple; no wallet management or transaction signing.

### Constraints mapping
- **(a) Use ethers.js v6**: All contract interactions via ethers.js v6 with modern syntax.
- **(b) Read-only**: No private keys, no signing. Only queries public contract methods.
- **(c) Free tier RPC**: Support Ankr, QuickNode free tiers, and public endpoints.
- **(d) Reference docs**: ABIs and contract addresses from docs.m0.org and official repos.

### Architecture
```
[CLI/Web UI]
     |
     v
[ethers.js v6 Provider] --RPC--> [Ethereum/L2 Nodes]
     |                                    |
     |--- quoteDeliveryPrice() -------> [Portal Contract]
     |--- quoteTransfer() ------------> [Portal-Lite Contract]
     |
     v
[Fee Estimate + Calldata Preview]
```

Notes:
- All queries are read-only contract calls; no transaction signing or gas consumption.
- RPC providers can be configured via env vars (Ankr, QuickNode, or public endpoints).
- Contract addresses and ABIs are sourced from docs.m0.org and official M0 repositories.

### Supported routes
Configure routes and contracts:
- **ETH → Arbitrum**: Portal contract on Ethereum mainnet
- **ETH → Optimism**: Portal contract on Ethereum mainnet
- **ETH → Plume**: Portal-Lite contract on Ethereum mainnet
- **ETH → HyperEVM**: Portal-Lite contract on Ethereum mainnet

Each route queries the appropriate contract method:
- `quoteDeliveryPrice(targetChain, gasLimit)` for Portal routes
- `quoteTransfer(recipient, amount, targetChain)` for Portal-Lite routes

### M0 Bridge Contracts and integration notes
M0's cross-chain bridge uses two contract types:

- **Portal**: Full-featured bridge with delivery price quotes
  - Method: `quoteDeliveryPrice(uint256 targetChainId, uint256 gasLimit) returns (uint256 nativeFee)`
  - Used for ETH→ARB and ETH→OPT routes
  - Returns the native token amount required for `msg.value`

- **Portal-Lite**: Lightweight bridge for newer chains
  - Method: `quoteTransfer(address recipient, uint256 amount, uint256 targetChain) returns (uint256 fee, bytes calldata)`
  - Used for ETH→Plume and ETH→HyperEVM routes
  - Returns both fee estimate and calldata preview

Example queries:
```typescript
// Portal: ETH → Arbitrum
const fee = await portalContract.quoteDeliveryPrice(
  42161, // Arbitrum chain ID
  200000 // estimated gas limit
);

// Portal-Lite: ETH → Plume
const [fee, calldata] = await portalLiteContract.quoteTransfer(
  recipientAddress,
  ethers.parseUnits("1000000", 6), // $1M in $M (6 decimals)
  18445 // Plume chain ID
);
```

For production accuracy, always fetch the latest contract addresses and ABIs from docs.m0.org.

### Configuration
Contract addresses and RPC endpoints are configured via environment variables or config file.

Example `.env` file:
```bash
# RPC endpoints (use Ankr, QuickNode, or public endpoints)
RPC_URL_ETH=https://rpc.ankr.com/eth
RPC_URL_ARB=https://rpc.ankr.com/arbitrum
RPC_URL_OPT=https://rpc.ankr.com/optimism
RPC_URL_PLUME=https://rpc.plumenetwork.xyz
RPC_URL_HYPEREVM=https://rpc.hyperliquid.xyz

# M0 Portal contract address (ETH mainnet)
PORTAL_ADDRESS=0x...

# M0 Portal-Lite contract address (ETH mainnet)
PORTAL_LITE_ADDRESS=0x...

# Chain IDs for target networks
CHAIN_ID_ARB=42161
CHAIN_ID_OPT=10
CHAIN_ID_PLUME=18445
CHAIN_ID_HYPEREVM=...

# Default gas limits for quotes
DEFAULT_GAS_LIMIT=200000
```

Contract ABIs should be placed in `src/abis/`:
- `Portal.json` — Full Portal contract ABI
- `PortalLite.json` — Portal-Lite contract ABI

### CLI interface
The CLI accepts a route and amount, queries the appropriate contract, and displays results.

Example usage:
```bash
# Basic usage: route and amount
pnpm  run cli -- --route eth-arb --amount 1000000

# With custom gas limit
pnpm  run cli -- --route eth-opt --amount 5000000 --gas-limit 250000

# Portal-Lite routes (returns calldata preview)
pnpm  run cli -- --route eth-plume --amount 10000000

# Help
pnpm  run cli -- --help
```

Sample output:
```
🌉 M0 Bridge Fee Estimator

Route: ETH → Arbitrum
Amount: $1,000,000 M
Gas Limit: 200,000

Estimated msg.value: 0.0042 ETH ($12.60)
Gas Price: 21 gwei
L1 Data Fee: ~0.0015 ETH

Total Cost: ~$12.60 for $1M transfer (0.00126% fee)

✓ Quote fetched successfully
```

### Web interface
A simple single-page app provides an interactive UI for fee estimation.

Features:
- Route selector dropdown (ETH→ARB, ETH→OPT, ETH→Plume, ETH→HyperEVM)
- Amount input with $M/$wM selector
- Custom gas limit input (optional)
- Real-time fee estimation on input change
- Calldata preview for Portal-Lite routes
- Copy-to-clipboard for calldata

Run locally:
```bash
pnpm  run dev
# Open http://localhost:3000
```

### Local development
Prereqs:
- Node.js 18+ and pnpm 
- `.env` file with RPC endpoints and contract addresses

Setup:
```bash
# 1) Install dependencies
pnpm  install

# 2) Copy example env and configure
cp .env.example .env
# Edit .env with your RPC URLs and contract addresses

# 3) Build TypeScript
pnpm  run build

# 4) Run CLI
pnpm  run cli -- --route eth-arb --amount 1000000

# 5) Run web UI (optional)
pnpm  run dev
# Open http://localhost:3000
```

Optional: Docker for consistent environment
```bash
# Build image
docker build -t m0_tollfinder .

# Run CLI
docker run --rm --env-file .env m0_tollfinder \
  pnpm  run cli -- --route eth-arb --amount 1000000

# Run web UI
docker run --rm --env-file .env -p 3000:3000 m0_tollfinder \
  pnpm  run dev
```

### Deployment options
Since this is a read-only query tool, deployment is flexible and simple.

**Option A: Static site (recommended for web UI)**
The web interface can be built as a static site and deployed to any hosting service:

```bash
# Build for production
pnpm  run build:web

# Deploy to Vercel/Netlify/Cloudflare Pages
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod --dir=dist
# - CF Pages: wrangler pages deploy dist
```

**Option B: CLI as pnpm  package**
Publish as an pnpm  package for easy installation:

```bash
# In package.json, set name and bin
pnpm  publish

# Users install globally
pnpm  install -g @yourorg/m0_tollfinder

# Then use anywhere
m0_tollfinder --route eth-arb --amount 1000000
```

**Option C: Docker container**
Run as a containerized service:

```bash
# Build and push to registry
docker build -t your-registry/m0_tollfinder .
docker push your-registry/m0_tollfinder

# Run on any container platform
docker run -p 3000:3000 --env-file .env your-registry/m0_tollfinder
```

**Option D: Cloudflare Worker (web API)**
Deploy as a serverless API:

```bash
# Install Wrangler
pnpm  install -g wrangler

# Configure wrangler.toml
wrangler deploy
```

### Implementation notes
- **Read-only**: All operations are view calls; no state changes, no gas costs, no wallet needed.
- **Caching**: Consider caching RPC responses for 5-10 seconds to reduce provider API calls.
- **Error handling**: Gracefully handle RPC failures and contract call reverts.
- **Token formatting**: Support both $M (6 decimals) and $wM (18 decimals) amounts.

### Security
- **No secrets required**: Read-only operations don't need private keys.
- **RPC endpoints**: Use rate-limited free tier or your own paid tier. Store RPC URLs in `.env`, not in code.
- **Contract addresses**: Verify addresses against official M0 documentation before use.

### Production checklist
- `.env` configured with valid RPC URLs and verified contract addresses
- ABIs fetched from official M0 repos or docs.m0.org
- Error handling for network failures and contract reverts
- Amount validation (min/max transfer limits)
- Chain ID verification before queries
- Optional: monitoring/alerting if RPC providers go down

### Cost considerations
- **Free tier RPC**: Ankr, QuickNode, and public endpoints offer free tiers sufficient for moderate usage.
- **Paid RPC**: If you need higher rate limits, paid tiers start at ~$50/month.
- **Hosting**: Static site hosting is free on Vercel/Netlify/CF Pages. Container hosting starts at $0-10/month.

### Repository layout (suggested)
```
.
├─ src/
│  ├─ cli.ts                 # CLI entry point
│  ├─ web.ts                 # Web UI entry point (optional)
│  ├─ lib/
│  │  ├─ contracts.ts        # ethers.js contract wrappers
│  │  ├─ providers.ts        # RPC provider configuration
│  │  ├─ routes.ts           # Route definitions and chain configs
│  │  ├─ formatters.ts       # Amount and fee formatters
│  │  └─ types.ts            # TypeScript types
│  └─ abis/
│     ├─ Portal.json         # Portal contract ABI
│     └─ PortalLite.json     # Portal-Lite contract ABI
├─ public/                   # Static assets for web UI (optional)
├─ .env.example              # Example environment configuration
├─ tsconfig.json             # TypeScript configuration
├─ package.json              # Dependencies and scripts
└─ Dockerfile                # Optional container build
```

### Next steps
- Set up Node.js project with ethers.js v6 and TypeScript.
- Fetch Portal and Portal-Lite ABIs from M0 documentation.
- Implement CLI with route parsing and contract queries.
- Add amount validation and formatted output.
- Optional: Build web UI with route selector and real-time estimates.
- Document all supported routes and chain IDs.

### Useful resources
- **M0 Documentation**: docs.m0.org
- **ethers.js v6**: docs.ethers.org/v6
- **Ankr RPC**: ankr.com/rpc
- **QuickNode RPC**: quicknode.com
- **Chain IDs**: chainlist.org

