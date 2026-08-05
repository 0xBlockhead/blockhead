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

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
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
			ethMarketInfoWire,
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
