export const blockscoutExplorerRestV2OriginByChainId = {
	1: 'https://eth.blockscout.com',
	10: 'https://optimism.blockscout.com',
	100: 'https://gnosis.blockscout.com',
	137: 'https://polygon.blockscout.com',
	8453: 'https://base.blockscout.com',
	42161: 'https://arbitrum.blockscout.com',
	11155111: 'https://eth-sepolia.blockscout.com',
} as const satisfies Partial<Record<number, string>>
