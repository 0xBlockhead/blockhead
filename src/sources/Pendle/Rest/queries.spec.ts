import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Pendle/bindings.ts'
import {
	pendleByChainId,
	pendleChainDeployments,
	pendleMarketsAllMaxLimit,
} from '$/sources/Pendle/Rest/constants.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { listMarkets } = await import('$/sources/Pendle/Rest/queries.ts')

const binding = bindings[Source.Pendle_Rest][0]

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
		impliedApy: 0,
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
		'points',
		'rwa',
	],
	chainId: 1,
} as const

describe('Pendle REST binding', () => {
	it('targets the official Pendle public API', () => {
		expect(binding.target).toEqual({
			kind: SourceTargetKind.Global,
			key: 'pendle-api',
		})
		expect(binding.source).toBe(Source.Pendle_Rest)
		expect(binding.wireProtocol).toBe(WireProtocol.HttpRest)
		expect(binding.apiFamily).toBe(ApiFamily.RestJson)
		expect(binding.delivery).toBe(SourceDelivery.BrowserDirect)
		expect(binding.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api-v2.pendle.finance/core',
				corsEnabled: true,
			},
		])
	})

	it('catalogs documented Pendle chain deployments', () => {
		expect(pendleByChainId[1]).toEqual({
			chainId: 1,
			name: 'Ethereum',
		})
		expect(pendleChainDeployments.some((deployment) => deployment.chainId === 42161)).toBe(true)
	})
})

describe('Pendle market operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('lists markets from GET /v2/markets/all', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 768,
			limit: 1,
			skip: 0,
			results: [baseMarketWire],
		})
		await expect(listMarkets({
			chainId: 1,
			limit: 1,
		})).resolves.toEqual({
			total: 768,
			limit: 1,
			skip: 0,
			markets: [
				{
					chainId: 1,
					marketAddress: baseMarketAddress,
					name: 'USD0++',
					protocol: 'Usual',
					icon: baseMarketWire.icon,
					expiryTimestampMs: Date.parse('2024-10-31T00:00:00.000Z'),
					ptAddress: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
					ytAddress: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
					syAddress: '0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
					underlyingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					accountingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					categoryIds: [
						'stables',
						'points',
						'rwa',
					],
					isNew: false,
					isPrime: false,
					observedAtTimestampMs: Date.parse('2024-08-06T08:47:11.000Z'),
					details: {
						liquidityUsd: 7075.869756555831,
						totalTvlUsd: 7075.869756555831,
						tradingVolumeUsd: 0,
						underlyingApy: 0,
						swapFeeApy: 0,
						pendleApy: 0,
						ytFloatingApy: 0,
						impliedApy: 0,
						feeRate: 0.000999999999916401,
						totalPt: 178401.28677910106,
						totalSy: 7462.289393383086,
						totalSupply: 93250.65624517394,
						totalActiveSupply: 38076.7840071317,
						aggregatedApy: 0,
						maxBoostedApy: 0,
					},
				},
			],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/v2/markets/all?chainId=1&skip=0&limit=1')
		)
	})

	it('rejects an invalid limit before transport', async () => {
		await expect(listMarkets({
			chainId: 1,
			limit: pendleMarketsAllMaxLimit + 1,
		})).rejects.toThrow(`${Source.Pendle_Rest}: invalid limit`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects an unsupported chain before transport', async () => {
		await expect(listMarkets({
			chainId: 9999,
		})).rejects.toThrow(`${Source.Pendle_Rest}: unsupported chain id 9999`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('filters a chain-scoped market lookup by its address', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 1,
			skip: 0,
			results: [
				baseMarketWire,
			],
		})
		await expect(listMarkets({
			chainId: 1,
			marketAddresses: [
				baseMarketAddress,
			],
			limit: 1,
		})).resolves.toMatchObject({
			total: 1,
			markets: [
				{
					marketAddress: baseMarketAddress,
				},
			],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, `/v2/markets/all?chainId=1&ids=1-${baseMarketAddress}&skip=0&limit=1`)
		)
	})

	it('returns an empty list only from a schema-valid envelope', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 0,
			limit: 1,
			skip: 0,
			results: [],
		})
		await expect(listMarkets({
			chainId: 1,
			limit: 1,
		})).resolves.toEqual({
			total: 0,
			limit: 1,
			skip: 0,
			markets: [],
		})
	})

	it('rejects malformed markets/all envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 0,
			limit: 1,
			skip: 0,
		})
		await expect(listMarkets({
			chainId: 1,
			limit: 1,
		})).rejects.toThrow(`${Source.Pendle_Rest}: invalid markets/all response envelope`)
	})

	it('rejects market records outside requested filters', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 1,
			skip: 0,
			results: [
				{
					...baseMarketWire,
					chainId: 10,
				},
			],
		})
		await expect(listMarkets({
			chainId: 1,
			limit: 1,
		})).rejects.toThrow(`${Source.Pendle_Rest}: market chain filter violated`)

		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 1,
			skip: 0,
			results: [
				{
					...baseMarketWire,
					address: '0x1111111111111111111111111111111111111111',
				},
			],
		})
		await expect(listMarkets({
			chainId: 1,
			marketAddresses: [
				baseMarketAddress,
			],
			limit: 1,
		})).rejects.toThrow(`${Source.Pendle_Rest}: market address filter violated`)
	})
})
