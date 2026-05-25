import { stringify } from 'devalue'

import { CoinId } from '$/constants/Coin.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import { MarketAssetKind, MarketKind, MarketTimeIntervalUnit } from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { ProposalCategory, ProposalRealm } from '$/constants/Proposal.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { Source } from '$/sources/$Source.ts'


/**
 * Probe hex: canonical lowercase `0x` + digits (`$ZeroExHex` / `EvmAddress`). No strip/re-prefix.
 */
const VITALIK_ADDRESS = '0xd8da6bf26964af9d7eed9e403e826090792bed6a' as const

const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const

export const SAMPLE_TX_HASH = (
	'0xdacd6abf5b2814b28c68c59981f269c615796e7f0cba2009f4bf5edfdd9595ab' as const
)

const ERC4337_SMART_ACCOUNT_ADDRESS = '0x0000000000001d8a2e7bf6bc369525a2654aa298' as const

const ERC4337_BUNDLER_ADDRESS = '0xf0ac778fb2e56bab4edd7f25c2ed2f333d165b8d' as const

const ERC4337_PAYMASTER_ADDRESS = '0x6599bba2a055f3c769cba1a2d462a75429bd7bf7' as const

const ERC4337_ACCOUNT_FACTORY_ADDRESS = '0xcad776fce9c3b3db6724aeb4c7fa2f5f3c088253' as const

const SAMPLE_USER_OPERATION_HASH = (
	'0xca87534346367dbf4ff6675627a3e43635db5a36bd8ef99ffcd20a63d1555ef5' as const
)

/** Mainnet tx with ERC-20 token transfers and internal calls (Blockscout v2). */
const SAMPLE_TOKEN_TRANSFER_TX = (
	'0x5e4763cd6b6f129869fff1d60bfadf1d37e1677cb8f1d8997299680da09d5b01' as const
)

const NOSTR_PROBE_PUBKEY = (
	'82341f880b9929660a178be448011edd0e5839858c4fc1480b5fd4b6205d127b' as const
)

export { NOSTR_PROBE_PUBKEY }

const NOSTR_PROBE_RELAY_URL = 'wss://relay.damus.io' as const

const NOSTR_PROBE_REPOST_EVENT_ID = `${'b'.repeat(64)}` as const

const NOSTR_PROBE_REACTION_EVENT_ID = `${'c'.repeat(64)}` as const

const NOSTR_PROBE_ARTICLE_IDENTIFIER = 'e2e-probe-article' as const

const YOUTUBE_PROBE_PLAYLIST_ID = 'UU_x5XG1OV2P6uZZ5FSM9Ttw' as const

const YOUTUBE_PROBE_VIDEO_ID = 'jNQXAC9IVRw' as const

const YOUTUBE_PROBE_COMMENT_ID = 'e2e-probe-comment' as const

/** EVM explorer routes for e2e smoke / boundary (see also `routeViewSmokePaths`). */
export const e2eEvmExplorerRoutePaths = {
	hub: '/evm',
	calldata: '/evm/calldata',
	calldataDecoder: '/evm/calldata-decoder',
	selectors: '/evm/selectors',
	topics: '/evm/topics',
	errors: '/evm/errors',
	networkTransaction: `/network/1/tx/${SAMPLE_TX_HASH}`,
	networkTransactionLog: `/network/1/tx/${SAMPLE_TX_HASH}/log/0`,
} as const satisfies Record<string, `/${string}`>

/** Nostr / YouTube list routes for route-view smoke (see also `routeViewSmokePaths`). */
export const e2eNostrYouTubeRoutePaths = {
	nostrRelays: '/nostr/relays',
	nostrReposts: '/nostr/reposts',
	nostrReactions: '/nostr/reactions',
	nostrArticles: '/nostr/articles',
	nostrProfileDetail: `/nostr/profile/${NOSTR_PROBE_PUBKEY}`,
	youtubePlaylists: '/youtube/playlists',
} as const satisfies Record<string, `/${string}`>

