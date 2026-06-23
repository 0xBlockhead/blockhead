import { stringify } from 'devalue'

import {
	atprotoNetworkSeedActors,
	atprotoNetworkSeedPosts,
} from '$/constants/Social/Atproto.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { specificationRealms } from '$/constants/SpecificationProposal.ts'
import {
	NetworkEnvironment,
	networks,
} from '$/constants/Network.ts'
import { swarmDocsLandingReference } from '$/sources/Swarm/Rest/constants.ts'
import {
	CAST_HASH_32,
	ERC4337_ACCOUNT_FACTORY_ADDRESS,
	ERC4337_BUNDLER_ADDRESS,
	ERC4337_PAYMASTER_ADDRESS,
	ERC4337_SMART_ACCOUNT_ADDRESS,
	NOSTR_PROBE_ARTICLE_IDENTIFIER,
	NOSTR_PROBE_ARTICLE_PUBKEY,
	NOSTR_PROBE_PUBKEY,
	NOSTR_PROBE_REACTION_EVENT_ID,
	NOSTR_PROBE_RELAY_URL,
	NOSTR_PROBE_REPOST_EVENT_ID,
	SAMPLE_BLOB_TX_HASH,
	SAMPLE_TX_HASH,
	SAMPLE_USER_OPERATION_HASH,
	USDC_ADDRESS,
	VITALIK_ADDRESS,
	YOUTUBE_PROBE_COMMENT_ID,
	YOUTUBE_PROBE_PLAYLIST_ID,
	YOUTUBE_PROBE_VIDEO_ID,
	e2eNostrYouTubeOptionalDetailRoutePaths,
	ethUsdCatalogMarket,
	probeEntitySelectorByType,
} from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'


const NOSTR_PROBE_NOTE_EVENT_ID = '69be3416ed20ce50dea9cdd5471dbef55d320df41d97e1e999108321c2c3e3df' as const

const YOUTUBE_PROBE_CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw' as const

const RSS_PROBE_FEED_URL = 'https://hnrss.org/item?id=48592832' as const
const RSS_PROBE_ITEM_GUID = 'https://news.ycombinator.com/item?id=48594706' as const

const ACTIVITY_PUB_PROBE_ACTOR_URI = 'https://mastodon.social/users/Gargron' as const
const ACTIVITY_PUB_PROBE_NOTE_URI = 'https://mastodon.social/users/Gargron/statuses/116539053870420123' as const

const LENS_PROBE_POST_ID = '161m1s2r2av9deyh2a3' as const

const ZERO_G_PROBE_STORAGE_NODE_ID = '0x103E5184A40f98b4dA4AF91b22C588E44b271618' as const
const ZERO_G_PROBE_TX_HASH = '0xa52e05ff31336c64036189253acf2fc174f4460eae786138de053fbd23ff03e6' as const

const REAL_URL_FIXTURES = [
	'https://ethereum.org',
	'https://chainid.network/chains.json',
	'https://explorer.bitcoinunlimited.info/',
] as const

const UTXO_PROBE_ADDRESS_BY_NETWORK_SLUG: Partial<Record<string, string>> = {
	bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
	'bitcoin-cash': 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
}

const UTXO_PROBE_BLOCK_HEIGHT_BY_NETWORK_SLUG: Partial<Record<string, string>> = {
	bitcoin: '900000',
	'bitcoin-cash': '900000',
	zcash: '2000000',
}

const PROBE_BLOCK_HEIGHT_BY_NETWORK_SLUG: Partial<Record<string, string>> = {
	cosmos: '25300000',
}

const UTXO_PROBE_TX_ID_BY_NETWORK_SLUG: Partial<Record<string, string>> = {
	bitcoin: '4d3e4007c50313d031ffb3f180d0bd6b37192e1c852ec9f9a16ad1db957707c6',
	'bitcoin-cash': '9c3f790921eab71fe9b210a9884c81708dc55d9444bba8c54394b827e2cf7f5a',
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
	caip2Namespace: 'eip155',
	caip2Reference: '1',
	caip2: 'eip155:1',
	chainId: '1',
	contractId: `1:${USDC_ADDRESS}`,
	coinId: 'ETH',
	iso4217: 'USD',
	ensName: 'vitalik.eth',
	upgradeSlug: 'Homestead',
	blockNumber: '18000000',
	height: '18000000',
	transactionId: SAMPLE_TX_HASH,
	txId: SAMPLE_TX_HASH,
	address: VITALIK_ADDRESS,
	caipId: '25',
	sessionId: 'e2e-probe-session',
	sourceId: 'e2e-probe-source',
	dashboardId: 'c0000000-0000-4000-8000-000000000003',
	routeId: stringify(probeEntitySelectorByType[EntityType.BridgeRoute]),
	stepIndex: '0',
	userId: '3',
	accountId: '3',
	fid: '3',
	fname: 'dwr',
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
	target: 'bafybeigdyrzt3sfp7vd2lvdwqcedebyb6utyghj6v7k5vcheck7l1vprfw',
	test: 'test',
	marketKey: stringify(ethUsdCatalogMarket),
	instanceOrigin: 'https://mastodon.social',
	did: atprotoNetworkSeedActors[0].did,
	uri: atprotoNetworkSeedPosts[0].uri,
	epochNumber: '300000',
	slotNumber: '9500000',
	timestampMs: '0',
	sampleKey: 'Etherscan_Rest:gastracker:gasoracle',
	observerKey: 'Voltaire_JsonRpc:txpool_status:ethereum.publicnode.com',
	observer: 'ethereum.publicnode.com',
	observationScope: 'nodeLocal',
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
	userOperationHash: SAMPLE_USER_OPERATION_HASH,
	coinInstanceSlug: 'native',
	marketVenueId: MarketVenueId.Binance,
	localAccountId: '13179',
	localStatusId: '116539053870420123',
	acct: 'Gargron@mastodon.social',
	activityStreamsUri: ACTIVITY_PUB_PROBE_ACTOR_URI,
	hash: CAST_HASH_32,
	postId: LENS_PROBE_POST_ID,
	conversationId: 'e2e-probe-agent-conversation',
	channelId: 'e2e-probe-state-channel',
	contactId: 'e2e-probe-room-peer',
	roomId: 'e2e-probe-room',
	url: 'https%3A%2F%2Fexample.com',
	walletId: 'e2e-probe-wallet',
}


