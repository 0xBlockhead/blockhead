import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	bridgeToolByKey,
	CoinInstanceRepresentation,
} from '$/constants/Bridge.ts'
import { ChainId } from '$/constants/ChainId.ts'
import { CoinId, coins } from '$/constants/Coin.ts'
import {
	currencies,
	currencyByIso4217,
	currencyCatalogSnapshotTimestampMs,
	Iso4217,
} from '$/constants/Currency.ts'
import { ensProtocolByScope } from '$/constants/EnsProtocol.ts'
import { evmProtocolByScope } from '$/constants/EvmProtocol.ts'
import { ipfsProtocolByScope } from '$/constants/IpfsProtocol.ts'
import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import type {
	NetworkConsensusUpgradeRow,
	NetworkExecutionUpgradeRow,
	NetworkUpgradeRow,
} from '$/constants/EthereumNetworkUpgrades.ts'
import {
	seededCoinSpotUsdMarkets,
	seededCoinSpotUsdMarketByCoinId,
	seededMarketsWithCoinAsQuoteByQuoteCoinId,
	seededMarketsWithCurrencyAsBaseByIso4217,
	seededSpotMarketsWithCoinAsQuote,
	seededSpotMarketsWithCurrencyAsBase,
} from '$/constants/MarketCatalog.ts'
import type { NetworkUpgradeActivationProposal } from '$/constants/EthereumNetworkUpgradeActivations.ts'
import { NetworkExecutionUpgradeLayer } from '$/schema/NetworkUpgradeProtocols.ts'
import {
	networkByCaip2,
	networkBySlug,
	NetworkResourceKind,
	networkResourceUrls,
	NetworkNamespace,
	networks,
} from '$/constants/Network.ts'
import {
	networkNamespaceByNamespace,
} from '$/constants/NetworkNamespace.ts'
import {
	networkStackByNetworkStackId,
} from '$/constants/NetworkStack.ts'
import {
	isSeededCoinCurrencyMarket,
	marketSelectorFromCatalogCoinCoinMarket,
	marketSelectorFromCatalogCoinCurrencyMarket,
	marketSelectorFromCatalogCurrencyCurrencyMarket,
} from '$/resolvers/market.ts'
import { AssetInstanceKind } from '$/schema/AssetInstanceKind.ts'
import {
	MarketVenueId,
	marketVenueById,
	marketVenues,
} from '$/constants/MarketVenue.ts'
import {
	proposalCategoryById,
	ProposalCategory,
	proposalKindAllowedInRealmByKey,
	proposalKinds,
	SpecificationRealm,
	specificationRealmById,
	specificationRealms,
} from '$/constants/SpecificationProposal.ts'
import { activityPubNetworkSeedActors } from '$/constants/Social/ActivityPub.ts'
import {
	atprotoNetworkSeedActors,
	atprotoNetworkSeedPostByUri,
	atprotoNetworkSeedPosts,
} from '$/constants/Social/Atproto.ts'
import { farcasterFeedKindByVariant } from '$/constants/Social/Farcaster.ts'
import { lensNetworkSeedAccounts } from '$/constants/Social/Lens.ts'
import {
	nostrNetworkSeedNotes,
	nostrNetworkSeedProfiles,
	nostrNetworkSeedRelays,
} from '$/constants/Social/Nostr.ts'
import {
	redditNetworkSeedComments,
	redditNetworkSeedLinks,
	redditNetworkSeedSubreddits,
} from '$/constants/Social/Reddit.ts'
import { rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'
import { swarmProtocolByScope } from '$/constants/SwarmProtocol.ts'
import {
	youtubeNetworkSeedChannels,
	youtubeNetworkSeedChannelByChannelId,
	youtubeNetworkSeedPlaylists,
	youtubeNetworkSeedPlaylistByPlaylistId,
	youtubeNetworkSeedVideos,
	youtubeNetworkSeedVideoByVideoId,
} from '$/constants/Social/Youtube.ts'
import { xNetworkSeedUsers } from '$/constants/Social/X.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import type { EntitySelector, EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import sourceProviders from '$/sources/$sourceProviders.ts'
import type { Entity } from '$/schema/$schema.ts'
import {
	precompilesByChainId,
} from '$/constants/precompiles/index.ts'
import { standardPrecompiles } from '$/constants/precompiles/standard.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'

const blockheadSources = sourceProviders.flatMap(({ provider, sources }) => (
	Object.entries(sources).map(([source, definition]) => ({
		id: source,
		label: definition.label,
		provider,
		source,
	}))
)).toSorted((sourceA, sourceB) => sourceA.id.localeCompare(sourceB.id))
const blockheadSourceById = Object.fromEntries(blockheadSources.map((source) => [source.id, source]))

const zeroGChainId = 16661

const zeroGEvmNetworkId = {
	caip2: {
		namespace: 'eip155',
		reference: String(zeroGChainId),
	},
} as const

const networkResourceUrlEntitySelectors = (
	slug: string,
	kind: NetworkResourceKind
) => (
	networkResourceUrls
		.filter((resource) => (
			resource.networkSlug === slug
			&& resource.kind === kind
		))
		.map((resource) => ({
			[EntityMetaKey.Selector]: {
				url: resource.url,
			},
		}))
)

const ethNativeCoinInstanceRepresentationByChainId = {
	[ChainId.Ethereum]: CoinInstanceRepresentation.IssuerNative,
	[ChainId.Optimism]: CoinInstanceRepresentation.CanonicalL2Native,
	[ChainId.Arbitrum]: CoinInstanceRepresentation.CanonicalL2Native,
	[ChainId.Base]: CoinInstanceRepresentation.CanonicalL2Native,
} as const

const evmNetworkUpgradeSelector = (row: {
	readonly chainId: number
	readonly upgradeId: string
}) => ({
	$network: {
		caip2: ({
			namespace: 'eip155',
			reference: String(row.chainId),
		}) satisfies EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Caip2'>['caip2'],
	},
	upgradeId: row.upgradeId,
})

const ethereumProposalRefs = (
	proposalIds: readonly NetworkUpgradeActivationProposal[] | undefined
) => (
	(proposalIds ?? []).map((proposal) => ({
		[EntityMetaKey.Selector]: {
			realm: SpecificationRealm.Ethereum,
			category: proposal.kind,
			number: proposal.number,
		},
	}))
)

const uniqueProposalRefs = (
	proposals: readonly {
		readonly [EntityMetaKey.Selector]: {
			readonly realm: SpecificationRealm
			readonly category: ProposalCategory
			readonly number: number
		}
	}[]
) => (
	proposals.filter((proposal, index) => (
		proposals.findIndex((otherProposal) => (
			otherProposal[EntityMetaKey.Selector].realm === proposal[EntityMetaKey.Selector].realm
			&& otherProposal[EntityMetaKey.Selector].category === proposal[EntityMetaKey.Selector].category
			&& otherProposal[EntityMetaKey.Selector].number === proposal[EntityMetaKey.Selector].number
		)) === index
	))
)

const ethereumConsensusUpgradeProposalRefs = (
	networkConsensusUpgrade: NetworkConsensusUpgradeRow,
	networkUpgradeByChainIdAndConsensusUpgradeId: Partial<Record<string, NetworkUpgradeRow>>,
	networkExecutionUpgradeByChainIdAndUpgradeId: Partial<Record<string, NetworkExecutionUpgradeRow>>,
	networkConsensusUpgradeByChainIdAndUpgradeId: Partial<Record<string, NetworkConsensusUpgradeRow>>
) => {
	const directProposals = ethereumProposalRefs(networkConsensusUpgrade.proposalIds)
	if (directProposals.length > 0)
		return directProposals

	const umbrellaNetworkUpgrade = networkUpgradeByChainIdAndConsensusUpgradeId[
		`${networkConsensusUpgrade.chainId}:${networkConsensusUpgrade.upgradeId}`
	]
	return (
		umbrellaNetworkUpgrade == null ?
			directProposals
		:
			uniqueProposalRefs([
				...ethereumProposalRefs(
					networkExecutionUpgradeByChainIdAndUpgradeId[
						`${umbrellaNetworkUpgrade.chainId}:${umbrellaNetworkUpgrade.executionUpgradeId}`
					]?.proposalIds
				),
				...ethereumProposalRefs(
					networkConsensusUpgradeByChainIdAndUpgradeId[
						`${umbrellaNetworkUpgrade.chainId}:${umbrellaNetworkUpgrade.consensusUpgradeId}`
					]?.proposalIds
				),
			])
	)
}

const evmNetworkUpgradeEntityFromRow = (
	networkUpgrade: {
		readonly chainId: number
		readonly upgradeId: string
		readonly name: string
		readonly slug: string
		readonly executionUpgradeId: string
		readonly consensusUpgradeId?: string
	},
	networkExecutionUpgradeByChainIdAndUpgradeId: Record<string, {
		readonly activationBlock?: number
		readonly activationTimestampMs?: number
		readonly activationEpoch?: number
		readonly proposalIds?: readonly NetworkUpgradeActivationProposal[]
	}>,
	networkConsensusUpgradeByChainIdAndUpgradeId: Record<string, {
		readonly activationBlock?: number
		readonly activationTimestampMs?: number
		readonly activationEpoch?: number
		readonly proposalIds?: readonly NetworkUpgradeActivationProposal[]
	}>
) => {
	const linkedNetworkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
		`${networkUpgrade.chainId}:${networkUpgrade.executionUpgradeId}`
	]

	const linkedNetworkConsensusUpgrade = (
		networkUpgrade.consensusUpgradeId == null ?
			undefined
		:
			networkConsensusUpgradeByChainIdAndUpgradeId[
				`${networkUpgrade.chainId}:${networkUpgrade.consensusUpgradeId}`
			]
	)
	const activationTimestampsMs = [
		linkedNetworkExecutionUpgrade.activationTimestampMs,
		linkedNetworkConsensusUpgrade?.activationTimestampMs,
	].filter((timestamp): timestamp is number => timestamp != null)
	const proposals = uniqueProposalRefs([
		...ethereumProposalRefs(linkedNetworkExecutionUpgrade.proposalIds),
		...ethereumProposalRefs(linkedNetworkConsensusUpgrade?.proposalIds),
	])

	return {
		[EntityMetaKey.Selector]: evmNetworkUpgradeSelector(networkUpgrade),
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'name')]: networkUpgrade.name,
			[entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'slug')]: networkUpgrade.slug,
			...(linkedNetworkExecutionUpgrade.activationBlock != null && {
				[entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'activationBlock')]: linkedNetworkExecutionUpgrade.activationBlock,
			}),
			...(linkedNetworkExecutionUpgrade.activationBlock == null && linkedNetworkConsensusUpgrade?.activationBlock != null && {
				[entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'activationBlock')]: linkedNetworkConsensusUpgrade.activationBlock,
			}),
			...(activationTimestampsMs.length > 0 && {
				[entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'activationTimestampMs')]: Math.max(...activationTimestampsMs),
			}),
			...(linkedNetworkConsensusUpgrade?.activationEpoch != null && {
				[entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'activationEpoch')]: linkedNetworkConsensusUpgrade.activationEpoch,
			}),
			...(linkedNetworkConsensusUpgrade?.activationEpoch == null && linkedNetworkExecutionUpgrade.activationEpoch != null && {
				[entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], 'activationEpoch')]: linkedNetworkExecutionUpgrade.activationEpoch,
			}),
			...(proposals.length > 0 && {
				[entityFieldAddressKey(EntityType.EthereumNetworkUpgrade, [], '$$proposals')]: proposals,
			}),
		},
	}
}

