export const chainListPath = '/ethereum-optimism/superchain-registry/main/chainList.json'

export const superchainMainnetIdentifier = 'mainnet'
export const superchainSepoliaIdentifier = 'sepolia'

export const networkChainIdBySuperchainIdentifier: Record<string, number> = {
	[superchainMainnetIdentifier]: 1,
	[superchainSepoliaIdentifier]: 11155111,
}
