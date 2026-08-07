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

const graphql = vi.hoisted(() => vi.fn())
const getAccountPositions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_shared/wire/Graphql/client.ts')>(),
	graphql,
}))
vi.mock('$/sources/Aave/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Aave/Rest/queries.ts')>(),
	getAccountPositions,
}))

const { default: aaveRest } = await import('$/resolvers/Aave-Rest.ts')

const ethereumNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
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

const aaveMarketResolver = aaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AaveMarket
))
const aaveReserveResolver = aaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AaveReserve
))
const networkAaveMarketsResolver = aaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$aaveMarkets' in resolver.projections.Evm
))
const evmNetworkAccountResolver = aaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$aaveReservePositions' in resolver.projections
))

const ethereumMarket = {
	name: 'AaveV3Ethereum',
	address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
	icon: 'https://statics.aave.com/ethereum.svg',
	totalMarketSize: '20169737076.235233639488619539',
	totalAvailableLiquidity: '10938067474.915557948999849733',
	chain: {
		chainId: 1,
		name: 'Ethereum',
	},
	reserves: [
		{
			underlyingToken: {
				address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				name: 'USD Coin',
				symbol: 'USDC',
				decimals: 6,
				imageUrl: 'https://statics.aave.com/icons/tokens/usdc.svg',
				chainId: 1,
			},
			isFrozen: false,
			isPaused: false,
			size: {
				amount: {
					value: '1000',
				},
			},
			supplyInfo: {
				apy: {
					value: '0.03',
				},
			},
			borrowInfo: {
				apy: {
					value: '0.05',
				},
				availableLiquidity: {
					amount: {
						value: '750',
					},
				},
			},
		},
	],
} as const

