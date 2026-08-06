import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Curve/bindings.ts'
import {
	curvePlatformByChainId,
	curvePlatforms,
} from '$/sources/Curve/Rest/constants.ts'
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
	getGauge,
	getGaugesStatus,
	getLendingVault,
	getPool,
	listGauges,
	listLendingVaults,
	listPools,
	listPoolsByRegistry,
	listPoolsOnChain,
} = await import('$/sources/Curve/Rest/queries.ts')

const binding = bindings[Source.Curve_Rest][0]

const threePoolAddress = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'
const threePoolGaugeAddress = '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a'
const threePoolCoins = [
	{
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		usdPrice: 1.0000718888448834,
		decimals: '18',
		isBasePoolLpToken: false,
		symbol: 'DAI',
		name: 'Dai Stablecoin',
		poolBalance: '25837415992433535654889714',
	},
	{
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		usdPrice: 1,
		decimals: '6',
		isBasePoolLpToken: false,
		symbol: 'USDC',
		name: 'USD Coin',
		poolBalance: '25837112339039',
	},
	{
		address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
		usdPrice: 0.9992896649355829,
		decimals: '6',
		isBasePoolLpToken: false,
		symbol: 'USDT',
		name: 'Tether USD',
		poolBalance: '107913050980945',
	},
] as const
const threePoolWire = {
	id: '0',
	address: threePoolAddress,
	name: 'Curve.fi DAI/USDC/USDT',
	symbol: '3Crv',
	lpTokenAddress: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
	coinsAddresses: [
		'0x6B175474E89094C44Da98b954EedeAC495271d0F',
		'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		'0xdAC17F958D2ee523a2206206994597C13D831ec7',
		'0x0000000000000000000000000000000000000000',
	],
	decimals: [
		'18',
		'6',
		'6',
		'0',
	],
	coins: [
		...threePoolCoins,
	],
	virtualPrice: '1039823717342561370',
	amplificationCoefficient: '4000',
	totalSupply: '153873339037508580484005791',
	usdTotal: 159936280.19153345,
	isMetaPool: false,
	gaugeAddress: threePoolGaugeAddress,
	assetTypeName: 'usd',
	creationBlockNumber: 10809473,
	creationTs: 1599422178,
} as const

const threePoolSnapshot = {
	blockchainId: 'ethereum',
	chainId: 1,
	registryId: 'main',
	poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
	name: 'Curve.fi DAI/USDC/USDT',
	symbol: '3Crv',
	lpTokenAddress: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
	coinAddresses: [
		'0x6b175474e89094c44da98b954eedeac495271d0f',
		'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		'0xdac17f958d2ee523a2206206994597c13d831ec7',
	],
	coins: [
		{
			address: '0x6b175474e89094c44da98b954eedeac495271d0f',
			symbol: 'DAI',
			name: 'Dai Stablecoin',
			decimals: '18',
			poolBalance: '25837415992433535654889714',
			usdPrice: 1.0000718888448834,
			isBasePoolLpToken: false,
		},
		{
			address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: '6',
			poolBalance: '25837112339039',
			usdPrice: 1,
			isBasePoolLpToken: false,
		},
		{
			address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: '6',
			poolBalance: '107913050980945',
			usdPrice: 0.9992896649355829,
			isBasePoolLpToken: false,
		},
	],
	virtualPrice: '1039823717342561370',
	amplificationCoefficient: '4000',
	totalSupply: '153873339037508580484005791',
	usdTotal: 159936280.19153345,
	isMetaPool: false,
	gaugeAddress: '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a',
	assetTypeName: 'usd',
	creationBlockNumber: 10809473,
	creationTs: 1599422178,
} as const

const threePoolGaugeWire = {
	blockchainId: 'ethereum',
	isPool: true,
	name: 'DAI+USDC+USDT (0xbEbc…F1C7)',
	shortName: 'DAI+USDC+USDT (0xbEbc…)',
	gauge: threePoolGaugeAddress,
	gaugeType: '0',
	gauge_data: {
		inflation_rate: '3663926723928765860',
		working_supply: '9626824729730440416073351',
	},
	gauge_controller: {
		gauge_relative_weight: '161021027655',
		gauge_future_relative_weight: '157839205884',
		get_gauge_weight: '121927030352704080000',
		inflation_rate: '3663926723928765860',
	},
	side_chain: false,
	is_killed: false,
	hasNoCrv: false,
	lpTokenPrice: 1.0394304438681095,
	gaugeCrvApy: [
		0.000015963731454823868,
		0.00003990932863705967,
	],
	gaugeFutureCrvApy: [
		0.000015648283534579658,
		0.00003912070883644914,
	],
	swap: threePoolAddress,
	swap_token: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
	type: 'stable',
	factory: false,
} as const

