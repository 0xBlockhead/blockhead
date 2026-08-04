import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Aave/bindings.ts'
import { aaveChainByChainId, aaveChains } from '$/sources/Aave/Rest/constants.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

const graphql = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_shared/wire/Graphql/client.ts')>(),
	graphql,
}))

const {
	getMarket,
	listMarkets,
} = await import('$/sources/Aave/Rest/queries.ts')

const binding = bindings[Source.Aave_Rest][0]

const ethereumMarket = {
	name: 'AaveV3Ethereum',
	address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
	icon: 'https://statics.aave.com/ethereum.svg',
	totalMarketSize: '20169737076.235233639488619539',
	totalAvailableLiquidity: '10938067474.915557948999849733',
	chain: {
		chainId: 1,
		name: 'Ethereum',
		icon: 'https://statics.aave.com/ethereum.svg',
	},
} as const

describe('Aave V3 GraphQL binding', () => {
	it('targets the official AaveKit GraphQL endpoint', () => {
		expect(binding.target).toEqual({
			kind: SourceTargetKind.Global,
			key: 'aave-v3-api',
		})
		expect(binding.source).toBe(Source.Aave_Rest)
		expect(binding.wireProtocol).toBe(WireProtocol.Graphql)
		expect(binding.apiFamily).toBe(ApiFamily.GraphqlHttp)
		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(binding.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.v3.aave.com/graphql',
				corsEnabled: false,
			},
		])
	})

	it('catalogs documented EIP-155 chain ids including Ethereum', () => {
		expect(aaveChainByChainId[1]).toEqual({
			chainId: 1,
			name: 'Ethereum',
		})
		expect(aaveChains.some((chain) => chain.chainId === 8453)).toBe(true)
	})
})

describe('Aave market list/detail operations', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('lists markets for a supported chain', async () => {
		graphql.mockResolvedValueOnce({
			markets: [
				ethereumMarket,
			],
		})
		await expect(listMarkets({
			chainIds: [
				1,
			],
		})).resolves.toEqual([
			{
				...ethereumMarket,
				address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
			},
		])
		expect(graphql).toHaveBeenCalledWith(
			expect.objectContaining({
				binding,
				variables: {
					request: {
						chainIds: [
							1,
						],
					},
				},
			})
		)
	})

	it('accepts a successful empty market list', async () => {
		graphql.mockResolvedValueOnce({
			markets: [],
		})

		await expect(listMarkets({
			chainIds: [
				1,
			],
		})).resolves.toEqual([])
	})

	it('rejects a response without list data', async () => {
		graphql.mockResolvedValueOnce(undefined)

		await expect(listMarkets({
			chainIds: [
				1,
			],
		})).rejects.toThrow(`${Source.Aave_Rest}: markets response missing data`)
	})

	it('rejects a response without a markets envelope', async () => {
		graphql.mockResolvedValueOnce({})

		await expect(listMarkets({
			chainIds: [
				1,
			],
		})).rejects.toThrow(`${Source.Aave_Rest}: markets response missing markets`)
	})

	it('rejects malformed market list envelopes', async () => {
		graphql.mockResolvedValueOnce({
			markets: [
				{
					...ethereumMarket,
					chain: {
						...ethereumMarket.chain,
						chainId: '1',
					},
				},
			],
		})

		await expect(listMarkets({
			chainIds: [
				1,
			],
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid markets response envelope`)
	})

	it('rejects a market outside the requested chain filter', async () => {
		graphql.mockResolvedValueOnce({
			markets: [
				{
					...ethereumMarket,
					chain: {
						...ethereumMarket.chain,
						chainId: 10,
					},
				},
			],
		})

		await expect(listMarkets({
			chainIds: [
				1,
			],
		})).rejects.toThrow(`${Source.Aave_Rest}: market chain filter violated`)
	})

	it('rejects an empty chainIds list before transport', async () => {
		await expect(listMarkets({
			chainIds: [],
		})).rejects.toThrow(`${Source.Aave_Rest}: chainIds required`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects an unsupported chain id before transport', async () => {
		await expect(listMarkets({
			chainIds: [
				999999,
			],
		})).rejects.toThrow(`${Source.Aave_Rest}: unsupported chain id`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('reads a market by pool address and chain id', async () => {
		graphql.mockResolvedValueOnce({
			market: ethereumMarket,
		})
		await expect(getMarket({
			chainId: 1,
			poolAddress: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
		})).resolves.toMatchObject({
			name: 'AaveV3Ethereum',
			address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
			chain: {
				chainId: 1,
			},
		})
		expect(graphql).toHaveBeenCalledWith(
			expect.objectContaining({
				binding,
				variables: {
					request: {
						address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
						chainId: 1,
					},
				},
			})
		)
	})

	it('rejects a response without detail data', async () => {
		graphql.mockResolvedValueOnce(undefined)

		await expect(getMarket({
			chainId: 1,
			poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
		})).rejects.toThrow(`${Source.Aave_Rest}: market response missing data`)
	})

	it('rejects a response without a market envelope', async () => {
		graphql.mockResolvedValueOnce({})

		await expect(getMarket({
			chainId: 1,
			poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
		})).rejects.toThrow(`${Source.Aave_Rest}: market response missing market`)
	})

	it('rejects malformed market detail envelopes', async () => {
		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarket,
				totalAvailableLiquidity: null,
			},
		})

		await expect(getMarket({
			chainId: 1,
			poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid market response envelope`)
	})

	it('throws when the market is missing', async () => {
		graphql.mockResolvedValueOnce({
			market: null,
		})
		await expect(getMarket({
			chainId: 1,
			poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
		})).rejects.toThrow(`${Source.Aave_Rest}: market not found`)
	})

	it('rejects an invalid pool address before transport', async () => {
		await expect(getMarket({
			chainId: 1,
			poolAddress: 'not-an-address',
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid pool address`)
		expect(graphql).not.toHaveBeenCalled()
	})
})
