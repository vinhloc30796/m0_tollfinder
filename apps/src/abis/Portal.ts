export const PortalABI = [
  {
    inputs: [
      { internalType: "uint16", name: "recipientChain", type: "uint16" },
      { internalType: "bytes", name: "transceiverInstructions", type: "bytes" }
    ],
    name: "quoteDeliveryPrice",
    outputs: [
      { internalType: "uint256[]", name: "fees", type: "uint256[]" },
      { internalType: "uint256", name: "deliveryFee", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;
