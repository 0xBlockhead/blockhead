import { expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const { getPool } = vi.hoisted(() => ({ getPool: vi.fn() }))
vi.mock('$/sources/TheGraph/Messari/pool.ts', async importOriginal => ({
	...await importOriginal<object>(),
	getPool,
}))

import messariResolvers from './Messari-TheGraph.ts'
import { messariGraphqlProfiles } from '$/sources/TheGraph/Messari/direct.ts'

const feeScheduleResolver = messariResolvers.resolvers.find(resolver => resolver.entityType === EntityType.LiquidityPoolFeeSchedule)!
const feeObservationResolver = messariResolvers.resolvers.find(resolver => resolver.entityType === EntityType.LiquidityPoolFeeSchedule_EvmBlock)!
const $network = { caip2: { namespace: 'eip155', reference: '42161' } } as const
const poolId = '0x' + 'ab'.repeat(20)
const blockHash = '0x' + '12'.repeat(32)

for (const deployment of ['uniswap-v3-arbitrum', 'sushiswap-v3-arbitrum'] as const) {
	it(`materializes and exactly reloads a fixed fee schedule for ${deployment}`, async () => {
		const profile = messariGraphqlProfiles[deployment]
		const response = {
			profile,
			requestedPoolId: poolId,
			block: { number: 123, hash: blockHash, timestamp: 1_800_000_000 },
			sourceRevision: `thegraph:${profile.deployment}`,
			pool: {
				id: poolId,
				name: 'Fixture pool',
				symbol: 'FIX',
				isSingleSided: false,
				createdTimestamp: '1',
				createdBlockNumber: '1',
				protocol: {
					id: profile.protocolId,
					network: profile.network,
					schemaVersion: profile.schemaVersion,
					subgraphVersion: profile.subgraphVersion,
					methodologyVersion: profile.methodologyVersion,
				},
				inputTokens: [],
				inputTokenBalances: [],
				inputTokenBalancesUSD: [],
				inputTokenWeights: [],
				fees: [{ id: `FIXED_TRADING_FEE-${poolId}`, feePercentage: '0.300000000000000000', feeType: 'FIXED_TRADING_FEE' }],
				totalValueLockedUSD: '1',
				cumulativeVolumeUSD: '2',
				cumulativeSupplySideRevenueUSD: '3',
				cumulativeProtocolSideRevenueUSD: '4',
				cumulativeTotalRevenueUSD: '7',
			},
		} as const
		const $pool = { $network, id: poolId } as const
		getPool.mockImplementation(async ({ deployment: candidate }: { deployment: typeof deployment }) => candidate === deployment ? response : { ...response, pool: null })
		const result = await feeScheduleResolver.resolve.PoolFeeType.resolve({ $pool, feeType: 'FIXED_TRADING_FEE' })
		expect(feeScheduleResolver.projections.feePercentage(result)).toBe('0.300000000000000000')
		const [observation] = feeScheduleResolver.projections.$$observations(result)
		expect(observation[EntityMetaKey.Selector].sourceRevision).toBe(`thegraph:${profile.deployment}`)
		const exact = await feeObservationResolver.resolve.ScheduleBlockRevision.resolve(observation[EntityMetaKey.Selector])
		expect(feeObservationResolver.projections.feePercentage(exact)).toBe('0.300000000000000000')
		expect(getPool.mock.calls.at(-1)?.[0]).toMatchObject({ deployment, id: poolId, blockHash })
	})
}