/** Detail routes that depend on live indexer/API payloads; opt in via `routeViewSmokeOptionalDetailPathByLabel`. */
export const e2eNostrYouTubeOptionalDetailRoutePaths = {
	nostrRelay: `/nostr/relay/${encodeURIComponent(NOSTR_PROBE_RELAY_URL)}`,
	nostrRepost: `/nostr/repost/${NOSTR_PROBE_REPOST_EVENT_ID}`,
	nostrReaction: `/nostr/reaction/${NOSTR_PROBE_REACTION_EVENT_ID}`,
	nostrArticle: (
		`/nostr/article/${NOSTR_PROBE_PUBKEY}/${encodeURIComponent(NOSTR_PROBE_ARTICLE_IDENTIFIER)}`
	),
	youtubePlaylist: `/youtube/playlist/${encodeURIComponent(YOUTUBE_PROBE_PLAYLIST_ID)}`,
} as const satisfies Record<string, `/${string}`>

/** Mainnet type‑3 tx with EIP‑4844 sidecars — exercised by Blobscan REST probes. */
export const SAMPLE_BLOB_TX_HASH = (
	'0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca' as const
)

const CAST_HASH_32 = `0x${'a'.repeat(64)}` as const

export { CAST_HASH_32 }

const ERROR_SELECTOR = '0x08c379a0' as const

const TRANSFER_SELECTOR = '0xa9059cbb' as const

const TRANSFER_TOPIC = (
	'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' as const
)

export const ethUsdCatalogMarket = {
	$base: { kind: MarketAssetKind.Coin, $coin: { coinId: CoinId.ETH } },
	$quote: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: Iso4217.USD },
	},
	$marketVenue: { marketVenueId: MarketVenueId.Binance },
	marketKind: MarketKind.Spot,
} as const

const mainnet = { chainId: 1 }

const actorMainnetVitalik = {
	address: VITALIK_ADDRESS,
}

/** Blockscout-hosted mainnet omits Vitalik address activity; USDC contract has token + internal rows. */
const actorNetworkMainnetUsdc = {
	$network: mainnet,
	$actor: {
		address: USDC_ADDRESS,
	},
}

const coinInstanceUsdcMainnet = {
	$network: mainnet,
	type: CoinInstanceType.Erc20Token,
	$contract: {
		$network: mainnet,
		address: USDC_ADDRESS,
	},
} as const

const NATIVE_TOKEN = '0x0000000000000000000000000000000000000000' as const

/** LI.FI native placeholder; small ETH amount for live `GET /v1/quote`. */
const bridgeRouteEthMainnetToOptimism = {
	fromChainId: 1,
	toChainId: 10,
	fromToken: NATIVE_TOKEN,
	toToken: NATIVE_TOKEN,
	fromAmount: '1000000000000000',
	fromAddress: VITALIK_ADDRESS,
	slippage: 0.005,
} as const

/**
 * Probe entity ids for `entityResolvers` smoke shapes; must match each type’s Arktype `id`.
 */
