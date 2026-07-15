import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { HyperliquidNetworkSelector } from '$/schema/HyperliquidNetwork.ts'
import { HyperliquidPerpMarketSelector } from '$/schema/HyperliquidPerpMarket.ts'
import { HyperliquidPerpMarket_TimestampSelector } from '$/schema/HyperliquidPerpMarket_Timestamp.ts'
import { HyperliquidSpotAssetSelector } from '$/schema/HyperliquidSpotAsset.ts'
import { HyperliquidAccountSelector } from '$/schema/HyperliquidAccount.ts'
import { HyperliquidValidatorSelector } from '$/schema/HyperliquidValidator.ts'
import { HyperliquidValidator_TimestampSelector } from '$/schema/HyperliquidValidator_Timestamp.ts'
import { NetworkSelector } from '$/schema/Network.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertHyperliquidMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.hyperliquid.slug)
		throw new Error('Hyperliquid_Rest: unsupported network')
}

const hyperliquidMainnetRestBaseUrl = async () => (
	(await import('$/sources/Hyperliquid/Rest/queries.ts')).hyperliquidMainnetRestEndpoints[0].restBaseUrl
)

const hyperliquidMainnetRestEndpointRows = async () => (
	(await import('$/sources/Hyperliquid/Rest/queries.ts')).hyperliquidMainnetRestEndpoints
)

