import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Morpho/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const {
	getAccountPositions,
	getMarket,
	getVault,
	listMarkets,
	listVaults,
} = await import('$/sources/Morpho/Graphql/queries.ts')

const binding = bindings[Source.Morpho_Graphql][0]

const market = {
	marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
	creationBlockNumber: 19326981,
	listed: true,
	chain: {
		id: 8453,
	},
	loanAsset: {
		address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
		symbol: 'USDC',
		decimals: 6,
	},
	collateralAsset: {
		address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
		symbol: 'cbBTC',
		decimals: 8,
	},
	lltv: '860000000000000000',
	irmAddress: '0x46415998764C29aB2a25CbeA6254146D50D22687',
	oracle: {
		address: '0x663BECd10daE6C4A3Dcd89F1d76c1174199639B9',
	},
	state: {
		supplyAssets: 1453572095573010,
		supplyShares: '1320911716664756276808',
		borrowAssets: 1315886527548583,
		borrowShares: '1181447494108739688848',
		timestamp: 1786052921,
		blockNumber: 49631787,
		fee: 0.05,
		utilization: 0.905,
		supplyApy: 0.041,
		borrowApy: 0.048,
		liquidityAssets: 137685568024427,
		collateralAssets: '25000000000',
		supplyAssetsUsd: 1453.57,
		borrowAssetsUsd: 1315.88,
		collateralAssetsUsd: 2_500_000,
		liquidityAssetsUsd: 137.68,
		netSupplyApy: 0.043,
		netBorrowApy: 0.046,
	},
}

const vault = {
	address: '0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB',
	symbol: 'steakUSDC',
	name: 'Steakhouse USDC',
	listed: true,
	asset: {
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		decimals: 6,
	},
	chain: {
		id: 1,
	},
	state: {
		totalAssets: 1_000_000_000000,
		totalSupply: '999000000000000000000000',
		timestamp: 1786052921,
		blockNumber: 21000000,
		totalAssetsUsd: 1_000_000,
		apy: 0.052,
		netApy: 0.049,
		fee: 0.1,
		sharePriceUsd: 1.001,
	},
}

