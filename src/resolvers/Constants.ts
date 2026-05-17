import type { ChainId } from '$/constants/ChainId.ts'
import { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketPriceRangeType,
	MarketTimeIntervalUnit,
	coingeckoOhlcDayWindowLengths,
} from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	proposalCategoryById,
	proposalKindIds,
	proposalKindIdsForRealm,
	proposalRealmById,
} from '$/constants/Proposal.ts'
import { activityPubNetworkFieldValues, activityPubNetworkSeedActors } from '$/constants/Social/ActivityPub.ts'
import { atprotoNetworkFieldValues, atprotoNetworkSeedActors } from '$/constants/Social/Atproto.ts'
import { lensNetworkFieldValues, lensNetworkSeedAccounts } from '$/constants/Social/Lens.ts'
import { redditNetworkFieldValues, redditNetworkSeedSubreddits } from '$/constants/Social/Reddit.ts'
import { xNetworkFieldValues, xNetworkSeedUsers } from '$/constants/Social/X.ts'
import { xmtpNetworkFieldValues } from '$/constants/Social/Xmtp.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Constants_Internal,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NetworkUpgrade,
			resolve: async (entityId) => {
				const { networkUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/NetworkUpgrades.ts'
				)
				const upgradeDefinition = networkUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.chainId}:${entityId.upgradeId}`
				]
				if (upgradeDefinition == null) {
					throw new Error(`Constants_Internal: NetworkUpgrade not found for ${entityId.$network.chainId}:${entityId.upgradeId}`)
				}
				return { ...upgradeDefinition }
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NetworkExecutionUpgrade,
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/NetworkUpgrades.ts'
				)
				const upgradeDefinition = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.chainId}:${entityId.upgradeId}`
				]
				if (upgradeDefinition == null) {
					throw new Error(`Constants_Internal: NetworkExecutionUpgrade not found for ${entityId.$network.chainId}:${entityId.upgradeId}`)
				}
				return { ...upgradeDefinition }
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NetworkConsensusUpgrade,
			resolve: async (entityId) => {
				const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/NetworkUpgrades.ts'
				)
				const upgradeDefinition = networkConsensusUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.chainId}:${entityId.upgradeId}`
				]
				if (upgradeDefinition == null) {
					throw new Error(`Constants_Internal: NetworkConsensusUpgrade not found for ${entityId.$network.chainId}:${entityId.upgradeId}`)
				}
				return { ...upgradeDefinition }
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MarketVenue,
			resolve: async (entityId) => {
				const { marketVenueById } = await import('$/constants/MarketVenue.ts')
				return {
					label: marketVenueById[entityId.marketVenueId].label,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Url,
			resolve: async (_entityId) => (
				{}
			),
		}),

		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId) => {
				const { urlEntitiesDeduplicatedSortedFromFaucetUrlStrings } = await import(
					'$/resolvers/_networkCatalogUrlEntities.ts'
				)
				const { executionEndpointsByChainId } = await import('$/constants/ExecutionEndpoints.ts')
				const list = executionEndpointsByChainId[entityId.chainId as ChainId] ?? []
				return {
					executionEndpoints: [...list],
					$$rpcUrls: urlEntitiesDeduplicatedSortedFromFaucetUrlStrings(list.map((endpoint) => endpoint.url)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ProposalRealm,
			resolve: async (entityId) => (
				{
					...proposalRealmById[entityId.realm],
				}
			),
		}),

		defineEntityResolver({
			entityType: EntityType.ProposalKind,
			resolve: async (entityId) => (
				{
					label: proposalCategoryById[entityId.category].label,
					labelPlural: proposalCategoryById[entityId.category].labelPlural,
					slug: proposalCategoryById[entityId.category].slug,
				}
			),
		}),

		defineEntityResolver({
			entityType: EntityType.ActivityPubNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'ActivityPubNetwork') {
					throw new Error('Constants: unexpected ActivityPubNetwork id')
				}
				return activityPubNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.AtprotoNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'AtprotoNetwork') {
					throw new Error('Constants: unexpected AtprotoNetwork id')
				}
				return atprotoNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LensNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'LensNetwork') {
					throw new Error('Constants: unexpected LensNetwork id')
				}
				return lensNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'RedditNetwork') {
					throw new Error('Constants: unexpected RedditNetwork id')
				}
				return redditNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'XNetwork') {
					throw new Error('Constants: unexpected XNetwork id')
				}
				return xNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XmtpNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'XmtpNetwork') {
					throw new Error('Constants: unexpected XmtpNetwork id')
				}
				return xmtpNetworkFieldValues
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$networkUpgrades',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { networkUpgrades } = await import('$/constants/NetworkUpgrades.ts')
				return (
					networkUpgrades
						.filter((upgradeRow) => (
							upgradeRow.$executionUpgrade != null
							&& upgradeRow.$consensusUpgrade != null
							&& upgradeRow.$executionUpgrade[EntityMetaKey.Id].upgradeId
								!== upgradeRow.$consensusUpgrade[EntityMetaKey.Id].upgradeId
						))
						.map((upgradeRow) => ({ ...upgradeRow }))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposalRealms',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
				proposalRealmById == null ?
					[]
				:	Object.values(proposalRealmById).map((realmRow) => ({
						[EntityMetaKey.Id]: {
							realm: realmRow.id,
						},
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposalKinds',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
				proposalKindIds.map((proposalKindId) => ({
					[EntityMetaKey.Id]: proposalKindId,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ProposalRealm,
			fieldName: '$$proposalKinds',
			resolve: async (entityId: EntityId<typeof schema, EntityType.ProposalRealm>) => (
				proposalKindIdsForRealm(entityId.realm).map((proposalKindId) => ({
					[EntityMetaKey.Id]: proposalKindId,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ProposalKind,
			fieldName: '$proposalRealm',
			resolve: async (entityId: EntityId<typeof schema, EntityType.ProposalKind>) => (
				{
					[EntityMetaKey.Id]: {
						realm: entityId.realm,
					},
				}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coins',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return [
					...coins.map((coin) => (
						{
							[EntityMetaKey.Id]: {
								coinId: coin.id,
							},
						}
					)),
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketVenues',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { marketVenues } = await import('$/constants/MarketVenue.ts')
				return marketVenues.map((marketVenue) => (
					{
						[EntityMetaKey.Id]: {
							marketVenueId: marketVenue.id,
						},
					}
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return [
					...coins.map((coin) => (
						{
							[EntityMetaKey.Id]: {
								$base: {
									kind: MarketAssetKind.Coin,
									$coin: { coinId: coin.id },
								},
								$quote: {
									kind: MarketAssetKind.Currency,
									iso4217: 'USD',
								},
								$marketVenue: {
									marketVenueId: MarketVenueId.SpotIndex,
								},
							} as const,
						}
					)),
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return [
					...coins.map((coin) => (
						{
							[EntityMetaKey.Id]: {
								$market: {
									$base: {
										kind: MarketAssetKind.Coin,
										$coin: { coinId: coin.id },
									},
									$quote: {
										kind: MarketAssetKind.Currency,
										iso4217: 'USD',
									},
									$marketVenue: {
										marketVenueId: MarketVenueId.SpotIndex,
									},
								} as const,
							},
						}
					)),
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => (
				[
					{
						[EntityMetaKey.Id]: {
							$base: {
								kind: MarketAssetKind.Coin,
								$coin: { coinId: entityId.coinId },
							},
							$quote: {
								kind: MarketAssetKind.Currency,
								iso4217: 'USD',
							},
							$marketVenue: {
								marketVenueId: MarketVenueId.SpotIndex,
							},
						} as const,
					},
				]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketsWithCoinAsQuote is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketPrice',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => (
				entityId.coinId === CoinId.Unknown ?
					undefined
				:	{
						[EntityMetaKey.Id]: {
							$market: {
								$base: {
									kind: MarketAssetKind.Coin,
									$coin: { coinId: entityId.coinId },
								},
								$quote: {
									kind: MarketAssetKind.Currency,
									iso4217: 'USD',
								},
								$marketVenue: {
									marketVenueId: MarketVenueId.SpotIndex,
								},
							} as const,
						},
					}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$baseCoin',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				entityId.$base.kind === MarketAssetKind.Coin ?
					{
						[EntityMetaKey.Id]: {
							coinId: entityId.$base.$coin.coinId,
						},
					}
				:	undefined
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketPrices',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				[
					{
						[EntityMetaKey.Id]: {
							$market: entityId,
						},
					},
				]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketPriceRanges',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				[...coingeckoOhlcDayWindowLengths].map((value) => (
					{
						[EntityMetaKey.Id]: {
							$market: entityId,
							timeInterval: {
								unit: MarketTimeIntervalUnit.Day,
								value,
							},
							rangeType: MarketPriceRangeType.OHLCCandles,
						},
					}
				))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPriceRange,
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPriceRange>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$marketsWithInstanceAsBase',
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsBase is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$marketsWithInstanceAsQuote',
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsQuote is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'hasBlobParameterExecutionUpgrade',
			resolve: async (entityId) => {
				const { networkHasBlobParameterExecutionUpgrade } = await import('$/constants/NetworkUpgrades.ts')
				return (
					networkHasBlobParameterExecutionUpgrade(entityId.chainId)
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$upgrades',
			resolve: async (entityId) => {
				const { networkUpgrades } = await import('$/constants/NetworkUpgrades.ts')
				return (
					networkUpgrades
						.filter((upgradeRow) => (
							upgradeRow[EntityMetaKey.Id].$network.chainId === entityId.chainId
							&& upgradeRow.$executionUpgrade != null
							&& upgradeRow.$consensusUpgrade != null
							&& upgradeRow.$executionUpgrade[EntityMetaKey.Id].upgradeId
								!== upgradeRow.$consensusUpgrade[EntityMetaKey.Id].upgradeId
						))
						.map((upgradeRow) => ({ ...upgradeRow }))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$executionUpgrades',
			resolve: async (entityId) => {
				const { networkExecutionUpgrades } = await import('$/constants/NetworkUpgrades.ts')
				return (
					networkExecutionUpgrades
						.filter((upgradeRow) => upgradeRow[EntityMetaKey.Id].$network.chainId === entityId.chainId)
						.map((upgradeRow) => ({ ...upgradeRow }))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$consensusUpgrades',
			resolve: async (entityId) => {
				const { networkConsensusUpgrades } = await import('$/constants/NetworkUpgrades.ts')
				return (
					networkConsensusUpgrades
						.filter((upgradeRow) => upgradeRow[EntityMetaKey.Id].$network.chainId === entityId.chainId)
						.map((upgradeRow) => ({ ...upgradeRow }))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkUpgrade,
			fieldName: '$executionUpgrade',
			resolve: async (entityId) => {
				const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				return (
					upgradeRow?.$executionUpgrade == null ?
						undefined
					:	{ ...upgradeRow.$executionUpgrade }
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkUpgrade,
			fieldName: '$consensusUpgrade',
			resolve: async (entityId) => {
				const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				return (
					upgradeRow?.$consensusUpgrade == null ?
						undefined
					:	{ ...upgradeRow.$consensusUpgrade }
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkUpgrade,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				return [...(upgradeRow?.$$proposals ?? [])]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkExecutionUpgrade,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkExecutionUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				return [...(upgradeRow?.$$proposals ?? [])]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkConsensusUpgrade,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkConsensusUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				return [...(upgradeRow?.$$proposals ?? [])]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensNetwork,
			fieldName: '$$lensAccounts',
			resolve: async () => (
				lensNetworkSeedAccounts.map((account) => ({
					[EntityMetaKey.Id]: account,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensNetwork,
			fieldName: '$$lensPosts',
			resolve: async () => {
				throw new Error('Constants_Internal: $$lensPosts is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoNetwork,
			fieldName: '$$atprotoActors',
			resolve: async () => (
				atprotoNetworkSeedActors.map((actor) => ({
					[EntityMetaKey.Id]: actor,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoNetwork,
			fieldName: '$$atprotoPosts',
			resolve: async () => {
				throw new Error('Constants_Internal: $$atprotoPosts is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubActors',
			resolve: async () => (
				activityPubNetworkSeedActors.map((actor) => ({
					[EntityMetaKey.Id]: actor,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubNotes',
			resolve: async () => {
				throw new Error('Constants_Internal: $$activityPubNotes is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditNetwork,
			fieldName: '$$redditSubreddits',
			resolve: async () => (
				redditNetworkSeedSubreddits.map((subreddit) => ({
					[EntityMetaKey.Id]: subreddit,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditNetwork,
			fieldName: '$$redditLinks',
			resolve: async () => {
				throw new Error('Constants_Internal: $$redditLinks is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XNetwork,
			fieldName: '$$xUsers',
			resolve: async () => (
				xNetworkSeedUsers.map((user) => ({
					[EntityMetaKey.Id]: user,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XNetwork,
			fieldName: '$$xPosts',
			resolve: async () => {
				throw new Error('Constants_Internal: $$xPosts is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XmtpNetwork,
			fieldName: '$$xmtpConversations',
			resolve: async () => {
				throw new Error('Constants_Internal: $$xmtpConversations is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$liquidityPositions',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Constants_Internal: $$liquidityPositions is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$eip8004Services',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Constants_Internal: $$eip8004Services is unsupported')
			},
		}),
	],
}