const evmNetworkExecutionUpgradeEntityFromRow = (
	networkExecutionUpgrade: NetworkExecutionUpgradeRow
) => ({
	[EntityMetaKey.Selector]: evmNetworkUpgradeSelector(networkExecutionUpgrade),
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'name')]: networkExecutionUpgrade.name,
		[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'slug')]: networkExecutionUpgrade.slug,
		[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'protocol')]: networkExecutionUpgrade.protocol,
		...(networkExecutionUpgrade.layer != null && {
			[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'layer')]: networkExecutionUpgrade.layer,
		}),
		...(networkExecutionUpgrade.activationBlock != null && {
			[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'activationBlock')]: networkExecutionUpgrade.activationBlock,
		}),
		...(networkExecutionUpgrade.activationTimestampMs != null && {
			[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'activationTimestampMs')]: networkExecutionUpgrade.activationTimestampMs,
		}),
		...(networkExecutionUpgrade.activationEpoch != null && {
			[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'activationEpoch')]: networkExecutionUpgrade.activationEpoch,
		}),
		...(networkExecutionUpgrade.forkHash != null && {
			[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'forkHash')]: networkExecutionUpgrade.forkHash,
		}),
		...(networkExecutionUpgrade.linkEthereumOrg != null && {
			[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'linkEthereumOrg')]: networkExecutionUpgrade.linkEthereumOrg,
		}),
		...(networkExecutionUpgrade.linkExecutionDocs != null && {
			[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'linkExecutionDocs')]: networkExecutionUpgrade.linkExecutionDocs,
		}),
		...(networkExecutionUpgrade.linkForkcast != null && {
			[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'linkForkcast')]: networkExecutionUpgrade.linkForkcast,
		}),
		...(networkExecutionUpgrade.executionSpecsPinnedMarkdownFilename != null && {
			[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], 'executionSpecsPinnedMarkdownFilename')]: networkExecutionUpgrade.executionSpecsPinnedMarkdownFilename,
		}),
		[entityFieldAddressKey(EntityType.EthereumExecutionUpgrade, [], '$$proposals')]: ethereumProposalRefs(networkExecutionUpgrade.proposalIds),
	},
})

const evmNetworkConsensusUpgradeEntityFromRow = (
	networkConsensusUpgrade: NetworkConsensusUpgradeRow
) => ({
	[EntityMetaKey.Selector]: evmNetworkUpgradeSelector(networkConsensusUpgrade),
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'name')]: networkConsensusUpgrade.name,
		[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'slug')]: networkConsensusUpgrade.slug,
		[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'protocol')]: networkConsensusUpgrade.protocol,
		...(networkConsensusUpgrade.activationBlock != null && {
			[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'activationBlock')]: networkConsensusUpgrade.activationBlock,
		}),
		...(networkConsensusUpgrade.activationTimestampMs != null && {
			[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'activationTimestampMs')]: networkConsensusUpgrade.activationTimestampMs,
		}),
		...(networkConsensusUpgrade.activationEpoch != null && {
			[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'activationEpoch')]: networkConsensusUpgrade.activationEpoch,
		}),
		...(networkConsensusUpgrade.linkEthereumOrg != null && {
			[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'linkEthereumOrg')]: networkConsensusUpgrade.linkEthereumOrg,
		}),
		...(networkConsensusUpgrade.linkConsensusDocs != null && {
			[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'linkConsensusDocs')]: networkConsensusUpgrade.linkConsensusDocs,
		}),
		...(networkConsensusUpgrade.linkForkcast != null && {
			[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], 'linkForkcast')]: networkConsensusUpgrade.linkForkcast,
		}),
		[entityFieldAddressKey(EntityType.EthereumConsensusUpgrade, [], '$$proposals')]: ethereumProposalRefs(networkConsensusUpgrade.proposalIds),
	},
})