const lendingVaultWire = {
	id: 'oneway-0',
	name: 'Borrow crvUSD (wstETH collateral)',
	address: '0x8cf1DE26729cfB7137AF1A6B2a665e099EC319b5',
	controllerAddress: '0x1E0165DbD2019441aB7927C018701f3138114D71',
	ammAddress: '0x847D7a5e4Aa4b380043B2908C29a92E2e5157E64',
	monetaryPolicyAddress: '0x066a89BdF4eFb6aD58427D278f16B7a2C53c3ceE',
	rates: {
		borrowApr: 0.1738,
		borrowApy: 0.1897,
		borrowApyPcent: 18.9725,
		lendApr: 0.0052,
		lendApy: 0.0052,
		lendApyPcent: 0.5201,
	},
	gaugeAddress: '0x222d910ef37c06774e1edb9dc9459664f73776f0',
	assets: {
		borrowed: {
			symbol: 'crvUSD',
			decimals: 18,
			address: '0xf939e0a03fb07f59a73314e73794be0e57ac1b4e',
			blockchainId: 'ethereum',
			usdPrice: 1,
		},
		collateral: {
			symbol: 'wstETH',
			decimals: 18,
			address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
			blockchainId: 'ethereum',
			usdPrice: 2366.23,
		},
	},
	vaultShares: {
		pricePerShare: 0.00107597892961056,
		totalShares: 68216.41,
	},
	totalSupplied: {
		total: 73.4,
		usdTotal: 73.39,
	},
	borrowed: {
		total: 2.19,
		usdTotal: 2.19,
	},
	availableToBorrow: {
		total: 71.21,
		usdTotal: 71.2,
	},
	usdTotal: 73.39,
	blockchainId: 'ethereum',
	registryId: 'oneway',
} as const

describe('Curve REST binding', () => {
	it('targets the official Curve public API', () => {
		expect(binding.target).toEqual({
			kind: SourceTargetKind.Global,
			key: 'curve-api',
		})
		expect(binding.source).toBe(Source.Curve_Rest)
		expect(binding.wireProtocol).toBe(WireProtocol.HttpRest)
		expect(binding.apiFamily).toBe(ApiFamily.RestJson)
		expect(binding.delivery).toBe(SourceDelivery.BrowserDirect)
		expect(binding.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.curve.finance',
				corsEnabled: true,
			},
		])
	})

	it('catalogs Curve platforms and their registries from getPlatforms snapshot', () => {
		expect(curvePlatformByChainId[1]).toEqual({
			blockchainId: 'ethereum',
			chainId: 1,
			registries: expect.arrayContaining([
				'main',
				'factory',
				'factory-stable-ng',
			]),
		})
		expect(curvePlatforms.some((platform) => platform.chainId === 42161)).toBe(true)
	})
})

