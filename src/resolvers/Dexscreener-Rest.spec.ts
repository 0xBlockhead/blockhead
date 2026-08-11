import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Dexscreener/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getLatestPairs = vi.hoisted(() => vi.fn())
const getPairSearch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Dexscreener/OpenApi/queries.ts', () => ({
	getLatestPairs,
	getPairSearch,
}))

const { default: dexscreener } = await import('$/resolvers/Dexscreener-Rest.ts')

const dexscreenerBinding = bindings[Source.Dexscreener_Rest][0]

const poolSelector = {
	$network: {
		caip2: {
			namespace: 'eip155' as const,
			reference: '1',
		},
	},
	id: '0x1111111111111111111111111111111111111111',
}

const emptyContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Dexscreener liquidity pool observation clock', () => {
	it('does not claim Uniswap-shaped LiquidityPool_Block provenance', () => {
		expect(
			dexscreener.resolvers.some((candidate) => (
				candidate.entityType === EntityType.LiquidityPool_Block
			))
		).toBe(false)
		expect(dexscreenerBinding.source).toBe(Source.Dexscreener_Rest)
	})

	it('uses the source resolution time rather than a separate wall clock', async () => {
		const resolver = dexscreener.resolvers.find((candidate) => (
			candidate.entityType === EntityType.LiquidityPool
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Dexscreener_Rest: missing LiquidityPool $$timestamps resolver')
		getLatestPairs.mockResolvedValue({
			pairs: [{
				baseToken: {
					address: '0x2222222222222222222222222222222222222222',
					symbol: 'WETH',
				},
				quoteToken: {
					address: '0x3333333333333333333333333333333333333333',
					symbol: 'USDC',
				},
				resolvedAtMs: 1_725_000_000_000,
				pairCreatedAt: 1_700_000_000_000,
				labels: ['v3'],
				dexId: 'uniswap',
				url: 'https://dexscreener.com/ethereum/0x1111111111111111111111111111111111111111',
				priceUsd: '3500.1',
				priceNative: '1',
				liquidity: {
					usd: 9_000_000,
				},
				volume: {
					h24: 1_000_000,
				},
				priceChange: {
					h24: -1.5,
				},
				txns: {
					h24: {
						buys: 10,
						sells: 4,
					},
				},
				marketCap: 3_000_000_000,
				fdv: 4_000_000_000,
			}],
		})

		const snapshot = await resolver.resolve['EvmNetworkId'].resolve(
			poolSelector,
			emptyContext,
		)
		expect(resolver.projections.$$timestamps.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$liquidityPool: poolSelector,
				timestampMs: 1_725_000_000_000,
				feedKey: 'dexscreener',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'baseTokenSymbol')]: 'WETH',
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'quoteTokenSymbol')]: 'USDC',
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'pairCreatedAtMs')]: 1_700_000_000_000,
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'dexscreenerLabels')]: ['v3'],
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'dexId')]: 'uniswap',
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'dexscreenerPairUrl')]: 'https://dexscreener.com/ethereum/0x1111111111111111111111111111111111111111',
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'priceUsd')]: '3500.1',
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'priceNative')]: '1',
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'liquidityUsd')]: 9_000_000,
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'volumeUsd24h')]: 1_000_000,
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'priceChangePercent24h')]: -1.5,
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'transactionBuys24h')]: 10,
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'transactionSells24h')]: 4,
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'marketCapUsd')]: 3_000_000_000,
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'fdvUsd')]: 4_000_000_000,
				[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'transport')]: 'Dexscreener OpenAPI',
			},
		}])
		expect(resolver.projections.$$timestamps.resolveCount?.(snapshot)).toBe(1)
		expect(getLatestPairs).toHaveBeenCalledWith({
			chainId: 'ethereum',
			pairId: '0x1111111111111111111111111111111111111111',
		})
	})

	it('does not refetch an arbitrary liquidity-pool timestamp', () => {
		expect(dexscreener.resolvers.some((candidate) => (
			candidate.entityType === EntityType.LiquidityPool_Timestamp
			&& 'priceUsd' in candidate.projections
		))).toBe(false)
	})

	it('rejects global liquidity-pool search that returns no mapped EVM pools', async () => {
		const resolver = dexscreener.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$liquidityPools' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Dexscreener_Rest: missing _Global $$liquidityPools resolver')
		getPairSearch.mockResolvedValue({
			pairs: [{
				chainId: 'solana',
				pairAddress: 'So11111111111111111111111111111111111111112',
			}],
		})
		await expect(resolver.resolve['Scope'].resolve(
			{},
			emptyContext,
		)).rejects.toThrow('returned no liquidity pools')
	})

	it('filters global liquidity-pool search rows to mapped EVM chains', async () => {
		const resolver = dexscreener.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$liquidityPools' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Dexscreener_Rest: missing _Global $$liquidityPools resolver')
		getPairSearch.mockResolvedValue({
			pairs: [
				{
					chainId: 'solana',
					pairAddress: 'So11111111111111111111111111111111111111112',
				},
				{
					chainId: 'ethereum',
					pairAddress: poolSelector.id,
				},
			],
		})

		const snapshot = await resolver.resolve['Scope'].resolve(
			{},
			emptyContext,
		)
		expect(resolver.projections.$$liquidityPools.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: poolSelector,
		}])
		expect(resolver.projections.$$liquidityPools.resolveCount?.(snapshot)).toBe(1)
	})

	it('hard-fails invalid pair token addresses instead of soft-omitting legs', async () => {
		const resolver = dexscreener.resolvers.find((candidate) => (
			candidate.entityType === EntityType.LiquidityPool
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Dexscreener_Rest: missing LiquidityPool $$timestamps resolver')
		getLatestPairs.mockResolvedValue({
			pairs: [{
				baseToken: {
					address: 'not-an-address',
				},
				quoteToken: {
					address: '0x3333333333333333333333333333333333333333',
				},
				resolvedAtMs: 1_725_000_000_000,
			}],
		})
		await expect(resolver.resolve['EvmNetworkId'].resolve(
			poolSelector,
			emptyContext,
		)).rejects.toThrow('not valid EVM addresses')
	})

	it('does not claim soft-empty $$blocks or $$leverages facets', () => {
		const resolver = dexscreener.resolvers.find((candidate) => (
			candidate.entityType === EntityType.LiquidityPool
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Dexscreener_Rest: missing LiquidityPool $$timestamps resolver')
		expect(resolver.projections).not.toHaveProperty('$$blocks')
		expect(resolver.projections).not.toHaveProperty('$$leverages')
		expect(resolver.projections).not.toHaveProperty('fee')
		expect(resolver.projections).not.toHaveProperty('tickSpacing')
	})
})
