export const scalingSummaryPath = '/api/scaling/summary'

export const ethereumChainId = 1

/**
 * L2Beat `hostChain` label → settled-on chain id (L1/L2 host for L2/L3 stacks).
 * @see https://l2beat.com/api/scaling/summary
 */
export const l2BeatHostChains = [
	{ label: 'Ethereum', parentChainId: 1 },
	{ label: 'Arbitrum One', parentChainId: 42161 },
	{ label: 'Arbitrum Nova', parentChainId: 42170 },
	{ label: 'Base Chain', parentChainId: 8453 },
	{ label: 'Linea', parentChainId: 59144 },
	{ label: 'Scroll', parentChainId: 534352 },
	{ label: 'Robinhood Chain', parentChainId: 4663 },
] as const

export const l2BeatHostChainByLabel = new Map(
	l2BeatHostChains.map((hostChain) => [hostChain.label, hostChain])
)

/**
 * Checked-in L2Beat project id → EVM chain id for networks L2Beat can address.
 * Membership is still proven by a live summary hit; stale ids fail closed at resolve.
 */
export const l2BeatProjectChainIds = [
	{ projectId: 'arbitrum', chainId: 42161 },
	{ projectId: 'base', chainId: 8453 },
	{ projectId: 'polygon-pos', chainId: 137 },
	{ projectId: 'hyperliquid', chainId: 999 },
	{ projectId: 'optimism', chainId: 10 },
	{ projectId: 'mantle', chainId: 5000 },
	{ projectId: 'megaeth', chainId: 4326 },
	{ projectId: 'linea', chainId: 59144 },
	{ projectId: 'ink', chainId: 57073 },
	{ projectId: 'zksync2', chainId: 324 },
	{ projectId: 'celo', chainId: 42220 },
	{ projectId: 'worldchain', chainId: 480 },
	{ projectId: 'katana', chainId: 747474 },
	{ projectId: 'fraxtal', chainId: 252 },
	{ projectId: 'blast', chainId: 81457 },
	{ projectId: 'unichain', chainId: 130 },
	{ projectId: 'mantapacific', chainId: 169 },
	{ projectId: 'lyra', chainId: 957 },
	{ projectId: 'abstract', chainId: 2741 },
	{ projectId: 'bob', chainId: 60808 },
	{ projectId: 'plumenetwork', chainId: 98866 },
	{ projectId: 'scroll', chainId: 534352 },
	{ projectId: 'lisk', chainId: 1135 },
	{ projectId: 'zircuit', chainId: 48900 },
	{ projectId: 'sophon', chainId: 50104 },
	{ projectId: 'metis', chainId: 1088 },
	{ projectId: 'morph', chainId: 2818 },
	{ projectId: 'immutablezkevm', chainId: 13371 },
	{ projectId: 'galxegravity', chainId: 1625 },
	{ projectId: 'soneium', chainId: 1868 },
	{ projectId: 'apechain', chainId: 33139 },
	{ projectId: 'nova', chainId: 42170 },
	{ projectId: 'taiko', chainId: 167000 },
	{ projectId: 'zklinknova', chainId: 810180 },
	{ projectId: 'polygonzkevm', chainId: 1101 },
	{ projectId: 'mode', chainId: 34443 },
	{ projectId: 'bobanetwork', chainId: 288 },
	{ projectId: 'zora', chainId: 7777777 },
	{ projectId: 'orderly', chainId: 291 },
	{ projectId: 'cyber', chainId: 7560 },
	{ projectId: 'zeronetwork', chainId: 543210 },
	{ projectId: 'lens', chainId: 232 },
	{ projectId: 'educhain', chainId: 41923 },
	{ projectId: 'hemi', chainId: 43111 },
	{ projectId: 'shape', chainId: 360 },
	{ projectId: 'xai', chainId: 660279 },
	{ projectId: 'shibarium', chainId: 109 },
	{ projectId: 'metal', chainId: 1750 },
	{ projectId: 'superseed', chainId: 5330 },
	{ projectId: 'superposition', chainId: 55244 },
	{ projectId: 'degen', chainId: 666666666 },
	{ projectId: 'b3', chainId: 8333 },
	{ projectId: 'phala', chainId: 2035 },
	{ projectId: 'alienx', chainId: 10241024 },
	{ projectId: 'river', chainId: 550 },
	{ projectId: 'zkfair', chainId: 42766 },
	{ projectId: 'appchain', chainId: 466 },
	{ projectId: 'zkcandy', chainId: 320 },
	{ projectId: 'playblock', chainId: 1829 },
	{ projectId: 'robinhood', chainId: 4663 },
	{ projectId: 'gnosis', chainId: 100 },
	{ projectId: 'roninnetwork', chainId: 2020 },
	{ projectId: 'xlayer', chainId: 196 },
] as const satisfies readonly {
	projectId: string
	chainId: number
}[]

export const l2BeatProjectIdByChainId = new Map(
	l2BeatProjectChainIds.map((project) => [
		String(project.chainId),
		project.projectId,
	])
)

export const l2BeatChainIdByProjectId = new Map(
	l2BeatProjectChainIds.map((project) => [
		project.projectId,
		project.chainId,
	])
)

/** Convert L2Beat summary `chart.syncedUntil` (unix seconds) to observation `timestampMs`. */
export const scalingSummarySyncedUntilMs = (syncedUntilSeconds: number) => (
	syncedUntilSeconds * 1000
)
