import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Defillama/bindings.ts'
import {
	getChainsTvl,
	getChart,
	getChainIconUrl,
	getCurrentPrices,
	getFirstPrices,
	getHistoricalPrices,
	getPercentageChange,
	getProChart,
	getProCurrentPrices,
	getProFirstPrices,
	getProHistoricalPrices,
	getProPercentageChange,
	getProtocols,
	getProtocol,
	getProtocolTvl,
} from '$/sources/Defillama/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Defillama_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)

describe('DeFiLlama REST endpoint selection', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		sourceGetJson.mockResolvedValue({ coins: {} })
	})

	it('routes every price lookup through its public or authenticated product endpoint', async () => {
		await getCurrentPrices({
			coins: ['coingecko:ethereum'],
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-public'],
			'https://coins.llama.fi/prices/current/coingecko%3Aethereum'
		)

		await getProCurrentPrices({
			coins: ['coingecko:ethereum'],
			publicEnv: {
				PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
			},
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-pro'],
			'https://pro-api.llama.fi/pro%20key/coins/prices/current/coingecko%3Aethereum'
		)

		await getHistoricalPrices({
			coins: ['coingecko:ethereum'],
			timestamp: 1_700_000_000,
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-public'],
			'https://coins.llama.fi/prices/historical/1700000000/coingecko%3Aethereum'
		)

		await getProHistoricalPrices({
			coins: ['coingecko:ethereum'],
			timestamp: 1_700_000_000,
			publicEnv: {
				PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
			},
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-pro'],
			'https://pro-api.llama.fi/pro%20key/coins/prices/historical/1700000000/coingecko%3Aethereum'
		)

		await getFirstPrices({
			coins: ['coingecko:ethereum'],
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-public'],
			'https://coins.llama.fi/prices/first/coingecko%3Aethereum'
		)

		await getProFirstPrices({
			coins: ['coingecko:ethereum'],
			publicEnv: {
				PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
			},
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-pro'],
			'https://pro-api.llama.fi/pro%20key/coins/prices/first/coingecko%3Aethereum'
		)
	})

	it('sends every documented chart query parameter', async () => {
		await getChart({
			coins: [
				'coingecko:ethereum',
				'coingecko:bitcoin',
			],
			start: 1_700_000_000,
			end: 1_700_086_400,
			span: 24,
			period: '1h',
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-public'],
			'https://coins.llama.fi/chart/coingecko%3Aethereum,coingecko%3Abitcoin?start=1700000000&end=1700086400&span=24&period=1h'
		)
	})

	it('uses the Pro chart gateway path', async () => {
		await getProChart({
			coins: ['coingecko:ethereum'],
			span: 90,
			period: '1d',
			publicEnv: {
				PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
			},
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-pro'],
			'https://pro-api.llama.fi/pro%20key/coins/chart/coingecko%3Aethereum?span=90&period=1d'
		)
	})

	it('sends percentage query parameters', async () => {
		await getPercentageChange({
			coins: ['coingecko:ethereum'],
			period: '24h',
			timestamp: 1_700_000_000,
			lookForward: false,
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-public'],
			'https://coins.llama.fi/percentage/coingecko%3Aethereum?timestamp=1700000000&lookForward=false&period=24h'
		)
	})

	it('uses the Pro percentage gateway path', async () => {
		await getProPercentageChange({
			coins: ['coingecko:ethereum'],
			period: '24h',
			publicEnv: {
				PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
			},
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-pro'],
			'https://pro-api.llama.fi/pro%20key/coins/percentage/coingecko%3Aethereum?period=24h'
		)
	})

	it('returns the endpoint-native dynamic coin map', async () => {
		const response = {
			coins: {
				'coingecko%3Aethereum': {
					price: 3_500.125,
					symbol: 'ETH',
					timestamp: 1_725_000_000,
				},
			},
		}
		sourceGetJson.mockResolvedValue(response)

		await expect(getCurrentPrices({
			coins: ['coingecko:ethereum'],
		})).resolves.toEqual(response)
	})

	it('rejects malformed identities before transport', async () => {
		await expect(getCurrentPrices({
			coins: [
				'coingecko:ethereum',
				'coingecko:ethereum',
			],
		})).rejects.toThrow('malformed requested coin identities')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it.each([
		{
			label: 'current prices',
			query: () => getCurrentPrices({
				coins: ['coingecko:ethereum'],
			}),
			response: {
				coins: {
					'coingecko:ethereum': {
						price: 3_500,
						symbol: 'ETH',
					},
				},
			},
		},
		{
			label: 'Pro current prices',
			query: () => getProCurrentPrices({
				coins: ['coingecko:ethereum'],
				publicEnv: {
					PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
				},
			}),
			response: {},
		},
		{
			label: 'historical prices',
			query: () => getHistoricalPrices({
				coins: ['coingecko:ethereum'],
				timestamp: 1_700_000_000,
			}),
			response: {},
		},
		{
			label: 'Pro historical prices',
			query: () => getProHistoricalPrices({
				coins: ['coingecko:ethereum'],
				timestamp: 1_700_000_000,
				publicEnv: {
					PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
				},
			}),
			response: {},
		},
		{
			label: 'first prices',
			query: () => getFirstPrices({
				coins: ['coingecko:ethereum'],
			}),
			response: {
				coins: {
					'coingecko:ethereum': {
						price: '3_500',
					},
				},
			},
		},
		{
			label: 'Pro first prices',
			query: () => getProFirstPrices({
				coins: ['coingecko:ethereum'],
				publicEnv: {
					PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
				},
			}),
			response: {},
		},
		{
			label: 'chart',
			query: () => getChart({
				coins: ['coingecko:ethereum'],
			}),
			response: {
				coins: {
					'coingecko:ethereum': {
						confidence: 0.99,
						prices: [{
							timestamp: 1_700_000_000,
							price: '3_500',
						}],
						symbol: 'ETH',
					},
				},
			},
		},
		{
			label: 'Pro chart',
			query: () => getProChart({
				coins: ['coingecko:ethereum'],
				publicEnv: {
					PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
				},
			}),
			response: {},
		},
		{
			label: 'percentage',
			query: () => getPercentageChange({
				coins: ['coingecko:ethereum'],
			}),
			response: {
				coins: {
					'coingecko:ethereum': '2.4',
				},
			},
		},
		{
			label: 'Pro percentage',
			query: () => getProPercentageChange({
				coins: ['coingecko:ethereum'],
				publicEnv: {
					PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
				},
			}),
			response: {},
		},
	])('fails closed for malformed $label envelopes', async ({
		query,
		response,
		label,
	}) => {
		sourceGetJson.mockResolvedValue(response)

		await expect(query()).rejects.toThrow(`Defillama_Rest: invalid ${label} response envelope`)
	})

	it('returns an empty result without transport or credentials', async () => {
		await expect(getCurrentPrices({
			coins: [],
		})).resolves.toEqual({ coins: {} })
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('derives icon URLs from the icon binding', () => {
		expect(getChainIconUrl('polygon zkevm')).toBe(
			'https://icons.llama.fi/polygon%20zkevm.png'
		)
	})

	it('uses the public TVL API for protocols / chains / protocol tvl', async () => {
		sourceGetJson.mockResolvedValueOnce([])
		await getProtocols()
		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['api-public'],
			'https://api.llama.fi/protocols'
		)

		sourceGetJson.mockResolvedValueOnce([])
		await getChainsTvl()
		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['api-public'],
			'https://api.llama.fi/v2/chains'
		)

		sourceGetJson.mockResolvedValueOnce(1_234_567.89)
		await expect(getProtocolTvl({
			protocol: 'aave',
		})).resolves.toBe(1_234_567.89)
		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['api-public'],
			'https://api.llama.fi/tvl/aave'
		)

		sourceGetJson.mockResolvedValueOnce({
			id: 'parent#aave',
			name: 'Aave',
			symbol: 'AAVE',
			category: 'Lending',
			chains: [
				'Ethereum',
			],
			currentChainTvls: {
				Ethereum: 3_200_000_000,
			},
			chainTvls: {
				Ethereum: {
					tvl: [{
						date: 1609459200,
						totalLiquidityUSD: 1_000_000,
					}],
				},
			},
		})
		await expect(getProtocol({
			protocol: 'aave',
		})).resolves.toMatchObject({
			id: 'parent#aave',
			currentChainTvls: {
				Ethereum: 3_200_000_000,
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['api-public'],
			'https://api.llama.fi/protocol/aave'
		)
	})

	it('accepts protocol and chain TVL envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				id: '1',
				name: 'Aave',
				tvl: 5_200_000_000,
				chains: [
					'Ethereum',
				],
				chainTvls: {
					Ethereum: 3_200_000_000,
				},
			},
		])
		sourceGetJson.mockResolvedValueOnce([
			{
				name: 'Ethereum',
				tvl: 65_998_652_431.4,
				chainId: 1,
				gecko_id: 'ethereum',
				tokenSymbol: 'ETH',
				cmcId: '1027',
			},
		])

		await expect(getProtocols()).resolves.toHaveLength(1)
		await expect(getChainsTvl()).resolves.toEqual([
			expect.objectContaining({
				name: 'Ethereum',
				chainId: 1,
			}),
		])
	})

	it('retains protocol historical chain TVL leftovers on transport', async () => {
		sourceGetJson.mockResolvedValueOnce({
			id: '2269',
			name: 'Aave',
			symbol: 'AAVE',
			category: 'Lending',
			chains: [
				'Ethereum',
				'Polygon',
			],
			currentChainTvls: {
				Ethereum: 3_200_000_000,
				Polygon: 1_500_000_000,
			},
			chainTvls: {
				Ethereum: {
					tvl: [{
						date: 1609459200,
						totalLiquidityUSD: 1_000_000,
					}],
					tokens: [{
						date: 1609459200,
						tokens: {
							USDC: 800_000,
							USDT: 200_000,
						},
					}],
				},
			},
		})

		await expect(getProtocol({
			protocol: 'aave',
		})).resolves.toMatchObject({
			chainTvls: {
				Ethereum: {
					tokens: [{
						tokens: {
							USDC: 800_000,
						},
					}],
				},
			},
		})
	})

	it.each([
		{
			label: 'protocols',
			query: () => getProtocols(),
			response: [
				{
					tvl: '5200000000',
				},
			],
		},
		{
			label: 'chains tvl',
			query: () => getChainsTvl(),
			response: [
				{
					tvl: '65',
				},
			],
		},
		{
			label: 'protocol tvl',
			query: () => getProtocolTvl({
				protocol: 'aave',
			}),
			response: {
				tvl: 1_234,
			},
		},
		{
			label: 'protocol',
			query: () => getProtocol({
				protocol: 'aave',
			}),
			response: {
				currentChainTvls: {
					Ethereum: '3200000000',
				},
			},
		},
	])('fails closed for malformed $label envelopes', async ({
		query,
		response,
		label,
	}) => {
		sourceGetJson.mockResolvedValue(response)

		await expect(query()).rejects.toThrow(`Defillama_Rest: invalid ${label} response envelope`)
	})

	it.each([
		'',
		' aave',
		'aave/protocol',
		'aave\u0000protocol',
	])('rejects malformed protocol slug %j before transport', async (protocol) => {
		await expect(getProtocolTvl({
			protocol,
		})).rejects.toThrow('malformed protocol slug')
		await expect(getProtocol({
			protocol,
		})).rejects.toThrow('malformed protocol slug')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
