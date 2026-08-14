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

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getMarket,
	getMarketTokens,
	listMarkets,
} = await import('$/sources/Pendle/Rest/queries.ts')

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
				locator: 'https://api-v2.pendle.finance/core/',
				corsEnabled: true,
			},
		])
	})

	it('catalogs documented Pendle chain deployments', () => {
		expect(pendleByChainId[1]).toEqual({
			chainId: 1,
			name: 'Ethereum',
		})
		expect(pendleByChainId[196]).toEqual({
			chainId: 196,
			name: 'X Layer',
		})
		expect(pendleByChainId[9745]).toEqual({
			chainId: 9745,
			name: 'Plasma',
		})
		expect(pendleChainDeployments.some((deployment) => deployment.chainId === 42161)).toBe(true)
	})
})

describe('Pendle market operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('accepts current live markets/all fields without exposing provider-only arrays', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 1,
			skip: 0,
			results: [
				{
					...baseMarketWire,
					rewardTokens: [
						'1-0x808507121b80c02388fad14726482e061b8da827',
					],
					inputTokens: [
						'1-0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					],
					outputTokens: [
						'1-0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					],
				},
			],
		})
		const page = await listMarkets({
			chainId: 1,
			limit: 1,
		})
		expect(page).toMatchObject({
			total: 1,
			markets: [
				{
					marketAddress: baseMarketAddress,
				},
			],
		})
		expect(page.markets[0]).not.toHaveProperty('rewardTokens')
	})

	it('rejects undeclared markets/all fields', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 1,
			skip: 0,
			results: [
				{
					...baseMarketWire,
					unexpected: true,
				},
			],
		})

		await expect(listMarkets({
			chainId: 1,
			limit: 1,
		})).rejects.toThrow('invalid markets/all response envelope')
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
						'points',
						'rwa',
						'stables',
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
			'https://api-v2.pendle.finance/core/v2/markets/all?chainId=1&skip=0&limit=1'
		)
	})

	it('loads a single market via getMarket and keeps accounting-asset plus extra APY wire', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 1,
			skip: 0,
			results: [
				{
					...baseMarketWire,
					details: {
						...baseMarketWire.details,
						swapFeeApy: 0.02,
						pendleApy: 0.03,
						ytFloatingApy: -0.01,
						aggregatedApy: 0.04,
						maxBoostedApy: 0.05,
					},
					categoryIds: [
						'rwa',
						'stables',
						'stables',
						'points',
					],
				},
			],
		})
		await expect(getMarket({
			chainId: 1,
			marketAddress: baseMarketAddress,
		})).resolves.toMatchObject({
			marketAddress: baseMarketAddress,
			accountingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			categoryIds: [
				'points',
				'rwa',
				'stables',
			],
			details: {
				swapFeeApy: 0.02,
				pendleApy: 0.03,
				ytFloatingApy: -0.01,
				aggregatedApy: 0.04,
				maxBoostedApy: 0.05,
			},
		})
	})

	it('rejects empty category ids before accepting a market', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 1,
			skip: 0,
			results: [
				{
					...baseMarketWire,
					categoryIds: [
						'stables',
						'',
					],
				},
			],
		})
		await expect(listMarkets({
			chainId: 1,
			limit: 1,
		})).rejects.toThrow(`${Source.Pendle_Rest}: market category id must be non-empty`)
	})

	it('rejects getMarket when markets/all returns no rows', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 0,
			limit: 1,
			skip: 0,
			results: [],
		})
		await expect(getMarket({
			chainId: 1,
			marketAddress: baseMarketAddress,
		})).rejects.toThrow(`${Source.Pendle_Rest}: market not found ${baseMarketAddress}`)
	})

	it.each([
		['invalid limit', {
			chainId: 1,
			limit: pendleMarketsAllMaxLimit + 1,
		}, 'invalid limit'],
		['duplicate addresses', {
			chainId: 1,
			marketAddresses: [baseMarketAddress, baseMarketAddress.toUpperCase()],
		}, 'market addresses contains duplicate addresses'],
		['unsupported chain', {
			chainId: 9999,
		}, 'unsupported chain id 9999'],
	])('rejects %s before transport', async (_, options, error) => {
		await expect(listMarkets(options)).rejects.toThrow(`${Source.Pendle_Rest}: ${error}`)
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
			`https://api-v2.pendle.finance/core/v2/markets/all?chainId=1&ids=1-${baseMarketAddress}&skip=0&limit=1`
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

	it.each([
		[
			'foreign page coordinates',
			{
				total: 1,
				limit: 1,
				skip: 1,
				results: [baseMarketWire],
			},
			'markets/all response skip mismatch',
		],
		[
			'duplicate market addresses',
			{
				total: 2,
				limit: 2,
				skip: 0,
				results: [
					baseMarketWire,
					{
						...baseMarketWire,
						address: baseMarketAddress.toUpperCase(),
					},
				],
			},
			'markets/all response contains duplicate market addresses',
		],
	])('rejects %s from markets/all', async (_label, response, message) => {
		sourceGetJson.mockResolvedValueOnce(response)
		await expect(listMarkets({
			chainId: 1,
			limit: response.limit,
		})).rejects.toThrow(`${Source.Pendle_Rest}: ${message}`)
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

	it('loads typed SY, PT, and YT market token legs', async () => {
		sourceGetJson.mockResolvedValueOnce({
			tokensMintSy: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensRedeemSy: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensIn: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
				'0x270d664d2fc7d962012a787aec8661ca83df24eb',
			],
			tokensOut: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
				'0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
			],
		})
		await expect(getMarketTokens({
			chainId: 1,
			marketAddress: baseMarketAddress,
		})).resolves.toEqual({
			chainId: 1,
			marketAddress: baseMarketAddress,
			tokensMintSy: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensRedeemSy: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensIn: [
				'0x270d664d2fc7d962012a787aec8661ca83df24eb',
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensOut: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
				'0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
			],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://api-v2.pendle.finance/core/v1/sdk/1/markets/${baseMarketAddress}/tokens`
		)
	})

	it('rejects getMarket when markets/all reports an ambiguous total', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 2,
			limit: 1,
			skip: 0,
			results: [
				baseMarketWire,
			],
		})
		await expect(getMarket({
			chainId: 1,
			marketAddress: baseMarketAddress,
		})).rejects.toThrow(`${Source.Pendle_Rest}: ambiguous market ${baseMarketAddress}`)
	})

	it('rejects feeRate outside [0, 1]', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 100,
			skip: 0,
			results: [
				{
					...baseMarketWire,
					details: {
						...baseMarketWire.details,
						feeRate: 1.5,
					},
				},
			],
		})
		await expect(listMarkets({
			chainId: 1,
		})).rejects.toThrow(`${Source.Pendle_Rest}: market details.feeRate must be a finite number in [0, 1]`)
	})

	it('rejects negative totalTvl before accepting a market', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 100,
			skip: 0,
			results: [
				{
					...baseMarketWire,
					details: {
						...baseMarketWire.details,
						totalTvl: -1,
					},
				},
			],
		})
		await expect(listMarkets({
			chainId: 1,
		})).rejects.toThrow(`${Source.Pendle_Rest}: market details.totalTvl must be a finite non-negative number`)
	})

	it('rejects unsupported chains and invalid market tokens envelopes before trusting addresses', async () => {
		await expect(getMarketTokens({
			chainId: 9999,
			marketAddress: baseMarketAddress,
		})).rejects.toThrow(`${Source.Pendle_Rest}: unsupported chain id 9999`)
		expect(sourceGetJson).not.toHaveBeenCalled()

		sourceGetJson.mockResolvedValueOnce({
			tokensMintSy: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
		})
		await expect(getMarketTokens({
			chainId: 1,
			marketAddress: baseMarketAddress,
		})).rejects.toThrow(`${Source.Pendle_Rest}: invalid market tokens response envelope`)

		sourceGetJson.mockResolvedValueOnce({
			tokensMintSy: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensRedeemSy: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensIn: [
				'not-an-address',
			],
			tokensOut: [
				'0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
			],
		})
		await expect(getMarketTokens({
			chainId: 1,
			marketAddress: baseMarketAddress,
		})).rejects.toThrow(`${Source.Pendle_Rest}: invalid tokensIn not-an-address`)

		sourceGetJson.mockResolvedValueOnce({
			tokensMintSy: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensRedeemSy: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensIn: [
				'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
			],
			tokensOut: [
				'0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
			],
		})
		await expect(getMarketTokens({
			chainId: 1,
			marketAddress: baseMarketAddress,
		})).rejects.toThrow(`${Source.Pendle_Rest}: tokensMintSy contains duplicate addresses`)
	})
})
