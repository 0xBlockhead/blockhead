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

const { default: pendleRest } = await import('$/resolvers/Pendle-Rest.ts')

const baseNetwork = {
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

const pendleMarketResolver = pendleRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.PendleMarket
))

const baseMarketAddress = '0x00b321d89a8c36b3929f20b7955080baed706d1b'

const baseMarketWire = {
	name: 'USD0++',
	protocol: 'Usual',
	icon: 'https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/3c9a13b5-2552-4c85-9e70-922aa4277398.svg',
	address: baseMarketAddress,
	expiry: '2024-10-31T00:00:00.000Z',
	pt: '1-0x270d664d2fc7d962012a787aec8661ca83df24eb',
	yt: '1-0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
	sy: '1-0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
	underlyingAsset: '1-0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
	accountingAsset: '1-0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
	details: {
		liquidity: 7075.869756555831,
		totalTvl: 7075.869756555831,
		tradingVolume: 0,
		underlyingApy: 0,
		swapFeeApy: 0,
		pendleApy: 0,
		ytFloatingApy: 0,
		impliedApy: 0.7088987080424998,
		feeRate: 0.000999999999916401,
		totalPt: 178401.28677910106,
		totalSy: 7462.289393383086,
		totalSupply: 93250.65624517394,
		totalActiveSupply: 38076.7840071317,
		aggregatedApy: 0,
		maxBoostedApy: 0,
	},
	isNew: false,
	isPrime: false,
	timestamp: '2024-08-06T08:47:11.000Z',
	categoryIds: [
		'stables',
	],
	chainId: 1,
} as const

describe('Pendle Rest resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('registers under Pendle_Rest for PendleMarket', () => {
		expect(pendleRest.source).toBe(Source.Pendle_Rest)
		expect(pendleMarketResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (pendleMarketResolver == null)
			throw new Error('missing PendleMarket resolver')

		await expect(
			pendleMarketResolver.resolve.NetworkMarketAddress.resolve({
				$network: {
					caip2: {
						namespace: 'cosmos',
						reference: 'osmosis-1',
					},
				},
				marketAddress: baseMarketAddress,
			}, context)
		).rejects.toThrow(`${Source.Pendle_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('resolves a Pendle market snapshot by network and market address', async () => {
		if (pendleMarketResolver == null)
			throw new Error('missing PendleMarket resolver')

		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 100,
			skip: 0,
			results: [baseMarketWire],
		})

		const snapshot = await pendleMarketResolver.resolve.NetworkMarketAddress.resolve({
			$network: baseNetwork,
			marketAddress: baseMarketAddress,
		}, context)

		expect(pendleMarketResolver.projections.marketAddress(snapshot)).toBe(baseMarketAddress)
		expect(pendleMarketResolver.projections.name(snapshot)).toBe('USD0++')
		expect(pendleMarketResolver.projections.protocol(snapshot)).toBe('Usual')
		expect(pendleMarketResolver.projections.impliedApy(snapshot)).toBe(0.7088987080424998)
		expect(pendleMarketResolver.projections.ptAddress(snapshot)).toBe(
			'0x270d664d2fc7d962012a787aec8661ca83df24eb'
		)
		expect(pendleMarketResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: baseNetwork,
		})
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})

	it('throws when the market is absent from markets/all', async () => {
		if (pendleMarketResolver == null)
			throw new Error('missing PendleMarket resolver')

		sourceGetJson.mockResolvedValueOnce({
			total: 0,
			limit: 100,
			skip: 0,
			results: [],
		})

		await expect(
			pendleMarketResolver.resolve.NetworkMarketAddress.resolve({
				$network: baseNetwork,
				marketAddress: baseMarketAddress,
			}, context)
		).rejects.toThrow(`${Source.Pendle_Rest}: market not found`)
	})
})
