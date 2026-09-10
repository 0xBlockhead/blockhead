import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Compound/bindings.ts'
import {
	compoundCometByChainIdAndAddress,
} from '$/sources/Compound/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getConfiguration,
	getRoots,
} = await import('$/sources/Compound/Rest/queries.ts')

const binding = bindings[Source.Compound_Rest][0]

const baseConfiguration = {
	name: 'Compound USDC',
	symbol: 'cUSDCv3',
	baseToken: 'USDC',
	baseTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
	baseTokenPriceFeed: '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
	borrowMin: '1e0',
	pauseGuardian: '0x3cb4653f3b45f448d9100b118b75a1503281d2ee',
	targetReserves: '5000000e6',
	rates: {
		supplyKink: 0.85,
		supplySlopeLow: 0.048,
		supplySlopeHigh: 1.6,
		supplyBase: 0,
		borrowKink: 0.85,
		borrowSlopeLow: 0.053,
		borrowSlopeHigh: 1.8,
		borrowBase: 0.015,
	},
	assets: {
		WETH: {
			address: '0x4200000000000000000000000000000000000006',
			priceFeed: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
			decimals: '18',
			borrowCF: 0.80,
			liquidateCF: 0.90,
			liquidationFactor: 0.95,
			supplyCap: '11000e18',
		},
	},
} as const

const baseCometAddress = '0xb125e6687d4313864e53df431d5425969c15eb2f'

const baseRoots = {
	comet: baseCometAddress,
	configurator: '0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3',
	rewards: '0x1B0e765F6224C21223AeA2af16c1C46E38885a40',
	bulker: '0xa397a8C2086C554B531c02E29f3291c9704B00c7',
} as const

