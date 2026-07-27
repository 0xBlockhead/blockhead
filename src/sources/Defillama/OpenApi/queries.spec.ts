import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Defillama/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

import {
	getChartJson,
} from '$/sources/Defillama/OpenApi/client.ts'
import {
	getChainIconUrl,
	getCurrentPrices,
} from '$/sources/Defillama/OpenApi/queries.ts'

const binding = bindings[Source.Defillama_OpenApi]

describe('DefiLlama binding-owned OpenAPI queries', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('keys token prices by the exact requested identity and preserves search semantics', async () => {
		sourceGetJson.mockResolvedValue({
			coins: {
				'coingecko:ethereum': {
					decimals: 18,
					price: 3_500.125,
					symbol: 'ETH',
					timestamp: 1_725_000_000,
					confidence: 0.99,
				},
			},
		})

		await expect(
			getCurrentPrices(
				['coingecko:ethereum'],
				{
					searchWidth: '24h',
				}
			)
		).resolves.toEqual({
			coins: {
				'coingecko:ethereum': {
					decimals: 18,
					price: 3_500.125,
					symbol: 'ETH',
					timestamp: 1_725_000_000,
					confidence: 0.99,
				},
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://coins.llama.fi/prices/current/coingecko%3Aethereum?searchWidth=24h'
		)
	})

	it('preserves chart period, span, search width, and coin ordering', async () => {
		sourceGetJson.mockResolvedValue({
			coins: {},
		})

		await getChartJson(
			{
				coins: [
					'coingecko:ethereum',
					'coingecko:bitcoin',
				],
				period: '1d',
				span: 30,
				searchWidth: '4h',
			}
		)

		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://coins.llama.fi/chart/coingecko%3Aethereum,coingecko%3Abitcoin?searchWidth=4h&period=1d&span=30'
		)
	})

	it('derives icon URLs from the canonical binding and rejects duplicate price identities before transport', async () => {
		expect(getChainIconUrl('polygon zkevm')).toBe(
			'https://icons.llama.fi/polygon%20zkevm.png'
		)
		await expect(getCurrentPrices(
			[
				'coingecko:ethereum',
				'coingecko:ethereum',
			]
		)).rejects.toThrow('requested coin identities')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
