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
	getSimplePrice,
} = await import('$/sources/Coingecko/Rest/queries.ts')

describe('CoinGecko documented endpoints', () => {
	beforeEach(() => {
		coingeckoFetch.mockReset()
		coingeckoFetch.mockResolvedValue(new Response(JSON.stringify({
			id: 'bitcoin',
			tickers: [],
		})))
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

	it('does not soft-empty non-404 HTTP failures', async () => {
		coingeckoFetch.mockResolvedValueOnce(new Response('rate limited', { status: 429 }))
		await expect(getCoin({
			publicEnv: {},
			id: 'bitcoin',
		})).rejects.toThrow(/Coingecko_Rest/)

		coingeckoFetch.mockResolvedValueOnce(new Response('upstream', { status: 500 }))
		await expect(getSimplePrice({
			publicEnv: {},
			ids: 'bitcoin',
			vs_currencies: 'usd',
		})).rejects.toThrow(/Coingecko_Rest/)
	})

	it('throws on empty path ids instead of soft-emptying', async () => {
		await expect(getCoin({
			publicEnv: {},
			id: '',
		})).rejects.toThrow('Coingecko_Rest: invalid coin id')
		await expect(getCoinOhlc({
			publicEnv: {},
			id: '',
			vs_currency: 'usd',
			days: 7,
		})).rejects.toThrow('Coingecko_Rest: invalid coin id')
		expect(coingeckoFetch).not.toHaveBeenCalled()
	})

	it('does not soft-empty OHLC HTTP failures into []', async () => {
		coingeckoFetch.mockResolvedValueOnce(new Response('missing', { status: 404 }))
		await expect(getCoinOhlc({
			publicEnv: {},
			id: 'bitcoin',
			vs_currency: 'usd',
			days: 30,
		})).rejects.toThrow(/Coingecko_Rest/)
	})

	it('distinguishes successful empty lists from malformed list envelopes', async () => {
		coingeckoFetch
			.mockResolvedValueOnce(new Response('[]'))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				tickers: [],
			})))
			.mockResolvedValueOnce(new Response('{}'))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				tickers: {},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify([
				{ name: 'Ethereum' },
			])))
			.mockResolvedValueOnce(new Response(JSON.stringify([
				[1, 2, 3],
			])))

		await expect(getCoinsMarkets({
			publicEnv: {},
			vs_currency: 'usd',
		})).resolves.toEqual([])
		await expect(getCoinTickers({
			publicEnv: {},
			id: 'bitcoin',
		})).resolves.toEqual({
			tickers: [],
		})
		await expect(getCoinsMarkets({
			publicEnv: {},
			vs_currency: 'usd',
		})).rejects.toThrow('Coingecko_Rest: invalid coins markets response envelope')
		await expect(getCoinTickers({
			publicEnv: {},
			id: 'bitcoin',
		})).rejects.toThrow('Coingecko_Rest: invalid coin tickers response envelope')
		await expect(getAssetPlatforms({
			publicEnv: {},
		})).rejects.toThrow('Coingecko_Rest: invalid asset platforms response envelope')
		await expect(getCoinOhlc({
			publicEnv: {},
			id: 'bitcoin',
			vs_currency: 'usd',
			days: 7,
		})).rejects.toThrow('Coingecko_Rest: invalid OHLC response envelope')
	})

	it('fail-closes coin envelopes missing required id / market-data shape', async () => {
		coingeckoFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				symbol: 'btc',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				id: 'bitcoin',
				market_data: {
					market_cap_rank: '1',
				},
			})))

		await expect(getCoin({
			publicEnv: {},
			id: 'bitcoin',
		})).rejects.toThrow('Coingecko_Rest: invalid coin response envelope')
		await expect(getCoin({
			publicEnv: {},
			id: 'bitcoin',
		})).rejects.toThrow('Coingecko_Rest: invalid coin response envelope')
	})

	it('rejects malformed detail and incomplete market price envelopes', async () => {
		coingeckoFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				id: 'ethereum',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				bitcoin: {
					usd: 100,
				},
			})))

		await expect(getCoin({
			publicEnv: {},
			id: 'bitcoin',
		})).rejects.toThrow('Coingecko_Rest: coin response id does not match bitcoin')
		await expect(getSimplePrice({
			publicEnv: {},
			ids: 'bitcoin,ethereum',
			vs_currencies: 'usd',
			include_last_updated_at: true,
		})).rejects.toThrow('Coingecko_Rest: incomplete simple price response envelope')
	})

	it('returns undefined only for confirmed missing detail resources', async () => {
		coingeckoFetch.mockResolvedValueOnce(new Response('', { status: 404 }))

		await expect(getCoin({
			publicEnv: {},
			id: 'bitcoin',
		})).resolves.toBeUndefined()
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
				market: {
					identifier: 'coinbase',
				},
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
		coingeckoFetch.mockResolvedValue(new Response(JSON.stringify({
			tickers: [],
		})))
		await getDerivativesExchange({
			publicEnv: {},
			id: 'binance_futures',
		})

		expect(coingeckoFetch).toHaveBeenCalledWith(
			{},
			'/derivatives/exchanges/binance_futures?include_tickers=unexpired'
		)
	})

	it('batches documented simple price flags into one request', async () => {
		const prices = {
			bitcoin: {
				usd: 100,
				last_updated_at: 1_700_000_000,
			},
			ethereum: {
				usd: 10,
				last_updated_at: 1_700_000_001,
			},
		}
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify(prices)))

		await expect(getSimplePrice({
			publicEnv: {},
			ids: 'bitcoin,ethereum',
			vs_currencies: 'usd',
			include_last_updated_at: true,
			include_market_cap: true,
			include_24hr_change: true,
		})).resolves.toEqual(prices)
		expect(coingeckoFetch).toHaveBeenCalledWith(
			{},
			'/simple/price?ids=bitcoin%2Cethereum&vs_currencies=usd&include_last_updated_at=true&include_market_cap=true&include_24hr_change=true'
		)
	})
})