export const e2eRouteRestSegmentFixtures: Record<string, string> = {
	contentPath: 'index.html',
	uri: encodeURIComponent(atprotoNetworkSeedPosts[0].uri),
}


/**
 * Routes that depend on live upstream rows the probes treat as optional / synthetic.
 * Still visited and reported; excluded from hard boundary failure by default.
 */
export const e2eBoundaryLiveOptionalPathnames = new Set<string>([
	...Object.values(e2eNostrYouTubeOptionalDetailRoutePaths),
	`/nostr/note/${NOSTR_PROBE_NOTE_EVENT_ID}`,
	`/nostr/note/${NOSTR_PROBE_NOTE_EVENT_ID}/replies`,
	`/nostr/profile/${NOSTR_PROBE_PUBKEY}`,
	`/nostr/profile/${NOSTR_PROBE_PUBKEY}/articles`,
	`/nostr/profile/${NOSTR_PROBE_PUBKEY}/notes`,
	`/nostr/profile/${NOSTR_PROBE_PUBKEY}/reposts`,
	`/nostr/reaction/${NOSTR_PROBE_REACTION_EVENT_ID}`,
	`/nostr/reaction/${NOSTR_PROBE_NOTE_EVENT_ID}`,
	`/nostr/repost/${NOSTR_PROBE_REPOST_EVENT_ID}`,
	`/nostr/repost/${NOSTR_PROBE_NOTE_EVENT_ID}`,
	'/nostr/articles',
	'/nostr/notes',
	'/nostr/profiles',
	'/nostr/reactions',
	'/nostr/relays',
	'/nostr/reposts',
	'/reddit/comment/t1_osbo75d',
	'/reddit/comment/t1_osbo75d/replies',
	'/reddit/link/t3_1u8x2f8',
	'/reddit/link/t3_1u8x2f8/comments',
	'/reddit/links',
	'/reddit/r/ethereum',
	'/reddit/r/ethereum/links',
	'/reddit/subreddits',
	`/youtube/comment/${encodeURIComponent(YOUTUBE_PROBE_VIDEO_ID)}/${encodeURIComponent(YOUTUBE_PROBE_COMMENT_ID)}`,
	`/farcaster/cast/3/${CAST_HASH_32}`,
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
			return 'memes'
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
		return '56'

	if (paramKey === 'contractAddress' && path.includes('services/agent'))
		return '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432'

	if (paramKey === 'tokenId' && path.includes('services/agent'))
		return '104776'

	if (paramKey === 'caip2Namespace' && path === 'network')
		return 'bip122'

	if (paramKey === 'caip2Reference' && path === 'network')
		return '000000000019d6689c085ae165831e93'

	if (paramKey === 'networkSlug' && path === 'network')
		return 'bitcoin'

	if (paramKey === 'transactionId' && path.includes('blob'))
		return SAMPLE_BLOB_TX_HASH

	if (paramKey === 'address') {
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

	if (paramKey === 'activityStreamsUri' && path.includes('activity-pub-note'))
		return ACTIVITY_PUB_PROBE_NOTE_URI

	if (paramKey === 'activityStreamsUri' && path.includes('activity-pub-actor'))
		return ACTIVITY_PUB_PROBE_ACTOR_URI

	return e2eRouteParamFixtures[paramKey] ?? `e2e-probe-${paramKey}`
}

export const e2eRouteParamFixtureVariantsForContext = (
	paramKey: string,
	staticSegments: readonly string[],
	selectedParams: Readonly<Record<string, string>>
) => {
	const path = staticSegments.join('/')

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

	if (paramKey === 'txId' && path.includes('network/transactions') && selectedParams.networkSlug)
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
