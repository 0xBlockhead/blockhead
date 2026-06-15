import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { stringify } from 'devalue'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	hyperliquidMainnetRestBaseUrl,
	hyperliquidMainnetRestEndpoints,
} from '$/constants/HyperliquidNetwork.ts'
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
import { HyperliquidSpotAssetSelector } from '$/schema/HyperliquidSpotAsset.ts'
import { HyperliquidAccountSelector } from '$/schema/HyperliquidAccount.ts'
import { HyperliquidValidatorSelector } from '$/schema/HyperliquidValidator.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertHyperliquidMainnet = (network: NetworkId) => {
	if (stringify(network) !== stringify({ slug: networkBySlug.hyperliquid.slug })) {
		throw new Error('Hyperliquid_Rest: unsupported network')
	}
}

export default {
	source: Source.Hyperliquid_Rest,

	resolvers: [
		defineResolver(Source.Hyperliquid_Rest, {
				entityType: EntityType.HyperliquidNetwork,
				resolve: {
					[HyperliquidNetworkSelector.Network]: async (entitySelector) => {
					assertHyperliquidMainnet(entitySelector.$network)
					return {
						$network: {
							[EntityMetaKey.Selector]: entitySelector.$network,
						},
						restEndpoints: [...hyperliquidMainnetRestEndpoints],
					}
			}
			}
		})({
				fields: {
			$network: (snapshot) => snapshot.$network,
			restEndpoints: (snapshot) => snapshot.restEndpoints,
		},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidPerpMarket,
			resolve: {
				[HyperliquidPerpMarketSelector.NetworkCoin]: async ({ $network, coin }) => {
					assertHyperliquidMainnet($network)
					const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					const perpMarket = (await getMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).universe
						.find((market) => market.name === coin)
				if (perpMarket == null)
					throw new Error(`Hyperliquid_Rest: perp market not found for ${coin}`)
				return {
					maxLeverage: perpMarket.maxLeverage,
					...(perpMarket.onlyIsolated != null && {
						onlyIsolated: perpMarket.onlyIsolated,
					}),
				}
			}
			}
		})({
				fields: {
			maxLeverage: (snapshot) => snapshot.maxLeverage,
			onlyIsolated: (snapshot) => snapshot.onlyIsolated,
		},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidSpotAsset,
			resolve: {
				[HyperliquidSpotAssetSelector.NetworkAssetId]: async ({ $network, assetId }) => {
					assertHyperliquidMainnet($network)
					const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					const spotToken = (await getSpotMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).tokens
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
			}
		})({
				fields: {
			name: (snapshot) => snapshot.name,
			szDecimals: (snapshot) => snapshot.szDecimals,
			weiDecimals: (snapshot) => snapshot.weiDecimals,
			tokenId: (snapshot) => snapshot.tokenId,
		},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				[HyperliquidAccountSelector.NetworkAddress]: async ({ $network, address }) => {
				assertHyperliquidMainnet($network)
				const { getUserRole } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const userRoleWire = await getUserRole({
					restBaseUrl: hyperliquidMainnetRestBaseUrl,
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
			}
		})({
				fields: {
			accountRole: (snapshot) => snapshot.accountRole,
			$masterAccount: (snapshot) => snapshot.$masterAccount,
		},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
			entityType: EntityType.HyperliquidValidator,
			resolve: {
				[HyperliquidValidatorSelector.NetworkValidator]: async ({ $network, validator: validatorSelector }) => {
					assertHyperliquidMainnet($network)
					const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
					const validator = (await getValidatorSummaries({ restBaseUrl: hyperliquidMainnetRestBaseUrl }))
						.find((summary) => summary.validator.toLowerCase() === validatorSelector.toLowerCase())
				if (validator == null) throw new Error(`Hyperliquid_Rest: validator not found for ${validator}`)
				return {
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
				}
			}
			}
		})({
				fields: {
			name: (snapshot) => snapshot.name,
			$signer: (snapshot) => snapshot.$signer,
			commission: (snapshot) => snapshot.commission,
			recentBlockCount: (snapshot) => snapshot.recentBlockCount,
			stake: (snapshot) => snapshot.stake,
			isActive: (snapshot) => snapshot.isActive,
			isJailed: (snapshot) => snapshot.isJailed,
		},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
				entityType: EntityType.HyperliquidNetwork,
				resolve: {
					[HyperliquidNetworkSelector.Network]: async (entitySelector) => {
					assertHyperliquidMainnet(entitySelector.$network)
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
					getMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl }),
					getSpotMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl }),
					getValidatorSummaries({ restBaseUrl: hyperliquidMainnetRestBaseUrl }),
				])
				return [
					{
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								timestampMs: Date.now(),
							},
						perpMarketCount: perpMeta.universe.length,
						spotAssetCount: spotAssets.tokens.length,
						spotPairCount: spotAssets.universe.length,
						validatorCount: validators.length,
						activeValidatorCount: validators.filter((validator) => validator.isActive).length,
						jailedValidatorCount: validators.filter((validator) => validator.isJailed).length,
						totalStake: validators.reduce(
							(totalStake, validator) => totalStake + BigInt(validator.stake),
							0n,
						),
					},
				]
			}
			}
		})({
				fields: {
			$$timestamps: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
				entityType: EntityType.HyperliquidNetwork,
				resolve: {
					[HyperliquidNetworkSelector.Network]: async (entitySelector, context) => {
					assertHyperliquidMainnet(entitySelector.$network)
				const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await getValidatorSummaries({ restBaseUrl: hyperliquidMainnetRestBaseUrl }))
					.slice(0, resolverContextRowLimit(context))
					.map((validator) => ({
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								validator: validator.validator,
							},
						name: validator.name,
							$signer: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
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
			}
		})({
				fields: {
			$$validators: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
				entityType: EntityType.HyperliquidNetwork,
				resolve: {
					[HyperliquidNetworkSelector.Network]: async (entitySelector, context) => {
					assertHyperliquidMainnet(entitySelector.$network)
				const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await getMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).universe
					.slice(0, resolverContextRowLimit(context))
					.map((market) => ({
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								coin: market.name,
							},
						maxLeverage: market.maxLeverage,
						...(market.onlyIsolated != null && {
							onlyIsolated: market.onlyIsolated,
						}),
					}))
			}
			}
		})({
				fields: {
			$$perpMarkets: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Hyperliquid_Rest, {
				entityType: EntityType.HyperliquidNetwork,
				resolve: {
					[HyperliquidNetworkSelector.Network]: async (entitySelector, context) => {
					assertHyperliquidMainnet(entitySelector.$network)
				const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await getSpotMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).tokens
					.slice(0, resolverContextRowLimit(context))
					.map((token) => ({
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
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
			}
		})({
				fields: {
			$$spotAssets: (snapshot) => snapshot,
		},
			}),
	],
}
