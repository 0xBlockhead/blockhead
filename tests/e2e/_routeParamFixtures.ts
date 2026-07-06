import { stringify } from 'devalue'

import {
	youtubeNetworkSeedChannels,
	youtubeNetworkSeedPlaylists,
	youtubeNetworkSeedVideos,
} from '../../src/constants/Social/YouTube.ts'
import {
	activityPubNetworkSeedActors,
} from '../../src/constants/Social/ActivityPub.ts'
import {
	atprotoNetworkSeedActors,
	atprotoNetworkSeedPosts,
} from '../../src/constants/Social/Atproto.ts'
import {
	nostrNetworkSeedNotes,
	nostrNetworkSeedProfiles,
	nostrNetworkSeedRelays,
} from '../../src/constants/Social/Nostr.ts'
import {
	rssNetworkSeedFeeds,
} from '../../src/constants/Social/Rss.ts'
import { CoinId } from '../../src/constants/Coin.ts'
import { currencyCatalogSnapshotTimestampMs } from '../../src/constants/Currency.ts'
import {
	MarketAssetKind,
	MarketKind,
} from '../../src/constants/Market.ts'
import { MarketVenueId } from '../../src/constants/MarketVenue.ts'
import { specificationRealms } from '../../src/constants/SpecificationProposal.ts'
import {
	NetworkEnvironment,
	networks,
} from '../../src/constants/Network.ts'
import { swarmDocsLandingReference } from '../../src/sources/Swarm/Rest/constants.ts'


const VITALIK_ADDRESS = '0xd8da6bf26964af9d7eed9e403e826090792bed6a' as const
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const
const SAMPLE_TX_HASH = '0xdacd6abf5b2814b28c68c59981f269c615796e7f0cba2009f4bf5edfdd9595ab' as const
const SAMPLE_BLOB_TX_HASH = '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca' as const
const SAMPLE_ETHEREUM_BLOCK_18000000_TX_HASH = '0x6b2fe3575bc0e2b9220daf457d7bde7a118d8674b920a0c888bbf547d683d0b7' as const
const SAMPLE_USER_OPERATION_HASH = '0xca87534346367dbf4ff6675627a3e43635db5a36bd8ef99ffcd20a63d1555ef5' as const
const ERC4337_SMART_ACCOUNT_ADDRESS = '0x0000000000001d8a2e7bf6bc369525a2654aa298' as const
const ERC4337_BUNDLER_ADDRESS = '0xf0ac778fb2e56bab4edd7f25c2ed2f333d165b8d' as const
const ERC4337_PAYMASTER_ADDRESS = '0x6599bba2a055f3c769cba1a2d462a75429bd7bf7' as const
const ERC4337_ACCOUNT_FACTORY_ADDRESS = '0xcad776fce9c3b3db6724aeb4c7fa2f5f3c088253' as const
const SOLANA_PROBE_SIGNATURE = 'E2eSolanaSignature11111111111111111111111111111111111111111111111' as const
const SOLANA_PROBE_PROGRAM_ID = '11111111111111111111111111111111' as const
const SOLANA_PROBE_TOKEN_MINT_ADDRESS = 'So11111111111111111111111111111111111111112' as const
const SOLANA_PROBE_OWNER_PUBKEY = 'ba4df886d2a7c4224bc98efb6cbf3817b0e2b7227c287b692a7c7d0a9e3e86ff' as const
const SOLANA_PROBE_VOTE_PUBKEY = 'E2eVotePubkey111111111111111111111111111111111111111' as const
const CAST_HASH_32 = '0xe4f2e1c70d72388a98dba2a2511a9b480840e544' as const
const NOSTR_PROBE_PUBKEY = nostrNetworkSeedProfiles[0].pubkey
const NOSTR_PROBE_RELAY_URL = nostrNetworkSeedRelays[0].relayUrl
const NOSTR_PROBE_REPOST_EVENT_ID = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as const
const NOSTR_PROBE_REACTION_EVENT_ID = 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc' as const
const NOSTR_PROBE_ARTICLE_PUBKEY = nostrNetworkSeedProfiles[0].pubkey
const NOSTR_PROBE_ARTICLE_IDENTIFIER = 'blockhead-e2e-article' as const
const YOUTUBE_PROBE_PLAYLIST_ID = youtubeNetworkSeedPlaylists[0].playlistId
const YOUTUBE_PROBE_VIDEO_ID = youtubeNetworkSeedVideos[0].videoId
const YOUTUBE_PROBE_COMMENT_ID = 'UgzuC3zzpRZkjc5Qzsd4AaABAg' as const
const YOUTUBE_PROBE_CHANNEL_ID = youtubeNetworkSeedChannels[0].channelId
const COSMOS_PROBE_ACCOUNT_ADDRESS = 'cosmos1qphf0ferqcch0jca9hlqfm3x0eds3dpkac4g9j' as const
const COSMOS_PROBE_CONTRACT_ADDRESS = 'cosmos1cp28gxjul0eht3axzdd5npxq7zqzy07r9y36rnsdf3r4s2g6d8hszw5k3s' as const
const COSMOS_PROBE_OPERATOR_ADDRESS = 'cosmosvaloper1qphf0ferqcch0jca9hlqfm3x0eds3dpkcvpafp' as const
const COSMOS_PROBE_TX_HASH = 'B70E21EE2A02B663915426C0664D27818105296D8E9A672B7932B4F6F9DADD5F' as const
const MEV_PROBE_BUILDER_PUBKEY = `0x${'11'.repeat(48)}` as const

