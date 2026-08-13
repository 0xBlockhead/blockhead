import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())
const getPositionsInfo = vi.hoisted(() => vi.fn())
const getPositionByKey = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))
vi.mock('$/sources/Gmx/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Gmx/Rest/queries.ts')>(),
	getPositionsInfo,
	getPositionByKey,
}))

const { default: gmxRest } = await import('$/resolvers/Gmx-Rest.ts')

const baseNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '42161',
	},
}

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

const gmxMarketResolver = gmxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.GmxMarket
))
const evmNetworkAccountResolver = gmxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$gmxPositions' in resolver.projections
))
const gmxPositionResolver = gmxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.GmxPosition
))

const ethMarketTokenAddress = '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336'

const ethMarketInfoWire = {
	name: 'ETH/USD [WETH-USDC]',
	marketTokenAddress: ethMarketTokenAddress,
	indexTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
	longTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
	shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
	isSpotOnly: false,
	isDisabled: false,
	longInterestUsd: '11844876917225365753752459368138129000',
	shortInterestUsd: '15383126719457743771450388674116662232',
	longPoolAmount: '11412900167379942479683',
	shortPoolAmount: '20907313850254',
	fundingFactorPerSecond: '5447368087265348055555',
} as const

describe('GMX Rest resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		getPositionsInfo.mockReset()
		getPositionByKey.mockReset()
	})

	it('publishes GMX account positions onto $$gmxPositions', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing GMX account resolver')

		const accountSelector = {
			$network: baseNetwork,
			$actor: {
				address: '0xd2c66b256eb277cba30b6fccf4ab5f871452da77',
			},
		}
		const contractKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
		getPositionsInfo.mockResolvedValue([
			{
				chainId: 42161,
				contractKey,
				account: accountSelector.$actor.address,
				marketAddress: ethMarketTokenAddress.toLowerCase(),
				isLong: true,
				sizeInUsd: '1000',
				positionValueInUsd: '1000',
			},
		])

		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			context
		)

		expect(evmNetworkAccountResolver.projections.$$gmxPositions.select(account)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: accountSelector,
					contractKey,
				},
			},
		])
		expect(evmNetworkAccountResolver.projections.$$gmxPositions.resolveCount(account)).toBe(1)
		expect(getPositionsInfo).toHaveBeenCalledWith({
			chainId: 42161,
			address: accountSelector.$actor.address,
		})
	})

	it('pages the complete GMX account position composition', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing GMX account resolver')

		const accountSelector = {
			$network: baseNetwork,
			$actor: {
				address: '0xd2c66b256eb277cba30b6fccf4ab5f871452da77',
			},
		}
		getPositionsInfo.mockResolvedValue([
			{
				contractKey: `0x${'1'.repeat(64)}`,
			},
			{
				contractKey: `0x${'2'.repeat(64)}`,
			},
		])

		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			{
				...context,
				pagination: {
					limit: 1,
					offset: 1,
				},
			}
		)

		expect(evmNetworkAccountResolver.projections.$$gmxPositions.select(account)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: accountSelector,
				contractKey: `0x${'2'.repeat(64)}`,
			},
		}])
		expect(evmNetworkAccountResolver.projections.$$gmxPositions.resolveCount(account)).toBe(2)
	})

	it('resolves a GMX position by account + contract key', async () => {
		if (gmxPositionResolver == null)
			throw new Error('missing GmxPosition resolver')

		const accountSelector = {
			$network: baseNetwork,
			$actor: {
				address: '0xd2c66b256eb277cba30b6fccf4ab5f871452da77',
			},
		}
		const contractKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
		getPositionByKey.mockResolvedValue({
			chainId: 42161,
			contractKey,
			account: accountSelector.$actor.address,
			marketAddress: ethMarketTokenAddress.toLowerCase(),
			collateralTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
			isLong: true,
			sizeInUsd: '1000',
			sizeInTokens: '1',
			collateralAmount: '1',
			collateralUsd: '1000',
			positionValueInUsd: '1000',
			pnl: '0',
			leverage: '1',
			entryPrice: '1000',
			markPrice: '1000',
			liquidationPrice: '500',
			indexName: 'ETH',
			poolName: 'WETH-USDC',
			pendingBorrowingFeesUsd: '1',
			increasedAtTime: '1700000000',
			decreasedAtTime: '0',
			fundingFeeAmount: '0',
			claimableLongTokenAmount: '0',
			claimableShortTokenAmount: '0',
			positionFeeAmount: '0',
			traderDiscountAmount: '0',
			uiFeeAmount: '0',
			pendingImpactAmount: '0',
			remainingCollateralUsd: '999',
			remainingCollateralAmount: '1',
			hasLowCollateral: false,
			leverageWithPnl: '1',
			leverageWithoutPnl: '1',
			pnlPercentage: '0',
			pnlAfterFees: '0',
			pnlAfterFeesPercentage: '0',
			netValueAfterAllFees: '999',
			pnlAfterAllFees: '0',
			pnlAfterAllFeesPercentage: '0',
			netValue: '1000',
			netPriceImapctDeltaUsd: '0',
			priceImpactDiffUsd: '0',
			pendingImpactUsd: '0',
			closePriceImpactDeltaUsd: '0',
			closingFeeUsd: '0',
			uiFeeUsd: '0',
			pendingFundingFeesUsd: '0',
			pendingClaimableFundingFeesUsd: '0',
		})

		const snapshot = await gmxPositionResolver.resolve.AccountContractKey.resolve({
			$account: accountSelector,
			contractKey,
		}, context)

		expect(gmxPositionResolver.projections.isLong(snapshot)).toBe(true)
		expect(gmxPositionResolver.projections.sizeInUsd(snapshot)).toBe('1000')
		expect(gmxPositionResolver.projections.sizeInTokens(snapshot)).toBe('1')
		expect(gmxPositionResolver.projections.collateralAmount(snapshot)).toBe('1')
		expect(gmxPositionResolver.projections.collateralUsd(snapshot)).toBe('1000')
		expect(gmxPositionResolver.projections.positionValueInUsd(snapshot)).toBe('1000')
		expect(gmxPositionResolver.projections.pnl(snapshot)).toBe('0')
		expect(gmxPositionResolver.projections.leverage(snapshot)).toBe('1')
		expect(gmxPositionResolver.projections.entryPrice(snapshot)).toBe('1000')
		expect(gmxPositionResolver.projections.markPrice(snapshot)).toBe('1000')
		expect(gmxPositionResolver.projections.liquidationPrice(snapshot)).toBe('500')
		expect(gmxPositionResolver.projections.indexName(snapshot)).toBe('ETH')
		expect(gmxPositionResolver.projections.poolName(snapshot)).toBe('WETH-USDC')
		expect(gmxPositionResolver.projections.collateralTokenAddress(snapshot)).toBe(
			'0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
		)
		expect(snapshot).not.toHaveProperty('pendingBorrowingFeesUsd')
		expect(snapshot).not.toHaveProperty('hasLowCollateral')
		expect(snapshot).not.toHaveProperty('leverageWithPnl')
		expect(snapshot).not.toHaveProperty('increasedAtTime')
		expect(Object.keys(gmxPositionResolver.projections)).not.toContain('pendingBorrowingFeesUsd')
		expect(getPositionByKey).toHaveBeenCalledWith({
			chainId: 42161,
			contractKey,
		})
	})

	it('rejects a position detail that belongs to another account', async () => {
		if (gmxPositionResolver == null)
			throw new Error('missing GmxPosition resolver')

		getPositionByKey.mockResolvedValue({
			account: '0x0000000000000000000000000000000000000001',
		})
		await expect(gmxPositionResolver.resolve.AccountContractKey.resolve({
			$account: {
				$network: baseNetwork,
				$actor: {
					address: '0xd2c66b256eb277cba30b6fccf4ab5f871452da77',
				},
			},
			contractKey: `0x${'1'.repeat(64)}`,
		}, context)).rejects.toThrow(`${Source.Gmx_Rest}: position belongs to a different account`)
	})

	it('rejects unsupported GMX chains on account positions before transport', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing GMX account resolver')

		await expect(
			evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				$actor: {
					address: '0xd2c66b256eb277cba30b6fccf4ab5f871452da77',
				},
			}, context)
		).rejects.toThrow(`${Source.Gmx_Rest}: unsupported chain id 1`)
		expect(getPositionsInfo).not.toHaveBeenCalled()
	})

	it('preserves an empty GMX positions list on $$gmxPositions', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing GMX account resolver')

		getPositionsInfo.mockResolvedValue([])

		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: baseNetwork,
			$actor: {
				address: '0xd2c66b256eb277cba30b6fccf4ab5f871452da77',
			},
		}, context)

		expect(evmNetworkAccountResolver.projections.$$gmxPositions.select(account)).toEqual([])
		expect(evmNetworkAccountResolver.projections.$$gmxPositions.resolveCount(account)).toBe(0)
	})

	it('pages Network $$gmxMarkets with authoritative resolveCount from markets/info', async () => {
		const networkGmxMarketsResolver = gmxRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Evm' in resolver.projections
			&& '$$gmxMarkets' in resolver.projections.Evm
		))
		if (networkGmxMarketsResolver == null)
			throw new Error('missing Network $$gmxMarkets resolver')

		sourceGetJson.mockResolvedValueOnce([
			ethMarketInfoWire,
			{
				...ethMarketInfoWire,
				name: 'BTC/USD [WBTC-USDC]',
				marketTokenAddress: '0x47c031236e19d380FFF9b6545FBA11AE962DA90d',
			},
		])

		const snapshot = await networkGmxMarketsResolver.resolve.Caip2.resolve(
			baseNetwork,
			{
				...context,
				pagination: {
					limit: 1,
					offset: 1,
				},
			}
		)
		expect(networkGmxMarketsResolver.projections.Evm.$$gmxMarkets.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: baseNetwork,
					marketTokenAddress: '0x47c031236e19d380fff9b6545fba11ae962da90d',
				},
			},
		])
		expect(networkGmxMarketsResolver.projections.Evm.$$gmxMarkets.resolveCount(snapshot)).toBe(2)
	})

	it('registers under Gmx_Rest for GmxMarket', () => {
		expect(gmxRest.source).toBe(Source.Gmx_Rest)
		expect(gmxMarketResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (gmxMarketResolver == null)
			throw new Error('missing GmxMarket resolver')

		await expect(
			gmxMarketResolver.resolve.NetworkMarketTokenAddress.resolve({
				$network: {
					caip2: {
						namespace: 'solana',
						reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
					},
				},
				marketTokenAddress: ethMarketTokenAddress,
			}, context)
		).rejects.toThrow(`${Source.Gmx_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects unsupported GMX chains before transport', async () => {
		if (gmxMarketResolver == null)
			throw new Error('missing GmxMarket resolver')

		await expect(
			gmxMarketResolver.resolve.NetworkMarketTokenAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				marketTokenAddress: ethMarketTokenAddress,
			}, context)
		).rejects.toThrow(`${Source.Gmx_Rest}: unsupported chain id 1`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('resolves a GMX V2 market snapshot by network and market token', async () => {
		if (gmxMarketResolver == null)
			throw new Error('missing GmxMarket resolver')

		sourceGetJson.mockResolvedValueOnce([
			{
				...ethMarketInfoWire,
				virtualInventoryForPositions: '-1',
				maxCollateralSumLongTokenLong: '1',
				virtualMarketId: '0xabc',
				positionImpactFactorPositive: '2',
				maxOpenInterestLong: '3',
				maxLongPoolUsdForDeposit: '4',
				fundingFactor: '5',
				borrowingFactorLong: '6',
				swapFeeFactorForBalanceWasImproved: '7',
				positionFeeFactorForBalanceWasImproved: '8',
				useOpenInterestInTokensForBalance: true,
			},
		])

		const snapshot = await gmxMarketResolver.resolve.NetworkMarketTokenAddress.resolve({
			$network: baseNetwork,
			marketTokenAddress: ethMarketTokenAddress,
		}, context)

		expect(gmxMarketResolver.projections.marketTokenAddress(snapshot)).toBe(
			'0x70d95587d40a2caf56bd97485ab3eec10bee6336'
		)
		expect(gmxMarketResolver.projections.name(snapshot)).toBe('ETH/USD [WETH-USDC]')
		expect(gmxMarketResolver.projections.longInterestUsd(snapshot)).toBe(
			'11844876917225365753752459368138129000'
		)
		expect(gmxMarketResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: baseNetwork,
		})
		expect(snapshot).not.toHaveProperty('virtualInventoryForPositions')
		expect(snapshot).not.toHaveProperty('positionImpactFactorPositive')
		expect(snapshot).not.toHaveProperty('maxOpenInterestLong')
		expect(snapshot).not.toHaveProperty('maxCollateralSumLongTokenLong')
		expect(snapshot).not.toHaveProperty('virtualMarketId')
		expect(snapshot).not.toHaveProperty('maxLongPoolUsdForDeposit')
		expect(snapshot).not.toHaveProperty('fundingFactor')
		expect(snapshot).not.toHaveProperty('borrowingFactorLong')
		expect(snapshot).not.toHaveProperty('swapFeeFactorForBalanceWasImproved')
		expect(snapshot).not.toHaveProperty('positionFeeFactorForBalanceWasImproved')
		expect(snapshot).not.toHaveProperty('useOpenInterestInTokensForBalance')
		expect(Object.keys(gmxMarketResolver.projections)).not.toContain('virtualInventoryForPositions')
		expect(Object.keys(gmxMarketResolver.projections)).not.toContain('fundingFactor')
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})

	it.each([
		43114,
		4326,
	])('maps all GmxMarket schema fields for chain %i', async (chainId) => {
		if (gmxMarketResolver == null)
			throw new Error('missing GmxMarket resolver')

		sourceGetJson.mockResolvedValueOnce([
			ethMarketInfoWire,
		])

		const snapshot = await gmxMarketResolver.resolve.NetworkMarketTokenAddress.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: String(chainId),
				},
			},
			marketTokenAddress: ethMarketTokenAddress,
		}, context)

		expect(gmxMarketResolver.projections.indexTokenAddress(snapshot)).toBe(
			'0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
		)
		expect(gmxMarketResolver.projections.longTokenAddress(snapshot)).toBe(
			'0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
		)
		expect(gmxMarketResolver.projections.shortTokenAddress(snapshot)).toBe(
			'0xaf88d065e77c8cc2239327c5edb3a432268e5831'
		)
		expect(gmxMarketResolver.projections.shortInterestUsd(snapshot)).toBe(
			'15383126719457743771450388674116662232'
		)
		expect(gmxMarketResolver.projections.longPoolAmount(snapshot)).toBe(
			'11412900167379942479683'
		)
		expect(gmxMarketResolver.projections.shortPoolAmount(snapshot)).toBe(
			'20907313850254'
		)
		expect(gmxMarketResolver.projections.fundingFactorPerSecond(snapshot)).toBe(
			'5447368087265348055555'
		)
	})

	it('throws when the market token is absent from markets/info', async () => {
		if (gmxMarketResolver == null)
			throw new Error('missing GmxMarket resolver')

		sourceGetJson.mockResolvedValueOnce([
			ethMarketInfoWire,
		])

		await expect(
			gmxMarketResolver.resolve.NetworkMarketTokenAddress.resolve({
				$network: baseNetwork,
				marketTokenAddress: '0x0000000000000000000000000000000000000001',
			}, context)
		).rejects.toThrow(`${Source.Gmx_Rest}: market not found 0x0000000000000000000000000000000000000001`)
	})
})
