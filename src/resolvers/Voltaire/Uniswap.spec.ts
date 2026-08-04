import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'


const getCall = vi.hoisted(() => vi.fn())

const getPoolFactory = vi.hoisted(() => vi.fn())
const getPoolToken0 = vi.hoisted(() => vi.fn())
const getPoolToken1 = vi.hoisted(() => vi.fn())
const getPoolFee = vi.hoisted(() => vi.fn())
const getPoolTickSpacing = vi.hoisted(() => vi.fn())
const getPoolLiquidity = vi.hoisted(() => vi.fn())
const getPoolSlot0 = vi.hoisted(() => vi.fn())
const getFactoryPool = vi.hoisted(() => vi.fn())
const getPosition = vi.hoisted(() => vi.fn())
const getPositionOwner = vi.hoisted(() => vi.fn())
const normalizeUniswapAddress = vi.hoisted(() => (
	(value: string) => value.toLowerCase() as `0x${string}`
))

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
		httpTransportsByChainId: {
			1: [
				{
					diagnosticLabel: 'mock-rpc',
					getCall,
				},
			],
		},
	},
}))

vi.mock('$/sources/Uniswap/Contracts/queries.ts', () => ({
	getPoolFactory,
	getPoolToken0,
	getPoolToken1,
	getPoolFee,
	getPoolTickSpacing,
	getPoolLiquidity,
	getPoolSlot0,
	getFactoryPool,
	getPosition,
	getPositionOwner,
	normalizeUniswapAddress,
}))

const { uniswapV3Resolvers } = await import('$/resolvers/Voltaire/Uniswap.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
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

const poolAddress = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'
const factoryAddress = '0x1f98431c8ad98523631ae4a59f267346ea31f984'
const token0 = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const token1 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const positionManager = '0xc36442b4a4522e871399cd717abdd847ab11fe88'


describe('Voltaire Uniswap V3 resolvers', () => {
	beforeEach(() => {
		getCall.mockReset()
		getPoolFactory.mockReset()
		getPoolToken0.mockReset()
		getPoolToken1.mockReset()
		getPoolFee.mockReset()
		getPoolTickSpacing.mockReset()
		getPoolLiquidity.mockReset()
		getPoolSlot0.mockReset()
		getFactoryPool.mockReset()
		getPosition.mockReset()
		getPositionOwner.mockReset()
		getCall.mockResolvedValue('0x')
	})

	it('registers pool, pool-block, position, and position-block resolvers without soft-empty many facets', () => {
		expect(uniswapV3Resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.UniswapV3Pool,
			EntityType.UniswapV3Pool_Block,
			EntityType.UniswapV3Position,
			EntityType.UniswapV3Position_Block,
		])

		const poolResolver = uniswapV3Resolvers[0]
		expect(poolResolver.projections).not.toHaveProperty('$$blocks')
		expect(poolResolver.projections).not.toHaveProperty('$$positions')

		const positionResolver = uniswapV3Resolvers[2]
		expect(positionResolver.projections).not.toHaveProperty('$$blocks')
	})

	it('resolves pool identity from eth_call helpers and omits list facets', async () => {
		getPoolFactory.mockResolvedValue(factoryAddress)
		getPoolToken0.mockResolvedValue(token0)
		getPoolToken1.mockResolvedValue(token1)
		getPoolFee.mockResolvedValue(500)
		getPoolTickSpacing.mockResolvedValue(10)

		const poolResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool resolver')

		const snapshot = await poolResolver.resolve.NetworkPoolAddress.resolve({
			$network: ethereumNetwork,
			poolAddress,
		}, context)

		expect(poolResolver.projections.$factory(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				address: factoryAddress,
			},
		})
		expect(poolResolver.projections.$token0(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				address: token0,
			},
		})
		expect(poolResolver.projections.fee(snapshot)).toBe(500)
		expect(poolResolver.projections.tickSpacing(snapshot)).toBe(10)
		expect(snapshot).not.toHaveProperty('$$blocks')
		expect(snapshot).not.toHaveProperty('$$positions')
	})

	it('resolves pool block slot0 + liquidity', async () => {
		getPoolSlot0.mockResolvedValue({
			sqrtPriceX96: 100n,
			tick: 12,
			observationIndex: 1,
			observationCardinality: 2,
			observationCardinalityNext: 3,
			feeProtocol: 0,
			unlocked: true,
		})
		getPoolLiquidity.mockResolvedValue(64n)

		const blockResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool_Block
		))
		if (blockResolver == null)
			throw new Error('missing UniswapV3Pool_Block resolver')

		const snapshot = await blockResolver.resolve.PoolBlockNumber.resolve({
			$pool: {
				$network: ethereumNetwork,
				poolAddress,
			},
			blockNumber: 1n,
		}, context)

		expect(blockResolver.projections.sqrtPriceX96(snapshot)).toBe(100n)
		expect(blockResolver.projections.liquidity(snapshot)).toBe(64n)
		expect(blockResolver.projections.tick(snapshot)).toBe(12)
		expect(blockResolver.projections.unlocked(snapshot)).toBe(true)
	})

	it('resolves position ticks and pool via factory getPool', async () => {
		getPosition.mockResolvedValue({
			token0,
			token1,
			fee: 500,
			tickLower: -60,
			tickUpper: 60,
			liquidity: 1n,
			tokensOwed0: 0n,
			tokensOwed1: 0n,
		})
		getFactoryPool.mockResolvedValue(poolAddress)

		const positionResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Position
		))
		if (positionResolver == null)
			throw new Error('missing UniswapV3Position resolver')

		const snapshot = await positionResolver.resolve.PositionManagerTokenId.resolve({
			positionManager,
			tokenId: 7n,
		}, context)

		expect(positionResolver.projections.$pool(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				poolAddress,
			},
		})
		expect(positionResolver.projections.tickLower(snapshot)).toBe(-60)
		expect(positionResolver.projections.tickUpper(snapshot)).toBe(60)
		expect(snapshot).not.toHaveProperty('$$blocks')
	})

	it('throws when JSON-RPC transports are missing for the pool chain', async () => {
		const poolResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool resolver')

		await expect(
			poolResolver.resolve.NetworkPoolAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '8453',
					},
				},
				poolAddress,
			}, context)
		).rejects.toThrow('Voltaire_JsonRpc: no JSON-RPC URL for UniswapV3Pool on chain 8453')
	})
})