const NOSTR_PROBE_NOTE_EVENT_ID = nostrNetworkSeedNotes[0].eventId

const RSS_PROBE_FEED_URL = rssNetworkSeedFeeds[0].feedUrl
const RSS_PROBE_ITEM_GUID = 'https://news.ycombinator.com/item?id=48594706' as const
const ETHEREUM_MARKET_TIMESTAMP_MS = '1767225600000' as const
const LIGHTNING_LND_PROBE_PUBLIC_KEY = '02aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as const

const ACTIVITY_PUB_PROBE_ACTOR_URI = `${activityPubNetworkSeedActors[0].instanceOrigin}/users/Gargron` as const
const ACTIVITY_PUB_PROBE_NOTE_URI = 'https://mastodon.social/users/Gargron/statuses/116539053870420123' as const

const LENS_PROBE_POST_ID = '161m1s2r2av9deyh2a3' as const

const ZERO_G_PROBE_STORAGE_NODE_ID = '0x103E5184A40f98b4dA4AF91b22C588E44b271618' as const
const ZERO_G_PROBE_TX_HASH = '0xa52e05ff31336c64036189253acf2fc174f4460eae786138de053fbd23ff03e6' as const

const REAL_URL_FIXTURES = [
	'https://ethereum.org',
	'https://chainid.network/chains.json',
	'https://explorer.bitcoinunlimited.info/',
] as const

const ethUsdCatalogMarket = {
	$base: {
		kind: MarketAssetKind.Coin,
		$coin: { coinId: CoinId.ETH },
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: 'USD' },
	},
	$marketVenue: {
		marketVenueId: MarketVenueId.Binance,
	},
	marketKind: MarketKind.Spot,
} as const

const bridgeRouteEthMainnetToOptimism = {
	fromChainId: 1,
	toChainId: 10,
	fromToken: '0x0000000000000000000000000000000000000000',
	toToken: '0x0000000000000000000000000000000000000000',
	fromAmount: 1_000_000_000_000_000n,
	fromAddress: VITALIK_ADDRESS,
	slippage: 0.005,
	toAddress: VITALIK_ADDRESS,
} as const

const e2eNostrYouTubeOptionalDetailRoutePaths = {
	youtubePlaylist: `/youtube/playlist/${encodeURIComponent(YOUTUBE_PROBE_PLAYLIST_ID)}`,
} as const

