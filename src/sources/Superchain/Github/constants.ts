import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

export const origin = 'https://raw.githubusercontent.com'

export const superchainGithubOrigins = githubHttpEndpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

export const chainListPath = '/ethereum-optimism/superchain-registry/main/chainList.json'

export const superchainMainnetIdentifier = 'mainnet'
export const superchainSepoliaIdentifier = 'sepolia'

export const networkChainIdBySuperchainIdentifier: Record<string, number> = {
	[superchainMainnetIdentifier]: 1,
	[superchainSepoliaIdentifier]: 11155111,
}
