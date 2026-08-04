import {
	describe,
	expect,
	it,
} from 'vitest'

import uniswapContractsEvm from '$/resolvers/UniswapContracts-Evm.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	uniswapV3Pools,
} from '$/sources/Uniswap/Catalog/queries.ts'


const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 64,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const ethereumNetwork = {
	caip2: {
		namespace: 'eip155' as const,
		reference: '1',
	},
}


describe('UniswapContracts_Evm resolver', () => {
	it('registers global hub + pool resolvers', () => {
		expect(uniswapContractsEvm.source).toBe(Source.UniswapContracts_Evm)
		expect(uniswapContractsEvm.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType._Global,
			EntityType.UniswapV3Pool,
		])
	})

	it('lists seeded Uniswap V3 pools on _Global.$$uniswapV3Pools', async () => {
		const globalResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType._Global
		))
		if (globalResolver == null)
			throw new Error('missing _Global resolver')

		const snapshot = await globalResolver.resolve.Scope.resolve({
			scope: '$$uniswapV3Pools',
		}, context)

		expect(globalResolver.projections.$$uniswapV3Pools(snapshot)).toEqual(
			uniswapV3Pools.map((pool) => ({
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: String(pool.chainId),
						},
					},
					poolAddress: pool.poolAddress,
				},
			}))
		)
	})

	it('resolves a catalog pool with factory, tokens, fee, and tickSpacing', async () => {
		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool resolver')

		const snapshot = await poolResolver.resolve.NetworkPoolAddress.resolve({
			$network: ethereumNetwork,
			poolAddress: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
		}, context)

		expect(poolResolver.projections.$factory(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				address: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
			},
		})
		expect(poolResolver.projections.$token0(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		})
		expect(poolResolver.projections.$token1(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
		})
		expect(poolResolver.projections.fee(snapshot)).toBe(500)
		expect(poolResolver.projections.tickSpacing(snapshot)).toBe(10)
		expect(poolResolver.projections.$poolContract(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				address: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
			},
		})
	})

	it('rejects networks without a Uniswap V3 factory deployment', async () => {
		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool resolver')

		await expect(
			poolResolver.resolve.NetworkPoolAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999999',
					},
				},
				poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
			}, context)
		).rejects.toThrow('UniswapContracts_Evm: no Uniswap V3 factory for chain 999999')
	})

	it('rejects pools absent from the Uniswap V3 catalog on a supported chain', async () => {
		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool resolver')

		await expect(
			poolResolver.resolve.NetworkPoolAddress.resolve({
				$network: ethereumNetwork,
				poolAddress: `0x${'f'.repeat(40)}`,
			}, context)
		).rejects.toThrow('UniswapContracts_Evm: pool 0xffffffffffffffffffffffffffffffffffffffff not in Uniswap V3 catalog for chain 1')
	})

	it('does not claim soft-empty $$blocks or $$positions facets', () => {
		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool resolver')

		expect(poolResolver.projections).not.toHaveProperty('$$blocks')
		expect(poolResolver.projections).not.toHaveProperty('$$positions')
	})
})
