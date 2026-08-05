import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Morpho/bindings.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const {
	getMarket,
	listMarkets,
} = await import('$/sources/Morpho/Graphql/queries.ts')

const binding = bindings[Source.Morpho_Graphql][0]

const market = {
	marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
	chain: {
		id: 8453,
	},
	loanAsset: {
		address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
	},
	collateralAsset: {
		address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
	},
	lltv: '860000000000000000',
	irmAddress: '0x46415998764C29aB2a25CbeA6254146D50D22687',
	oracle: {
		address: '0x663BECd10daE6C4A3Dcd89F1d76c1174199639B9',
	},
}

describe('Morpho GraphQL market enumeration', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('registers the official GraphQL endpoint', () => {
		expect(binding).toMatchObject({
			source: Source.Morpho_Graphql,
			target: {
				kind: SourceTargetKind.Global,
				key: 'morpho-api',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.morpho.org/graphql',
					corsEnabled: true,
				},
			],
			wireProtocol: WireProtocol.Graphql,
			apiFamily: ApiFamily.GraphqlHttp,
			delivery: SourceDelivery.BrowserDirect,
		})
	})

	it('posts the documented chain-filtered markets query', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				markets: {
					items: [
						market,
					],
				},
			},
		})))

		await expect(listMarkets({
			chainIds: [
				8453,
			],
			limit: 16,
		})).resolves.toEqual([
			{
				marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
				chainId: 8453,
				loanAssetAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
				collateralAssetAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
				lltvWad: '860000000000000000',
				irmAddress: '0x46415998764c29ab2a25cbea6254146d50d22687',
				oracleAddress: '0x663becd10dae6c4a3dcd89f1d76c1174199639b9',
			},
		])
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://api.morpho.org/graphql',
			expect.objectContaining({
				method: 'POST',
			})
		)
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			variables: {
				chainIds: [
					8453,
				],
				limit: 16,
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('chainId_in: $chainIds')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('first: $limit')
	})

	it('returns a successful empty market list', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				markets: {
					items: [],
				},
			},
		})))

		await expect(listMarkets({
			chainIds: [
				1,
			],
		})).resolves.toEqual([])
	})

	it('rejects unsupported chains before transport', async () => {
		await expect(listMarkets({
			chainIds: [
				999_999,
			],
		})).rejects.toThrow(`${Source.Morpho_Graphql}: unsupported chain id`)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects invalid limits before transport', async () => {
		await expect(listMarkets({
			chainIds: [
				8453,
			],
			limit: 101,
		})).rejects.toThrow(`${Source.Morpho_Graphql}: limit must be between 1 and 100`)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('reads and verifies a market by its chain and id', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: market,
			},
		})))

		await expect(getMarket({
			chainId: 8453,
			marketId: market.marketId,
		})).resolves.toMatchObject({
			marketId: market.marketId,
			chainId: 8453,
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			variables: {
				chainId: 8453,
				marketId: market.marketId,
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('marketById')
	})

	it('fails closed when a detail response omits its market', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {},
		})))

		await expect(getMarket({
			chainId: 8453,
			marketId: market.marketId,
		})).rejects.toThrow(`${Source.Morpho_Graphql}: market response missing marketById`)
	})

	it('fails closed when a listed market violates its chain filter', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				markets: {
					items: [
						{
							...market,
							chain: {
								id: 1,
							},
						},
					],
				},
			},
		})))

		await expect(listMarkets({
			chainIds: [
				8453,
			],
		})).rejects.toThrow(`${Source.Morpho_Graphql}: market chain filter violated`)
	})
})
