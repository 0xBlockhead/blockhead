// Types

/**
 * Blockscout REST API v2 base path.
 * @see https://docs.blockscout.com/devs/apis/rest
 */

/**
 * Blockscout-operated explorer hosts that expose REST v2 at `origin` + `restPath` + `…`. Labels follow
 * Blockscout featured-networks; `host` is the explorer hostname only (no scheme).
 *
 * @see https://github.com/blockscout/frontend-configs/tree/main/configs/featured-networks
 */


// Constants

export const restPath = '/api/v2'

/**
 * `GET {explorerOrigin}` + `restPath` + `…` is Blockscout’s own HTTP API. Other block-explorer UIs
 * (custom domains, different products) do not serve this path — use chain RPC and/or that product’s client instead.
 */
export const blockscoutRestV2AtExplorerOrigin = (explorerOrigin: string): boolean => {
	const h = new URL(explorerOrigin).hostname.toLowerCase()
	return h.endsWith('.blockscout.com') || h.endsWith('.blockscout.org')
}

export const blockscoutHostedNetworks = [
	{
		chainId: 1,
		label: 'Ethereum',
		host: 'eth.blockscout.com',
	},
	{
		chainId: 5,
		label: 'Goerli',
		host: 'eth-goerli.blockscout.com',
	},
	{
		chainId: 10,
		label: 'Optimism',
		host: 'optimism.blockscout.com',
	},
	{
		chainId: 56,
		label: 'BNB Smart Chain',
		host: 'bnb.blockscout.com',
	},
	{
		chainId: 100,
		label: 'Gnosis Chain',
		host: 'gnosis.blockscout.com',
	},
	{
		chainId: 137,
		label: 'Polygon',
		host: 'polygon.blockscout.com',
	},
	{
		chainId: 8453,
		label: 'Base Chain',
		host: 'base.blockscout.com',
	},
	{
		chainId: 42161,
		label: 'Arbitrum One',
		host: 'arbitrum.blockscout.com',
	},
	{
		chainId: 11155111,
		label: 'Sepolia',
		host: 'eth-sepolia.blockscout.com',
	},
	{
		chainId: 17000,
		label: 'Holesky',
		host: 'eth-holesky.blockscout.com',
	},
	{
		chainId: 84532,
		label: 'Base Sepolia',
		host: 'base-sepolia.blockscout.com',
	},
] as const satisfies readonly {
	chainId: number
	label: string
	host: string
}[]


// Lookups

export const blockscoutExplorerOriginByChainId = Object.fromEntries(
	blockscoutHostedNetworks
		.map((entry) => [
			entry.chainId,
			`https://${entry.host}`,
		]),
) as Record<
	(typeof blockscoutHostedNetworks)[number]['chainId'],
	string
>

export const blockscoutExplorerOriginForChain = (
	chainId: number,
): string | undefined => {
	const v = (blockscoutExplorerOriginByChainId as Record<number, string | undefined>)[chainId]
	return typeof v === 'string' ? v : undefined
}
