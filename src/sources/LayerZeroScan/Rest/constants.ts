/**
 * LayerZero V2 mainnet EVM endpoint id → native chain id.
 * @see https://docs.layerzero.network/v2/deployments/deployed-contracts
 * @see https://docs.layerzero.network/v2/deployments/evm-chains/arbitrum-mainnet-oft-quickstart
 */
export const layerZeroEvmEndpoints = [
	{ endpointId: 30101, chainId: 1, chainKey: 'ethereum' },
	{ endpointId: 30102, chainId: 56, chainKey: 'bsc' },
	{ endpointId: 30106, chainId: 43114, chainKey: 'avalanche' },
	{ endpointId: 30109, chainId: 137, chainKey: 'polygon' },
	{ endpointId: 30110, chainId: 42161, chainKey: 'arbitrum' },
	{ endpointId: 30111, chainId: 10, chainKey: 'optimism' },
	{ endpointId: 30112, chainId: 250, chainKey: 'fantom' },
	{ endpointId: 30125, chainId: 42220, chainKey: 'celo' },
	{ endpointId: 30145, chainId: 100, chainKey: 'gnosis' },
	{ endpointId: 30151, chainId: 1088, chainKey: 'metis' },
	{ endpointId: 30158, chainId: 1101, chainKey: 'polygon-zkevm' },
	{ endpointId: 30175, chainId: 42170, chainKey: 'arbitrum-nova' },
	{ endpointId: 30181, chainId: 5000, chainKey: 'mantle' },
	{ endpointId: 30183, chainId: 59144, chainKey: 'linea' },
	{ endpointId: 30184, chainId: 8453, chainKey: 'base' },
	{ endpointId: 30195, chainId: 7777777, chainKey: 'zora' },
	{ endpointId: 30202, chainId: 204, chainKey: 'opbnb' },
	{ endpointId: 30214, chainId: 534352, chainKey: 'scroll' },
	{ endpointId: 30217, chainId: 169, chainKey: 'manta' },
] as const


export const layerZeroEvmChainIdByEndpointId = Object.fromEntries(
	layerZeroEvmEndpoints.map(({ endpointId, chainId }) => [endpointId, chainId])
)
