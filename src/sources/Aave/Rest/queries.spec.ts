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
	getAccountPositions,
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

const ethereumMarketSnapshot = {
	...ethereumMarket,
	reserves: [
		{
			underlyingToken: {
				address: '0xA0b86991C6218B36C1d19D4a2e9Eb0cE3606eB48',
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
					value: '2290437225.192653',
				},
			},
			supplyInfo: {
				apy: {
					value: '0.031245',
				},
			},
			borrowInfo: {
				apy: {
					value: '0.042187',
				},
				availableLiquidity: {
					amount: {
						value: '1193820144.100001',
					},
				},
			},
		},
		{
			underlyingToken: {
				address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				name: 'Wrapped Ether',
				symbol: 'WETH',
				decimals: 18,
				imageUrl: 'https://statics.aave.com/icons/tokens/weth.svg',
				chainId: 1,
			},
			isFrozen: true,
			isPaused: false,
			size: {
				amount: {
					value: '100.5',
				},
			},
			supplyInfo: {
				apy: {
					value: '0',
				},
			},
		},
	],
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
			market: ethereumMarketSnapshot,
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
			reserves: [
				{
					underlyingToken: {
						address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					},
					borrowInfo: {
						apy: {
							value: '0.042187',
						},
					},
				},
				{
					underlyingToken: {
						address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					},
				},
			],
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

	it('requests the documented reserve snapshot fields in the primary market request', async () => {
		graphql.mockResolvedValueOnce({
			market: ethereumMarketSnapshot,
		})

		await getMarket({
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})

		expect(graphql.mock.calls[0][0].query).toContain('reserves {')
		expect(graphql.mock.calls[0][0].query).toContain('underlyingToken {')
		expect(graphql.mock.calls[0][0].query).toContain('availableLiquidity {')
		expect(graphql).toHaveBeenCalledTimes(1)
	})

	it('accepts a reserve without optional borrowInfo', async () => {
		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarketSnapshot,
				reserves: [
					ethereumMarketSnapshot.reserves[1],
				],
			},
		})

		await expect(getMarket({
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})).resolves.toMatchObject({
			reserves: [
				{
					isFrozen: true,
					isPaused: false,
				},
			],
		})
	})

	it('rejects a malformed reserve envelope', async () => {
		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarketSnapshot,
				reserves: [
					{
						...ethereumMarketSnapshot.reserves[0],
						isPaused: 'false',
					},
				],
			},
		})

		await expect(getMarket({
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid market response envelope`)
	})

	it('rejects reserve identity mismatches', async () => {
		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarketSnapshot,
				reserves: [
					{
						...ethereumMarketSnapshot.reserves[0],
						underlyingToken: {
							...ethereumMarketSnapshot.reserves[0].underlyingToken,
							chainId: 10,
						},
					},
				],
			},
		})

		await expect(getMarket({
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})).rejects.toThrow(`${Source.Aave_Rest}: reserve chain mismatch`)
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
				...ethereumMarketSnapshot,
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

describe('Aave account position operations', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('reads supply and borrow positions across markets on one chain', async () => {
		graphql
			.mockResolvedValueOnce({
				markets: [
					ethereumMarket,
				],
			})
			.mockResolvedValueOnce({
				userSupplies: [
					{
						market: {
							address: ethereumMarket.address,
							chain: {
								chainId: 1,
							},
						},
						currency: {
							address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
							symbol: 'USDC',
							decimals: 6,
							chainId: 1,
						},
						balance: {
							amount: {
								value: '1000.5',
							},
							usd: '1000.5',
						},
						apy: {
							value: '0.03',
						},
						isCollateral: true,
						canBeCollateral: true,
					},
				],
				userBorrows: [
					{
						market: {
							address: ethereumMarket.address,
							chain: {
								chainId: 1,
							},
						},
						currency: {
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
							symbol: 'WETH',
							decimals: 18,
							chainId: 1,
						},
						debt: {
							amount: {
								value: '2.5',
							},
							usd: '5000',
						},
						apy: {
							value: '0.05',
						},
					},
				],
			})

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		})).resolves.toEqual([
			{
				protocol: 'Aave V3',
				kind: 'supply',
				chainId: 1,
				account: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
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
				account: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
				poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
				underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				symbol: 'WETH',
				decimals: 18,
				debt: '2.5',
				debtUsd: '5000',
				apy: '0.05',
			},
		])
		expect(graphql).toHaveBeenCalledTimes(2)
	})

	it('returns an empty list when the chain has no markets', async () => {
		graphql.mockResolvedValueOnce({
			markets: [],
		})

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		})).resolves.toEqual([])
		expect(graphql).toHaveBeenCalledTimes(1)
	})

	it('returns an empty list when supplies and borrows are empty', async () => {
		graphql
			.mockResolvedValueOnce({
				markets: [
					ethereumMarket,
				],
			})
			.mockResolvedValueOnce({
				userSupplies: [],
				userBorrows: [],
			})

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x0000000000000000000000000000000000000001',
		})).resolves.toEqual([])
	})

	it('rejects unsupported chains before transport', async () => {
		await expect(getAccountPositions({
			chainId: 11155111,
			account: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		})).rejects.toThrow(`${Source.Aave_Rest}: unsupported chain id 11155111`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects an invalid account before transport', async () => {
		await expect(getAccountPositions({
			chainId: 1,
			account: 'not-an-address',
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid account not-an-address`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('fails closed when userSupplies is omitted', async () => {
		graphql
			.mockResolvedValueOnce({
				markets: [
					ethereumMarket,
				],
			})
			.mockResolvedValueOnce({
				userBorrows: [],
			})

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid account positions response envelope`)
	})

	it('fails closed when a supply row omits isCollateral', async () => {
		graphql
			.mockResolvedValueOnce({
				markets: [
					ethereumMarket,
				],
			})
			.mockResolvedValueOnce({
				userSupplies: [
					{
						market: {
							address: ethereumMarket.address,
							chain: {
								chainId: 1,
							},
						},
						currency: {
							address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
							symbol: 'USDC',
							decimals: 6,
							chainId: 1,
						},
						balance: {
							amount: {
								value: '1000.5',
							},
							usd: '1000.5',
						},
						apy: {
							value: '0.03',
						},
						canBeCollateral: true,
					},
				],
				userBorrows: [],
			})

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid account positions response envelope`)
	})

	it('fails closed when a borrow debt amount is not a string', async () => {
		graphql
			.mockResolvedValueOnce({
				markets: [
					ethereumMarket,
				],
			})
			.mockResolvedValueOnce({
				userSupplies: [],
				userBorrows: [
					{
						market: {
							address: ethereumMarket.address,
							chain: {
								chainId: 1,
							},
						},
						currency: {
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
							symbol: 'WETH',
							decimals: 18,
							chainId: 1,
						},
						debt: {
							amount: {
								value: 2.5,
							},
							usd: '5000',
						},
						apy: {
							value: '0.05',
						},
					},
				],
			})

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid account positions response envelope`)
	})
})
