import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	hyperliquidMainnetRestBaseUrl,
	hyperliquidMainnetRestEndpoints,
} from '$/constants/HyperliquidNetwork.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId)
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
					restEndpoints: [...hyperliquidMainnetRestEndpoints],
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidPerpMarket,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidSpotAsset,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getUserRole } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const userRoleWire = await getUserRole({
					restBaseUrl: hyperliquidMainnetRestBaseUrl,
					user: entityId.address,
				})
				return {
					accountRole: userRoleWire.role,
					...(userRoleWire.role === 'agent' && {
						masterAddress: userRoleWire.data.user,
					}),
					...(userRoleWire.role === 'subAccount' && {
						masterAddress: userRoleWire.data.master,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidValidator,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				const validator = (await getValidatorSummaries({ restBaseUrl: hyperliquidMainnetRestBaseUrl }))
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.HyperliquidNetwork,
			fieldName: '$$validators',
			resolve: async (entityId, context) => {
				assertHyperliquidMainnet(entityId)
				const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await getValidatorSummaries({ restBaseUrl: hyperliquidMainnetRestBaseUrl }))
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
				const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await getMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).universe
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
				const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
				return (await getSpotMeta({ restBaseUrl: hyperliquidMainnetRestBaseUrl })).tokens
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