describe('Curve pool operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('lists pool addresses via getPoolList and normalizes stable-factory', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolList: [
					{
						type: 'main',
						address: threePoolAddress,
					},
					{
						type: 'stable-factory',
						address: '0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2',
					},
				],
			},
		})

		await expect(listPools({
			chainId: 1,
		})).resolves.toEqual([
			{
				blockchainId: 'ethereum',
				chainId: 1,
				registryId: 'main',
				poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
			},
			{
				blockchainId: 'ethereum',
				chainId: 1,
				registryId: 'factory',
				poolAddress: '0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2',
			},
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.curve.finance/v1/getPoolList/ethereum'
		)
	})

	it('returns empty lists only from successful envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				success: true,
				data: {
					poolList: [],
				},
			})
			.mockResolvedValueOnce({
				success: true,
				data: {
					poolData: [],
				},
			})

		await expect(listPools({
			chainId: 1,
		})).resolves.toEqual([])
		await expect(listPoolsByRegistry({
			chainId: 1,
			registryId: 'main',
		})).resolves.toEqual([])
	})

	it('rejects malformed pool list and registry envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				success: false,
				data: {
					poolList: [],
				},
			})
			.mockResolvedValueOnce({
				success: true,
				data: {
					poolData: [
						{
							...threePoolWire,
							name: null,
						},
					],
				},
			})

		await expect(listPools({
			chainId: 1,
		})).rejects.toThrow('Curve_Rest: invalid pool list response envelope')
		await expect(listPoolsByRegistry({
			chainId: 1,
			registryId: 'main',
		})).rejects.toThrow('Curve_Rest: invalid pools response envelope')
	})

	it('reads registry pool detail via getPools including coin legs and balances', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					threePoolWire,
				],
			},
		})

		await expect(listPoolsByRegistry({
			chainId: 1,
			registryId: 'main',
		})).resolves.toEqual([
			threePoolSnapshot,
		])
	})

	it('lists all registries on a chain via getPools/all', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					{
						...threePoolWire,
						registryId: 'main',
						blockchainId: 'ethereum',
					},
				],
				tvl: 1_000,
			},
		})

		await expect(listPoolsOnChain({
			chainId: 1,
		})).resolves.toEqual([
			threePoolSnapshot,
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.curve.finance/v1/getPools/all/ethereum'
		)
	})

	it('rejects malformed optional pool fields instead of omitting them', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					{
						...threePoolWire,
						virtualPrice: '',
					},
				],
			},
		})

		await expect(listPoolsByRegistry({
			chainId: 1,
			registryId: 'main',
		})).rejects.toThrow('Curve_Rest: invalid virtual price')

		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					{
						...threePoolWire,
						creationTs: 1599422178.5,
					},
				],
			},
		})

		await expect(listPoolsByRegistry({
			chainId: 1,
			registryId: 'main',
		})).rejects.toThrow('Curve_Rest: invalid creation timestamp')
	})

	it('rejects duplicate pool addresses in list and registry envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				success: true,
				data: {
					poolList: [
						{
							type: 'main',
							address: threePoolAddress,
						},
						{
							type: 'main',
							address: threePoolAddress,
						},
					],
				},
			})

		await expect(listPools({
			chainId: 1,
		})).rejects.toThrow('Curve_Rest: pool list contains duplicate pool addresses')

		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					threePoolWire,
					threePoolWire,
				],
			},
		})

		await expect(listPoolsByRegistry({
			chainId: 1,
			registryId: 'main',
		})).rejects.toThrow('Curve_Rest: pools response contains duplicate pool addresses')
	})

	it('rejects inconsistent pool coin metadata', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					{
						...threePoolWire,
						decimals: [
							'18',
						],
					},
				],
			},
		})

		await expect(listPoolsByRegistry({
			chainId: 1,
			registryId: 'main',
		})).rejects.toThrow('Curve_Rest: pool 0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7 has mismatched coin metadata')
	})

	it('rejects coin legs that omit a coinsAddresses entry', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					{
						...threePoolWire,
						coins: threePoolCoins.slice(0, 2),
					},
				],
			},
		})

		await expect(listPoolsByRegistry({
			chainId: 1,
			registryId: 'main',
		})).rejects.toThrow('Curve_Rest: pool 0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7 coin legs missing 0xdac17f958d2ee523a2206206994597c13d831ec7')
	})

	it('discovers a pool registry before resolving its detail', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolList: [
					{
						type: 'stable-factory',
						address: threePoolAddress,
					},
				],
			},
		})
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					threePoolWire,
				],
			},
		})

		await expect(getPool({
			chainId: 1,
			poolAddress: threePoolAddress,
		})).resolves.toMatchObject({
			poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
			symbol: '3Crv',
			registryId: 'factory',
			coins: expect.arrayContaining([
				expect.objectContaining({
					symbol: 'DAI',
					poolBalance: '25837415992433535654889714',
				}),
			]),
		})
		expect(sourceGetJson).toHaveBeenCalledTimes(2)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			binding,
			'https://api.curve.finance/v1/getPoolList/ethereum'
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			binding,
			'https://api.curve.finance/v1/getPools/ethereum/factory'
		)
	})

	it('rejects unsupported chains before transport', async () => {
		await expect(listPools({
			chainId: 99999,
		})).rejects.toThrow('Curve_Rest: unsupported chain id 99999')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})

