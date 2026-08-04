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

vi.mock('$/sources/_shared/wire/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_shared/wire/Graphql/client.ts')>(),
	graphql,
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
const networkAaveMarketsResolver = aaveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$aaveMarkets' in resolver.projections.Evm
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
} as const

describe('Aave Rest resolver module', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('registers under Aave_Rest for AaveMarket and Network.$$aaveMarkets', () => {
		expect(aaveRest.source).toBe(Source.Aave_Rest)
		expect(aaveMarketResolver).toBeDefined()
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
		expect(networkAaveMarketsResolver.projections.Evm.$$aaveMarkets(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: ethereumNetwork,
					poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				},
			},
		])
	})

	it('resolves an Aave market snapshot by network and pool address', async () => {
		if (aaveMarketResolver == null)
			throw new Error('missing AaveMarket resolver')

		graphql.mockResolvedValueOnce({
			market: ethereumMarket,
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
	})
})
