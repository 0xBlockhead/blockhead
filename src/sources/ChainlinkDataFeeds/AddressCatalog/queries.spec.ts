import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	chainlinkPriceFeedByChainIdAndAddress,
	chainlinkPriceFeeds,
} from '$/sources/ChainlinkDataFeeds/AddressCatalog/constants.ts'
import {
	getPriceFeed,
	listPriceFeeds,
	listPriceFeedsByChainId,
} from '$/sources/ChainlinkDataFeeds/AddressCatalog/queries.ts'
import { listProxyContracts } from '$/sources/ChainlinkDataFeeds/Contracts/Catalog/queries.ts'


describe('Chainlink address catalog', () => {
	it('exposes unique mainnet ETH/USD proxy and fail-closes unknown feeds', () => {
		expect(chainlinkPriceFeedByChainIdAndAddress['1:0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419']).toMatchObject({
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			decimals: 8,
			label: 'ETH / USD',
		})
		expect(listPriceFeeds()).toHaveLength(chainlinkPriceFeeds.length)
		expect(listPriceFeedsByChainId(1).every((feed) => feed.chainId === 1)).toBe(true)
		expect(() => getPriceFeed({
			chainId: 1,
			proxyAddress: '0x0000000000000000000000000000000000000001',
		})).toThrow('no price feed')
	})

	it('mirrors curated proxies into the contracts catalog view', () => {
		expect(listProxyContracts()[0]).toMatchObject({
			contractKind: 'AggregatorV3Proxy',
			proxyAddress: chainlinkPriceFeeds[0].proxyAddress,
		})
	})
})
