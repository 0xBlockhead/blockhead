import { stringify } from 'devalue'

import { CoinId } from '$/constants/Coin.ts'
import { currencyCatalogSnapshotTimestampMs, Iso4217 } from '$/constants/Currency.ts'
import { seededCoinSpotUsdMarketByCoinId } from '$/constants/MarketCatalog.ts'
import { MarketAssetKind, MarketKind, MarketTimeIntervalUnit } from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	Caip2Namespace,
	Caip2Reference,
	networkBySlug,
} from '$/constants/Network.ts'
import { NetworkStackId } from '$/constants/NetworkStack.ts'
import { ProposalCategory, SpecificationRealm } from '$/constants/SpecificationProposal.ts'
import {
	atprotoNetworkSeedActors,
	atprotoNetworkSeedPosts,
} from '$/constants/Social/Atproto.ts'
import { cashuMintBySlug } from '$/constants/Cashu.ts'
import { ElementsPegDirection } from '$/schema/ElementsPegDirection.ts'
import {
	EntityMetaKey,
	indexSchema,
	validateEntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	EntitySelector,
	EntitySelectorForSelectorName,
	EntitySelectorName,
} from '$/schema/$schema.ts'
import type { ResolverValue } from '$/resolvers/$resolvers.ts'
import { schema } from '$/schema/index.ts'
import { AssetInstanceKind } from '$/schema/AssetInstanceKind.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedActionKind.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
import { Source } from '$/sources/Source.ts'
import { SourceCredentialScope } from '$/sources/SourceBinding.ts'
import sourceProviderDefinitions from '$/sources/$sourceProviders.ts'
import { SolanaInstructionKind } from '$/schema/SolanaInstructionKind.ts'

const { entityDefinitionByType } = indexSchema(schema)


/**
	* Probe hex: canonical lowercase `0x` + digits (`$ZeroExHex` / `EvmAddress`). No strip/re-prefix.
	*/
export const VITALIK_ADDRESS = '0xd8da6bf26964af9d7eed9e403e826090792bed6a' as const

export const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const

export const SAMPLE_TX_HASH = (
	'0xdacd6abf5b2814b28c68c59981f269c615796e7f0cba2009f4bf5edfdd9595ab' as const
)

export const ERC4337_SMART_ACCOUNT_ADDRESS = '0x0000000000001d8a2e7bf6bc369525a2654aa298' as const

export const ERC4337_BUNDLER_ADDRESS = '0xf0ac778fb2e56bab4edd7f25c2ed2f333d165b8d' as const

export const ERC4337_PAYMASTER_ADDRESS = '0x6599bba2a055f3c769cba1a2d462a75429bd7bf7' as const

export const ERC4337_ACCOUNT_FACTORY_ADDRESS = '0xcad776fce9c3b3db6724aeb4c7fa2f5f3c088253' as const

export const SAMPLE_USER_OPERATION_HASH = (
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

export const NOSTR_PROBE_RELAY_URL = 'wss://relay.damus.io' as const

export const NOSTR_PROBE_REPOST_EVENT_ID = '73c5554c50f37d308b1a4df0463fe07391e278d409158cfcb77701228094243c' as const

export const NOSTR_PROBE_REACTION_EVENT_ID = '4f87e4389d1873e3c5eafd6b825fcaf5a3193e97ed5004a913247f7c81a1e6ee' as const

export const NOSTR_PROBE_ARTICLE_PUBKEY = (
	'ba4df886d2a7c4224bc98efb6cbf3817b0e2b7227c287b692a7c7d0a9e3e86ff' as const
)

export const NOSTR_PROBE_ARTICLE_IDENTIFIER = 'WFH3Q0hJn_yS0pbAbKocQ' as const

export const YOUTUBE_PROBE_PLAYLIST_ID = 'UU_x5XG1OV2P6uZZ5FSM9Ttw' as const

export const YOUTUBE_PROBE_VIDEO_ID = 'jNQXAC9IVRw' as const

export const YOUTUBE_PROBE_COMMENT_ID = 'UgzuC3zzpRZkjc5Qzsd4AaABAg' as const

/** EVM explorer routes for e2e smoke / boundary (see also `routeViewSmokePaths`). */
export const e2eEvmExplorerRoutePaths = {
	hub: '/evm',
	calldata: '/evm/calldata',
	calldataDecoder: '/evm/calldata-decoder',
	selectors: '/evm/selectors',
	topics: '/evm/topics',
	errors: '/evm/errors',
	networkTransaction: `/network/eip155:1/tx/${SAMPLE_TX_HASH}`,
	networkTransactionLog: `/network/eip155:1/tx/${SAMPLE_TX_HASH}/log/0`,
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
		`/nostr/article/${NOSTR_PROBE_ARTICLE_PUBKEY}/${encodeURIComponent(NOSTR_PROBE_ARTICLE_IDENTIFIER)}`
	),
	youtubePlaylist: `/youtube/playlist/${encodeURIComponent(YOUTUBE_PROBE_PLAYLIST_ID)}`,
} as const satisfies Record<string, `/${string}`>

/** Mainnet type‑3 tx with EIP‑4844 sidecars — exercised by Blobscan REST probes. */
export const SAMPLE_BLOB_TX_HASH = (
	'0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca' as const
)

const CAST_HASH_32 = '0xe4f2e1c70d72388a98dba2a2511a9b480840e544' as const

export { CAST_HASH_32 }

const ERROR_SELECTOR = '0x08c379a0' as const

const TRANSFER_SELECTOR = '0xa9059cbb' as const

const TRANSFER_TOPIC = (
	'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' as const
)

export const ethUsdCatalogMarket = {
	$base: {
		kind: MarketAssetKind.Coin,
		assetKey: seededCoinSpotUsdMarketByCoinId[CoinId.ETH].baseCoinId,
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		assetKey: seededCoinSpotUsdMarketByCoinId[CoinId.ETH].quoteIso4217,
	},
	$marketVenue: {
		marketVenueId: seededCoinSpotUsdMarketByCoinId[CoinId.ETH].marketVenueId,
	},
	marketKind: seededCoinSpotUsdMarketByCoinId[CoinId.ETH].marketKind,
} satisfies EntitySelector<
	typeof schema,
	EntityType.Market
>

const mainnetChainId = 1

const mainnet = {
	caip2: {
		namespace: Caip2Namespace.Eip155,
		reference: Caip2Reference.EthereumMainnet,
	},
} as const

const aptosMainnet = {
	caip2: {
		namespace: Caip2Namespace.Aptos,
		reference: Caip2Reference.AptosMainnet,
	},
} as const

const bitcoin = {
	caip2: {
		namespace: Caip2Namespace.Bip122,
		reference: Caip2Reference.Bitcoin,
	},
} as const

const lightningNetwork = {
	slug: 'lightning',
} as const

const lightning = {
	$network: lightningNetwork,
} as const

const liquid = {
	$network: {
		slug: 'liquid',
	},
} as const
const liquidNetwork = liquid.$network

const cashuProbeMint = {
	mintUrl: cashuMintBySlug.probe.url,
} as const

const fedimintProbeFederation = {
	federationId: 'e2e-probe-federation',
} as const

const payjoinProbeDirectory = {
	directoryUrl: 'http://127.0.0.1:8080',
} as const

const zcash = {
	caip2: {
		namespace: Caip2Namespace.Bip122,
		reference: Caip2Reference.Zcash,
	},
} as const

const zcashUtxo = {
	$network: zcash,
} as const

const filecoin = {
	caip2: {
		namespace: Caip2Namespace.Fil,
		reference: Caip2Reference.Filecoin,
	},
} as const

const filecoinNetwork = {
	$network: filecoin,
} as const

const solana = {
	caip2: {
		namespace: Caip2Namespace.Solana,
		reference: Caip2Reference.SolanaMainnet,
	},
} as const

const cosmos = {
	caip2: {
		namespace: Caip2Namespace.Cosmos,
		reference: Caip2Reference.CosmosHub,
	},
} as const

const polkadot = {
	caip2: {
		namespace: Caip2Namespace.Polkadot,
		reference: Caip2Reference.Polkadot,
	},
} as const

const hyperliquidNetwork = {
	slug: 'hyperliquid',
} as const

const hyperliquid = {
	$network: hyperliquidNetwork,
} as const

const bittensorNetwork = {
	slug: 'bittensor',
} as const

const bittensor = {
	$network: bittensorNetwork,
} as const

const logos = {
	slug: 'logos-testnet',
} as const

const quilibrium = {
	slug: 'quilibrium',
} as const

const quilibriumNetwork = {
	slug: 'quilibrium',
} as const

const near = {
	slug: 'near',
} as const

const nearNetwork = {
	slug: 'near',
} as const

const tronNetwork = {
	slug: 'tron',
} as const

const tron = {
	$network: tronNetwork,
} as const

const monero = {
	caip2: {
		namespace: Caip2Namespace.Monero,
		reference: Caip2Reference.Monero,
	},
} as const

const moneroNetwork = {
	$network: monero,
} as const

const litecoin = {
	caip2: {
		namespace: Caip2Namespace.Bip122,
		reference: Caip2Reference.Litecoin,
	},
} as const

const litecoinUtxo = {
	$network: litecoin,
} as const

const dogecoin = {
	caip2: {
		namespace: Caip2Namespace.Bip122,
		reference: Caip2Reference.Dogecoin,
	},
} as const

const dogecoinUtxo = {
	$network: dogecoin,
} as const

const bitcoinCash = {
	caip2: {
		namespace: Caip2Namespace.Bip122,
		reference: Caip2Reference.BitcoinCash,
	},
} as const

const zeroG = {
	slug: '0g',
} as const

const zeroGNetwork = {
	slug: '0g',
} as const

const a2aAgentCard = {
	agentCardUrl: 'https://example.com/.well-known/agent-card.json',
} as const

const a2aAgentCardSnapshot = {
	$card: a2aAgentCard,
	contentHashAlgorithm: 'sha256',
	contentHash: '0x00',
} as const

const a2aAgentService = {
	$card: a2aAgentCard,
	protocolBinding: 'jsonrpc',
	endpointUrl: 'https://example.com/a2a',
} as const

const a2aTask = {
	taskId: 'e2e-probe-a2a-task',
} as const

const a2aMessage = {
	$task: a2aTask,
	messageId: 'e2e-probe-a2a-message',
} as const

const a2aArtifact = {
	$task: a2aTask,
	artifactId: 'e2e-probe-a2a-artifact',
} as const

const defineProbeEntitySelectors = <
	const _Selectors extends Record<string, object>
>(selectors: _Selectors & {
	readonly [_EntityType in keyof _Selectors]: _EntityType extends EntityType ?
		EntitySelector<typeof schema, _EntityType>
	:
		never
}) => selectors

const defineParentProbeEntitySelectors = <
	const _Selectors extends Partial<{
		readonly [_EntityType in EntityType]: Partial<{
			readonly [_SelectorName in EntitySelectorName<
				typeof schema,
				_EntityType
			>]: EntitySelectorForSelectorName<
				typeof schema,
				_EntityType,
				_SelectorName
			>
		}>
	}>
>(selectors: _Selectors) => selectors

const actorMainnetVitalik = {
	address: VITALIK_ADDRESS,
}

/** Blockscout-hosted mainnet omits Vitalik address activity; USDC contract has token + internal rows. */
const evmNetworkAccountMainnetUsdc = {
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
	fromAmount: 1_000_000_000_000_000n,
	fromAddress: VITALIK_ADDRESS,
	slippage: 0.005,
	toAddress: VITALIK_ADDRESS,
} as const

const openAiProvider = {
	providerId: 'openai',
} as const

/**
	* Probe entity selectors for `resolverDefinitionProbes` smoke shapes; must match each type’s Arktype `id`.
	*/