const routeFixtureVariantMode = process.env.E2E_ROUTE_VARIANTS

const UTXO_PROBE_ADDRESS_BY_NETWORK_SLUG: Partial<Record<string, string>> = {
	bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
	'bitcoin-cash': 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
}

const UTXO_PROBE_BLOCK_HEIGHT_BY_NETWORK_SLUG: Partial<Record<string, string>> = {
	bitcoin: '0',
	'bitcoin-cash': '900000',
	zcash: '2000000',
}

const PROBE_BLOCK_HEIGHT_BY_NETWORK_SLUG: Partial<Record<string, string>> = {
	cosmos: '25300000',
}

const UTXO_PROBE_TX_ID_BY_NETWORK_SLUG: Partial<Record<string, string>> = {
	bitcoin: '4d3e4007c50313d031ffb3f180d0bd6b37192e1c852ec9f9a16ad1db957707c6',
	'bitcoin-cash': '9c3f790921eab71fe9b210a9884c81708dc55d9444bba8c54394b827e2cf7f5a',
	zcash: '7fb6c4d3e2a1908070605040302010ffeeddccbbaa99887766554433221100ff',
}

const PRIMARY_NETWORK_CAIP2_FIXTURES = networks
	.filter((network) => network.environment === NetworkEnvironment.Mainnet)
	.flatMap((network) => (
		!('caip2' in network) ?
			[]
		:
			[`${network.caip2.namespace}:${network.caip2.reference}`]
	))

const PRIMARY_NETWORK_SLUG_FIXTURES = networks
	.filter((network) => network.environment === NetworkEnvironment.Mainnet)
	.map((network) => network.slug)

const PROPOSAL_KIND_SLUG_BY_REALM_SLUG: Record<string, string> = {
	bitcoin: 'bip',
	'bitcoin-cash': 'chip',
	'chain-agnostic': 'caip',
	cosmos: 'adr',
	dogecoin: 'dip',
	ens: 'ensip',
	ethereum: 'eip',
	filecoin: 'fip',
	hyperliquid: 'hip',
	litecoin: 'lip',
	near: 'nep',
	polkadot: 'rfc',
	quilibrium: 'protocol-document',
	solana: 'simd',
	zcash: 'zip',
}

const PROPOSAL_REF_BY_KIND_SLUG: Record<string, string> = {
	adr: 'adr-001',
	bip: 'bip-32',
	caip: 'caip-2',
	chip: 'chip-1',
	dip: 'dip-0001',
	eip: 'eip-1559',
	ensip: 'ensip-1',
	fip: 'fip-0001',
	hip: 'hip-1',
	lip: 'lip-0002',
	nep: 'nep-0001',
	'protocol-document': 'protocol-document-1',
	rfc: 'rfc-1',
	simd: 'simd-0001',
	zip: 'zip-32',
}


