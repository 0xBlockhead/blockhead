import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Dexscreener/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getLatestPairs = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Dexscreener/OpenApi/queries.ts', () => ({
	getLatestPairs,
	getPairSearch: vi.fn(),
}))

const { default: dexscreener } = await import('$/resolvers/Dexscreener-OpenApi.ts')

const dexscreenerBinding = bindings[Source.Dexscreener_OpenApi]

describe('Dexscreener liquidity pool observation clock', () => {
	it('uses the source resolution time rather than a separate wall clock', async () => {
		const resolver = dexscreener.resolvers.find((candidate) => (
			candidate.entityType === EntityType.LiquidityPool
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Dexscreener_OpenApi: missing LiquidityPool $$timestamps resolver')
		getLatestPairs.mockResolvedValue({
			pairs: [{
				resolvedAtMs: 1_725_000_000_000,
			}],
		})

		await expect(
			resolver.resolve['EvmNetworkId'].resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				id: '0x1111111111111111111111111111111111111111',
			}, {
				filters: [],
				sorts: [],
				pagination: {},
				selectorKeys: [],
				parentSelectorKeys: [],
				sources: [],
				publicEnv: {},
			})
		).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$liquidityPool: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					id: '0x1111111111111111111111111111111111111111',
				},
				timestampMs: 1_725_000_000_000,
				feedKey: 'dexscreener',
			},
		}])
		expect(getLatestPairs).toHaveBeenCalledWith({
			chainId: 'ethereum',
			pairId: '0x1111111111111111111111111111111111111111',
		})
	})
})