export default {
	source: Source.Constants_Internal,

	resolvers: [
		defineResolver({
			entityType: EntityType.BlockheadSource,
			resolve: {
				Id: {
					resolve: ({ id }) => {
						const blockheadSource = blockheadSourceById[id]
						if (blockheadSource == null)
							throw new Error('Constants_Internal: BlockheadSource not present in catalog')

						return blockheadSource
					},
				},
			},
		})({
			id: (blockheadSource) => blockheadSource.id,
			label: (blockheadSource) => blockheadSource.label,
			provider: (blockheadSource) => blockheadSource.provider,
			source: (blockheadSource) => blockheadSource.source,
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: (_selector: EntitySelector<typeof schema, EntityType._Global>, context) => {
						const offset = context.providerContinuationToken == null ?
							context.pagination.offset ?? 0
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('Constants_Internal: invalid source-registry continuation')

						return {
							offset,
							rows: blockheadSources
								.slice(offset, offset + resolverContextRowLimit(context))
								.map((blockheadSource) => ({
									[EntityMetaKey.Selector]: {
										id: blockheadSource.id,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BlockheadSource, [], 'label')]: blockheadSource.label,
										[entityFieldAddressKey(EntityType.BlockheadSource, [], 'provider')]: blockheadSource.provider,
										[entityFieldAddressKey(EntityType.BlockheadSource, [], 'source')]: blockheadSource.source,
									},
								})),
							totalCount: blockheadSources.length,
						}
					},
				},
			},
		})({
			$$blockheadSources: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => {
					const nextOffset = snapshot.offset + snapshot.rows.length
					return {
						operation: 'source-registry',
						target: 'global',
						terminal: nextOffset >= snapshot.totalCount,
						...(nextOffset < snapshot.totalCount && { token: String(nextOffset) }),
					}
				},
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),

		defineResolver({
			entityType: EntityType.EthereumNetworkUpgrade,
			resolve: {
				EvmNetworkUpgradeId: {
					resolve: async ({ $network, upgradeId }) => {
						const {
							networkUpgradeByChainIdAndUpgradeId,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkConsensusUpgradeByChainIdAndUpgradeId,
						} = await import(
							'$/constants/EthereumNetworkUpgrades.ts'
						)
						const networkUpgradeKey = `${$network.caip2.reference}:${upgradeId}`
						if (!Object.hasOwn(networkUpgradeByChainIdAndUpgradeId, networkUpgradeKey))
							throw new Error(`Constants_Internal: NetworkUpgrade ${$network.caip2.reference}:${upgradeId} not found`)

						const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[networkUpgradeKey]
						const linkedNetworkExecutionUpgradeKey = `${networkUpgrade.chainId}:${networkUpgrade.executionUpgradeId}`
						if (!Object.hasOwn(networkExecutionUpgradeByChainIdAndUpgradeId, linkedNetworkExecutionUpgradeKey))
							throw new Error(`Constants_Internal: linked execution upgrade not found for ${$network.caip2.reference}:${upgradeId}`)

						const linkedNetworkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
							linkedNetworkExecutionUpgradeKey
						]
						const linkedNetworkConsensusUpgrade = (
							networkUpgrade.consensusUpgradeId == null ?
								undefined
							:
								networkConsensusUpgradeByChainIdAndUpgradeId[
									`${networkUpgrade.chainId}:${networkUpgrade.consensusUpgradeId}`
								]
						)
						const activationTimestampsMs = [
							linkedNetworkExecutionUpgrade.activationTimestampMs,
							linkedNetworkConsensusUpgrade?.activationTimestampMs,
						].filter((timestamp): timestamp is number => timestamp != null)
						const proposals = [
							...ethereumProposalRefs(linkedNetworkExecutionUpgrade.proposalIds),
							...ethereumProposalRefs(linkedNetworkConsensusUpgrade?.proposalIds),
						]

						return {
							...networkUpgrade,
							...(linkedNetworkExecutionUpgrade.activationBlock != null && {
								activationBlock: linkedNetworkExecutionUpgrade.activationBlock,
							}),
							...(linkedNetworkExecutionUpgrade.activationBlock == null && linkedNetworkConsensusUpgrade?.activationBlock != null && {
								activationBlock: linkedNetworkConsensusUpgrade.activationBlock,
							}),
							...(activationTimestampsMs.length > 0 && {
								activationTimestampMs: Math.max(...activationTimestampsMs),
							}),
							...(linkedNetworkConsensusUpgrade?.activationEpoch != null && {
								activationEpoch: linkedNetworkConsensusUpgrade.activationEpoch,
							}),
							...(linkedNetworkConsensusUpgrade?.activationEpoch == null && linkedNetworkExecutionUpgrade.activationEpoch != null && {
								activationEpoch: linkedNetworkExecutionUpgrade.activationEpoch,
							}),
							$$proposals: uniqueProposalRefs(proposals),
						}
					},
				},
				EvmNetworkSlug: {
					resolve: async ({ $network, slug }) => {
						const {
							networkUpgradeByChainIdAndRouteSegment,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkConsensusUpgradeByChainIdAndUpgradeId,
						} = await import(
							'$/constants/EthereumNetworkUpgrades.ts'
						)
						const networkUpgrade = networkUpgradeByChainIdAndRouteSegment[`${$network.caip2.reference}:${slug}`]
						if (networkUpgrade == null)
							throw new Error(`Constants_Internal: NetworkUpgrade ${$network.caip2.reference}:${slug} not found`)

						const linkedNetworkExecutionUpgradeKey = `${networkUpgrade.chainId}:${networkUpgrade.executionUpgradeId}`
						if (!Object.hasOwn(networkExecutionUpgradeByChainIdAndUpgradeId, linkedNetworkExecutionUpgradeKey))
							throw new Error(`Constants_Internal: linked execution upgrade not found for ${$network.caip2.reference}:${slug}`)

						const linkedNetworkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
							linkedNetworkExecutionUpgradeKey
						]
						const linkedNetworkConsensusUpgrade = (
							networkUpgrade.consensusUpgradeId == null ?
								undefined
							:
								networkConsensusUpgradeByChainIdAndUpgradeId[
									`${networkUpgrade.chainId}:${networkUpgrade.consensusUpgradeId}`
								]
						)
						const activationTimestampsMs = [
							linkedNetworkExecutionUpgrade.activationTimestampMs,
							linkedNetworkConsensusUpgrade?.activationTimestampMs,
						].filter((timestamp): timestamp is number => timestamp != null)
						const proposals = [
							...ethereumProposalRefs(linkedNetworkExecutionUpgrade.proposalIds),
							...ethereumProposalRefs(linkedNetworkConsensusUpgrade?.proposalIds),
						]

						return {
							...networkUpgrade,
							...(linkedNetworkExecutionUpgrade.activationBlock != null && {
								activationBlock: linkedNetworkExecutionUpgrade.activationBlock,
							}),
							...(linkedNetworkExecutionUpgrade.activationBlock == null && linkedNetworkConsensusUpgrade?.activationBlock != null && {
								activationBlock: linkedNetworkConsensusUpgrade.activationBlock,
							}),
							...(activationTimestampsMs.length > 0 && {
								activationTimestampMs: Math.max(...activationTimestampsMs),
							}),
							...(linkedNetworkConsensusUpgrade?.activationEpoch != null && {
								activationEpoch: linkedNetworkConsensusUpgrade.activationEpoch,
							}),
							...(linkedNetworkConsensusUpgrade?.activationEpoch == null && linkedNetworkExecutionUpgrade.activationEpoch != null && {
								activationEpoch: linkedNetworkExecutionUpgrade.activationEpoch,
							}),
							$$proposals: uniqueProposalRefs(proposals),
						}
					},
				},
			},
		})({
			name: (upgrade) => upgrade.name,
			slug: (upgrade) => upgrade.slug,
			activationBlock: (upgrade) => upgrade.activationBlock,
			activationTimestampMs: (upgrade) => upgrade.activationTimestampMs,
			activationEpoch: (upgrade) => upgrade.activationEpoch,
			$networkExecutionUpgrade: (upgrade) => ({
				[EntityMetaKey.Selector]: evmNetworkUpgradeSelector({
					chainId: upgrade.chainId,
					upgradeId: upgrade.executionUpgradeId,
				}),
			}),
			$networkConsensusUpgrade: (upgrade) => (
				upgrade.consensusUpgradeId == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: evmNetworkUpgradeSelector({
							chainId: upgrade.chainId,
							upgradeId: upgrade.consensusUpgradeId,
						}),
					}
			),
			$$proposals: (upgrade) => upgrade.$$proposals,
		}),

		defineResolver({
			entityType: EntityType.EthereumExecutionUpgrade,
			resolve: {
				EvmNetworkUpgradeId: {
					resolve: async ({ $network, upgradeId }) => {
						const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import(
							'$/constants/EthereumNetworkUpgrades.ts'
						)
						const networkExecutionUpgradeKey = `${$network.caip2.reference}:${upgradeId}`
						if (!Object.hasOwn(networkExecutionUpgradeByChainIdAndUpgradeId, networkExecutionUpgradeKey))
							throw new Error(`Constants_Internal: ExecutionUpgrade ${$network.caip2.reference}:${upgradeId} not found`)

						const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
							networkExecutionUpgradeKey
						]
						return {
							...networkExecutionUpgrade,
							$$proposals: ethereumProposalRefs(networkExecutionUpgrade.proposalIds),
						}
					},
				},
				EvmNetworkSlug: {
					resolve: async ({ $network, slug }) => {
						const { networkExecutionUpgradeByChainIdAndRouteSegment } = await import(
							'$/constants/EthereumNetworkUpgrades.ts'
						)
						const networkExecutionUpgradeKey = `${$network.caip2.reference}:${slug}`
						if (!Object.hasOwn(networkExecutionUpgradeByChainIdAndRouteSegment, networkExecutionUpgradeKey))
							throw new Error(`Constants_Internal: ExecutionUpgrade ${$network.caip2.reference}:${slug} not found`)

						const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndRouteSegment[
							networkExecutionUpgradeKey
						]
						return {
							...networkExecutionUpgrade,
							$$proposals: ethereumProposalRefs(networkExecutionUpgrade.proposalIds),
						}
					},
				},
			},
		})({
			name: (upgrade) => upgrade.name,
			slug: (upgrade) => upgrade.slug,
			activationBlock: (upgrade) => upgrade.activationBlock,
			activationTimestampMs: (upgrade) => upgrade.activationTimestampMs,
			activationEpoch: (upgrade) => upgrade.activationEpoch,
			protocol: (upgrade) => upgrade.protocol,
			layer: (upgrade) => upgrade.layer,
			forkHash: (upgrade) => upgrade.forkHash,
			linkEthereumOrg: (upgrade) => upgrade.linkEthereumOrg,
			linkExecutionDocs: (upgrade) => upgrade.linkExecutionDocs,
			linkForkcast: (upgrade) => upgrade.linkForkcast,
			executionSpecsPinnedMarkdownFilename: (upgrade) => upgrade.executionSpecsPinnedMarkdownFilename,
			$$proposals: (upgrade) => upgrade.$$proposals,
		}),

		defineResolver({
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				EvmNetworkUpgradeId: {
					resolve: async ({ $network, upgradeId }) => {
						const {
							networkConsensusUpgradeByChainIdAndUpgradeId,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkUpgradeByChainIdAndConsensusUpgradeId,
						} = await import(
							'$/constants/EthereumNetworkUpgrades.ts'
						)
						const networkConsensusUpgradeKey = `${$network.caip2.reference}:${upgradeId}`
						if (!Object.hasOwn(networkConsensusUpgradeByChainIdAndUpgradeId, networkConsensusUpgradeKey))
							throw new Error(`Constants_Internal: ConsensusUpgrade ${$network.caip2.reference}:${upgradeId} not found`)

						const networkConsensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[
							networkConsensusUpgradeKey
						]
						return {
							...networkConsensusUpgrade,
							$$proposals: ethereumConsensusUpgradeProposalRefs(
								networkConsensusUpgrade,
								networkUpgradeByChainIdAndConsensusUpgradeId,
								networkExecutionUpgradeByChainIdAndUpgradeId,
								networkConsensusUpgradeByChainIdAndUpgradeId
							),
						}
					},
				},
				EvmNetworkSlug: {
					resolve: async ({ $network, slug }) => {
						const {
							networkConsensusUpgradeByChainIdAndRouteSegment,
							networkConsensusUpgradeByChainIdAndUpgradeId,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkUpgradeByChainIdAndConsensusUpgradeId,
						} = await import(
							'$/constants/EthereumNetworkUpgrades.ts'
						)
						const networkConsensusUpgradeKey = `${$network.caip2.reference}:${slug}`
						if (!Object.hasOwn(networkConsensusUpgradeByChainIdAndRouteSegment, networkConsensusUpgradeKey))
							throw new Error(`Constants_Internal: ConsensusUpgrade ${$network.caip2.reference}:${slug} not found`)

						const networkConsensusUpgrade = networkConsensusUpgradeByChainIdAndRouteSegment[
							networkConsensusUpgradeKey
						]
						return {
							...networkConsensusUpgrade,
							$$proposals: ethereumConsensusUpgradeProposalRefs(
								networkConsensusUpgrade,
								networkUpgradeByChainIdAndConsensusUpgradeId,
								networkExecutionUpgradeByChainIdAndUpgradeId,
								networkConsensusUpgradeByChainIdAndUpgradeId
							),
						}
					},
				},
			},
		})({
			name: (upgrade) => upgrade.name,
			slug: (upgrade) => upgrade.slug,
			activationBlock: (upgrade) => upgrade.activationBlock,
			activationTimestampMs: (upgrade) => upgrade.activationTimestampMs,
			activationEpoch: (upgrade) => upgrade.activationEpoch,
			protocol: (upgrade) => upgrade.protocol,
			linkEthereumOrg: (upgrade) => upgrade.linkEthereumOrg,
			linkConsensusDocs: (upgrade) => upgrade.linkConsensusDocs,
			linkForkcast: (upgrade) => upgrade.linkForkcast,
			$$proposals: (upgrade) => upgrade.$$proposals,
		}),

		defineResolver({
			entityType: EntityType.Currency,
			resolve: {
				Iso4217: {
					resolve: async ({ iso4217 }) => {
						const currency = currencyByIso4217[iso4217]
						if (currency == null)
							throw new Error(`Constants_Internal: Currency not found for ${iso4217}`)
						return {
							name: currency.name,
							symbol: currency.symbol,
							minorUnitExponent: currency.minorUnitExponent,
						}
					},
				}
			},
		})({
				name: (currency) => currency.name,
				symbol: (currency) => currency.symbol,
				minorUnitExponent: (currency) => currency.minorUnitExponent,
			}),

		defineResolver({
			entityType: EntityType.Currency_Timestamp,
			resolve: {
				CurrencyTimestampMs: {
					resolve: async ({ $currency, timestampMs }) => {
						const currency = currencyByIso4217[$currency.iso4217]
						if (currency == null)
							throw new Error(`Constants_Internal: Currency not found for ${$currency.iso4217}`)
						if (timestampMs !== currencyCatalogSnapshotTimestampMs)
							throw new Error(`Constants_Internal: Currency snapshot not found for ${$currency.iso4217}:${String(timestampMs)}`)
						return {
							marketCap: BigInt(currency.marketCapUsd),
						}
					},
				}
			},
		})({
				marketCap: (currencyTimestamp) => currencyTimestamp.marketCap,
			}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }) => {
						const { coinById } = await import('$/constants/Coin.ts')
						const coin = coinById[coinId]
						return {
							symbol: coin.symbol,
						}
					},
				}
			},
		})({
				symbol: (coin) => coin.symbol,
			}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					appliesTo: [
						{
							coinId: CoinId.BTC,
						},
						{
							coinId: CoinId.ETH,
						},
					],
					resolve: async ({ coinId }) => {
						const { coinById } = await import('$/constants/Coin.ts')
						const coin = coinById[coinId]
						if (!('name' in coin))
							throw new Error(`Constants_Internal: Coin ${coinId} has no catalog name`)

						return {
							name: coin.name,
						}
					},
				}
			},
		})({
				name: (coin) => coin.name,
			}),

		defineResolver({
			entityType: EntityType.Account,
			resolve: {
				Caip10: {
					resolve: async ({ caip10 }) => ({
						caip10,
						namespace: caip10.namespace,
						$network: {
							[EntityMetaKey.Selector]: {
								caip2: {
									namespace: caip10.namespace,
									reference: caip10.reference,
								},
							},
						},
						address: caip10.accountAddress,
					}),
				},
			},
		})({
			namespace: (account) => account.namespace,
			$network: (account) => account.$network,
			address: (account) => account.address,
			Evm: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						$actor: {
							address: EvmAddress.assert(account.caip10.accountAddress),
						},
					},
				}),
			},
			Aptos: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							$network: {
								caip2: {
									namespace: account.caip10.namespace,
									reference: account.caip10.reference,
								},
							},
						},
						address: account.caip10.accountAddress,
					},
				}),
			},
			Cardano: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						address: account.caip10.accountAddress,
					},
				}),
			},
			Cosmos: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						address: account.caip10.accountAddress,
					},
				}),
			},
			Hedera: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						accountId: account.caip10.accountAddress,
					},
				}),
			},
			Polkadot: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						accountId: account.caip10.accountAddress,
					},
				}),
			},
			Solana: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						pubkey: account.caip10.accountAddress,
					},
				}),
			},
			Starknet: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							$network: {
								caip2: {
									namespace: account.caip10.namespace,
									reference: account.caip10.reference,
								},
							},
						},
						address: account.caip10.accountAddress,
					},
				}),
			},
			Tron: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						address: account.caip10.accountAddress,
					},
				}),
			},
			Ton: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						address: account.caip10.accountAddress,
					},
				}),
			},
			Xrpl: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						account: account.caip10.accountAddress,
					},
				}),
			},
			Utxo: {
				$account: (account) => ({
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: account.caip10.namespace,
								reference: account.caip10.reference,
							},
						},
						address: account.caip10.accountAddress,
					},
				}),
			},
		}),

		defineResolver({
			entityType: EntityType.EvmAccount,
			resolve: {
				Address: {
					resolve: async ({ address }) => ({
						address,
					}),
				},
			},
		})({
				address: (account) => account.address,
			}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkType: {
					resolve: ({ $network, type }) => {
						const representation = ethNativeCoinInstanceRepresentationByChainId[Number($network.caip2.reference)]
						if (
						type !== CoinInstanceType.NativeCurrency
						|| representation == null
						) {
							throw new Error('Constants_Internal: CoinInstance not found')
						}
						return {
							coinId: CoinId.ETH,
							name: 'Ether',
							symbol: 'ETH',
							decimals: 18,
							representation,
							caip19: `eip155:${$network.caip2.reference}/slip44:60`,
						}
					},
				},
				NetworkTypeContract: {
					resolve: ({ $contract, $network, type }) => {
						const representation = ethNativeCoinInstanceRepresentationByChainId[Number($network.caip2.reference)]
						if (
							type === CoinInstanceType.Erc20Token
							&& $network.caip2.namespace === 'eip155'
							&& $network.caip2.reference === '1'
							&& $contract.address.toLowerCase() === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
						)
							return {
								coinId: CoinId.USDC,
								name: 'USD Coin',
								symbol: 'USDC',
								decimals: 6,
								caip19: `eip155:1/erc20:${$contract.address.toLowerCase()}`,
							}

						if (
						type !== CoinInstanceType.NativeCurrency
						|| representation == null
						) {
							throw new Error('Constants_Internal: CoinInstance not found')
						}
						return {
							coinId: CoinId.ETH,
							name: 'Ether',
							symbol: 'ETH',
							decimals: 18,
							representation,
							caip19: `eip155:${$network.caip2.reference}/slip44:60`,
						}
					},
				},
			},
		})({
				NativeCurrency: {
					coinId: (coinInstance) => coinInstance.coinId,
					name: (coinInstance) => coinInstance.name,
					symbol: (coinInstance) => coinInstance.symbol,
					decimals: (coinInstance) => coinInstance.decimals,
					representation: (coinInstance) => coinInstance.representation,
					caip19: (coinInstance) => coinInstance.caip19,
				},
				Erc20Token: {
					coinId: (coinInstance) => coinInstance.coinId,
					name: (coinInstance) => coinInstance.name,
					symbol: (coinInstance) => coinInstance.symbol,
					decimals: (coinInstance) => coinInstance.decimals,
					caip19: (coinInstance) => coinInstance.caip19,
				},
			}),

		defineResolver({
			entityType: EntityType.CoinBridgeCapability,
			resolve: {
				EvmCoinInstanceEvmCoinInstanceToolKey: {
					resolve: async ({ toolKey }) => {
						const coinBridgeCapabilityFields = bridgeToolByKey[toolKey]
						if (coinBridgeCapabilityFields == null)
							throw new Error(`Constants_Internal: unknown LI.FI tool key ${toolKey}`)
						return {
							toolKey: coinBridgeCapabilityFields.key,
							...coinBridgeCapabilityFields,
						}
					},
				}
			},
		})({
				toolKey: (capability) => capability.toolKey,
				railId: (capability) => capability.railId,
				settlementModel: (capability) => capability.settlementModel,
				verificationModel: (capability) => capability.verificationModel,
				assetOutcome: (capability) => capability.assetOutcome,
			}),

		defineResolver({
			entityType: EntityType.MevRelay,
			resolve: {
				EvmNetworkHost: {
					resolve: async ({ host }) => ({
						url: `https://${host}`,
					}),
				}
			},
		})({
				url: (relay) => relay.url,
			}),

		defineResolver({
			entityType: EntityType.EvmProtocol,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => evmProtocolByScope[scope],
				},
			},
		})({
				protocolName: (protocol) => protocol.protocolName,
				homeUrl: (protocol) => protocol.homeUrl,
				docsUrl: (protocol) => protocol.docsUrl,
			}),

		defineResolver({
			entityType: EntityType.MarketVenue,
			resolve: {
				MarketVenueId: {
					resolve: async ({ marketVenueId }) => marketVenueById[marketVenueId],
				},
			},
		})({
				marketVenueId: (marketVenue) => marketVenue.id,
				label: (marketVenue) => marketVenue.label,
				$$markets: (marketVenue, _marketVenueSelector, context) => {
					const limit = resolverContextRowLimit(context)
					const marketReferences: {
						[EntityMetaKey.Selector]: EntitySelector<typeof schema, EntityType.Market>
					}[] = []

					for (const catalogMarket of seededCoinSpotUsdMarkets) {
						if (marketReferences.length >= limit)
							return marketReferences

						if (catalogMarket.marketVenueId === marketVenue.id)
							marketReferences.push({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogMarket),
							})
					}

					for (const catalogMarket of seededSpotMarketsWithCoinAsQuote) {
						if (marketReferences.length >= limit)
							return marketReferences

						if (catalogMarket.marketVenueId === marketVenue.id)
							marketReferences.push({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCoinMarket(catalogMarket),
							})
					}

					for (const catalogMarket of seededSpotMarketsWithCurrencyAsBase) {
						if (marketReferences.length >= limit)
							return marketReferences

						if (catalogMarket.marketVenueId === marketVenue.id)
							marketReferences.push({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
							})
					}

					return marketReferences
				},
			}),

		defineResolver({
			entityType: EntityType.NetworkStack,
			resolve: {
				NetworkStackId: {
					resolve: async ({ networkStackId }) => networkStackByNetworkStackId[networkStackId],
				},
			},
		})({
				label: (networkStack) => networkStack.label,
			}),

		defineResolver({
			entityType: EntityType.SpecificationRealm,
			resolve: {
				Realm: {
					resolve: async ({ realm }) => specificationRealmById[realm],
				},
			},
		})({
				label: (realm) => realm.label,
				labelPlural: (realm) => realm.labelPlural ?? undefined,
				slug: (realm) => realm.slug,
				$$proposalKinds: {
					select: (realm) => proposalKinds
						.filter((proposalKind) => proposalKind.realm === realm.id)
						.map((proposalKind) => ({
							[EntityMetaKey.Selector]: {
								realm: proposalKind.realm,
								category: proposalKind.category,
							},
						})),
					resolveCount: (realm) => proposalKinds
						.filter((proposalKind) => proposalKind.realm === realm.id)
						.length,
				},
			}),

		defineResolver({
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				RealmCategory: {
					resolve: async ({ realm, category }) => proposalKindAllowedInRealmByKey[`${realm}:${category}`],
				},
			},
		})({
				label: (proposalKind) => proposalCategoryById[proposalKind.category].label,
				labelPlural: (proposalKind) => proposalCategoryById[proposalKind.category].labelPlural,
				slug: (proposalKind) => proposalCategoryById[proposalKind.category].slug,
					$specificationRealm: (proposalKind) => ({
						[EntityMetaKey.Selector]: {
							realm: proposalKind.realm,
						},
					}),
				}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [{
						caip2: networkBySlug.zcash.caip2,
					}],
					resolve: async (network) => (
						Object.values(ZcashShieldedPoolKind).map((pool) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								pool,
							},
						}))
					),
				},
				Slug: {
					appliesTo: [{
						slug: networkBySlug.zcash.slug,
					}],
					resolve: async (network) => (
						Object.values(ZcashShieldedPoolKind).map((pool) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								pool,
							},
						}))
					),
				},
			},
		})({
				Zcash: {
					$$shieldedPools: (pools) => pools,
				},
			}),

		defineResolver({
			entityType: EntityType.ZcashShieldedPool,
			resolve: {
				NetworkPool: {
					resolve: async ({ pool }) => ({
						activationNetworkUpgrade: (
							pool === ZcashShieldedPoolKind.Sprout ?
								'Sprout'
							: pool === ZcashShieldedPoolKind.Sapling ?
								'Sapling'
							:
								'NU5'
						),
						noteProtocol: pool,
					}),
				},
			},
		})({
				activationNetworkUpgrade: (pool) => pool.activationNetworkUpgrade,
				noteProtocol: (pool) => pool.noteProtocol,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: Object.values(networkByCaip2).map((network) => ({
						caip2: network.caip2,
					})),
					resolve: async ({ caip2 }) => {
						const { beaconConsensusByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
						const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
						const beaconConsensus = beaconConsensusByExecutionChainId[Number(caip2.reference)]
						return {
							slug: network.slug,
							name: network.name,
							...('caip2' in network && {
								caip2: network.caip2,
							}),
							namespace: network.namespace,
							ledgerModels: network.ledgerModels,
							executionModels: network.executionModels,
							networkStackId: networkNamespaceByNamespace[network.namespace].networkStackId,
							environment: network.environment,
							...(network.slug === networkBySlug['0g'].slug && {
								zeroGChainId,
							}),
							evmConsensusProtocol: beaconConsensus?.consensusProtocol,
						}
					},
				},
				Slug: {
					resolve: async ({ slug }) => {
						const { beaconConsensusByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
						const network = networkBySlug[slug]
						if (network == null)
							throw new Error('Constants_Internal: Network not found')
						const beaconConsensus = (
							'caip2' in network ?
								beaconConsensusByExecutionChainId[Number(network.caip2.reference)]
							:
								undefined
						)

						return {
							slug: network.slug,
							name: network.name,
							...('caip2' in network && {
								caip2: network.caip2,
							}),
							namespace: network.namespace,
							ledgerModels: network.ledgerModels,
							executionModels: network.executionModels,
							networkStackId: networkNamespaceByNamespace[network.namespace].networkStackId,
							environment: network.environment,
							...(network.slug === networkBySlug['0g'].slug && {
								zeroGChainId,
							}),
							evmConsensusProtocol: beaconConsensus?.consensusProtocol,
						}
					},
				},
			},
		})({
				slug: (network) => network.slug,
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				namespace: (network) => network.namespace,
				ledgerModels: (network) => network.ledgerModels,
				executionModels: (network) => network.executionModels,
				$networkStack: (network) => (
					network.networkStackId == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: {
								networkStackId: network.networkStackId,
							},
						}
				),
				environment: (network) => network.environment,
				Evm: {
					consensusProtocol: (network) => network.evmConsensusProtocol,
				},
				ZeroG: {
					chainId: (network) => network.zeroGChainId,
				},
				Lightning: {
				},
			}),

		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				Slug: {
					resolve: async ({ slug }) => {
						const network = networkBySlug[slug]
						if (network == null) throw new Error('Constants_Internal: NearNetwork not found')
						return {
							slug: network.slug,
							name: network.name,
							namespace: network.namespace,
							environment: network.environment,
						}
					},
				}
			},
		})({
				slug: (network) => network.slug,
				name: (network) => network.name,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
			}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				Slug: {
					resolve: async ({ slug }) => {
						const network = networkBySlug[slug]
						if (network == null) throw new Error('Constants_Internal: ZeroGNetwork not found')
						return {
							slug: network.slug,
							name: network.name,
							namespace: network.namespace,
							environment: network.environment,
							chainId: zeroGChainId,
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.ZeroGNetwork, [], '$executionNetwork')]: {
									[EntityMetaKey.Selector]: zeroGEvmNetworkId,
								},
							},
						}
					},
				}
			},
		})({
				slug: (network) => network.slug,
				name: (network) => network.name,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
				chainId: (network) => network.chainId,
				$executionNetwork: (network) => network.$executionNetwork,
			}),

		defineResolver({
			entityType: EntityType.ElementsNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						const network = (
							'slug' in $network ?
								networkBySlug[$network.slug]
							:
								networkByCaip2[`${$network.caip2.namespace}:${$network.caip2.reference}`]
						)
						if (network?.slug !== networkBySlug.liquid.slug)
							throw new Error('Constants_Internal: unsupported Elements network')

						return {
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.ElementsNetwork, [], '$network')]: {
									[EntityMetaKey.Selector]: { slug: network.slug },
								},
								[entityFieldAddressKey(EntityType.ElementsNetwork, [], '$settlementNetwork')]: {
									[EntityMetaKey.Selector]: { slug: 'bitcoin' },
								},
							},
							federationName: 'Liquid Federation',
							blockTimeSeconds: 60,
							confidentialTransactionsDefault: true,
						}
					},
				}
			},
		})({
				$settlementNetwork: (network) => network.$settlementNetwork,
				federationName: (network) => network.federationName,
				blockTimeSeconds: (network) => network.blockTimeSeconds,
				confidentialTransactionsDefault: (network) => network.confidentialTransactionsDefault,
			}),

		defineResolver({
			entityType: EntityType.AssetInstance,
			resolve: {
				NetworkKindAssetKey: {
					resolve: async ({ assetKey, kind }) => {
						if (kind !== AssetInstanceKind.Native)
							throw new Error('Constants_Internal: AssetInstance name and symbol are native-only')

						return {
							name: assetKey,
							symbol: assetKey,
						}
					},
				}
			},
		})({
				name: (assetInstance) => assetInstance.name,
				symbol: (assetInstance) => assetInstance.symbol,
			}),

		defineResolver({
			entityType: EntityType.BittensorSubnet,
			resolve: {
				NetworkNetuid: {
					resolve: async ({ netuid }) => ({
						name: netuid === 0 ? 'Root' : `Subnet ${netuid}`,
					}),
				}
			},
		})({
				name: (subnet) => subnet.name,
			}),

		defineResolver({
			entityType: EntityType.NetworkUpgrade,
			resolve: {
				NetworkUpgradeId: {
					resolve: async ({ upgradeId }) => ({
						name: upgradeId,
					}),
				}
			},
		})({
				name: (upgrade) => upgrade.name,
			}),


		defineResolver({
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						$$activityPubActors: activityPubNetworkSeedActors.map((actor) => ({
							[EntityMetaKey.Selector]: {
								instanceOrigin: actor.instanceOrigin,
								acct: actor.acct,
							},
						})),
						docsUrl: 'https://w3c.github.io/activitypub/',
						homeUrl: 'https://www.w3.org/TR/activitypub/',
						protocolName: 'ActivityPub (federated)',
					}),
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				$$activityPubActors: (entity) => entity.$$activityPubActors,
			}),

		defineResolver({
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						docsUrl: 'https://atproto.com/specs/atp',
						homeUrl: 'https://atproto.com',
						protocolName: 'AT Protocol (Bluesky / appviews)',
					}),
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
			}),

		defineResolver({
			entityType: EntityType._GlobalAtprotoNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						$$observedActors: atprotoNetworkSeedActors.map((actor) => ({
							[EntityMetaKey.Selector]: {
								did: actor.did,
							},
						})),
						$$observedPosts: atprotoNetworkSeedPosts.map((post) => ({
							[EntityMetaKey.Selector]: {
								uri: post.uri,
							},
						})),
						docsUrl: 'https://atproto.com/specs/atp',
						homeUrl: 'https://atproto.com',
						protocolName: 'AT Protocol',
						relationshipModel: 'DIDs identify repos; PDS hosts serve signed records; appviews index public profiles, feeds, and relationships.',
					}),
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				relationshipModel: (entity) => entity.relationshipModel,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				$$observedActors: (entity) => entity.$$observedActors,
				$$observedPosts: (entity) => entity.$$observedPosts,
			}),


		defineResolver({
			entityType: EntityType._GlobalEnsNetwork,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => {
						const protocol = ensProtocolByScope[scope]
						if (protocol == null)
							throw new Error(`Constants_Internal: _GlobalEnsNetwork scope ${scope} not found`)

						const mainnetCaip2 = {
							namespace: 'eip155',
							reference: String(protocol.mainnetChainId),
						} as const

						const evmContractRef = (address: string) => {
							const normalizedAddress = hexLowerOfByteSize(address, 20)
							if (normalizedAddress == null)
								throw new Error(`Constants_Internal: invalid ENS deployment address ${address}`)

							return {
								[EntityMetaKey.Selector]: {
									$network: { caip2: mainnetCaip2 },
									address: normalizedAddress,
								},
							}
						}

						return {
							scope: protocol.scope,
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType._GlobalEnsNetwork, [], '$registryContract')]: evmContractRef(protocol.registryContractAddress),
								[entityFieldAddressKey(EntityType._GlobalEnsNetwork, [], '$ethRegistrarController')]: evmContractRef(protocol.ethRegistrarControllerAddress),
								[entityFieldAddressKey(EntityType._GlobalEnsNetwork, [], '$reverseRegistrar')]: evmContractRef(protocol.reverseRegistrarAddress),
								[entityFieldAddressKey(EntityType._GlobalEnsNetwork, [], '$nameWrapper')]: evmContractRef(protocol.nameWrapperAddress),
							},
						}
					},
				},
			},
		})({
				scope: (entity) => entity.scope,
				$registryContract: (entity) => entity.$registryContract,
				$ethRegistrarController: (entity) => entity.$ethRegistrarController,
				$reverseRegistrar: (entity) => entity.$reverseRegistrar,
				$nameWrapper: (entity) => entity.$nameWrapper,
			}),

		defineResolver({
			entityType: EntityType.IpfsProtocol,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => ipfsProtocolByScope[scope],
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
			}),

		defineResolver({
			entityType: EntityType._GlobalArweaveNetwork,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => ({
						scope,
					}),
				},
			},
		})({
			scope: (entity) => entity.scope,
		}),

		defineResolver({
			entityType: EntityType._GlobalIpfsAccess,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => ({
						scope,
					}),
				},
			},
		})({
			scope: (entity) => entity.scope,
		}),

		defineResolver({
			entityType: EntityType.SwarmProtocol,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => swarmProtocolByScope[scope],
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
			}),

		defineResolver({
			entityType: EntityType._GlobalSwarmAccess,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => ({
						scope,
					}),
				},
			},
		})({
			scope: (entity) => entity.scope,
		}),

		defineResolver({
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						docsUrl: 'https://docs.farcaster.xyz',
						homeUrl: 'https://www.farcaster.xyz',
						protocolName: 'Farcaster',
						registryName: 'Farcaster hub and indexer source window',
						relationshipModel: 'FID-keyed users, channels, and immutable casts resolved through configured Farcaster REST, Neynar, and Snapchain sources.',
						$$feeds: Object.values(farcasterFeedKindByVariant).map((feed) => ({
							[EntityMetaKey.Selector]: {
								variant: feed.variant,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.FarcasterFeed, [], 'label')]: feed.label,
							},
						})),
					}),
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryName: (entity) => entity.registryName,
				relationshipModel: (entity) => entity.relationshipModel,
				$$feeds: (entity) => entity.$$feeds,
			}),

		defineResolver({
			entityType: EntityType.LensNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						docsUrl: 'https://docs.lens.xyz',
						homeUrl: 'https://lens.xyz',
						protocolName: 'Lens',
						registryName: 'Lens GraphQL source window',
						relationshipModel: 'Profiles and posts are indexed social graph records resolved through configured Lens GraphQL endpoints.',
						$$lensAccounts: lensNetworkSeedAccounts.map((account) => ({
							[EntityMetaKey.Selector]: {
								address: account.address,
							},
						})),
					}),
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryName: (entity) => entity.registryName,
				relationshipModel: (entity) => entity.relationshipModel,
				$$lensAccounts: (entity) => entity.$$lensAccounts,
			}),

		defineResolver({
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => ({
						docsUrl: 'https://github.com/nostr-protocol/nips',
						homeUrl: 'https://nostr.com',
						protocolName: 'Nostr',
						registryName: 'Nostr public relay and indexer source window',
						relationshipModel: 'Profiles, notes, reposts, reactions, and articles are signed events. Relays are WebSocket transports; they do not imply a single global canonical database.',
						$$observedProfiles: nostrNetworkSeedProfiles.slice(0, resolverContextRowLimit(context)).map((profile) => ({
							[EntityMetaKey.Selector]: {
								pubkey: profile.pubkey,
							},
						})),
						$$observedNotes: nostrNetworkSeedNotes.slice(0, resolverContextRowLimit(context)).map((note) => ({
							[EntityMetaKey.Selector]: {
								eventId: note.eventId,
							},
						})),
						$$observedRelays: nostrNetworkSeedRelays.slice(0, resolverContextRowLimit(context)).map((relay) => ({
							[EntityMetaKey.Selector]: {
								relayUrl: relay.relayUrl,
							},
						})),
					}),
				}
			},
		})({
				protocolName: (network) => network.protocolName,
				registryName: (network) => network.registryName,
				homeUrl: (network) => network.homeUrl,
				docsUrl: (network) => network.docsUrl,
				relationshipModel: (network) => network.relationshipModel,
				$$observedProfiles: (network) => network.$$observedProfiles,
				$$observedNotes: (network) => network.$$observedNotes,
				$$observedRelays: (network) => network.$$observedRelays,
			}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const profile = nostrNetworkSeedProfiles.find((seedProfile) => seedProfile.pubkey === pubkey)
						if (profile == null)
							throw new Error('Constants_Internal: NostrProfile seed not found')

						return {
							...profile,
							$$notes: nostrNetworkSeedNotes
								.filter((note) => note.pubkey === pubkey)
								.slice(0, resolverContextRowLimit(context))
								.map((note) => ({
									[EntityMetaKey.Selector]: {
										eventId: note.eventId,
									},
								})),
						}
					},
				}
			},
		})({
				pubkey: (profile) => profile.pubkey,
				$$notes: (profile) => profile.$$notes,
			}),

		defineResolver({
			entityType: EntityType.NostrRelay,
			resolve: {
				RelayUrl: {
					resolve: async ({ relayUrl }) => {
						const relay = nostrNetworkSeedRelays.find((seedRelay) => seedRelay.relayUrl === relayUrl)
						if (relay == null)
							throw new Error('Constants_Internal: NostrRelay seed not found')

						return {
							...relay,
						}
					},
				}
			},
		})({
				relayUrl: (relay) => relay.relayUrl,
			}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }) => {
						const note = nostrNetworkSeedNotes.find((seedNote) => seedNote.eventId === eventId)
						if (note == null)
							throw new Error('Constants_Internal: NostrNote seed not found')

						return {
							eventId: note.eventId,
							kind: 1,
							pubkey: note.pubkey,
							content: note.content,
							sensitive: undefined,
							contentWarning: undefined,
							createdAt: note.createdAt * 1000,
							replyToEventId: undefined,
							rootEventId: undefined,
							$author: {
								[EntityMetaKey.Selector]: { pubkey: note.pubkey },
							},
							$replyToNote: undefined,
							$rootNote: undefined,
							$$replies: [],
							$$reactions: [],
						}
					},
				}
			},
		})({
				eventId: (note) => note.eventId,
				kind: (note) => note.kind,
				pubkey: (note) => note.pubkey,
				content: (note) => note.content,
				sensitive: (note) => note.sensitive,
				contentWarning: (note) => note.contentWarning,
				createdAt: (note) => note.createdAt,
				replyToEventId: (note) => note.replyToEventId,
				rootEventId: (note) => note.rootEventId,
				$author: (note) => note.$author,
				$replyToNote: (note) => note.$replyToNote,
				$rootNote: (note) => note.$rootNote,
				$$replies: (note) => note.$$replies,
				$$reactions: (note) => note.$$reactions,
			}),

		defineResolver({
			entityType: EntityType.RedditNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						docsUrl: 'https://www.reddit.com/dev/api/',
						homeUrl: 'https://www.reddit.com',
						protocolName: 'Reddit data API',
					}),
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
			}),

		defineResolver({
			entityType: EntityType.RssNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						docsUrl: 'https://www.rssboard.org/rss-specification',
						homeUrl: 'https://www.rssboard.org',
						protocolName: 'RSS / Atom syndication',
						registryName: 'Seed feeds',
						relationshipModel: 'A configured feed directory with live item windows resolved from each feed URL.',
						$$rssFeeds: rssNetworkSeedFeeds.map((feed) => ({
							[EntityMetaKey.Selector]: {
								feedUrl: feed.feedUrl,
							},
						})),
					}),
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryName: (entity) => entity.registryName,
				relationshipModel: (entity) => entity.relationshipModel,
				$$rssFeeds: (entity) => entity.$$rssFeeds,
			}),

		defineResolver({
			entityType: EntityType.XNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						docsUrl: 'https://developer.x.com',
						homeUrl: 'https://x.com',
						protocolName: 'X (API v2)',
						registryName: 'Public profiles and posts',
						relationshipModel: 'Public X users and posts resolved from configured HTTP sources.',
					}),
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryName: (entity) => entity.registryName,
				relationshipModel: (entity) => entity.relationshipModel,
			}),

		defineResolver({
			entityType: EntityType.XmtpNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						docsUrl: 'https://docs.xmtp.org',
						homeUrl: 'https://xmtp.org',
						protocolName: 'XMTP (wallet messaging)',
						registryName: 'Local inbox state',
						relationshipModel: 'Local catalog conversations associated with provisioned wallet identities.',
					}),
				}
			},
		})({
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryName: (entity) => entity.registryName,
				relationshipModel: (entity) => entity.relationshipModel,
			}),

		defineResolver({
			entityType: EntityType.YoutubeNetwork,
			resolve: {
				Scope: {
					resolve: async () => ({
						docsUrl: 'https://developers.google.com/youtube/v3',
						homeUrl: 'https://www.youtube.com',
						protocolName: 'YouTube Data API',
					}),
				}
			},
			})({
					protocolName: (entity) => entity.protocolName,
					homeUrl: (entity) => entity.homeUrl,
					docsUrl: (entity) => entity.docsUrl,
				}),

			defineResolver({
				entityType: EntityType.YoutubeChannel,
				resolve: {
				ChannelId: {
					resolve: async ({ channelId }) => {
							const channel = youtubeNetworkSeedChannelByChannelId[channelId]
							if (channel == null) throw new Error(`Constants_Internal: YoutubeChannel ${channelId} not found`)

							return channel
						},
				}
				},
				})({
						title: (entity) => entity.title,
					}),

				defineResolver({
					entityType: EntityType.YoutubePlaylist,
				resolve: {
				PlaylistId: {
					resolve: async ({ playlistId }) => {
							const playlist = youtubeNetworkSeedPlaylistByPlaylistId[playlistId]
							if (playlist == null) throw new Error(`Constants_Internal: YoutubePlaylist ${playlistId} not found`)

							return {
								...playlist,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.YoutubePlaylist, [], '$channel')]: {
										[EntityMetaKey.Selector]: { channelId: playlist.channelId },
									},
								},
							}
						},
				}
				},
			})({
					title: (entity) => entity.title,
					$channel: (entity) => entity.$channel,
				}),

			defineResolver({
				entityType: EntityType.YoutubePlaylist,
				resolve: {
					PlaylistId: {
						resolve: async ({ playlistId }) => {
							const playlist = youtubeNetworkSeedPlaylistByPlaylistId[playlistId]
							if (playlist == null) throw new Error(`Constants_Internal: YoutubePlaylist ${playlistId} not found`)

							return [...youtubeNetworkSeedVideos]
								.filter((video) => video.channelId === playlist.channelId)
								.map((video) => ({
									[EntityMetaKey.Selector]: {
										videoId: video.videoId,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'title')]: video.title,
										[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'publishedAt')]: video.publishedAt,
										[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'publishedAtMs')]: video.publishedAtMs,
										[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'thumbnailUrl')]: video.thumbnailUrl,
										[entityFieldAddressKey(EntityType.YoutubeVideo, [], '$author')]: {
											[EntityMetaKey.Selector]: {
												channelId: video.channelId,
											},
										},
									},
								}))
						},
					},
				},
			})({
					$$videos: (entity) => entity,
				}),

			defineResolver({
				entityType: EntityType.YoutubeVideo,
				resolve: {
				VideoId: {
					resolve: async ({ videoId }) => {
							const video = youtubeNetworkSeedVideoByVideoId[videoId]
							if (video == null) throw new Error(`Constants_Internal: YoutubeVideo ${videoId} not found`)

							return video
						},
				}
				},
			})({
					title: (entity) => entity.title,
					publishedAt: (entity) => entity.publishedAt,
					publishedAtMs: (entity) => entity.publishedAtMs,
					thumbnailUrl: (entity) => entity.thumbnailUrl,
					$author: (entity) => entity.$author,
				}),

			defineResolver({
				entityType: EntityType._GlobalRedditNetwork,
				resolve: {
					Scope: {
						resolve: async ({ scope }) => ({
							scope,
						}),
					},
				},
			})({
					scope: (entity) => entity.scope,
				}),

			defineResolver({
				entityType: EntityType._GlobalRedditNetwork,
				resolve: {
					Scope: {
						resolve: async () => (
							[...redditNetworkSeedSubreddits].map((subreddit) => ({
								[EntityMetaKey.Selector]: {
									name: subreddit.name,
								},
							}))
						),
					},
				},
			})({
					$$observedSubreddits: (entity) => entity,
				}),

			defineResolver({
				entityType: EntityType._GlobalRedditNetwork,
				resolve: {
					Scope: {
						resolve: async () => (
							[...redditNetworkSeedLinks].map((link) => ({
								[EntityMetaKey.Selector]: {
									fullname: link.fullname,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.RedditLink, [], 'title')]: link.title,
									[entityFieldAddressKey(EntityType.RedditLink, [], 'permalink')]: link.permalink,
									[entityFieldAddressKey(EntityType.RedditLink, [], 'author')]: link.author,
									[entityFieldAddressKey(EntityType.RedditLink, [], 'createdAt')]: link.createdAt,
									[entityFieldAddressKey(EntityType.RedditLink, [], '$subreddit')]: {
										[EntityMetaKey.Selector]: {
											name: link.subredditName,
										},
									},
								},
							}))
						),
					},
				},
			})({
					$$observedLinks: (entity) => entity,
				}),

			defineResolver({
				entityType: EntityType._GlobalYoutubeNetwork,
				resolve: {
					Scope: {
						resolve: async () => (
							[...youtubeNetworkSeedChannels].map((channel) => ({
								[EntityMetaKey.Selector]: {
									channelId: channel.channelId,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.YoutubeChannel, [], 'title')]: channel.title,
								},
							}))
						),
					},
				},
			})({
					$$observedChannels: (entity) => entity,
				}),

			defineResolver({
				entityType: EntityType._GlobalYoutubeNetwork,
				resolve: {
					Scope: {
						resolve: async () => (
							[...youtubeNetworkSeedVideos].map((video) => ({
								[EntityMetaKey.Selector]: {
									videoId: video.videoId,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'title')]: video.title,
									[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'publishedAt')]: video.publishedAt,
									[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'publishedAtMs')]: video.publishedAtMs,
									[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'thumbnailUrl')]: video.thumbnailUrl,
									[entityFieldAddressKey(EntityType.YoutubeVideo, [], '$author')]: {
										[EntityMetaKey.Selector]: {
											channelId: video.channelId,
										},
									},
								},
							}))
						),
					},
				},
			})({
					$$observedVideos: {
						select: (videos) => videos,
						resolveCount: (videos) => videos.length,
					},
				}),

			defineResolver({
				entityType: EntityType._GlobalYoutubeNetwork,
				resolve: {
					Scope: {
						resolve: async () => (
							[...youtubeNetworkSeedPlaylists].map((playlist) => ({
								[EntityMetaKey.Selector]: {
									playlistId: playlist.playlistId,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.YoutubePlaylist, [], 'title')]: playlist.title,
									[entityFieldAddressKey(EntityType.YoutubePlaylist, [], '$channel')]: {
										[EntityMetaKey.Selector]: {
											channelId: playlist.channelId,
										},
									},
								},
							}))
						),
					},
				},
			})({
					$$observedPlaylists: (entity) => entity,
				}),

			defineResolver({
				entityType: EntityType._Global,
				resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
						[...networks].map((network) => ({
							[EntityMetaKey.Selector]: {
								slug: network.slug,
							},
						}))
					),
				}
			},
		})({
				$$networks: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
						Object.values(networkStackByNetworkStackId).map((networkStack) => ({
							[EntityMetaKey.Selector]: {
								networkStackId: networkStack.networkStackId,
							},
						}))
					),
				}
			},
		})({
				$$networkStacks: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
						const {
							networkUpgrades,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkConsensusUpgradeByChainIdAndUpgradeId,
						} = await import('$/constants/EthereumNetworkUpgrades.ts')
						return networkUpgrades.map((networkUpgrade) => (
							evmNetworkUpgradeEntityFromRow(
								networkUpgrade,
								networkExecutionUpgradeByChainIdAndUpgradeId,
								networkConsensusUpgradeByChainIdAndUpgradeId
						)
						))
					},
				}
			},
		})({
				$$networkUpgrades: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
						const namespace = network.namespace
						const coinId = networkNamespaceByNamespace[namespace].nativeAssetCoinId
						return {
							nativeCoin: {
								[EntityMetaKey.Selector]: {
									coinId,
								},
							},
							nativeCoinInstance: (
								namespace === NetworkNamespace.Evm ?
									{
										[EntityMetaKey.Selector]: {
										$network: {
											caip2,
										},
										type: CoinInstanceType.NativeCurrency,
									},
								}
								:
									undefined
							),
							nativeAssets: [
								{
									[EntityMetaKey.Selector]: {
										$network: {
											caip2,
										},
										kind: AssetInstanceKind.Native,
										assetKey: coinId,
									},
								},
							],
						}
					},
				},
				Slug: {
					resolve: async ({ slug }) => {
						const network = networkBySlug[slug]
						if (network == null)
							throw new Error('Constants_Internal: Network not found')
						const namespace = network.namespace
						const coinId = networkNamespaceByNamespace[namespace].nativeAssetCoinId
						if (coinId == null)
							throw new Error(`Constants_Internal: native asset not cataloged for ${namespace}`)
						return {
							nativeCoin: {
								[EntityMetaKey.Selector]: {
									coinId,
								},
							},
							nativeCoinInstance: (
								namespace === NetworkNamespace.Evm ?
									{
										[EntityMetaKey.Selector]: {
										$network: {
											caip2: network.caip2,
										},
										type: CoinInstanceType.NativeCurrency,
									},
								}
								:
									undefined
							),
						nativeAssets: [
							{
								[EntityMetaKey.Selector]: {
									$network: {
										slug,
									},
										kind: AssetInstanceKind.Native,
										assetKey: coinId,
									},
								},
							],
						}
					},
				},
			},
		})({
				Evm: {
					$nativeCoin: (entity) => entity.nativeCoin,
					$nativeCoinInstance: (entity) => entity.nativeCoinInstance,
				},
				$$nativeAssets: (entity) => entity.nativeAssets,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
						return networkResourceUrlEntitySelectors(
							network.slug,
							NetworkResourceKind.Faucet
						)
					},
				},
				Slug: {
					resolve: async ({ slug }) => {
						const network = networkBySlug[slug]
						return networkResourceUrlEntitySelectors(
							network.slug,
							NetworkResourceKind.Faucet
						)
					},
				},
			},
		})({
				$$faucetUrls: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
						return networkResourceUrlEntitySelectors(
							network.slug,
							NetworkResourceKind.BlockExplorer
						)
					},
				},
				Slug: {
					resolve: async ({ slug }) => {
						const network = networkBySlug[slug]
						return networkResourceUrlEntitySelectors(
							network.slug,
							NetworkResourceKind.BlockExplorer
						)
					},
				},
			},
		})({
				$$blockExplorerUrls: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Url,
			resolve: {
				Url: {
					resolve: async ({ url }) => ({
						url,
					}),
				},
			},
		})({
				url: (entity) => entity.url,
			}),

			defineResolver({
				entityType: EntityType._Global,
				resolve: {
					Scope: {
						resolve: async () => [],
					},
				},
			})({
				$$proposals: (proposals) => proposals,
			}),

			defineResolver({
				entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
						specificationRealms.map((realm) => ({
							[EntityMetaKey.Selector]: {
								realm: realm.id,
							},
						}))
					),
				}
			},
		})({
				$$specificationRealms: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
						proposalKinds.map((proposalKind) => ({
							[EntityMetaKey.Selector]: {
								realm: proposalKind.realm,
								category: proposalKind.category,
							},
						}))
					),
				}
			},
		})({
				$$proposalKinds: (entity) => entity,
			}),


		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
						const { coins } = await import('$/constants/Coin.ts')
						return (
							coins.map((coin) => (
								{
									[EntityMetaKey.Selector]: {
										coinId: coin.id,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.Coin, [], 'coinId')]: coin.id,
										...('name' in coin && {
											[entityFieldAddressKey(EntityType.Coin, [], 'name')]: coin.name,
										}),
										[entityFieldAddressKey(EntityType.Coin, [], 'symbol')]: coin.symbol,
									},
								}
							))
						)
					},
				}
			},
		})({
				$$coins: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
						marketVenues.map((marketVenue) => ({
							[EntityMetaKey.Selector]: {
								marketVenueId: marketVenue.id,
							},
						}))
					),
				}
			},
		})({
				$$marketVenues: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
						[...currencies].map((currency) => (
							{
								[EntityMetaKey.Selector]: {
									iso4217: currency.iso4217,
								},
							}
						))
					),
				}
			},
		})({
				$$currencies: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Currency,
			resolve: {
				Iso4217: {
					resolve: async (entitySelector: EntitySelector<typeof schema, EntityType.Currency>) => {
						const currency = currencyByIso4217[entitySelector.iso4217]
							if (currency == null)
								throw new Error(`Constants_Internal: Currency not found for ${entitySelector.iso4217}`)
						return [
							{
								[EntityMetaKey.Selector]: {
									$currency: entitySelector,
									timestampMs: currencyCatalogSnapshotTimestampMs,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.Currency_Timestamp, [], 'marketCap')]: BigInt(currency.marketCapUsd),
								},
							},
						]
					},
				}
			},
		})({
				$$timestamps: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
						const { coins } = await import('$/constants/Coin.ts')
						return (
							coins.map((coin) => (
							{
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coin.id]),
							}
							))
						)
					},
				}
			},
		})({
				$$markets: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => (
						[
							{
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId]),
							},
						]
					),
				}
			},
		})({
				$$marketsWithCoinAsBase: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => (
						(seededMarketsWithCoinAsQuoteByQuoteCoinId[coinId] ).map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCoinMarket(catalogMarket),
						}))
					),
				}
			},
		})({
				$$marketsWithCoinAsQuote: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Currency,
			resolve: {
				Iso4217: {
					resolve: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => (
						(seededMarketsWithCurrencyAsBaseByIso4217[iso4217] ?? []).map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
						}))
					),
				}
			},
		})({
				$$marketsWithCurrencyAsBase: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Currency,
			resolve: {
				Iso4217: {
					resolve: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => [
						...(
							iso4217 === Iso4217.USD ?
								seededCoinSpotUsdMarkets.map((catalogMarket) => ({
									[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogMarket),
								}))
							:
								[]
						),
						...seededSpotMarketsWithCurrencyAsBase
							.filter((catalogMarket) => catalogMarket.quoteIso4217 === iso4217)
							.map((catalogMarket) => ({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
							})),
					],
				}
			},
		})({
				$$marketsWithCurrencyAsQuote: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => (
						coinId !== CoinId.ETH ?
							[]
						:
							Object.keys(ethNativeCoinInstanceRepresentationByChainId).map((chainId) => ({
								[EntityMetaKey.Selector]: {
									$network: {
										caip2: {
											namespace: 'eip155' as const,
											reference: chainId,
										},
									},
									type: CoinInstanceType.NativeCurrency as const,
								},
							}))
					),
				}
			},
		})({
				$$coinInstances: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.MarketAsset,
			resolve: {
				KindAssetKey: {
					resolve: async ({ kind, assetKey }: EntitySelector<typeof schema, EntityType.MarketAsset>) => {
						const coin = kind === MarketAssetKind.Coin ? coins.find((row) => row.id === assetKey) : undefined
						const currency = kind === MarketAssetKind.Currency ? currencies.find((row) => row.iso4217 === assetKey) : undefined
						if (kind === MarketAssetKind.Coin && coin == null)
							throw new Error(`Constants_Internal: Coin market asset not found for ${assetKey}`)
						if (kind === MarketAssetKind.Currency && currency == null)
							throw new Error(`Constants_Internal: Currency market asset not found for ${assetKey}`)

						return {
							kind,
							assetKey,
							...(coin != null && {
								$coin: {
									[EntityMetaKey.Selector]: {
										coinId: coin.id,
									},
								},
							}),
							...(currency != null && {
								$currency: {
									[EntityMetaKey.Selector]: {
										iso4217: currency.iso4217,
									},
								},
							}),
						}
					},
				}
			},
		})({
				kind: (entity) => entity.kind,
				assetKey: (entity) => entity.assetKey,
				Coin: {
					$coin: (entity) => entity.$coin,
				},
				Currency: {
					$currency: (entity) => entity.$currency,
				},
			}),

		defineResolver({
			entityType: EntityType.Market,
			resolve: {
				BaseQuoteMarketVenueKind: {
					resolve: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>) => (
						isSeededCoinCurrencyMarket(entitySelector) ?
							{
								[EntityMetaKey.Selector]: {
									coinId: entitySelector.$base.assetKey,
								},
							}
						:
							undefined
					),
				}
			},
		})({
				$baseCoin: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Market,
			resolve: {
				BaseQuoteMarketVenueKind: {
					resolve: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>) => (
						(
							entitySelector.$base.kind === MarketAssetKind.Coin
						&& isSeededCoinCurrencyMarket(entitySelector)
						) ?
							[
								{
									[EntityMetaKey.Selector]: {
										$market: entitySelector,
									},
								},
							]
						:
							[]
					),
				}
			},
		})({
				$$marketPrices: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }: EntitySelector<typeof schema, EntityType.MarketPrice>) => (
						{
							[EntityMetaKey.Selector]: $market,
						}
					),
				}
			},
		})({
				$parentMarket: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				MarketTimeIntervalTimestampMs: {
					resolve: async ({ $market }) => ({
						[EntityMetaKey.Selector]: $market,
					}),
				}
			},
		})({
			$parentMarket: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async ({ slug }) => {
						const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
						const network = networkBySlug[slug]
						if (!('caip2' in network))
							return []

						const caip2 = network.caip2
						const chainId = Number(caip2.reference)
						return (
							mevRelayHosts
								.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
								.map((mevRelayHost) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										host: mevRelayHost.host,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.MevRelay, [], 'url')]: `https://${mevRelayHost.host}`,
									},
								}))
						)
					},
				},
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
						const chainId = Number(caip2.reference)
						return (
							mevRelayHosts
								.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
								.map((mevRelayHost) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										host: mevRelayHost.host,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.MevRelay, [], 'url')]: `https://${mevRelayHost.host}`,
									},
								}))
						)
					},
				}
			},
		})({
				Evm: {
					$$mevRelays: (entity) => entity,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async ({ slug }) => {
						const {
							networkUpgradesByChainId,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkConsensusUpgradeByChainIdAndUpgradeId,
						} = await import('$/constants/EthereumNetworkUpgrades.ts')
						const network = networkBySlug[slug]
						if (!('caip2' in network))
							return []

						return (networkUpgradesByChainId[Number(network.caip2.reference)] ?? [])
							.map((networkUpgrade) => (
								evmNetworkUpgradeEntityFromRow(
									networkUpgrade,
									networkExecutionUpgradeByChainIdAndUpgradeId,
									networkConsensusUpgradeByChainIdAndUpgradeId
								)
							))
					},
				},
				Caip2: {
					resolve: async ({ caip2 }) => {
						const {
							networkUpgradesByChainId,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkConsensusUpgradeByChainIdAndUpgradeId,
						} = await import('$/constants/EthereumNetworkUpgrades.ts')
						return (networkUpgradesByChainId[Number(caip2.reference)] ?? [])
							.map((networkUpgrade) => (
								evmNetworkUpgradeEntityFromRow(
									networkUpgrade,
									networkExecutionUpgradeByChainIdAndUpgradeId,
									networkConsensusUpgradeByChainIdAndUpgradeId
								)
							))
					},
				}
			},
		})({
				Evm: {
					$$upgrades: (entity) => entity,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async ({ slug }) => {
						const { networkExecutionUpgradesByChainId } = await import('$/constants/EthereumNetworkUpgrades.ts')
						const network = networkBySlug[slug]
						if (!('caip2' in network))
							return []

						return (
							networkExecutionUpgradesByChainId[Number(network.caip2.reference)] ?? []
						)
							.map(evmNetworkExecutionUpgradeEntityFromRow)
					},
				},
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { networkExecutionUpgradesByChainId } = await import('$/constants/EthereumNetworkUpgrades.ts')
						return (
							networkExecutionUpgradesByChainId[Number(caip2.reference)] ?? []
						)
							.map(evmNetworkExecutionUpgradeEntityFromRow)
					},
				}
			},
		})({
				Evm: {
					$$executionUpgrades: (entity) => entity,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async ({ slug }) => {
						const { networkConsensusUpgradesByChainId } = await import('$/constants/EthereumNetworkUpgrades.ts')
						const network = networkBySlug[slug]
						if (!('caip2' in network))
							return []

						return (
							networkConsensusUpgradesByChainId[Number(network.caip2.reference)] ?? []
						)
							.map(evmNetworkConsensusUpgradeEntityFromRow)
					},
				},
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { networkConsensusUpgradesByChainId } = await import('$/constants/EthereumNetworkUpgrades.ts')
						return (
							networkConsensusUpgradesByChainId[Number(caip2.reference)] ?? []
						)
							.map(evmNetworkConsensusUpgradeEntityFromRow)
					},
				}
			},
		})({
				Evm: {
					$$consensusUpgrades: (entity) => entity,
				},
			}),

					defineResolver({
					entityType: EntityType.AtprotoPost,
					resolve: {
						Uri: {
							resolve: async ({ uri }) => {
								const post = atprotoNetworkSeedPostByUri[uri]
								if (post == null) throw new Error(`Constants_Internal: AtprotoPost ${uri} not found`)

								return {
									...post,
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.AtprotoPost, [], '$author')]: {
											[EntityMetaKey.Selector]: { did: post.authorDid },
										},
									},
								}
							},
						}
					},
				})({
						uri: (entity) => entity.uri,
						$author: (entity) => entity.$author,
					}),
		defineResolver({
			entityType: EntityType.RedditSubreddit,
			resolve: {
				Name: {
					resolve: async ({ name }) => {
						const subreddit = redditNetworkSeedSubreddits.find((seedSubreddit) => seedSubreddit.name === name)
						if (subreddit == null)
							throw new Error('Constants_Internal: RedditSubreddit seed not found')

						return subreddit
					},
				}
			},
		})({
				name: (subreddit) => subreddit.name,
			}),

		defineResolver({
			entityType: EntityType.RedditSubreddit,
			resolve: {
				Name: {
					resolve: async ({ name }) => (
						[...redditNetworkSeedLinks]
							.filter((link) => link.subredditName === name)
							.map((link) => ({
								[EntityMetaKey.Selector]: {
									fullname: link.fullname,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.RedditLink, [], 'title')]: link.title,
									[entityFieldAddressKey(EntityType.RedditLink, [], 'permalink')]: link.permalink,
									[entityFieldAddressKey(EntityType.RedditLink, [], 'author')]: link.author,
									[entityFieldAddressKey(EntityType.RedditLink, [], 'createdAt')]: link.createdAt,
									[entityFieldAddressKey(EntityType.RedditLink, [], '$subreddit')]: {
										[EntityMetaKey.Selector]: {
											name: link.subredditName,
										},
									},
								},
							}))
					),
				},
			},
		})({
				$$links: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.RedditLink,
			resolve: {
				Fullname: {
					resolve: async ({ fullname }) => {
						const link = redditNetworkSeedLinks.find((seedLink) => seedLink.fullname === fullname)
						if (link == null)
							throw new Error('Constants_Internal: RedditLink seed not found')

						return {
							fullname: link.fullname,
							title: link.title,
							permalink: link.permalink,
							author: link.author,
							createdAt: link.createdAt,
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.RedditLink, [], '$subreddit')]: {
									[EntityMetaKey.Selector]: { name: link.subredditName },
								},
							},
						}
					},
				}
			},
		})({
				fullname: (link) => link.fullname,
				title: (link) => link.title,
				permalink: (link) => link.permalink,
				author: (link) => link.author,
				createdAt: (link) => link.createdAt,
				$subreddit: (link) => link.$subreddit,
			}),

		defineResolver({
			entityType: EntityType.RedditLink,
			resolve: {
				Fullname: {
					resolve: async ({ fullname }) => (
						[...redditNetworkSeedComments]
							.filter((comment) => comment.linkFullname === fullname)
							.map((comment) => ({
								[EntityMetaKey.Selector]: {
									fullname: comment.fullname,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.RedditComment, [], 'body')]: comment.body,
									[entityFieldAddressKey(EntityType.RedditComment, [], 'author')]: comment.author,
									[entityFieldAddressKey(EntityType.RedditComment, [], 'createdAt')]: comment.createdAt,
									[entityFieldAddressKey(EntityType.RedditComment, [], '$link')]: {
										[EntityMetaKey.Selector]: {
											fullname: comment.linkFullname,
										},
									},
								},
							}))
					),
				},
			},
		})({
				$$comments: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.RedditComment,
			resolve: {
				Fullname: {
					resolve: async ({ fullname }) => {
						const comment = redditNetworkSeedComments.find((seedComment) => seedComment.fullname === fullname)
						if (comment == null)
							throw new Error('Constants_Internal: RedditComment seed not found')

						return {
							fullname: comment.fullname,
							body: comment.body,
							author: comment.author,
							createdAt: comment.createdAt,
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.RedditComment, [], '$link')]: {
									[EntityMetaKey.Selector]: { fullname: comment.linkFullname },
								},
							},
						}
					},
				}
			},
		})({
				fullname: (comment) => comment.fullname,
				body: (comment) => comment.body,
				author: (comment) => comment.author,
				createdAt: (comment) => comment.createdAt,
				$link: (comment) => comment.$link,
			}),

		defineResolver({
			entityType: EntityType.XPost,
			resolve: {
				Id: {
					resolve: ({ id }) => ({ id }),
				}
			},
		})({
			id: (entity) => entity.id,
			postUrl: (entity) => `https://x.com/i/web/status/${entity.id}`,
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Constants_Internal: EvmContract address not normalized')
						const chainPrecompiles = (
							precompilesByChainId[Number($network.caip2.reference)]
						?? standardPrecompiles
						)
						return chainPrecompiles.find((precompile) => (
							precompile.address.toLowerCase() === address.toLowerCase()
						))?.name
					},
				}
			},
		})({
				precompileName: (entity) => entity,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const limit = resolverContextRowLimit(context)
						return (
							precompilesByChainId[Number(caip2.reference)]
						?? standardPrecompiles
						)
							.slice(0, limit)
							.flatMap((precompile) => {
							const address = hexLowerOfByteSize(precompile.address, 20)
							return address == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										address,
									},
								}]
							})
					},
				}
			},
		})({
				Evm: {
					$$precompiles: {
						select: (precompiles) => precompiles,
						resolveCount: (precompiles) => precompiles.length,
					},
				},
			}),
	],
} satisfies RegisteredSourceResolverModule
