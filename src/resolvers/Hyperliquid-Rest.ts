import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const hyperliquidMainnetRestUrl = 'https://api.hyperliquid.xyz'

const assertHyperliquidMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Hyperliquid || network.reference !== 'mainnet') {
		throw new Error(`Hyperliquid_Rest: unsupported network ${network.namespace}:${network.reference}`)
	}
}

export default {
	source: Source.Hyperliquid_Rest,

	entityResolvers: [
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
					stake: BigInt(validator.stake),
					isJailed: validator.isJailed,
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
