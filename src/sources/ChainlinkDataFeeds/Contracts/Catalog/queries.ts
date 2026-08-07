import { catalogRowsRequest } from '$/sources/_shared/wire/CatalogRows/client.ts'
import {
	listPriceFeeds,
} from '$/sources/ChainlinkDataFeeds/AddressCatalog/queries.ts'
import bindings from '$/sources/ChainlinkDataFeeds/bindings.ts'
import { Source } from '$/sources/Source.ts'


export const getCatalogRows = () => (
	catalogRowsRequest(bindings[Source.ChainlinkDataFeeds_Contracts][0])
)

/**
 * Contract-catalog view of curated AggregatorV3 proxy feeds.
 * Live reads stay in `Contracts/queries.ts` via Voltaire execution transports.
 */
export const listProxyContracts = () => (
	listPriceFeeds().map((feed) => ({
		chainId: feed.chainId,
		proxyAddress: feed.proxyAddress,
		contractKind: 'AggregatorV3Proxy' as const,
		baseAsset: feed.baseAsset,
		quoteAsset: feed.quoteAsset,
		decimals: feed.decimals,
		label: feed.label,
	}))
)