describe('Aave Rest resolver module', () => {
	beforeEach(() => {
		graphql.mockReset()
		getAccountPositions.mockReset()
	})

	it('publishes Aave account positions onto $$aaveReservePositions', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing Aave account resolver')

		const accountSelector = {
			$network: ethereumNetwork,
			$actor: {
				address: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
			},
		}
		getAccountPositions.mockResolvedValue([
			{
				protocol: 'Aave V3',
				kind: 'supply',
				chainId: 1,
				account: accountSelector.$actor.address,
				poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				symbol: 'USDC',
				decimals: 6,
				balance: '1000.5',
				balanceUsd: '1000.5',
				apy: '0.03',
				isCollateral: true,
				canBeCollateral: true,
			},
			{
				protocol: 'Aave V3',
				kind: 'borrow',
				chainId: 1,
				account: accountSelector.$actor.address,
				poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				symbol: 'WETH',
				decimals: 18,
				debt: '2.5',
				debtUsd: '5000',
				apy: '0.05',
			},
		])

		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			context
		)

		expect(evmNetworkAccountResolver.projections.$$aaveReservePositions.select(account)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: accountSelector,
					$reserve: {
						$market: {
							$network: ethereumNetwork,
							poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
						},
						underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					},
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$account: accountSelector,
					$reserve: {
						$market: {
							$network: ethereumNetwork,
							poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
						},
						underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					},
				},
			},
		])
		expect(evmNetworkAccountResolver.projections.$$aaveReservePositions.resolveCount(account)).toBe(2)
		expect(getAccountPositions).toHaveBeenCalledWith({
			chainId: 1,
			account: accountSelector.$actor.address,
		})
	})

	it('rejects unsupported Aave chains on account positions before transport', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing Aave account resolver')

		await expect(
			evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '11155111',
					},
				},
				$actor: {
					address: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
				},
			}, context)
		).rejects.toThrow(/unsupported chain id/)
		expect(getAccountPositions).not.toHaveBeenCalled()
	})

	it('preserves an empty Aave positions list on $$aaveReservePositions', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing Aave account resolver')

		getAccountPositions.mockResolvedValue([])
		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: ethereumNetwork,
			$actor: {
				address: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
			},
		}, context)
		expect(evmNetworkAccountResolver.projections.$$aaveReservePositions.select(account)).toEqual([])
		expect(evmNetworkAccountResolver.projections.$$aaveReservePositions.resolveCount(account)).toBe(0)
	})

	it('registers under Aave_Rest for markets, reserves, and Network.$$aaveMarkets', () => {
		expect(aaveRest.source).toBe(Source.Aave_Rest)
		expect(aaveMarketResolver).toBeDefined()
		expect(aaveReserveResolver).toBeDefined()
		expect(networkAaveMarketsResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (networkAaveMarketsResolver == null)
			throw new Error('missing Network $$aaveMarkets resolver')

		await expect(
			networkAaveMarketsResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'cosmos',
					reference: 'osmosis-1',
				},
			}, context)
		).rejects.toThrow(`${Source.Aave_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects unsupported eip155 networks before transport', async () => {
		if (networkAaveMarketsResolver == null)
			throw new Error('missing Network $$aaveMarkets resolver')

		await expect(
			networkAaveMarketsResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'eip155',
					reference: '11155111',
				},
			}, context)
		).rejects.toThrow(`${Source.Aave_Rest}: unsupported chain id 11155111`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('lists Aave markets for an EIP-155 network', async () => {
		if (networkAaveMarketsResolver == null)
			throw new Error('missing Network $$aaveMarkets resolver')

		graphql.mockResolvedValueOnce({
			markets: [
				ethereumMarket,
			],
		})

		const snapshot = await networkAaveMarketsResolver.resolve.Caip2.resolve(
			ethereumNetwork,
			context
		)
		expect(networkAaveMarketsResolver.projections.Evm.$$aaveMarkets.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: ethereumNetwork,
					poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				},
			},
		])
		expect(networkAaveMarketsResolver.projections.Evm.$$aaveMarkets.resolveCount(snapshot)).toBe(1)
	})

	it('resolves an Aave market snapshot by network and pool address', async () => {
		if (aaveMarketResolver == null)
			throw new Error('missing AaveMarket resolver')

		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarket,
				eModeCategories: [
					{
						id: 1,
						label: 'ETH correlated',
						maxLTV: {
							value: '0.93',
						},
						liquidationThreshold: {
							value: '0.95',
						},
						liquidationPenalty: {
							value: '0.01',
						},
					},
				],
			},
		})

		const snapshot = await aaveMarketResolver.resolve.NetworkPoolAddress.resolve({
			$network: ethereumNetwork,
			poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
		}, context)

		expect(aaveMarketResolver.projections.name(snapshot)).toBe('AaveV3Ethereum')
		expect(aaveMarketResolver.projections.poolAddress(snapshot)).toBe(
			'0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2'
		)
		expect(aaveMarketResolver.projections.totalMarketSize(snapshot)).toBe(
			ethereumMarket.totalMarketSize
		)
		expect(aaveMarketResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: ethereumNetwork,
		})
		expect(aaveMarketResolver.projections.$$reserves.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$market: {
						$network: ethereumNetwork,
						poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
					},
					underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				},
			},
		])
		expect(aaveMarketResolver.projections.$$reserves.resolveCount(snapshot)).toBe(1)
		expect(snapshot).not.toHaveProperty('eModeCategories')
		expect(Object.keys(aaveMarketResolver.projections)).not.toContain('eModeCategories')
		expect(JSON.stringify(snapshot)).not.toContain('isolationModeConfig')
		expect(JSON.stringify(snapshot)).not.toContain('permitSupported')
	})

	it('rejects unsupported chains on AaveMarket before transport', async () => {
		if (aaveMarketResolver == null)
			throw new Error('missing AaveMarket resolver')

		await expect(
			aaveMarketResolver.resolve.NetworkPoolAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '11155111',
					},
				},
				poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
			}, context)
		).rejects.toThrow(`${Source.Aave_Rest}: unsupported chain id 11155111`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects invalid market pool addresses before transport', async () => {
		if (aaveMarketResolver == null)
			throw new Error('missing AaveMarket resolver')

		await expect(
			aaveMarketResolver.resolve.NetworkPoolAddress.resolve({
				$network: ethereumNetwork,
				poolAddress: '0xdead',
			}, context)
		).rejects.toThrow(`${Source.Aave_Rest}: invalid pool address 0xdead`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('resolves one Aave reserve from the owning market snapshot', async () => {
		if (aaveReserveResolver == null)
			throw new Error('missing AaveReserve resolver')

		graphql.mockResolvedValueOnce({
			market: ethereumMarket,
		})

		const snapshot = await aaveReserveResolver.resolve.MarketUnderlyingTokenAddress.resolve({
			$market: {
				$network: ethereumNetwork,
				poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
			},
			underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		}, context)

		expect(aaveReserveResolver.projections.symbol(snapshot)).toBe('USDC')
		expect(aaveReserveResolver.projections.totalSupplied(snapshot)).toBe('1000')
		expect(aaveReserveResolver.projections.availableLiquidity(snapshot)).toBe('750')
		expect(aaveReserveResolver.projections.supplyApy(snapshot)).toBe('0.03')
		expect(aaveReserveResolver.projections.borrowApy(snapshot)).toBe('0.05')
		expect(aaveReserveResolver.projections.frozen(snapshot)).toBe(false)
		expect(aaveReserveResolver.projections.paused(snapshot)).toBe(false)
	})

	it('matches Aave reserves when the selector address is checksum-cased', async () => {
		if (aaveReserveResolver == null)
			throw new Error('missing AaveReserve resolver')

		graphql.mockResolvedValueOnce({
			market: ethereumMarket,
		})

		const snapshot = await aaveReserveResolver.resolve.MarketUnderlyingTokenAddress.resolve({
			$market: {
				$network: ethereumNetwork,
				poolAddress: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
			},
			underlyingTokenAddress: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		}, context)

		expect(aaveReserveResolver.projections.underlyingTokenAddress(snapshot)).toBe(
			'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
		)
		expect(aaveReserveResolver.projections.symbol(snapshot)).toBe('USDC')
	})

	it('omits optional borrow fields when borrowInfo is absent', async () => {
		if (aaveReserveResolver == null)
			throw new Error('missing AaveReserve resolver')

		const {
			borrowInfo: _borrowInfo,
			...supplyOnlyReserve
		} = ethereumMarket.reserves[0]

		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarket,
				reserves: [
					{
						...supplyOnlyReserve,
						isFrozen: true,
						isPaused: true,
					},
				],
			},
		})

		const snapshot = await aaveReserveResolver.resolve.MarketUnderlyingTokenAddress.resolve({
			$market: {
				$network: ethereumNetwork,
				poolAddress: ethereumMarket.address,
			},
			underlyingTokenAddress: ethereumMarket.reserves[0].underlyingToken.address,
		}, context)

		expect(aaveReserveResolver.projections.availableLiquidity(snapshot)).toBeUndefined()
		expect(aaveReserveResolver.projections.borrowApy(snapshot)).toBeUndefined()
		expect(aaveReserveResolver.projections.frozen(snapshot)).toBe(true)
		expect(aaveReserveResolver.projections.paused(snapshot)).toBe(true)
	})

	it('rejects invalid underlying token addresses before transport', async () => {
		if (aaveReserveResolver == null)
			throw new Error('missing AaveReserve resolver')

		await expect(
			aaveReserveResolver.resolve.MarketUnderlyingTokenAddress.resolve({
				$market: {
					$network: ethereumNetwork,
					poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				},
				underlyingTokenAddress: '0xdead',
			}, context)
		).rejects.toThrow(`${Source.Aave_Rest}: invalid underlying token address 0xdead`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects unsupported chains on AaveReserve before transport', async () => {
		if (aaveReserveResolver == null)
			throw new Error('missing AaveReserve resolver')

		await expect(
			aaveReserveResolver.resolve.MarketUnderlyingTokenAddress.resolve({
				$market: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '11155111',
						},
					},
					poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				},
				underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			}, context)
		).rejects.toThrow(`${Source.Aave_Rest}: unsupported chain id 11155111`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects invalid market pool addresses on AaveReserve before transport', async () => {
		if (aaveReserveResolver == null)
			throw new Error('missing AaveReserve resolver')

		await expect(
			aaveReserveResolver.resolve.MarketUnderlyingTokenAddress.resolve({
				$market: {
					$network: ethereumNetwork,
					poolAddress: 'not-a-pool',
				},
				underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			}, context)
		).rejects.toThrow(`${Source.Aave_Rest}: invalid pool address not-a-pool`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('throws when the requested reserve is missing from the market snapshot', async () => {
		if (aaveReserveResolver == null)
			throw new Error('missing AaveReserve resolver')

		graphql.mockResolvedValueOnce({
			market: ethereumMarket,
		})

		await expect(
			aaveReserveResolver.resolve.MarketUnderlyingTokenAddress.resolve({
				$market: {
					$network: ethereumNetwork,
					poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				},
				underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			}, context)
		).rejects.toThrow(
			`${Source.Aave_Rest}: reserve not found 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2`
		)
	})

	it('omits empty reserve imageUrl (ZeroOrOne)', async () => {
		if (aaveReserveResolver == null)
			throw new Error('missing AaveReserve resolver')

		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarket,
				reserves: [
					{
						...ethereumMarket.reserves[0],
						underlyingToken: {
							...ethereumMarket.reserves[0].underlyingToken,
							imageUrl: '',
						},
					},
				],
			},
		})

		const snapshot = await aaveReserveResolver.resolve.MarketUnderlyingTokenAddress.resolve({
			$market: {
				$network: ethereumNetwork,
				poolAddress: ethereumMarket.address,
			},
			underlyingTokenAddress: ethereumMarket.reserves[0].underlyingToken.address,
		}, context)

		expect(aaveReserveResolver.projections.imageUrl(snapshot)).toBeUndefined()
		expect(aaveReserveResolver.projections.symbol(snapshot)).toBe('USDC')
	})

	it('projects all enrolled AaveReservePosition fields and omits canBeCollateral', async () => {
		const aaveReservePositionResolver = aaveRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AaveReservePosition
		))
		if (aaveReservePositionResolver == null)
			throw new Error('missing AaveReservePosition resolver')

		const accountSelector = {
			$network: ethereumNetwork,
			$actor: {
				address: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
			},
		}
		const poolAddress = '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2'
		const underlyingTokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
		getAccountPositions.mockResolvedValue([
			{
				protocol: 'Aave V3',
				kind: 'supply',
				chainId: 1,
				account: accountSelector.$actor.address,
				poolAddress,
				underlyingTokenAddress,
				symbol: 'USDC',
				decimals: 6,
				name: 'USD Coin',
				balance: '1000.5',
				balanceUsd: '1000.5',
				apy: '0.03',
				isCollateral: true,
				canBeCollateral: true,
			},
			{
				protocol: 'Aave V3',
				kind: 'borrow',
				chainId: 1,
				account: accountSelector.$actor.address,
				poolAddress,
				underlyingTokenAddress,
				symbol: 'USDC',
				decimals: 6,
				debt: '2.5',
				debtUsd: '2.5',
				apy: '0.05',
			},
		])

		const snapshot = await aaveReservePositionResolver.resolve.AccountReserve.resolve({
			$account: accountSelector,
			$reserve: {
				$market: {
					$network: ethereumNetwork,
					poolAddress,
				},
				underlyingTokenAddress,
			},
		}, context)

		expect(aaveReservePositionResolver.projections.symbol(snapshot)).toBe('USDC')
		expect(aaveReservePositionResolver.projections.decimals(snapshot)).toBe(6)
		expect(aaveReservePositionResolver.projections.suppliedBalance(snapshot)).toBe('1000.5')
		expect(aaveReservePositionResolver.projections.suppliedBalanceUsd(snapshot)).toBe('1000.5')
		expect(aaveReservePositionResolver.projections.supplyApy(snapshot)).toBe('0.03')
		expect(aaveReservePositionResolver.projections.isCollateral(snapshot)).toBe(true)
		expect(aaveReservePositionResolver.projections.borrowedBalance(snapshot)).toBe('2.5')
		expect(aaveReservePositionResolver.projections.borrowedBalanceUsd(snapshot)).toBe('2.5')
		expect(aaveReservePositionResolver.projections.borrowApy(snapshot)).toBe('0.05')
		expect(snapshot).not.toHaveProperty('canBeCollateral')
		expect(Object.keys(aaveReservePositionResolver.projections)).not.toContain('canBeCollateral')
	})
})
