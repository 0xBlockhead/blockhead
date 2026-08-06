import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { GmxMarketInfo } from '$/sources/Gmx/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type GmxMarketId = EntitySelector<typeof schema, EntityType.GmxMarket>
type EvmNetworkAccountId = EntitySelector<typeof schema, EntityType.EvmNetworkAccount>
type EvmNetworkAccountTimestampId = EntitySelector<typeof schema, EntityType.EvmNetworkAccount_Timestamp>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Gmx_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Gmx_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapGmxMarketSnapshot = (
	network: NetworkId,
	market: GmxMarketInfo
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	marketTokenAddress: market.marketTokenAddress,
	name: market.name,
	indexTokenAddress: market.indexTokenAddress,
	longTokenAddress: market.longTokenAddress,
	shortTokenAddress: market.shortTokenAddress,
	isSpotOnly: market.isSpotOnly,
	isDisabled: market.isDisabled,
	longInterestUsd: market.longInterestUsd,
	shortInterestUsd: market.shortInterestUsd,
	longPoolAmount: market.longPoolAmount,
	shortPoolAmount: market.shortPoolAmount,
	fundingFactorPerSecond: market.fundingFactorPerSecond,
})

export default {
	source: Source.Gmx_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }: EvmNetworkAccountId) => ({
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$account: {
										$actor,
										$network,
									},
									timestampMs: Date.now(),
									source: Source.Gmx_Rest,
								},
							},
						],
					}),
				},
			},
		})({
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					resolve: async ({ $account, timestampMs, source }: EvmNetworkAccountTimestampId) => {
						const chainId = eip155ChainId($account.$network)
						const { gmxApiByChainId } = await import('$/sources/Gmx/Rest/constants.ts')
						if (gmxApiByChainId[chainId] == null)
							throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

						const { getPositionsInfo } = await import('$/sources/Gmx/Rest/queries.ts')
						return {
							timestampMs,
							source,
							contractPositions: await getPositionsInfo({
								chainId,
								address: $account.$actor.address,
							}),
						}
					},
				},
			},
		})({
			contractPositions: (timestamp) => timestamp.contractPositions,
		}),

		defineResolver({
			entityType: EntityType.GmxMarket,
			resolve: {
				NetworkMarketTokenAddress: {
					resolve: async ({
						$network,
						marketTokenAddress,
					}: GmxMarketId) => {
						const chainId = eip155ChainId($network)
						const { gmxApiByChainId } = await import('$/sources/Gmx/Rest/constants.ts')
						if (gmxApiByChainId[chainId] == null)
							throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

						const normalizedMarketTokenAddress = hexLowerOfByteSize(marketTokenAddress, 20)
						if (normalizedMarketTokenAddress == null)
							throw new Error(`${Source.Gmx_Rest}: invalid market token ${marketTokenAddress}`)

						const { getMarketsInfo } = await import('$/sources/Gmx/Rest/queries.ts')
						const market = (
							await getMarketsInfo({
								chainId,
							})
						)
							.find((candidate) => (
								candidate.marketTokenAddress === normalizedMarketTokenAddress
							))
						if (market == null)
							throw new Error(`${Source.Gmx_Rest}: market not found ${normalizedMarketTokenAddress}`)

						return mapGmxMarketSnapshot(
							$network,
							market
						)
					},
				},
			},
		})({
			$network: (market) => market.$network,
			marketTokenAddress: (market) => market.marketTokenAddress,
			name: (market) => market.name,
			indexTokenAddress: (market) => market.indexTokenAddress,
			longTokenAddress: (market) => market.longTokenAddress,
			shortTokenAddress: (market) => market.shortTokenAddress,
			isSpotOnly: (market) => market.isSpotOnly,
			isDisabled: (market) => market.isDisabled,
			longInterestUsd: (market) => market.longInterestUsd,
			shortInterestUsd: (market) => market.shortInterestUsd,
			longPoolAmount: (market) => market.longPoolAmount,
			shortPoolAmount: (market) => market.shortPoolAmount,
			fundingFactorPerSecond: (market) => market.fundingFactorPerSecond,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { gmxApiByChainId } = await import('$/sources/Gmx/Rest/constants.ts')
						if (gmxApiByChainId[chainId] == null)
							throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

						const { getMarketsInfo } = await import('$/sources/Gmx/Rest/queries.ts')
						return (await getMarketsInfo({
							chainId,
						}))
							.slice(0, resolverContextRowLimit(context))
							.map((market) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									marketTokenAddress: market.marketTokenAddress,
								},
							}))
					},
				},
			},
		})({
			Evm: {
				$$gmxMarkets: (markets) => markets,
			},
		}),
	],
}
