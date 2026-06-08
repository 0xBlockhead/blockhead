import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	hyperliquidMainnetRestBaseUrl,
	hyperliquidMainnetRestEndpoints,
} from '$/constants/HyperliquidNetwork.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertHyperliquidMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== networkBySlug.hyperliquid.slug) {
		throw new Error('Hyperliquid_Rest: unsupported network')
	}
}

export default {
	source: Source.Hyperliquid_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertHyperliquidMainnet(entityId)
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
					restEndpoints: [...hyperliquidMainnetRestEndpoints],
				}
			}
			},
			fields: {
			$network: (snapshot) => snapshot.$network,
			restEndpoints: (snapshot) => snapshot.restEndpoints,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidPerpMarket,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const perpMarket = (await getMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).universe
					.find((market) => market.name === entityId.coin)
				if (perpMarket == null)
					throw new Error(`Hyperliquid_Rest: perp market not found for ${entityId.coin}`)
				return {
					maxLeverage: perpMarket.maxLeverage,
					...(perpMarket.onlyIsolated != null && {
						onlyIsolated: perpMarket.onlyIsolated,
					}),
				}
			}
			},
			fields: {
			maxLeverage: (snapshot) => snapshot.maxLeverage,
			onlyIsolated: (snapshot) => snapshot.onlyIsolated,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidSpotAsset,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const spotToken = (await getSpotMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).tokens
					.find((token) => token.index === entityId.assetId)
				if (spotToken == null)
					throw new Error(`Hyperliquid_Rest: spot asset not found for ${String(entityId.assetId)}`)
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
			fields: {
			name: (snapshot) => snapshot.name,
			szDecimals: (snapshot) => snapshot.szDecimals,
			weiDecimals: (snapshot) => snapshot.weiDecimals,
			tokenId: (snapshot) => snapshot.tokenId,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getUserRole } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const userRoleWire = await getUserRole({
					restBaseUrl: hyperliquidMainnetRestBaseUrl,
					user: entityId.address,
				})
				return {
					accountRole: userRoleWire.role,
					...(userRoleWire.role === 'agent' && {
						$masterAccount: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: userRoleWire.data.user,
							},
						},
					}),
					...(userRoleWire.role === 'subAccount' && {
						$masterAccount: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: userRoleWire.data.master,
							},
						},
					}),
				}
			}
			},
			fields: {
			accountRole: (snapshot) => snapshot.accountRole,
			$masterAccount: (snapshot) => snapshot.$masterAccount,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidValidator,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const validator = (await getValidatorSummaries({ restBaseUrl: hyperliquidMainnetRestBaseUrl }))
					.find((summary) => summary.validator.toLowerCase() === entityId.validator.toLowerCase())
				if (validator == null) throw new Error(`Hyperliquid_Rest: validator not found for ${entityId.validator}`)
				return {
					name: validator.name,
					$signer: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
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
			fields: {
			name: (snapshot) => snapshot.name,
			$signer: (snapshot) => snapshot.$signer,
			commission: (snapshot) => snapshot.commission,
			recentBlockCount: (snapshot) => snapshot.recentBlockCount,
			stake: (snapshot) => snapshot.stake,
			isActive: (snapshot) => snapshot.isActive,
			isJailed: (snapshot) => snapshot.isJailed,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertHyperliquidMainnet(entityId)
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
						[EntityMetaKey.Id]: {
							$network: entityId,
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
			},
			fields: {
			$$timestamps: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await getValidatorSummaries({ restBaseUrl: hyperliquidMainnetRestBaseUrl }))
					.slice(0, resolverContextRowLimit(context))
					.map((validator) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							validator: validator.validator,
						},
						name: validator.name,
						$signer: {
							[EntityMetaKey.Id]: {
								$network: entityId,
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
			fields: {
			$$validators: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await getMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).universe
					.slice(0, resolverContextRowLimit(context))
					.map((market) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							coin: market.name,
						},
						maxLeverage: market.maxLeverage,
						...(market.onlyIsolated != null && {
							onlyIsolated: market.onlyIsolated,
						}),
					}))
			}
			},
			fields: {
			$$perpMarkets: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await getSpotMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).tokens
					.slice(0, resolverContextRowLimit(context))
					.map((token) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
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
			fields: {
			$$spotAssets: (snapshot) => snapshot,
		}
		}),
	],
}
