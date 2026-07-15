export const origin = 'https://l2beat.com'

export const l2BeatOrigins = [
	{
		origin,
		corsEnabled: false,
	},
] as const

export const scalingSummaryPath = '/api/scaling/summary'

export const ethereumChainId = 1

/**
 * L2Beat `hostChain` label → settled-on chain id (L1/L2 host for L2/L3 stacks).
 * @see https://l2beat.com/api/scaling/summary
 */
export const l2beatHostChainToParentChainId: Record<string, number> = {
	Ethereum: 1,
	'Arbitrum One': 42161,
	'Arbitrum Nova': 42170,
	'Base Chain': 8453,
	Linea: 59144,
	Scroll: 534352,
}

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
	{ projectId: 'corn', chainId: 21000000 },
	{ projectId: 'morph', chainId: 2818 },
	{ projectId: 'immutablezkevm', chainId: 13371 },
	{ projectId: 'galxegravity', chainId: 1625 },
	{ projectId: 'soneium', chainId: 1868 },
	{ projectId: 'apechain', chainId: 33139 },
	{ projectId: 'nova', chainId: 42170 },
	{ projectId: 'taiko', chainId: 167000 },
	{ projectId: 'zklinknova', chainId: 810180 },
	{ projectId: 'swell', chainId: 1923 },
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
	{ projectId: 'rari', chainId: 1380012617 },
	{ projectId: 'shibarium', chainId: 109 },
	{ projectId: 'redstone', chainId: 690 },
	{ projectId: 'metal', chainId: 1750 },
	{ projectId: 'superseed', chainId: 5330 },
	{ projectId: 'prom', chainId: 227 },
	{ projectId: 'superposition', chainId: 55244 },
	{ projectId: 'degen', chainId: 666666666 },
	{ projectId: 'b3', chainId: 8333 },
	{ projectId: 'phala', chainId: 2035 },
	{ projectId: 'alienx', chainId: 10241024 },
	{ projectId: 'river', chainId: 550 },
	{ projectId: 'zkfair', chainId: 42766 },
	{ projectId: 'appchain', chainId: 466 },
	{ projectId: 'codex', chainId: 81224 },
	{ projectId: 'everclear', chainId: 25327 },
	{ projectId: 'powerloom', chainId: 7869 },
	{ projectId: 'huddle01', chainId: 12323 },
	{ projectId: 'rarimo', chainId: 7368 },
	{ projectId: 'grvt', chainId: 325 },
	{ projectId: 'zkcandy', chainId: 320 },
	{ projectId: 'unite', chainId: 88899 },
	{ projectId: 'playblock', chainId: 1829 },
] as const satisfies readonly {
	projectId: string
	chainId: number
}[]

export const chainIdByL2BeatProjectId = Object.fromEntries(
	l2BeatProjectChainIds.map((project) => [
		project.projectId,
		project.chainId,
	])
) satisfies Partial<Record<string, number>>

export const l2BeatProjectIdByChainId = Object.fromEntries(
	l2BeatProjectChainIds.map((project) => [
		String(project.chainId),
		project.projectId,
	])
) satisfies Record<string, string>
