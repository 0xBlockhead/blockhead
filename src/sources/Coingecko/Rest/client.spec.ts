import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import { coingeckoFetch } from '$/sources/Coingecko/Rest/client.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0].locator,
	sourceFetch,
}))

beforeEach(() => {
	sourceFetch.mockReset()
	sourceFetch.mockResolvedValue(new Response('{}'))
})

describe('CoinGecko client plan selection', () => {
	it('selects Demo and Pro credentials under one source identity', async () => {
		await coingeckoFetch({}, '/ping')
		await coingeckoFetch({
			PUBLIC_COINGECKO_DEMO_API_KEY: 'demo-key',
		}, '/ping')
		await coingeckoFetch({
			PUBLIC_COINGECKO_PRO_API_KEY: 'pro-key',
		}, '/ping')

		expect(sourceFetch.mock.calls.map(([binding, url, init]) => ({
			source: binding.source,
			targetKey: binding.target.key,
			url,
			demoKey: init.headers.get('x-cg-demo-api-key'),
			proKey: init.headers.get('x-cg-pro-api-key'),
		}))).toEqual([
			{
				source: Source.Coingecko_Rest,
				targetKey: 'coingecko-demo',
				url: 'https://api.coingecko.com/api/v3/ping',
				demoKey: null,
				proKey: null,
			},
			{
				source: Source.Coingecko_Rest,
				targetKey: 'coingecko-demo',
				url: 'https://api.coingecko.com/api/v3/ping',
				demoKey: 'demo-key',
				proKey: null,
			},
			{
				source: Source.Coingecko_Rest,
				targetKey: 'coingecko-pro',
				url: 'https://pro-api.coingecko.com/api/v3/ping',
				demoKey: null,
				proKey: 'pro-key',
			},
		])
	})
})
