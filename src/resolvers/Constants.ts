import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	bridgeToolByKey,
	type BridgeToolRow,
	CoinInstanceRepresentation,
} from '$/constants/Bridge.ts'
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
	catalogCoinSpotUsdMarkets,
	catalogCoinSpotUsdMarketByCoinId,
	catalogMarketsWithCoinAsQuoteByQuoteCoinId,
	catalogMarketsWithCurrencyAsBaseByIso4217,
	catalogSpotMarketsWithCurrencyAsBase,
	type CatalogCoinCoinMarket,
	type CatalogCoinCurrencyMarket,
	type CatalogCurrencyCurrencyMarket,
} from '$/constants/MarketCatalog.ts'
import type { NetworkUpgradeActivationProposal } from '$/constants/EthereumNetworkUpgradeActivations.ts'
import { stringify } from 'devalue'
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
	NetworkStackId,
	networkStackByNetworkStackId,
} from '$/constants/NetworkStack.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	ExecutionEnvironmentId,
	executionEnvironmentByExecutionEnvironmentId,
} from '$/constants/ExecutionEnvironment.ts'
import {
	ConsensusMechanismId,
	consensusMechanismById,
} from '$/constants/ConsensusMechanism.ts'
import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	proposalCategoryById,
	ProposalCategory,
	proposalKinds,
	proposalKindAllowedInRealmByKey,
	SpecificationRealm,
	specificationRealmById,
} from '$/constants/SpecificationProposal.ts'
import { activityPubNetworkSeedActors } from '$/constants/Social/ActivityPub.ts'
import {
	atprotoNetworkSeedActors,
	atprotoNetworkSeedPostByUri,
	atprotoNetworkSeedPosts,
} from '$/constants/Social/Atproto.ts'
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
} from '$/constants/Social/YouTube.ts'
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
import { MarketVenueSelector } from '$/schema/MarketVenue.ts'
import { CurrencySelector } from '$/schema/Currency.ts'
import { Currency_TimestampSelector } from '$/schema/Currency_Timestamp.ts'
import { MarketSelector } from '$/schema/Market.ts'
import { EvmContractSelector } from '$/schema/EvmContract.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { EvmCoinInstanceSelector } from '$/schema/EvmCoinInstance.ts'
import { CoinBridgeCapabilitySelector } from '$/schema/CoinBridgeCapability.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'
import { Market_TimeInterval_TimestampSelector } from '$/schema/Market_TimeInterval_Timestamp.ts'
import { UrlSelector } from '$/schema/Url.ts'
import { MevRelaySelector } from '$/schema/MevRelay.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { NearNetworkSelector } from '$/schema/NearNetwork.ts'
import { ZeroGNetworkSelector } from '$/schema/ZeroGNetwork.ts'
import { QuilibriumNetworkSelector } from '$/schema/QuilibriumNetwork.ts'
import { SolanaNetworkSelector } from '$/schema/SolanaNetwork.ts'
import { NetworkStackSelector } from '$/schema/NetworkStack.ts'
import { ElementsNetworkSelector } from '$/schema/ElementsNetwork.ts'
import { ExecutionEnvironmentSelector } from '$/schema/ExecutionEnvironment.ts'
import { ConsensusMechanismSelector } from '$/schema/ConsensusMechanism.ts'
import { AssetInstanceSelector } from '$/schema/AssetInstance.ts'
import { BittensorSubnetSelector } from '$/schema/BittensorSubnet.ts'
import { NetworkUpgradeSelector } from '$/schema/NetworkUpgrade.ts'
import { CosmosGovernanceProposalSelector } from '$/schema/CosmosGovernanceProposal.ts'
import { PolkadotReferendumSelector } from '$/schema/PolkadotReferendum.ts'
import { SpecificationRealmSelector } from '$/schema/SpecificationRealm.ts'
import { SpecificationProposalKindSelector } from '$/schema/SpecificationProposalKind.ts'
import { ActivityPubNetworkSelector } from '$/schema/ActivityPubNetwork.ts'
import { AtprotoNetworkSelector } from '$/schema/AtprotoNetwork.ts'
import { AtprotoPostSelector } from '$/schema/AtprotoPost.ts'
import { FarcasterNetworkSelector } from '$/schema/FarcasterNetwork.ts'
import { EnsProtocolSelector } from '$/schema/EnsProtocol.ts'
import { EvmProtocolSelector } from '$/schema/EvmProtocol.ts'
import { IpfsProtocolSelector } from '$/schema/IpfsProtocol.ts'
import { SwarmProtocolSelector } from '$/schema/SwarmProtocol.ts'
import { LensNetworkSelector } from '$/schema/LensNetwork.ts'
import { NostrNetworkSelector } from '$/schema/NostrNetwork.ts'
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
import { YouTubeChannelSelector } from '$/schema/YouTubeChannel.ts'
import { YouTubeNetworkSelector } from '$/schema/YouTubeNetwork.ts'
import { YouTubePlaylistSelector } from '$/schema/YouTubePlaylist.ts'
import { YouTubeVideoSelector } from '$/schema/YouTubeVideo.ts'

