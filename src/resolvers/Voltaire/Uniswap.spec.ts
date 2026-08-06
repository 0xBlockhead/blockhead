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
const getBlockNumber = vi.hoisted(() => vi.fn())

const getPoolFactory = vi.hoisted(() => vi.fn())
const getPoolToken0 = vi.hoisted(() => vi.fn())
const getPoolToken1 = vi.hoisted(() => vi.fn())
const getPoolFee = vi.hoisted(() => vi.fn())
const getPoolTickSpacing = vi.hoisted(() => vi.fn())
const getPoolLiquidity = vi.hoisted(() => vi.fn())
const getPoolFeeGrowthGlobal0X128 = vi.hoisted(() => vi.fn())
const getPoolFeeGrowthGlobal1X128 = vi.hoisted(() => vi.fn())
const getPoolProtocolFees = vi.hoisted(() => vi.fn())
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
					getBlockNumber,
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
	getPoolFeeGrowthGlobal0X128,
	getPoolFeeGrowthGlobal1X128,
	getPoolProtocolFees,
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
		getBlockNumber.mockReset()
		getPoolFactory.mockReset()
		getPoolToken0.mockReset()
		getPoolToken1.mockReset()
		getPoolFee.mockReset()
		getPoolTickSpacing.mockReset()
		getPoolLiquidity.mockReset()
		getPoolFeeGrowthGlobal0X128.mockReset()
		getPoolFeeGrowthGlobal1X128.mockReset()
		getPoolProtocolFees.mockReset()
		getPoolSlot0.mockReset()
		getFactoryPool.mockReset()
		getPosition.mockReset()
		getPositionOwner.mockReset()
		getCall.mockResolvedValue('0x')
		getBlockNumber.mockResolvedValue(12_345_678n)
	})

	it('registers pool identity, Token0Token1Fee, tip $$blocks, pool-block, position, tip $$blocks, and position-block resolvers', () => {
		expect(uniswapV3Resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.UniswapV3Pool,
			EntityType.UniswapV3Pool,
			EntityType.UniswapV3Pool,
			EntityType.UniswapV3Pool_Block,
			EntityType.UniswapV3Position,
			EntityType.UniswapV3Position,
			EntityType.UniswapV3Position_Block,
		])

		const poolResolvers = uniswapV3Resolvers.filter((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
		))
		expect(poolResolvers.some((resolver) => '$$blocks' in resolver.projections)).toBe(true)
		expect(poolResolvers.some((resolver) => 'Token0Token1Fee' in resolver.resolve)).toBe(true)
		expect(poolResolvers.every((resolver) => !('$$positions' in resolver.projections))).toBe(true)

		const positionResolvers = uniswapV3Resolvers.filter((resolver) => (
			resolver.entityType === EntityType.UniswapV3Position
		))
		expect(positionResolvers.some((resolver) => '$$blocks' in resolver.projections)).toBe(true)
	})

	it('resolves pool identity from eth_call helpers without soft-empty many facets', async () => {
		getPoolFactory.mockResolvedValue(factoryAddress)
		getPoolToken0.mockResolvedValue(token0)
		getPoolToken1.mockResolvedValue(token1)
		getPoolFee.mockResolvedValue(500)
		getPoolTickSpacing.mockResolvedValue(10)

		const poolResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& 'NetworkPoolAddress' in resolver.resolve
			&& '$factory' in resolver.projections
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool identity resolver')

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

	it('resolves Token0Token1Fee via factory getPool and projects poolAddress', async () => {
		getFactoryPool.mockResolvedValue(poolAddress)
		getPoolTickSpacing.mockResolvedValue(10)

		const poolResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& 'Token0Token1Fee' in resolver.resolve
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool Token0Token1Fee resolver')

		const snapshot = await poolResolver.resolve.Token0Token1Fee.resolve({
			$token0: {
				$network: ethereumNetwork,
				address: token0,
			},
			$token1: {
				$network: ethereumNetwork,
				address: token1,
			},
			fee: 500,
		}, context)

		expect(poolResolver.projections.poolAddress(snapshot)).toBe(poolAddress)
		expect(poolResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: ethereumNetwork,
		})
		expect(poolResolver.projections.tickSpacing(snapshot)).toBe(10)
		expect(getFactoryPool).toHaveBeenCalledWith(expect.objectContaining({
			factoryAddress,
			token0,
			token1,
			fee: 500,
		}))
	})

	it('projects tip UniswapV3Pool.$$blocks from eth_blockNumber', async () => {
		const poolResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& '$$blocks' in resolver.projections
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool $$blocks resolver')

		const snapshot = await poolResolver.resolve.NetworkPoolAddress.resolve({
			$network: ethereumNetwork,
			poolAddress,
		}, context)

		expect(poolResolver.projections.$$blocks.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$pool: {
						$network: ethereumNetwork,
						poolAddress,
					},
					blockNumber: 12_345_678n,
				},
			},
		])
		expect(poolResolver.projections.$$blocks.resolveCount(snapshot)).toBe(1)
		expect(getBlockNumber).toHaveBeenCalled()
	})

	it('rejects a pool whose factory is not the chain deployment', async () => {
		getPoolFactory.mockResolvedValue('0x1111111111111111111111111111111111111111')
		getPoolToken0.mockResolvedValue(token0)
		getPoolToken1.mockResolvedValue(token1)
		getPoolFee.mockResolvedValue(500)
		getPoolTickSpacing.mockResolvedValue(10)

		const poolResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& 'NetworkPoolAddress' in resolver.resolve
			&& '$factory' in resolver.projections
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool identity resolver')

		await expect(
			poolResolver.resolve.NetworkPoolAddress.resolve({
				$network: ethereumNetwork,
				poolAddress,
			}, context)
		).rejects.toThrow('UniswapContracts_Evm: pool 0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640 factory does not match Uniswap V3 deployment on chain 1')
	})

	it('resolves pool block slot0 + liquidity + fee growth + protocol fees', async () => {
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
		getPoolFeeGrowthGlobal0X128.mockResolvedValue(0xabcn)
		getPoolFeeGrowthGlobal1X128.mockResolvedValue(0xdefn)
		getPoolProtocolFees.mockResolvedValue({
			token0: 1n,
			token1: 2n,
		})

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
		expect(blockResolver.projections.feeGrowthGlobal0X128(snapshot)).toBe(0xabcn)
		expect(blockResolver.projections.feeGrowthGlobal1X128(snapshot)).toBe(0xdefn)
		expect(blockResolver.projections.protocolFeesToken0(snapshot)).toBe(1n)
		expect(blockResolver.projections.protocolFeesToken1(snapshot)).toBe(2n)
	})

	it('resolves position ticks and pool via factory getPool', async () => {
		getPosition.mockResolvedValue({
			token0,
			token1,
			fee: 500,
			tickLower: -60,
			tickUpper: 60,
			liquidity: 1n,
			feeGrowthInside0LastX128: 0n,
			feeGrowthInside1LastX128: 0n,
			tokensOwed0: 0n,
			tokensOwed1: 0n,
		})
		getFactoryPool.mockResolvedValue(poolAddress)

		const positionResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Position
			&& '$pool' in resolver.projections
		))
		if (positionResolver == null)
			throw new Error('missing UniswapV3Position identity resolver')

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

	it('projects tip UniswapV3Position.$$blocks from eth_blockNumber', async () => {
		const positionResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Position
			&& '$$blocks' in resolver.projections
		))
		if (positionResolver == null)
			throw new Error('missing UniswapV3Position $$blocks resolver')

		const snapshot = await positionResolver.resolve.PositionManagerTokenId.resolve({
			positionManager,
			tokenId: 7n,
		}, context)

		expect(positionResolver.projections.$$blocks.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$position: {
						positionManager,
						tokenId: 7n,
					},
					blockNumber: 12_345_678n,
				},
			},
		])
		expect(positionResolver.projections.$$blocks.resolveCount(snapshot)).toBe(1)
	})

	it('resolves position block owner, liquidity, owed tokens, and fee-growth checkpoints', async () => {
		getPositionOwner.mockResolvedValue('0x1111111111111111111111111111111111111111')
		getPosition.mockResolvedValue({
			token0,
			token1,
			fee: 500,
			tickLower: -60,
			tickUpper: 60,
			liquidity: 9n,
			feeGrowthInside0LastX128: 0xabcn,
			feeGrowthInside1LastX128: 0xdefn,
			tokensOwed0: 3n,
			tokensOwed1: 4n,
		})

		const blockResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Position_Block
		))
		if (blockResolver == null)
			throw new Error('missing UniswapV3Position_Block resolver')

		const snapshot = await blockResolver.resolve.PositionBlockNumber.resolve({
			$position: {
				positionManager,
				tokenId: 7n,
			},
			blockNumber: 1n,
		}, context)

		expect(blockResolver.projections.$owner(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				address: '0x1111111111111111111111111111111111111111',
			},
		})
		expect(blockResolver.projections.liquidity(snapshot)).toBe(9n)
		expect(blockResolver.projections.tokensOwed0(snapshot)).toBe(3n)
		expect(blockResolver.projections.tokensOwed1(snapshot)).toBe(4n)
		expect(blockResolver.projections.feeGrowthInside0LastX128(snapshot)).toBe(0xabcn)
		expect(blockResolver.projections.feeGrowthInside1LastX128(snapshot)).toBe(0xdefn)
	})

	it('throws when JSON-RPC transports are missing for the pool chain', async () => {
		const poolResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& 'NetworkPoolAddress' in resolver.resolve
			&& '$factory' in resolver.projections
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool identity resolver')

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

	it('rejects Base-native NFPM when only Ethereum JSON-RPC transports are mocked', async () => {
		const positionResolver = uniswapV3Resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Position
			&& '$pool' in resolver.projections
		))
		if (positionResolver == null)
			throw new Error('missing UniswapV3Position identity resolver')

		await expect(
			positionResolver.resolve.PositionManagerTokenId.resolve({
				positionManager: '0x03a520b32c04bf3beef7beb72e919cf822ed34f1',
				tokenId: 7n,
			}, context)
		).rejects.toThrow('Voltaire_JsonRpc: no JSON-RPC URL for UniswapV3Position on chain 8453')
	})
})