describe('Morpho GraphQL market enumeration', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('posts the documented chain-filtered markets query', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				markets: {
					items: [
						market,
					],
					pageInfo: {
						countTotal: 8,
					},
				},
			},
		})))

		await expect(listMarkets({
			chainIds: [
				8453,
			],
			limit: 16,
			offset: 7,
		})).resolves.toEqual({
			items: [
				{
					marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
					chainId: 8453,
					loanAssetAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
					collateralAssetAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
					lltvWad: '860000000000000000',
					irmAddress: '0x46415998764c29ab2a25cbea6254146d50d22687',
					oracleAddress: '0x663becd10dae6c4a3dcd89f1d76c1174199639b9',
					creationBlockNumber: '19326981',
					listed: true,
					loanAssetSymbol: 'USDC',
					loanAssetDecimals: 6,
					collateralAssetSymbol: 'cbBTC',
					collateralAssetDecimals: 8,
					state: {
						totalSupplyAssets: '1453572095573010',
						totalSupplyShares: '1320911716664756276808',
						totalBorrowAssets: '1315886527548583',
						totalBorrowShares: '1181447494108739688848',
						lastAccrualTimestamp: 1786052921,
						lastIndexedBlock: '49631787',
						fee: 0.05,
						utilization: 0.905,
						supplyApy: 0.041,
						borrowApy: 0.048,
						liquidityAssets: '137685568024427',
						collateralAssets: '25000000000',
						supplyAssetsUsd: 1453.57,
						borrowAssetsUsd: 1315.88,
						collateralAssetsUsd: 2_500_000,
						liquidityAssetsUsd: 137.68,
						netSupplyApy: 0.043,
						netBorrowApy: 0.046,
					},
				},
			],
			countTotal: 8,
		})
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
				offset: 7,
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('chainId_in: $chainIds')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('first: $limit')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('skip: $offset')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('countTotal')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('utilization')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('supplyApy')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('liquidityAssets')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('listed')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('netSupplyApy')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('avgSupplyApy')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('rewards')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('symbol')
	})

	it('returns a successful empty market list', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				markets: {
					items: [],
					pageInfo: {
						countTotal: 0,
					},
				},
			},
		})))

		await expect(listMarkets({
			chainIds: [
				1,
			],
		})).resolves.toEqual({
			items: [],
			countTotal: 0,
		})
	})

	it.each([
		['unsupported chain', {
			chainIds: [999_999],
		}, 'unsupported chain id'],
		['duplicate chains', {
			chainIds: [8453, 8453],
		}, 'duplicate chain ids'],
		['invalid limit', {
			chainIds: [8453],
			limit: 101,
		}, 'limit must be between 1 and 100'],
	])('rejects %s before transport', async (_, options, error) => {
		await expect(listMarkets(options)).rejects.toThrow(`${Source.Morpho_Graphql}: ${error}`)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects duplicate market identities after normalization', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				markets: {
					items: [
						market,
						{
							...market,
							marketId: `0x${market.marketId.slice(2).toUpperCase()}`,
						},
					],
					pageInfo: {
						countTotal: 2,
					},
				},
			},
		})))

		await expect(listMarkets({
			chainIds: [
				8453,
			],
		})).rejects.toThrow(`${Source.Morpho_Graphql}: markets response contains duplicate market identities`)
	})

	it('accepts every chain id advertised by Morpho GraphQL chains', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				markets: {
					items: [],
					pageInfo: {
						countTotal: 0,
					},
				},
			},
		})))

		await expect(listMarkets({
			chainIds: [
				5042,
			],
		})).resolves.toEqual({
			items: [],
			countTotal: 0,
		})
		expect(sourceFetch).toHaveBeenCalledTimes(1)
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
		})).resolves.toEqual({
			marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
			chainId: 8453,
			loanAssetAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			collateralAssetAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
			lltvWad: '860000000000000000',
			irmAddress: '0x46415998764c29ab2a25cbea6254146d50d22687',
			oracleAddress: '0x663becd10dae6c4a3dcd89f1d76c1174199639b9',
			creationBlockNumber: '19326981',
			listed: true,
			loanAssetSymbol: 'USDC',
			loanAssetDecimals: 6,
			collateralAssetSymbol: 'cbBTC',
			collateralAssetDecimals: 8,
			state: {
				totalSupplyAssets: '1453572095573010',
				totalSupplyShares: '1320911716664756276808',
				totalBorrowAssets: '1315886527548583',
				totalBorrowShares: '1181447494108739688848',
				lastAccrualTimestamp: 1786052921,
				lastIndexedBlock: '49631787',
				fee: 0.05,
				utilization: 0.905,
				supplyApy: 0.041,
				borrowApy: 0.048,
				liquidityAssets: '137685568024427',
				collateralAssets: '25000000000',
				supplyAssetsUsd: 1453.57,
				borrowAssetsUsd: 1315.88,
				collateralAssetsUsd: 2_500_000,
				liquidityAssetsUsd: 137.68,
				netSupplyApy: 0.043,
				netBorrowApy: 0.046,
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			variables: {
				chainId: 8453,
				marketId: market.marketId,
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('marketById')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('creationBlockNumber')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('supplyAssets')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('borrowApy')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('collateralAssets')
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

	it('fails closed when market envelope omits required assets', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: {
					marketId: market.marketId,
					chain: {
						id: 8453,
					},
					lltv: market.lltv,
					irmAddress: market.irmAddress,
					oracle: market.oracle,
				},
			},
		})))

		await expect(getMarket({
			chainId: 8453,
			marketId: market.marketId,
		})).rejects.toThrow(`${Source.Morpho_Graphql}: invalid market response envelope`)
	})

	it('fails closed when supplyAssets exceeds safe integer number form', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: {
					...market,
					state: {
						...market.state,
						supplyAssets: Number.MAX_SAFE_INTEGER + 1,
					},
				},
			},
		})))

		await expect(getMarket({
			chainId: 8453,
			marketId: market.marketId,
		})).rejects.toThrow(`${Source.Morpho_Graphql}: invalid supplyAssets`)
	})

	it('fails closed when market tip utilization is non-finite', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: {
					...market,
					state: {
						...market.state,
						utilization: Number.NaN,
					},
				},
			},
		})))

		await expect(getMarket({
			chainId: 8453,
			marketId: market.marketId,
		})).rejects.toThrow(`${Source.Morpho_Graphql}: invalid market response envelope`)
	})

	it('retains GraphQL fee / APY / liquidity tip leftovers on transport without requiring enrolled projection', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: market,
			},
		})))

		await expect(getMarket({
			chainId: 8453,
			marketId: market.marketId,
		})).resolves.toMatchObject({
			state: {
				fee: 0.05,
				utilization: 0.905,
				supplyApy: 0.041,
				borrowApy: 0.048,
				liquidityAssets: '137685568024427',
			},
		})
	})

	it('omits market tip state when GraphQL state is null', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: {
					...market,
					state: null,
				},
			},
		})))

		await expect(getMarket({
			chainId: 8453,
			marketId: market.marketId,
		})).resolves.toEqual({
			marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
			chainId: 8453,
			loanAssetAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			collateralAssetAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
			lltvWad: '860000000000000000',
			irmAddress: '0x46415998764c29ab2a25cbea6254146d50d22687',
			oracleAddress: '0x663becd10dae6c4a3dcd89f1d76c1174199639b9',
			creationBlockNumber: '19326981',
			listed: true,
			loanAssetSymbol: 'USDC',
			loanAssetDecimals: 6,
			collateralAssetSymbol: 'cbBTC',
			collateralAssetDecimals: 8,
		})
	})

	it('preserves a market when optional source metrics are null', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: {
					...market,
					state: {
						...market.state,
						collateralAssetsUsd: null,
					},
				},
			},
		})))

		const result = await getMarket({
			chainId: 8453,
			marketId: market.marketId,
		})
		expect(result.state).not.toHaveProperty('collateralAssetsUsd')
	})

	it('normalizes string creationBlockNumber and BigInt decimal strings', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: {
					...market,
					creationBlockNumber: '19326981',
					state: {
						...market.state,
						supplyAssets: '1453572095573010',
						blockNumber: '49631787',
					},
				},
			},
		})))

		await expect(getMarket({
			chainId: 8453,
			marketId: market.marketId,
		})).resolves.toMatchObject({
			creationBlockNumber: '19326981',
			state: {
				totalSupplyAssets: '1453572095573010',
				lastIndexedBlock: '49631787',
			},
		})
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
					pageInfo: {
						countTotal: 1,
					},
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

