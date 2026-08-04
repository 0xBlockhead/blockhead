/**
 * Wormhole chain id → EVM `eip155` reference for chains that are EVM execution networks.
 * @see https://docs.wormhole.com/wormhole/reference/constants
 */

import type { WormholescanWormholeChainId } from '$/sources/Wormholescan/Rest/types.ts'


// Constants

export const wormholeEvmChains = [
	{ wormholeChainId: 2, eip155Reference: '1' },
	{ wormholeChainId: 4, eip155Reference: '56' },
	{ wormholeChainId: 5, eip155Reference: '137' },
	{ wormholeChainId: 6, eip155Reference: '43114' },
	{ wormholeChainId: 10, eip155Reference: '250' },
	{ wormholeChainId: 14, eip155Reference: '42220' },
	{ wormholeChainId: 16, eip155Reference: '1284' },
	{ wormholeChainId: 23, eip155Reference: '42161' },
	{ wormholeChainId: 24, eip155Reference: '10' },
	{ wormholeChainId: 25, eip155Reference: '59144' },
	{ wormholeChainId: 30, eip155Reference: '8453' },
] as const satisfies readonly {
	wormholeChainId: WormholescanWormholeChainId
	eip155Reference: string
}[]


// Lookups

export const wormholeEvmChainByWormholeChainId = Object.fromEntries(
	wormholeEvmChains.map((row) => [row.wormholeChainId, row])
)
