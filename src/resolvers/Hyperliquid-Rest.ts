import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const hyperliquidMainnetRestUrl = 'https://api.hyperliquid.xyz'

const hyperliquidRestEndpoints = [
	{
		url: `${hyperliquidMainnetRestUrl}/info`,
		transportType: TransportType.Http,
		providerName: 'Hyperliquid info API',
	},
]

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertHyperliquidMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== 'hyperliquid') {
		throw new Error('Hyperliquid_Rest: unsupported network')
	}
}

export default {
	source: Source.Hyperliquid_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId)
				const {
					meta,
					spotMeta,
					validatorSummaries,
				} = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const [
					perpMeta,
					spotAssets,
					validators,
				] = await Promise.all([
					meta({ restBaseUrl: hyperliquidMainnetRestUrl }),
					spotMeta({ restBaseUrl: hyperliquidMainnetRestUrl }),
					validatorSummaries({ restBaseUrl: hyperliquidMainnetRestUrl }),
				])
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
					restEndpoints: hyperliquidRestEndpoints,
					$$timestamps: [
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
					],
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidNetwork_Timestamp,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const {
					meta,
					spotMeta,
					validatorSummaries,
				} = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const [
					perpMeta,
					spotAssets,
					validators,
				] = await Promise.all([
					meta({ restBaseUrl: hyperliquidMainnetRestUrl }),
					spotMeta({ restBaseUrl: hyperliquidMainnetRestUrl }),
					validatorSummaries({ restBaseUrl: hyperliquidMainnetRestUrl }),
				])
				return {
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
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidPerpMarket,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { meta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const row = (await meta({ restBaseUrl: hyperliquidMainnetRestUrl })).universe
					.find((market) => market.name === entityId.coin)
				if (row == null) throw new Error(`Hyperliquid_Rest: perp market not found for ${entityId.coin}`)
				return {
					maxLeverage: row.maxLeverage,
					...(row.onlyIsolated != null && {
						onlyIsolated: row.onlyIsolated,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidSpotAsset,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { spotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const row = (await spotMeta({ restBaseUrl: hyperliquidMainnetRestUrl })).tokens
					.find((token) => token.index === entityId.assetId)
				if (row == null) throw new Error(`Hyperliquid_Rest: spot asset not found for ${String(entityId.assetId)}`)
				return {
					name: row.name,
					szDecimals: row.szDecimals,
					weiDecimals: row.weiDecimals,
					...(row.tokenId != null && {
						tokenId: row.tokenId,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { userRole } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const row = await userRole({
					restBaseUrl: hyperliquidMainnetRestUrl,
					user: entityId.address,
				})
				return {
					accountRole: row.role,
					...(row.role === 'agent' && {
						masterAddress: row.data.user,
					}),
					...(row.role === 'subAccount' && {
						masterAddress: row.data.master,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidValidator,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { validatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const validator = (await validatorSummaries({ restBaseUrl: hyperliquidMainnetRestUrl }))
					.find((summary) => summary.validator.toLowerCase() === entityId.validator.toLowerCase())
				if (validator == null) throw new Error(`Hyperliquid_Rest: validator not found for ${entityId.validator}`)
				return {
					name: validator.name,
					signer: validator.signer,
					commission: validator.commission,
					recentBlockCount: validator.nRecentBlocks,
					stake: BigInt(validator.stake),
					isActive: validator.isActive,
					isJailed: validator.isJailed,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.HyperliquidNetwork,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId)
				const {
					meta,
					spotMeta,
					validatorSummaries,
				} = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const [
					perpMeta,
					spotAssets,
					validators,
				] = await Promise.all([
					meta({ restBaseUrl: hyperliquidMainnetRestUrl }),
					spotMeta({ restBaseUrl: hyperliquidMainnetRestUrl }),
					validatorSummaries({ restBaseUrl: hyperliquidMainnetRestUrl }),
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.HyperliquidNetwork,
			fieldName: '$$validators',
			resolve: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const { validatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await validatorSummaries({ restBaseUrl: hyperliquidMainnetRestUrl }))
					.slice(0, resolverLoadSubsetRowLimit(context))
					.map((validator) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							validator: validator.validator,
						},
						name: validator.name,
						signer: validator.signer,
						commission: validator.commission,
						recentBlockCount: validator.nRecentBlocks,
						stake: BigInt(validator.stake),
						isActive: validator.isActive,
						isJailed: validator.isJailed,
					}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.HyperliquidNetwork,
			fieldName: '$$perpMarkets',
			resolve: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const { meta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await meta({ restBaseUrl: hyperliquidMainnetRestUrl })).universe
					.slice(0, resolverLoadSubsetRowLimit(context))
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.HyperliquidNetwork,
			fieldName: '$$spotAssets',
			resolve: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const { spotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await spotMeta({ restBaseUrl: hyperliquidMainnetRestUrl })).tokens
					.slice(0, resolverLoadSubsetRowLimit(context))
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
			},
		}),
	],
}
