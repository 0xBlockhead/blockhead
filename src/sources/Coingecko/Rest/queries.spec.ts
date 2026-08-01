import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const coingeckoFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Coingecko/Rest/client.ts', () => ({
	coingeckoFetch,
}))

const {
	getAssetPlatforms,
	getCoin,
	getCoinByContract,
	getCoinOhlc,
	getCoinsMarkets,
	getCoinTickers,
	getDerivativesExchange,
} = await import('$/sources/Coingecko/Rest/queries.ts')

describe('CoinGecko documented endpoints', () => {
	beforeEach(() => {
		coingeckoFetch.mockReset()
		coingeckoFetch.mockResolvedValue(new Response('{}'))
	})

	it('requests coin market data with the documented detail flags', async () => {
		const coin = {
			id: 'bitcoin',
			symbol: 'btc',
			name: 'Bitcoin',
		}
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify(coin)))

		await expect(getCoin({
			publicEnv: {},
			id: 'bitcoin',
		})).resolves.toEqual(coin)
		expect(coingeckoFetch).toHaveBeenCalledWith(
			{},
			'/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false'
		)
	})

	it('does not add unsupported detail parameters to the contract endpoint', async () => {
		await getCoinByContract({
			publicEnv: {},
			id: 'ethereum',
			contract_address: '0xabc',
		})

		expect(coingeckoFetch).toHaveBeenCalledWith(
			{},
			'/coins/ethereum/contract/0xabc'
		)
	})

	it('serializes the generated asset-platform and market query names', async () => {
		coingeckoFetch
			.mockResolvedValueOnce(new Response('[]'))
			.mockResolvedValueOnce(new Response('[]'))

		await getAssetPlatforms({
			publicEnv: {},
			filter: 'nft',
		})
		await getCoinsMarkets({
			publicEnv: {},
			vs_currency: 'usd',
			order: 'market_cap_desc',
			per_page: 25,
			page: 2,
			sparkline: false,
		})

		expect(coingeckoFetch.mock.calls.map(([, path]) => path)).toEqual([
			'/asset_platforms?filter=nft',
			'/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=2&sparkline=false',
		])
	})

	it('preserves exact OHLC tuples and documented day values', async () => {
		const rows = [[
			1_751_328_000_000,
			1,
			2,
			0.5,
			1.5,
		]]
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify(rows)))

		await expect(getCoinOhlc({
			publicEnv: {},
			id: 'bitcoin',
			vs_currency: 'usd',
			days: 30,
		})).resolves.toEqual(rows)
		expect(coingeckoFetch).toHaveBeenCalledWith(
			{},
			'/coins/bitcoin/ohlc?vs_currency=usd&days=30'
		)
	})

	it('preserves the paged ticker envelope', async () => {
		const response = {
			tickers: [{
				base: 'BTC',
				target: 'USD',
				coin_id: 'bitcoin',
			}],
		}
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify(response)))

		await expect(getCoinTickers({
			publicEnv: {},
			id: 'bitcoin',
			order: 'volume_desc',
			page: 2,
		})).resolves.toEqual(response)
		expect(coingeckoFetch).toHaveBeenCalledWith(
			{},
			'/coins/bitcoin/tickers?order=volume_desc&page=2'
		)
	})

	it('uses the documented derivatives exchange endpoint', async () => {
		coingeckoFetch.mockResolvedValue(new Response('{}'))
		await getDerivativesExchange({
			publicEnv: {},
			id: 'binance_futures',
		})

		expect(coingeckoFetch).toHaveBeenCalledWith(
			{},
			'/derivatives/exchanges/binance_futures?include_tickers=unexpired'
		)
	})
})
