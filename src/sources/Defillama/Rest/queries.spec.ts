import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Defillama/bindings.ts'
import {
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

	it('uses the public current-prices endpoint without Pro credentials', async () => {
		await getCurrentPrices({
			coins: ['coingecko:ethereum'],
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-public'],
			'https://coins.llama.fi/prices/current/coingecko%3Aethereum'
		)
	})

	it('uses the official Pro gateway path when credentials are available', async () => {
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
	})

	it('uses the public historical-prices endpoint', async () => {
		await getHistoricalPrices({
			coins: ['coingecko:ethereum'],
			timestamp: 1_700_000_000,
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-public'],
			'https://coins.llama.fi/prices/historical/1700000000/coingecko%3Aethereum'
		)
	})

	it('uses the Pro historical-prices gateway path', async () => {
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
	})

	it('uses the public first-prices endpoint', async () => {
		await getFirstPrices({
			coins: ['coingecko:ethereum'],
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindingByTargetKey['coins-public'],
			'https://coins.llama.fi/prices/first/coingecko%3Aethereum'
		)
	})

	it('uses the Pro first-prices gateway path', async () => {
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
})