export default {
	source: Source.Hyperliquid_Rest,

	resolvers: [
		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: async ({ $network }) => {
					assertHyperliquidMainnet($network)
					return {
						$network: {
							[EntityMetaKey.Selector]: $network,
						},
						restEndpoints: [...await hyperliquidMainnetRestEndpointRows()],
					}
				}
			},
		})({
				$network: (snapshot) => snapshot.$network,
				restEndpoints: (snapshot) => snapshot.restEndpoints,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertHyperliquidMainnet(network)
					return {
						Hyperliquid: {
							restEndpoints: [...await hyperliquidMainnetRestEndpointRows()],
						},
					}
				}
			},
		})({
				Hyperliquid: {
					restEndpoints: (snapshot) => snapshot.hyperliquidRestEndpoints,
				},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidPerpMarket,
			resolve: {
				[HyperliquidPerpMarketSelector.NetworkCoin]: async (entitySelector) => {
					const { $network } = entitySelector
					assertHyperliquidMainnet($network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$perpMarket: entitySelector,
								timestampMs: Date.now(),
								source: Source.Hyperliquid_Rest,
							},
						},
					]
				}
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidPerpMarket_Timestamp,
			resolve: {
				[HyperliquidPerpMarket_TimestampSelector.PerpMarketTimestampMsSource]: async ({ $perpMarket }) => {
					assertHyperliquidMainnet($perpMarket.$network)
					const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					const perpMarket = (await getMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() })).universe
						.find((market) => market.name === $perpMarket.coin)
					if (perpMarket == null)
						throw new Error(`Hyperliquid_Rest: perp market not found for ${$perpMarket.coin}`)
					return {
						maxLeverage: perpMarket.maxLeverage,
						...(perpMarket.onlyIsolated != null && {
							onlyIsolated: perpMarket.onlyIsolated,
						}),
					}
				}
			},
		})({
				maxLeverage: (snapshot) => snapshot.maxLeverage,
				onlyIsolated: (snapshot) => snapshot.onlyIsolated,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidSpotAsset,
			resolve: {
				[HyperliquidSpotAssetSelector.NetworkAssetId]: async ({ $network, assetId }) => {
					assertHyperliquidMainnet($network)
					const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					const spotToken = (await getSpotMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() })).tokens
						.find((token) => token.index === assetId)
					if (spotToken == null)
						throw new Error(`Hyperliquid_Rest: spot asset not found for ${String(assetId)}`)
					return {
						name: spotToken.name,
						szDecimals: spotToken.szDecimals,
						weiDecimals: spotToken.weiDecimals,
						...(spotToken.tokenId != null && {
							tokenId: spotToken.tokenId,
						}),
					}
				}
			},
		})({
			name: (snapshot) => snapshot.name,
			szDecimals: (snapshot) => snapshot.szDecimals,
			weiDecimals: (snapshot) => snapshot.weiDecimals,
			tokenId: (snapshot) => snapshot.tokenId,
		}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				[HyperliquidAccountSelector.NetworkAddress]: async ({ $network, address }) => {
					assertHyperliquidMainnet($network)
					const { getUserRole } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					const userRoleWire = await getUserRole({
						restBaseUrl: await hyperliquidMainnetRestBaseUrl(),
						user: address,
					})
					return {
						accountRole: userRoleWire.role,
						...(userRoleWire.role === 'agent' && {
							$masterAccount: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									address: userRoleWire.data.user,
								},
							},
						}),
						...(userRoleWire.role === 'subAccount' && {
							$masterAccount: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									address: userRoleWire.data.master,
								},
							},
						}),
					}
				}
			},
		})({
				accountRole: (snapshot) => snapshot.accountRole,
				$masterAccount: (snapshot) => snapshot.$masterAccount,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidValidator,
			resolve: {
				[HyperliquidValidatorSelector.NetworkValidator]: async (entitySelector) => {
					const { $network } = entitySelector
					assertHyperliquidMainnet($network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$validator: entitySelector,
								timestampMs: Date.now(),
								source: Source.Hyperliquid_Rest,
							},
						},
					]
				}
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidValidator_Timestamp,
			resolve: {
				[HyperliquidValidator_TimestampSelector.ValidatorTimestampMsSource]: async ({ $validator }) => {
					assertHyperliquidMainnet($validator.$network)
					const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					const validator = (await getValidatorSummaries({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() }))
						.find((summary) => summary.validator.toLowerCase() === $validator.validator.toLowerCase())
					if (validator == null) throw new Error(`Hyperliquid_Rest: validator not found for ${$validator.validator}`)
					return {
						name: validator.name,
						signerAddress: validator.signer,
						$signer: {
							[EntityMetaKey.Selector]: {
								$network: $validator.$network,
								address: validator.signer,
							},
						},
						commission: validator.commission,
						recentBlockCount: validator.nRecentBlocks,
						stake: BigInt(validator.stake),
						isActive: validator.isActive,
						isJailed: validator.isJailed,
					}
				}
			},
		})({
				name: (snapshot) => snapshot.name,
				signerAddress: (snapshot) => snapshot.signerAddress,
				$signer: (snapshot) => snapshot.$signer,
				commission: (snapshot) => snapshot.commission,
				recentBlockCount: (snapshot) => snapshot.recentBlockCount,
				stake: (snapshot) => snapshot.stake,
				isActive: (snapshot) => snapshot.isActive,
				isJailed: (snapshot) => snapshot.isJailed,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: async ({ $network }) => {
					assertHyperliquidMainnet($network)
					const {
						getMeta,
						getSpotMeta,
						getValidatorSummaries,
					} = await import('$/sources/Hyperliquid/Rest/queries.ts')
					const [
							perpMeta,
						spotAssets,
						validators,
						] = await Promise.all([
							getMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() }),
							getSpotMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() }),
							getValidatorSummaries({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() }),
						])
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: $network,
								timestampMs: Date.now(),
								source: Source.Hyperliquid_Rest,
							},
							perpMarketCount: perpMeta.universe.length,
							spotAssetCount: spotAssets.tokens.length,
							spotPairCount: spotAssets.universe.length,
							validatorCount: validators.length,
							activeValidatorCount: validators.filter((validator) => validator.isActive).length,
							jailedValidatorCount: validators.filter((validator) => validator.isJailed).length,
							totalStake: validators.reduce(
								(totalStake, validator) => totalStake + BigInt(validator.stake),
								0n
						),
						},
					]
				}
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertHyperliquidMainnet(network)
					const {
						getMeta,
						getSpotMeta,
						getValidatorSummaries,
					} = await import('$/sources/Hyperliquid/Rest/queries.ts')
					const [
						perpMeta,
						spotAssets,
						validators,
					] = await Promise.all([
						getMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() }),
						getSpotMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() }),
						getValidatorSummaries({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() }),
					])
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: Date.now(),
								source: Source.Hyperliquid_Rest,
							},
							perpMarketCount: perpMeta.universe.length,
							spotAssetCount: spotAssets.tokens.length,
							spotPairCount: spotAssets.universe.length,
							validatorCount: validators.length,
							activeValidatorCount: validators.filter((validator) => validator.isActive).length,
							jailedValidatorCount: validators.filter((validator) => validator.isJailed).length,
							totalStake: validators.reduce(
								(totalStake, validator) => totalStake + BigInt(validator.stake),
								0n
							),
						},
					]
				}
			},
		})({
				Hyperliquid: {
					$$timestamps: (snapshot) => snapshot,
				},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: async ({ $network }, context) => {
					assertHyperliquidMainnet($network)
					const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					return (await getValidatorSummaries({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() }))
						.slice(0, resolverContextRowLimit(context))
						.map((validator) => ({
							[EntityMetaKey.Selector]: {
								$network: $network,
								validator: validator.validator,
							},
							name: validator.name,
							$signer: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									address: validator.signer,
								},
							},
							commission: validator.commission,
							recentBlockCount: validator.nRecentBlocks,
							stake: BigInt(validator.stake),
							isActive: validator.isActive,
							isJailed: validator.isJailed,
						}))
				}
			},
		})({
				$$validators: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertHyperliquidMainnet(network)
					const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					return (await getValidatorSummaries({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() }))
						.slice(0, resolverContextRowLimit(context))
						.map((validator) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								validator: validator.validator,
							},
							name: validator.name,
							$signer: {
								[EntityMetaKey.Selector]: {
									$network: network,
									address: validator.signer,
								},
							},
							commission: validator.commission,
							recentBlockCount: validator.nRecentBlocks,
							stake: BigInt(validator.stake),
							isActive: validator.isActive,
							isJailed: validator.isJailed,
						}))
				}
			},
		})({
				Hyperliquid: {
					$$validators: (snapshot) => snapshot,
				},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: async ({ $network }, context) => {
					assertHyperliquidMainnet($network)
					const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					return (await getMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() })).universe
						.slice(0, resolverContextRowLimit(context))
						.map((market) => ({
							[EntityMetaKey.Selector]: {
								$network: $network,
								coin: market.name,
							},
							maxLeverage: market.maxLeverage,
							...(market.onlyIsolated != null && {
								onlyIsolated: market.onlyIsolated,
							}),
						}))
				}
			},
		})({
				$$perpMarkets: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertHyperliquidMainnet(network)
					const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					return (await getMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() })).universe
						.slice(0, resolverContextRowLimit(context))
						.map((market) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								coin: market.name,
							},
							maxLeverage: market.maxLeverage,
							...(market.onlyIsolated != null && {
								onlyIsolated: market.onlyIsolated,
							}),
						}))
				}
			},
		})({
				Hyperliquid: {
					$$perpMarkets: (snapshot) => snapshot,
				},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[HyperliquidNetworkSelector.Network]: async ({ $network }, context) => {
					assertHyperliquidMainnet($network)
					const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					return (await getSpotMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() })).tokens
						.slice(0, resolverContextRowLimit(context))
						.map((token) => ({
							[EntityMetaKey.Selector]: {
								$network: $network,
								assetId: token.index,
							},
							name: token.name,
							szDecimals: token.szDecimals,
							weiDecimals: token.weiDecimals,
							...(token.tokenId != null && {
								tokenId: token.tokenId,
							}),
						}))
				}
			},
		})({
				$$spotAssets: (snapshot) => snapshot,
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertHyperliquidMainnet(network)
					const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					return (await getSpotMeta({ restBaseUrl: await hyperliquidMainnetRestBaseUrl() })).tokens
						.slice(0, resolverContextRowLimit(context))
						.map((token) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								assetId: token.index,
							},
							name: token.name,
							szDecimals: token.szDecimals,
							weiDecimals: token.weiDecimals,
							...(token.tokenId != null && {
								tokenId: token.tokenId,
							}),
						}))
				}
			},
		})({
				Hyperliquid: {
					$$spotAssets: (snapshot) => snapshot,
				},
			}),
	],
}
