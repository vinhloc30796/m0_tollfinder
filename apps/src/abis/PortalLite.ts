export const PortalLiteABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "destinationChainId", "type": "uint256" },
      { "internalType": "address", "name": "recipient", "type": "address" }
    ],
    "name": "quoteTransfer",
    "outputs": [
      { "internalType": "uint256", "name": "fee_", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;


