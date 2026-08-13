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
const getBlockNumber = vi.hoisted(() => vi.fn())
const getCall = vi.hoisted(() => vi.fn())
const getPosition = vi.hoisted(() => vi.fn())
const getFactoryPool = vi.hoisted(() => vi.fn())
const getPositionOwner = vi.hoisted(() => vi.fn())
const getPoolSlot0 = vi.hoisted(() => vi.fn())
const getPoolLiquidity = vi.hoisted(() => vi.fn())
const getPoolFeeGrowthGlobal0X128 = vi.hoisted(() => vi.fn())
const getPoolFeeGrowthGlobal1X128 = vi.hoisted(() => vi.fn())
const getPoolProtocolFees = vi.hoisted(() => vi.fn())
const getCcaAuctionConfiguration = vi.hoisted(() => vi.fn())
const getCcaAuctionState = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
		httpTransportsByChainId: {
			1: [{
				diagnosticLabel: 'mock-rpc',
				getLogs,
				getCall,
				getBlockNumber,
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
		getPositionOwner,
		getPoolSlot0,
		getPoolLiquidity,
		getPoolFeeGrowthGlobal0X128,
		getPoolFeeGrowthGlobal1X128,
		getPoolProtocolFees,
		getCcaAuctionConfiguration,
		getCcaAuctionState,
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

const ccaConfiguration = {
	auctionAddress: '0x1234567890abcdef1234567890abcdef12345678',
	blockNumber: 12_345_678n,
	currencyAddress: '0x0000000000000000000000000000000000000000',
	tokenAddress: '0x1111111111111111111111111111111111111111',
	totalSupply: 1_000_000n,
	tokensRecipient: '0x2222222222222222222222222222222222222222',
	fundsRecipient: '0x3333333333333333333333333333333333333333',
	startBlock: 12_000_000n,
	endBlock: 12_500_000n,
	claimBlock: 12_600_000n,
	validationHookAddress: '0x0000000000000000000000000000000000000000',
	floorPriceQ96: 100n,
	tickSpacingQ96: 5n,
}

const ccaState = {
	auctionAddress: ccaConfiguration.auctionAddress,
	blockNumber: ccaConfiguration.blockNumber,
	clearingPriceQ96: 200n,
	currencyRaisedAtClearingPriceQ96X7: 300n,
	cumulativeMpsPerPrice: 400n,
	cumulativeMps: 5_000_000,
	previousCheckpointBlock: 12_345_600n,
	nextCheckpointBlock: 12_345_700n,
	currencyRaised: 500n,
	totalCleared: 600n,
	isGraduated: false,
}


describe('UniswapContracts_Evm resolver', () => {
	beforeEach(() => {
		getLogs.mockReset()
		getBlockNumber.mockReset()
		getCall.mockReset()
		getPosition.mockReset()
		getFactoryPool.mockReset()
		getPositionOwner.mockReset()
		getPoolSlot0.mockReset()
		getPoolLiquidity.mockReset()
		getPoolFeeGrowthGlobal0X128.mockReset()
		getPoolFeeGrowthGlobal1X128.mockReset()
		getPoolProtocolFees.mockReset()
		getCcaAuctionConfiguration.mockReset()
		getCcaAuctionState.mockReset()
		getLogs.mockResolvedValue([])
		getBlockNumber.mockResolvedValue(12_345_678n)
		getCcaAuctionConfiguration.mockResolvedValue(ccaConfiguration)
		getCcaAuctionState.mockResolvedValue(ccaState)
	})

	it('registers global hub + pool + tip block resolvers', () => {
		expect(uniswapContractsEvm.source).toBe(Source.UniswapContracts_Evm)
		expect(uniswapContractsEvm.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType._Global,
			EntityType.UniswapCcaAuction,
			EntityType.UniswapCcaAuction,
			EntityType.UniswapCcaAuction_EvmBlock,
			EntityType.UniswapV3Pool,
			EntityType.UniswapV3Pool,
			EntityType.UniswapV3Pool,
			EntityType.UniswapV3Pool,
			EntityType.UniswapV3Pool_Block,
			EntityType.UniswapV3Position,
			EntityType.UniswapV3Position_Block,
		])
	})

	it('attaches the validated current CCA block observation to its auction', async () => {
		const resolver = uniswapContractsEvm.resolvers.find(({ entityType, projections }) => (
			entityType === EntityType.UniswapCcaAuction
			&& '$$blocks' in projections
		))
		if (resolver == null)
			throw new Error('missing UniswapCcaAuction block-list resolver')

		const blocks = await resolver.resolve.NetworkAuctionAddress.resolve({
			$network: ethereumNetwork,
			auctionAddress: ccaConfiguration.auctionAddress,
		}, context)

		expect(getCcaAuctionState).toHaveBeenCalledWith({
			getCall,
			lensAddress: '0xc3c65f5453a3674adb693cbda3c842545cd30f53',
			auctionAddress: ccaConfiguration.auctionAddress,
			blockNumber: ccaConfiguration.blockNumber,
		})
		expect(resolver.projections.$$blocks.select(blocks)).toEqual([{
			[EntityMetaKey.Selector]: {
				$auction: {
					$network: ethereumNetwork,
					auctionAddress: ccaConfiguration.auctionAddress,
				},
				blockNumber: ccaConfiguration.blockNumber,
			},
		}])
		expect(resolver.projections.$$blocks.resolveCount(blocks)).toBe(1)
	})

	it('resolves exact CCA clearing state and schedule at one block', async () => {
		const resolver = uniswapContractsEvm.resolvers.find(({ entityType }) => (
			entityType === EntityType.UniswapCcaAuction_EvmBlock
		))
		if (resolver == null)
			throw new Error('missing UniswapCcaAuction_EvmBlock resolver')

		const snapshot = await resolver.resolve.AuctionBlockNumber.resolve({
			$auction: {
				$network: ethereumNetwork,
				auctionAddress: ccaConfiguration.auctionAddress,
			},
			blockNumber: ccaConfiguration.blockNumber,
		}, context)

		expect(resolver.projections.$block(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				blockNumber: ccaConfiguration.blockNumber,
			},
		})
		expect(resolver.projections.clearingPriceQ96(snapshot)).toBe(ccaState.clearingPriceQ96)
		expect(resolver.projections.$previousCheckpoint(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				blockNumber: ccaState.previousCheckpointBlock,
			},
		})
		expect(resolver.projections.$nextCheckpoint(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				blockNumber: ccaState.nextCheckpointBlock,
			},
		})
		expect(resolver.projections.schedulePhase(snapshot)).toBe('BiddingWindow')
	})

	it('resolves native-currency CCA configuration at one current transport block', async () => {
		const resolver = uniswapContractsEvm.resolvers.find(({ entityType }) => (
			entityType === EntityType.UniswapCcaAuction
		))
		if (resolver == null)
			throw new Error('missing UniswapCcaAuction resolver')

		const snapshot = await resolver.resolve.NetworkAuctionAddress.resolve({
			$network: ethereumNetwork,
			auctionAddress: '0x1234567890ABCDEF1234567890ABCDEF12345678',
		}, context)

		expect(getBlockNumber).toHaveBeenCalledOnce()
		expect(getCcaAuctionConfiguration).toHaveBeenCalledWith({
			getCall,
			auctionAddress: ccaConfiguration.auctionAddress,
			blockNumber: ccaConfiguration.blockNumber,
		})
		expect(resolver.projections.auctionAddress(snapshot)).toBe(ccaConfiguration.auctionAddress)
		expect(resolver.projections.$auctionContract(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				address: ccaConfiguration.auctionAddress,
			},
		})
		expect(resolver.projections.$currency(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				type: 'NativeCurrency',
			},
		})
		expect(resolver.projections.$token(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				type: 'Erc20Token',
				$contract: {
					$network: ethereumNetwork,
					address: ccaConfiguration.tokenAddress,
				},
			},
		})
		expect(resolver.projections.totalSupply(snapshot)).toBe(ccaConfiguration.totalSupply)
		expect(resolver.projections.$tokensRecipient(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				address: ccaConfiguration.tokensRecipient,
			},
		})
		expect(resolver.projections.$fundsRecipient(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				address: ccaConfiguration.fundsRecipient,
			},
		})
		expect(resolver.projections.$startBlock(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				blockNumber: ccaConfiguration.startBlock,
			},
		})
		expect(resolver.projections.$endBlock(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				blockNumber: ccaConfiguration.endBlock,
			},
		})
		expect(resolver.projections.$claimBlock(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				blockNumber: ccaConfiguration.claimBlock,
			},
		})
		expect(resolver.projections.$validationHook(snapshot)).toBeUndefined()
		expect(resolver.projections.floorPriceQ96(snapshot)).toBe(ccaConfiguration.floorPriceQ96)
		expect(resolver.projections.tickSpacingQ96(snapshot)).toBe(ccaConfiguration.tickSpacingQ96)
		expect('$$blocks' in resolver.projections).toBe(false)
	})

	it('projects ERC-20 currency and validation-hook identities', async () => {
		getCcaAuctionConfiguration.mockResolvedValue({
			...ccaConfiguration,
			currencyAddress: '0x4444444444444444444444444444444444444444',
			validationHookAddress: '0x5555555555555555555555555555555555555555',
		})
		const resolver = uniswapContractsEvm.resolvers.find(({ entityType }) => (
			entityType === EntityType.UniswapCcaAuction
		))
		if (resolver == null)
			throw new Error('missing UniswapCcaAuction resolver')

		const snapshot = await resolver.resolve.NetworkAuctionAddress.resolve({
			$network: ethereumNetwork,
			auctionAddress: ccaConfiguration.auctionAddress,
		}, context)

		expect(resolver.projections.$currency(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				type: 'Erc20Token',
				$contract: {
					$network: ethereumNetwork,
					address: '0x4444444444444444444444444444444444444444',
				},
			},
		})
		expect(resolver.projections.$validationHook(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				address: '0x5555555555555555555555555555555555555555',
			},
		})
	})

	it('rejects non-EIP-155 CCA network selectors before transport access', async () => {
		const resolver = uniswapContractsEvm.resolvers.find(({ entityType }) => (
			entityType === EntityType.UniswapCcaAuction
		))
		if (resolver == null)
			throw new Error('missing UniswapCcaAuction resolver')

		await expect(resolver.resolve.NetworkAuctionAddress.resolve({
			$network: {
				caip2: {
					namespace: 'solana',
					reference: 'mainnet',
				},
			},
			auctionAddress: ccaConfiguration.auctionAddress,
		}, context)).rejects.toThrow('network selector does not identify an EIP-155 network')
		expect(getBlockNumber).not.toHaveBeenCalled()
	})

	it('fail-closes a mismatched CCA configuration address', async () => {
		getCcaAuctionConfiguration.mockResolvedValue({
			...ccaConfiguration,
			auctionAddress: '0x9999999999999999999999999999999999999999',
		})
		const resolver = uniswapContractsEvm.resolvers.find(({ entityType }) => (
			entityType === EntityType.UniswapCcaAuction
		))
		if (resolver == null)
			throw new Error('missing UniswapCcaAuction resolver')

		await expect(resolver.resolve.NetworkAuctionAddress.resolve({
			$network: ethereumNetwork,
			auctionAddress: ccaConfiguration.auctionAddress,
		}, context)).rejects.toThrow('configuration address 0x9999999999999999999999999999999999999999 does not match 0x1234567890abcdef1234567890abcdef12345678')
	})

	it('fail-closes a failed CCA configuration snapshot', async () => {
		getCcaAuctionConfiguration.mockRejectedValue(new Error('eth_call unavailable'))
		const resolver = uniswapContractsEvm.resolvers.find(({ entityType }) => (
			entityType === EntityType.UniswapCcaAuction
		))
		if (resolver == null)
			throw new Error('missing UniswapCcaAuction resolver')

		await expect(resolver.resolve.NetworkAuctionAddress.resolve({
			$network: ethereumNetwork,
			auctionAddress: ccaConfiguration.auctionAddress,
		}, context)).rejects.toThrow('all UniswapCcaAuction endpoints failed for 0x1234567890abcdef1234567890abcdef12345678 on chain 1: mock-rpc: eth_call unavailable')
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

	it('projects tip UniswapV3Pool.$$blocks from eth_blockNumber', async () => {
		const poolResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool
			&& typeof resolver.projections.$$blocks === 'object'
		))
		if (poolResolver == null)
			throw new Error('missing UniswapV3Pool $$blocks resolver')

		const snapshot = await poolResolver.resolve.NetworkPoolAddress.resolve({
			$network: ethereumNetwork,
			poolAddress: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
		}, context)

		expect(poolResolver.projections.$$blocks.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$pool: {
					$network: ethereumNetwork,
					poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
				},
				blockNumber: 12_345_678n,
			},
		}])
		expect(poolResolver.projections.$$blocks.resolveCount(snapshot)).toBe(1)
	})

	it('projects UniswapV3Pool_Block slot0 and fee growth leftovers', async () => {
		getPoolSlot0.mockResolvedValueOnce({
			sqrtPriceX96: 100n,
			tick: -1,
			observationIndex: 1,
			observationCardinality: 2,
			observationCardinalityNext: 3,
			feeProtocol: 0,
			unlocked: true,
		})
		getPoolLiquidity.mockResolvedValueOnce(50n)
		getPoolFeeGrowthGlobal0X128.mockResolvedValueOnce(0xabcn)
		getPoolFeeGrowthGlobal1X128.mockResolvedValueOnce(0xdefn)
		getPoolProtocolFees.mockResolvedValueOnce({
			token0: 1n,
			token1: 2n,
		})

		const blockResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Pool_Block
		))
		if (blockResolver == null)
			throw new Error('missing UniswapV3Pool_Block resolver')

		const snapshot = await blockResolver.resolve.PoolBlockNumber.resolve({
			$pool: {
				$network: ethereumNetwork,
				poolAddress: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
			},
			blockNumber: 12_345_678n,
		}, context)

		expect(blockResolver.projections.sqrtPriceX96(snapshot)).toBe(100n)
		expect(blockResolver.projections.liquidity(snapshot)).toBe(50n)
		expect(blockResolver.projections.tick(snapshot)).toBe(-1)
		expect(blockResolver.projections.feeGrowthGlobal0X128(snapshot)).toBe(0xabcn)
		expect(blockResolver.projections.feeGrowthGlobal1X128(snapshot)).toBe(0xdefn)
		expect(blockResolver.projections.protocolFeesToken0(snapshot)).toBe(1n)
		expect(blockResolver.projections.protocolFeesToken1(snapshot)).toBe(2n)
	})

	it('projects tip UniswapV3Position.$$blocks and position block leftovers', async () => {
		const positionBlocksResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Position
			&& typeof resolver.projections.$$blocks === 'object'
		))
		if (positionBlocksResolver == null)
			throw new Error('missing UniswapV3Position $$blocks resolver')
		getPosition.mockResolvedValueOnce({
			token0: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			fee: 500,
			tickLower: -100,
			tickUpper: 100,
			liquidity: 9n,
			feeGrowthInside0LastX128: 0xabcn,
			feeGrowthInside1LastX128: 0xdefn,
			tokensOwed0: 3n,
			tokensOwed1: 4n,
		})
		getFactoryPool.mockResolvedValueOnce('0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640')

		const tip = await positionBlocksResolver.resolve.PositionManagerTokenId.resolve({
			positionManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
			tokenId: 1n,
		}, context)
		expect(positionBlocksResolver.projections.$pool(tip)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
			},
		})
		expect(positionBlocksResolver.projections.tickLower(tip)).toBe(-100)
		expect(positionBlocksResolver.projections.tickUpper(tip)).toBe(100)
		expect(positionBlocksResolver.projections.$$blocks.select(tip)).toEqual([{
			[EntityMetaKey.Selector]: {
				$position: {
					positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
					tokenId: 1n,
				},
				blockNumber: 12_345_678n,
			},
		}])
		expect(getFactoryPool).toHaveBeenCalledWith({
			getCall,
			factoryAddress: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
			token0: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			fee: 500,
			blockNumber: 12_345_678n,
		})

		getPositionOwner.mockResolvedValueOnce('0x1111111111111111111111111111111111111111')
		getPosition.mockResolvedValueOnce({
			token0: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			fee: 500,
			tickLower: -100,
			tickUpper: 100,
			liquidity: 9n,
			tokensOwed0: 3n,
			tokensOwed1: 4n,
			feeGrowthInside0LastX128: 0xabcn,
			feeGrowthInside1LastX128: 0xdefn,
		})

		const positionBlockResolver = uniswapContractsEvm.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UniswapV3Position_Block
		))
		if (positionBlockResolver == null)
			throw new Error('missing UniswapV3Position_Block resolver')

		const snapshot = await positionBlockResolver.resolve.PositionBlockNumber.resolve({
			$position: {
				positionManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
				tokenId: 1n,
			},
			blockNumber: 12_345_678n,
		}, context)

		expect(positionBlockResolver.projections.$owner(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				address: '0x1111111111111111111111111111111111111111',
			},
		})
		expect(positionBlockResolver.projections.liquidity(snapshot)).toBe(9n)
		expect(positionBlockResolver.projections.feeGrowthInside0LastX128(snapshot)).toBe(0xabcn)
		expect(positionBlockResolver.projections.feeGrowthInside1LastX128(snapshot)).toBe(0xdefn)
	})
})
