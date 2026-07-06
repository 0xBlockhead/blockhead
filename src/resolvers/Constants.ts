import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	bridgeToolByKey,
	type BridgeToolRow,
	CoinInstanceRepresentation,
} from '$/constants/Bridge.ts'
import { ChainId } from '$/constants/ChainId.ts'
import { CoinId } from '$/constants/Coin.ts'
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
	marketOhlcDailyTimeInterval,
	type MarketIdLabelInput,
} from '$/constants/Market.ts'
import {
	localCatalogCoinSpotUsdMarkets,
	localCatalogCoinSpotUsdMarketByCoinId,
	localCatalogMarketsWithCoinAsQuoteByQuoteCoinId,
	localCatalogMarketsWithCurrencyAsBaseByIso4217,
	localCatalogSpotMarketsWithCoinAsQuote,
	localCatalogSpotMarketsWithCurrencyAsBase,
	type CatalogCoinCoinMarket,
	type CatalogCoinCurrencyMarket,
	type CatalogCurrencyCurrencyMarket,
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
	networkStackByNetworkStackId,
} from '$/constants/NetworkStack.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
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
import {
	xNetworkSeedPostById,
	xNetworkSeedUsers,
} from '$/constants/Social/X.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import type { EntitySelector, EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { Entity } from '$/schema/$schema.ts'
import {
	precompilesByChainId,
} from '$/constants/precompiles/index.ts'
import { standardPrecompiles } from '$/constants/precompiles/standard.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { EthereumNetworkUpgradeSelector } from '$/schema/EthereumNetworkUpgrade.ts'
import { EthereumExecutionUpgradeSelector } from '$/schema/EthereumExecutionUpgrade.ts'
import { EthereumConsensusUpgradeSelector } from '$/schema/EthereumConsensusUpgrade.ts'
import { CurrencySelector } from '$/schema/Currency.ts'
import { Currency_TimestampSelector } from '$/schema/Currency_Timestamp.ts'
import { MarketSelector } from '$/schema/Market.ts'
import { MarketVenueSelector } from '$/schema/MarketVenue.ts'
import { EvmContractSelector } from '$/schema/EvmContract.ts'
import { EvmProtocolSelector } from '$/schema/EvmProtocol.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { EvmCoinInstanceSelector } from '$/schema/EvmCoinInstance.ts'
import { CoinBridgeCapabilitySelector } from '$/schema/CoinBridgeCapability.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'
import { Market_TimeInterval_TimestampSelector } from '$/schema/Market_TimeInterval_Timestamp.ts'
import { UrlSelector } from '$/schema/Url.ts'
import { MevRelaySelector } from '$/schema/MevRelay.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { NetworkStackSelector } from '$/schema/NetworkStack.ts'
import { NearNetworkSelector } from '$/schema/NearNetwork.ts'
import { ZeroGNetworkSelector } from '$/schema/ZeroGNetwork.ts'
import { SolanaNetworkSelector } from '$/schema/SolanaNetwork.ts'
import { ElementsNetworkSelector } from '$/schema/ElementsNetwork.ts'
import { AssetInstanceSelector } from '$/schema/AssetInstance.ts'
import { BittensorSubnetSelector } from '$/schema/BittensorSubnet.ts'
import { NetworkUpgradeSelector } from '$/schema/NetworkUpgrade.ts'
import { CosmosGovernanceProposalSelector } from '$/schema/CosmosGovernanceProposal.ts'
import { PolkadotReferendumSelector } from '$/schema/PolkadotReferendum.ts'
import { ActivityPubNetworkSelector } from '$/schema/ActivityPubNetwork.ts'
import { AtprotoNetworkSelector } from '$/schema/AtprotoNetwork.ts'
import { AtprotoPostSelector } from '$/schema/AtprotoPost.ts'
import { _GlobalAtprotoNetworkSelector } from '$/schema/_GlobalAtprotoNetwork.ts'
import { FarcasterNetworkSelector } from '$/schema/FarcasterNetwork.ts'
import { IpfsProtocolSelector } from '$/schema/IpfsProtocol.ts'
import { SwarmProtocolSelector } from '$/schema/SwarmProtocol.ts'
import { LensNetworkSelector } from '$/schema/LensNetwork.ts'
import { _GlobalNostrNetworkSelector } from '$/schema/_GlobalNostrNetwork.ts'
import { NostrNoteSelector } from '$/schema/NostrNote.ts'
import { NostrProfileSelector } from '$/schema/NostrProfile.ts'
import { NostrRelaySelector } from '$/schema/NostrRelay.ts'
import { RedditNetworkSelector } from '$/schema/RedditNetwork.ts'
import { RedditLinkSelector } from '$/schema/RedditLink.ts'
import { RedditSubredditSelector } from '$/schema/RedditSubreddit.ts'
import { RedditCommentSelector } from '$/schema/RedditComment.ts'
import { RssNetworkSelector } from '$/schema/RssNetwork.ts'
import { XNetworkSelector } from '$/schema/XNetwork.ts'
import { XPostSelector } from '$/schema/XPost.ts'
import { XmtpNetworkSelector } from '$/schema/XmtpNetwork.ts'
import { YoutubeChannelSelector } from '$/schema/YoutubeChannel.ts'
import { YoutubeNetworkSelector } from '$/schema/YoutubeNetwork.ts'
import { _GlobalYoutubeNetworkSelector } from '$/schema/_GlobalYoutubeNetwork.ts'
import { _GlobalRedditNetworkSelector } from '$/schema/_GlobalRedditNetwork.ts'
import { YoutubePlaylistSelector } from '$/schema/YoutubePlaylist.ts'
import { YoutubeVideoSelector } from '$/schema/YoutubeVideo.ts'
import { _GlobalEnsNetworkSelector } from '$/schema/_GlobalEnsNetwork.ts'
import { SpecificationProposalKindSelector } from '$/schema/SpecificationProposalKind.ts'
import { SpecificationRealmSelector } from '$/schema/SpecificationRealm.ts'

const nativeAssetCoinIdByNamespace = {
	[NetworkNamespace.Bittensor]: CoinId.TAO,
	[NetworkNamespace.Bitcoin]: CoinId.BTC,
	[NetworkNamespace.BitcoinCash]: CoinId.BCH,
	[NetworkNamespace.Cosmos]: CoinId.ATOM,
	[NetworkNamespace.Dogecoin]: CoinId.DOGE,
	[NetworkNamespace.Elements]: CoinId.BTC,
	[NetworkNamespace.Evm]: CoinId.ETH,
	[NetworkNamespace.Filecoin]: CoinId.FIL,
	[NetworkNamespace.Hyperliquid]: CoinId.HYPE,
	[NetworkNamespace.Lightning]: undefined,
	[NetworkNamespace.Litecoin]: CoinId.LTC,
	[NetworkNamespace.Logos]: undefined,
	[NetworkNamespace.Monero]: CoinId.XMR,
	[NetworkNamespace.Near]: CoinId.NEAR,
	[NetworkNamespace.Polkadot]: CoinId.DOT,
	[NetworkNamespace.Quilibrium]: CoinId.QUIL,
	[NetworkNamespace.Solana]: CoinId.SOL,
	[NetworkNamespace.Tron]: CoinId.TRX,
	[NetworkNamespace.Zcash]: CoinId.ZEC,
	[NetworkNamespace.ZeroG]: CoinId._0G,
} as const satisfies Record<NetworkNamespace, CoinId | undefined>

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

