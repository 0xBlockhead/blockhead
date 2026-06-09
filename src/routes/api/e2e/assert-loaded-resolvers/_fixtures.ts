import { stringify } from 'devalue'

import { CoinId } from '$/constants/Coin.ts'
import { ConsensusMechanismId } from '$/constants/ConsensusMechanism.ts'
import { currencyCatalogSnapshotTimestampMs, Iso4217 } from '$/constants/Currency.ts'
import { ExecutionEnvironmentId } from '$/constants/ExecutionEnvironment.ts'
import { catalogCoinUsdMarketIdByCoinId } from '$/constants/MarketCatalog.ts'
import { MarketTimeIntervalUnit } from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { NetworkStackId } from '$/constants/NetworkStack.ts'
import { ProposalCategory, SpecificationRealm } from '$/constants/SpecificationProposal.ts'
import { atprotoProbeDid, atprotoProbePostUri } from '$/constants/Social/Atproto.ts'
import { cashuProbeKeysetId, cashuProbeMintUrl } from '$/constants/Cashu.ts'
import {
	liquidNetworkId,
	liquidProbeAssetId,
} from '$/constants/ElementsNetwork.ts'
import { ElementsPegDirection } from '$/schema/ElementsPeg.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'
import { Source } from '$/sources/Source.ts'


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

export const NOSTR_PROBE_REPOST_EVENT_ID = `${'b'.repeat(64)}` as const

export const NOSTR_PROBE_REACTION_EVENT_ID = `${'c'.repeat(64)}` as const

export const NOSTR_PROBE_ARTICLE_IDENTIFIER = 'e2e-probe-article' as const

export const YOUTUBE_PROBE_PLAYLIST_ID = 'UU_x5XG1OV2P6uZZ5FSM9Ttw' as const

export const YOUTUBE_PROBE_VIDEO_ID = 'jNQXAC9IVRw' as const

export const YOUTUBE_PROBE_COMMENT_ID = 'e2e-probe-comment' as const

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

export const ethUsdCatalogMarket = catalogCoinUsdMarketIdByCoinId[CoinId.ETH]

const mainnetChainId = 1

const mainnet = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
} as const

const bitcoin = {
	caip2: {
		namespace: 'bip122',
		reference: '000000000019d6689c085ae165831e93',
	},
} as const

const lightning = {
	networkSlug: 'lightning',
} as const

const liquid = liquidNetworkId

const cashuProbeMint = {
	mintUrl: cashuProbeMintUrl,
} as const

const fedimintProbeFederation = {
	federationId: 'e2e-probe-federation',
} as const

const payjoinProbeDirectory = {
	directoryUrl: 'http://127.0.0.1:8080',
} as const

const zcash = {
	caip2: {
		namespace: 'bip122',
		reference: '00040fe8ec8471911baa1db1266ea15',
	},
} as const

const filecoin = {
	caip2: {
		namespace: 'fil',
		reference: 'f',
	},
} as const

const solana = {
	caip2: {
		namespace: 'solana',
		reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	},
} as const

const cosmos = {
	caip2: {
		namespace: 'cosmos',
		reference: 'cosmoshub-4',
	},
} as const

const polkadot = {
	caip2: {
		namespace: 'polkadot',
		reference: '91b171bb158e2d3848fa23a9f1c25182',
	},
} as const

const hyperliquid = {
	networkSlug: 'hyperliquid',
} as const

const bittensor = {
	networkSlug: 'bittensor',
} as const

const logos = {
	networkSlug: 'logos-testnet',
} as const

const quilibrium = {
	networkSlug: 'quilibrium',
} as const

const near = {
	networkSlug: 'near',
} as const

const tron = {
	networkSlug: 'tron',
} as const

const monero = {
	caip2: {
		namespace: 'monero',
		reference: '418015bb9ae982a1975da7d79277c270',
	},
} as const

const litecoin = {
	caip2: {
		namespace: 'bip122',
		reference: '12a765e31ffd4059bada1e25190f6e98',
	},
} as const

