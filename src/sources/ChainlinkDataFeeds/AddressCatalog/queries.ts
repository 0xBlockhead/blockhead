import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { catalogRowsRequest } from '$/sources/_shared/wire/CatalogRows/client.ts'
import {
	chainlinkPriceFeedByChainIdAndAddress,
	chainlinkPriceFeeds,
	chainlinkPriceFeedsByChainId,
} from '$/sources/ChainlinkDataFeeds/AddressCatalog/constants.ts'
import { chainlinkPriceFeedCatalogRowWire } from '$/sources/ChainlinkDataFeeds/AddressCatalog/types.ts'
import bindings from '$/sources/ChainlinkDataFeeds/bindings.ts'
import { Source } from '$/sources/Source.ts'


export const getCatalogRows = () => (
	catalogRowsRequest(bindings[Source.ChainlinkDataFeeds_AddressCatalog][0])
)

export const listPriceFeeds = () => (
	chainlinkPriceFeeds.map((feed) => chainlinkPriceFeedCatalogRowWire.assert(feed))
)

export const listPriceFeedsByChainId = (
	chainId: number
) => (
	(chainlinkPriceFeedsByChainId[chainId] ?? [])
		.map((feed) => chainlinkPriceFeedCatalogRowWire.assert(feed))
)

export const getPriceFeed = ({
	chainId,
	proxyAddress,
}: {
	chainId: number
	proxyAddress: string
}) => {
	const address = zeroExLowerCase(proxyAddress)
	const feed = chainlinkPriceFeedByChainIdAndAddress[`${chainId}:${address}`]
	if (feed == null)
		throw new Error(`ChainlinkDataFeeds_AddressCatalog: no price feed ${address} on chain ${chainId}`)

	return chainlinkPriceFeedCatalogRowWire.assert(feed)
}