const marketSelectorFromCatalogCoinCurrencyMarket = (catalogMarket: CatalogCoinCurrencyMarket) => ({
	$base: {
		kind: MarketAssetKind.Coin,
		$coin: { coinId: catalogMarket.baseCoinId },
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: catalogMarket.quoteIso4217 },
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies MarketIdLabelInput

const catalogCoinCurrencyMarketMatchesMarket = (
	catalogMarket: CatalogCoinCurrencyMarket,
	market: EntitySelector<typeof schema, EntityType.Market>
) => (
	market.marketKind === catalogMarket.marketKind
	&& market.$marketVenue.marketVenueId === catalogMarket.marketVenueId
	&& market.$base.kind === MarketAssetKind.Coin
	&& market.$base.$coin.coinId === catalogMarket.baseCoinId
	&& market.$quote.kind === MarketAssetKind.Currency
	&& market.$quote.$currency.iso4217 === catalogMarket.quoteIso4217
)

const ethNativeCoinInstanceRepresentationByChainId = {
	[ChainId.Ethereum]: CoinInstanceRepresentation.IssuerNative,
	[ChainId.Optimism]: CoinInstanceRepresentation.CanonicalL2Native,
	[ChainId.Arbitrum]: CoinInstanceRepresentation.CanonicalL2Native,
	[ChainId.Base]: CoinInstanceRepresentation.CanonicalL2Native,
} as const

const marketSelectorFromCatalogCoinCoinMarket = (catalogMarket: CatalogCoinCoinMarket) => ({
	$base: {
		kind: MarketAssetKind.Coin,
		$coin: { coinId: catalogMarket.baseCoinId },
	},
	$quote: {
		kind: MarketAssetKind.Coin,
		$coin: { coinId: catalogMarket.quoteCoinId },
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies MarketIdLabelInput

const marketSelectorFromCatalogCurrencyCurrencyMarket = (catalogMarket: CatalogCurrencyCurrencyMarket) => ({
	$base: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: catalogMarket.baseIso4217 },
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: catalogMarket.quoteIso4217 },
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies MarketIdLabelInput

const evmNetworkUpgradeSelector = (row: {
	readonly chainId: number
	readonly upgradeId: string
}) => ({
	$network: {
		caip2: ({
			namespace: 'eip155',
			reference: String(row.chainId),
		}) satisfies EntitySelectorForSelectorName<typeof schema, EntityType.EvmNetwork, EvmNetworkSelector.Caip2>['caip2'],
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
		...(proposals.length > 0 && { $$proposals: proposals }),
		[EntityMetaKey.Selector]: evmNetworkUpgradeSelector(networkUpgrade),
	}
}


const coinDecimalsByCoinId = new Map([
	[CoinId.AAVE, 18],
	[CoinId.ADA, 6],
	[CoinId.APT, 8],
	[CoinId.ARB, 18],
	[CoinId.AVAX, 18],
	[CoinId.BCH, 8],
	[CoinId.BNB, 18],
	[CoinId.BTC, 8],
	[CoinId.CELO, 18],
	[CoinId.DAI, 18],
	[CoinId.DOGE, 8],
	[CoinId.DOT, 10],
	[CoinId.ETH, 18],
	[CoinId.ETC, 18],
	[CoinId.FIL, 18],
	[CoinId.HBAR, 8],
	[CoinId.LINK, 18],
	[CoinId.LTC, 8],
	[CoinId.OP, 18],
	[CoinId.POL, 18],
	[CoinId.SEI, 18],
	[CoinId.SHIB, 18],
	[CoinId.SOL, 9],
	[CoinId.STETH, 18],
	[CoinId.SUI, 9],
	[CoinId.TON, 9],
	[CoinId.TRX, 6],
	[CoinId.UNI, 18],
	[CoinId.USDC, 6],
	[CoinId.USDT, 6],
	[CoinId.WBTC, 8],
	[CoinId.XDC, 18],
	[CoinId.XLM, 7],
	[CoinId.XMR, 12],
	[CoinId.XRP, 6],
	[CoinId.ZEC, 8],
])


export default {
	source: Source.Constants_Internal,

	resolvers: [
		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumNetworkUpgrade,
			resolve: {
				[EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
					const {
						networkUpgrades,
						networkExecutionUpgrades,
						networkConsensusUpgrades,
					} = await import(
						'$/constants/EthereumNetworkUpgrades.ts'
					)
					const networkUpgrade = networkUpgrades.find((candidate) => (
						String(candidate.chainId) === $network.caip2.reference
						&& candidate.upgradeId === upgradeId
					))
					if (networkUpgrade == null)
						throw new Error(`Constants_Internal: NetworkUpgrade ${$network.caip2.reference}:${upgradeId} not found`)

					const linkedNetworkExecutionUpgrade = networkExecutionUpgrades.find((candidate) => (
						candidate.chainId === networkUpgrade.chainId
						&& candidate.upgradeId === networkUpgrade.executionUpgradeId
					))
					if (linkedNetworkExecutionUpgrade == null)
						throw new Error(`Constants_Internal: linked execution upgrade not found for ${$network.caip2.reference}:${upgradeId}`)

					const linkedNetworkConsensusUpgrade = (
						networkUpgrade.consensusUpgradeId == null ?
							undefined
						:
							networkConsensusUpgrades.find((candidate) => (
								candidate.chainId === networkUpgrade.chainId
								&& candidate.upgradeId === networkUpgrade.consensusUpgradeId
							))
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
				[EthereumNetworkUpgradeSelector.EvmNetworkSlug]: async ({ $network, slug }) => {
					const {
						networkUpgradeByChainIdAndRouteSegment,
						networkExecutionUpgrades,
						networkConsensusUpgrades,
					} = await import(
						'$/constants/EthereumNetworkUpgrades.ts'
					)
					const networkUpgrade = networkUpgradeByChainIdAndRouteSegment[`${$network.caip2.reference}:${slug}`]
					if (networkUpgrade == null)
						throw new Error(`Constants_Internal: NetworkUpgrade ${$network.caip2.reference}:${slug} not found`)

					const linkedNetworkExecutionUpgrade = networkExecutionUpgrades.find((candidate) => (
						candidate.chainId === networkUpgrade.chainId
						&& candidate.upgradeId === networkUpgrade.executionUpgradeId
					))
					if (linkedNetworkExecutionUpgrade == null)
						throw new Error(`Constants_Internal: linked execution upgrade not found for ${$network.caip2.reference}:${slug}`)

					const linkedNetworkConsensusUpgrade = (
						networkUpgrade.consensusUpgradeId == null ?
							undefined
						:
							networkConsensusUpgrades.find((candidate) => (
								candidate.chainId === networkUpgrade.chainId
								&& candidate.upgradeId === networkUpgrade.consensusUpgradeId
							))
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
		})({
			fields: {
				name: (upgrade) => upgrade.name,
				slug: (upgrade) => upgrade.slug,
				activationBlock: (upgrade) => upgrade.activationBlock,
				activationTimestampMs: (upgrade) => upgrade.activationTimestampMs,
				activationEpoch: (upgrade) => upgrade.activationEpoch,
				$networkExecutionUpgrade: (upgrade) => {
					return {
						[EntityMetaKey.Selector]: evmNetworkUpgradeSelector({
							chainId: upgrade.chainId,
							upgradeId: upgrade.executionUpgradeId,
						}),
					}
				},
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
				$$proposals: (upgrade) => upgrade.$$proposals.map((proposal) => ({
					[EntityMetaKey.Selector]: proposal[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumExecutionUpgrade,
			resolve: {
				[EthereumExecutionUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
					const { networkExecutionUpgrades } = await import(
						'$/constants/EthereumNetworkUpgrades.ts'
					)
					const networkExecutionUpgrade = networkExecutionUpgrades.find((candidate) => (
						String(candidate.chainId) === $network.caip2.reference
						&& candidate.upgradeId === upgradeId
					))
					if (networkExecutionUpgrade == null)
						throw new Error(`Constants_Internal: ExecutionUpgrade ${$network.caip2.reference}:${upgradeId} not found`)

					return {
						...networkExecutionUpgrade,
						$$proposals: ethereumProposalRefs(networkExecutionUpgrade.proposalIds),
					}
				},
				[EthereumExecutionUpgradeSelector.EvmNetworkSlug]: async ({ $network, slug }) => {
					const { networkExecutionUpgradeByChainIdAndRouteSegment } = await import(
						'$/constants/EthereumNetworkUpgrades.ts'
					)
					const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndRouteSegment[`${$network.caip2.reference}:${slug}`]

					return {
						...networkExecutionUpgrade,
						$$proposals: ethereumProposalRefs(networkExecutionUpgrade.proposalIds),
					}
				},
			},
		})({
			fields: {
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
				$$proposals: (upgrade) => upgrade.$$proposals.map((proposal) => ({
					[EntityMetaKey.Selector]: proposal[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				[EthereumConsensusUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
					const { networkConsensusUpgrades } = await import(
						'$/constants/EthereumNetworkUpgrades.ts'
					)
					const networkConsensusUpgrade = networkConsensusUpgrades.find((candidate) => (
						String(candidate.chainId) === $network.caip2.reference
						&& candidate.upgradeId === upgradeId
					))
					if (networkConsensusUpgrade == null)
						throw new Error(`Constants_Internal: ConsensusUpgrade ${$network.caip2.reference}:${upgradeId} not found`)

					return {
						...networkConsensusUpgrade,
						$$proposals: ethereumProposalRefs(networkConsensusUpgrade.proposalIds),
					}
				},
				[EthereumConsensusUpgradeSelector.EvmNetworkSlug]: async ({ $network, slug }) => {
					const { networkConsensusUpgrades } = await import(
						'$/constants/EthereumNetworkUpgrades.ts'
					)
					const networkConsensusUpgrade = networkConsensusUpgrades.find((candidate) => (
						String(candidate.chainId) === $network.caip2.reference
						&& [
							candidate.upgradeId,
							candidate.slug,
							candidate.upgradeId.toLowerCase(),
							candidate.slug.toLowerCase(),
						].includes(slug)
					))
					if (networkConsensusUpgrade == null)
						throw new Error(`Constants_Internal: ConsensusUpgrade ${$network.caip2.reference}:${slug} not found`)

					return {
						...networkConsensusUpgrade,
						$$proposals: ethereumProposalRefs(networkConsensusUpgrade.proposalIds),
					}
				},
			},
		})({
			fields: {
				name: (upgrade) => upgrade.name,
				slug: (upgrade) => upgrade.slug,
				activationBlock: (upgrade) => upgrade.activationBlock,
				activationTimestampMs: (upgrade) => upgrade.activationTimestampMs,
				activationEpoch: (upgrade) => upgrade.activationEpoch,
				protocol: (upgrade) => upgrade.protocol,
				linkEthereumOrg: (upgrade) => upgrade.linkEthereumOrg,
				linkConsensusDocs: (upgrade) => upgrade.linkConsensusDocs,
				linkForkcast: (upgrade) => upgrade.linkForkcast,
				$$proposals: (upgrade) => upgrade.$$proposals.map((proposal) => ({
					[EntityMetaKey.Selector]: proposal[EntityMetaKey.Selector],
				})),
			},
		}),


		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }) => {
					const currency = currencyByIso4217[iso4217]
					if (currency == null)
						throw new Error(`Constants_Internal: Currency not found for ${iso4217}`)
					return {
						name: currency.name,
						symbol: currency.symbol,
						minorUnitExponent: currency.minorUnitExponent,
					}
				}
			},
		})({
			fields: {
				name: (currency) => currency.name,
				symbol: (currency) => currency.symbol,
				minorUnitExponent: (currency) => currency.minorUnitExponent,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Currency_Timestamp,
			resolve: {
				[Currency_TimestampSelector.CurrencyTimestampMs]: async ({ $currency, timestampMs }) => {
					const currency = currencyByIso4217[$currency.iso4217]
					if (currency == null)
						throw new Error(`Constants_Internal: Currency not found for ${$currency.iso4217}`)
					if (timestampMs !== currencyCatalogSnapshotTimestampMs)
						throw new Error(`Constants_Internal: Currency snapshot not found for ${$currency.iso4217}:${String(timestampMs)}`)
					return {
						marketCap: BigInt(currency.marketCapUsd),
					}
				}
			},
		})({
			fields: {
				marketCap: (currencyTimestamp) => currencyTimestamp.marketCap,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
					const address = hexLowerOfByteSize(addressSelector, 20)
					if (address == null)
						throw new Error('Constants_Internal: EvmContract address not normalized')
					const chainPrecompiles = (
						precompilesByChainId[Number($network.caip2.reference)]
					?? standardPrecompiles
					)
					const precompileName = chainPrecompiles.find((precompile) => (
						precompile.address.toLowerCase() === address.toLowerCase()
					))?.name
					if (precompileName == null)
						throw new Error(`Constants_Internal: EvmContract ${address} is not a catalog precompile on chain ${String(Number($network.caip2.reference))}`)
					return {
						precompileName,
					}
				}
			},
		})({
			fields: {
				precompileName: (contract) => contract.precompileName,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }) => {
					const { coinById } = await import('$/constants/Coin.ts')
					const coin = coinById[coinId]
					return {
						name: coin.symbol,
						symbol: coin.symbol,
					}
				}
			},
		})({
			fields: {
				name: (coin) => coin.name,
				symbol: (coin) => coin.symbol,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Coin,
			resolve: {
					[CoinSelector.CoinId]: async ({ coinId }) => {
						const decimals = coinDecimalsByCoinId.get(coinId)
						if (decimals != null)
							return { decimals }

						throw new Error(`Constants_Internal: Coin ${coinId} decimals not in catalog`)
					}
				},
		})({
			fields: {
				decimals: (coin) => coin.decimals,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async ({ $network, type }) => {
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
					}
				},
				[EvmCoinInstanceSelector.NetworkTypeContract]: async ({ $network, type }) => {
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
					}
				},
			},
		})({
			fields: {
				coinId: (coinInstance) => coinInstance.coinId,
				name: (coinInstance) => coinInstance.name,
				symbol: (coinInstance) => coinInstance.symbol,
				decimals: (coinInstance) => coinInstance.decimals,
				representation: (coinInstance) => coinInstance.representation,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.CoinBridgeCapability,
			resolve: {
				[CoinBridgeCapabilitySelector.EvmCoinInstanceEvmCoinInstanceToolKey]: async ({ toolKey }): Promise<{ toolKey: string } & Omit<BridgeToolRow, 'key'>> => {
					const coinBridgeCapabilityFields = bridgeToolByKey[toolKey]
					if (coinBridgeCapabilityFields == null)
						throw new Error(`Constants_Internal: unknown LI.FI tool key ${toolKey}`)
					return {
						toolKey: coinBridgeCapabilityFields.key,
						...coinBridgeCapabilityFields,
					}
				}
			},
		})({
			fields: {
				toolKey: (capability) => capability.toolKey,
				railId: (capability) => capability.railId,
				settlementModel: (capability) => capability.settlementModel,
				verificationModel: (capability) => capability.verificationModel,
				assetOutcome: (capability) => capability.assetOutcome,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Slug]: async ({ slug }) => {
					const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
					const network = networkBySlug[slug]
					const beaconRestBase = beaconRestBaseByExecutionChainId[Number(network.caip2.reference)]
					return {
						slug: network.slug,
						name: network.name,
						caip2: network.caip2,
						namespace: network.namespace,
						environment: network.environment,
						consensusEndpoints: (
							beaconRestBase == null ?
								[]
							:
								[
									{
										restBaseUrl: beaconRestBase.restBaseUrl,
										consensusProtocol: beaconRestBase.consensusProtocol,
									},
								]
						),
					}
				},
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
					const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
					const beaconRestBase = beaconRestBaseByExecutionChainId[Number(caip2.reference)]
					return {
						slug: network.slug,
						name: network.name,
						caip2,
						namespace: network.namespace,
						environment: network.environment,
						consensusEndpoints: (
							beaconRestBase == null ?
								[]
							:
								[
									{
										restBaseUrl: beaconRestBase.restBaseUrl,
										consensusProtocol: beaconRestBase.consensusProtocol,
									},
								]
						),
					}
				}
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				namespace: () => NetworkNamespace.Evm,
				environment: (network) => network.environment,
				consensusEndpoints: (network) => network.consensusEndpoints,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.MevRelay,
			resolve: {
				[MevRelaySelector.EvmNetworkHost]: async ({ host }) => ({
					url: `https://${host}`,
				})
			},
		})({
			fields: {
				url: (relay) => relay.url,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmProtocol,
			resolve: {
				[EvmProtocolSelector.Scope]: async ({ scope }) => evmProtocolByScope[scope],
			},
		})({
			fields: {
				protocolName: (protocol) => protocol.protocolName,
				homeUrl: (protocol) => protocol.homeUrl,
				docsUrl: (protocol) => protocol.docsUrl,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.MarketVenue,
			resolve: {
				[MarketVenueSelector.MarketVenueId]: async ({ marketVenueId }) => marketVenueById[marketVenueId],
			},
		})({
			fields: {
				marketVenueId: (marketVenue) => marketVenue.id,
				label: (marketVenue) => marketVenue.label,
				$$markets: (marketVenue, _marketVenueSelector, context) => {
					const limit = resolverContextRowLimit(context)
					const marketReferences: {
						[EntityMetaKey.Selector]: EntitySelector<typeof schema, EntityType.Market>
					}[] = []

					for (const catalogMarket of localCatalogCoinSpotUsdMarkets) {
						if (marketReferences.length >= limit)
							return marketReferences

						if (catalogMarket.marketVenueId === marketVenue.id)
							marketReferences.push({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogMarket),
							})
					}

					for (const catalogMarket of localCatalogSpotMarketsWithCoinAsQuote) {
						if (marketReferences.length >= limit)
							return marketReferences

						if (catalogMarket.marketVenueId === marketVenue.id)
							marketReferences.push({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCoinMarket(catalogMarket),
							})
					}

					for (const catalogMarket of localCatalogSpotMarketsWithCurrencyAsBase) {
						if (marketReferences.length >= limit)
							return marketReferences

						if (catalogMarket.marketVenueId === marketVenue.id)
							marketReferences.push({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
							})
					}

					return marketReferences
				},
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NetworkStack,
			resolve: {
				[NetworkStackSelector.NetworkStackId]: async ({ networkStackId }) => networkStackByNetworkStackId[networkStackId],
			},
		})({
			fields: {
				label: (networkStack) => networkStack.label,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async ({ realm }) => specificationRealmById[realm],
			},
		})({
			fields: {
				label: (realm) => realm.label,
				labelPlural: (realm) => realm.labelPlural ?? undefined,
				slug: (realm) => realm.slug,
				$$proposalKinds: (realm) => proposalKinds
					.filter((proposalKind) => proposalKind.realm === realm.id)
					.map((proposalKind) => ({
						[EntityMetaKey.Selector]: {
							realm: proposalKind.realm,
							category: proposalKind.category,
						},
					})),
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ realm, category }) => proposalKindAllowedInRealmByKey[`${realm}:${category}`],
			},
		})({
			fields: {
				label: (proposalKind) => proposalCategoryById[proposalKind.category].label,
				labelPlural: (proposalKind) => proposalCategoryById[proposalKind.category].labelPlural,
				slug: (proposalKind) => proposalCategoryById[proposalKind.category].slug,
					$specificationRealm: (proposalKind) => ({
						[EntityMetaKey.Selector]: {
							realm: proposalKind.realm,
						},
					}),
				},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
					const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
					return {
						slug: network.slug,
						name: network.name,
						...('caip2' in network && {
							caip2: network.caip2,
						}),
						namespace: network.namespace,
						networkStackId: network.networkStackId,
						environment: network.environment,
					}
				},
				[NetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null)
						throw new Error('Constants_Internal: Network not found')

					return {
						slug: network.slug,
						name: network.name,
						...('caip2' in network && {
							caip2: network.caip2,
						}),
						namespace: network.namespace,
						networkStackId: network.networkStackId,
						environment: network.environment,
					}
				},
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				namespace: (network) => network.namespace,
				$networkStack: (network) => ({
					[EntityMetaKey.Selector]: {
						networkStackId: network.networkStackId,
					},
				}),
				environment: (network) => network.environment,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NearNetwork,
			resolve: {
				[NearNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) throw new Error('Constants_Internal: NearNetwork not found')
					return {
						slug: network.slug,
						name: network.name,
						namespace: network.namespace,
						environment: network.environment,
						rpcEndpoints: [
							{
								url: 'https://rpc.mainnet.near.org',
								transportType: TransportType.Http,
								providerName: 'NEAR',
							},
						],
					}
				}
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
				rpcEndpoints: (network) => network.rpcEndpoints,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) throw new Error('Constants_Internal: ZeroGNetwork not found')
					return {
						slug: network.slug,
						name: network.name,
						namespace: network.namespace,
						environment: network.environment,
						chainId: zeroGChainId,
						$executionNetwork: {
							[EntityMetaKey.Selector]: zeroGEvmNetworkId,
						},
					}
				}
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
				chainId: (network) => network.chainId,
				$executionNetwork: (network) => network.$executionNetwork,
			},
		}),


		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[SolanaNetworkSelector.Caip2]: async ({ caip2 }) => {
					const network = networkBySlug.solana
					if (caip2.reference !== network.caip2.reference)
						throw new Error('Constants_Internal: SolanaNetwork not found')

					return {
						name: network.name,
						caip2: network.caip2,
						$network: {
							[EntityMetaKey.Selector]: {
								slug: network.slug,
							},
						},
						environment: network.environment,
						rpcEndpoints: [
							{
								url: 'https://api.mainnet.solana.com',
								transportType: TransportType.Http,
								providerName: 'Solana Labs',
							},
							{
								url: 'wss://api.mainnet.solana.com',
								transportType: TransportType.WebSocket,
								providerName: 'Solana Labs',
							},
						],
					}
				},
			},
		})({
			fields: {
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				$network: (network) => network.$network,
				environment: (network) => network.environment,
				rpcEndpoints: (network) => network.rpcEndpoints,
			},
		}),


		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ElementsNetwork,
			resolve: {
				[ElementsNetworkSelector.Network]: async ({ $network }) => {
					const network = (
						'slug' in $network ?
							networkBySlug[$network.slug]
						:
							networkByCaip2[`${$network.caip2.namespace}:${$network.caip2.reference}`]
					)
					if (network?.slug !== networkBySlug.liquid.slug)
						throw new Error('Constants_Internal: unsupported Elements network')

					return {
						$network: {
							[EntityMetaKey.Selector]: {
								slug: network.slug,
							},
						},
						$settlementNetwork: {
							[EntityMetaKey.Selector]: {
								$network: {
									slug: 'bitcoin',
								},
							},
						},
						federationName: 'Liquid Federation',
						blockTimeSeconds: 60,
						confidentialTransactionsDefault: true,
					}
				}
			},
		})({
			fields: {
				$settlementNetwork: (network) => network.$settlementNetwork,
				federationName: (network) => network.federationName,
				blockTimeSeconds: (network) => network.blockTimeSeconds,
				confidentialTransactionsDefault: (network) => network.confidentialTransactionsDefault,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.AssetInstance,
			resolve: {
				[AssetInstanceSelector.NetworkKindAssetKey]: async ({ assetKey, kind }) => {
					if (kind !== AssetInstanceKind.Native)
						throw new Error('Constants_Internal: AssetInstance name and symbol are native-only')

					return {
						name: assetKey,
						symbol: assetKey,
					}
				}
			},
		})({
			fields: {
				name: (assetInstance) => assetInstance.name,
				symbol: (assetInstance) => assetInstance.symbol,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.BittensorSubnet,
			resolve: {
				[BittensorSubnetSelector.NetworkNetuid]: async ({ netuid }) => ({
					name: netuid === 0 ? 'Root' : `Subnet ${netuid}`,
				})
			},
		})({
			fields: {
				name: (subnet) => subnet.name,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NetworkUpgrade,
			resolve: {
				[NetworkUpgradeSelector.NetworkUpgradeId]: async ({ upgradeId }) => ({
					name: upgradeId,
				})
			},
		})({
			fields: {
				name: (upgrade) => upgrade.name,
			},
		}),


		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async () => ({
					$$activityPubActors: activityPubNetworkSeedActors.map((actor) => ({
						[EntityMetaKey.Selector]: {
							instanceOrigin: actor.instanceOrigin,
							acct: actor.acct,
						},
					})),
					docsUrl: 'https://w3c.github.io/activitypub/',
					homeUrl: 'https://www.w3.org/TR/activitypub/',
					protocolName: 'ActivityPub (federated)',
				})
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				$$activityPubActors: (entity) => entity.$$activityPubActors,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[AtprotoNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://atproto.com/specs/atp',
					homeUrl: 'https://atproto.com',
					protocolName: 'AT Protocol (Bluesky / appviews)',
				})
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._GlobalAtprotoNetwork,
			resolve: {
				[_GlobalAtprotoNetworkSelector.Scope]: async () => ({
					$$sourceWindowActors: atprotoNetworkSeedActors.map((actor) => ({
						[EntityMetaKey.Selector]: {
							did: actor.did,
						},
					})),
					$$sourceWindowPosts: atprotoNetworkSeedPosts.map((post) => ({
						[EntityMetaKey.Selector]: {
							uri: post.uri,
						},
					})),
					docsUrl: 'https://atproto.com/specs/atp',
					homeUrl: 'https://atproto.com',
					protocolName: 'AT Protocol',
					topology: 'DIDs identify repos; PDS hosts serve signed records; appviews index public profiles, feeds, and relationships.',
				})
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				topology: (entity) => entity.topology,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				$$sourceWindowActors: (entity) => entity.$$sourceWindowActors,
				$$sourceWindowPosts: (entity) => entity.$$sourceWindowPosts,
			},
		}),


		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._GlobalEnsNetwork,
			resolve: {
				[_GlobalEnsNetworkSelector.Scope]: async ({ scope }) => {
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
						$registryContract: evmContractRef(protocol.registryContractAddress),
						$ethRegistrarController: evmContractRef(protocol.ethRegistrarControllerAddress),
						$reverseRegistrar: evmContractRef(protocol.reverseRegistrarAddress),
						$nameWrapper: evmContractRef(protocol.nameWrapperAddress),
					}
				},
			},
		})({
			fields: {
				scope: (entity) => entity.scope,
				$registryContract: (entity) => entity.$registryContract,
				$ethRegistrarController: (entity) => entity.$ethRegistrarController,
				$reverseRegistrar: (entity) => entity.$reverseRegistrar,
				$nameWrapper: (entity) => entity.$nameWrapper,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.IpfsProtocol,
			resolve: {
				[IpfsProtocolSelector.Scope]: async ({ scope }) => ipfsProtocolByScope[scope]
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SwarmProtocol,
			resolve: {
				[SwarmProtocolSelector.Scope]: async ({ scope }) => swarmProtocolByScope[scope]
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[FarcasterNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://docs.farcaster.xyz',
					homeUrl: 'https://www.farcaster.xyz',
					protocolName: 'Farcaster',
					registryLabel: 'Farcaster hub and indexer source window',
					topology: 'FID-keyed users, channels, and immutable casts resolved through configured Farcaster REST, Neynar, and Snapchain sources.',
					$$feeds: Object.values(farcasterFeedKindByVariant).map((feed) => ({
						[EntityMetaKey.Selector]: {
							variant: feed.variant,
						},
						label: feed.label,
					})),
				})
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
				$$feeds: (entity) => entity.$$feeds,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.LensNetwork,
			resolve: {
				[LensNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://docs.lens.xyz',
					homeUrl: 'https://lens.xyz',
					protocolName: 'Lens',
					registryLabel: 'Lens GraphQL source window',
					topology: 'Profiles and posts are indexed social graph records resolved through configured Lens GraphQL endpoints.',
					$$lensAccounts: lensNetworkSeedAccounts.map((account) => ({
						[EntityMetaKey.Selector]: {
							address: account.address,
						},
					})),
				})
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
				$$lensAccounts: (entity) => entity.$$lensAccounts,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				[_GlobalNostrNetworkSelector.Scope]: async (_entitySelector, context) => ({
					docsUrl: 'https://github.com/nostr-protocol/nips',
					homeUrl: 'https://nostr.com',
					protocolName: 'Nostr',
					registryLabel: 'Nostr public relay and indexer source window',
					topology: 'Profiles, notes, reposts, reactions, and articles are signed events. Relays are WebSocket transports; they do not imply a single global canonical database.',
					$$sourceWindowProfiles: nostrNetworkSeedProfiles.slice(0, resolverContextRowLimit(context)).map((profile) => ({
						[EntityMetaKey.Selector]: {
							pubkey: profile.pubkey,
						},
					})),
					$$sourceWindowNotes: nostrNetworkSeedNotes.slice(0, resolverContextRowLimit(context)).map((note) => ({
						[EntityMetaKey.Selector]: {
							eventId: note.eventId,
						},
					})),
					$$sourceWindowRelays: nostrNetworkSeedRelays.slice(0, resolverContextRowLimit(context)).map((relay) => ({
						[EntityMetaKey.Selector]: {
							relayUrl: relay.relayUrl,
						},
					})),
					$$sourceWindowReposts: [],
					$$sourceWindowArticles: [],
				})
			},
		})({
			fields: {
				protocolName: (network) => network.protocolName,
				registryLabel: (network) => network.registryLabel,
				homeUrl: (network) => network.homeUrl,
				docsUrl: (network) => network.docsUrl,
				topology: (network) => network.topology,
				$$sourceWindowProfiles: (network) => network.$$sourceWindowProfiles,
				$$sourceWindowNotes: (network) => network.$$sourceWindowNotes,
				$$sourceWindowRelays: (network) => network.$$sourceWindowRelays,
				$$sourceWindowReposts: (network) => network.$$sourceWindowReposts,
				$$sourceWindowArticles: (network) => network.$$sourceWindowArticles,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrProfile,
			resolve: {
				[NostrProfileSelector.CanonicalPubkey]: async ({ pubkey }, context) => {
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
						$$articles: [],
						$$reposts: [],
					}
				}
			},
		})({
			fields: {
				pubkey: (profile) => profile.pubkey,
				$$notes: (profile) => profile.$$notes,
				$$articles: (profile) => profile.$$articles,
				$$reposts: (profile) => profile.$$reposts,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrRelay,
			resolve: {
				[NostrRelaySelector.RelayUrl]: async ({ relayUrl }) => {
					const relay = nostrNetworkSeedRelays.find((seedRelay) => seedRelay.relayUrl === relayUrl)
					if (relay == null)
						throw new Error('Constants_Internal: NostrRelay seed not found')

					return {
						...relay,
						name: relay.relayUrl.replace(/^wss:\/\//i, ''),
					}
				}
			},
		})({
			fields: {
				relayUrl: (relay) => relay.relayUrl,
				name: (relay) => relay.name,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNote,
			resolve: {
				[NostrNoteSelector.CanonicalEventId]: async ({ eventId }) => {
					const note = nostrNetworkSeedNotes.find((seedNote) => seedNote.eventId === eventId)
					if (note == null)
						throw new Error('Constants_Internal: NostrNote seed not found')

					return {
						eventId: note.eventId,
						kind: 1,
						pubkey: note.pubkey,
						content: note.content,
						createdAt: note.createdAt * 1000,
						$author: {
							[EntityMetaKey.Selector]: {
								pubkey: note.pubkey,
							},
						},
						$$replies: [],
						$$reactions: [],
					}
				}
			},
		})({
			fields: {
				eventId: (note) => note.eventId,
				kind: (note) => note.kind,
				pubkey: (note) => note.pubkey,
				content: (note) => note.content,
				createdAt: (note) => note.createdAt,
				$author: (note) => note.$author,
				$$replies: (note) => note.$$replies,
				$$reactions: (note) => note.$$reactions,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditNetwork,
			resolve: {
				[RedditNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://www.reddit.com/dev/api/',
					homeUrl: 'https://www.reddit.com',
					protocolName: 'Reddit data API',
				})
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RssNetwork,
			resolve: {
				[RssNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://www.rssboard.org/rss-specification',
					homeUrl: 'https://www.rssboard.org',
					protocolName: 'RSS / Atom syndication',
					registryLabel: 'Seed feeds',
					topology: 'A configured feed directory with live item windows resolved from each feed URL.',
					$$rssFeeds: rssNetworkSeedFeeds.map((feed) => ({
						[EntityMetaKey.Selector]: {
							feedUrl: feed.feedUrl,
						},
					})),
				})
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
				$$rssFeeds: (entity) => entity.$$rssFeeds,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.XNetwork,
			resolve: {
				[XNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://developer.x.com',
					homeUrl: 'https://x.com',
					protocolName: 'X (API v2)',
					registryLabel: 'Public profiles and posts',
					topology: 'Public X users and posts resolved from configured HTTP sources.',
				})
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.XmtpNetwork,
			resolve: {
				[XmtpNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://docs.xmtp.org',
					homeUrl: 'https://xmtp.org',
					protocolName: 'XMTP (wallet messaging)',
					registryLabel: 'Local inbox state',
					topology: 'Local catalog conversations associated with provisioned wallet identities.',
				})
			},
		})({
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.YoutubeNetwork,
			resolve: {
				[YoutubeNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://developers.google.com/youtube/v3',
					homeUrl: 'https://www.youtube.com',
					protocolName: 'YouTube Data API',
				})
			},
			})({
				fields: {
					protocolName: (entity) => entity.protocolName,
					homeUrl: (entity) => entity.homeUrl,
					docsUrl: (entity) => entity.docsUrl,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType.YoutubeChannel,
				resolve: {
				[YoutubeChannelSelector.ChannelId]: async ({ channelId }) => {
						const channel = youtubeNetworkSeedChannelByChannelId[channelId]
						if (channel == null) throw new Error(`Constants_Internal: YoutubeChannel ${channelId} not found`)

						return channel
					}
				},
			})({
				fields: {
					title: (entity) => entity.title,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType.YoutubePlaylist,
				resolve: {
				[YoutubePlaylistSelector.PlaylistId]: async ({ playlistId }) => {
						const playlist = youtubeNetworkSeedPlaylistByPlaylistId[playlistId]
						if (playlist == null) throw new Error(`Constants_Internal: YoutubePlaylist ${playlistId} not found`)

						return playlist
					}
				},
			})({
				fields: {
					title: (entity) => entity.title,
					$channel: (entity) => ({
						[EntityMetaKey.Selector]: {
							channelId: entity.channelId,
						},
					}),
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType.YoutubePlaylist,
				resolve: {
					[YoutubePlaylistSelector.PlaylistId]: async ({ playlistId }) => {
						const playlist = youtubeNetworkSeedPlaylistByPlaylistId[playlistId]
						if (playlist == null) throw new Error(`Constants_Internal: YoutubePlaylist ${playlistId} not found`)

						return [...youtubeNetworkSeedVideos]
							.filter((video) => video.channelId === playlist.channelId)
							.map((video) => ({
								[EntityMetaKey.Selector]: {
									videoId: video.videoId,
								},
								[EntityMetaKey.Fields]: {
									title: video.title,
									publishedAt: video.publishedAt,
									publishedAtMs: video.publishedAtMs,
									thumbnailUrl: video.thumbnailUrl,
									$author: {
										[EntityMetaKey.Selector]: {
											channelId: video.channelId,
										},
									},
								},
							}))
					},
				},
			})({
				fields: {
					$$videos: (entity) => entity,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType.YoutubeVideo,
				resolve: {
				[YoutubeVideoSelector.VideoId]: async ({ videoId }) => {
						const video = youtubeNetworkSeedVideoByVideoId[videoId]
						if (video == null) throw new Error(`Constants_Internal: YoutubeVideo ${videoId} not found`)

						return video
					}
				},
			})({
				fields: {
					title: (entity) => entity.title,
					publishedAt: (entity) => entity.publishedAt,
					publishedAtMs: (entity) => entity.publishedAtMs,
					thumbnailUrl: (entity) => entity.thumbnailUrl,
					$author: (entity) => ({
						[EntityMetaKey.Selector]: {
							channelId: entity.channelId,
						},
					}),
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType._GlobalRedditNetwork,
				resolve: {
					[_GlobalRedditNetworkSelector.Scope]: async ({ scope }) => ({
						scope,
					}),
				},
			})({
				fields: {
					scope: (entity) => entity.scope,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType._GlobalRedditNetwork,
				resolve: {
					[_GlobalRedditNetworkSelector.Scope]: async () => (
						[...redditNetworkSeedSubreddits].map((subreddit) => ({
							[EntityMetaKey.Selector]: {
								name: subreddit.name,
							},
						}))
					),
				},
			})({
				fields: {
					$$sourceWindowSubreddits: (entity) => entity,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType._GlobalRedditNetwork,
				resolve: {
					[_GlobalRedditNetworkSelector.Scope]: async () => (
						[...redditNetworkSeedLinks].map((link) => ({
							[EntityMetaKey.Selector]: {
								fullname: link.fullname,
							},
							[EntityMetaKey.Fields]: {
								title: link.title,
								permalink: link.permalink,
								author: link.author,
								createdAt: link.createdAt,
								$subreddit: {
									[EntityMetaKey.Selector]: {
										name: link.subredditName,
									},
								},
							},
						}))
					),
				},
			})({
				fields: {
					$$sourceWindowLinks: (entity) => entity,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType._GlobalYoutubeNetwork,
				resolve: {
					[_GlobalYoutubeNetworkSelector.Scope]: async () => (
						[...youtubeNetworkSeedChannels].map((channel) => ({
							[EntityMetaKey.Selector]: {
								channelId: channel.channelId,
							},
							[EntityMetaKey.Fields]: {
								title: channel.title,
							},
						}))
					),
				},
			})({
				fields: {
					$$sourceWindowChannels: (entity) => entity,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType._GlobalYoutubeNetwork,
				resolve: {
					[_GlobalYoutubeNetworkSelector.Scope]: async () => (
						[...youtubeNetworkSeedVideos].map((video) => ({
							[EntityMetaKey.Selector]: {
								videoId: video.videoId,
							},
							[EntityMetaKey.Fields]: {
								title: video.title,
								publishedAt: video.publishedAt,
								publishedAtMs: video.publishedAtMs,
								thumbnailUrl: video.thumbnailUrl,
								$author: {
									[EntityMetaKey.Selector]: {
										channelId: video.channelId,
									},
								},
							},
						}))
					),
				},
			})({
				fields: {
					$$sourceWindowVideos: (entity) => entity,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType._GlobalYoutubeNetwork,
				resolve: {
					[_GlobalYoutubeNetworkSelector.Scope]: async () => (
						[...youtubeNetworkSeedPlaylists].map((playlist) => ({
							[EntityMetaKey.Selector]: {
								playlistId: playlist.playlistId,
							},
							[EntityMetaKey.Fields]: {
								title: playlist.title,
								$channel: {
									[EntityMetaKey.Selector]: {
										channelId: playlist.channelId,
									},
								},
							},
						}))
					),
				},
			})({
				fields: {
					$$sourceWindowPlaylists: (entity) => entity,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType._Global,
				resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
					[...networks].map((network) => ({
						[EntityMetaKey.Selector]: {
							slug: network.slug,
						},
					}))
				)
			},
		})({
			fields: {
				$$networks: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
					Object.values(networkStackByNetworkStackId).map((networkStack) => ({
						[EntityMetaKey.Selector]: {
							networkStackId: networkStack.networkStackId,
						},
					}))
				)
			},
		})({
			fields: {
				$$networkStacks: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
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
				}
			},
		})({
			fields: {
				$$networkUpgrades: (entity) => entity,
			},
		}),

			defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
					const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
					const namespace: NetworkNamespace = network.namespace
					const coinId = nativeAssetCoinIdByNamespace[namespace]
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: {
									caip2,
								},
								kind: AssetInstanceKind.Native,
								assetKey: coinId,
							},
							coinId,
							symbol: coinId,
						},
					]
				},
				[NetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) return []
					const namespace: NetworkNamespace = network.namespace
					const coinId = nativeAssetCoinIdByNamespace[namespace]
					if (coinId == null) return []
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: {
									caip2: network.caip2,
								},
								kind: AssetInstanceKind.Native,
								assetKey: coinId,
							},
							coinId,
							symbol: coinId,
						},
					]
				},
			},
		})({
			fields: {
				$$nativeAssets: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
					const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
					return networkResourceUrlEntitySelectors(
						network.slug,
						NetworkResourceKind.Faucet
					)
				},
				[NetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					return networkResourceUrlEntitySelectors(
						network.slug,
						NetworkResourceKind.Faucet
					)
				},
			},
		})({
			fields: {
				$$faucetUrls: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
					const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
					return networkResourceUrlEntitySelectors(
						network.slug,
						NetworkResourceKind.BlockExplorer
					)
				},
				[NetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					return networkResourceUrlEntitySelectors(
						network.slug,
						NetworkResourceKind.BlockExplorer
					)
				},
			},
		})({
			fields: {
				$$blockExplorerUrls: (entity) => entity,
			},
		}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
					specificationRealms.map((realm) => ({
						[EntityMetaKey.Selector]: {
							realm: realm.id,
						},
					}))
				)
			},
		})({
			fields: {
				$$specificationRealms: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
					proposalKinds.map((proposalKind) => ({
						[EntityMetaKey.Selector]: {
							realm: proposalKind.realm,
							category: proposalKind.category,
						},
					}))
				)
			},
		})({
			fields: {
				$$proposalKinds: (entity) => entity,
			},
		}),


		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { coins } = await import('$/constants/Coin.ts')
					return [
						...coins.map((coin) => (
							{
								[EntityMetaKey.Selector]: {
									coinId: coin.id,
								},
							}
						)),
					]
				}
			},
		})({
			fields: {
				$$coins: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
					marketVenues.map((marketVenue) => ({
						[EntityMetaKey.Selector]: {
							marketVenueId: marketVenue.id,
						},
					}))
				)
			},
		})({
			fields: {
				$$marketVenues: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
					[...currencies].map((currency) => (
						{
							[EntityMetaKey.Selector]: {
								iso4217: currency.iso4217,
							},
						}
					))
				)
			},
		})({
			fields: {
				$$currencies: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async (entitySelector: EntitySelector<typeof schema, EntityType.Currency>) => {
					const currency = currencyByIso4217[entitySelector.iso4217]
					if (currency == null) return []
					return [
						{
							[EntityMetaKey.Selector]: {
								$currency: entitySelector,
								timestampMs: currencyCatalogSnapshotTimestampMs,
								source: Source.Constants_Internal,
							},
							marketCap: BigInt(currency.marketCapUsd),
						},
					]
				}
			},
		})({
			fields: {
				$$timestamps: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { coins } = await import('$/constants/Coin.ts')
					return (
						coins.map((coin) => (
						{
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(localCatalogCoinSpotUsdMarketByCoinId[coin.id]),
						}
						))
					)
				}
			},
		})({
			fields: {
				$$markets: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					localCatalogCoinSpotUsdMarkets.slice(0, resolverContextRowLimit(context)).map((catalogMarket) => (
						{
							[EntityMetaKey.Selector]: {
								$market: marketSelectorFromCatalogCoinCurrencyMarket(catalogMarket),
								timeInterval: marketOhlcDailyTimeInterval,
								timestampMs: currencyCatalogSnapshotTimestampMs,
								source: Source.Constants_Internal,
							},
						}
					))
				)
			},
		})({
			fields: {
				$$marketTimeIntervalTimestamps: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => (
					[
						{
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(localCatalogCoinSpotUsdMarketByCoinId[coinId]),
						},
					]
				)
			},
		})({
			fields: {
				$$marketsWithCoinAsBase: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => (
					(localCatalogMarketsWithCoinAsQuoteByQuoteCoinId[coinId] ).map((catalogMarket) => ({
						[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCoinMarket(catalogMarket),
					}))
				)
			},
		})({
			fields: {
				$$marketsWithCoinAsQuote: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => (
					(localCatalogMarketsWithCurrencyAsBaseByIso4217[iso4217] ?? []).map((catalogMarket: CatalogCurrencyCurrencyMarket) => ({
						[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
					}))
				)
			},
		})({
			fields: {
				$$marketsWithCurrencyAsBase: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => [
					...(
						iso4217 === Iso4217.USD ?
							localCatalogCoinSpotUsdMarkets.map((catalogMarket) => ({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogMarket),
							}))
						:
							[]
					),
					...localCatalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.quoteIso4217 === iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
						})),
				]
			},
		})({
			fields: {
				$$marketsWithCurrencyAsQuote: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => (
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
				)
			},
		})({
			fields: {
				$$coinInstances: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async ({ $network, type }) => {
					const representation = ethNativeCoinInstanceRepresentationByChainId[Number($network.caip2.reference)]
					if (type === CoinInstanceType.NativeCurrency && representation != null)
						return representation

					throw new Error('Constants_Internal: CoinInstance representation unsupported')
				},
				[EvmCoinInstanceSelector.NetworkTypeContract]: async ({ $network, type }) => {
					const representation = ethNativeCoinInstanceRepresentationByChainId[Number($network.caip2.reference)]
					if (type === CoinInstanceType.NativeCurrency && representation != null)
						return representation

					throw new Error('Constants_Internal: CoinInstance representation unsupported')
				},
			},
		})({
			fields: {
				representation: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async ({ $base }: EntitySelector<typeof schema, EntityType.Market>) => (
					$base.kind === MarketAssetKind.Coin ?
						{
							[EntityMetaKey.Selector]: {
								coinId: $base.$coin.coinId,
							},
						}
					:
						undefined
				)
			},
		})({
			fields: {
				$baseCoin: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>) => (
					(
						entitySelector.$base.kind === MarketAssetKind.Coin
					&& catalogCoinCurrencyMarketMatchesMarket(localCatalogCoinSpotUsdMarketByCoinId[entitySelector.$base.$coin.coinId], entitySelector)
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
				)
			},
		})({
			fields: {
				$$marketPrices: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }: EntitySelector<typeof schema, EntityType.MarketPrice>) => (
					{
						[EntityMetaKey.Selector]: $market,
					}
				)
			},
		})({
			fields: {
				$parentMarket: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market }) => (
					{
						[EntityMetaKey.Selector]: $market,
					}
				)
			},
		})({
			fields: {
				$parentMarket: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Slug]: async ({ slug }) => {
					const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
					return beaconRestBaseByExecutionChainId[Number(networkBySlug[slug].caip2.reference)]?.consensusProtocol
				},
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
					return beaconRestBaseByExecutionChainId[Number(caip2.reference)]?.consensusProtocol
				}
			},
		})({
			fields: {
				consensusProtocol: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Slug]: async ({ slug }) => {
					const caip2 = networkBySlug[slug].caip2
					const coinId = nativeAssetCoinIdByNamespace[NetworkNamespace.Evm]
					return {
						nativeCoin: {
							[EntityMetaKey.Selector]: {
								coinId,
							},
							name: 'ETH',
							symbol: 'ETH',
						},
						nativeCoinInstance: {
							[EntityMetaKey.Selector]: {
								$network: {
									caip2,
								},
								type: CoinInstanceType.NativeCurrency,
							},
							name: 'Ether',
							symbol: 'ETH',
						},
						nativeAssets: [
							{
								[EntityMetaKey.Selector]: {
									$network: {
										caip2,
									},
									kind: AssetInstanceKind.Native,
									assetKey: coinId,
								},
								coinId,
								symbol: coinId,
							},
						],
					}
				},
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const coinId = nativeAssetCoinIdByNamespace[NetworkNamespace.Evm]
					return {
						nativeCoin: {
							[EntityMetaKey.Selector]: {
								coinId,
							},
							name: 'ETH',
							symbol: 'ETH',
						},
						nativeCoinInstance: {
							[EntityMetaKey.Selector]: {
								$network: {
									caip2,
								},
								type: CoinInstanceType.NativeCurrency,
							},
							name: 'Ether',
							symbol: 'ETH',
						},
						nativeAssets: [
							{
								[EntityMetaKey.Selector]: {
									$network: {
										caip2,
									},
									kind: AssetInstanceKind.Native,
									assetKey: coinId,
								},
								coinId,
								symbol: coinId,
							},
						],
					}
				},
			},
		})({
			fields: {
				$nativeCoin: (entity) => entity.nativeCoin,
				$nativeCoinInstance: (entity) => entity.nativeCoinInstance,
				$$nativeAssets: (entity) => entity.nativeAssets,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Slug]: async ({ slug }) => {
					const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
					const caip2 = networkBySlug[slug].caip2
					const chainId = Number(caip2.reference)
					return (
						mevRelayHosts
							.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
							.map((mevRelayHost) => ({
								[EntityMetaKey.Selector]: {
									$network: { caip2 },
									host: mevRelayHost.host,
								},
								url: `https://${mevRelayHost.host}`,
							}))
					)
				},
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
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
								url: `https://${mevRelayHost.host}`,
							}))
					)
				}
			},
		})({
			fields: {
				$$mevRelays: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Slug]: async ({ slug }) => {
					const {
						networkUpgrades,
						networkExecutionUpgradeByChainIdAndUpgradeId,
						networkConsensusUpgradeByChainIdAndUpgradeId,
					} = await import('$/constants/EthereumNetworkUpgrades.ts')
					return networkUpgrades
						.filter((networkUpgrade) => (
						String(networkUpgrade.chainId) === networkBySlug[slug].caip2.reference
						))
						.map((networkUpgrade) => (
						evmNetworkUpgradeEntityFromRow(
							networkUpgrade,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkConsensusUpgradeByChainIdAndUpgradeId
						)
						))
				},
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const {
						networkUpgrades,
						networkExecutionUpgradeByChainIdAndUpgradeId,
						networkConsensusUpgradeByChainIdAndUpgradeId,
					} = await import('$/constants/EthereumNetworkUpgrades.ts')
					return networkUpgrades
						.filter((networkUpgrade) => (
						String(networkUpgrade.chainId) === caip2.reference
						))
						.map((networkUpgrade) => (
						evmNetworkUpgradeEntityFromRow(
							networkUpgrade,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkConsensusUpgradeByChainIdAndUpgradeId
						)
						))
				}
			},
		})({
			fields: {
				$$upgrades: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Slug]: async ({ slug }) => {
					const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
					return networkExecutionUpgrades
						.filter((networkExecutionUpgrade) => (
						String(networkExecutionUpgrade.chainId) === networkBySlug[slug].caip2.reference
						))
						.map((networkExecutionUpgrade) => ({
							...networkExecutionUpgrade,
							[EntityMetaKey.Selector]: evmNetworkUpgradeSelector(networkExecutionUpgrade),
							$$proposals: ethereumProposalRefs(networkExecutionUpgrade.proposalIds),
						}))
				},
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
					return networkExecutionUpgrades
						.filter((networkExecutionUpgrade) => (
						String(networkExecutionUpgrade.chainId) === caip2.reference
						))
						.map((networkExecutionUpgrade) => ({
							...networkExecutionUpgrade,
							[EntityMetaKey.Selector]: evmNetworkUpgradeSelector(networkExecutionUpgrade),
							$$proposals: ethereumProposalRefs(networkExecutionUpgrade.proposalIds),
						}))
				}
			},
		})({
			fields: {
				$$executionUpgrades: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Slug]: async ({ slug }) => {
					const { networkConsensusUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
					return networkConsensusUpgrades
						.filter((networkConsensusUpgrade) => (
						String(networkConsensusUpgrade.chainId) === networkBySlug[slug].caip2.reference
						))
						.map((networkConsensusUpgrade) => ({
							...networkConsensusUpgrade,
							[EntityMetaKey.Selector]: evmNetworkUpgradeSelector(networkConsensusUpgrade),
							$$proposals: ethereumProposalRefs(networkConsensusUpgrade.proposalIds),
						}))
				},
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { networkConsensusUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
					return networkConsensusUpgrades
						.filter((networkConsensusUpgrade) => (
						String(networkConsensusUpgrade.chainId) === caip2.reference
						))
						.map((networkConsensusUpgrade) => ({
							...networkConsensusUpgrade,
							[EntityMetaKey.Selector]: evmNetworkUpgradeSelector(networkConsensusUpgrade),
							$$proposals: ethereumProposalRefs(networkConsensusUpgrade.proposalIds),
						}))
				}
			},
		})({
			fields: {
				$$consensusUpgrades: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumNetworkUpgrade,
			resolve: {
				[EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
					const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
					const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]
					return (
						{
							[EntityMetaKey.Selector]: evmNetworkUpgradeSelector({
								chainId: networkUpgrade.chainId,
								upgradeId: networkUpgrade.executionUpgradeId,
							}),
						}
					)
				}
			},
		})({
			fields: {
				$networkExecutionUpgrade: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumNetworkUpgrade,
			resolve: {
				[EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
					const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
					const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]
					return (
						networkUpgrade.consensusUpgradeId == null ?
							undefined
						:
							{
								[EntityMetaKey.Selector]: evmNetworkUpgradeSelector({
									chainId: networkUpgrade.chainId,
									upgradeId: networkUpgrade.consensusUpgradeId,
								}),
							}
					)
				}
			},
		})({
			fields: {
				$networkConsensusUpgrade: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumNetworkUpgrade,
			resolve: {
				[EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
					const {
						networkUpgradeByChainIdAndUpgradeId,
						networkExecutionUpgradeByChainIdAndUpgradeId,
						networkConsensusUpgradeByChainIdAndUpgradeId,
					} = await import('$/constants/EthereumNetworkUpgrades.ts')
					const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]

					const proposals = uniqueProposalRefs([
						...ethereumProposalRefs(
							networkExecutionUpgradeByChainIdAndUpgradeId[
								`${networkUpgrade.chainId}:${networkUpgrade.executionUpgradeId}`
								]?.proposalIds
					),
						...ethereumProposalRefs(
							networkUpgrade.consensusUpgradeId == null ?
							undefined
						:
							networkConsensusUpgradeByChainIdAndUpgradeId[
								`${networkUpgrade.chainId}:${networkUpgrade.consensusUpgradeId}`
								]?.proposalIds
					),
					])
					return proposals
				}
			},
		})({
			fields: {
				$$proposals: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumExecutionUpgrade,
			resolve: {
				[EthereumExecutionUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
					const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
					const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]
					return ethereumProposalRefs(networkExecutionUpgrade.proposalIds)
				}
			},
		})({
			fields: {
				$$proposals: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				[EthereumConsensusUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
					const {
						networkConsensusUpgradeByChainIdAndUpgradeId,
						networkExecutionUpgradeByChainIdAndUpgradeId,
						networkUpgrades,
					} = await import('$/constants/EthereumNetworkUpgrades.ts')
					const networkConsensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]
					const directProposals = ethereumProposalRefs(networkConsensusUpgrade.proposalIds)
					if (directProposals.length > 0)
						return directProposals
					const umbrellaNetworkUpgrade = networkUpgrades.find((networkUpgrade) => (
						String(networkUpgrade.chainId) === $network.caip2.reference
						&& networkUpgrade.consensusUpgradeId === upgradeId
					))
					if (umbrellaNetworkUpgrade != null) {
						const linkedProposals = uniqueProposalRefs([
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
						if (linkedProposals.length > 0)
							return linkedProposals
					}
					return []
				}
			},
		})({
			fields: {
				$$proposals: (entity) => entity,
			},
		}),

				defineResolver(Source.Constants_Internal, {
					entityType: EntityType.AtprotoPost,
					resolve: {
						[AtprotoPostSelector.Uri]: async ({ uri }) => {
							const post = atprotoNetworkSeedPostByUri[uri]
							if (post == null) throw new Error(`Constants_Internal: AtprotoPost ${uri} not found`)

							return post
						}
					},
				})({
					fields: {
						uri: (entity) => entity.uri,
						$author: (entity) => ({
							[EntityMetaKey.Selector]: {
								did: entity.authorDid,
							},
						}),
					},
				}),
		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }) => {
					const subreddit = redditNetworkSeedSubreddits.find((seedSubreddit) => seedSubreddit.name === name)
					if (subreddit == null)
						throw new Error('Constants_Internal: RedditSubreddit seed not found')

					return subreddit
				}
			},
		})({
			fields: {
				name: (subreddit) => subreddit.name,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }) => (
					[...redditNetworkSeedLinks]
						.filter((link) => link.subredditName === name)
						.map((link) => ({
							[EntityMetaKey.Selector]: {
								fullname: link.fullname,
							},
							[EntityMetaKey.Fields]: {
								title: link.title,
								permalink: link.permalink,
								author: link.author,
								createdAt: link.createdAt,
								$subreddit: {
									[EntityMetaKey.Selector]: {
										name: link.subredditName,
									},
								},
							},
						}))
				),
			},
		})({
			fields: {
				$$links: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditLink,
			resolve: {
				[RedditLinkSelector.Fullname]: async ({ fullname }) => {
					const link = redditNetworkSeedLinks.find((seedLink) => seedLink.fullname === fullname)
					if (link == null)
						throw new Error('Constants_Internal: RedditLink seed not found')

					return {
						fullname: link.fullname,
						title: link.title,
						permalink: link.permalink,
						author: link.author,
						createdAt: link.createdAt,
						$subreddit: {
							[EntityMetaKey.Selector]: {
								name: link.subredditName,
							},
						},
					}
				}
			},
		})({
			fields: {
				fullname: (link) => link.fullname,
				title: (link) => link.title,
				permalink: (link) => link.permalink,
				author: (link) => link.author,
				createdAt: (link) => link.createdAt,
				$subreddit: (link) => link.$subreddit,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditLink,
			resolve: {
				[RedditLinkSelector.Fullname]: async ({ fullname }) => (
					[...redditNetworkSeedComments]
						.filter((comment) => comment.linkFullname === fullname)
						.map((comment) => ({
							[EntityMetaKey.Selector]: {
								fullname: comment.fullname,
							},
							[EntityMetaKey.Fields]: {
								body: comment.body,
								author: comment.author,
								createdAt: comment.createdAt,
								$link: {
									[EntityMetaKey.Selector]: {
										fullname: comment.linkFullname,
									},
								},
							},
						}))
				),
			},
		})({
			fields: {
				$$comments: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditComment,
			resolve: {
				[RedditCommentSelector.Fullname]: async ({ fullname }) => {
					const comment = redditNetworkSeedComments.find((seedComment) => seedComment.fullname === fullname)
					if (comment == null)
						throw new Error('Constants_Internal: RedditComment seed not found')

					return {
						fullname: comment.fullname,
						body: comment.body,
						author: comment.author,
						createdAt: comment.createdAt,
						$link: {
							[EntityMetaKey.Selector]: {
								fullname: comment.linkFullname,
							},
						},
					}
				}
			},
		})({
			fields: {
				fullname: (comment) => comment.fullname,
				body: (comment) => comment.body,
				author: (comment) => comment.author,
				createdAt: (comment) => comment.createdAt,
				$link: (comment) => comment.$link,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditComment,
			resolve: {
				[RedditCommentSelector.Fullname]: async () => [],
			},
		})({
			fields: {
				$$replies: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.XPost,
			resolve: {
				[XPostSelector.Id]: async ({ id }) => {
					const post = xNetworkSeedPostById[id]
					if (post == null) throw new Error(`Constants_Internal: XPost ${id} not found`)

					return post
				}
			},
		})({
			fields: {
				id: (entity) => entity.id,
				postUrl: (entity) => `https://x.com/i/web/status/${entity.id}`,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
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
				}
			},
		})({
			fields: {
				precompileName: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
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
								precompileName: precompile.name,
							}]
						})
				}
			},
		})({
			fields: {
				$$precompiles: (entity) => entity,
			},
		}),
	],
}