const probeEntitySelectorByType = defineProbeEntitySelectors({
	[EntityType._Global]: { scope: 'global' },
	[EntityType.A2aAgentCard]: a2aAgentCard,
	[EntityType.A2aAgentCard_Snapshot]: a2aAgentCardSnapshot,
	[EntityType.A2aAgentInterface]: {
		$cardSnapshot: a2aAgentCardSnapshot,
		protocolBinding: 'jsonrpc',
		url: 'https://example.com/a2a',
	},
	[EntityType.A2aAgentService]: a2aAgentService,
	[EntityType.A2aAgentService_Timestamp]: {
		$service: a2aAgentService,
		timestampMs: 0,
		source: Source.Constants_Internal,
	},
	[EntityType.A2aAgentSkill]: {
		$cardSnapshot: a2aAgentCardSnapshot,
		skillId: 'e2e-probe-a2a-skill',
	},
	[EntityType.A2aArtifact]: a2aArtifact,
	[EntityType.A2aMessage]: a2aMessage,
	[EntityType.A2aMessagePart]: {
		$message: a2aMessage,
		partIndex: 0,
	},
	[EntityType.A2aPushNotificationConfig]: {
		$task: a2aTask,
		configId: 'e2e-probe-a2a-push-config',
	},
	[EntityType.A2aTask]: a2aTask,
	[EntityType.A2aTask_Timestamp]: {
		$task: a2aTask,
		timestampMs: 0,
		source: Source.Constants_Internal,
	},
	[EntityType.A2aTaskEvent]: {
		$task: a2aTask,
		sequence: 0,
	},
	[EntityType.AiModel]: {
		$provider: openAiProvider,
		providerModelId: 'gpt-4o-mini',
	},
	[EntityType.AiProviderApiOperation]: {
		$provider: openAiProvider,
		operationId: 'listModels',
	},
	[EntityType.AiProviderCatalogEntry]: {
		$provider: openAiProvider,
		catalogKind: 'model',
		providerEntryId: 'gpt-4o-mini',
	},

	[EntityType.BlockheadWallet]: { id: 'eip6963:e2e-probe-wallet' },
	[EntityType.BlockheadAccount]: {
		$account: {
			caip10: {
				namespace: Caip2Namespace.Eip155,
				reference: Caip2Reference.EthereumMainnet,
				accountAddress: VITALIK_ADDRESS,
			},
		},
	},
	[EntityType.BlockheadWalletConnection]: {
		connectionKey: 'e2e-probe-wallet-connection',
	},

	[EntityType.ActivityPubActor]: {
		instanceOrigin: 'https://mastodon.social',
		localAccountId: '13179',
	},
	[EntityType.ActivityPubNetwork]: { scope: 'ActivityPubNetwork' },
	[EntityType.ActivityPubNote]: {
		instanceOrigin: 'https://mastodon.social',
		localStatusId: '116539053870420123',
	},

	[EntityType.EvmAccount]: actorMainnetVitalik,

	[EntityType.EvmNetworkActorCoinBalance]: {
		$actor: actorMainnetVitalik,
		$contract: coinInstanceUsdcMainnet.$contract,
	},

	[EntityType.EvmActorCoinAllowance]: {
		$actor: actorMainnetVitalik,
		$contract: coinInstanceUsdcMainnet.$contract,
		$spender: {
			address: '0x0000000000000000000000000000000000000001',
		},
		interopAddress: `${VITALIK_ADDRESS}:USDC:0x0000000000000000000000000000000000000001`,
	},

	[EntityType.EvmNetworkAccount]: evmNetworkAccountMainnetUsdc,

	[EntityType.AtprotoActor]: atprotoNetworkSeedActors[0],
	[EntityType.AtprotoActor_Timestamp]: {
		$actor: atprotoNetworkSeedActors[0],
		timestampMs: 0,
	},
	[EntityType.AtprotoNetwork]: { scope: 'AtprotoNetwork' },
	[EntityType.AtprotoPost]: {
		uri: atprotoNetworkSeedPosts[0].uri,
	},
	[EntityType.AtprotoPost_Timestamp]: {
		$post: atprotoNetworkSeedPosts[0],
		timestampMs: 0,
	},
	[EntityType._GlobalAtprotoNetwork]: { scope: '_GlobalAtprotoNetwork' },
	[EntityType.AptosNetwork]: {
		$network: aptosMainnet,
	},
	[EntityType.AptosNetwork_Timestamp]: {
		$network: {
			$network: aptosMainnet,
		},
		ledgerVersion: 0n,
		source: Source.AptosFullnode_Rest,
	},
	[EntityType.AptosAccount]: {
		$network: {
			$network: aptosMainnet,
		},
		address: '0xa11ce',
	},
	[EntityType.AptosAccount_Timestamp]: {
		$account: {
			$network: {
				$network: aptosMainnet,
			},
			address: '0xa11ce',
		},
		ledgerVersion: 0n,
		source: Source.AptosFullnode_Rest,
	},
	[EntityType.AptosAccountResource]: {
		$account: {
			$network: {
				$network: aptosMainnet,
			},
			address: '0xa11ce',
		},
		resourceType: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
	},
	[EntityType.AptosAccountResource_Timestamp]: {
		$resource: {
			$account: {
				$network: {
					$network: aptosMainnet,
				},
				address: '0xa11ce',
			},
			resourceType: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
		},
		ledgerVersion: 0n,
		source: Source.AptosFullnode_Rest,
	},
	[EntityType.AptosBlock]: {
		$network: {
			$network: aptosMainnet,
		},
		height: 0n,
	},
	[EntityType.AptosTransaction]: {
		$network: {
			$network: aptosMainnet,
		},
		version: 0n,
	},
	[EntityType.AptosTransaction_Timestamp]: {
		$transaction: {
			$network: {
				$network: aptosMainnet,
			},
			version: 0n,
		},
		ledgerVersion: 0n,
		source: Source.AptosFullnode_Rest,
	},
	[EntityType.AptosEvent]: {
		$network: {
			$network: aptosMainnet,
		},
		transactionVersion: 0n,
		eventIndex: 0,
	},
	[EntityType.AptosStateChange]: {
		$transaction: {
			$network: {
				$network: aptosMainnet,
			},
			version: 0n,
		},
		changeIndex: 0,
	},

	[EntityType.BeaconEpoch]: {
		$network: mainnet,
		epoch: 300_000,
	},
	[EntityType.BeaconSlot]: {
		$network: mainnet,
		slot: 9_500_000,
	},
	[EntityType.BeaconValidator]: {
		$network: mainnet,
		indexInNetwork: 0,
	},
	[EntityType.BeaconCommittee]: {
		$network: mainnet,
		slot: 9_500_000,
		indexInSlot: 0,
	},
	[EntityType.BeaconSyncCommittee]: {
		$network: mainnet,
		period: 0,
	},
	[EntityType.BeaconAttestation]: {
		$network: mainnet,
		slot: 9_500_000,
		indexInSlot: 0,
	},
	[EntityType.BeaconWithdrawal]: {
		$network: mainnet,
		slot: 9_500_000,
		indexInSlot: 0,
	},
	[EntityType.BeaconSlashing]: {
		$network: mainnet,
		slot: 9_500_000,
		kind: 'attester',
		indexInSlot: 0,
	},

	[EntityType.BittensorNetwork]: bittensor,
	[EntityType.BittensorNetwork_Timestamp]: {
		$network: bittensorNetwork,
		timestampMs: 0,
		source: Source.Constants_Internal,
	},
	[EntityType.BittensorBlock]: {
		$network: bittensorNetwork,
		blockNumber: 1_000_000n,
		hash: 'e2e-probe-bittensor-block-hash',
	},
	[EntityType.BittensorSubnet]: {
		$network: bittensorNetwork,
		netuid: 1,
	},
	[EntityType.BittensorMetagraph_Timestamp]: {
		$subnet: {
			$network: bittensorNetwork,
			netuid: 1,
		},
		timestampMs: 0,
		source: Source.Bittensor_JsonRpc,
	},
	[EntityType.BittensorNeuron]: {
		$subnet: {
			$network: bittensorNetwork,
			netuid: 1,
		},
		uid: 0,
	},

	[EntityType.BlockheadFarcasterAccountConnection]: { fid: 3 },

	[EntityType.BlockheadSource]: { id: 'e2e-probe-source' },
	[EntityType.BlockheadPanelTree]: { id: 'e2e-probe-panel-tree' },
	[EntityType.BlockheadRoom]: { id: 'e2e-probe-room' },
	[EntityType.BlockheadSession]: { id: 'e2e-probe-session' },
	[EntityType.BlockheadSessionAction]: {
		sessionId: 'e2e-probe-session',
		actionId: 'e2e-probe-session-action-0',
	},
	[EntityType.BlockheadRoomPeer]: { id: 'e2e-probe-room-peer' },
	[EntityType.BlockheadSharedAddress]: { id: 'e2e-probe-shared-address' },
	[EntityType.BlockheadStateChannel]: { id: 'e2e-probe-state-channel' },
	[EntityType.BlockheadStateChannelDeposit]: {
		$channel: { id: 'e2e-probe-state-channel' },
		$account: actorMainnetVitalik,
	},
	[EntityType.BlockheadStateChannelState]: {
		$channel: { id: 'e2e-probe-state-channel' },
		version: 1,
		stateData: 'e2e-probe-state-channel-state-1',
	},
	[EntityType.BlockheadStateChannelTransfer]: {
		$channel: { id: 'e2e-probe-state-channel' },
		turnNum: 1,
		$from: actorMainnetVitalik,
		$to: actorMainnetVitalik,
		amount: 1n,
	},
	[EntityType.BlockheadAgentConversation]: { id: 'e2e-probe-agent-conversation' },
	[EntityType.BlockheadAgentConversationTurn]: { id: 'e2e-probe-agent-conversation-turn' },

	[EntityType.BlockheadBridgeTransaction]: {
		$account: actorMainnetVitalik,
		$sourceTx: {
			$network: mainnet,
			txHash: SAMPLE_TX_HASH,
		},
		createdAt: 0,
	},

	[EntityType.Coin]: { coinId: CoinId.ETH },
	[EntityType.EvmCoinInstance]: {
		$network: mainnet,
		type: CoinInstanceType.NativeCurrency,
	},

	[EntityType.CoinBridgeCapability]: {
		$fromInstance: {
			$network: mainnet,
			type: CoinInstanceType.NativeCurrency,
		},
		$toInstance: {
			$network: {
				caip2: {
					namespace: Caip2Namespace.Eip155,
					reference: Caip2Reference.Optimism,
				},
			},
			type: CoinInstanceType.NativeCurrency,
		},
		toolKey: 'across',
	},

	[EntityType.BridgeRoute]: bridgeRouteEthMainnetToOptimism,

	[EntityType.BridgeRouteStep]: {
		$route: bridgeRouteEthMainnetToOptimism,
		indexInRoute: 0,
	},

	[EntityType.EnsName]: { name: 'vitalik.eth' },

	[EntityType.BlockheadEnsNameSearch]: { query: 'vitalik' },

	[EntityType._GlobalEnsNetwork]: { scope: '_GlobalEnsNetwork' },

	[EntityType.EvmBlob]: {
		$transaction: {
			$network: mainnet,
			txHash: SAMPLE_BLOB_TX_HASH,
		},
		indexInTransaction: 0,
	},
	[EntityType.EvmBlock]: {
		$network: mainnet,
		blockNumber: 18_000_000n,
	},
	[EntityType.Erc4337SmartAccount]: {
		$network: mainnet,
		address: ERC4337_SMART_ACCOUNT_ADDRESS,
	},
	[EntityType.Erc4337SmartAccount_Timestamp]: {
		$account: {
			$network: mainnet,
			address: ERC4337_SMART_ACCOUNT_ADDRESS,
		},
		timestampMs: 0,
		source: Source.Blockscout_Rest,
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
		$contract: {
			$network: mainnet,
			address: USDC_ADDRESS,
		},
	},
	[EntityType.EvmContractCompilation]: {
		$contract: {
			$network: mainnet,
			address: USDC_ADDRESS,
		},
	},
	[EntityType.EvmContractSourceBundle]: {
		$contract: {
			$network: mainnet,
			address: USDC_ADDRESS,
		},
	},
	[EntityType.EvmCalldata]: { hex: TRANSFER_SELECTOR },
	[EntityType.EvmError]: { hex: ERROR_SELECTOR },
	[EntityType.EvmProtocol]: { scope: 'EvmProtocol' },
	[EntityType.EvmLog]: {
		$transaction: {
			$network: mainnet,
			txHash: SAMPLE_TX_HASH,
		},
		indexInTransaction: 0,
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
		$log: {
			$transaction: {
				$network: mainnet,
				txHash: SAMPLE_TOKEN_TRANSFER_TX,
			},
			indexInTransaction: 0,
		},
		indexInLog: 0,
	},
	[EntityType.EvmInternalTransfer]: {
		$transaction: {
			$network: mainnet,
			txHash: SAMPLE_TOKEN_TRANSFER_TX,
		},
		indexInTransaction: 0,
	},
	[EntityType.EvmUserOperation]: {
		$network: mainnet,
		hash: SAMPLE_USER_OPERATION_HASH,
	},

	[EntityType.FarcasterCast]: {
		fid: 3,
		hash: CAST_HASH_32,
	},
	[EntityType.FarcasterCast_Timestamp]: {
		$cast: {
			fid: 3,
			hash: CAST_HASH_32,
		},
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.FarcasterChannel]: { id: 'memes' },
	[EntityType.FarcasterChannel_Timestamp]: {
		$channel: { id: 'memes' },
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.FarcasterFeed]: { variant: 'trending' },
	[EntityType.FarcasterNetwork]: { scope: 'FarcasterNetwork' },
	[EntityType.FarcasterUser]: { fid: 3 },
	[EntityType.FarcasterUser_Timestamp]: {
		$user: { fid: 3 },
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.FarcasterVerifiedAddress]: {
		fid: 3,
		protocol: 'ethereum',
		address: VITALIK_ADDRESS,
	},

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
	[EntityType.LiquidityPool_Timestamp]: {
		$liquidityPool: {
			$network: mainnet,
			id: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
		},
		timestampMs: 1_700_000_000_000,
		feedKey: 'e2e-probe-liquidity-pool',
	},

	[EntityType.Url]: {
		url: 'https://example.com/',
	},

	[EntityType.EvmNft]: {
		$contract: {
			$network: { caip2: {
				namespace: Caip2Namespace.Eip155,
				reference: Caip2Reference.BnbSmartChain,
			} },
			address: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
		},
		tokenId: '104776',
	},

	[EntityType.Market]: ethUsdCatalogMarket,
	[EntityType.MarketPrice]: {
		$market: ethUsdCatalogMarket,
	},
	[EntityType.Market_TimeInterval_Timestamp]: {
		$market: ethUsdCatalogMarket,
		timeInterval: {
			unit: MarketTimeIntervalUnit.Day,
			value: 1,
		},
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.Market_Derivative_Timestamp]: {
		$market: {
			...ethUsdCatalogMarket,
			marketKind: MarketKind.Perpetual,
		},
		timestampMs: 1_700_000_000_000,
		feedKey: 'e2e-probe-derivative-market',
	},
	[EntityType.MarketVenue]: { marketVenueId: MarketVenueId.Binance },
	[EntityType.Currency]: { iso4217: Iso4217.USD },
	[EntityType.Currency_Timestamp]: {
		$currency: { iso4217: Iso4217.USD },
		timestampMs: currencyCatalogSnapshotTimestampMs,
	},
	[EntityType.Market_Timestamp]: {
		$market: ethUsdCatalogMarket,
		timestampMs: 0,
		feedKey: 'e2e-probe-market-quote',
	},

	[EntityType.Network]: mainnet,
	[EntityType.EvmNetworkBridge]: {
		$fromNetwork: mainnet,
		$toNetwork: { caip2: {
			namespace: Caip2Namespace.Eip155,
			reference: Caip2Reference.Optimism,
		} },
		url: 'https://bridge.example',
	},
	[EntityType.EvmRollup]: {
		$network: { caip2: {
			namespace: Caip2Namespace.Eip155,
			reference: Caip2Reference.Optimism,
		} },
		projectId: 'optimism',
	},
	[EntityType.EthereumNetworkUpgrade]: {
		$network: mainnet,
		upgradeId: 'Homestead',
	},
	[EntityType.EvmNetwork_GasFee_Block]: {
		$network: mainnet,
		blockNumber: 18_000_000n,
	},
	[EntityType.EvmNetwork_GasEstimate_Timestamp]: {
		$network: mainnet,
		timestampMs: 0,
		source: Source.Constants_Internal,
	},
	[EntityType.EvmNetwork_Txpool_Timestamp]: {
		$network: mainnet,
		timestampMs: 0,
		source: Source.Constants_Internal,
	},
	[EntityType.EthereumBeaconFinality_Timestamp]: {
		$network: mainnet,
		timestampMs: 0,
	},
	[EntityType.MevRelay]: {
		$network: mainnet,
		host: 'relay.ultrasound.money',
	},
	[EntityType.MevRelay_ProposerPayloadDelivered]: {
		$network: mainnet,
		relayHost: 'relay.ultrasound.money',
		slot: 9_500_000,
		blockHash: `0x${'0'.repeat(64)}`,
	} as const,
	[EntityType.MevBuilder]: {
		$network: mainnet,
		builderPubkey: `0x${'0'.repeat(96)}`,
	},
	[EntityType.EthereumExecutionUpgrade]: {
		$network: mainnet,
		upgradeId: 'Homestead',
	},
	[EntityType.EthereumConsensusUpgrade]: {
		$network: mainnet,
		upgradeId: 'Bellatrix',
	},
	[EntityType.NetworkStack]: {
		networkStackId: NetworkStackId.Ethereum,
	},
	[EntityType.AssetInstance]: {
		$network: bitcoin,
		kind: AssetInstanceKind.Native,
		assetKey: CoinId.BTC,
	},
	[EntityType.NetworkUpgrade]: {
		$network: bitcoin,
		upgradeId: 'taproot',
	},
	[EntityType.UtxoAddress]: {
		$network: bitcoin,
		address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
	},
	[EntityType.UtxoAddress_Timestamp]: {
		$address: {
			$network: bitcoin,
			address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
		},
		timestampMs: 0,
		source: Source.Blockchair_Rest,
	},
	[EntityType.UtxoBlock]: {
		$network: bitcoin,
		height: 840_000n,
		hash: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
	},
	[EntityType.UtxoTransaction]: {
		$network: bitcoin,
		txId: 'e2e-probe-utxo-transaction',
	},
	[EntityType.UtxoInput]: {
		$transaction: {
			$network: bitcoin,
			txId: 'e2e-probe-utxo-transaction',
		},
		indexInTransaction: 0,
	},
	[EntityType.UtxoOutput]: {
		$transaction: {
			$network: bitcoin,
			txId: 'e2e-probe-utxo-transaction',
		},
		indexInTransaction: 0,
	},
	[EntityType.ZcashShieldedPool]: {
		$network: zcash,
		pool: ZcashShieldedPoolKind.Orchard,
	},
	[EntityType.ZcashShieldedAction]: {
		$transaction: {
			$network: zcash,
			txId: 'e2e-probe-zcash-transaction',
		},
		pool: ZcashShieldedPoolKind.Orchard,
		actionKind: ZcashShieldedActionKind.Action,
		indexInTransaction: 0,
	},
	[EntityType.FilecoinNetwork]: filecoinNetwork,
	[EntityType.FilecoinNetwork_Timestamp]: {
		$network: filecoin,
		timestampMs: 1_700_000_000_000,
		source: Source.Filfox_Rest,
	},
	[EntityType.FilecoinTipset]: {
		$network: filecoin,
		height: 4_000_000n,
		tipsetKey: 'e2e-probe-tipset',
	},
	[EntityType.FilecoinBlock]: {
		$network: filecoin,
		cid: 'bafy2bzacee2e-probe-filecoin-block',
	},
	[EntityType.FilecoinMessage]: {
		$network: filecoin,
		cid: 'bafy2bzacee2e-probe-filecoin-message',
	},
	[EntityType.FilecoinActor]: {
		$network: filecoin,
		address: 'f01234',
	},
	[EntityType.FilecoinMiner]: {
		$network: filecoin,
		minerAddress: 'f01234',
	},
	[EntityType.FilecoinSector]: {
		$miner: {
			$network: filecoin,
			minerAddress: 'f01234',
		},
		sectorNumber: 1n,
	},
	[EntityType.Network_Timestamp]: {
		$network: solana,
		timestampMs: 1_700_000_000_000,
		source: Source.Solana_JsonRpc,
	},
	[EntityType.SolanaBlock]: {
		$network: solana,
		slot: 250_000_000n,
	},
	[EntityType.SolanaTransaction]: {
		$network: solana,
		signature: 'e2eProbeSolanaSignature1111111111111111111111111111111',
	},
	[EntityType.SolanaTransaction_Timestamp]: {
		$transaction: {
			$network: solana,
			signature: 'e2eProbeSolanaSignature1111111111111111111111111111111',
		},
		slot: 250_000_000n,
		source: Source.Solana_JsonRpc,
	},
	[EntityType.SolanaInstruction]: {
		$transaction: {
			$network: solana,
			signature: 'e2eProbeSolanaSignature1111111111111111111111111111111',
		},
		instructionKind: SolanaInstructionKind.Instruction,
		indexInTransaction: 0,
	},
	[EntityType.SolanaAccount]: {
		$network: solana,
		pubkey: '11111111111111111111111111111111',
	},
	[EntityType.SolanaProgram]: {
		$network: solana,
		programId: '11111111111111111111111111111111',
	},
	[EntityType.SolanaTokenMint]: {
		$network: solana,
		mintAddress: 'So11111111111111111111111111111111111111112',
	},
	[EntityType.SolanaValidator]: {
		$network: solana,
		votePubkey: 'Vote111111111111111111111111111111111111111',
	},
	[EntityType.TronNetwork_Timestamp]: {
		$network: tronNetwork,
		timestampMs: 1_700_000_000_000,
		source: Source.TronGrid_Rest,
	},
	[EntityType.TronBlock]: {
		$network: tronNetwork,
		height: 60_000_000n,
		hash: 'e2e-probe-tron-block-hash',
	},
	[EntityType.TronTransaction]: {
		$network: tronNetwork,
		transactionId: 'e2e-probe-tron-transaction',
	},
	[EntityType.TronAccount]: {
		$network: tronNetwork,
		address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
	},
	[EntityType.TronWitness]: {
		$network: tronNetwork,
		address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
	},
	[EntityType.TronContract]: {
		$network: tronNetwork,
		address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
	},
	[EntityType.TronToken]: {
		$network: tronNetwork,
		tokenId: 'e2e-probe-tron-token',
	},
	[EntityType.TronTokenTransfer]: {
		$network: tronNetwork,
		transactionId: 'e2e-probe-tron-transaction',
		transferIndex: 0,
	},
	[EntityType.CosmosBlock]: {
		$network: cosmos,
		height: 20_000_000n,
	},
	[EntityType.CosmosTransaction]: {
		$network: cosmos,
		txHash: 'E2EPROBECOSMOSTRANSACTION',
	},
	[EntityType.CosmosMessage]: {
		$transaction: {
			$network: cosmos,
			txHash: 'E2EPROBECOSMOSTRANSACTION',
		},
		indexInTransaction: 0,
	},
	[EntityType.CosmosAccount]: {
		$network: cosmos,
		address: 'cosmos1e2eprobeaccount',
	},
	[EntityType.CosmosValidator]: {
		$network: cosmos,
		operatorAddress: 'cosmosvaloper1e2eprobevalidator',
	},
	[EntityType.CosmosContract]: {
		$network: cosmos,
		address: 'cosmos1e2eprobecontract',
	},
	[EntityType.CosmosDenom]: {
		$network: cosmos,
		denom: 'uatom',
	},
	[EntityType.CosmosModule]: {
		$network: cosmos,
		moduleName: 'bank',
	},
	[EntityType.CosmosGovernanceProposal]: {
		$network: cosmos,
		proposalId: '1',
	},
	[EntityType.PolkadotBlock]: {
		$network: polkadot,
		blockNumber: 20_000_000n,
		hash: 'e2e-probe-polkadot-block-hash',
	},
	[EntityType.PolkadotExtrinsic]: {
		$block: {
			$network: polkadot,
			blockNumber: 20_000_000n,
			hash: 'e2e-probe-polkadot-block-hash',
		},
		indexInBlock: 0,
	},
	[EntityType.PolkadotEvent]: {
		$block: {
			$network: polkadot,
			blockNumber: 20_000_000n,
			hash: 'e2e-probe-polkadot-block-hash',
		},
		indexInBlock: 0,
	},
	[EntityType.PolkadotAccount]: {
		$network: polkadot,
		accountId: 'e2e-probe-polkadot-account',
	},
	[EntityType.PolkadotValidator]: {
		$network: polkadot,
		stashAccountId: 'e2e-probe-polkadot-validator',
	},
	[EntityType.PolkadotPallet]: {
		$network: polkadot,
		palletName: 'balances',
	},
	[EntityType.PolkadotReferendum]: {
		$network: polkadot,
		referendumId: '1',
	},
	[EntityType.HyperliquidNetwork]: hyperliquid,
	[EntityType.HyperliquidBlock]: {
		$network: hyperliquidNetwork,
		height: 1n,
	},
	[EntityType.HyperliquidTransaction]: {
		$network: hyperliquidNetwork,
		txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
	},
	[EntityType.HyperliquidTransaction_Timestamp]: {
		$transaction: {
			$network: hyperliquidNetwork,
			txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
		},
		timestampMs: 0,
		source: Source.Hyperliquid_Rest,
	},
	[EntityType.HyperliquidAccount]: {
		$network: hyperliquidNetwork,
		address: '0x0000000000000000000000000000000000000000',
	},
	[EntityType.HyperliquidValidator]: {
		$network: hyperliquidNetwork,
		validator: 'e2e-probe-validator',
	},
	[EntityType.HyperliquidSpotAsset]: {
		$network: hyperliquidNetwork,
		assetId: 0,
	},
	[EntityType.HyperliquidPerpMarket]: {
		$network: hyperliquidNetwork,
		coin: 'BTC',
	},
	[EntityType.QuilibriumFrame]: {
		$network: quilibriumNetwork,
		frameNumber: 1n,
		shardKey: 'e2e-probe-shard',
	},
	[EntityType.QuilibriumShard]: {
		$network: quilibriumNetwork,
		shardKey: 'e2e-probe-shard',
	},
	[EntityType.QuilibriumProver]: {
		$network: quilibriumNetwork,
		proverPeerId: 'e2e-probe-prover',
	},
	[EntityType.QuilibriumAccount]: {
		$network: quilibriumNetwork,
		accountAddress: 'e2e-probe-account',
	},
	[EntityType.BlockheadQuilibriumPendingTransaction]: {
		$accountState: {
			$network: quilibriumNetwork,
			accountAddress: 'e2e-probe-account',
			connectionId: 'e2e-probe-connection',
		},
		transactionAddress: 'e2e-probe-quilibrium-transaction',
	},
	[EntityType.NearNetwork]: near,
	[EntityType.NearBlock]: {
		$network: nearNetwork,
		height: 100_000_000n,
		hash: 'e2e-probe-near-block-hash',
	},
	[EntityType.NearChunk]: {
		$network: nearNetwork,
		chunkHash: 'e2e-probe-near-chunk',
	},
	[EntityType.NearTransaction]: {
		$network: nearNetwork,
		hash: 'e2e-probe-near-transaction',
		signerAccountId: 'near',
	},
	[EntityType.NearReceipt]: {
		$network: nearNetwork,
		receiptId: 'e2e-probe-near-receipt',
	},
	[EntityType.NearAction]: {
		$transaction: {
			$network: nearNetwork,
			hash: 'e2e-probe-near-transaction',
			signerAccountId: 'near',
		},
		actionIndex: 0,
	},
	[EntityType.NearExecutionOutcome]: {
		$transaction: {
			$network: nearNetwork,
			hash: 'e2e-probe-near-transaction',
			signerAccountId: 'near',
		},
		outcomeId: 'e2e-probe-near-outcome',
	},
	[EntityType.NearAccount]: {
		$network: nearNetwork,
		accountId: 'near',
	},
	[EntityType.NearAccessKey]: {
		$account: {
			$network: nearNetwork,
			accountId: 'near',
		},
		publicKey: 'ed25519:e2e-probe-near-access-key',
	},
	[EntityType.NearContract]: {
		$network: nearNetwork,
		accountId: 'near',
	},
	[EntityType.NearValidator]: {
		$network: nearNetwork,
		accountId: 'e2e-probe-near-validator',
	},
	[EntityType.MoneroNetwork]: moneroNetwork,
	[EntityType.MoneroBlock]: {
		$network: monero,
		height: 3_000_000n,
		hash: 'e2e-probe-monero-block-hash',
	},
	[EntityType.MoneroTransaction]: {
		$network: monero,
		txHash: 'e2e-probe-monero-transaction',
	},
	[EntityType.MoneroStealthOutput]: {
		$transaction: {
			$network: monero,
			txHash: 'e2e-probe-monero-transaction',
		},
		outputIndex: 0,
	},
	[EntityType.MoneroKeyImage]: {
		$transaction: {
			$network: monero,
			txHash: 'e2e-probe-monero-transaction',
		},
		inputIndex: 0,
		keyImage: 'e2e-probe-key-image',
	},
	[EntityType.MoneroRing]: {
		$keyImage: {
			$transaction: {
				$network: monero,
				txHash: 'e2e-probe-monero-transaction',
			},
			inputIndex: 0,
			keyImage: 'e2e-probe-key-image',
		},
	},
	[EntityType.MoneroRingMember]: {
		$ring: {
			$keyImage: {
				$transaction: {
					$network: monero,
					txHash: 'e2e-probe-monero-transaction',
				},
				inputIndex: 0,
				keyImage: 'e2e-probe-key-image',
			},
		},
		memberIndex: 0,
	},
	[EntityType.LitecoinMwebBlock]: {
		$block: {
			$network: litecoin,
			height: 2_500_000n,
			hash: 'e2e-probe-litecoin-block-hash',
		},
	},
	[EntityType.LitecoinMwebTransaction]: {
		$mwebBlock: {
			$block: {
				$network: litecoin,
				height: 2_500_000n,
				hash: 'e2e-probe-litecoin-block-hash',
			},
		},
		transactionIndex: 0,
	},
	[EntityType.LitecoinMwebPegIn]: {
		$transaction: {
			$mwebBlock: {
				$block: {
					$network: litecoin,
					height: 2_500_000n,
					hash: 'e2e-probe-litecoin-block-hash',
				},
			},
			transactionIndex: 0,
		},
		pegInIndex: 0,
	},
	[EntityType.LitecoinMwebPegOut]: {
		$transaction: {
			$mwebBlock: {
				$block: {
					$network: litecoin,
					height: 2_500_000n,
					hash: 'e2e-probe-litecoin-block-hash',
				},
			},
			transactionIndex: 0,
		},
		pegOutIndex: 0,
	},
	[EntityType.LitecoinMwebOutput]: {
		$transaction: {
			$mwebBlock: {
				$block: {
					$network: litecoin,
					height: 2_500_000n,
					hash: 'e2e-probe-litecoin-block-hash',
				},
			},
			transactionIndex: 0,
		},
		outputIndex: 0,
	},
	[EntityType.LightningNetwork]: lightning,
	[EntityType.LightningNetwork_Timestamp]: {
		$lightningNetwork: {
			$network: lightningNetwork,
		},
		timestampMs: 1_759_536_000_000,
		source: Source.LightningMempoolSpace_Rest,
	},
	[EntityType.LightningNode]: {
		$network: lightningNetwork,
		publicKey: '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
	},
	[EntityType.LightningChannel]: {
		$network: lightningNetwork,
		channelId: '852861482917888001',
	},
	[EntityType.BlockheadLightningInvoice]: {
		$network: lightningNetwork,
		paymentHash: 'e2e-probe-lightning-invoice',
	},
	[EntityType.BlockheadLightningPayment]: {
		$network: lightningNetwork,
		paymentHash: 'e2e-probe-lightning-payment',
	},
	[EntityType.BlockheadLightningHtlc]: {
		$channelState: {
			$localNodeState: {
				$network: {
					$network: lightningNetwork,
				},
				connectionId: 'e2e-probe-lightning-connection',
			},
			$channel: {
				$network: lightningNetwork,
				channelId: 'e2e-probe-lightning-channel',
			},
		},
		htlcIndex: 0,
	},
	[EntityType.DogecoinBlockAuxPow]: {
		$block: {
			$network: dogecoin,
			height: 5_000_000n,
			hash: 'e2e-probe-dogecoin-block-hash',
		},
	},
	[EntityType.DogecoinAuxPowParentBlockHeader]: {
		$auxPow: {
			$block: {
				$network: dogecoin,
				height: 5_000_000n,
				hash: 'e2e-probe-dogecoin-block-hash',
			},
		},
	},
	[EntityType.DogecoinAuxPowMerkleBranch]: {
		$auxPow: {
			$block: {
				$network: dogecoin,
				height: 5_000_000n,
				hash: 'e2e-probe-dogecoin-block-hash',
			},
		},
		branchKind: 'coinbase',
	},
	[EntityType.BitcoinCashCashTokenCategory]: {
		$network: bitcoinCash,
		categoryId: 'e2e-probe-cashtoken-category',
	},
	[EntityType.BitcoinCashCashTokenFungibleAmount]: {
		$output: {
			$transaction: {
				$network: bitcoinCash,
				txId: 'e2e-probe-bitcoin-cash-transaction',
			},
			indexInTransaction: 0,
		},
	},
	[EntityType.BitcoinCashCashTokenNft]: {
		$output: {
			$transaction: {
				$network: bitcoinCash,
				txId: 'e2e-probe-bitcoin-cash-transaction',
			},
			indexInTransaction: 0,
		},
	},
	[EntityType.BitcoinCashCashTokenCommitment]: {
		$output: {
			$transaction: {
				$network: bitcoinCash,
				txId: 'e2e-probe-bitcoin-cash-transaction',
			},
			indexInTransaction: 0,
		},
	},
	[EntityType.BitcoinCashBcmrMetadata]: {
		$network: bitcoinCash,
		categoryId: 'e2e-probe-cashtoken-category',
		registryUrl: 'https://example.com/bcmr.json',
	},
	[EntityType.ZeroGNetwork]: zeroG,
	[EntityType.ZeroGNetwork_Timestamp]: {
		$network: zeroG,
		timestampMs: 1_700_000_000_000,
		source: Source.ZeroGChain_JsonRpc,
	},
	[EntityType.ZeroGConsensusNetwork]: {
		$network: zeroGNetwork,
		consensusNetworkId: '0g-chain',
	},
	[EntityType.ZeroGDaNode]: {
		$network: zeroGNetwork,
		nodeId: 'e2e-probe-da-node',
	},
	[EntityType.ZeroGDaQuorum]: {
		$network: zeroGNetwork,
		quorumId: 'e2e-probe-da-quorum',
	},
	[EntityType.ZeroGDataBlob]: {
		$network: zeroGNetwork,
		dataRoot: 'e2e-probe-data-root',
	},
	[EntityType.ZeroGDataChunk]: {
		$dataBlob: {
			$network: zeroGNetwork,
			dataRoot: 'e2e-probe-data-root',
		},
		chunkIndex: 0,
	},
	[EntityType.ZeroGKvEntry]: {
		$network: zeroGNetwork,
		namespace: 'e2e-probe-namespace',
		key: 'e2e-probe-key',
	},
	[EntityType.ZeroGServiceProvider]: {
		$network: zeroGNetwork,
		providerId: 'e2e-probe-provider',
	},
	[EntityType.ZeroGServiceRequest]: {
		$serviceProvider: {
			$network: zeroGNetwork,
			providerId: 'e2e-probe-provider',
		},
		requestId: 'e2e-probe-request',
	},
	[EntityType.ZeroGSettlementTrace]: {
		$serviceRequest: {
			$serviceProvider: {
				$network: zeroGNetwork,
				providerId: 'e2e-probe-provider',
			},
			requestId: 'e2e-probe-request',
		},
		traceId: 'e2e-probe-trace',
	},
	[EntityType.ZeroGStorageLogEntry]: {
		$network: zeroGNetwork,
		logEntryId: 'e2e-probe-storage-log-entry',
	},
	[EntityType.ZeroGStorageNode]: {
		$network: zeroGNetwork,
		nodeId: '0x0000000000000000000000000000000000000000',
	},
	[EntityType.ZeroGStorageProof]: {
		$storageNode: {
			$network: zeroGNetwork,
			nodeId: '0x0000000000000000000000000000000000000000',
		},
		proofId: 'e2e-probe-storage-proof',
	},

	[EntityType.NostrNetwork]: { scope: 'NostrNetwork' },
	[EntityType.NostrArticle]: {
		kind: 30023,
		pubkey: NOSTR_PROBE_ARTICLE_PUBKEY,
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

	[EntityType.SpecificationProposal]: {
		realm: SpecificationRealm.Ethereum,
		category: ProposalCategory.Eip,
		number: 1559,
	},
	[EntityType.SpecificationProposalKind]: {
		realm: SpecificationRealm.Ethereum,
		category: ProposalCategory.Eip,
	},
	[EntityType.SpecificationRealm]: { realm: SpecificationRealm.Ethereum },

	[EntityType.RedditComment]: { fullname: 't1_osbo75d' },
	[EntityType.RedditComment_Timestamp]: {
		$comment: { fullname: 't1_osbo75d' },
		timestampMs: 1_700_000_000_000,
		source: Source.Reddit_Rest,
	},
	[EntityType.RedditLink]: { fullname: 't3_1u8x2f8' },
	[EntityType.RedditLink_Timestamp]: {
		$link: { fullname: 't3_1u8x2f8' },
		timestampMs: 1_700_000_000_000,
		source: Source.Reddit_Rest,
	},
	[EntityType.RedditNetwork]: { scope: 'RedditNetwork' },
	[EntityType.RedditSubreddit]: { name: 'ethereum' },
	[EntityType.RedditSubreddit_Timestamp]: {
		$subreddit: { name: 'ethereum' },
		timestampMs: 1_700_000_000_000,
		source: Source.Reddit_Rest,
	},

	[EntityType.RssNetwork]: { scope: 'RssNetwork' },
	[EntityType.RssFeed]: { feedUrl: 'https://hnrss.org/item?id=48592832' },
	[EntityType.RssItem]: {
		feedUrl: 'https://hnrss.org/item?id=48592832',
		guid: 'https://news.ycombinator.com/item?id=48594706',
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
	[EntityType.XPost_Timestamp]: {
		$post: { id: '1855943488122347520' },
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.XUser]: { id: '12' },
	[EntityType.XUser_Timestamp]: {
		$user: { id: '12' },
		timestampMs: 1_700_000_000_000,
	},

		[EntityType.YoutubeNetwork]: { scope: 'YoutubeNetwork' },
		[EntityType.YoutubeChannel]: { channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw' },
		[EntityType.YoutubeChannel_Timestamp]: {
			$channel: { channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw' },
			timestampMs: 0,
		},
		[EntityType.YoutubeComment]: {
			videoId: YOUTUBE_PROBE_VIDEO_ID,
			commentId: YOUTUBE_PROBE_COMMENT_ID,
		},
	[EntityType.YoutubePlaylist]: {
		playlistId: YOUTUBE_PROBE_PLAYLIST_ID,
	},
	[EntityType.YoutubeVideo]: { videoId: YOUTUBE_PROBE_VIDEO_ID },

	[EntityType.ElementsNetwork]: liquid,
	[EntityType.ElementsAsset]: {
		$network: liquid,
		assetId: 'eb5dc6b623d3d376c51f01a736e1447ec1c462bf4ca8461bb07a184abc7545ea',
	},
	[EntityType.ElementsIssuance]: {
		$transaction: {
			$network: liquidNetwork,
			txId: 'bd0920db6b1aa557d9e4ebc510e5ccadb56ce4c23770f914ee7d677ce99ba883',
		},
		inputIndex: 0,
	},
	[EntityType.ElementsPeg]: {
		$network: liquid,
		pegTransactionId: 'e2e-probe-elements-peg',
		direction: ElementsPegDirection.PegIn,
	},

	[EntityType.CashuMint]: cashuProbeMint,
	[EntityType.CashuMint_Timestamp]: {
		$mint: cashuProbeMint,
		timestampMs: 0,
		source: Source.CashuMint_Rest,
	},
	[EntityType.CashuKeyset]: {
		$mint: cashuProbeMint,
		keysetId: cashuMintBySlug.probe.activeKeysetId,
	},
	[EntityType.CashuKeyset_Timestamp]: {
		$keyset: {
			$mint: cashuProbeMint,
			keysetId: cashuMintBySlug.probe.activeKeysetId,
		},
		timestampMs: 0,
		source: Source.CashuMint_Rest,
	},

	[EntityType.FedimintFederation]: fedimintProbeFederation,

	[EntityType.PayjoinDirectory]: payjoinProbeDirectory,
})

const parentProbeEntitySelectorOverridesByTypeAndName = defineParentProbeEntitySelectors({
	[EntityType.Account]: {
		Caip10: {
			caip10: {
				namespace: Caip2Namespace.Eip155,
				reference: Caip2Reference.EthereumMainnet,
				accountAddress: VITALIK_ADDRESS,
			},
		},
	},
	[EntityType.AcpAgentProgramVersion]: {
		ProgramVersion: {
			$program: {
				registryAgentId: 'e2e-probe-acp-program',
			},
			version: '1',
		},
	},
	[EntityType.AiArtifact]: {
		ProviderArtifactId: {
			$provider: { providerId: 'huggingface' },
			providerArtifactId: 'e2e-probe-artifact',
		},
	},
	[EntityType.AiDocument]: {
		DocumentUrl: {
			documentUrl: 'https://example.com/model-card',
		},
		KindArtifact: {
			documentKind: 'model-card',
			$artifact: {
				$provider: { providerId: 'mlflow' },
				providerArtifactId: 'e2e-probe-artifact',
			},
		},
	},
	[EntityType.AiModelVersion]: {
		HuggingFaceRepoRevision: {
			huggingFaceRepo: 'openai/gpt-oss-20b',
			revision: 'main',
		},
		ModelVersionId: {
			$model: {
				$provider: { providerId: 'mlflow' },
				providerModelId: 'e2e-probe-model',
			},
			versionId: '1',
		},
	},
	[EntityType.ActivityPubActor]: {
		ActivityStreamsUri: {
			activityStreamsUri: 'https://mastodon.social/users/Gargron',
		},
		Acct: {
			instanceOrigin: 'https://mastodon.social',
			acct: 'Gargron@mastodon.social',
		},
	},
	[EntityType.ActivityPubNote]: {
		ActivityStreamsUri: {
			activityStreamsUri: 'https://mastodon.social/users/Gargron/statuses/116539053870420123',
		},
	},
	[EntityType.AptosBlock]: {
		NetworkVersion: {
			$network: { $network: aptosMainnet },
			version: 0n,
		},
	},
	[EntityType.AptosTransaction]: {
		NetworkHash: {
			$network: { $network: aptosMainnet },
			hash: '0xe2e-probe-aptos-transaction',
		},
	},
	[EntityType.AtprotoActor]: {
		Handle: { handle: 'bsky.app' },
	},
	[EntityType.AtprotoActor_Timestamp]: {
		AtprotoActorTimestampMsSource: {
			$actor: atprotoNetworkSeedActors[0],
			timestampMs: 0,
			source: Source.Atproto_Xrpc,
		},
	},
	[EntityType.BlockheadFarcasterAccountConnection]: {
		ConnectionId: {
			connectionId: 'e2e-probe-farcaster-connection',
		},
	},
	[EntityType.BlockheadLightningNodeState]: {
		ConnectionIdNetwork: {
			connectionId: 'e2e-probe-lightning-connection',
			$network: lightning,
		},
	},
	[EntityType.BlockheadAgentConversationTurn]: {
		ConversationTurnId: {
			$conversation: { id: 'e2e-probe-agent-conversation' },
			id: 'e2e-probe-agent-conversation-turn',
		},
	},
	[EntityType.CardanoBlock]: {
		NetworkHash: {
			$network: { slug: 'cardano' },
			hash: 'e2e-probe-cardano-block',
		},
		NetworkSlot: {
			$network: { slug: 'cardano' },
			slot: 0n,
		},
		NetworkBlockNo: {
			$network: { slug: 'cardano' },
			blockNo: 0n,
		},
	},
	[EntityType.CardanoAddress]: {
		NetworkAddress: {
			$network: { slug: 'cardano' },
			address: 'addr1e2eprobe',
		},
	},
	[EntityType.CardanoCommittee_Epoch]: {
		NetworkEpochSource: {
			$network: { slug: 'cardano' },
			epoch: 0,
			source: Source.Blockfrost_Rest,
		},
	},
	[EntityType.CardanoDRep]: {
		NetworkDrepCredential: {
			$network: { slug: 'cardano' },
			drepCredential: 'drep1e2eprobe',
		},
	},
	[EntityType.CardanoGovernanceProposal]: {
		NetworkProposalTxHashProposalIndex: {
			$network: { slug: 'cardano' },
			proposalTxHash: 'e2e-probe-cardano-proposal',
			proposalIndex: 0,
		},
	},
	[EntityType.CardanoGovernanceProposal_Timestamp]: {
		ProposalEpochSource: {
			$proposal: {
				$network: { slug: 'cardano' },
				proposalTxHash: 'e2e-probe-cardano-proposal',
				proposalIndex: 0,
			},
			epoch: 0,
			source: Source.Blockfrost_Rest,
		},
	},
	[EntityType.CardanoStakePool]: {
		NetworkPoolId: {
			$network: { slug: 'cardano' },
			poolId: 'pool1e2eprobe',
		},
	},
	[EntityType.CardanoTransaction]: {
		NetworkHash: {
			$network: { slug: 'cardano' },
			hash: 'e2e-probe-cardano-transaction',
		},
	},
	[EntityType.CardanoTxInput]: {
		TransactionInputIndex: {
			$transaction: {
				$network: { slug: 'cardano' },
				hash: 'e2e-probe-cardano-transaction',
			},
			inputIndex: 0,
		},
	},
	[EntityType.CardanoTxOutput]: {
		TransactionOutputIndex: {
			$transaction: {
				$network: { slug: 'cardano' },
				hash: 'e2e-probe-cardano-transaction',
			},
			outputIndex: 0,
		},
	},
	[EntityType.CardanoNetwork_Timestamp]: {
		NetworkTimestampMsSource: {
			$network: { slug: 'cardano' },
			timestampMs: 0,
			source: Source.Blockfrost_Rest,
		},
	},
	[EntityType.EthereumConsensusUpgrade]: {
		EvmNetworkSlug: {
			$network: mainnet,
			slug: 'bellatrix',
		},
	},
	[EntityType.EthereumExecutionUpgrade]: {
		EvmNetworkSlug: {
			$network: mainnet,
			slug: 'homestead',
		},
	},
	[EntityType.EthereumNetworkUpgrade]: {
		EvmNetworkSlug: {
			$network: mainnet,
			slug: 'homestead',
		},
	},
	[EntityType.EvmBlock]: {
		EvmNetworkBlockHash: {
			$network: mainnet,
			hash: SAMPLE_TX_HASH,
		},
	},
	[EntityType.Eip8004AgentRegistration]: {
		NamespaceChainIdIdentityRegistryAgentId: {
			namespace: 'eip155',
			chainId: 1,
			identityRegistry: '0x0000000000000000000000000000000000000000',
			agentId: '1',
		},
	},
	[EntityType.Eip8004AgentServiceEndpoint]: {
		RegistrationFileEndpointKindEndpointUrl: {
			$registrationFile: {
				$registration: {
					namespace: 'eip155',
					chainId: 1,
					identityRegistry: '0x0000000000000000000000000000000000000000',
					agentId: '1',
				},
				fileUrl: 'https://example.com/agent.json',
			},
			endpointKind: 'a2a',
			endpointUrl: 'https://example.com/a2a',
		},
	},
	[EntityType.HederaBlock]: {
		NetworkBlockNumber: {
			$network: { slug: 'hedera' },
			blockNumber: 1n,
		},
		NetworkBlockHash: {
			$network: { slug: 'hedera' },
			blockHash: 'e2e-probe-hedera-block',
		},
	},
	[EntityType.HederaAccount]: {
		NetworkAccountId: {
			$network: { slug: 'hedera' },
			accountId: '0.0.98',
		},
	},
	[EntityType.HederaTransaction]: {
		NetworkConsensusTimestamp: {
			$network: { slug: 'hedera' },
			consensusTimestamp: '1234567890.000000000',
		},
		NetworkTransactionIdNonce: {
			$network: { slug: 'hedera' },
			transactionId: '0.0.98-1234567890-000000000',
			nonce: 0,
		},
	},
	[EntityType.EvmNetworkActorCoinBalance]: {
		EvmAccountNativeCoinInstance: {
			$actor: actorMainnetVitalik,
			$network: mainnet,
		},
	},
	[EntityType.FarcasterFeed]: {
		ByUser: {
			variant: 'user',
			fid: 3,
		},
		ByChannel: {
			variant: 'channel',
			channelId: 'memes',
		},
		Following: {
			variant: 'following',
			viewerFid: 3,
		},
	},
	[EntityType.LensAccount]: {
		LocalName: { localName: 'vitalik' },
		LegacyProfileId: { legacyProfileId: '0x01' },
	},
	[EntityType.LensFeed]: {
		Address: {
			address: VITALIK_ADDRESS,
		},
	},
	[EntityType.SolanaInstruction]: {
		SolanaTransactionIndexInInstruction: {
			$transaction: {
				$network: solana,
				signature: 'e2eProbeSolanaSignature1111111111111111111111111111111',
			},
			instructionKind: SolanaInstructionKind.InnerInstruction,
			indexInTransaction: 0,
			indexInInstruction: 0,
		},
	},
	[EntityType.TonAccount]: {
		NetworkAddress: {
			$network: {
				caip2: {
					namespace: Caip2Namespace.Ton,
					reference: Caip2Reference.TonMainnet,
				},
			},
			address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
		},
	},
	[EntityType.XUser]: {
		Username: { username: 'x' },
	},
	[EntityType.AptosCoinBalance_Timestamp]: {
		AccountStorageIdLedgerVersionSource: {
			$account: {
				$network: { $network: aptosMainnet },
				address: '0xa11ce',
			},
			storageId: '0xe2e-probe-aptos-coin-store',
			ledgerVersion: 0n,
			source: Source.AptosIndexer_Graphql,
		},
	},
	[EntityType.EvmCoinInstance]: {
		NetworkTypeContract: coinInstanceUsdcMainnet,
	},
	[EntityType.AptosTableItem]: {
		NetworkTableHandleKeyHash: {
			$network: { $network: aptosMainnet },
			tableHandle: '0xe2e-probe-table',
			keyHash: '0xe2e-probe-key',
		},
	},
	[EntityType.AptosTableItem_Timestamp]: {
		TableItemLedgerVersionSource: {
			$tableItem: {
				$network: { $network: aptosMainnet },
				tableHandle: '0xe2e-probe-table',
				keyHash: '0xe2e-probe-key',
			},
			ledgerVersion: 0n,
			source: Source.AptosIndexer_Graphql,
		},
	},
	[EntityType.AtprotoPost_Timestamp]: {
		AtprotoPostTimestampMs: {
			$post: { uri: atprotoNetworkSeedPosts[0].uri },
			timestampMs: 0,
		},
	},
	[EntityType.Network]: {
		Slug: { slug: 'near' },
	},
	[EntityType.Coin_Timestamp]: {
		CoinTimestampMsSource: {
			$coin: { coinId: CoinId.ETH },
			timestampMs: 0,
			source: Source.Coingecko_Rest,
		},
	},
	[EntityType._GlobalArweaveNetwork]: {
		Scope: { scope: '_GlobalArweaveNetwork' },
	},
	[EntityType._GlobalIpfsAccess]: {
		Scope: { scope: '_GlobalIpfsAccess' },
	},
	[EntityType._GlobalSwarmAccess]: {
		Scope: { scope: '_GlobalSwarmAccess' },
	},
	[EntityType._GlobalXNetwork]: {
		Scope: { scope: '_GlobalXNetwork' },
	},
	[EntityType._GlobalNostrNetwork]: {
		Scope: { scope: '_GlobalNostrNetwork' },
	},
	[EntityType._GlobalRedditNetwork]: {
		Scope: { scope: '_GlobalRedditNetwork' },
	},
	[EntityType._GlobalYoutubeNetwork]: {
		Scope: { scope: '_GlobalYoutubeNetwork' },
	},
	[EntityType.MarketAsset]: {
		KindAssetKey: {
			kind: MarketAssetKind.Coin,
			assetKey: CoinId.ETH,
		},
	},
	[EntityType.CosmosAccount_Timestamp]: {
		AccountTimestampMsSource: {
			$account: {
				$network: cosmos,
				address: 'cosmos1e2eprobeaccount',
			},
			timestampMs: 0,
			source: Source.CosmosSdk_Rest,
		},
	},
	[EntityType.CosmosValidator_Timestamp]: {
		ValidatorTimestampMsSource: {
			$validator: {
				$network: cosmos,
				operatorAddress: 'cosmosvaloper1e2eprobevalidator',
			},
			timestampMs: 0,
			source: Source.CosmosSdk_Rest,
		},
	},
	[EntityType.CosmosGovernanceProposal_Timestamp]: {
		ProposalTimestampMsSource: {
			$proposal: {
				$network: cosmos,
				proposalId: '1',
			},
			timestampMs: 0,
			source: Source.CosmosSdk_Rest,
		},
	},
	[EntityType.LiquidityPool_Block]: {
		LiquidityPoolBlockNumber: {
			$liquidityPool: {
				$network: mainnet,
				id: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
			},
			blockNumber: 18_000_000n,
		},
	},
	[EntityType.EvmAccount]: {
		AddressInteropAddress: {
			address: VITALIK_ADDRESS,
			interopAddress: `eip155:1:${VITALIK_ADDRESS}`,
		},
	},
	[EntityType.EnsRecord]: {
		NameRecordKey: {
			$name: { name: 'vitalik.eth' },
			recordKey: 'addr',
		},
	},
	[EntityType.ElementsAsset_Timestamp]: {
		AssetTimestampMsSource: {
			$asset: {
				$network: liquid,
				assetId: 'eb5dc6b623d3d376c51f01a736e1447ec1c462bf4ca8461bb07a184abc7545ea',
			},
			timestampMs: 0,
			source: Source.Esplora_Rest,
		},
	},
	[EntityType.FarcasterCast]: {
		ClientUrl: { clientUrl: 'https://warpcast.com/~/conversations/e2e-probe' },
		UsernameHashPrefix: {
			username: 'vitalik.eth',
			hashPrefix: CAST_HASH_32.slice(0, 12),
		},
	},
	[EntityType.HyperliquidPerpMarket_Timestamp]: {
		PerpMarketTimestampMsSource: {
			$perpMarket: {
				$network: hyperliquidNetwork,
				coin: 'BTC',
			},
			timestampMs: 0,
			source: Source.Hyperliquid_Rest,
		},
	},
	[EntityType.HyperliquidValidator_Timestamp]: {
		ValidatorTimestampMsSource: {
			$validator: {
				$network: hyperliquidNetwork,
				validator: 'e2e-probe-validator',
			},
			timestampMs: 0,
			source: Source.Hyperliquid_Rest,
		},
	},
	[EntityType.LensAccount_Timestamp]: {
		LensAccountTimestampMs: {
			$account: { address: VITALIK_ADDRESS },
			timestampMs: 0,
		},
	},
	[EntityType.LensPost_Timestamp]: {
		LensPostTimestampMs: {
			$post: { id: '0x0000000000000000000000000000000000000000000000000000000000000001' },
			timestampMs: 0,
		},
	},
	[EntityType.LightningNode_Timestamp]: {
		NodeTimestampMsSource: {
			$node: {
				$network: lightningNetwork,
				publicKey: '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
			},
			timestampMs: 0,
			source: Source.LightningMempoolSpace_Rest,
		},
	},
	[EntityType.LightningChannel_Timestamp]: {
		ChannelTimestampMsSource: {
			$channel: {
				$network: lightningNetwork,
				channelId: '852861482917888001',
			},
			timestampMs: 0,
			source: Source.LightningMempoolSpace_Rest,
		},
	},
	[EntityType.BlockheadLightningInvoice_Timestamp]: {
		InvoiceTimestampMsSource: {
			$invoice: {
				$network: lightningNetwork,
				paymentHash: 'e2e-probe-lightning-invoice',
			},
			timestampMs: 0,
			source: Source.LightningLnd_Rest,
		},
	},
	[EntityType.BlockheadLightningPayment_Timestamp]: {
		PaymentTimestampMsSource: {
			$payment: {
				$network: lightningNetwork,
				paymentHash: 'e2e-probe-lightning-payment',
			},
			timestampMs: 0,
			source: Source.LightningLnd_Rest,
		},
	},
	[EntityType.WalletConnectionMethod]: {
		Id: { id: 'e2e-probe-wallet-connection-method' },
	},
	[EntityType.BlockheadSocialPostSession]: {
		Id: { id: 'e2e-probe-social-post-session' },
	},
	[EntityType.BlockheadLocalMediaIngest]: {
		IngestId: { ingestId: 'e2e-probe-media-ingest' },
	},
	[EntityType.BlockheadLocalMediaIngest_Timestamp]: {
		IngestTimestampMsSource: {
			$ingest: { ingestId: 'e2e-probe-media-ingest' },
			timestampMs: 0,
			source: Source.Local_Internal,
		},
	},
	[EntityType.BlockheadSiweChallenge]: {
		Id: { id: 'e2e-probe-siwe-challenge' },
	},
	[EntityType.BlockheadFilecoinPendingMessage]: {
		NodeIdMessageCidObservedAtMs: {
			nodeId: 'e2e-probe-filecoin-node',
			messageCid: 'bafy2bzacee2e-probe-filecoin-message',
			observedAtMs: 0,
		},
	},
	[EntityType.BlockheadStateChannel_Timestamp]: {
		ChannelTimestampMsSource: {
			$channel: { id: 'e2e-probe-state-channel' },
			timestampMs: 0,
			source: Source.Local_Internal,
		},
	},
	[EntityType.BlockheadStateChannelDeposit_Timestamp]: {
		DepositTimestampMsSource: {
			$deposit: {
				$channel: { id: 'e2e-probe-state-channel' },
				$account: actorMainnetVitalik,
			},
			timestampMs: 0,
			source: Source.Local_Internal,
		},
	},
	[EntityType.BlockheadTransferRequest]: {
		IdEvmNetwork: {
			id: 'e2e-probe-transfer-request',
			$network: mainnet,
		},
	},
	[EntityType.BlockheadWorkspace]: {
		Id: { id: 'e2e-probe-workspace' },
	},
	[EntityType.BlockheadPanel]: {
		TreeIdPanelId: {
			treeId: 'e2e-probe-panel-tree',
			panelId: 'e2e-probe-panel',
		},
	},
	[EntityType._GlobalEvmAbiCatalog]: {
		Scope: { scope: '_GlobalEvmAbiCatalog' },
	},
	[EntityType._GlobalEvmAbiCatalog_Timestamp]: {
		HubTimestampMsSource: {
			$hub: { scope: '_GlobalEvmAbiCatalog' },
			timestampMs: 0,
			source: Source.Local_Internal,
		},
	},
	[EntityType._GlobalEnsNetwork_Timestamp]: {
		HubTimestampMsSource: {
			$hub: { scope: '_GlobalEnsNetwork' },
			timestampMs: 0,
			source: Source.TheGraph_Graphql,
		},
	},
	[EntityType.EnsName_Timestamp]: {
		NameTimestampMsSource: {
			$name: { name: 'vitalik.eth' },
			timestampMs: 0,
			source: Source.TheGraph_Graphql,
		},
	},
	[EntityType._GlobalSwarmAccess_Timestamp]: {
		HubTimestampMsSource: {
			$hub: { scope: '_GlobalSwarmAccess' },
			timestampMs: 0,
			source: Source.Swarm_Rest,
		},
	},
	[EntityType.FilecoinActor_Timestamp]: {
		ActorTimestampMsSource: {
			$actor: {
				$network: filecoin,
				address: 'f01234',
			},
			timestampMs: 0,
			source: Source.Lotus_JsonRpc,
		},
		ActorHeightTipsetKeySource: {
			$actor: {
				$network: filecoin,
				address: 'f01234',
			},
			height: 4_000_000n,
			tipsetKey: 'e2e-probe-tipset',
			source: Source.Lotus_JsonRpc,
		},
	},
	[EntityType.FilecoinSector_Timestamp]: {
		SectorTimestampMsSource: {
			$sector: {
				$miner: {
					$network: filecoin,
					minerAddress: 'f01234',
				},
				sectorNumber: 1n,
			},
			timestampMs: 0,
			source: Source.Lotus_JsonRpc,
		},
	},
	[EntityType.FilecoinMiner_Timestamp]: {
		MinerTimestampMsSource: {
			$miner: {
				$network: filecoin,
				minerAddress: 'f01234',
			},
			timestampMs: 0,
			source: Source.Lotus_JsonRpc,
		},
		MinerHeightTipsetKeySource: {
			$miner: {
				$network: filecoin,
				minerAddress: 'f01234',
			},
			height: 4_000_000n,
			tipsetKey: 'e2e-probe-tipset',
			source: Source.Lotus_JsonRpc,
		},
	},
	[EntityType._GlobalActivityPubNetwork]: {
		Scope: { scope: '_GlobalActivityPubNetwork' },
	},
	[EntityType._GlobalActivityPubNetwork_Timestamp]: {
		HubTimestampMsSource: {
			$hub: { scope: '_GlobalActivityPubNetwork' },
			timestampMs: 0,
			source: Source.Mastodon_Rest,
		},
	},
	[EntityType.ActivityPubInstance]: {
		InstanceOrigin: {
			instanceOrigin: 'https://mastodon.social',
		},
		InstanceOriginSource: {
			instanceOrigin: 'https://mastodon.social',
			source: Source.Mastodon_Rest,
		},
	},
	[EntityType.ActivityPubInstance_Timestamp]: {
		InstanceTimestampMsSource: {
			$instance: {
				instanceOrigin: 'https://mastodon.social',
			},
			timestampMs: 0,
			source: Source.Mastodon_Rest,
		},
	},
	[EntityType.ActivityPubInstancePeer]: {
		ObservationPeerDomain: {
			$observation: {
				$instance: {
					instanceOrigin: 'https://mastodon.social',
				},
				timestampMs: 0,
				source: Source.Mastodon_Rest,
			},
			peerDomain: 'fosstodon.org',
		},
		InstanceOriginPeerDomainSource: {
			instanceOrigin: 'https://mastodon.social',
			peerDomain: 'fosstodon.org',
			source: Source.Mastodon_Rest,
		},
	},
	[EntityType.ActivityPubInstanceModeratedDomain]: {
		ObservationDomain: {
			$observation: {
				$instance: {
					instanceOrigin: 'https://mastodon.social',
				},
				timestampMs: 0,
				source: Source.Mastodon_Rest,
			},
			domain: 'example.com',
		},
		InstanceOriginModeratedDomainSource: {
			instanceOrigin: 'https://mastodon.social',
			domain: 'example.com',
			source: Source.Mastodon_Rest,
		},
	},
	[EntityType.ActivityPubActor_Timestamp]: {
		ActivityPubActorTimestampMs: {
			$actor: {
				instanceOrigin: 'https://mastodon.social',
				localAccountId: '13179',
			},
			timestampMs: 0,
		},
		ActivityPubActorTimestampMsSource: {
			$actor: {
				instanceOrigin: 'https://mastodon.social',
				localAccountId: '13179',
			},
			timestampMs: 0,
			source: Source.Mastodon_Rest,
		},
	},
	[EntityType.ActivityPubNote_Timestamp]: {
		ActivityPubNoteTimestampMs: {
			$note: {
				instanceOrigin: 'https://mastodon.social',
				localStatusId: '116539053870420123',
			},
			timestampMs: 0,
		},
		ActivityPubNoteTimestampMsSource: {
			$note: {
				instanceOrigin: 'https://mastodon.social',
				localStatusId: '116539053870420123',
			},
			timestampMs: 0,
			source: Source.Mastodon_Rest,
		},
	},
	[EntityType.UrlPreview_Timestamp]: {
		UrlTimestampMsSource: {
			$url: { url: 'https://example.com/' },
			timestampMs: 0,
			source: Source.MetadataVision_Rest,
		},
	},
	[EntityType.MevRelay_Timestamp]: {
		RelayTimestampMsSource: {
			$relay: {
				$network: mainnet,
				host: 'relay.ultrasound.money',
			},
			timestampMs: 0,
			source: Source.MevRelay_Rest,
		},
	},
	[EntityType.MevBuilder_Timestamp]: {
		BuilderTimestampMsSource: {
			$builder: {
				$network: mainnet,
				builderPubkey: `0x${'0'.repeat(96)}`,
			},
			timestampMs: 0,
			source: Source.MevRelay_Rest,
		},
	},
	[EntityType.MoneroNetwork_Timestamp]: {
		NetworkTimestampMsSource: {
			$network: monero,
			timestampMs: 0,
			source: Source.MoneroDaemonRpc_JsonRpc,
		},
	},
	[EntityType.NearAccount_Timestamp]: {
		AccountTimestampMsSource: {
			$account: {
				$network: nearNetwork,
				accountId: 'near',
			},
			timestampMs: 0,
			source: Source.NearRpc_JsonRpc,
		},
	},
	[EntityType.NearContract_Timestamp]: {
		ContractTimestampMsSource: {
			$contract: {
				$network: nearNetwork,
				accountId: 'near',
			},
			timestampMs: 0,
			source: Source.NearRpc_JsonRpc,
		},
	},
	[EntityType.NearAccessKey_Timestamp]: {
		AccessKeyTimestampMsSource: {
			$accessKey: {
				$account: {
					$network: nearNetwork,
					accountId: 'near',
				},
				publicKey: 'ed25519:e2e-probe-near-access-key',
			},
			timestampMs: 0,
			source: Source.NearRpc_JsonRpc,
		},
	},
	[EntityType.NearContractStorageEntry]: {
		ContractKeyBlockHeightSource: {
			$contract: {
				$network: nearNetwork,
				accountId: 'near',
			},
			keyBase64: '',
			blockHeight: 100_000_000n,
			source: Source.NearRpc_JsonRpc,
		},
	},
	[EntityType.NearValidator_Timestamp]: {
		ValidatorEpochIdSource: {
			$validator: {
				$network: nearNetwork,
				accountId: 'e2e-probe-near-validator',
			},
			epochId: 'e2e-probe-near-epoch',
			source: Source.NearRpc_JsonRpc,
		},
	},
	[EntityType.NearNetwork_Timestamp]: {
		NetworkTimestampMsSource: {
			$network: nearNetwork,
			timestampMs: 0,
			source: Source.NearRpc_JsonRpc,
		},
	},
	[EntityType.NostrSearchQuery]: {
		Query: {
			query: 'ethereum',
		},
	},
	[EntityType.NostrProfileMetadataEvent]: {
		CanonicalEventId: {
			eventId: `${'a'.repeat(64)}`,
		},
	},
	[EntityType.NostrArticleEvent]: {
		CanonicalEventId: {
			eventId: NOSTR_PROBE_REACTION_EVENT_ID,
		},
	},
	[EntityType.Network_Activity_Day]: {
		NetworkDayStartTimestampMsSource: {
			$network: mainnet,
			dayStartTimestampMs: 0,
			source: Source.SpaceAndTime_MakeInfinite,
		},
	},
	[EntityType.PolkadotReferendum_Timestamp]: {
		ReferendumTimestampMsSource: {
			$referendum: {
				$network: polkadot,
				referendumId: '1',
			},
			timestampMs: 0,
			source: Source.Subscan_Rest,
		},
	},
	[EntityType.StarknetContract]: {
		NetworkAddress: {
			$network: {
				$network: {
					caip2: networkBySlug.starknet.caip2,
				},
			},
			address: '0x1',
		},
	},
	[EntityType.StarknetAccount_Timestamp]: {
		ContractBlockNumberSource: {
			$contract: {
				$network: {
					$network: {
						caip2: networkBySlug.starknet.caip2,
					},
				},
				address: '0x1',
			},
			blockNumber: 0n,
			source: Source.Pathfinder,
		},
	},
	[EntityType.TonJetton]: {
		NetworkMasterAddress: {
			$network: {
				caip2: {
					namespace: Caip2Namespace.Ton,
					reference: Caip2Reference.TonMainnet,
				},
			},
			masterAddress: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
		},
	},
	[EntityType.TezosAccount]: {
		NetworkAddress: {
			$network: {
				$network: { slug: 'tezos' },
			},
			address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
		},
	},
	[EntityType.TezosBlock]: {
		NetworkLevel: {
			$network: {
				$network: { slug: 'tezos' },
			},
			level: 1n,
		},
	},
	[EntityType.XrplAccount]: {
		NetworkAccount: {
			$network: { slug: 'xrpl' },
			account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
		},
	},
	[EntityType.XrplAccount_Timestamp]: {
		AccountLedgerIndexSource: {
			$account: {
				$network: { slug: 'xrpl' },
				account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
			},
			ledgerIndex: 0n,
			source: Source.Xrpl_Rippled,
		},
	},
	[EntityType.NostrRelay_Timestamp]: {
		RelayTimestampMsSource: {
			$relay: { relayUrl: NOSTR_PROBE_RELAY_URL },
			timestampMs: 0,
			source: Source.NostrRelay_Nip11_Http,
		},
	},
	[EntityType.EvmSelector_Timestamp]: {
		SelectorTimestampMsSource: {
			$selector: { hex: TRANSFER_SELECTOR },
			timestampMs: 0,
			source: Source.Openchain_Rest,
		},
	},
	[EntityType.EvmTopic_Timestamp]: {
		TopicTimestampMsSource: {
			$topic: { hex: TRANSFER_TOPIC },
			timestampMs: 0,
			source: Source.Openchain_Rest,
		},
	},
	[EntityType.EvmError_Timestamp]: {
		ErrorTimestampMsSource: {
			$error: { hex: ERROR_SELECTOR },
			timestampMs: 0,
			source: Source.Openchain_Rest,
		},
	},
	[EntityType.YoutubeComment_Timestamp]: {
		YoutubeCommentTimestampMs: {
			$comment: {
				videoId: YOUTUBE_PROBE_VIDEO_ID,
				commentId: YOUTUBE_PROBE_COMMENT_ID,
			},
			timestampMs: 0,
		},
	},
	[EntityType.YoutubePlaylist_Timestamp]: {
		YoutubePlaylistTimestampMs: {
			$playlist: { playlistId: YOUTUBE_PROBE_PLAYLIST_ID },
			timestampMs: 0,
		},
	},
	[EntityType.RssItem]: {
		FeedIdentity: {
			$feed: { feedUrl: 'https://hnrss.org/item?id=48592832' },
			itemIdentityKind: 'Guid',
			itemIdentity: 'https://news.ycombinator.com/item?id=48594706',
		},
	},
	[EntityType.RssFeed_Timestamp]: {
		FeedTimestampMsSource: {
			$feed: { feedUrl: 'https://hnrss.org/item?id=48592832' },
			timestampMs: 0,
			source: Source.Rss_Rest,
		},
	},
	[EntityType.RssItem_Timestamp]: {
		ItemTimestampMsSource: {
			$item: {
				$feed: { feedUrl: 'https://hnrss.org/item?id=48592832' },
				itemIdentityKind: 'Guid',
				itemIdentity: 'https://news.ycombinator.com/item?id=48594706',
			},
			timestampMs: 0,
			source: Source.Rss_Rest,
		},
	},
	[EntityType.FarcasterCastEmbed]: {
		CastIndexInCast: {
			$cast: {
				fid: 3,
				hash: CAST_HASH_32,
			},
			indexInCast: 0,
		},
	},
	[EntityType.SolanaAccount_Timestamp]: {
		AccountSlotSource: {
			$account: {
				$network: solana,
				pubkey: '11111111111111111111111111111111',
			},
			slot: 250_000_000n,
			source: Source.Solana_JsonRpc,
		},
	},
	[EntityType.SolanaTokenMint_Timestamp]: {
		MintSlotSource: {
			$mint: {
				$network: solana,
				mintAddress: 'So11111111111111111111111111111111111111112',
			},
			slot: 250_000_000n,
			source: Source.Solana_JsonRpc,
		},
	},
	[EntityType.SolanaTokenAccount]: {
		NetworkTokenAccountPubkey: {
			$network: solana,
			tokenAccountPubkey: '11111111111111111111111111111111',
		},
	},
	[EntityType.SolanaTokenAccount_Timestamp]: {
		TokenAccountSlotSource: {
			$tokenAccount: {
				$network: solana,
				tokenAccountPubkey: '11111111111111111111111111111111',
			},
			slot: 250_000_000n,
			source: Source.Solana_JsonRpc,
		},
	},
	[EntityType.SolanaValidator_Timestamp]: {
		ValidatorSlotSource: {
			$validator: {
				$network: solana,
				votePubkey: 'Vote111111111111111111111111111111111111111',
			},
			slot: 250_000_000n,
			source: Source.Solana_JsonRpc,
		},
	},
	[EntityType.PolkadotAccount_Timestamp]: {
		AccountTimestampMsSource: {
			$account: {
				$network: polkadot,
				accountId: 'e2e-probe-polkadot-account',
			},
			timestampMs: 0,
			source: Source.SubstrateSidecar_Rest,
		},
	},
	[EntityType.TronAccount_Timestamp]: {
		AccountTimestampMsSource: {
			$account: {
				$network: tronNetwork,
				address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
			},
			timestampMs: 0,
			source: Source.TronGrid_Rest,
		},
	},
	[EntityType.TronTransactionReceipt]: {
		Transaction: {
			$transaction: {
				$network: tronNetwork,
				transactionId: 'e2e-probe-tron-transaction',
			},
		},
	},
	[EntityType.TronWitness_Timestamp]: {
		WitnessTimestampMsSource: {
			$witness: {
				$network: tronNetwork,
				address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
			},
			timestampMs: 0,
			source: Source.TronGrid_Rest,
		},
	},
	[EntityType.TronContract_Timestamp]: {
		ContractTimestampMsSource: {
			$contract: {
				$network: tronNetwork,
				address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
			},
			timestampMs: 0,
			source: Source.TronScan_Rest,
		},
	},
	[EntityType.TronToken_Timestamp]: {
		TokenTimestampMsSource: {
			$token: {
				$network: tronNetwork,
				tokenId: 'e2e-probe-tron-token',
			},
			timestampMs: 0,
			source: Source.TronScan_Rest,
		},
	},
	[EntityType.TronAccountTokenBalance_Timestamp]: {
		AccountTokenTimestampMsSource: {
			$account: {
				$network: tronNetwork,
				address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
			},
			$token: {
				$network: tronNetwork,
				tokenId: 'e2e-probe-tron-token',
			},
			timestampMs: 0,
			source: Source.TronScan_Rest,
		},
	},
	[EntityType.TezosNetwork]: {
		Network: { $network: { slug: 'tezos' } },
	},
	[EntityType.TezosContract]: {
		NetworkAddress: {
			$network: { $network: { slug: 'tezos' } },
			address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
		},
	},
	[EntityType.TezosOperationGroup]: {
		NetworkOperationHash: {
			$network: { $network: { slug: 'tezos' } },
			operationHash: 'ooe2e-probe-operation-group',
		},
	},
	[EntityType.TezosOperation]: {
		OperationGroupContentIndex: {
			$operationGroup: {
				$network: { $network: { slug: 'tezos' } },
				operationHash: 'ooe2e-probe-operation-group',
			},
			contentIndex: 0,
		},
	},
	[EntityType.TezosBigMap]: {
		ContractBigMapId: {
			$contract: {
				$network: { $network: { slug: 'tezos' } },
				address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
			},
			bigMapId: 1n,
		},
	},
	[EntityType.TezosBigMapKey]: {
		BigMapKeyHash: {
			$bigMap: {
				$contract: {
					$network: { $network: { slug: 'tezos' } },
					address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
				},
				bigMapId: 1n,
			},
			keyHash: 'expruE2eProbeKeyHash',
		},
	},
	[EntityType.TezosBigMap_Timestamp]: {
		BigMapLevelSource: {
			$bigMap: {
				$contract: {
					$network: { $network: { slug: 'tezos' } },
					address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
				},
				bigMapId: 1n,
			},
			level: 1n,
			source: Source.Tzkt_Rest,
		},
	},
	[EntityType.TezosBigMapDiff]: {
		OperationBigMapIdKeyHash: {
			$operation: {
				$operationGroup: {
					$network: { $network: { slug: 'tezos' } },
					operationHash: 'ooe2e-probe-operation-group',
				},
				contentIndex: 0,
			},
			bigMapId: 1n,
			keyHash: 'expruE2eProbeKeyHash',
		},
	},
	[EntityType.TezosBigMapKey_Timestamp]: {
		BigMapKeyLevelSource: {
			$bigMapKey: {
				$bigMap: {
					$contract: {
						$network: { $network: { slug: 'tezos' } },
						address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
					},
					bigMapId: 1n,
				},
				keyHash: 'expruE2eProbeKeyHash',
			},
			level: 1n,
			source: Source.Tzkt_Rest,
		},
	},
	[EntityType.EvmNetwork_Timestamp]: {
		NetworkTimestampMsSource: {
			$network: mainnet,
			timestampMs: 0,
			source: Source.Voltaire_JsonRpc,
		},
	},
	[EntityType.YoutubeVideo_Timestamp]: {
		YoutubeVideoTimestampMs: {
			$video: { videoId: YOUTUBE_PROBE_VIDEO_ID },
			timestampMs: 0,
		},
	},
	[EntityType.EvmNetworkAccount_Timestamp]: {
		AccountTimestampMsSource: {
			$account: evmNetworkAccountMainnetUsdc,
			timestampMs: 0,
			source: Source.ZeroGChain_JsonRpc,
		},
	},
	[EntityType.ZeroGConsensusNetwork_Timestamp]: {
		ConsensusNetworkTimestampMsSource: {
			$consensusNetwork: {
				$network: zeroGNetwork,
				consensusNetworkId: '0g-chain',
			},
			timestampMs: 0,
			source: Source.ZeroGChainScan_Rest,
		},
	},
	[EntityType.ZeroGStorageNode_Timestamp]: {
		StorageNodeTimestampMsSource: {
			$storageNode: {
				$network: zeroGNetwork,
				nodeId: '0x0000000000000000000000000000000000000000',
			},
			timestampMs: 0,
			source: Source.ZeroGStorageScan_Rest,
		},
	},
})

const parentProbeEntitySelectorByTypeAndName = Object.fromEntries(schema.map((entityDefinition) => [
	entityDefinition.entityType,
	Object.fromEntries(entityDefinition.selectors.flatMap((selectorDefinition) => {
		const override = Object.getOwnPropertyDescriptor(
			Object.getOwnPropertyDescriptor(
				parentProbeEntitySelectorOverridesByTypeAndName,
				entityDefinition.entityType
			)?.value ?? {},
			selectorDefinition.name
		)?.value
		if (override != null)
			return [[selectorDefinition.name, override]]

		const entitySelector = probeEntitySelectorByType[entityDefinition.entityType]
		if (entitySelector === undefined)
			return []

		const selector = Object.fromEntries(Object.entries(entitySelector).filter(([fieldName]) => (
			selectorDefinition.fields.includes(fieldName)
		)))
		try {
			if (validateEntitySelector(schema, entityDefinition, selector).name === selectorDefinition.name)
				return [[selectorDefinition.name, selector]]
		} catch {
			return []
		}

		return []
	})),
]))


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


/** Sources for which every executable binding requires process environment credentials. */
export const envGatedProbeSources = new Set<Source>(
	Object.values(Source).filter((source) => {
		const bindings = sourceProviderDefinitions
			.flatMap((provider) => provider.bindings)
			.filter((binding) => binding.source === source)

		return bindings.length > 0 && bindings.every((binding) => binding.credentials.some((credential) => (
			credential.scope === SourceCredentialScope.PublicConfig
			|| credential.scope === SourceCredentialScope.RuntimeSecret
			|| credential.scope === SourceCredentialScope.LocalSecret
		)))
	})
)


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


export const resolverPartProbeKey = (
	kind: 'field' | 'count',
	index: number,
	entityType: EntityType,
	facetPath: readonly string[],
	fieldName: string,
	source: Source
) => `${kind}:${index}:${[
	entityType,
	...facetPath,
	fieldName,
].join('.')}:${source}`


/**
	* Probe keys with known upstream gaps (missing explorer indexes, empty registry lists, …).
	* Matched before env/catalog/network defaults.
	*/
export const knownUpstreamGapProbeKeys = new Set<string>([
	resolverPartProbeKey('field', 0, EntityType.Network, ['Evm'], '$$erc4337Bundlers', Source.Blockscout_Rest),
	resolverPartProbeKey('field', 0, EntityType.Network, ['Evm'], '$$erc4337Paymasters', Source.Blockscout_Rest),
	resolverPartProbeKey('field', 0, EntityType.Network, ['Evm'], '$$erc4337AccountFactories', Source.Blockscout_Rest),
])


export const probeKeySource = (key: string): Source | undefined => {
	const sourceSegment = key.slice(key.lastIndexOf(':') + 1)
	for (const source of Object.values(Source)) {
		if (source === sourceSegment)
			return source
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
	probeCase: AssertLoadedResolverProbeCaseForClassification
): AssertLoadedResolverProbeCategory => {
	if (knownUpstreamGapProbeKeys.has(probeCase.key))
		return 'knownUpstreamGap'

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
	if (source != null && envGatedProbeSources.has(source))
		return 'envGated'
	if (source != null && catalogProbeSources.has(source))
		return 'catalog'

	return 'networkLive'
}


const probeEntitySelectorForType = (
	entityType: EntityType,
	selectorName: string
): EntitySelector<typeof schema, EntityType> => {
	const entitySelector = probeEntitySelectorByType[entityType]
	if (entitySelector === undefined)
		throw new Error(`Missing probe entity selector ${entityType}.${selectorName}`)
	const entityDefinition = entityDefinitionByType[entityType]
	const selectorDefinition = entityDefinition.selectors.find((selector) => selector.name === selectorName)
	if (selectorDefinition == null)
		throw new Error(`Missing probe entity selector ${entityType}.${selectorName}`)

	const projectedEntitySelector = Object.fromEntries(
		Object.entries(entitySelector).filter(([fieldName]) => selectorDefinition.fields.includes(fieldName))
	)
	if (validateEntitySelector(schema, entityDefinition, projectedEntitySelector).name !== selectorName)
		throw new Error(`Missing probe entity selector ${entityType}.${selectorName}`)

	return projectedEntitySelector
}

export const resolveProbeEntitySelector = async (
	entityType: EntityType,
	selectorName: string,
	source: Source
): Promise<EntitySelector<typeof schema, EntityType>> => {
	const entitySelector = parentEntitySelectorForResolverValuePart(entityType, selectorName)

	return entityDefinitionByType[entityType].selectors
		.find((selector) => selector.name === selectorName)
		?.fields.includes('source') === true ?
			{
				...entitySelector,
				source,
			}
		:
			entitySelector
}


export const parentEntitySelectorForResolverValuePart = (
	entityType: EntityType,
	selectorName: string
): EntitySelector<typeof schema, EntityType> => {
	const exactEntitySelector = Object.getOwnPropertyDescriptor(
		Object.getOwnPropertyDescriptor(
			parentProbeEntitySelectorByTypeAndName,
			entityType
		)?.value ?? {},
		selectorName
	)?.value
	if (exactEntitySelector != null) {
		const entityDefinition = entityDefinitionByType[entityType]
		if (validateEntitySelector(schema, entityDefinition, exactEntitySelector).name !== selectorName)
			throw new Error(`Missing parent probe entity selector ${entityType}.${selectorName}`)

		return exactEntitySelector
	}

	throw new Error(`Missing parent probe entity selector ${entityType}.${selectorName}`)
}


export const entityFieldValueForAssert = (
	value: ResolverValue
): ResolverValue => (
	value != null
		&& typeof value === 'object'
		&& !Array.isArray(value)
		&& EntityMetaKey.Selector in value ?
		({
			[EntityMetaKey.Selector]: value[EntityMetaKey.Selector],
			[EntityMetaKey.SelectorKey]: stringify(value[EntityMetaKey.Selector]),
		})
	:
		value
)
