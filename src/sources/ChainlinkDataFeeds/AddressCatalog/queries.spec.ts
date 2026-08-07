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
	getCatalogRows,
	getPriceFeed,
	listPriceFeeds,
	listPriceFeedsByChainId,
} from '$/sources/ChainlinkDataFeeds/AddressCatalog/queries.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/ChainlinkDataFeeds/bindings.ts'
import { listProxyContracts } from '$/sources/ChainlinkDataFeeds/Contracts/Catalog/queries.ts'


describe('Chainlink address catalog', () => {
	it('exposes unique mainnet ETH/USD proxy and fail-closes unknown feeds', () => {
		expect(getCatalogRows().binding).toBe(bindings[Source.ChainlinkDataFeeds_AddressCatalog][0])
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
