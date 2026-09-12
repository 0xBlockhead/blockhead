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

	it('accepts coin market_data leftovers without projecting them onto Coin_Timestamp', async () => {
		const coin = {
			id: 'bitcoin',
			symbol: 'btc',
			name: 'Bitcoin',
			image: {
				large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
			},
			market_data: {
				last_updated: '2026-08-06T12:00:00.000Z',
				market_cap_rank: 1,
				market_cap: {
					usd: 1_000_000_000_000,
				},
				fully_diluted_valuation: {
					usd: 1_050_000_000_000,
				},
				total_volume: {
					usd: 30_000_000_000,
				},
				price_change_percentage_24h: 1.5,
				price_change_percentage_7d: -2.1,
				price_change_percentage_30d: 4.2,
				circulating_supply: 19_700_000,
				total_supply: 21_000_000,
				max_supply: 21_000_000,
			},
		}
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify(coin)))

		await expect(getCoin({
			publicEnv: {},
			id: 'bitcoin',
		})).resolves.toMatchObject({
			market_data: {
				circulating_supply: 19_700_000,
				max_supply: 21_000_000,
				price_change_percentage_7d: -2.1,
				total_volume: {
					usd: 30_000_000_000,
				},
			},
		})
	})

	it('accepts coins/markets + ticker leftover legs used only as transport', async () => {
		coingeckoFetch
			.mockResolvedValueOnce(new Response(JSON.stringify([{
				id: 'bitcoin',
				symbol: 'btc',
				name: 'Bitcoin',
				current_price: 100_000,
				market_cap: 1_000_000_000_000,
				market_cap_rank: 1,
				fully_diluted_valuation: 1_050_000_000_000,
				total_volume: 30_000_000_000,
				circulating_supply: 19_700_000,
				total_supply: 21_000_000,
				max_supply: 21_000_000,
				ath: 120_000,
				ath_change_percentage: -10,
				last_updated: '2026-08-06T12:00:00.000Z',
			}])))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				name: 'Bitcoin',
				tickers: [{
					coin_id: 'bitcoin',
					base: 'BTC',
					target: 'USD',
					last: 100_000,
					volume: 1_000,
					bid_ask_spread_percentage: 0.01,
					converted_last: {
						usd: 100_000,
					},
					converted_volume: {
						usd: 1_000_000,
					},
					is_anomaly: false,
					is_stale: false,
					market: {
						identifier: 'gdax',
						name: 'Coinbase Exchange',
					},
				}],
			})))

		await expect(getCoinsMarkets({
			publicEnv: {},
			vs_currency: 'usd',
		})).resolves.toMatchObject([{
			circulating_supply: 19_700_000,
			max_supply: 21_000_000,
			fully_diluted_valuation: 1_050_000_000_000,
		}])
		await expect(getCoinTickers({
			publicEnv: {},
			id: 'bitcoin',
		})).resolves.toMatchObject({
			tickers: [{
				last: 100_000,
				volume: 1_000,
				converted_volume: {
					usd: 1_000_000,
				},
			}],
		})
	})

	it('rejects duplicate coin identities from a market page', async () => {
		const market = {
			id: 'bitcoin',
			symbol: 'btc',
			name: 'Bitcoin',
			current_price: 100_000,
			market_cap: 1_000_000_000_000,
			market_cap_rank: 1,
			fully_diluted_valuation: 1_050_000_000_000,
			total_volume: 30_000_000_000,
			circulating_supply: 19_700_000,
			total_supply: 21_000_000,
			max_supply: 21_000_000,
			ath: 120_000,
			ath_change_percentage: -10,
			last_updated: '2026-08-06T12:00:00.000Z',
		}
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify([
			market,
			market,
		])))

		await expect(getCoinsMarkets({
			publicEnv: {},
			vs_currency: 'usd',
		})).rejects.toThrow('Coingecko_Rest: coins markets response contains duplicate coin ids')
	})

	it('accepts derivatives exchange leftover volume legs beside enrolled mark/index', async () => {
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			name: 'Binance (Futures)',
			open_interest_btc: 100,
			trade_volume_24h_btc: 50,
			number_of_perpetual_pairs: 200,
			tickers: [{
				coin_id: 'bitcoin',
				target_coin_id: 'tether',
				symbol: 'BTCUSDT',
				last: 100_000,
				index: 99_999,
				last_traded: 1_700_000_000,
				open_interest_usd: 1_000_000.125,
				index_basis_percentage: 0.1,
				funding_rate: 0.01,
				volume_24h: 5_000,
				bid_ask_spread: 0.02,
			}],
		})))

		await expect(getDerivativesExchange({
			publicEnv: {},
			id: 'binance_futures',
		})).resolves.toMatchObject({
			trade_volume_24h_btc: 50,
			tickers: [{
				volume_24h: 5_000,
				last: '100000',
				index: '99999',
				open_interest_usd: '1000000.125',
				index_basis_percentage: '0.1',
				funding_rate: '0.01',
			}],
		})
	})

	it('normalizes finite derivative numerics without bigint rounding or exponent notation', async () => {
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			name: 'Precision Futures',
			tickers: [{
				coin_id: 'bitcoin',
				target_coin_id: 'tether',
				symbol: 'BTCUSDT',
				last: 0.12345678901234568,
				index: 1e-8,
				last_traded: 1_700_000_000,
				open_interest_usd: 9_007_199_254_740_992,
				index_basis_percentage: -1.25e-7,
				funding_rate: 5e-8,
			}],
		})))

		await expect(getDerivativesExchange({
			publicEnv: {},
			id: 'precision_futures',
		})).resolves.toMatchObject({
			tickers: [{
				last: '0.12345678901234568',
				index: '0.00000001',
				open_interest_usd: '9007199254740992',
				index_basis_percentage: '-0.000000125',
				funding_rate: '0.00000005',
			}],
		})
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

	it('accepts asset-platform rows with a nullable image from the provider', async () => {
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify([
			{
				id: 'ethereum',
				name: 'Ethereum',
				shortname: 'eth',
				chain_identifier: 1,
				native_coin_id: 'ethereum',
				image: { thumb: 'https://example.test/eth-thumb.png' },
			},
			{
				id: 'aptos',
				name: 'Aptos',
				shortname: 'apt',
				chain_identifier: null,
				native_coin_id: 'aptos',
				image: null,
			},
		])))

		await expect(getAssetPlatforms({ publicEnv: {} })).resolves.toHaveLength(2)
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

	it('rejects duplicate requested and foreign returned simple-price identities', async () => {
		await expect(getSimplePrice({
			publicEnv: {},
			ids: 'bitcoin,bitcoin',
			vs_currencies: 'usd',
		})).rejects.toThrow('malformed requested coin ids')
		expect(coingeckoFetch).not.toHaveBeenCalled()

		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			bitcoin: {
				usd: 100_000,
			},
			ethereum: {
				usd: 3_500,
			},
		})))
		await expect(getSimplePrice({
			publicEnv: {},
			ids: 'bitcoin',
			vs_currencies: 'usd',
		})).rejects.toThrow('incomplete simple price response envelope')
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

	it('fail-closes derivatives tickers missing last/index mark wire', async () => {
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			tickers: [{
				coin_id: 'bitcoin',
				target_coin_id: 'tether',
				symbol: 'BTCUSDT',
				last_traded: 1_700_000_000,
				open_interest_usd: 1,
				index_basis_percentage: 0.1,
				funding_rate: 0.01,
			}],
		})))

		await expect(getDerivativesExchange({
			publicEnv: {},
			id: 'binance_futures',
		})).rejects.toThrow('invalid derivatives exchange response envelope')
	})

	it('fail-closes non-finite derivative numerics at the source boundary', async () => {
		coingeckoFetch.mockResolvedValueOnce({
			status: 200,
			ok: true,
			json: async () => ({
				tickers: [{
					coin_id: 'bitcoin',
					target_coin_id: 'tether',
					symbol: 'BTCUSDT',
					last: Infinity,
					index: 1,
					last_traded: 1_700_000_000,
					open_interest_usd: 1,
					index_basis_percentage: 0.1,
					funding_rate: 0.01,
				}],
			}),
		})

		await expect(getDerivativesExchange({
			publicEnv: {},
			id: 'binance_futures',
		})).rejects.toThrow('Coingecko_Rest: invalid finite derivative mark price')
	})

	it('fail-closes coin leftovers with non-numeric circulating_supply', async () => {
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			id: 'bitcoin',
			market_data: {
				circulating_supply: '19700000',
			},
		})))

		await expect(getCoin({
			publicEnv: {},
			id: 'bitcoin',
		})).rejects.toThrow('Coingecko_Rest: invalid coin response envelope')
	})

	it('fail-closes coins/markets leftovers with non-numeric max_supply', async () => {
		coingeckoFetch.mockResolvedValueOnce(new Response(JSON.stringify([{
			id: 'bitcoin',
			max_supply: '21000000',
		}])))

		await expect(getCoinsMarkets({
			publicEnv: {},
			vs_currency: 'usd',
		})).rejects.toThrow('Coingecko_Rest: invalid coins markets response envelope')
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
