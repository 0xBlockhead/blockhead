import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const graphql = vi.hoisted(() => vi.fn())
const getAccountPositions = vi.hoisted(() => vi.fn())
const getUserMarketState = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_shared/wire/Graphql/client.ts')>(),
	graphql,
}))
vi.mock('$/sources/Aave/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Aave/Rest/queries.ts')>(),
	getAccountPositions,
	getUserMarketState,
}))

const { default: aaveRest } = await import('$/resolvers/Aave-Rest.ts')

const ethereumNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
} as const

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
const accountAaveMarketsResolver = aaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$aaveAccountMarkets' in resolver.projections
))
const aaveAccountMarketResolver = aaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AaveAccountMarket
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
				liquidationThreshold: {
					value: '0.825',
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
		getUserMarketState.mockReset()
	})

	it('binds the capture publisher to actual generated account-market identities', () => {
		expect(aaveAccountMarketResolver?.entityType).toBe('AaveAccountMarket')
		expect(schema.find(({ entityType }) => String(entityType) === 'AaveAccountMarket')).toBeDefined()
		expect(schema.find(({ entityType }) => String(entityType) === 'AaveAccountMarket_Timestamp')).toBeDefined()
	})

	it('publishes distinct evidenced Aave markets for an account with independent pagination', async () => {
		if (accountAaveMarketsResolver == null)
			throw new Error('missing account Aave markets resolver')

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
			{
				protocol: 'Aave V3',
				kind: 'supply',
				chainId: 1,
				account: accountSelector.$actor.address,
				poolAddress: '0xc13e21b648a5ee794902342038ff3adab66be987',
				underlyingTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
				symbol: 'USDT',
				decimals: 6,
				balance: '100',
				balanceUsd: '100',
				apy: '0.02',
				isCollateral: false,
				canBeCollateral: true,
			},
		])

		const snapshot = await accountAaveMarketsResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			{
				...context,
				pagination: {
					limit: 1,
				},
			}
		)
		expect(accountAaveMarketsResolver.projections.$$aaveAccountMarkets.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: accountSelector,
				$market: {
					$network: ethereumNetwork,
					poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				},
			},
		}])
		expect(accountAaveMarketsResolver.projections.$$aaveAccountMarkets.resolveCount(snapshot)).toBe(2)
		expect(accountAaveMarketsResolver.projections.$$aaveAccountMarkets.continuation(snapshot)).toEqual({
			operation: 'account-aave-markets',
			target: 'aave',
			terminal: false,
			token: '1',
		})
		expect(accountAaveMarketsResolver.projections.$$aaveReservePositions.resolveCount(snapshot)).toBe(3)
		const secondPage = await accountAaveMarketsResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			{
				...context,
				pagination: { limit: 1 },
				providerContinuationToken: '1',
			}
		)
		expect(accountAaveMarketsResolver.projections.$$aaveAccountMarkets.select(secondPage)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: accountSelector,
				$market: {
					$network: ethereumNetwork,
					poolAddress: '0xc13e21b648a5ee794902342038ff3adab66be987',
				},
			},
		}])
		expect(accountAaveMarketsResolver.projections.$$aaveAccountMarkets.continuation(secondPage)).toEqual({
			operation: 'account-aave-markets',
			target: 'aave',
			terminal: true,
		})
		expect(accountAaveMarketsResolver.projections.$$aaveReservePositions.continuation(secondPage)).toEqual({
			operation: 'account-aave-reserve-positions',
			target: 'aave',
			terminal: false,
			token: '2',
		})
		expect(getUserMarketState).not.toHaveBeenCalled()
	})

	it.each([
		['1.2345', { [entityFieldAddressKey('AaveAccountMarket_Timestamp', [], 'healthFactor')]: '1.2345' }],
		[null, {}],
	])('publishes one complete response-time health observation for %s', async (healthFactor, expectedFields) => {
		if (aaveAccountMarketResolver == null)
			throw new Error('missing Aave account market resolver')

		getUserMarketState.mockResolvedValue({
			healthFactor,
			observedAtMs: 1_777_777_777_000,
			currentLiquidationThreshold: '0.85',
			ltv: '0.75',
			totalCollateralBase: '6000',
			totalDebtBase: '0',
			availableBorrowsBase: '1500',
			netApy: '-0.025',
		})
		const accountSelector = {
			$network: ethereumNetwork,
			$actor: {
				address: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
			},
		}
		const marketSelector = {
			$network: ethereumNetwork,
			poolAddress: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
		}
		const snapshot = await aaveAccountMarketResolver.resolve.AccountMarket.resolve({
			$account: accountSelector,
			$market: marketSelector,
		})

		expect(aaveAccountMarketResolver.projections.$$timestamps.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$accountMarket: {
					$account: accountSelector,
					$market: {
						$network: ethereumNetwork,
						poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
					},
				},
				timestampMs: 1_777_777_777_000,
				source: Source.Aave_Rest,
			},
			[EntityMetaKey.Fields]: {
				...expectedFields,
				[entityFieldAddressKey('AaveAccountMarket_Timestamp', [], 'currentLiquidationThreshold')]: '0.85',
				[entityFieldAddressKey('AaveAccountMarket_Timestamp', [], 'ltv')]: '0.75',
				[entityFieldAddressKey('AaveAccountMarket_Timestamp', [], 'totalCollateralBase')]: '6000',
				[entityFieldAddressKey('AaveAccountMarket_Timestamp', [], 'totalDebtBase')]: '0',
				[entityFieldAddressKey('AaveAccountMarket_Timestamp', [], 'availableBorrowsBase')]: '1500',
				[entityFieldAddressKey('AaveAccountMarket_Timestamp', [], 'netApy')]: '-0.025',
			},
		}])
		expect(aaveAccountMarketResolver.projections.$$timestamps).not.toHaveProperty('resolveCount')
		expect(getUserMarketState).toHaveBeenCalledWith({
			chainId: 1,
			poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
			account: accountSelector.$actor.address,
		})
		expect(getUserMarketState).toHaveBeenCalledTimes(1)
	})

	it('materializes response-time observations without a second timestamp resolver', () => {
		expect(aaveRest.resolvers.map(({ entityType }) => String(entityType))).not.toContain(
			EntityType.AaveAccountMarket_Timestamp
		)
	})

	it.each([
		{ accountChain: '1', marketChain: '10', namespace: 'eip155', poolAddress: ethereumMarket.address, error: 'account and market chain mismatch' },
		{ accountChain: '999999', marketChain: '999999', namespace: 'eip155', poolAddress: ethereumMarket.address, error: 'unsupported chain id' },
		{ accountChain: '1', marketChain: '1', namespace: 'cosmos', poolAddress: ethereumMarket.address, error: 'eip155 CAIP-2 namespace' },
		{ accountChain: '1', marketChain: '1', namespace: 'eip155', poolAddress: 'invalid', error: 'invalid pool address' },
	])('rejects account-market scope before capture: $error', async ({ accountChain, marketChain, namespace, poolAddress, error }) => {
		if (aaveAccountMarketResolver == null)
			throw new Error('missing Aave account market resolver')
		await expect(aaveAccountMarketResolver.resolve.AccountMarket.resolve({
			$account: {
				$network: { caip2: { namespace, reference: accountChain } },
				$actor: { address: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c' },
			},
			$market: {
				$network: { caip2: { namespace, reference: marketChain } },
				poolAddress,
			},
		})).rejects.toThrow(error)
		expect(getUserMarketState).not.toHaveBeenCalled()
	})

	it('refreshes under the completed response clock and preserves the prior capture on failure', async () => {
		if (aaveAccountMarketResolver == null)
			throw new Error('missing Aave account market resolver')
		const selector = {
			$account: {
				$network: ethereumNetwork,
				$actor: { address: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c' },
			},
			$market: {
				$network: ethereumNetwork,
				poolAddress: ethereumMarket.address,
			},
		}
		const state = {
			healthFactor: '1.5',
			observedAtMs: 1000,
			currentLiquidationThreshold: '0.8',
			ltv: '0.7',
			totalCollateralBase: '10',
			totalDebtBase: '5',
			availableBorrowsBase: '2',
			netApy: '-0.01',
		}
		getUserMarketState.mockResolvedValueOnce(state)
		const first = await aaveAccountMarketResolver.resolve.AccountMarket.resolve(selector)
		const original = structuredClone(first)
		getUserMarketState.mockResolvedValueOnce({ ...state, observedAtMs: 2000, healthFactor: '1.25' })
		const second = await aaveAccountMarketResolver.resolve.AccountMarket.resolve(selector)
		expect(aaveAccountMarketResolver.projections.$$timestamps.select(second)[0]).toMatchObject({
			[EntityMetaKey.Selector]: { timestampMs: 2000, source: Source.Aave_Rest },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey('AaveAccountMarket_Timestamp', [], 'healthFactor')]: '1.25',
			},
		})
		const failure = new Error('Aave_Rest GraphQL: unavailable')
		getUserMarketState.mockRejectedValueOnce(failure)
		await expect(aaveAccountMarketResolver.resolve.AccountMarket.resolve(selector)).rejects.toBe(failure)
		expect(first).toEqual(original)
		expect(getUserMarketState).toHaveBeenCalledTimes(3)
	})

	it('propagates failed discovery rather than publishing an empty market list', async () => {
		if (accountAaveMarketsResolver == null)
			throw new Error('missing account Aave markets resolver')
		const failure = new Error('Aave_Rest GraphQL: unavailable')
		getAccountPositions.mockRejectedValueOnce(failure)
		await expect(accountAaveMarketsResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: ethereumNetwork,
			$actor: { address: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c' },
		}, context)).rejects.toBe(failure)
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
					poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
					underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$account: accountSelector,
					poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
					underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				},
			},
		])
		expect(evmNetworkAccountResolver.projections.$$aaveReservePositions.resolveCount(account)).toBe(2)
		expect(evmNetworkAccountResolver.projections.$$aaveReservePositions.continuation(account)).toEqual({
			operation: 'account-aave-reserve-positions',
			target: 'aave',
			terminal: true,
		})
		expect(getAccountPositions).toHaveBeenCalledWith({
			chainId: 1,
			account: accountSelector.$actor.address,
		})
	})

	it('continues Aave account positions from the provider offset', async () => {
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

		const snapshot = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			{
				...context,
				pagination: {
					limit: 1,
				},
				providerContinuationToken: '1',
			}
		)
		expect(evmNetworkAccountResolver.projections.$$aaveReservePositions.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: accountSelector,
				poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
		}])
		expect(evmNetworkAccountResolver.projections.$$aaveReservePositions.continuation(snapshot)).toEqual({
			operation: 'account-aave-reserve-positions',
			target: 'aave',
			terminal: true,
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
		expect(evmNetworkAccountResolver.projections.$$aaveAccountMarkets.select(account)).toEqual([])
		expect(evmNetworkAccountResolver.projections.$$aaveAccountMarkets.resolveCount(account)).toBe(0)
		expect(evmNetworkAccountResolver.projections.$$aaveAccountMarkets.continuation(account)).toEqual({
			operation: 'account-aave-markets',
			target: 'aave',
			terminal: true,
		})
		expect(getUserMarketState).not.toHaveBeenCalled()
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
		expect(networkAaveMarketsResolver.projections.Evm.$$aaveMarkets.continuation(snapshot)).toEqual({
			operation: 'network-aave-markets',
			target: 'aave',
			terminal: true,
		})
	})

	it('continues Aave markets from the provider offset', async () => {
		if (networkAaveMarketsResolver == null)
			throw new Error('missing Network $$aaveMarkets resolver')

		graphql.mockResolvedValueOnce({
			markets: [
				ethereumMarket,
				{
					...ethereumMarket,
					address: '0x1111111111111111111111111111111111111111',
					name: 'Second market',
				},
			],
		})

		const snapshot = await networkAaveMarketsResolver.resolve.Caip2.resolve(
			ethereumNetwork,
			{
				...context,
				pagination: {
					limit: 1,
				},
				providerContinuationToken: '1',
			}
		)
		expect(networkAaveMarketsResolver.projections.Evm.$$aaveMarkets.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: ethereumNetwork,
				poolAddress: '0x1111111111111111111111111111111111111111',
			},
		}])
		expect(networkAaveMarketsResolver.projections.Evm.$$aaveMarkets.resolveCount(snapshot)).toBe(2)
		expect(networkAaveMarketsResolver.projections.Evm.$$aaveMarkets.continuation(snapshot)).toEqual({
			operation: 'network-aave-markets',
			target: 'aave',
			terminal: true,
		})
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
		expect(aaveMarketResolver.projections.$icon(snapshot)).toMatchObject({
			[EntityMetaKey.Selector]: {
				url: ethereumMarket.icon,
			},
		})
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
		expect(aaveReserveResolver.projections.$image(snapshot)).toMatchObject({
			[EntityMetaKey.Selector]: {
				url: ethereumMarket.reserves[0].underlyingToken.imageUrl,
			},
		})
		expect(aaveReserveResolver.projections.totalSupplied(snapshot)).toBe('1000')
		expect(aaveReserveResolver.projections.availableLiquidity(snapshot)).toBe('750')
		expect(aaveReserveResolver.projections.supplyApy(snapshot)).toBe('0.03')
		expect(aaveReserveResolver.projections.borrowApy(snapshot)).toBe('0.05')
		expect(aaveReserveResolver.projections.liquidationThreshold(snapshot)).toBe('0.825')
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
		expect(aaveReserveResolver.projections.liquidationThreshold(snapshot)).toBe('0.825')
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
		expect(aaveReserveResolver.projections.$image(snapshot)).toBeUndefined()
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

		const snapshot = await aaveReservePositionResolver.resolve.AccountPoolAddressUnderlyingTokenAddress.resolve({
			$account: accountSelector,
			poolAddress,
			underlyingTokenAddress,
		}, context)

		expect(aaveReservePositionResolver.projections.$account(snapshot)).toEqual({
			[EntityMetaKey.Selector]: accountSelector,
		})
		expect(aaveReservePositionResolver.projections.poolAddress(snapshot)).toBe(poolAddress)
		expect(aaveReservePositionResolver.projections.underlyingTokenAddress(snapshot)).toBe(
			underlyingTokenAddress
		)
		expect(
			aaveReservePositionResolver.projections.$reserve(snapshot)[EntityMetaKey.Selector].$market.$network
		).toEqual(accountSelector.$network)
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
	})
})