const dogecoin = {
	caip2: {
		namespace: 'bip122',
		reference: '1a91e3dace36e2be3bf030a65679fe82',
	},
} as const

const bitcoinCash = {
	caip2: {
		namespace: 'bip122',
		reference: '000000000000000000651ef99cb9fcbe',
	},
} as const

const zeroG = {
	networkSlug: '0g',
} as const

type ProbeEntityIdByType = {
	[_EntityType in EntityType]?: EntityId<typeof schema, _EntityType>
}

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
	fromAmount: '1000000000000000',
	fromAddress: VITALIK_ADDRESS,
	slippage: 0.005,
} as const

/**
 * Probe entity ids for `resolverDefinitionProbes` smoke shapes; must match each type’s Arktype `id`.
 */
export const probeEntityIdByType: ProbeEntityIdByType = {
	[EntityType._Global]: { scope: 'global' },

	[EntityType.BlockheadWallet]: { id: 'eip6963:e2e-probe-wallet' },
	[EntityType.BlockheadWalletAccount]: {
		caip10: {
			namespace: 'eip155',
			reference: '1',
			accountAddress: VITALIK_ADDRESS,
		},
	},
	[EntityType.BlockheadWalletConnection]: {
		$wallet: { id: 'eip6963:e2e-probe-wallet' },
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
		$coinInstance: coinInstanceUsdcMainnet,
	},

	[EntityType.EvmActorCoinAllowance]: {
		$actorCoin: {
			$actor: actorMainnetVitalik,
			$coinInstance: coinInstanceUsdcMainnet,
		},
		$spender: {
			address: '0x0000000000000000000000000000000000000001',
		},
	},

	[EntityType.EvmNetworkAccount]: evmNetworkAccountMainnetUsdc,

	[EntityType.AtprotoActor]: { did: atprotoProbeDid },
	[EntityType.AtprotoActor_Timestamp]: {
		$actor: { did: atprotoProbeDid },
		timestampMs: 0,
	},
	[EntityType.AtprotoNetwork]: { scope: 'AtprotoNetwork' },
	[EntityType.AtprotoPost]: {
		uri: atprotoProbePostUri,
	},
	[EntityType.AtprotoPost_Timestamp]: {
		$post: {
			uri: atprotoProbePostUri,
		},
		timestampMs: 0,
	},

	[EntityType.BeaconEpoch]: { $network: mainnet, epoch: 300_000 },
	[EntityType.BeaconSlot]: { $network: mainnet, slot: 9_500_000 },
	[EntityType.BeaconValidator]: {
		$network: mainnet,
		validatorIndex: 0,
	},
	[EntityType.BeaconCommittee]: {
		$network: mainnet,
		slot: 9_500_000,
		index: 0,
	},
	[EntityType.BeaconSyncCommittee]: {
		$network: mainnet,
		period: 0,
	},
	[EntityType.BeaconAttestation]: {
		$network: mainnet,
		slot: 9_500_000,
		index: 0,
	},
	[EntityType.BeaconWithdrawal]: {
		$network: mainnet,
		slot: 9_500_000,
		index: 0,
	},
	[EntityType.BeaconSlashing]: {
		$network: mainnet,
		slot: 9_500_000,
		kind: 'attester',
		index: 0,
	},

	[EntityType.BittensorNetwork]: bittensor,
	[EntityType.BittensorNetwork_Timestamp]: {
		$network: bittensor,
		timestampMs: 0,
	},
	[EntityType.BittensorBlock]: {
		$network: bittensor,
		blockNumber: 1_000_000n,
	},
	[EntityType.BittensorSubnet]: {
		$network: bittensor,
		netuid: 1,
	},
	[EntityType.BittensorMetagraph_Timestamp]: {
		$subnet: {
			$network: bittensor,
			netuid: 1,
		},
		timestampMs: 0,
	},
	[EntityType.BittensorNeuron]: {
		$subnet: {
			$network: bittensor,
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
					namespace: 'eip155',
					reference: '10',
				},
			},
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
		logIndex: 0,
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
	[EntityType.FarcasterCast_Timestamp]: {
		$cast: { fid: 3, hash: CAST_HASH_32 },
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
	},

	[EntityType.Url]: {
		url: 'https://example.com/',
	},

	[EntityType.EvmNft]: {
	$contract: {
			$network: { caip2: { namespace: 'eip155', reference: '56' } },
			address: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
		},
		tokenId: '104776',
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
	[EntityType.Currency_Timestamp]: {
		$currency: { iso4217: Iso4217.USD },
		timestampMs: currencyCatalogSnapshotTimestampMs,
	},
	[EntityType.Market_Timestamp]: {
		$market: ethUsdCatalogMarket,
		timestampMs: 0,
	},

	[EntityType.EvmNetwork]: mainnet,
	[EntityType.EvmNetworkBridge]: {
		$fromNetwork: mainnet,
		$toNetwork: { caip2: { namespace: 'eip155', reference: '10' } },
		url: 'https://bridge.example',
	},
	[EntityType.EvmRollup]: {
		$network: { caip2: { namespace: 'eip155', reference: '10' } },
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
	},
	[EntityType.EvmNetwork_Txpool_Timestamp]: {
		$network: mainnet,
		timestampMs: 0,
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
	[EntityType.ConsensusMechanism]: {
		consensusMechanismId: ConsensusMechanismId.EthereumBeaconProofOfStake,
	},
	[EntityType.ExecutionEnvironment]: {
		executionEnvironmentId: ExecutionEnvironmentId.Evm,
	},

	[EntityType.Network]: bitcoin,
	[EntityType.AssetInstance]: {
		$network: bitcoin,
		kind: AssetInstanceKind.Native,
		assetKey: CoinId.BTC,
	},
	[EntityType.NetworkUpgrade]: {
		$network: bitcoin,
		upgradeId: 'taproot',
	},
	[EntityType.UtxoNetwork]: bitcoin,
	[EntityType.UtxoNetwork_Timestamp]: {
		$network: bitcoin,
		timestampMs: 0,
	},
	[EntityType.UtxoAddress]: {
		$network: bitcoin,
		address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
	},
	[EntityType.UtxoBlock]: {
		$network: bitcoin,
		height: 840_000n,
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
		inputIndex: 0,
	},
	[EntityType.UtxoOutput]: {
		$transaction: {
			$network: bitcoin,
			txId: 'e2e-probe-utxo-transaction',
		},
		outputIndex: 0,
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
		actionIndex: 0,
	},
	[EntityType.FilecoinNetwork]: filecoin,
	[EntityType.FilecoinNetwork_Timestamp]: {
		$network: filecoin,
		timestampMs: 1_700_000_000_000,
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
	[EntityType.SolanaNetwork]: solana,
	[EntityType.SolanaNetwork_Timestamp]: {
		$network: solana,
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.SolanaBlock]: {
		$network: solana,
		slot: 250_000_000n,
	},
	[EntityType.SolanaTransaction]: {
		$network: solana,
		signature: 'e2eProbeSolanaSignature1111111111111111111111111111111',
	},
	[EntityType.SolanaInstruction]: {
		$transaction: {
			$network: solana,
			signature: 'e2eProbeSolanaSignature1111111111111111111111111111111',
		},
		instructionIndex: 0,
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
	[EntityType.TronNetwork]: tron,
	[EntityType.TronNetwork_Timestamp]: {
		$network: tron,
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.TronBlock]: {
		$network: tron,
		height: 60_000_000n,
	},
	[EntityType.TronTransaction]: {
		$network: tron,
		transactionId: 'e2e-probe-tron-transaction',
	},
	[EntityType.TronAccount]: {
		$network: tron,
		address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
	},
	[EntityType.TronWitness]: {
		$network: tron,
		address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
	},
	[EntityType.TronContract]: {
		$network: tron,
		address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
	},
	[EntityType.TronToken]: {
		$network: tron,
		tokenId: 'e2e-probe-tron-token',
	},
	[EntityType.TronTokenTransfer]: {
		$network: tron,
		transactionId: 'e2e-probe-tron-transaction',
		transferIndex: 0,
	},
	[EntityType.CosmosNetwork]: cosmos,
	[EntityType.CosmosNetwork_Timestamp]: {
		$network: cosmos,
		timestampMs: 1_700_000_000_000,
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
		messageIndex: 0,
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
	[EntityType.PolkadotNetwork]: polkadot,
	[EntityType.PolkadotNetwork_Timestamp]: {
		$network: polkadot,
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.PolkadotBlock]: {
		$network: polkadot,
		blockNumber: 20_000_000n,
	},
	[EntityType.PolkadotExtrinsic]: {
		$block: {
			$network: polkadot,
			blockNumber: 20_000_000n,
		},
		extrinsicIndex: 0,
	},
	[EntityType.PolkadotEvent]: {
		$block: {
			$network: polkadot,
			blockNumber: 20_000_000n,
		},
		eventIndex: 0,
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
		$network: hyperliquid,
		height: 1n,
	},
	[EntityType.HyperliquidTransaction]: {
		$network: hyperliquid,
		txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
	},
	[EntityType.HyperliquidAccount]: {
		$network: hyperliquid,
		address: '0x0000000000000000000000000000000000000000',
	},
	[EntityType.HyperliquidValidator]: {
		$network: hyperliquid,
		validator: 'e2e-probe-validator',
	},
	[EntityType.HyperliquidSpotAsset]: {
		$network: hyperliquid,
		assetId: 0,
	},
	[EntityType.HyperliquidPerpMarket]: {
		$network: hyperliquid,
		coin: 'BTC',
	},
	[EntityType.LogosZone]: {
		$network: logos,
		zoneId: 'logos-chain',
	},
	[EntityType.LogosAccount]: {
		$network: logos,
		accountAddress: 'logos1e2eprobeaccount',
	},
	[EntityType.LogosTransaction]: {
		$network: logos,
		transactionHash: 'e2e-probe-logos-transaction',
	},
	[EntityType.QuilibriumNetwork]: quilibrium,
	[EntityType.QuilibriumFrame]: {
		$network: quilibrium,
		frameNumber: 1n,
		shardKey: 'e2e-probe-shard',
	},
	[EntityType.QuilibriumShard]: {
		$network: quilibrium,
		shardKey: 'e2e-probe-shard',
	},
	[EntityType.QuilibriumProver]: {
		$network: quilibrium,
		proverPeerId: 'e2e-probe-prover',
	},
	[EntityType.QuilibriumAccount]: {
		$network: quilibrium,
		accountAddress: 'e2e-probe-account',
	},
	[EntityType.QuilibriumPendingTransaction]: {
		$network: quilibrium,
		transactionHash: 'e2e-probe-quilibrium-transaction',
	},
	[EntityType.NearNetwork]: near,
	[EntityType.NearBlock]: {
		$network: near,
		height: 100_000_000n,
	},
	[EntityType.NearChunk]: {
		$network: near,
		chunkHash: 'e2e-probe-near-chunk',
	},
	[EntityType.NearTransaction]: {
		$network: near,
		hash: 'e2e-probe-near-transaction',
		signerAccountId: 'near',
	},
	[EntityType.NearReceipt]: {
		$network: near,
		receiptId: 'e2e-probe-near-receipt',
	},
	[EntityType.NearAction]: {
		$transaction: {
			$network: near,
			hash: 'e2e-probe-near-transaction',
			signerAccountId: 'near',
		},
		actionIndex: 0,
	},
	[EntityType.NearExecutionOutcome]: {
		$transaction: {
			$network: near,
			hash: 'e2e-probe-near-transaction',
			signerAccountId: 'near',
		},
		outcomeId: 'e2e-probe-near-outcome',
	},
	[EntityType.NearAccount]: {
		$network: near,
		accountId: 'near',
	},
	[EntityType.NearAccessKey]: {
		$account: {
			$network: near,
			accountId: 'near',
		},
		publicKey: 'ed25519:e2e-probe-near-access-key',
	},
	[EntityType.NearContract]: {
		$network: near,
		accountId: 'near',
	},
	[EntityType.NearValidator]: {
		$network: near,
		accountId: 'e2e-probe-near-validator',
	},
	[EntityType.MoneroNetwork]: monero,
	[EntityType.MoneroBlock]: {
		$network: monero,
		height: 3_000_000n,
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
		},
	},
	[EntityType.LitecoinMwebTransaction]: {
		$mwebBlock: {
			$block: {
				$network: litecoin,
				height: 2_500_000n,
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
				},
			},
			transactionIndex: 0,
		},
		outputIndex: 0,
	},
	[EntityType.LightningNetwork]: {
		$network: lightning,
	},
	[EntityType.LightningNetwork_Timestamp]: {
		$lightningNetwork: {
			$network: lightning,
		},
		timestampMs: 1_759_536_000_000,
	},
	[EntityType.LightningNode]: {
		$network: lightning,
		publicKey: '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
	},
	[EntityType.LightningChannel]: {
		$network: lightning,
		channelId: '852861482917888001',
	},
	[EntityType.LightningInvoice]: {
		$network: lightning,
		paymentHash: 'e2e-probe-lightning-invoice',
	},
	[EntityType.LightningPayment]: {
		$network: lightning,
		paymentHash: 'e2e-probe-lightning-payment',
	},
	[EntityType.LightningHtlc]: {
		$channel: {
			$network: lightning,
			channelId: 'e2e-probe-lightning-channel',
		},
		htlcIndex: 0,
	},
	[EntityType.DogecoinBlockAuxPow]: {
		$block: {
			$network: dogecoin,
			height: 5_000_000n,
		},
	},
	[EntityType.DogecoinAuxPowParentBlockHeader]: {
		$auxPow: {
			$block: {
				$network: dogecoin,
				height: 5_000_000n,
			},
		},
	},
	[EntityType.DogecoinAuxPowMerkleBranch]: {
		$auxPow: {
			$block: {
				$network: dogecoin,
				height: 5_000_000n,
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
			outputIndex: 0,
		},
	},
	[EntityType.BitcoinCashCashTokenNft]: {
		$output: {
			$transaction: {
				$network: bitcoinCash,
				txId: 'e2e-probe-bitcoin-cash-transaction',
			},
			outputIndex: 0,
		},
	},
	[EntityType.BitcoinCashCashTokenCommitment]: {
		$output: {
			$transaction: {
				$network: bitcoinCash,
				txId: 'e2e-probe-bitcoin-cash-transaction',
			},
			outputIndex: 0,
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
	},
	[EntityType.ZeroGConsensusNetwork]: {
		$network: zeroG,
		consensusNetworkId: '0g-chain',
	},
	[EntityType.ZeroGDaNode]: {
		$network: zeroG,
		nodeId: 'e2e-probe-da-node',
	},
	[EntityType.ZeroGDaQuorum]: {
		$network: zeroG,
		quorumId: 'e2e-probe-da-quorum',
	},
	[EntityType.ZeroGDataBlob]: {
		$network: zeroG,
		dataRoot: 'e2e-probe-data-root',
	},
	[EntityType.ZeroGDataChunk]: {
		$dataBlob: {
			$network: zeroG,
			dataRoot: 'e2e-probe-data-root',
		},
		chunkIndex: 0,
	},
	[EntityType.ZeroGKvEntry]: {
		$network: zeroG,
		namespace: 'e2e-probe-namespace',
		key: 'e2e-probe-key',
	},
	[EntityType.ZeroGServiceProvider]: {
		$network: zeroG,
		providerId: 'e2e-probe-provider',
	},
	[EntityType.ZeroGServiceRequest]: {
		$serviceProvider: {
			$network: zeroG,
			providerId: 'e2e-probe-provider',
		},
		requestId: 'e2e-probe-request',
	},
	[EntityType.ZeroGSettlementTrace]: {
		$serviceRequest: {
			$serviceProvider: {
				$network: zeroG,
				providerId: 'e2e-probe-provider',
			},
			requestId: 'e2e-probe-request',
		},
		traceId: 'e2e-probe-trace',
	},
	[EntityType.ZeroGStorageLogEntry]: {
		$network: zeroG,
		logEntryId: 'e2e-probe-storage-log-entry',
	},
	[EntityType.ZeroGStorageNode]: {
		$network: zeroG,
		nodeId: 'e2e-probe-storage-node',
	},
	[EntityType.ZeroGStorageProof]: {
		$storageNode: {
			$network: zeroG,
			nodeId: 'e2e-probe-storage-node',
		},
		proofId: 'e2e-probe-storage-proof',
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

	[EntityType.RedditComment]: { fullname: 't1_carprdq' },
	[EntityType.RedditComment_Timestamp]: {
		$comment: { fullname: 't1_carprdq' },
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.RedditLink]: { fullname: 't3_1h7t8a' },
	[EntityType.RedditLink_Timestamp]: {
		$link: { fullname: 't3_1h7t8a' },
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.RedditNetwork]: { scope: 'RedditNetwork' },
	[EntityType.RedditSubreddit]: { name: 'ethereum' },
	[EntityType.RedditSubreddit_Timestamp]: {
		$subreddit: { name: 'ethereum' },
		timestampMs: 1_700_000_000_000,
	},

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
	[EntityType.XPost_Timestamp]: {
		$post: { id: '1855943488122347520' },
		timestampMs: 1_700_000_000_000,
	},
	[EntityType.XUser]: { id: '12' },
	[EntityType.XUser_Timestamp]: {
		$user: { id: '12' },
		timestampMs: 1_700_000_000_000,
	},

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

	[EntityType.ElementsNetwork]: liquid,
	[EntityType.ElementsAsset]: {
		$network: liquid,
		assetId: liquidProbeAssetId,
	},
	[EntityType.ElementsIssuance]: {
		$transaction: {
			$network: liquid,
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
	[EntityType.CashuKeyset]: {
		$mint: cashuProbeMint,
		keysetId: cashuProbeKeysetId,
	},

	[EntityType.FedimintFederation]: fedimintProbeFederation,

	[EntityType.PayjoinDirectory]: payjoinProbeDirectory,
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
	Source.LightningLnd_Rest,
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
	`field:${EntityType.EvmNetwork}.$$erc4337Bundlers:${Source.Blockscout_Rest}`,
	`field:${EntityType.EvmNetwork}.$$erc4337Paymasters:${Source.Blockscout_Rest}`,
	`field:${EntityType.EvmNetwork}.$$erc4337AccountFactories:${Source.Blockscout_Rest}`,
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


const probeEntityIdForType = (
	entityType: EntityType,
): EntityId<typeof schema, EntityType> => {
	const entityId = probeEntityIdByType[entityType]
	if (entityId === undefined) {
		throw new Error(`Missing probeEntityIdByType[${entityType}]`)
	}
	return entityId
}

export const resolveProbeEntityId = async (
	entityType: EntityType,
): Promise<EntityId<typeof schema, EntityType>> => {
	if (entityType === EntityType.Coin_Timestamp) {
		const {
			blockscoutExplorerOriginForChain,
			blockscoutRestV2AtExplorerOrigin,
		} = await import('$/sources/Blockscout/Rest/constants.ts')
		const { getStats } = await import('$/sources/Blockscout/Rest/queries.ts')
		const origin = blockscoutExplorerOriginForChain(mainnetChainId)
		if (
			origin == null
			|| !blockscoutRestV2AtExplorerOrigin(origin)
		) {
			throw new Error('assert-loaded-resolvers: mainnet Blockscout stats unavailable for Coin_Timestamp probe')
		}
		const stats = await getStats({ explorerOrigin: origin })
		if (stats == null) {
			throw new Error('assert-loaded-resolvers: Blockscout stats unavailable for Coin_Timestamp probe')
		}
		const updatedAtMs = (
			stats.gas_price_updated_at != null ?
				Date.parse(stats.gas_price_updated_at)
			:
				NaN
		)
		if (!Number.isFinite(updatedAtMs)) {
			throw new Error('assert-loaded-resolvers: Blockscout stats clock missing for Coin_Timestamp probe')
		}
		return {
			$coin: { coinId: CoinId.ETH },
			timestampMs: updatedAtMs,
		}
	}

	return probeEntityIdForType(entityType)
}


export const parentEntityIdForResolverValuePart = (
	entityType: EntityType,
): EntityId<typeof schema, EntityType> => (
	entityType === EntityType._Global ?
		{ scope: 'global' }
	: entityType === EntityType.Network ?
		bitcoin
	: entityType === EntityType.EvmNetwork ?
		mainnet
	: entityType === EntityType.EvmAccount ?
		actorMainnetVitalik
	: entityType === EntityType.EvmNetworkAccount ?
		evmNetworkAccountMainnetUsdc
	: entityType === EntityType.EvmBlock ?
		({
			$network: mainnet,
			blockNumber: 18_000_000n,
		})
	: entityType === EntityType.AtprotoActor ?
		{ did: atprotoProbeDid }
	: entityType === EntityType.AtprotoPost ?
		probeEntityIdForType(EntityType.AtprotoPost)
	: entityType === EntityType.ActivityPubNetwork ?
		{ scope: 'ActivityPubNetwork' }
	: entityType === EntityType.ActivityPubActor ?
		probeEntityIdForType(EntityType.ActivityPubActor)
	: entityType === EntityType.ActivityPubNote ?
		probeEntityIdForType(EntityType.ActivityPubNote)
	: entityType === EntityType.AtprotoNetwork ?
		{ scope: 'AtprotoNetwork' }
	: entityType === EntityType.LensNetwork ?
		{ scope: 'LensNetwork' }
	: entityType === EntityType.RedditNetwork ?
		{ scope: 'RedditNetwork' }
	: entityType === EntityType.RssNetwork ?
		{ scope: 'RssNetwork' }
	: entityType === EntityType.RssFeed ?
		probeEntityIdForType(EntityType.RssFeed)
	: entityType === EntityType.RedditSubreddit ?
		probeEntityIdForType(EntityType.RedditSubreddit)
	: entityType === EntityType.RedditLink ?
		probeEntityIdForType(EntityType.RedditLink)
	: entityType === EntityType.LensAccount ?
		probeEntityIdForType(EntityType.LensAccount)
	: entityType === EntityType.XUser ?
		probeEntityIdForType(EntityType.XUser)
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
	: entityType === EntityType.FarcasterVerifiedAddress ?
		{
			fid: 3,
			protocol: 'ethereum',
			address: VITALIK_ADDRESS,
		}
	: entityType === EntityType.FarcasterChannel ?
		{ id: 'memes' }
	: entityType === EntityType.LightningNetwork ?
		{ $network: lightning }
	: entityType === EntityType.LightningNode ?
		probeEntityIdForType(EntityType.LightningNode)
	: entityType === EntityType.LightningChannel ?
		probeEntityIdForType(EntityType.LightningChannel)
	: entityType === EntityType.ElementsNetwork ?
		liquid
	:
		probeEntityIdForType(entityType)
)


export const entityFieldValueForAssert = <_Value>(
	value: _Value,
): _Value | {
	[EntityMetaKey.Id]: object
	[EntityMetaKey.IdKey]: string
} => (
	value != null
		&& typeof value === 'object'
		&& EntityMetaKey.Id in value ?
			({
				// oxlint-disable-next-line typescript-eslint/consistent-type-assertions -- `in` narrows presence, but not the object-valued entity id shape this test fixture requires.
				[EntityMetaKey.Id]: value[EntityMetaKey.Id] as object,
				[EntityMetaKey.IdKey]: stringify(value[EntityMetaKey.Id]),
			})
	:
		value
)
