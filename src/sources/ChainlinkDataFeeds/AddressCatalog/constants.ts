import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'


// Constants


/**
 * Curated Chainlink AggregatorV3 proxy feeds (price feeds).
 * Addresses are official proxy contracts from Chainlink docs — not aggregators.
 * @see https://docs.chain.link/data-feeds/price-feeds/addresses
 */
export const chainlinkPriceFeeds = [
	{
		chainId: 1,
		proxyAddress: zeroExLowerCase('0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'),
		baseAsset: 'ETH',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'ETH / USD',
	},
	{
		chainId: 1,
		proxyAddress: zeroExLowerCase('0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c'),
		baseAsset: 'BTC',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'BTC / USD',
	},
	{
		chainId: 1,
		proxyAddress: zeroExLowerCase('0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c'),
		baseAsset: 'LINK',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'LINK / USD',
	},
	{
		chainId: 1,
		proxyAddress: zeroExLowerCase('0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6'),
		baseAsset: 'USDC',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'USDC / USD',
	},
	{
		chainId: 1,
		proxyAddress: zeroExLowerCase('0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9'),
		baseAsset: 'DAI',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'DAI / USD',
	},
	{
		chainId: 1,
		proxyAddress: zeroExLowerCase('0x547a514d5e3769680Ce22B30083134664f9f5f1c'),
		baseAsset: 'AAVE',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'AAVE / USD',
	},
	{
		chainId: 8453,
		proxyAddress: zeroExLowerCase('0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70'),
		baseAsset: 'ETH',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'ETH / USD',
	},
	{
		chainId: 42161,
		proxyAddress: zeroExLowerCase('0x639Fe6ab55C921f74e7fac1ee960C0B6291ba612'),
		baseAsset: 'ETH',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'ETH / USD',
	},
	{
		chainId: 10,
		proxyAddress: zeroExLowerCase('0x13e3Ee699D1909E989722E753853AE30b17e08c5'),
		baseAsset: 'ETH',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'ETH / USD',
	},
	{
		chainId: 137,
		proxyAddress: zeroExLowerCase('0xF9680D99D6C9589e2a93a78A04A279e509205945'),
		baseAsset: 'ETH',
		quoteAsset: 'USD',
		decimals: 8,
		feedKind: 'price',
		label: 'ETH / USD',
	},
] as const


// Lookups


export const chainlinkPriceFeedByChainIdAndAddress = Object.fromEntries(
	chainlinkPriceFeeds.map((feed) => [
		`${feed.chainId}:${feed.proxyAddress}`,
		feed,
	])
)

export const chainlinkPriceFeedsByChainId = Object.groupBy(
	chainlinkPriceFeeds,
	(feed) => feed.chainId
)