/** Default param values for `discoverPathnamesFromRoutes()` — aligned with smoke + resolver probes. */
export const e2eRouteParamFixtures: Record<string, string> = {
	networkId: '1',
	networkStackId: 'Ethereum',
	caip2Namespace: 'eip155',
	caip2Reference: '1',
	caip2: 'eip155:1',
	chainId: '1',
	contractId: `1:${USDC_ADDRESS}`,
	coinId: 'ETH',
	iso4217: 'USD',
	ensName: 'vitalik.eth',
	upgradeSlug: 'Homestead',
	projectId: 'arbitrum',
	blockNumber: '18000000',
	height: '18000000',
	transactionId: SAMPLE_TX_HASH,
	txId: SAMPLE_TX_HASH,
	address: VITALIK_ADDRESS,
	caipId: '25',
	sessionId: 'e2e-probe-session',
	sourceId: 'e2e-probe-source',
	dashboardId: 'e2e-probe-panel-tree',
	routeId: stringify(bridgeRouteEthMainnetToOptimism),
	stepIndex: '0',
	indexInCast: '0',
	index: '0',
	fromChainId: '1',
	toChainId: '10',
	fromCoinInstanceSlug: 'native',
	toCoinInstanceSlug: 'native',
	toolKey: 'across',
	fromToken: '0x0000000000000000000000000000000000000000',
	toToken: '0x0000000000000000000000000000000000000000',
	fromAmount: '1000000000000000',
	fromAddress: VITALIK_ADDRESS,
	slippage: '0.005',
	toAddress: VITALIK_ADDRESS,
	userId: '3',
	accountId: '3',
	palletName: 'System',
	fid: '3',
	fname: 'dwr',
	protocol: 'ethereum',
	hex: '0xa9059cbb',
	recordId: 'com.twitter',
	specificationRealmSlug: 'ethereum',
	proposalKindSlug: 'eip',
	proposalRef: 'eip-1559',
	positionId: '354198',
	poolId: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
	vaultId: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
	owner: VITALIK_ADDRESS,
	coin: USDC_ADDRESS,
	spender: USDC_ADDRESS,
	sourceTxHash: SAMPLE_TX_HASH,
	createdAt: '1700000000',
	namespace: 'ipfs',
	target: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
	test: 'test',
	tokenAccountPubkey: 'E2eTokenAccount1111111111111111111111111111',
	signature: SOLANA_PROBE_SIGNATURE,
	programId: SOLANA_PROBE_PROGRAM_ID,
	mintAddress: SOLANA_PROBE_TOKEN_MINT_ADDRESS,
	votePubkey: SOLANA_PROBE_VOTE_PUBKEY,
	marketKey: stringify(ethUsdCatalogMarket),
	instanceOrigin: 'https://mastodon.social',
	did: atprotoNetworkSeedActors[0].did,
	uri: atprotoNetworkSeedPosts[0].uri,
	epoch: '300000',
	epochNumber: '300000',
	slotNumber: '9500000',
	timestampMs: '0',
	eventIndex: '0',
	extrinsicIndex: '0',
	instructionKind: 'Instruction',
	indexInTransaction: '0',
	indexInInstruction: '0',
	inputIndex: '0',
	outputIndex: '0',
	actionIndex: '0',
	messageIndex: '0',
	period: '0',
	validatorIndex: '0',
	sampleKey: 'Etherscan_Rest:gastracker:gasoracle',
	observerKey: 'Voltaire_JsonRpc:txpool_status:ethereum.publicnode.com',
	observer: 'ethereum.publicnode.com',
	observationScope: 'nodeLocal',
	builderPubkey: MEV_PROBE_BUILDER_PUBKEY,
	relayHost: 'relay.ultrasound.money',
	slot: '9500000',
	blockHash: '0x0000000000000000000000000000000000000000000000000000000000000001',
	direction: 'proposerPayloadDelivered',
	name: 'ethereum',
	fullname: 't3_1u8x2f8',
	contractAddress: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
	tokenId: '104776',
	reference: swarmDocsLandingReference,
	pubkey: NOSTR_PROBE_ARTICLE_PUBKEY,
	kind: '30023',
	eventId: NOSTR_PROBE_NOTE_EVENT_ID,
	relayKey: NOSTR_PROBE_RELAY_URL,
	identifier: NOSTR_PROBE_ARTICLE_IDENTIFIER,
	videoId: YOUTUBE_PROBE_VIDEO_ID,
	playlistId: YOUTUBE_PROBE_PLAYLIST_ID,
	commentId: YOUTUBE_PROBE_COMMENT_ID,
	feedKey: RSS_PROBE_FEED_URL,
	guid: RSS_PROBE_ITEM_GUID,
	blobIndex: '0',
	logIndex: '0',
	indexInLog: '0',
	userOperationHash: SAMPLE_USER_OPERATION_HASH,
	coinInstanceSlug: 'native',
	marketVenueId: MarketVenueId.Binance,
	marketVenue: MarketVenueId.Binance,
	baseKind: 'coin',
	base: CoinId.ETH,
	quoteKind: 'currency',
	quote: 'USD',
	marketKind: MarketKind.Spot,
	localAccountId: '13179',
	localStatusId: '116539053870420123',
	acct: 'Gargron@mastodon.social',
	activityStreamsUri: ACTIVITY_PUB_PROBE_ACTOR_URI,
	hash: CAST_HASH_32,
	postId: LENS_PROBE_POST_ID,
	conversationId: 'e2e-probe-agent-conversation',
	turnId: 'e2e-probe-agent-conversation-turn',
	channelId: 'e2e-probe-state-channel',
	contactId: 'e2e-probe-room-peer',
	roomId: 'e2e-probe-room',
	url: 'https%3A%2F%2Fexample.com',
	walletId: 'eip6963:e2e-probe-wallet',
}


