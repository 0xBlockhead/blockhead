import type { components } from '$/sources/Wormholescan/OpenApi/openapi.d.ts'

export type WormholescanOperation = components['schemas']['operations.OperationResponse']

export type WormholescanOperationsPage = {
	operations: WormholescanOperation[]
}

export type WormholescanWormholeChainId = components['schemas']['vaa.ChainID']

/** Wormhole chain id → EVM `eip155` reference for chains that are EVM execution networks. */
export const eip155ReferenceByWormholeChainId = {
	2: '1',
	4: '56',
	5: '137',
	6: '43114',
	10: '250',
	14: '42220',
	16: '1284',
	23: '42161',
	24: '10',
	25: '59144',
	30: '8453',
} as const satisfies Partial<Record<WormholescanWormholeChainId, string>>