const networkStackIdByNamespace = {
	[NetworkNamespace.Bittensor]: NetworkStackId.Bittensor,
	[NetworkNamespace.Bitcoin]: NetworkStackId.Bitcoin,
	[NetworkNamespace.BitcoinCash]: NetworkStackId.BitcoinCash,
	[NetworkNamespace.Cosmos]: NetworkStackId.CosmosSdkCometBft,
	[NetworkNamespace.Dogecoin]: NetworkStackId.Dogecoin,
	[NetworkNamespace.Elements]: NetworkStackId.Elements,
	[NetworkNamespace.Evm]: NetworkStackId.Ethereum,
	[NetworkNamespace.Filecoin]: NetworkStackId.Filecoin,
	[NetworkNamespace.Hyperliquid]: NetworkStackId.Hyperliquid,
	[NetworkNamespace.Lightning]: NetworkStackId.Lightning,
	[NetworkNamespace.Litecoin]: NetworkStackId.Litecoin,
	[NetworkNamespace.Logos]: NetworkStackId.Logos,
	[NetworkNamespace.Monero]: NetworkStackId.Monero,
	[NetworkNamespace.Near]: NetworkStackId.Near,
	[NetworkNamespace.Polkadot]: NetworkStackId.PolkadotSdk,
	[NetworkNamespace.Quilibrium]: NetworkStackId.Quilibrium,
	[NetworkNamespace.Solana]: NetworkStackId.Solana,
	[NetworkNamespace.Tron]: NetworkStackId.Tron,
	[NetworkNamespace.Zcash]: NetworkStackId.Zcash,
	[NetworkNamespace.ZeroG]: NetworkStackId.ZeroG,
} as const satisfies Record<NetworkNamespace, NetworkStackId>

const executionEnvironmentIdsByNamespace = {
	[NetworkNamespace.Bittensor]: [
		ExecutionEnvironmentId.BittensorSubtensorRuntime,
	],
	[NetworkNamespace.Bitcoin]: [
		ExecutionEnvironmentId.BitcoinScript,
	],
	[NetworkNamespace.BitcoinCash]: [
		ExecutionEnvironmentId.BitcoinCashScript,
	],
	[NetworkNamespace.Cosmos]: [
		ExecutionEnvironmentId.CosmWasm,
	],
	[NetworkNamespace.Dogecoin]: [
		ExecutionEnvironmentId.BitcoinScript,
	],
	[NetworkNamespace.Elements]: [
		ExecutionEnvironmentId.ElementsScript,
	],
	[NetworkNamespace.Evm]: [
		ExecutionEnvironmentId.Evm,
	],
	[NetworkNamespace.Filecoin]: [
		ExecutionEnvironmentId.FilecoinVm,
	],
	[NetworkNamespace.Hyperliquid]: [
		ExecutionEnvironmentId.HyperEvm,
	],
	[NetworkNamespace.Lightning]: [
		ExecutionEnvironmentId.LightningProtocol,
	],
	[NetworkNamespace.Litecoin]: [
		ExecutionEnvironmentId.BitcoinScript,
	],
	[NetworkNamespace.Logos]: [
		ExecutionEnvironmentId.LogosBlockchainRuntime,
	],
	[NetworkNamespace.Monero]: [],
	[NetworkNamespace.Near]: [
		ExecutionEnvironmentId.NearRuntime,
	],
	[NetworkNamespace.Polkadot]: [
		ExecutionEnvironmentId.SubstrateRuntime,
	],
	[NetworkNamespace.Quilibrium]: [
		ExecutionEnvironmentId.QuilibriumQcl,
	],
	[NetworkNamespace.Solana]: [
		ExecutionEnvironmentId.SolanaSvm,
	],
	[NetworkNamespace.Tron]: [
		ExecutionEnvironmentId.TronTvm,
	],
	[NetworkNamespace.Zcash]: [
		ExecutionEnvironmentId.BitcoinScript,
	],
	[NetworkNamespace.ZeroG]: [
		ExecutionEnvironmentId.ZeroGChainEvm,
		ExecutionEnvironmentId.ZeroGServingFramework,
	],
} as const satisfies Record<NetworkNamespace, readonly ExecutionEnvironmentId[]>