export const e2eRouteRestSegmentFixtures: Record<string, string> = {
	contentPath: 'readme',
	uri: encodeURIComponent(atprotoNetworkSeedPosts[0].uri),
}


/**
 * Routes that depend on live upstream rows the probes treat as optional / synthetic.
 * Still visited and reported; excluded from hard boundary failure by default.
 */
export const e2eBoundaryLiveOptionalPathnames = new Set<string>([
	...Object.values(e2eNostrYouTubeOptionalDetailRoutePaths),
	`/youtube/comment/${encodeURIComponent(YOUTUBE_PROBE_VIDEO_ID)}/${encodeURIComponent(YOUTUBE_PROBE_COMMENT_ID)}`,
	'/network/eip155:1',
	'/network/ethereum',
])


export const e2eRouteParamFixtureForContext = (
	paramKey: string,
	staticSegments: readonly string[]
) => {
	const path = staticSegments.join('/')

	if (paramKey === 'channelId') {
		if (path.includes('youtube'))
			return YOUTUBE_PROBE_CHANNEL_ID
		if (path.includes('farcaster'))
			return 'ethereum'
		if (path.includes('network/channels'))
			return '852861482917888001'
		return 'e2e-probe-state-channel'
	}

	if (paramKey === 'conversationId') {
		if (path.includes('xmtp'))
			return 'e2e-probe-conversation'
		return 'e2e-probe-agent-conversation'
	}

	if (paramKey === 'chainId' && path.includes('services/agent'))
		return '1'

	if (paramKey === 'contractAddress' && path.includes('services/agent'))
		return '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432'

	if (paramKey === 'tokenId' && path.includes('services/agent'))
		return '104776'

	if (paramKey === 'feedKey' && path.includes('rss'))
		return RSS_PROBE_FEED_URL

	if (paramKey === 'feedKey' && path.includes('market'))
		return 'ethereum'

	if (paramKey === 'timestampMs' && path.includes('market'))
		return ETHEREUM_MARKET_TIMESTAMP_MS

	if (paramKey === 'caip2Namespace' && path === 'network')
		return 'bip122'

	if (paramKey === 'caip2Reference' && path === 'network')
		return '000000000019d6689c085ae165831e93'

	if (paramKey === 'networkSlug' && path === 'network')
		return 'bitcoin'

	if (paramKey === 'networkSlug' && path.includes('polkadot'))
		return 'polkadot'

	if (paramKey === 'accountId' && path.includes('network/solana'))
		return SOLANA_PROBE_OWNER_PUBKEY

	if (paramKey === 'pubkey' && path.includes('network/solana'))
		return SOLANA_PROBE_OWNER_PUBKEY

	if (paramKey === 'upgradeSlug' && path.includes('/consensus'))
		return 'altair'

	if (paramKey === 'kind' && path.includes('network/asset'))
		return 'Native'

	if (paramKey === 'kind' && path.includes('/slashing'))
		return 'proposer'

	if (paramKey === 'assetKey' && path.includes('network/asset'))
		return 'native'

	if (paramKey === 'transactionId' && path.includes('blob'))
		return SAMPLE_BLOB_TX_HASH

	if (paramKey === 'transactionId' && path.includes('network/tx'))
		return SAMPLE_ETHEREUM_BLOCK_18000000_TX_HASH

	if (paramKey === 'transactionId' && path.includes('network/block'))
		return SAMPLE_ETHEREUM_BLOCK_18000000_TX_HASH

	if (paramKey === 'txHash' && path.includes('cosmos/tx'))
		return COSMOS_PROBE_TX_HASH

	if (paramKey === 'address') {
		if (path.includes('cosmos/account'))
			return COSMOS_PROBE_ACCOUNT_ADDRESS
		if (path.includes('cosmos/contract'))
			return COSMOS_PROBE_CONTRACT_ADDRESS
		if (
			path.includes('network/address')
			|| path.includes('network/utxo/address')
		)
			return UTXO_PROBE_ADDRESS_BY_NETWORK_SLUG.bitcoin ?? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
		if (path.split('/').includes('contract'))
			return USDC_ADDRESS
		if (path.includes('smart-account'))
			return ERC4337_SMART_ACCOUNT_ADDRESS
		if (path.includes('bundler'))
			return ERC4337_BUNDLER_ADDRESS
		if (path.includes('paymaster'))
			return ERC4337_PAYMASTER_ADDRESS
		if (path.includes('account-factory'))
			return ERC4337_ACCOUNT_FACTORY_ADDRESS
		return VITALIK_ADDRESS
	}

	if (paramKey === 'postId') {
		if (path.includes('x'))
			return '1855943488122347520'
		return LENS_PROBE_POST_ID
	}

	if (paramKey === 'eventId') {
		if (path.includes('repost'))
			return NOSTR_PROBE_REPOST_EVENT_ID
		if (path.includes('reaction'))
			return NOSTR_PROBE_REACTION_EVENT_ID
		return NOSTR_PROBE_NOTE_EVENT_ID
	}

	if (paramKey === 'fullname') {
		if (path.includes('reddit/comment'))
			return 't1_osbo75d'
		return 't3_1u8x2f8'
	}

	if (paramKey === 'userId' && path.includes('x'))
		return '12'

	if (paramKey === 'handle' && path.includes('atproto'))
		return 'bsky.app'

	if (paramKey === 'timestampMs' && path.includes('currency/observations'))
		return String(currencyCatalogSnapshotTimestampMs)

	if ((paramKey === 'height' || paramKey === 'blockNumber') && path.includes('cosmos/block'))
		return PROBE_BLOCK_HEIGHT_BY_NETWORK_SLUG.cosmos ?? '25300000'

	if (paramKey === 'height' && path.includes('network/blocks'))
		return UTXO_PROBE_BLOCK_HEIGHT_BY_NETWORK_SLUG.bitcoin ?? '0'

	if (paramKey === 'activityStreamsUri' && path.includes('activity-pub-note'))
		return ACTIVITY_PUB_PROBE_NOTE_URI

	if (paramKey === 'activityStreamsUri' && path.includes('activity-pub-actor'))
		return ACTIVITY_PUB_PROBE_ACTOR_URI

	if (paramKey === 'contentPath' && path === 'ipfs/path')
		return 'readme'

	if (paramKey === 'operatorAddress' && path.includes('cosmos'))
		return COSMOS_PROBE_OPERATOR_ADDRESS

	if (paramKey === 'denom' && path.includes('cosmos/denom'))
		return 'uatom'

	if (paramKey === 'moduleName' && path.includes('cosmos/module'))
		return 'gov'

	if (paramKey === 'proposalId' && path.includes('cosmos/governance'))
		return '1'

	if (
		paramKey === 'txId'
		&& (
			path.includes('network/transactions')
			|| path.includes('network/utxo/tx')
		)
	) {
		const networkSlug = staticSegments[staticSegments.indexOf('network') + 1]
		return UTXO_PROBE_TX_ID_BY_NETWORK_SLUG[networkSlug] ?? e2eRouteParamFixtures[paramKey]
	}

	if (paramKey === 'pool' && path.includes('shielded-action'))
		return 'sapling'

	if (paramKey === 'actionKind' && path.includes('shielded-action'))
		return 'spend'

	if (paramKey === 'url' && path.includes('bridges'))
		return 'https://bridge.arbitrum.io'

	if ((paramKey === 'publicKey' || paramKey === 'pubkey') && path.includes('network/nodes'))
		return LIGHTNING_LND_PROBE_PUBLIC_KEY

	return e2eRouteParamFixtures[paramKey] ?? `e2e-probe-${paramKey}`
}