describe('Curve gauge operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('lists gauges via getAllGauges and filters by chain', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				'DAI+USDC+USDT (0xbEbc…F1C7)': threePoolGaugeWire,
				'fantom-FRAX+DAI+USDC (0x7a65…7320)': {
					isPool: true,
					name: 'fantom-FRAX+DAI+USDC (0x7a65…7320)',
					shortName: 'ftm-FRAX+DAI+USDC (0x7a65…)',
					gauge: '0xe36a20444df2758f7ccd8d5a27f05c60e9996e34',
					rootGauge: '0xe36a20444df2758f7ccd8d5a27f05c60e9996e34',
					side_chain: true,
					gauge_data: {
						inflation_rate: 0,
						working_supply: '0',
					},
					gauge_controller: {
						gauge_relative_weight: '0',
						gauge_future_relative_weight: '0',
						get_gauge_weight: '0',
						inflation_rate: 0,
					},
					hasNoCrv: true,
					is_killed: true,
					lpTokenPrice: 1.0794158606751625,
					gaugeStatus: {
						areCrvRewardsStuckInBridge: false,
						rewardsNeedNudging: false,
					},
					blockchainId: 'fantom',
					swap: '0x7a656b342e14f745e2b164890e88017e27ae7320',
					swap_token: '0x7a656b342e14f745e2b164890e88017e27ae7320',
					type: 'stable',
					factory: true,
				},
			},
		})

		await expect(listGauges({
			chainId: 1,
		})).resolves.toEqual([
			{
				key: 'DAI+USDC+USDT (0xbEbc…F1C7)',
				blockchainId: 'ethereum',
				chainId: 1,
				gaugeAddress: '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a',
				name: 'DAI+USDC+USDT (0xbEbc…F1C7)',
				shortName: 'DAI+USDC+USDT (0xbEbc…)',
				isPool: true,
				isFactory: false,
				isSideChain: false,
				isKilled: false,
				hasNoCrv: false,
				poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
				lpTokenAddress: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
				type: 'stable',
				gaugeType: '0',
				workingSupply: '9626824729730440416073351',
				inflationRate: '3663926723928765860',
				gaugeRelativeWeight: '161021027655',
				gaugeFutureRelativeWeight: '157839205884',
				gaugeWeight: '121927030352704080000',
				lpTokenPrice: 1.0394304438681095,
				gaugeCrvApy: [
					0.000015963731454823868,
					0.00003990932863705967,
				],
				gaugeFutureCrvApy: [
					0.000015648283534579658,
					0.00003912070883644914,
				],
			},
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.curve.finance/v1/getAllGauges'
		)
	})

	it('resolves a gauge by address and maps lending-vault gauges', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				'Lending: Borrow CRV (crvUSD collateral) (0x4D2f…8450)': {
					isPool: false,
					name: 'Lending: Borrow CRV (crvUSD collateral) (0x4D2f…8450)',
					shortName: 'lend-CRV(crvUSD) (0x4D2f…)',
					factory: true,
					lendingVaultAddress: '0x4D2f44B0369f3C20c3d670D2C26b048985598450',
					lpTokenPrice: 0.001006276865831436,
					blockchainId: 'ethereum',
					gauge: '0x99440e11485fc623c7a9f2064b97a961a440246b',
					gauge_data: {
						inflation_rate: '4357167728944698747',
						working_supply: '5929298603248153867944214',
					},
					gauge_controller: {
						gauge_relative_weight: '0',
						gauge_future_relative_weight: '0',
						get_gauge_weight: '0',
						inflation_rate: '4357167728944698747',
					},
					gaugeCrvApy: [
						0,
						0,
					],
					gaugeFutureCrvApy: [
						0,
						0,
					],
					side_chain: false,
					is_killed: false,
					hasNoCrv: true,
				},
			},
		})

		await expect(getGauge({
			gaugeAddress: '0x99440e11485fc623c7a9f2064b97a961a440246b',
		})).resolves.toMatchObject({
			gaugeAddress: '0x99440e11485fc623c7a9f2064b97a961a440246b',
			isPool: false,
			lendingVaultAddress: '0x4d2f44b0369f3c20c3d670d2c26b048985598450',
			workingSupply: '5929298603248153867944214',
		})
	})

	it('reads getAllGaugesStatus scopes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				scopes: [
					{
						scopeId: 'ethereum',
						blockchainId: 'ethereum',
						source: 'ethereum',
						cacheKey: 'getAllGaugesScope-v1-ethereum',
						cacheStatus: 'fresh',
						isStale: false,
						generatedTimeMs: 1_700_000_000_000,
						cachedAt: 1_700_000_000_000,
						staleAt: 1_700_000_300_000,
						expireAt: 1_701_000_000_000,
						gaugeCount: 1187,
						missingRequiredGauges: [],
						missingRequiredGaugeCount: 0,
						buildDurationMs: 9895,
						lastAttemptTimeMs: 1_700_000_000_000,
						lastSuccessTimeMs: 1_700_000_000_000,
						lastErrorTimeMs: null,
						lastError: null,
					},
				],
				staleScopes: [],
				failedScopes: [],
				scopesWithMissingRequiredGauges: [],
			},
		})

		await expect(getGaugesStatus()).resolves.toEqual({
			scopes: [
				{
					scopeId: 'ethereum',
					blockchainId: 'ethereum',
					source: 'ethereum',
					cacheStatus: 'fresh',
					isStale: false,
					gaugeCount: 1187,
					missingRequiredGaugeCount: 0,
					generatedTimeMs: 1_700_000_000_000,
					cachedAt: 1_700_000_000_000,
					staleAt: 1_700_000_300_000,
					expireAt: 1_701_000_000_000,
					lastSuccessTimeMs: 1_700_000_000_000,
				},
			],
			staleScopes: [],
			failedScopes: [],
			scopesWithMissingRequiredGauges: [],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.curve.finance/v1/getAllGaugesStatus'
		)
	})
})

