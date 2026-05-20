import { stringify } from 'devalue'

import { CoinId } from '$/constants/Coin.ts'
import { Iso4217, usdCurrencyMarketAssetLeg } from '$/constants/Currency.ts'
import { MarketAssetKind, MarketKind, MarketTimeIntervalUnit } from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { ProposalCategory, ProposalRealm } from '$/constants/Proposal.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'


/**
 * Probe hex: canonical lowercase `0x` + digits (`$ZeroExHex` / `EvmAddress`). No strip/re-prefix.
 */
const VITALIK_ADDRESS = '0xd8da6bf26964af9d7eed9e403e826090792bed6a' as const

const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const

export const SAMPLE_TX_HASH = (
	'0xdacd6abf5b2814b28c68c59981f269c615796e7f0cba2009f4bf5edfdd9595ab' as const
)

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

/** Mainnet type‑3 tx with EIP‑4844 sidecars — exercised by Blobscan REST probes. */
const SAMPLE_BLOB_TX_HASH = (
	'0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca' as const
)

const CAST_HASH_32 = `0x${'a'.repeat(64)}` as const

const ERROR_SELECTOR = '0x08c379a0' as const

const TRANSFER_SELECTOR = '0xa9059cbb' as const

const TRANSFER_TOPIC = (
	'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' as const
)

export const ethUsdCatalogMarket = {
	$base: { kind: MarketAssetKind.Coin, $coin: { coinId: CoinId.ETH } },
	$quote: usdCurrencyMarketAssetLeg,
	$marketVenue: { marketVenueId: MarketVenueId.Binance },
	marketKind: MarketKind.Spot,
} as const

const mainnet = { chainId: 1 }

const actorMainnetVitalik = {
	address: VITALIK_ADDRESS,
}

const actorNetworkMainnetVitalik = {
	$network: mainnet,
	$actor: actorMainnetVitalik,
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
		localAccountId: '111801704737679096',
	},
	[EntityType.ActivityPubNetwork]: { scope: 'ActivityPubNetwork' },
	[EntityType.ActivityPubNote]: {
		instanceOrigin: 'https://mastodon.social',
		localStatusId: '111801704737679096',
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

	[EntityType.ActorNetwork]: actorNetworkMainnetVitalik,

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
	[EntityType.BlockheadAgentConversation]: { id: 'e2e-probe-agent-conversation' },

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
		address: USDC_ADDRESS,
	},
	[EntityType.Erc4337Bundler]: {
		$network: mainnet,
		address: USDC_ADDRESS,
	},
	[EntityType.Erc4337Paymaster]: {
		$network: mainnet,
		address: USDC_ADDRESS,
	},
	[EntityType.Erc4337AccountFactory]: {
		$network: mainnet,
		address: USDC_ADDRESS,
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
		txHash: SAMPLE_TX_HASH,
	},
	[EntityType.EvmUserOperation]: {
		$network: mainnet,
		hash: SAMPLE_TX_HASH,
	},

	[EntityType.FarcasterCast]: { fid: 3, hash: CAST_HASH_32 },
	[EntityType.FarcasterChannel]: { id: 'memes' },
	[EntityType.FarcasterFeed]: { variant: 'trending' },
	[EntityType.FarcasterNetwork]: { scope: 'FarcasterNetwork' },
	[EntityType.FarcasterUser]: { fid: 3 },

	[EntityType.IpfsResource]: {
		namespace: 'ipfs',
		target: 'bafybeigdyrzt3sfp7vd2lvdwqcedebyb6utyghj6v7k5vcheck7l1vprfw',
		contentPath: '/',
	},

	[EntityType.LensAccount]: {
		address: VITALIK_ADDRESS,
	},
	[EntityType.LensNetwork]: { scope: 'LensNetwork' },
	[EntityType.LensPost]: { id: '0x01' },

	[EntityType.LiquidityPool]: {
		$network: mainnet,
		id: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
	},

	[EntityType.Url]: {
		url: 'https://example.com/',
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
		upgradeId: 'Deneb',
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

	[EntityType.RedditComment]: { fullname: 't1_e2e' },
	[EntityType.RedditLink]: { fullname: 't3_1h7t8a' },
	[EntityType.RedditNetwork]: { scope: 'RedditNetwork' },
	[EntityType.RedditSubreddit]: { name: 'ethereum' },

	[EntityType.SwarmResource]: {
		reference: 'bzz://0000000000000000000000000000000000000000000000000000000000000001',
		contentPath: '/',
	},

	[EntityType.XNetwork]: { scope: 'XNetwork' },
	[EntityType.XmtpConversation]: { id: 'e2e-probe-conversation' },
	[EntityType.XmtpNetwork]: { scope: 'XmtpNetwork' },
	[EntityType.XPost]: { id: '1855943488122347520' },
	[EntityType.XUser]: { id: '12' },
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
		actorNetworkMainnetVitalik
	: entityType === EntityType.EvmBlock ?
		({
			$network: mainnet,
			blockNumber: 18_000_000n,
		})
	: entityType === EntityType.AtprotoActor ?
		{ did: 'did:plc:z72i7hdynmk6x22kvon7fdpk' }
	: entityType === EntityType.ActivityPubNetwork ?
		{ scope: 'ActivityPubNetwork' }
	: entityType === EntityType.AtprotoNetwork ?
		{ scope: 'AtprotoNetwork' }
	: entityType === EntityType.LensNetwork ?
		{ scope: 'LensNetwork' }
	: entityType === EntityType.RedditNetwork ?
		{ scope: 'RedditNetwork' }
	: entityType === EntityType.XNetwork ?
		{ scope: 'XNetwork' }
	: entityType === EntityType.XmtpNetwork ?
		{ scope: 'XmtpNetwork' }
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