export const e2eRouteParamFixtureVariantsForContext = (
	paramKey: string,
	staticSegments: readonly string[],
	selectedParams: Readonly<Record<string, string>>
) => {
	const path = staticSegments.join('/')

	if (routeFixtureVariantMode !== 'all')
		return [
			e2eRouteParamFixtureForContext(paramKey, staticSegments),
		]

	if (paramKey === 'caip2Namespace' && path === 'network')
		return [
			...new Set(PRIMARY_NETWORK_CAIP2_FIXTURES.map((caip2) => caip2.slice(0, caip2.indexOf(':')))),
		]

	if (paramKey === 'caip2Reference' && path === 'network')
		return PRIMARY_NETWORK_CAIP2_FIXTURES
			.filter((caip2) => caip2.startsWith(`${selectedParams.caip2Namespace}:`))
			.map((caip2) => caip2.slice(caip2.indexOf(':') + 1))

	if (paramKey === 'networkSlug' && path === 'network')
		return PRIMARY_NETWORK_SLUG_FIXTURES

	if (paramKey === 'specificationRealmSlug')
		return specificationRealms.map((realm) => realm.slug)

	if (paramKey === 'proposalKindSlug' && selectedParams.specificationRealmSlug)
		return [
			PROPOSAL_KIND_SLUG_BY_REALM_SLUG[selectedParams.specificationRealmSlug]
			?? e2eRouteParamFixtureForContext(paramKey, staticSegments),
		]

	if (paramKey === 'proposalRef' && selectedParams.proposalKindSlug)
		return [
			PROPOSAL_REF_BY_KIND_SLUG[selectedParams.proposalKindSlug]
			?? e2eRouteParamFixtureForContext(paramKey, staticSegments),
		]

	if (paramKey === 'pubkey' && path.includes('network/nodes') && selectedParams.networkSlug === '0g')
		return [ZERO_G_PROBE_STORAGE_NODE_ID]

	if (paramKey === 'txId' && path.includes('network/transactions') && selectedParams.networkSlug === '0g')
		return [ZERO_G_PROBE_TX_HASH]

	if (
		paramKey === 'txId'
		&& (
			path.includes('network/transactions')
			|| path.includes('network/utxo/tx')
		)
		&& selectedParams.networkSlug
	)
		return [
			UTXO_PROBE_TX_ID_BY_NETWORK_SLUG[selectedParams.networkSlug]
			?? e2eRouteParamFixtureForContext(paramKey, staticSegments),
		]

	if (paramKey === 'height' && path.includes('network/blocks') && selectedParams.networkSlug)
		return [
			PROBE_BLOCK_HEIGHT_BY_NETWORK_SLUG[selectedParams.networkSlug]
			?? UTXO_PROBE_BLOCK_HEIGHT_BY_NETWORK_SLUG[selectedParams.networkSlug]
			?? e2eRouteParamFixtureForContext(paramKey, staticSegments),
		]

	if (paramKey === 'address' && path.includes('network/address') && selectedParams.networkSlug)
		return [
			UTXO_PROBE_ADDRESS_BY_NETWORK_SLUG[selectedParams.networkSlug]
			?? e2eRouteParamFixtureForContext(paramKey, staticSegments),
		]

	if (paramKey === 'url' && path === 'url')
		return [...REAL_URL_FIXTURES]

	return [
		e2eRouteParamFixtureForContext(paramKey, staticSegments),
	]
}