describe('Morpho GraphQL MetaMorpho vault enumeration', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('posts the documented chain-filtered vaults query', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaults: {
					items: [
						vault,
					],
					pageInfo: {
						countTotal: 9,
					},
				},
			},
		})))

		await expect(listVaults({
			chainIds: [
				1,
			],
			limit: 16,
			offset: 8,
		})).resolves.toEqual({
			items: [
				{
					address: '0xbeef01735c132ada46aa9aa4c54623caa92a64cb',
					chainId: 1,
					symbol: 'steakUSDC',
					name: 'Steakhouse USDC',
					listed: true,
					assetAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					assetDecimals: 6,
					state: {
						totalAssets: '1000000000000',
						totalSupply: '999000000000000000000000',
						lastAccrualTimestamp: 1786052921,
						lastIndexedBlock: '21000000',
						totalAssetsUsd: 1_000_000,
						apy: 0.052,
						netApy: 0.049,
						fee: 0.1,
						sharePriceUsd: 1.001,
					},
				},
			],
			countTotal: 9,
		})
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
					1,
				],
				limit: 16,
				offset: 8,
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('chainId_in: $chainIds')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('first: $limit')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('skip: $offset')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('orderBy: TotalAssetsUsd')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('totalAssets')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('totalSupply')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('netApy')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('sharePriceUsd')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('netApyExcludingRewards')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('allRewards')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('countTotal')
	})

	it('returns a successful empty vault list', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaults: {
					items: [],
					pageInfo: {
						countTotal: 0,
					},
				},
			},
		})))

		await expect(listVaults({
			chainIds: [
				8453,
			],
		})).resolves.toEqual({
			items: [],
			countTotal: 0,
		})
	})

	it.each([
		['unsupported chain', {
			chainIds: [999_999],
		}, 'unsupported chain id'],
		['invalid limit', {
			chainIds: [1],
			limit: 101,
		}, 'limit must be between 1 and 100'],
	])('rejects %s before transport', async (_, options, error) => {
		await expect(listVaults(options)).rejects.toThrow(`${Source.Morpho_Graphql}: ${error}`)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects duplicate vault identities after normalization', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaults: {
					items: [
						vault,
						{
							...vault,
							address: `0x${vault.address.slice(2).toUpperCase()}`,
						},
					],
					pageInfo: {
						countTotal: 2,
					},
				},
			},
		})))

		await expect(listVaults({
			chainIds: [
				1,
			],
		})).rejects.toThrow(`${Source.Morpho_Graphql}: vaults response contains duplicate vault identities`)
	})

	it('reads and verifies a vault by its chain and address', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaultByAddress: vault,
			},
		})))

		await expect(getVault({
			chainId: 1,
			address: vault.address,
		})).resolves.toMatchObject({
			address: '0xbeef01735c132ada46aa9aa4c54623caa92a64cb',
			chainId: 1,
			symbol: 'steakUSDC',
			state: {
				totalAssets: '1000000000000',
				totalSupply: '999000000000000000000000',
				lastAccrualTimestamp: 1786052921,
				lastIndexedBlock: '21000000',
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			variables: {
				chainId: 1,
				address: '0xbeef01735c132ada46aa9aa4c54623caa92a64cb',
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('vaultByAddress')
	})

	it('omits vault tip state when GraphQL state is null', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaultByAddress: {
					...vault,
					state: null,
				},
			},
		})))

		await expect(getVault({
			chainId: 1,
			address: vault.address,
		})).resolves.toEqual({
			address: '0xbeef01735c132ada46aa9aa4c54623caa92a64cb',
			chainId: 1,
			symbol: 'steakUSDC',
			name: 'Steakhouse USDC',
			listed: true,
			assetAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			assetDecimals: 6,
		})
	})

	it('fails closed when vault tip totalAssets exceeds safe integer number form', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaultByAddress: {
					...vault,
					state: {
						...vault.state,
						totalAssets: Number.MAX_SAFE_INTEGER + 1,
					},
				},
			},
		})))

		await expect(getVault({
			chainId: 1,
			address: vault.address,
		})).rejects.toThrow(`${Source.Morpho_Graphql}: invalid totalAssets`)
	})

	it('fails closed when vault envelope omits required asset decimals', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaultByAddress: {
					address: vault.address,
					symbol: vault.symbol,
					name: vault.name,
					listed: vault.listed,
					asset: {
						address: vault.asset.address,
					},
					chain: vault.chain,
				},
			},
		})))

		await expect(getVault({
			chainId: 1,
			address: vault.address,
		})).rejects.toThrow(`${Source.Morpho_Graphql}: invalid vault response envelope`)
	})

	it('fails closed when a detail response omits its vault', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {},
		})))

		await expect(getVault({
			chainId: 1,
			address: vault.address,
		})).rejects.toThrow(`${Source.Morpho_Graphql}: vault response missing vaultByAddress`)
	})

	it('fails closed when a listed vault violates its chain filter', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaults: {
					items: [
						{
							...vault,
							chain: {
								id: 8453,
							},
						},
					],
					pageInfo: {
						countTotal: 1,
					},
				},
			},
		})))

		await expect(listVaults({
			chainIds: [
				1,
			],
		})).rejects.toThrow(`${Source.Morpho_Graphql}: vault chain filter violated`)
	})
})