const consensusMechanismIdsByNamespace = {
	[NetworkNamespace.Bittensor]: [
		ConsensusMechanismId.BittensorYumaConsensus,
	],
	[NetworkNamespace.Bitcoin]: [
		ConsensusMechanismId.NakamotoProofOfWork,
	],
	[NetworkNamespace.BitcoinCash]: [
		ConsensusMechanismId.NakamotoProofOfWork,
	],
	[NetworkNamespace.Cosmos]: [
		ConsensusMechanismId.CometBft,
	],
	[NetworkNamespace.Dogecoin]: [
		ConsensusMechanismId.DogecoinAuxProofOfWork,
	],
	[NetworkNamespace.Elements]: [],
	[NetworkNamespace.Evm]: [
		ConsensusMechanismId.EthereumBeaconProofOfStake,
	],
	[NetworkNamespace.Filecoin]: [
		ConsensusMechanismId.FilecoinExpectedConsensus,
	],
	[NetworkNamespace.Hyperliquid]: [
		ConsensusMechanismId.HyperBft,
	],
	[NetworkNamespace.Lightning]: [],
	[NetworkNamespace.Litecoin]: [
		ConsensusMechanismId.NakamotoProofOfWork,
	],
	[NetworkNamespace.Logos]: [
		ConsensusMechanismId.LogosBedrock,
	],
	[NetworkNamespace.Monero]: [
		ConsensusMechanismId.MoneroRandomXProofOfWork,
	],
	[NetworkNamespace.Near]: [
		ConsensusMechanismId.NearNightshade,
	],
	[NetworkNamespace.Polkadot]: [
		ConsensusMechanismId.PolkadotNposBabeGrandpa,
	],
	[NetworkNamespace.Quilibrium]: [
		ConsensusMechanismId.QuilibriumProofOfMeaningfulWork,
	],
	[NetworkNamespace.Solana]: [
		ConsensusMechanismId.SolanaProofOfHistoryTowerBft,
	],
	[NetworkNamespace.Tron]: [
		ConsensusMechanismId.TronDpos,
	],
	[NetworkNamespace.Zcash]: [
		ConsensusMechanismId.ZcashProofOfWork,
	],
	[NetworkNamespace.ZeroG]: [
		ConsensusMechanismId.ZeroGProofOfStake,
	],
} as const satisfies Record<NetworkNamespace, readonly ConsensusMechanismId[]>

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
			stringify(otherProposal[EntityMetaKey.Selector]) === stringify(proposal[EntityMetaKey.Selector])
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
			entityType: EntityType.MarketVenue,
			resolve: {
				[MarketVenueSelector.MarketVenueId]: async ({ marketVenueId }) => {
					const { marketVenueById } = await import('$/constants/MarketVenue.ts')
					return {
						label: marketVenueById[marketVenueId].label,
					}
				}
			},
		})({
			fields: {
				label: (marketVenue) => marketVenue.label,
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
						symbol: coin.symbol,
					}
				}
			},
		})({
			fields: {
				symbol: (coin) => coin.symbol,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async ({ $network, type }) => {
					if (
					type !== CoinInstanceType.NativeCurrency
					|| Number($network.caip2.reference) !== 1
					) {
						throw new Error('Constants_Internal: CoinInstance not found')
					}
					return {
						coinId: CoinId.ETH,
						symbol: 'ETH',
						decimals: 18,
						representation: CoinInstanceRepresentation.IssuerNative,
					}
				},
				[EvmCoinInstanceSelector.NetworkTypeContract]: async ({ $network, type }) => {
					if (
					type !== CoinInstanceType.NativeCurrency
					|| Number($network.caip2.reference) !== 1
					) {
						throw new Error('Constants_Internal: CoinInstance not found')
					}
					return {
						coinId: CoinId.ETH,
						symbol: 'ETH',
						decimals: 18,
						representation: CoinInstanceRepresentation.IssuerNative,
					}
				},
			},
		})({
			fields: {
				coinId: (coinInstance) => coinInstance.coinId,
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
						environment: network.environment,
					}
				},
				[NetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null)
							throw new Error(`Constants_Internal: Network not found`)

					return {
						slug: network.slug,
						name: network.name,
						...('caip2' in network && {
							caip2: network.caip2,
						}),
						namespace: network.namespace,
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
						rpcEndpoints: [
							{
								url: 'https://evmrpc.0g.ai',
								transportType: TransportType.Http,
								providerName: '0G',
							},
						],
						explorerEndpoints: [
							{
								url: 'https://chainscan.0g.ai',
								transportType: TransportType.Http,
								providerName: '0G ChainScan',
							},
						],
						storageEndpoints: [
							{
								url: 'https://storagescan.0g.ai',
								transportType: TransportType.Http,
								providerName: '0G StorageScan',
							},
						],
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
				rpcEndpoints: (network) => network.rpcEndpoints,
				explorerEndpoints: (network) => network.explorerEndpoints,
				storageEndpoints: (network) => network.storageEndpoints,
				$executionNetwork: (network) => network.$executionNetwork,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) throw new Error('Constants_Internal: QuilibriumNetwork not found')
					return {
						slug: network.slug,
						name: network.name,
						namespace: network.namespace,
						environment: network.environment,
					}
				}
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[SolanaNetworkSelector.Caip2]: async ({ caip2 }) => {
					const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
					if (!('caip2' in network)) throw new Error('Constants_Internal: SolanaNetwork missing CAIP-2')
					return {
						slug: network.slug,
						name: network.name,
						caip2: network.caip2,
						namespace: network.namespace,
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
				}
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
				rpcEndpoints: (network) => network.rpcEndpoints,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NetworkStack,
			resolve: {
				[NetworkStackSelector.NetworkStackId]: async ({ networkStackId }) => ({
					label: networkStackByNetworkStackId[networkStackId].label,
				})
			},
		})({
			fields: {
				label: (networkStack) => networkStack.label,
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
			entityType: EntityType.ExecutionEnvironment,
			resolve: {
				[ExecutionEnvironmentSelector.ExecutionEnvironmentId]: async ({ executionEnvironmentId }) => ({
					label: executionEnvironmentByExecutionEnvironmentId[executionEnvironmentId].label,
				})
			},
		})({
			fields: {
				label: (executionEnvironment) => executionEnvironment.label,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ConsensusMechanism,
			resolve: {
				[ConsensusMechanismSelector.ConsensusMechanismId]: async ({ consensusMechanismId }) => ({
					label: consensusMechanismById[consensusMechanismId].label,
				})
			},
		})({
			fields: {
				label: (consensusMechanism) => consensusMechanism.label,
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
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async ({ realm }) => ({
					label: specificationRealmById[realm].label,
					...(specificationRealmById[realm].labelPlural != null && {
						labelPlural: specificationRealmById[realm].labelPlural,
					}),
					slug: specificationRealmById[realm].slug,
				}),
			},
		})({
			fields: {
				label: (specificationRealm) => specificationRealm.label,
				labelPlural: (specificationRealm) => specificationRealm.labelPlural,
				slug: (specificationRealm) => specificationRealm.slug,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ category }) => (
					{
						label: proposalCategoryById[category].label,
						labelPlural: proposalCategoryById[category].labelPlural,
						slug: proposalCategoryById[category].slug,
					}
				)
			},
		})({
			fields: {
				label: (proposalKind) => proposalKind.label,
				labelPlural: (proposalKind) => proposalKind.labelPlural,
				slug: (proposalKind) => proposalKind.slug,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://w3c.github.io/activitypub/',
					homeUrl: 'https://www.w3.org/TR/activitypub/',
					protocolName: 'ActivityPub (federated)',
					registryLabel: 'Configured Mastodon-compatible instances + curated seed actors',
					topology: 'Constants seeds + live REST (multi-instance) -> network -> actors -> notes -> thread',
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
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[AtprotoNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://atproto.com/specs/atp',
					homeUrl: 'https://atproto.com',
					protocolName: 'AT Protocol (Bluesky / appviews)',
					registryLabel: 'Curated seed actors + public appview feeds',
					topology: 'Constants seeds + live XRPC -> network -> actors -> posts',
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
			entityType: EntityType.EnsProtocol,
			resolve: {
				[EnsProtocolSelector.Scope]: async ({ scope }) => ensProtocolByScope[scope]
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
			entityType: EntityType.EvmProtocol,
			resolve: {
				[EvmProtocolSelector.Scope]: async ({ scope }) => evmProtocolByScope[scope]
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
			entityType: EntityType.IpfsProtocol,
			resolve: {
				[IpfsProtocolSelector.Scope]: async ({ scope }) => ipfsProtocolByScope[scope]
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
			entityType: EntityType.SwarmProtocol,
			resolve: {
				[SwarmProtocolSelector.Scope]: async ({ scope }) => swarmProtocolByScope[scope]
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
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[FarcasterNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://docs.farcaster.xyz',
					homeUrl: 'https://www.farcaster.xyz',
					protocolName: 'Farcaster',
					registryLabel: 'Client API registries + Snapchain / Neynar feeds',
					topology: 'live REST hub + indexer -> network -> feeds / channels / users -> casts',
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
			entityType: EntityType.LensNetwork,
			resolve: {
				[LensNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://docs.lens.xyz',
					homeUrl: 'https://lens.xyz',
					protocolName: 'Lens',
					registryLabel: 'Curated seed accounts + GraphQL author feeds',
					topology: 'Constants seeds + live GraphQL -> network -> accounts -> posts',
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
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://github.com/nostr-protocol/nips',
					homeUrl: 'https://nostr.com',
					protocolName: 'Nostr',
					registryLabel: 'Curated seed profiles + relay/indexer feeds',
					topology: 'Constants seeds + live REST/indexer -> network -> relays / profiles -> notes / reposts / articles',
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
			entityType: EntityType.NostrProfile,
			resolve: {
				[NostrProfileSelector.CanonicalPubkey]: async ({ pubkey }) => ({
					pubkey,
					displayName: undefined,
					about: undefined,
					nip05: undefined,
					lud16: undefined,
					lud06: undefined,
					website: undefined,
					metadataUpdatedAt: undefined,
					$icon: undefined,
					$banner: undefined,
					$$notes: [],
					$$articles: [],
					$$reposts: [],
				})
			},
		})({
			fields: {
				pubkey: (profile) => profile.pubkey,
				displayName: (profile) => profile.displayName,
				about: (profile) => profile.about,
				nip05: (profile) => profile.nip05,
				lud16: (profile) => profile.lud16,
				lud06: (profile) => profile.lud06,
				website: (profile) => profile.website,
				metadataUpdatedAt: (profile) => profile.metadataUpdatedAt,
				$icon: (profile) => profile.$icon,
				$banner: (profile) => profile.$banner,
				$$notes: (profile) => profile.$$notes,
				$$articles: (profile) => profile.$$articles,
				$$reposts: (profile) => profile.$$reposts,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrRelay,
			resolve: {
				[NostrRelaySelector.RelayUrl]: async ({ relayUrl }) => ({
					relayUrl,
					name: relayUrl.replace(/^wss:\/\//i, ''),
					description: undefined,
					software: undefined,
					version: undefined,
					supportedNipCount: undefined,
					isPaid: undefined,
					limit: undefined,
				})
			},
		})({
			fields: {
				relayUrl: (relay) => relay.relayUrl,
				name: (relay) => relay.name,
				description: (relay) => relay.description,
				software: (relay) => relay.software,
				version: (relay) => relay.version,
				supportedNipCount: (relay) => relay.supportedNipCount,
				isPaid: (relay) => relay.isPaid,
				limit: (relay) => relay.limit,
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
						createdAt: note.createdAt,
						tags: [],
						$author: {
							[EntityMetaKey.Selector]: {
								pubkey: note.pubkey,
							},
						},
						replyToEventId: undefined,
						rootEventId: undefined,
						$replyToNote: undefined,
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
				tags: (note) => note.tags,
				$author: (note) => note.$author,
				replyToEventId: (note) => note.replyToEventId,
				rootEventId: (note) => note.rootEventId,
				$replyToNote: (note) => note.$replyToNote,
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
					registryLabel: 'Curated seed subreddits + live /r/popular hot feed',
					topology: 'Constants seeds + Reddit API (/r/popular/hot) -> network -> subreddits -> links -> comments',
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
			entityType: EntityType.RssNetwork,
			resolve: {
				[RssNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://www.rssboard.org/rss-specification',
					homeUrl: 'https://www.rssboard.org',
					protocolName: 'RSS / Atom syndication',
					registryLabel: 'Constants feedUrl seeds + live item streams',
					topology: 'Constants feedUrl seeds + Rss_Rest XML / Rss2Json proxy -> network -> feeds -> items',
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
			entityType: EntityType.XNetwork,
			resolve: {
				[XNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://developer.x.com',
					homeUrl: 'https://x.com',
					protocolName: 'X (API v2)',
					registryLabel: 'Curated seed users + live user timelines',
					topology: 'Constants seeds + live REST -> network -> users -> posts',
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
					registryLabel: 'Session-local wallets + conversations',
					topology: 'Constants metadata + session-local -> network -> conversations',
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
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[YouTubeNetworkSelector.Scope]: async () => ({
					docsUrl: 'https://developers.google.com/youtube/v3',
					homeUrl: 'https://www.youtube.com',
					protocolName: 'YouTube Data API',
					registryLabel: 'Curated seed channels + live channel uploads',
					topology: 'Constants seeds + live REST -> network -> channels / playlists -> videos',
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
				entityType: EntityType.YouTubeChannel,
				resolve: {
				[YouTubeChannelSelector.ChannelId]: async ({ channelId }) => {
						const channel = youtubeNetworkSeedChannelByChannelId[channelId]
						if (channel == null) throw new Error(`Constants_Internal: YouTubeChannel ${channelId} not found`)

						return channel
					}
				},
			})({
				fields: {
					title: (entity) => entity.title,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType.YouTubePlaylist,
				resolve: {
				[YouTubePlaylistSelector.PlaylistId]: async ({ playlistId }) => {
						const playlist = youtubeNetworkSeedPlaylistByPlaylistId[playlistId]
						if (playlist == null) throw new Error(`Constants_Internal: YouTubePlaylist ${playlistId} not found`)

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
				entityType: EntityType.YouTubeVideo,
				resolve: {
				[YouTubeVideoSelector.VideoId]: async ({ videoId }) => {
						const video = youtubeNetworkSeedVideoByVideoId[videoId]
						if (video == null) throw new Error(`Constants_Internal: YouTubeVideo ${videoId} not found`)

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
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => []
			},
		})({
			fields: {
				$$vaults: (entity) => entity,
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
					return {
						[EntityMetaKey.Selector]: {
							networkStackId: networkStackIdByNamespace[namespace],
						},
					}
				},
				[NetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) return undefined
					const namespace: NetworkNamespace = network.namespace
					return {
						[EntityMetaKey.Selector]: {
							networkStackId: networkStackIdByNamespace[namespace],
						},
					}
				},
			},
		})({
			fields: {
				$networkStack: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) return undefined
					const namespace: NetworkNamespace = network.namespace
					return {
						[EntityMetaKey.Selector]: {
							networkStackId: networkStackIdByNamespace[namespace],
						},
					}
				}
			},
		})({
			fields: {
				$networkStack: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) return undefined
					const namespace: NetworkNamespace = network.namespace
					return {
						[EntityMetaKey.Selector]: {
							networkStackId: networkStackIdByNamespace[namespace],
						},
					}
				}
			},
		})({
			fields: {
				$networkStack: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
					const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
					const namespace: NetworkNamespace = network.namespace
					return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
						[EntityMetaKey.Selector]: {
							executionEnvironmentId,
						},
					}))
				},
				[NetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					const namespace: NetworkNamespace = network.namespace
					return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
						[EntityMetaKey.Selector]: {
							executionEnvironmentId,
						},
					}))
				},
			},
		})({
			fields: {
				$$executionEnvironments: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					const namespace: NetworkNamespace = network.namespace
					return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
						[EntityMetaKey.Selector]: {
							executionEnvironmentId,
						},
					}))
				}
			},
		})({
			fields: {
				$$executionEnvironments: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					const namespace: NetworkNamespace = network.namespace
					return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
						[EntityMetaKey.Selector]: {
							executionEnvironmentId,
						},
					}))
				}
			},
		})({
			fields: {
				$$executionEnvironments: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
					const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
					const namespace: NetworkNamespace = network.namespace
					return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
						[EntityMetaKey.Selector]: {
							consensusMechanismId,
						},
					}))
				},
				[NetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) return []
					const namespace: NetworkNamespace = network.namespace
					return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
						[EntityMetaKey.Selector]: {
							consensusMechanismId,
						},
					}))
				},
			},
		})({
			fields: {
				$$consensusMechanisms: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) return []
					const namespace: NetworkNamespace = network.namespace
					return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
						[EntityMetaKey.Selector]: {
							consensusMechanismId,
						},
					}))
				}
			},
		})({
			fields: {
				$$consensusMechanisms: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) return []
					const namespace: NetworkNamespace = network.namespace
					return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
						[EntityMetaKey.Selector]: {
							consensusMechanismId,
						},
					}))
				}
			},
		})({
			fields: {
				$$consensusMechanisms: (entity) => entity,
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
									slug,
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
					specificationRealmById == null ?
						[]
					:
						Object.values(specificationRealmById).map((realmRow) => ({
							[EntityMetaKey.Selector]: {
								realm: realmRow.id,
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
						[EntityMetaKey.Selector]: proposalKind,
					}))
				)
			},
		})({
			fields: {
				$$proposalKinds: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async (entitySelector: EntitySelector<typeof schema, EntityType.SpecificationRealm>) => (
					proposalKinds
						.filter((proposalKind) => (
						proposalKind.realm === entitySelector.realm
						))
						.map((proposalKind) => ({
							[EntityMetaKey.Selector]: proposalKind,
						}))
				)
			},
		})({
			fields: {
				$$proposalKinds: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ realm }: EntitySelector<typeof schema, EntityType.SpecificationProposalKind>) => (
					{
						[EntityMetaKey.Selector]: {
							realm: realm,
						},
					}
				)
			},
		})({
			fields: {
				$specificationRealm: (entity) => entity,
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
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { marketVenues } = await import('$/constants/MarketVenue.ts')
					return [...marketVenues].map((marketVenue) => (
						{
							[EntityMetaKey.Selector]: {
								marketVenueId: marketVenue.id,
							},
						}
					))
				}
			},
		})({
			fields: {
				$$marketVenues: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.MarketVenue,
			resolve: {
				[MarketVenueSelector.MarketVenueId]: async (entitySelector: EntitySelector<typeof schema, EntityType.MarketVenue>) => {
					const { coins } = await import('$/constants/Coin.ts')
					return (
						coins.flatMap((coin) => {
						const marketSelector = marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coin.id])
						return (
							marketSelector.$marketVenue.marketVenueId === entitySelector.marketVenueId ?
								[
									{
										[EntityMetaKey.Selector]: marketSelector,
									},
								]
							:
								[]
						)
						})
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
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coin.id]),
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
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { coins } = await import('$/constants/Coin.ts')
					return (
						coins.map((coin) => (
						{
							[EntityMetaKey.Selector]: {
								$market: marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coin.id]),
							},
						}
						))
					)
				}
			},
		})({
			fields: {
				$$marketPrices: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => (
					catalogCoinSpotUsdMarkets.slice(0, resolverContextRowLimit(context)).map((catalogMarket) => (
						{
							[EntityMetaKey.Selector]: {
								$market: marketSelectorFromCatalogCoinCurrencyMarket(catalogMarket),
								timeInterval: marketOhlcDailyTimeInterval,
								timestampMs: currencyCatalogSnapshotTimestampMs,
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
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coinId]),
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
					(catalogMarketsWithCoinAsQuoteByQuoteCoinId[coinId] ).map((catalogMarket) => ({
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
					(catalogMarketsWithCurrencyAsBaseByIso4217[iso4217] ?? []).map((catalogMarket: CatalogCurrencyCurrencyMarket) => ({
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
							catalogCoinSpotUsdMarkets.map((catalogMarket) => ({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogMarket),
							}))
						:
							[]
					),
					...catalogSpotMarketsWithCurrencyAsBase
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
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => {
						if (coinId !== CoinId.ETH) return []
						const ethNativeCoinInstance: Entity<typeof schema, EntityType.EvmCoinInstance> = {
							[EntityMetaKey.Selector]: {
								$network: {
									caip2: {
										namespace: 'eip155',
										reference: '1',
									},
								},
								type: CoinInstanceType.NativeCurrency,
							},
							coinId: CoinId.ETH,
							symbol: 'ETH',
							decimals: 18,
							representation: CoinInstanceRepresentation.IssuerNative,
						}
						return [
							ethNativeCoinInstance,
						]
				}
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
					if (
					type === CoinInstanceType.NativeCurrency
					&& Number($network.caip2.reference) === 1
					) {
						return CoinInstanceRepresentation.IssuerNative
					}
					throw new Error('Constants_Internal: CoinInstance representation unsupported')
				},
				[EvmCoinInstanceSelector.NetworkTypeContract]: async ({ $network, type }) => {
					if (
					type === CoinInstanceType.NativeCurrency
					&& Number($network.caip2.reference) === 1
					) {
						return CoinInstanceRepresentation.IssuerNative
					}
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
					&& stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[entitySelector.$base.$coin.coinId])) === stringify(entitySelector)
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
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market }: EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
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
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
					return (
						networkExecutionUpgrades.some((executionUpgrade) => (
						String(executionUpgrade.chainId) === caip2.reference
						&& executionUpgrade.layer === NetworkExecutionUpgradeLayer.Blob
						))
					)
				}
			},
		})({
			fields: {
				hasBlobParameterExecutionUpgrade: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
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
					if (proposals.length === 0)
						throw new Error(`Constants_Internal: NetworkUpgrade ${upgradeId} has no $$proposals`)
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
					const proposals = ethereumProposalRefs(networkExecutionUpgrade.proposalIds)
					if (proposals.length === 0)
						throw new Error(`Constants_Internal: NetworkExecutionUpgrade ${upgradeId} has no $$proposals`)
					return proposals
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
					throw new Error(`Constants_Internal: NetworkConsensusUpgrade ${upgradeId} has no $$proposals`)
				}
			},
		})({
			fields: {
				$$proposals: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.LensNetwork,
			resolve: {
				[LensNetworkSelector.Scope]: async () => (
					lensNetworkSeedAccounts.map((account) => ({
						[EntityMetaKey.Selector]: {
							address: account.address,
						},
					}))
				)
			},
		})({
			fields: {
				$$lensAccounts: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => (
					nostrNetworkSeedProfiles.map((profile) => ({
						[EntityMetaKey.Selector]: {
							pubkey: profile.pubkey,
						},
					}))
				)
			},
		})({
			fields: {
				$$nostrProfiles: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => (
					nostrNetworkSeedNotes.map((note) => ({
						[EntityMetaKey.Selector]: {
							eventId: note.eventId,
						},
					}))
				)
			},
		})({
			fields: {
				$$nostrNotes: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => []
			},
		})({
			fields: {
				$$nostrReposts: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => []
			},
		})({
			fields: {
				$$nostrArticles: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => (
					nostrNetworkSeedRelays.map((relay) => ({
						[EntityMetaKey.Selector]: {
							relayUrl: relay.relayUrl,
						},
					}))
				)
			},
		})({
			fields: {
				$$nostrRelays: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[AtprotoNetworkSelector.Scope]: async () => (
					atprotoNetworkSeedActors.map((actor) => ({
						[EntityMetaKey.Selector]: {
							did: actor.did,
						},
					}))
				)
			},
			})({
				fields: {
					$$atprotoActors: (entity) => entity,
				},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType.AtprotoNetwork,
				resolve: {
					[AtprotoNetworkSelector.Scope]: async () => (
						atprotoNetworkSeedPosts.map((post) => ({
							[EntityMetaKey.Selector]: {
								uri: post.uri,
							},
						}))
					)
				},
				})({
					fields: {
						$$atprotoPosts: (entity) => entity,
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
					entityType: EntityType.ActivityPubNetwork,
					resolve: {
				[ActivityPubNetworkSelector.Scope]: async () => (
					activityPubNetworkSeedActors.map((actor) => ({
						[EntityMetaKey.Selector]: {
							instanceOrigin: actor.instanceOrigin,
							acct: actor.acct,
						},
					}))
				)
			},
		})({
			fields: {
				$$activityPubActors: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditNetwork,
			resolve: {
				[RedditNetworkSelector.Scope]: async () => (
					redditNetworkSeedSubreddits.map((subreddit) => ({
						[EntityMetaKey.Selector]: {
							name: subreddit.name,
						},
					}))
				)
			},
		})({
			fields: {
				$$redditSubreddits: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }) => {
					if (!redditNetworkSeedSubreddits.some((subreddit) => subreddit.name === name))
						throw new Error('Constants_Internal: RedditSubreddit seed not found')

					return {
						name,
						title: `r/${name}`,
						publicDescription: undefined,
						createdAt: undefined,
						over18: undefined,
						$icon: undefined,
					}
				}
			},
		})({
			fields: {
				name: (subreddit) => subreddit.name,
				title: (subreddit) => subreddit.title,
				publicDescription: (subreddit) => subreddit.publicDescription,
				createdAt: (subreddit) => subreddit.createdAt,
				over18: (subreddit) => subreddit.over18,
				$icon: (subreddit) => subreddit.$icon,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }) => {
					if (!redditNetworkSeedSubreddits.some((subreddit) => subreddit.name === name))
						throw new Error('Constants_Internal: RedditSubreddit seed not found')

					return []
				}
			},
		})({
			fields: {
				$$links: (links) => links,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }) => {
					if (!redditNetworkSeedSubreddits.some((subreddit) => subreddit.name === name))
						throw new Error('Constants_Internal: RedditSubreddit seed not found')

					return []
				}
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
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
						selftext: undefined,
						url: undefined,
						permalink: link.permalink,
						author: link.author,
						createdAt: link.createdAt,
						$subreddit: {
							[EntityMetaKey.Selector]: {
								name: link.subredditName,
							},
						},
						$$comments: [],
						$$timestamps: [],
					}
				}
			},
		})({
			fields: {
				fullname: (link) => link.fullname,
				title: (link) => link.title,
				selftext: (link) => link.selftext,
				url: (link) => link.url,
				permalink: (link) => link.permalink,
				author: (link) => link.author,
				createdAt: (link) => link.createdAt,
				$subreddit: (link) => link.$subreddit,
				$$comments: (link) => link.$$comments,
				$$timestamps: (link) => link.$$timestamps,
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
						depth: undefined,
						$link: {
							[EntityMetaKey.Selector]: {
								fullname: comment.linkFullname,
							},
						},
						$parentComment: undefined,
						$$replies: [],
						$$timestamps: [],
					}
				}
			},
		})({
			fields: {
				fullname: (comment) => comment.fullname,
				body: (comment) => comment.body,
				author: (comment) => comment.author,
				createdAt: (comment) => comment.createdAt,
				depth: (comment) => comment.depth,
				$link: (comment) => comment.$link,
				$parentComment: (comment) => comment.$parentComment,
				$$replies: (comment) => comment.$$replies,
				$$timestamps: (comment) => comment.$$timestamps,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RssNetwork,
			resolve: {
				[RssNetworkSelector.Scope]: async () => (
					rssNetworkSeedFeeds.map((feed) => ({
						[EntityMetaKey.Selector]: {
							feedUrl: feed.feedUrl,
						},
					}))
				)
			},
		})({
			fields: {
				$$rssFeeds: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.XNetwork,
			resolve: {
				[XNetworkSelector.Scope]: async () => (
					xNetworkSeedUsers.map((user) => ({
						[EntityMetaKey.Selector]: {
							id: user.id,
						},
					}))
				)
			},
		})({
			fields: {
				$$xUsers: (entity) => entity,
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
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[YouTubeNetworkSelector.Scope]: async () => (
					[...youtubeNetworkSeedChannels].map((channel) => ({
						[EntityMetaKey.Selector]: {
							channelId: channel.channelId,
						},
					}))
				)
			},
		})({
			fields: {
				$$youtubeChannels: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[YouTubeNetworkSelector.Scope]: async () => (
					[...youtubeNetworkSeedVideos].map((video) => ({
						[EntityMetaKey.Selector]: {
							videoId: video.videoId,
						},
					}))
				)
			},
		})({
			fields: {
				$$youtubeVideos: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[YouTubeNetworkSelector.Scope]: async () => (
					[...youtubeNetworkSeedPlaylists].map((playlist) => ({
						[EntityMetaKey.Selector]: {
							playlistId: playlist.playlistId,
						},
					}))
				)
			},
		})({
			fields: {
				$$youtubePlaylists: (entity) => entity,
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
							}]
						})
				}
			},
		})({
			fields: {
				$$contracts: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) return []
					const namespace: NetworkNamespace = network.namespace
					const coinId = nativeAssetCoinIdByNamespace[namespace]
					if (coinId == null) return []
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: {
									slug: slug,
								},
								kind: AssetInstanceKind.Native,
								assetKey: coinId,
							},
							coinId,
							symbol: coinId,
						},
					]
				}
			},
		})({
			fields: {
				$$nativeAssets: (entity) => entity,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.Slug]: async ({ slug }) => {
					const network = networkBySlug[slug]
					if (network == null) return []
					const namespace: NetworkNamespace = network.namespace
					const coinId = nativeAssetCoinIdByNamespace[namespace]
					if (coinId == null) return []
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: {
									slug: slug,
								},
								kind: AssetInstanceKind.Native,
								assetKey: coinId,
							},
							coinId,
						},
					]
				}
			},
		})({
			fields: {
				$$nativeAssets: (entity) => entity,
			},
		}),
	],
}
