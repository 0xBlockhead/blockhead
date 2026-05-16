import { stringify } from 'devalue'

import { CoinId } from '$/constants/Coin.ts'
import { MarketAssetKind, MarketPriceRangeType, MarketTimeIntervalUnit } from '$/constants/Market.ts'
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

const SAMPLE_TX_HASH = (
	'0xdacd6abf5b2814b28c68c59981f269c615796e7f0cba2009f4bf5edfdd9595ab' as const
)

const CAST_HASH_32 = `0x${'a'.repeat(64)}` as const

const ERROR_SELECTOR = '0x08c379a0' as const

const TRANSFER_SELECTOR = '0xa9059cbb' as const

const TRANSFER_TOPIC = (
	'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' as const
)

export const ethUsdSpotMarket = {
	$base: { kind: MarketAssetKind.Coin, $coin: { coinId: CoinId.ETH } },
	$quote: { kind: MarketAssetKind.Currency, iso4217: 'USD' },
	$marketVenue: { marketVenueId: MarketVenueId.SpotIndex },
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

	[EntityType.AtprotoActor]: { did: 'did:plc:z72i7hdynmk6x22kvon7fdpk' },
	[EntityType.AtprotoNetwork]: { scope: 'AtprotoNetwork' },
	[EntityType.AtprotoPost]: {
		uri: 'at://did:plc:z72i7hdynmk6x22kvon7fdpk/app.bsky.feed.post/3juzh037csq2b',
	},

	[EntityType.BeaconEpoch]: { $network: mainnet, epoch: 300_000 },
	[EntityType.BeaconSlot]: { $network: mainnet, slot: 9_500_000 },

	[EntityType.BlockheadFarcasterAccountConnection]: { fid: 3 },

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

	[EntityType.EnsName]: { name: 'vitalik.eth' },

	[EntityType.EvmBlob]: {
		$network: mainnet,
		txHash: SAMPLE_TX_HASH,
		blobIndex: 0,
	},
	[EntityType.EvmBlock]: {
		$network: mainnet,
		blockNumber: 18_000_000n,
	},
	[EntityType.EvmContract]: {
		$network: mainnet,
		address: USDC_ADDRESS,
	},
	[EntityType.EvmContractSource]: {
		$network: mainnet,
		address: USDC_ADDRESS,
	},
	[EntityType.EvmError]: { hex: ERROR_SELECTOR },
	[EntityType.EvmSelector]: { hex: TRANSFER_SELECTOR },
	[EntityType.EvmTopic]: {
		hex: TRANSFER_TOPIC,
	},
	[EntityType.EvmTransaction]: {
		$network: mainnet,
		txHash: SAMPLE_TX_HASH,
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

	[EntityType.Market]: ethUsdSpotMarket,
	[EntityType.MarketPrice]: {
		$market: ethUsdSpotMarket,
	},
	[EntityType.MarketPriceRange]: {
		$market: ethUsdSpotMarket,
		timeInterval: { unit: MarketTimeIntervalUnit.Day, value: 7 },
		rangeType: MarketPriceRangeType.OHLCCandles,
	},
	[EntityType.MarketVenue]: { marketVenueId: MarketVenueId.SpotIndex },
	[EntityType.Market_Timestamp]: {
		$market: ethUsdSpotMarket,
		timestampNs: 0n,
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
	[EntityType.Network_GasFee_Timestamp]: {
		$network: mainnet,
		timestampNs: 0n,
	},
	[EntityType.Network_Txpool_Timestamp]: {
		$network: mainnet,
		timestampNs: 0n,
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