describe('Morpho GraphQL account positions', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('reads market and vault positions from userByAddress', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				userByAddress: {
					address: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
					marketPositions: [
						{
							market: {
								marketId: '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115',
							},
							state: {
								supplyAssets: '1000',
								supplyShares: '1000',
								borrowAssets: '0',
								borrowShares: '0',
								collateral: '0',
								supplyAssetsUsd: 1,
							},
						},
						{
							market: {
								marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
							},
							state: {
								supplyAssets: '0',
								supplyShares: '0',
								borrowAssets: '0',
								borrowShares: '0',
								collateral: '0',
							},
						},
					],
					vaultPositions: [
						{
							vault: {
								address: '0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB',
								name: 'Steakhouse USDC',
								symbol: 'steakUSDC',
							},
							state: {
								assets: '500',
								shares: '500',
								assetsUsd: 0.5,
							},
						},
					],
				},
			},
		})))

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
		})).resolves.toEqual([
			{
				protocol: 'Morpho Blue',
				kind: 'market',
				chainId: 1,
				account: '0x821880a3e2bac432d67e5155e72bb655ef65fa5e',
				marketId: '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115',
				supplyAssets: '1000',
				supplyShares: '1000',
				borrowAssets: '0',
				borrowShares: '0',
				collateral: '0',
				supplyAssetsUsd: 1,
			},
			{
				protocol: 'Morpho Vault',
				kind: 'vault',
				chainId: 1,
				account: '0x821880a3e2bac432d67e5155e72bb655ef65fa5e',
				vaultAddress: '0xbeef01735c132ada46aa9aa4c54623caa92a64cb',
				vaultName: 'Steakhouse USDC',
				vaultSymbol: 'steakUSDC',
				assets: '500',
				shares: '500',
				assetsUsd: 0.5,
			},
		])
	})

	it('returns an empty list when userByAddress is null', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				userByAddress: null,
			},
		})))

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
		})).resolves.toEqual([])
	})

	it('rejects duplicate account position identities after normalization', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				userByAddress: {
					address: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
					marketPositions: [
						{
							market: {
								marketId: '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115',
							},
							state: {
								supplyAssets: '1000',
								supplyShares: '1000',
								borrowAssets: '0',
								borrowShares: '0',
								collateral: '0',
							},
						},
						{
							market: {
								marketId: '0x698FE98247A40C5771537B5786B2F3F9D78EB487B4CE4D75533CD0E94D88A115',
							},
							state: {
								supplyAssets: '2000',
								supplyShares: '2000',
								borrowAssets: '0',
								borrowShares: '0',
								collateral: '0',
							},
						},
					],
					vaultPositions: [],
				},
			},
		})))

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
		})).rejects.toThrow(`${Source.Morpho_Graphql}: account positions contain duplicate identities`)
	})

	it('rejects unsupported chains before transport', async () => {
		await expect(getAccountPositions({
			chainId: 999999,
			account: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
		})).rejects.toThrow(`${Source.Morpho_Graphql}: unsupported chain id 999999`)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails closed when marketPositions is omitted', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				userByAddress: {
					address: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
					vaultPositions: [],
				},
			},
		})))

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
		})).rejects.toThrow(`${Source.Morpho_Graphql}: invalid account positions response envelope`)
	})

	it('normalizes numeric account position amounts and fails closed on unsafe numbers', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					userByAddress: {
						address: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
						marketPositions: [
							{
								market: {
									marketId: '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115',
								},
								state: {
									supplyAssets: 1000,
									supplyShares: 1000,
									borrowAssets: 0,
									borrowShares: 0,
									collateral: 0,
								},
							},
						],
						vaultPositions: [],
					},
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					userByAddress: {
						address: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
						marketPositions: [
							{
								market: {
									marketId: '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115',
								},
								state: {
									supplyAssets: Number.MAX_SAFE_INTEGER + 1,
									supplyShares: '0',
									borrowAssets: '0',
									borrowShares: '0',
									collateral: '0',
								},
							},
						],
						vaultPositions: [],
					},
				},
			})))

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
		})).resolves.toEqual([
			{
				protocol: 'Morpho Blue',
				kind: 'market',
				chainId: 1,
				account: '0x821880a3e2bac432d67e5155e72bb655ef65fa5e',
				marketId: '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115',
				supplyAssets: '1000',
				supplyShares: '1000',
				borrowAssets: '0',
				borrowShares: '0',
				collateral: '0',
			},
		])
		await expect(getAccountPositions({
			chainId: 1,
			account: '0x821880a3E2bac432d67E5155e72BB655Ef65fa5E',
		})).rejects.toThrow(`${Source.Morpho_Graphql}: invalid supplyAssets`)
	})
})