describe('Curve lending vault operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('lists lending vaults via getLendingVaults/all/{blockchainId}', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				lendingVaultData: [
					lendingVaultWire,
				],
				tvl: 73.39,
			},
		})

		await expect(listLendingVaults({
			chainId: 1,
		})).resolves.toEqual([
			{
				id: 'oneway-0',
				name: 'Borrow crvUSD (wstETH collateral)',
				blockchainId: 'ethereum',
				chainId: 1,
				registryId: 'oneway',
				vaultAddress: '0x8cf1de26729cfb7137af1a6b2a665e099ec319b5',
				controllerAddress: '0x1e0165dbd2019441ab7927c018701f3138114d71',
				ammAddress: '0x847d7a5e4aa4b380043b2908c29a92e2e5157e64',
				monetaryPolicyAddress: '0x066a89bdf4efb6ad58427d278f16b7a2c53c3cee',
				borrowedAsset: {
					symbol: 'crvUSD',
					decimals: 18,
					address: '0xf939e0a03fb07f59a73314e73794be0e57ac1b4e',
					blockchainId: 'ethereum',
					usdPrice: 1,
				},
				collateralAsset: {
					symbol: 'wstETH',
					decimals: 18,
					address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
					blockchainId: 'ethereum',
					usdPrice: 2366.23,
				},
				gaugeAddress: '0x222d910ef37c06774e1edb9dc9459664f73776f0',
				borrowApr: 0.1738,
				borrowApy: 0.1897,
				lendApr: 0.0052,
				lendApy: 0.0052,
				pricePerShare: 0.00107597892961056,
				totalShares: 68216.41,
				totalSupplied: 73.4,
				totalSuppliedUsd: 73.39,
				totalBorrowed: 2.19,
				totalBorrowedUsd: 2.19,
				availableToBorrow: 71.21,
				availableToBorrowUsd: 71.2,
				usdTotal: 73.39,
			},
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.curve.finance/v1/getLendingVaults/all/ethereum'
		)
	})

	it('resolves a lending vault by address', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				lendingVaultData: [
					lendingVaultWire,
				],
			},
		})

		await expect(getLendingVault({
			chainId: 1,
			vaultAddress: lendingVaultWire.address,
		})).resolves.toMatchObject({
			vaultAddress: '0x8cf1de26729cfb7137af1a6b2a665e099ec319b5',
			registryId: 'oneway',
			borrowApy: 0.1897,
		})
	})

	it('rejects malformed lending vault envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				lendingVaultData: [
					{
						...lendingVaultWire,
						address: null,
					},
				],
			},
		})

		await expect(listLendingVaults({
			chainId: 1,
		})).rejects.toThrow('Curve_Rest: invalid lending vaults response envelope')
	})
})
