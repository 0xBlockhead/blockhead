import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import {
	pendleMarketsAllMaxLimit,
} from '$/sources/Pendle/Rest/constants.ts'
import type { PendleMarket } from '$/sources/Pendle/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type PendleMarketId = EntitySelector<typeof schema, EntityType.PendleMarket>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Pendle_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Pendle_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapPendleMarketSnapshot = (
	network: NetworkId,
	market: PendleMarket
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	marketAddress: market.marketAddress,
	name: market.name,
	protocol: market.protocol,
	...(market.icon.length > 0 && { icon: market.icon }),
	expiryTimestampMs: market.expiryTimestampMs,
	ptAddress: market.ptAddress,
	ytAddress: market.ytAddress,
	syAddress: market.syAddress,
	underlyingAssetAddress: market.underlyingAssetAddress,
	impliedApy: market.details.impliedApy,
	underlyingApy: market.details.underlyingApy,
	totalTvlUsd: market.details.totalTvlUsd,
	liquidityUsd: market.details.liquidityUsd,
	tradingVolumeUsd: market.details.tradingVolumeUsd,
	feeRate: market.details.feeRate,
	totalPt: market.details.totalPt,
	totalSy: market.details.totalSy,
	totalSupply: market.details.totalSupply,
	isPrime: market.isPrime,
	isNew: market.isNew,
	observedAtTimestampMs: market.observedAtTimestampMs,
})

export default {
	source: Source.Pendle_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.PendleMarket,
			resolve: {
				NetworkMarketAddress: {
					resolve: async ({
						$network,
						marketAddress,
					}: PendleMarketId) => {
						const chainId = eip155ChainId($network)
						const normalizedMarketAddress = hexLowerOfByteSize(marketAddress, 20)
						if (normalizedMarketAddress == null)
							throw new Error(`${Source.Pendle_Rest}: invalid market address ${marketAddress}`)

						const { listMarkets } = await import('$/sources/Pendle/Rest/queries.ts')

						for (let skip = 0; ; skip += pendleMarketsAllMaxLimit) {
							const page = await listMarkets({
								skip,
								limit: pendleMarketsAllMaxLimit,
							})
							const market = page.markets.find((candidate) => (
								candidate.chainId === chainId
								&& candidate.marketAddress === normalizedMarketAddress
							))
							if (market != null)
								return mapPendleMarketSnapshot(
									$network,
									market
								)
							if (page.markets.length < pendleMarketsAllMaxLimit)
								break
						}

						throw new Error(`${Source.Pendle_Rest}: market not found ${normalizedMarketAddress}`)
					},
				},
			},
		})({
			$network: (market) => market.$network,
			marketAddress: (market) => market.marketAddress,
			name: (market) => market.name,
			protocol: (market) => market.protocol,
			icon: (market) => market.icon,
			expiryTimestampMs: (market) => market.expiryTimestampMs,
			ptAddress: (market) => market.ptAddress,
			ytAddress: (market) => market.ytAddress,
			syAddress: (market) => market.syAddress,
			underlyingAssetAddress: (market) => market.underlyingAssetAddress,
			impliedApy: (market) => market.impliedApy,
			underlyingApy: (market) => market.underlyingApy,
			totalTvlUsd: (market) => market.totalTvlUsd,
			liquidityUsd: (market) => market.liquidityUsd,
			tradingVolumeUsd: (market) => market.tradingVolumeUsd,
			feeRate: (market) => market.feeRate,
			totalPt: (market) => market.totalPt,
			totalSy: (market) => market.totalSy,
			totalSupply: (market) => market.totalSupply,
			isPrime: (market) => market.isPrime,
			isNew: (market) => market.isNew,
			observedAtTimestampMs: (market) => market.observedAtTimestampMs,
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.Pendle_Rest>
