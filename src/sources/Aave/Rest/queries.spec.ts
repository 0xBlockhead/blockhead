import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Aave/bindings.ts'
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

const account = '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c'
const accountSupply = {
	market: { address: ethereumMarket.address, chain: { chainId: 1 } },
	currency: {
		address: '0xA0b86991c6218b36c1d19D4a2e9eb0ce3606eb48',
		symbol: 'USDC',
		decimals: 6,
		chainId: 1,
	},
	balance: { amount: { value: '1000.5' }, usd: '1000.5' },
	apy: { value: '0.03' },
	isCollateral: true,
	canBeCollateral: true,
} as const
const accountBorrow = {
	market: accountSupply.market,
	currency: {
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		symbol: 'WETH',
		decimals: 18,
		chainId: 1,
	},
	debt: { amount: { value: '2.5' }, usd: '5000' },
	apy: { value: '0.05' },
} as const

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
			binding,
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
			binding,
			chainIds: [
				1,
			],
		})).resolves.toEqual([])
	})

	it.each([
		['missing data', undefined, 'markets response missing data'],
		['missing operation', {}, 'markets response missing markets'],
		['malformed envelope', {
			markets: [{
				...ethereumMarket,
				chain: {
					...ethereumMarket.chain,
					chainId: '1',
				},
			}],
		}, 'invalid markets response envelope'],
	])('rejects %s', async (_, response, error) => {
		graphql.mockResolvedValueOnce(response)
		await expect(listMarkets({
			binding,
			chainIds: [1],
		})).rejects.toThrow(`${Source.Aave_Rest}: ${error}`)
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
			binding,
			chainIds: [
				1,
			],
		})).rejects.toThrow(`${Source.Aave_Rest}: market chain filter violated`)
	})

	it('rejects duplicate market identities after address normalization', async () => {
		graphql.mockResolvedValueOnce({
			markets: [
				ethereumMarket,
				{
					...ethereumMarket,
					address: ethereumMarket.address.toLowerCase(),
				},
			],
		})

		await expect(listMarkets({
			binding,
			chainIds: [
				1,
			],
		})).rejects.toThrow(`${Source.Aave_Rest}: duplicate market identity`)
	})

	it.each([
		['empty', [], 'chainIds required'],
		['unsupported', [999999], 'unsupported chain id'],
		['duplicate', [1, 1], 'duplicate chain ids'],
	])('rejects %s chain filters before transport', async (_, chainIds, error) => {
		await expect(listMarkets({
			binding,
			chainIds,
		})).rejects.toThrow(`${Source.Aave_Rest}: ${error}`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('reads a market by pool address and chain id', async () => {
		graphql.mockResolvedValueOnce({
			market: ethereumMarketSnapshot,
		})
		await expect(getMarket({
			binding,
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
			binding,
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})

		expect(graphql.mock.calls[0][0].query).toContain('reserves {')
		expect(graphql.mock.calls[0][0].query).toContain('underlyingToken {')
		expect(graphql.mock.calls[0][0].query).toContain('availableLiquidity {')
		expect(graphql.mock.calls[0][0].query).toContain('interestRateStrategyAddress')
		expect(graphql.mock.calls[0][0].query).toContain('unbacked {')
		expect(graphql.mock.calls[0][0].query).toContain('permitSupported')
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
			binding,
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

	it('accepts current explicit-null borrow and isolation configuration', async () => {
		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarketSnapshot,
				reserves: [
					{
						...ethereumMarketSnapshot.reserves[0],
						borrowInfo: null,
						isolationModeConfig: null,
					},
				],
			},
		})

		await expect(getMarket({
			binding,
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})).resolves.toMatchObject({
			reserves: [{
				borrowInfo: null,
				isolationModeConfig: null,
			}],
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
			binding,
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
			binding,
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})).rejects.toThrow(`${Source.Aave_Rest}: reserve chain mismatch`)
	})

	it('rejects duplicate reserve identities after address normalization', async () => {
		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarketSnapshot,
				reserves: [
					ethereumMarketSnapshot.reserves[0],
					{
						...ethereumMarketSnapshot.reserves[0],
						underlyingToken: {
							...ethereumMarketSnapshot.reserves[0].underlyingToken,
							address: ethereumMarketSnapshot.reserves[0].underlyingToken.address.toLowerCase(),
						},
					},
				],
			},
		})

		await expect(getMarket({
			binding,
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})).rejects.toThrow(`${Source.Aave_Rest}: duplicate reserve identity`)
	})

	it.each([
		['missing data', undefined, 'market response missing data'],
		['missing operation', {}, 'market response missing market'],
		['malformed envelope', { market: {
				...ethereumMarketSnapshot,
				totalAvailableLiquidity: null,
			} }, 'invalid market response envelope'],
		['missing market', { market: null }, 'market not found'],
	])('rejects %s', async (_, response, error) => {
		graphql.mockResolvedValueOnce(response)
		await expect(getMarket({
			binding,
			chainId: 1,
			poolAddress: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
		})).rejects.toThrow(`${Source.Aave_Rest}: ${error}`)
	})

	it('rejects an invalid pool address before transport', async () => {
		await expect(getMarket({
			binding,
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
				userSupplies: [accountSupply],
				userBorrows: [accountBorrow],
			})

		await expect(getAccountPositions({
			binding,
			chainId: 1,
			account,
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

	it('rejects duplicate account positions after identity normalization', async () => {
		graphql
			.mockResolvedValueOnce({
				markets: [
					ethereumMarket,
				],
			})
			.mockResolvedValueOnce({
				userSupplies: [
					accountSupply,
					{
						...accountSupply,
						currency: {
							...accountSupply.currency,
							address: accountSupply.currency.address.toLowerCase(),
						},
					},
				],
				userBorrows: [],
			})

		await expect(getAccountPositions({
			binding,
			chainId: 1,
			account: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		})).rejects.toThrow(`${Source.Aave_Rest}: duplicate account position identity`)
	})

	it('returns an empty list when the chain has no markets', async () => {
		graphql.mockResolvedValueOnce({
			markets: [],
		})

		await expect(getAccountPositions({
			binding,
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
			binding,
			chainId: 1,
			account: '0x0000000000000000000000000000000000000001',
		})).resolves.toEqual([])
	})

	it('rejects unsupported chains before transport', async () => {
		await expect(getAccountPositions({
			binding,
			chainId: 11155111,
			account: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		})).rejects.toThrow(`${Source.Aave_Rest}: unsupported chain id 11155111`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects an invalid account before transport', async () => {
		await expect(getAccountPositions({
			binding,
			chainId: 1,
			account: 'not-an-address',
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid account not-an-address`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it.each([
		['missing supplies', {
			userBorrows: [],
		}],
		['supply missing collateral flag', {
			userSupplies: [{
				...accountSupply,
				isCollateral: undefined,
			}],
			userBorrows: [],
		}],
		['non-string borrow debt', {
			userSupplies: [],
			userBorrows: [{
				...accountBorrow,
				debt: {
					...accountBorrow.debt,
					amount: { value: 2.5 },
				},
			}],
		}],
	])('fails closed for %s', async (_, response) => {
		graphql
			.mockResolvedValueOnce({
				markets: [ethereumMarket],
			})
			.mockResolvedValueOnce(response)

		await expect(getAccountPositions({
			binding,
			chainId: 1,
			account: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid account positions response envelope`)
	})

	it('accepts expanded reserve + eMode wire and normalizes aToken / oracle addresses', async () => {
		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarketSnapshot,
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
				reserves: [
					{
						...ethereumMarketSnapshot.reserves[0],
						aToken: {
							...ethereumMarketSnapshot.reserves[0].underlyingToken,
							address: '0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c',
							name: 'Aave Ethereum USDC',
							symbol: 'aEthUSDC',
						},
						vToken: {
							...ethereumMarketSnapshot.reserves[0].underlyingToken,
							address: '0x72E95b8931767C79bA4Bee7C3C2A6fa6bD5e4E5c',
							name: 'Aave Ethereum Variable Debt USDC',
							symbol: 'variableDebtEthUSDC',
						},
						flashLoanEnabled: true,
						permitSupported: true,
						interestRateStrategyAddress: '0x4dadee72232632524835F87CF6996428006799E8',
						unbacked: {
							amount: {
								value: '0',
							},
							usd: '0',
						},
						isolationModeConfig: {
							canBeCollateral: true,
							canBeBorrowed: false,
							debtCeiling: {
								amount: {
									value: '1000000',
								},
								usd: '1000000',
							},
							debtCeilingDecimals: 2,
							totalBorrows: {
								amount: {
									value: '250000',
								},
								usd: '250000',
							},
						},
						usdExchangeRate: '1',
						usdOracleAddress: '0x736bF902650874390e2fB8C5fCbE5F4d3F2eC6b0',
						size: {
							amount: {
								value: '2290437225.192653',
							},
							usd: '2290437225.192653',
						},
						supplyInfo: {
							apy: {
								value: '0.031245',
							},
							canBeCollateral: true,
							maxLTV: {
								value: '0.75',
							},
							liquidationThreshold: {
								value: '0.78',
							},
							liquidationBonus: {
								value: '0.045',
							},
							supplyCapReached: false,
							supplyCap: {
								amount: {
									value: '5000000000',
								},
								usd: '5000000000',
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
								usd: '1193820144.100001',
							},
							utilizationRate: {
								value: '0.48',
							},
							borrowCapReached: false,
							borrowCap: {
								amount: {
									value: '4500000000',
								},
								usd: '4500000000',
							},
							total: {
								amount: {
									value: '1096617081.092652',
								},
								usd: '1096617081.092652',
							},
							reserveFactor: {
								value: '0.1',
							},
							variableRateSlope1: {
								value: '0.04',
							},
							variableRateSlope2: {
								value: '0.6',
							},
							optimalUsageRate: {
								value: '0.9',
							},
						},
					},
				],
			},
		})

		await expect(getMarket({
			binding,
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})).resolves.toMatchObject({
			eModeCategories: [
				{
					id: 1,
					label: 'ETH correlated',
					maxLTV: {
						value: '0.93',
					},
				},
			],
			reserves: [
				{
					underlyingToken: {
						symbol: 'USDC',
						address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					},
					aToken: {
						address: '0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c',
						symbol: 'aEthUSDC',
					},
					vToken: {
						address: '0x72e95b8931767c79ba4bee7c3c2a6fa6bd5e4e5c',
						symbol: 'variableDebtEthUSDC',
					},
					flashLoanEnabled: true,
					permitSupported: true,
					interestRateStrategyAddress: '0x4dadee72232632524835f87cf6996428006799e8',
					unbacked: {
						amount: {
							value: '0',
						},
						usd: '0',
					},
					isolationModeConfig: {
						canBeCollateral: true,
						canBeBorrowed: false,
						debtCeiling: {
							amount: {
								value: '1000000',
							},
							usd: '1000000',
						},
						debtCeilingDecimals: 2,
					},
					usdExchangeRate: '1',
					usdOracleAddress: '0x736bf902650874390e2fb8c5fcbe5f4d3f2ec6b0',
					supplyInfo: {
						canBeCollateral: true,
						maxLTV: {
							value: '0.75',
						},
					},
					borrowInfo: {
						utilizationRate: {
							value: '0.48',
						},
						reserveFactor: {
							value: '0.1',
						},
					},
				},
			],
		})
	})

	it('fails closed when eMode category decimals are malformed', async () => {
		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarketSnapshot,
				eModeCategories: [
					{
						id: 1,
						label: 'ETH correlated',
						maxLTV: {
							value: 'not-a-decimal',
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

		await expect(getMarket({
			binding,
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid eMode decimal value`)
	})

	it.each([
		['supply cap', {
			supplyInfo: {
				apy: { value: '0.031245' },
				supplyCap: { amount: { value: 'not-a-decimal' } },
			},
		}],
		['unbacked amount', {
			unbacked: { amount: { value: 'bad' } },
		}],
	])('fails closed for malformed reserve %s', async (_, malformedFields) => {
		graphql.mockResolvedValueOnce({
			market: {
				...ethereumMarketSnapshot,
				reserves: [{
					...ethereumMarketSnapshot.reserves[0],
					...malformedFields,
				}],
			},
		})

		await expect(getMarket({
			binding,
			chainId: 1,
			poolAddress: ethereumMarket.address,
		})).rejects.toThrow(`${Source.Aave_Rest}: invalid reserve decimal value`)
	})

	it('preserves optional currency name on account supply positions', async () => {
		graphql
			.mockResolvedValueOnce({
				markets: [
					ethereumMarket,
				],
			})
			.mockResolvedValueOnce({
				userSupplies: [{
					...accountSupply,
						currency: {
							address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
							symbol: 'USDC',
							decimals: 6,
							name: 'USD Coin',
							chainId: 1,
						},
						balance: {
							amount: {
								value: '10',
							},
							usd: '10',
						},
						apy: {
							value: '0.01',
						},
					isCollateral: false,
				}],
				userBorrows: [],
			})

		await expect(getAccountPositions({
			binding,
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
				name: 'USD Coin',
				balance: '10',
				balanceUsd: '10',
				apy: '0.01',
				isCollateral: false,
				canBeCollateral: true,
			},
		])
	})
})