describe('Compound III deployment operations', () => {
	it('accepts the pinned WBTC pumpBTC collateral without a price feed', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...baseConfiguration,
			assets: {
				pumpBTC: {
					address: '0xF469fBD2abcd6B9de8E169d128226C0Fc90a012e',
					decimals: '8',
					borrowCF: 0.75,
					liquidateCF: 0.78,
					liquidationFactor: 0.9,
					supplyCap: '15e8',
				},
			},
		})
		const configuration = await getConfiguration({ networkSlug: 'mainnet', marketSlug: 'wbtc' })
		expect(configuration.assets).toEqual([{
			symbol: 'pumpBTC',
			tokenAddress: '0xf469fbd2abcd6b9de8e169d128226c0fc90a012e',
			decimals: 8,
			borrowCF: 0.75,
			liquidateCF: 0.78,
			liquidationFactor: 0.9,
			supplyCap: '15e8',
		}])
	})

	it.each(['', 'not-an-address', null])('rejects a supplied invalid collateral feed: %s', async (priceFeed) => {
		sourceGetJson.mockResolvedValueOnce({
			...baseConfiguration,
			assets: { WETH: { ...baseConfiguration.assets.WETH, priceFeed } },
		})
		await expect(getConfiguration({ networkSlug: 'base', marketSlug: 'usdc' })).rejects.toThrow()
	})

	it('still requires the base-token price feed', async () => {
		const { baseTokenPriceFeed: _feed, ...withoutBaseFeed } = baseConfiguration
		sourceGetJson.mockResolvedValueOnce(withoutBaseFeed)
		await expect(getConfiguration({ networkSlug: 'base', marketSlug: 'usdc' })).rejects.toThrow('invalid configuration response envelope')
	})

	it.each([
		['7_500_000e18', '7500000e18'],
		['9007199254740993_123456789', '9007199254740993123456789'],
		['1.2_5e1_8', '1.25e18'],
	])('normalizes valid amount separators without numeric conversion: %s', async (supplyCap, expected) => {
		sourceGetJson.mockResolvedValueOnce({
			...baseConfiguration,
			targetReserves: '20_000_000e6',
			assets: { WETH: { ...baseConfiguration.assets.WETH, supplyCap } },
		})
		await expect(getConfiguration({ networkSlug: 'base', marketSlug: 'usdc' })).resolves.toMatchObject({
			targetReserves: '20000000e6',
			assets: [{ supplyCap: expected }],
		})
	})

	it.each(['_1', '1_', '1__0', '1_.0', '1._0', '1_e2', '1e_2', '01_0'])(
		'rejects malformed amount separators: %s', async (supplyCap) => {
			sourceGetJson.mockResolvedValueOnce({
				...baseConfiguration,
				assets: { WETH: { ...baseConfiguration.assets.WETH, supplyCap } },
			})
			await expect(getConfiguration({ networkSlug: 'base', marketSlug: 'usdc' })).rejects.toThrow(
				'configuration WETH supplyCap must be a non-negative decimal or scientific amount'
			)
		}
	)

	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('reads configuration.json for a deployment folder', async () => {
		sourceGetJson.mockResolvedValueOnce(baseConfiguration)
		await expect(getConfiguration({
			networkSlug: 'base',
			marketSlug: 'usdc',
		})).resolves.toEqual({
			name: 'Compound USDC',
			symbol: 'cUSDCv3',
			baseTokenSymbol: 'USDC',
			baseTokenAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			baseTokenPriceFeedAddress: '0x7e860098f58bbfc8648a4311b374b1d669a2bc6b',
			borrowMin: '1e0',
			pauseGuardianAddress: '0x3cb4653f3b45f448d9100b118b75a1503281d2ee',
			targetReserves: '5000000e6',
			rates: {
				supplyKink: 0.85,
				supplySlopeLow: 0.048,
				supplySlopeHigh: 1.6,
				supplyBase: 0,
				borrowKink: 0.85,
				borrowSlopeLow: 0.053,
				borrowSlopeHigh: 1.8,
				borrowBase: 0.015,
			},
			collateralAssetCount: 1,
			assets: [
				{
					symbol: 'WETH',
					tokenAddress: '0x4200000000000000000000000000000000000006',
					priceFeedAddress: '0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70',
					decimals: 18,
					borrowCF: 0.80,
					liquidateCF: 0.90,
					liquidationFactor: 0.95,
					supplyCap: '11000e18',
				},
			],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, 'deployments/base/usdc/configuration.json')
		)
	})

	it('rejects duplicate and base-token collateral identities after normalization', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...baseConfiguration,
			assets: {
				...baseConfiguration.assets,
				WETH_ALIAS: {
					...baseConfiguration.assets.WETH,
					address: baseConfiguration.assets.WETH.address.toUpperCase().replace('0X', '0x'),
				},
			},
		})
		await expect(getConfiguration({
			networkSlug: 'base',
			marketSlug: 'usdc',
		})).rejects.toThrow('configuration has duplicate collateral asset identity')

		sourceGetJson.mockResolvedValueOnce({
			...baseConfiguration,
			assets: {
				USDC: {
					...baseConfiguration.assets.WETH,
					address: baseConfiguration.baseTokenAddress,
				},
			},
		})
		await expect(getConfiguration({
			networkSlug: 'base',
			marketSlug: 'usdc',
		})).rejects.toThrow('base token cannot also be a collateral asset')
	})

	it('reads roots.json for a deployment folder', async () => {
		sourceGetJson.mockResolvedValueOnce(baseRoots)
		await expect(getRoots({
			networkSlug: 'base',
			marketSlug: 'usdc',
			expectedCometAddress: baseCometAddress,
		})).resolves.toEqual({
			cometAddress: baseCometAddress,
			configuratorAddress: '0x316f9708bb98af7da9c68c1c3b5e79039cd336e3',
			rewardsAddress: '0x1b0e765f6224c21223aea2af16c1c46e38885a40',
			bulkerAddress: '0xa397a8c2086c554b531c02e29f3291c9704b00c7',
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, 'deployments/base/usdc/roots.json')
		)
	})

	it('rejects missing deployment slugs before transport', async () => {
		await expect(getConfiguration({
			networkSlug: '',
			marketSlug: 'usdc',
		})).rejects.toThrow(`${Source.Compound_Rest}: networkSlug required`)
		expect(sourceGetJson).not.toHaveBeenCalled()

		await expect(getConfiguration({
			networkSlug: 'ethereum/../../evil',
			marketSlug: 'usdc',
		})).rejects.toThrow(`${Source.Compound_Rest}: invalid network slug`)
	})

	it('throws when roots comet address mismatches', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...baseRoots,
			comet: '0x0000000000000000000000000000000000000001',
		})
		await expect(getRoots({
			networkSlug: 'base',
			marketSlug: 'usdc',
			expectedCometAddress: baseCometAddress,
		})).rejects.toThrow(`${Source.Compound_Rest}: roots comet address mismatch`)
	})

	it('throws when configuration data is missing', async () => {
		sourceGetJson.mockResolvedValueOnce(null)
		await expect(getConfiguration({
			networkSlug: 'base',
			marketSlug: 'usdc',
		})).rejects.toThrow(`${Source.Compound_Rest}: configuration response missing data`)
	})

	it('distinguishes empty collateral lists from malformed deployment envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				...baseConfiguration,
				assets: {},
			})
			.mockResolvedValueOnce({
				...baseConfiguration,
				assets: {
					WETH: {},
				},
			})
			.mockResolvedValueOnce({})

		await expect(getConfiguration({
			networkSlug: 'base',
			marketSlug: 'usdc',
		})).resolves.toMatchObject({
			collateralAssetCount: 0,
			assets: [],
			rates: baseConfiguration.rates,
		})
		await expect(getConfiguration({
			networkSlug: 'base',
			marketSlug: 'usdc',
		})).rejects.toThrow(`${Source.Compound_Rest}: invalid configuration response envelope`)
		await expect(getRoots({
			networkSlug: 'base',
			marketSlug: 'usdc',
			expectedCometAddress: baseCometAddress,
		})).rejects.toThrow(`${Source.Compound_Rest}: invalid roots response envelope`)
	})

	it.each([
		['missing rates', {
			...baseConfiguration,
			rates: undefined,
		}, 'invalid configuration response envelope'],
		['negative kink', {
			...baseConfiguration,
			rates: { ...baseConfiguration.rates, supplyKink: -0.1 },
		}, 'configuration rates.supplyKink must be a finite number in [0, 1]'],
		['kink above one', {
			...baseConfiguration,
			rates: { ...baseConfiguration.rates, supplyKink: 1.2 },
		}, 'configuration rates.supplyKink must be a finite number in [0, 1]'],
		['malformed supply cap', {
			...baseConfiguration,
			assets: { WETH: { ...baseConfiguration.assets.WETH, supplyCap: 'not-an-amount' } },
		}, 'configuration WETH supplyCap must be a non-negative decimal or scientific amount'],
		['collateral factor above one', {
			...baseConfiguration,
			assets: { WETH: { ...baseConfiguration.assets.WETH, borrowCF: 1.2 } },
		}, 'configuration asset WETH borrowCF must be a finite number in [0, 1]'],
		['storefront factor above one', {
			...baseConfiguration,
			storeFrontPriceFactor: 1.5,
		}, 'configuration storeFrontPriceFactor must be a finite number in [0, 1]'],
	])('rejects %s', async (_, response, error) => {
		sourceGetJson.mockResolvedValueOnce(response)
		await expect(getConfiguration({
			networkSlug: 'base',
			marketSlug: 'usdc',
		})).rejects.toThrow(`${Source.Compound_Rest}: ${error}`)
	})

	it('normalizes governor, reward token, and storeFrontPriceFactor when present', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...baseConfiguration,
			governor: '0x6d903f6004ceFAbA93FFA9B9D06345f9AbD3389A',
			rewardTokenAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
			storeFrontPriceFactor: 0.5,
		})
		await expect(getConfiguration({
			networkSlug: 'base',
			marketSlug: 'usdc',
		})).resolves.toMatchObject({
			governorAddress: '0x6d903f6004cefaba93ffa9b9d06345f9abd3389a',
			rewardTokenAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888',
			storeFrontPriceFactor: 0.5,
			pauseGuardianAddress: '0x3cb4653f3b45f448d9100b118b75a1503281d2ee',
		})
	})

})
