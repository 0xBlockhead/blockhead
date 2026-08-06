import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import uniswapContractsEvm from '$/resolvers/UniswapContracts-Evm.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	uniswapV3Pools,
} from '$/sources/Uniswap/Catalog/constants.ts'


const getLogs = vi.hoisted(() => vi.fn())
const getPosition = vi.hoisted(() => vi.fn())
const getFactoryPool = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
		httpTransportsByChainId: {
			1: [{
				diagnosticLabel: 'mock-rpc',
				getLogs,
				getCall: vi.fn(),
			}],
		},
	},
}))

vi.mock('$/sources/Uniswap/Contracts/queries.ts', async () => {
	const actual = await vi.importActual<typeof import('$/sources/Uniswap/Contracts/queries.ts')>('$/sources/Uniswap/Contracts/queries.ts')
	return {
		...actual,
		getPosition,
		getFactoryPool,
	}
})


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

const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'


describe('UniswapContracts_Evm resolver', () => {
	beforeEach(() => {
		getLogs.mockReset()
		getPosition.mockReset()
		getFactoryPool.mockReset()
		getLogs.mockResolvedValue([])
	})

	it('registers global hub + pool resolvers', () => {
		expect(uniswapContractsEvm.source).toBe(Source.UniswapContracts_Evm)
		expect(uniswapContractsEvm.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType._Global,
			EntityType.UniswapV3Pool,
			EntityType.UniswapV3Pool,
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
			&& 'NetworkPoolAddress' in resolver.resolve
			&& '$factory' in resolver.projections
			&& !('$$positions' in resolver.projections)
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool catalog resolver')

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

	it('resolves Base catalog pools against Base-native factory deployment', async () => {
		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& 'NetworkPoolAddress' in resolver.resolve
			&& '$factory' in resolver.projections
			&& !('$$positions' in resolver.projections)
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool catalog resolver')

		const baseNetwork = {
			caip2: {
				namespace: 'eip155' as const,
				reference: '8453',
			},
		}
		const snapshot = await poolResolver.resolve.NetworkPoolAddress.resolve({
			$network: baseNetwork,
			poolAddress: '0xd0b53d9277642d899dd5c92cfd4e0a7d3a6a6c3b',
		}, context)

		expect(poolResolver.projections.$factory(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: baseNetwork,
				address: '0x33128a8fc17869897dce68ed026d694621f6fdfd',
			},
		})
		expect(poolResolver.projections.fee(snapshot)).toBe(500)
		expect(poolResolver.projections.tickSpacing(snapshot)).toBe(10)
	})

	it('rejects networks without a Uniswap V3 factory deployment', async () => {
		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& 'NetworkPoolAddress' in resolver.resolve
			&& '$factory' in resolver.projections
			&& !('$$positions' in resolver.projections)
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool catalog resolver')

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
			&& 'NetworkPoolAddress' in resolver.resolve
			&& '$factory' in resolver.projections
			&& !('$$positions' in resolver.projections)
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool catalog resolver')

		await expect(
			poolResolver.resolve.NetworkPoolAddress.resolve({
				$network: ethereumNetwork,
				poolAddress: `0x${'f'.repeat(40)}`,
			}, context)
		).rejects.toThrow('UniswapContracts_Evm: pool 0xffffffffffffffffffffffffffffffffffffffff not in Uniswap V3 catalog for chain 1')
	})


	it('resolves Token0Token1Fee from the seeded catalog', async () => {
		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& 'Token0Token1Fee' in resolver.resolve
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool Token0Token1Fee resolver')

		const snapshot = await poolResolver.resolve.Token0Token1Fee.resolve({
			$token0: {
				$network: ethereumNetwork,
				address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			$token1: {
				$network: ethereumNetwork,
				address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			fee: 500,
		}, context)

		expect(poolResolver.projections.poolAddress(snapshot)).toBe('0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640')
		expect(poolResolver.projections.tickSpacing(snapshot)).toBe(10)
		expect(poolResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: ethereumNetwork,
		})
	})

	it('lists current NFPM positions scoped to the pool from Transfer logs', async () => {
		getLogs.mockResolvedValue([{
			transactionHash: `0x${'1'.repeat(64)}`,
			topics: [
				transferTopic,
				`0x${'0'.repeat(64)}`,
				`0x${'1'.repeat(24)}1111111111111111111111111111111111111111`,
				`0x${'0'.repeat(63)}7`,
			],
		}])
		getPosition.mockResolvedValue({
			token0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			fee: 500,
			tickLower: -60,
			tickUpper: 60,
			liquidity: 1n,
			feeGrowthInside0LastX128: 0n,
			feeGrowthInside1LastX128: 0n,
			tokensOwed0: 0n,
			tokensOwed1: 0n,
		})
		getFactoryPool.mockResolvedValue('0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640')

		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& typeof resolver.projections.$$positions === 'object'
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool resolver')

		const snapshot = await poolResolver.resolve.NetworkPoolAddress.resolve({
			$network: ethereumNetwork,
			poolAddress: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
		}, context)

		expect(poolResolver.projections.$$positions.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
				tokenId: 7n,
			},
		}])
	})

	it('fails closed when the position log endpoint fails', async () => {
		getLogs.mockRejectedValue(new Error('range unavailable'))

		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& typeof resolver.projections.$$positions === 'object'
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool positions resolver')

		await expect(
			poolResolver.resolve.NetworkPoolAddress.resolve({
				$network: ethereumNetwork,
				poolAddress: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
			}, context)
		).rejects.toThrow('UniswapContracts_Evm: all position log endpoints failed')
	})

	it('does not claim soft-empty $$blocks facet', () => {
		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& typeof resolver.projections.$$positions === 'object'
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool resolver')

		expect(poolResolver.projections).not.toHaveProperty('$$blocks')
		expect(poolResolver.projections).toHaveProperty('$$positions')
	})
})
