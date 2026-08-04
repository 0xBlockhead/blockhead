/**
 * GMX V2 API deployment catalog (chain → HTTP hosts).
 * @see https://docs.gmx.io/docs/api/overview/
 * @see https://docs.gmx.io/docs/api/integration-guide/
 */


// Types


type GmxApiDeployment = {
	chainId: number
	key: string
	slug: string
	name: string
	apiBaseUrl: string
	peerApiBaseUrl: string
}


// Constants


/** Documented GMX V2 networks with GMX API peer base URLs (`/v1` included). */
export const gmxApiDeployments = [
	{
		chainId: 42161,
		key: '42161',
		slug: 'arbitrum',
		name: 'Arbitrum One',
		apiBaseUrl: 'https://arbitrum.gmxapi.io/v1',
		peerApiBaseUrl: 'https://arbitrum.gmxapi.ai/v1',
	},
	{
		chainId: 43114,
		key: '43114',
		slug: 'avalanche',
		name: 'Avalanche C-Chain',
		apiBaseUrl: 'https://avalanche.gmxapi.io/v1',
		peerApiBaseUrl: 'https://avalanche.gmxapi.ai/v1',
	},
	{
		chainId: 4326,
		key: '4326',
		slug: 'megaeth',
		name: 'MegaETH',
		apiBaseUrl: 'https://megaeth.gmxapi.io/v1',
		peerApiBaseUrl: 'https://megaeth.gmxapi.ai/v1',
	},
] as const satisfies readonly GmxApiDeployment[]

/** Fail-closed ceiling for `GET /markets/info` array size. */
export const gmxMarketsInfoResponseMax = 500


// Lookups


export const gmxApiByChainId = Object.fromEntries(
	gmxApiDeployments.map((deployment) => [
		deployment.chainId,
		deployment,
	])
)