export const probeEntityIdByType: Partial<Record<EntityType, EntityId<typeof schema, EntityType>>> = {
	[EntityType._Global]: {},

	[EntityType.ActivityPubActor]: {
		instanceOrigin: 'https://mastodon.social',
		localAccountId: '13179',
	},
	[EntityType.ActivityPubNetwork]: { scope: 'ActivityPubNetwork' },
	[EntityType.ActivityPubNote]: {
		instanceOrigin: 'https://mastodon.social',
		localStatusId: '116539053870420123',
	},

	[EntityType.Actor]: actorMainnetVitalik,

	[EntityType.ActorCoin]: {
		$actor: actorMainnetVitalik,
		$coinInstance: coinInstanceUsdcMainnet,
	},

	[EntityType.ActorCoinAllowance]: {
		$actorCoin: {
			$actor: actorMainnetVitalik,
			$coinInstance: coinInstanceUsdcMainnet,
		},
		$spender: {
			address: '0x0000000000000000000000000000000000000001',
		},
	},

	[EntityType.ActorNetwork]: actorNetworkMainnetUsdc,

	[EntityType.AtprotoActor]: { did: 'did:plc:z72i7hdynmk6x22kvon7fdpk' },
	[EntityType.AtprotoNetwork]: { scope: 'AtprotoNetwork' },
	[EntityType.AtprotoPost]: {
		uri: 'at://did:plc:z72i7hdynmk6x22kvon7fdpk/app.bsky.feed.post/3juzh037csq2b',
	},

	[EntityType.BeaconEpoch]: { $network: mainnet, epoch: 300_000 },
	[EntityType.BeaconSlot]: { $network: mainnet, slot: 9_500_000 },
	[EntityType.BeaconValidator]: {
		$network: mainnet,
		validatorIndex: 0,
	},

	[EntityType.BlockheadFarcasterAccountConnection]: { fid: 3 },

	[EntityType.BlockheadSource]: { id: 'e2e-probe-source' },
	[EntityType.BlockheadPanelTree]: { id: 'e2e-probe-panel-tree' },
	[EntityType.BlockheadRoom]: { id: 'e2e-probe-room' },
	[EntityType.BlockheadSession]: { id: 'e2e-probe-session' },
	[EntityType.BlockheadRoomPeer]: { id: 'e2e-probe-room-peer' },
	[EntityType.BlockheadSharedAddress]: { id: 'e2e-probe-shared-address' },
	[EntityType.StateChannel]: { id: 'e2e-probe-state-channel' },
	[EntityType.StateChannelDeposit]: { id: 'e2e-probe-state-channel-deposit-0' },
	[EntityType.StateChannelState]: { id: 'e2e-probe-state-channel-state-1' },
	[EntityType.StateChannelTransfer]: { id: 'e2e-probe-state-channel-transfer-1' },
	[EntityType.BlockheadAgentConversation]: { id: 'e2e-probe-agent-conversation' },
	[EntityType.BlockheadAgentConversationTurn]: { id: 'e2e-probe-agent-conversation-turn' },

	[EntityType.BridgeTransaction]: {
		$account: actorMainnetVitalik,
		$sourceTx: {
			$network: mainnet,
			txHash: SAMPLE_TX_HASH,
		},
		createdAt: 0,
	},

	[EntityType.Coin]: { coinId: CoinId.ETH },
	[EntityType.CoinInstance]: {
		$network: mainnet,
		type: CoinInstanceType.NativeCurrency,
	},

	[EntityType.CoinBridgeCapability]: {
		$fromInstance: {
			$network: mainnet,
			type: CoinInstanceType.NativeCurrency,
		},
		$toInstance: {
			$network: { chainId: 10 },
			type: CoinInstanceType.NativeCurrency,
		},
		toolKey: 'across',
	},

	[EntityType.BridgeRoute]: bridgeRouteEthMainnetToOptimism,

	[EntityType.BridgeRouteStep]: {
		$route: bridgeRouteEthMainnetToOptimism,
		index: 0,
	},

	[EntityType.EnsName]: { name: 'vitalik.eth' },

	[EntityType.EnsProtocol]: { scope: 'EnsProtocol' },

	[EntityType.EvmBlob]: {
		$network: mainnet,
		txHash: SAMPLE_BLOB_TX_HASH,
		blobIndex: 0,
	},
	[EntityType.EvmBlock]: {
		$network: mainnet,
		blockNumber: 18_000_000n,
	},
	[EntityType.Erc4337SmartAccount]: {
		$network: mainnet,
		address: ERC4337_SMART_ACCOUNT_ADDRESS,
	},
	[EntityType.Erc4337Bundler]: {
		$network: mainnet,
		address: ERC4337_BUNDLER_ADDRESS,
	},
	[EntityType.Erc4337Paymaster]: {
		$network: mainnet,
		address: ERC4337_PAYMASTER_ADDRESS,
	},
	[EntityType.Erc4337AccountFactory]: {
		$network: mainnet,
		address: ERC4337_ACCOUNT_FACTORY_ADDRESS,
	},
	[EntityType.EvmContract]: {
		$network: mainnet,
		address: USDC_ADDRESS,
	},
	[EntityType.EvmContractVerification]: {
		$network: mainnet,
		address: USDC_ADDRESS,
	},
	[EntityType.EvmContractCompilation]: {
		$network: mainnet,
		address: USDC_ADDRESS,
	},
	[EntityType.EvmContractSourceBundle]: {
		$network: mainnet,
		address: USDC_ADDRESS,
	},
	[EntityType.EvmCalldata]: { hex: TRANSFER_SELECTOR },
	[EntityType.EvmError]: { hex: ERROR_SELECTOR },
	[EntityType.EvmProtocol]: { scope: 'EvmProtocol' },
	[EntityType.EvmLog]: {
		$network: mainnet,
		txHash: SAMPLE_TX_HASH,
		logIndex: 0,
	},
	[EntityType.EvmSelector]: { hex: TRANSFER_SELECTOR },
	[EntityType.EvmTopic]: {
		hex: TRANSFER_TOPIC,
	},
	[EntityType.EvmTransaction]: {
		$network: mainnet,
		txHash: SAMPLE_TOKEN_TRANSFER_TX,
	},
	[EntityType.EvmTokenTransfer]: {
		$network: mainnet,
		txHash: SAMPLE_TOKEN_TRANSFER_TX,
		transferIndex: 0,
	},
	[EntityType.EvmInternalTransfer]: {
		$network: mainnet,
		txHash: SAMPLE_TOKEN_TRANSFER_TX,
		internalIndex: 0,
	},
	[EntityType.EvmUserOperation]: {
		$network: mainnet,
		hash: SAMPLE_USER_OPERATION_HASH,
	},

	[EntityType.FarcasterCast]: { fid: 3, hash: CAST_HASH_32 },
	[EntityType.FarcasterChannel]: { id: 'memes' },
	[EntityType.FarcasterFeed]: { variant: 'trending' },
	[EntityType.FarcasterNetwork]: { scope: 'FarcasterNetwork' },
	[EntityType.FarcasterUser]: { fid: 3 },

	[EntityType.IpfsProtocol]: { scope: 'IpfsProtocol' },

	[EntityType.IpfsResource]: {
		namespace: 'ipfs',
		target: 'bafybeigdyrzt3sfp7vd2lvdwqcedebyb6utyghj6v7k5vcheck7l1vprfw',
		contentPath: '/',
	},

	[EntityType.LensAccount]: {
		address: VITALIK_ADDRESS,
	},
	[EntityType.LensNetwork]: { scope: 'LensNetwork' },
	[EntityType.LensPost]: {
		id: '0x0000000000000000000000000000000000000000000000000000000000000001',
	},

	[EntityType.LiquidityPool]: {
		$network: mainnet,
		id: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
	},

	[EntityType.Url]: {
		url: 'https://example.com/',
	},

	[EntityType.Eip8004Service]: {
		$network: {
			chainId: 56,
		},
		identityId: '104776',
	},

	[EntityType.Vault]: {
		$network: mainnet,
		id: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
	},

	[EntityType.Market]: ethUsdCatalogMarket,
	[EntityType.MarketPrice]: {
		$market: ethUsdCatalogMarket,
	},
	[EntityType.Market_TimeInterval_Timestamp]: {
		$market: ethUsdCatalogMarket,
		timeInterval: { unit: MarketTimeIntervalUnit.Day, value: 7 },
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.MarketVenue]: { marketVenueId: MarketVenueId.Binance },
	[EntityType.Currency]: { iso4217: Iso4217.USD },
	[EntityType.Market_Timestamp]: {
		$market: ethUsdCatalogMarket,
		timestampMs: 0,
	},

	[EntityType.Network]: mainnet,
	[EntityType.NetworkBridge]: {
		$fromNetwork: mainnet,
		$toNetwork: { chainId: 10 },
		url: 'https://bridge.example',
	},
	[EntityType.NetworkUpgrade]: {
		$network: mainnet,
		upgradeId: 'Homestead',
	},
	[EntityType.Network_GasFee_Block]: {
		$network: mainnet,
		blockNumber: 18_000_000n,
	},
	[EntityType.Network_GasEstimate_Timestamp]: {
		$network: mainnet,
		timestampMs: 0,
	},
	[EntityType.Network_Txpool_Timestamp]: {
		$network: mainnet,
		timestampMs: 0,
	},
	[EntityType.MevRelay_ProposerPayloadDelivered]: {
		$network: mainnet,
		relayHost: 'relay.ultrasound.money',
		slot: 9_500_000,
		blockHash: `0x${'0'.repeat(64)}`,
	} as const,
	[EntityType.NetworkExecutionUpgrade]: {
		$network: mainnet,
		upgradeId: 'Homestead',
	},
	[EntityType.NetworkConsensusUpgrade]: {
		$network: mainnet,
		upgradeId: 'Bellatrix',
	},

	[EntityType.NostrNetwork]: { scope: 'NostrNetwork' },
	[EntityType.NostrArticle]: {
		pubkey: NOSTR_PROBE_PUBKEY,
		identifier: NOSTR_PROBE_ARTICLE_IDENTIFIER,
	},
	[EntityType.NostrProfile]: {
		pubkey: NOSTR_PROBE_PUBKEY,
	},
	[EntityType.NostrNote]: {
		eventId: `${'a'.repeat(64)}`,
	},
	[EntityType.NostrReaction]: {
		eventId: NOSTR_PROBE_REACTION_EVENT_ID,
	},
	[EntityType.NostrRelay]: {
		relayUrl: NOSTR_PROBE_RELAY_URL,
	},
	[EntityType.NostrRepost]: {
		eventId: NOSTR_PROBE_REPOST_EVENT_ID,
	},

	[EntityType.Proposal]: {
		realm: ProposalRealm.Ethereum,
		category: ProposalCategory.Eip,
		number: 1559,
	},
	[EntityType.ProposalKind]: {
		realm: ProposalRealm.Ethereum,
		category: ProposalCategory.Eip,
	},
	[EntityType.ProposalRealm]: { realm: ProposalRealm.Ethereum },

	[EntityType.RedditComment]: { fullname: 't1_carprdq' },
	[EntityType.RedditLink]: { fullname: 't3_1h7t8a' },
	[EntityType.RedditNetwork]: { scope: 'RedditNetwork' },
	[EntityType.RedditSubreddit]: { name: 'ethereum' },

	[EntityType.RssNetwork]: { scope: 'RssNetwork' },
	[EntityType.RssFeed]: { feedUrl: 'https://blog.svelte.dev/feed.xml' },
	[EntityType.RssItem]: {
		feedUrl: 'https://blog.svelte.dev/feed.xml',
		guid: 'e2e-probe-rss-item',
	},

	[EntityType.SwarmProtocol]: { scope: 'SwarmProtocol' },

	[EntityType.SwarmResource]: {
		reference: '8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1',
		contentPath: '',
	},

	[EntityType.XNetwork]: { scope: 'XNetwork' },
	[EntityType.XmtpConversation]: { id: 'e2e-probe-conversation' },
	[EntityType.XmtpNetwork]: { scope: 'XmtpNetwork' },
	[EntityType.XPost]: { id: '1855943488122347520' },
	[EntityType.XUser]: { id: '12' },

	[EntityType.YouTubeNetwork]: { scope: 'YouTubeNetwork' },
	[EntityType.YouTubeChannel]: { channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw' },
	[EntityType.YouTubeComment]: {
		videoId: YOUTUBE_PROBE_VIDEO_ID,
		commentId: YOUTUBE_PROBE_COMMENT_ID,
	},
	[EntityType.YouTubePlaylist]: {
		playlistId: YOUTUBE_PROBE_PLAYLIST_ID,
	},
	[EntityType.YouTubeVideo]: { videoId: YOUTUBE_PROBE_VIDEO_ID },
}


export type AssertLoadedResolverProbeCategory = (
	| 'catalog'
	| 'networkLive'
	| 'envGated'
	| 'knownUpstreamGap'
	| 'unsupportedField'
)

export const assertLoadedResolverProbeCategories = [
	'catalog',
	'networkLive',
	'envGated',
	'knownUpstreamGap',
	'unsupportedField',
] as const satisfies readonly AssertLoadedResolverProbeCategory[]


export type AssertLoadedResolverProbeCategoryBucket = {
	total: number
	resolveOk: number
	resolveRejected: number
	assertOk: number
	fulfilledButAssertFailed: number
}


export type AssertLoadedResolverProbeCategorySummary = Record<
	AssertLoadedResolverProbeCategory,
	AssertLoadedResolverProbeCategoryBucket
>


/** Sources whose provider or transport declares `env` (API keys, tokens). */
export const envGatedProbeSources = new Set<Source>([
	Source.Allium_Rest,
	Source.CoinMarketCap_Rest,
	Source.Coingecko_OpenApi,
	Source.Coingecko_Rest,
	Source.Coinpaprika_OpenApi,
	Source.Defillama_OpenApi,
	Source.Defillama_Rest,
	Source.Dune_Rest,
	Source.Etherscan_Rest,
	Source.Fedi_Rest,
	Source.Lens_Graphql,
	Source.Lens_HeyGraphql,
	Source.Mastodon_Rest,
	Source.Neynar_Rest,
	Source.Piped_Rest,
	Source.Reddit_Rest,
	Source.TheGraph_Graphql,
	Source.X_Rest,
	Source.Youtube_Rest,
])


/** Static catalogs and local rows — no live upstream dependency for probe success. */
export const catalogProbeSources = new Set<Source>([
	Source.Caips_Github,
	Source.Chainlist_Rest,
	Source.Constants_Internal,
	Source.Ensips_Github,
	Source.EthereumEips_Github,
	Source.EthereumLists_Rest,
	Source.EthereumSpecs_Github,
	Source.Local_Internal,
	Source.Superchain_Github,
])


/**
 * Probe keys with known upstream gaps (missing explorer indexes, empty registry lists, …).
 * Matched before env/catalog/network defaults.
 */
export const knownUpstreamGapProbeKeys = new Set<string>([
	`field:${EntityType.Network}.$$erc4337Bundlers:${Source.Blockscout_Rest}`,
	`field:${EntityType.Network}.$$erc4337Paymasters:${Source.Blockscout_Rest}`,
	`field:${EntityType.Network}.$$erc4337AccountFactories:${Source.Blockscout_Rest}`,
])


export const probeKeySource = (key: string): Source | undefined => {
	const sourceSegment = key.slice(key.lastIndexOf(':') + 1)
	for (const source of Object.values(Source)) {
		if (source === sourceSegment) {
			return source
		}
	}
	return undefined
}


export type AssertLoadedResolverProbeCaseForClassification = {
	key: string
	resolveRejected: boolean
	resolveError?: string
	assertError?: string
}


export const classifyAssertLoadedResolverProbeCase = (
	probeCase: AssertLoadedResolverProbeCaseForClassification,
): AssertLoadedResolverProbeCategory => {
	if (knownUpstreamGapProbeKeys.has(probeCase.key)) {
		return 'knownUpstreamGap'
	}

	if (
		probeCase.resolveRejected
		&& probeCase.resolveError != null
		&& (
			probeCase.resolveError.includes('unsupported')
			|| probeCase.resolveError.includes('not implemented')
		)
	) {
		return 'unsupportedField'
	}

	const source = probeKeySource(probeCase.key)
	if (source != null && envGatedProbeSources.has(source)) {
		return 'envGated'
	}
	if (source != null && catalogProbeSources.has(source)) {
		return 'catalog'
	}

	return 'networkLive'
}


export const isExpectedAssertLoadedResolverProbeFailure = (
	probeCase: AssertLoadedResolverProbeCaseForClassification & {
		category: AssertLoadedResolverProbeCategory
		assertThrew: boolean
	},
): boolean => (
	!probeCase.resolveRejected
	&& probeCase.assertThrew
	&& (
		probeCase.category === 'knownUpstreamGap'
		|| probeCase.category === 'unsupportedField'
	)
)


export const resolveProbeEntityId = async (
	entityType: EntityType,
): Promise<EntityId<typeof schema, EntityType>> => {
	if (entityType === EntityType.Coin_Timestamp) {
		const {
			blockscoutExplorerOriginForChain,
			blockscoutRestV2AtExplorerOrigin,
		} = await import('$/sources/Blockscout/Rest/constants.ts')
		const { getBlockscoutStats } = await import('$/sources/Blockscout/Rest/queries.ts')
		const origin = blockscoutExplorerOriginForChain(mainnet.chainId)
		if (
			origin == null
			|| !blockscoutRestV2AtExplorerOrigin(origin)
		) {
			throw new Error('assert-loaded-resolvers: mainnet Blockscout stats unavailable for Coin_Timestamp probe')
		}
		const stats = await getBlockscoutStats({ explorerOrigin: origin })
		if (stats == null) {
			throw new Error('assert-loaded-resolvers: Blockscout stats unavailable for Coin_Timestamp probe')
		}
		const updatedAtMs = (
			stats.gas_price_updated_at != null ?
				Date.parse(stats.gas_price_updated_at)
			: NaN
		)
		if (!Number.isFinite(updatedAtMs)) {
			throw new Error('assert-loaded-resolvers: Blockscout stats clock missing for Coin_Timestamp probe')
		}
		return {
			$coin: { coinId: CoinId.ETH },
			timestampMs: updatedAtMs,
		}
	}

	const entityId = probeEntityIdByType[entityType]
	if (entityId === undefined) {
		throw new Error(`Missing probeEntityIdByType[${entityType}]`)
	}
	return entityId
}


export const parentEntityIdForFieldResolver = (
	entityType: EntityType,
): unknown => (
	entityType === EntityType._Global ?
		{}
	: entityType === EntityType.Network ?
		mainnet
	: entityType === EntityType.Actor ?
		actorMainnetVitalik
	: entityType === EntityType.ActorNetwork ?
		actorNetworkMainnetUsdc
	: entityType === EntityType.EvmBlock ?
		({
			$network: mainnet,
			blockNumber: 18_000_000n,
		})
	: entityType === EntityType.AtprotoActor ?
		{ did: 'did:plc:z72i7hdynmk6x22kvon7fdpk' }
	: entityType === EntityType.AtprotoPost ?
		probeEntityIdByType[EntityType.AtprotoPost]
	: entityType === EntityType.ActivityPubNetwork ?
		{ scope: 'ActivityPubNetwork' }
	: entityType === EntityType.ActivityPubActor ?
		probeEntityIdByType[EntityType.ActivityPubActor]
	: entityType === EntityType.ActivityPubNote ?
		probeEntityIdByType[EntityType.ActivityPubNote]
	: entityType === EntityType.AtprotoNetwork ?
		{ scope: 'AtprotoNetwork' }
	: entityType === EntityType.LensNetwork ?
		{ scope: 'LensNetwork' }
	: entityType === EntityType.RedditNetwork ?
		{ scope: 'RedditNetwork' }
	: entityType === EntityType.RssNetwork ?
		{ scope: 'RssNetwork' }
	: entityType === EntityType.RssFeed ?
		probeEntityIdByType[EntityType.RssFeed]
	: entityType === EntityType.RedditSubreddit ?
		probeEntityIdByType[EntityType.RedditSubreddit]
	: entityType === EntityType.RedditLink ?
		probeEntityIdByType[EntityType.RedditLink]
	: entityType === EntityType.LensAccount ?
		probeEntityIdByType[EntityType.LensAccount]
	: entityType === EntityType.XUser ?
		probeEntityIdByType[EntityType.XUser]
	: entityType === EntityType.NostrNetwork ?
		{ scope: 'NostrNetwork' }
	: entityType === EntityType.YouTubeNetwork ?
		{ scope: 'YouTubeNetwork' }
	: entityType === EntityType.XNetwork ?
		{ scope: 'XNetwork' }
	: entityType === EntityType.XmtpNetwork ?
		{ scope: 'XmtpNetwork' }
	: entityType === EntityType.EnsProtocol ?
		{ scope: 'EnsProtocol' }
	: entityType === EntityType.EvmProtocol ?
		{ scope: 'EvmProtocol' }
	: entityType === EntityType.IpfsProtocol ?
		{ scope: 'IpfsProtocol' }
	: entityType === EntityType.SwarmProtocol ?
		{ scope: 'SwarmProtocol' }
	: entityType === EntityType.FarcasterNetwork ?
		{ scope: 'FarcasterNetwork' }
	: entityType === EntityType.FarcasterFeed ?
		({ variant: 'trending' })
	: entityType === EntityType.FarcasterUser ?
		{ fid: 3 }
	: entityType === EntityType.FarcasterChannel ?
		{ id: 'memes' }
	:
		probeEntityIdByType[entityType] ?? (
			(() => {
				throw new Error(
					`assert-loaded-resolvers: add parentEntityIdForFieldResolver / probeEntityIdByType for ${entityType}`,
				)
			})()
		)
)


export const entityFieldValueForAssert = <_Value>(
	value: _Value,
): unknown => (
	value != null
	&& typeof value === 'object'
	&& EntityMetaKey.Id in (value as object) ?
		({
			[EntityMetaKey.Id]: (value as Record<string, unknown>)[EntityMetaKey.Id],
			[EntityMetaKey.IdKey]: stringify((value as Record<string, unknown>)[EntityMetaKey.Id]),
		})
	:
		value
)
