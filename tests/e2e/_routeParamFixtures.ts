import { stringify } from 'devalue'

import { atprotoProbeDid, atprotoProbePostUri } from '$/constants/Social/Atproto.ts'
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
} from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'


const NOSTR_PROBE_NOTE_EVENT_ID = `${'a'.repeat(64)}` as const

const YOUTUBE_PROBE_CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw' as const

const RSS_PROBE_FEED_URL = 'https://hnrss.org/frontpage' as const

const LENS_PROBE_POST_ID = '161m1s2r2av9deyh2a3' as const

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
	chainId: '1',
	contractId: `1:${USDC_ADDRESS}`,
	coinId: 'ETH',
	iso4217: 'USD',
	ensName: 'vitalik.eth',
	upgradeSlug: 'Homestead',
	blockNumber: '18000000',
	height: '18000000',
	transactionId: SAMPLE_TX_HASH,
	address: VITALIK_ADDRESS,
	caipId: '25',
	sessionId: 'e2e-probe-session',
	sourceId: 'e2e-probe-source',
	dashboardId: 'c0000000-0000-4000-8000-000000000003',
	userId: '3',
	accountId: '3',
	fid: '3',
	fname: 'vitalik',
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
	sourceTxHash: SAMPLE_TX_HASH,
	createdAt: '1700000000',
	namespace: 'ipfs',
	target: 'bafybeigdyrzt3sfp7vd2lvdwqcedebyb6utyghj6v7k5vcheck7l1vprfw',
	test: 'test',
	marketKey: stringify(ethUsdCatalogMarket),
	instanceOrigin: 'https://mastodon.social',
	did: atprotoProbeDid,
	uri: atprotoProbePostUri,
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
	fullname: 't3_1h7t8a',
	contractAddress: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
	tokenId: '104776',
	reference: swarmDocsLandingReference,
	pubkey: NOSTR_PROBE_PUBKEY,
	eventId: NOSTR_PROBE_NOTE_EVENT_ID,
	relayKey: NOSTR_PROBE_RELAY_URL,
	identifier: NOSTR_PROBE_ARTICLE_IDENTIFIER,
	videoId: YOUTUBE_PROBE_VIDEO_ID,
	playlistId: YOUTUBE_PROBE_PLAYLIST_ID,
	commentId: YOUTUBE_PROBE_COMMENT_ID,
	feedKey: RSS_PROBE_FEED_URL,
	guid: 'e2e-probe-rss-item',
	blobIndex: '0',
	logIndex: '0',
	userOperationHash: SAMPLE_USER_OPERATION_HASH,
	coinInstanceSlug: 'native',
	marketVenueId: MarketVenueId.Binance,
	localAccountId: '13179',
	localStatusId: '116539053870420123',
	hash: CAST_HASH_32,
	postId: LENS_PROBE_POST_ID,
	conversationId: 'e2e-probe-agent-conversation',
	channelId: 'e2e-probe-state-channel',
	contactId: 'e2e-probe-room-peer',
	roomId: 'e2e-probe-room',
}


export const e2eRouteRestSegmentFixtures: Record<string, string> = {
	contentPath: 'index.html',
}


/**
 * Routes that depend on live upstream rows the probes treat as optional / synthetic.
 * Still visited and reported; excluded from hard boundary failure by default.
 */
export const e2eBoundaryLiveOptionalPathnames = new Set<string>([
	...Object.values(e2eNostrYouTubeOptionalDetailRoutePaths),
	`/youtube/comment/${encodeURIComponent(YOUTUBE_PROBE_VIDEO_ID)}/${encodeURIComponent(YOUTUBE_PROBE_COMMENT_ID)}`,
	`/farcaster/cast/3/${CAST_HASH_32}`,
	'/network/eip155:1',
	'/network/ethereum',
])


export const e2eRouteParamFixtureForContext = (
	paramKey: string,
	staticSegments: readonly string[],
) => {
	const path = staticSegments.join('/')

	if (paramKey === 'channelId') {
		if (path.includes('youtube'))
			return YOUTUBE_PROBE_CHANNEL_ID
		if (path.includes('farcaster'))
			return 'memes'
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

	if (paramKey === 'transactionId' && path.includes('/blob/'))
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
		if (path.includes('/x/'))
			return '1855943488122347520'
		return LENS_PROBE_POST_ID
	}

	if (paramKey === 'eventId') {
		if (path.includes('/repost/'))
			return NOSTR_PROBE_REPOST_EVENT_ID
		if (path.includes('/reaction/'))
			return NOSTR_PROBE_REACTION_EVENT_ID
		return NOSTR_PROBE_NOTE_EVENT_ID
	}

	if (paramKey === 'userId' && path.includes('/x/'))
		return '12'

	return e2eRouteParamFixtures[paramKey]
}

export const e2eRouteParamFixtureVariantsForContext = (
	paramKey: string,
	staticSegments: readonly string[],
	selectedParams: Readonly<Record<string, string>>,
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

	return [
		e2eRouteParamFixtureForContext(paramKey, staticSegments),
	]
}
