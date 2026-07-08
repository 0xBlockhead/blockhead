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
import {
	MarketAssetKind,
	MarketKind,
} from '../../src/constants/Market.ts'
import { MarketVenueId } from '../../src/constants/MarketVenue.ts'
import { specificationRealms } from '../../src/constants/SpecificationProposal.ts'
import { swarmDocsLandingReference } from '../../src/sources/Swarm/Rest/constants.ts'
import type { E2eRouteFixtureMetadata } from './_generatedRouteFixtureMetadata.ts'


const VITALIK_ADDRESS = '0xd8da6bf26964af9d7eed9e403e826090792bed6a' as const
const BITCOIN_ADDRESS = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' as const
const BITCOIN_TX_ID = '4d3e4007c50313d031ffb3f180d0bd6b37192e1c852ec9f9a16ad1db957707c6' as const
const BITCOIN_CASH_CASH_TOKEN_TX_ID = '9c3f790921eab71fe9b210a9884c81708dc55d9444bba8c54394b827e2cf7f5a' as const
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const
const SAMPLE_TX_HASH = '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca' as const
const SAMPLE_USER_OPERATION_HASH = '0xca87534346367dbf4ff6675627a3e43635db5a36bd8ef99ffcd20a63d1555ef5' as const
const SOLANA_PROBE_SIGNATURE = 'E2eSolanaSignature11111111111111111111111111111111111111111111111' as const
const SOLANA_PROBE_PROGRAM_ID = '11111111111111111111111111111111' as const
const SOLANA_PROBE_TOKEN_MINT_ADDRESS = 'So11111111111111111111111111111111111111112' as const
const SOLANA_PROBE_OWNER_PUBKEY = 'ba4df886d2a7c4224bc98efb6cbf3817b0e2b7227c287b692a7c7d0a9e3e86ff' as const
const SOLANA_PROBE_VOTE_PUBKEY = 'E2eVotePubkey111111111111111111111111111111111111111' as const
const CAST_HASH_32 = '0xe4f2e1c70d72388a98dba2a2511a9b480840e544' as const
const FARCASTER_OBSERVATION_TIMESTAMP_MS = '1700000000000' as const
const NOSTR_PROBE_PUBKEY = nostrNetworkSeedProfiles[0].pubkey
const NOSTR_PROBE_RELAY_URL = nostrNetworkSeedRelays[0].relayUrl
const NOSTR_PROBE_ARTICLE_PUBKEY = nostrNetworkSeedProfiles[0].pubkey
const NOSTR_PROBE_ARTICLE_IDENTIFIER = 'blockhead-e2e-article' as const
const YOUTUBE_PROBE_PLAYLIST_ID = youtubeNetworkSeedPlaylists[0].playlistId
const YOUTUBE_PROBE_VIDEO_ID = youtubeNetworkSeedVideos[0].videoId
const YOUTUBE_PROBE_COMMENT_ID = 'UgzuC3zzpRZkjc5Qzsd4AaABAg' as const
const YOUTUBE_PROBE_CHANNEL_ID = youtubeNetworkSeedChannels[0].channelId
const COSMOS_PROBE_OPERATOR_ADDRESS = 'cosmosvaloper1qphf0ferqcch0jca9hlqfm3x0eds3dpkcvpafp' as const
const COSMOS_PROBE_TX_HASH = 'B70E21EE2A02B663915426C0664D27818105296D8E9A672B7932B4F6F9DADD5F' as const
const MEV_PROBE_BUILDER_PUBKEY = `0x${'11'.repeat(48)}` as const

const NOSTR_PROBE_NOTE_EVENT_ID = nostrNetworkSeedNotes[0].eventId

const RSS_PROBE_FEED_URL = rssNetworkSeedFeeds[0].feedUrl
const RSS_PROBE_ITEM_GUID = 'https://news.ycombinator.com/item?id=48594706' as const
const ETHEREUM_MARKET_TIMESTAMP_MS = '1767225600000' as const
const ACTIVITY_PUB_PROBE_ACTOR_URI = `${activityPubNetworkSeedActors[0].instanceOrigin}/users/Gargron` as const

const LENS_PROBE_POST_ID = '161m1s2r2av9deyh2a3' as const

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
export const e2eRouteParamFixtures: Partial<Record<string, string>> = {
	networkId: '1',
	networkStackId: 'Ethereum',
	networkSlug: 'bitcoin',
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
	source: 'Constants_Internal',
	sourceId: 'e2e-probe-source',
	dashboardId: 'e2e-probe-panel-tree',
	routeId: stringify(bridgeRouteEthMainnetToOptimism),
	stepIndex: '0',
	indexInCast: '0',
	index: '0',
	fromChainId: '1',
	toChainId: '10',
	toCaip2: 'eip155:42161',
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
	paymentHash: 'e2e-probe-paymentHash',
	kind: '30023',
	actionKind: 'spend',
	assetKey: 'native',
	categoryId: '9c3f790921eab71fe9b210a9884c81708dc55d9444bba8c54394b827e2cf7f5a',
	classKind: 'native',
	classKey: 'native',
	denom: 'uatom',
	eventId: NOSTR_PROBE_NOTE_EVENT_ID,
	formatId: 'default',
	handle: 'bsky.app',
	host: 'relay.ultrasound.money',
	moduleName: 'gov',
	operatorAddress: COSMOS_PROBE_OPERATOR_ADDRESS,
	pool: 'sapling',
	proposalId: '1',
	relayKey: NOSTR_PROBE_RELAY_URL,
	identifier: NOSTR_PROBE_ARTICLE_IDENTIFIER,
	stashAccountId: 'e2e-probe-stash-account',
	supplyScopeKey: 'circulating',
	timeIntervalUnit: 'day',
	timeIntervalValue: '1',
	videoId: YOUTUBE_PROBE_VIDEO_ID,
	playlistId: YOUTUBE_PROBE_PLAYLIST_ID,
	commentId: YOUTUBE_PROBE_COMMENT_ID,
	feedKey: RSS_PROBE_FEED_URL,
	guid: RSS_PROBE_ITEM_GUID,
	txHash: COSMOS_PROBE_TX_HASH,
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
])


export const e2eRouteParamFixtureForMetadata = (
	routeId: string,
	routeFixtureMetadata: E2eRouteFixtureMetadata,
	paramKey: string
) => {
	const fixture = (
		routeFixtureMetadata.fixture?.[paramKey]
		?? (
			paramKey === 'pubkey'
			&& routeId === '/network/[networkSlug=networkSlug]/solana/account/[pubkey]' ?
				SOLANA_PROBE_OWNER_PUBKEY
			:
				undefined
		)
		?? (
			paramKey === 'txId'
			&& routeId.includes('/cash-token/') ?
				BITCOIN_CASH_CASH_TOKEN_TX_ID
			:
				undefined
		)
		?? (
			paramKey === 'txId'
			&& routeId.startsWith('/network/[networkSlug=networkSlug]/')
			&& (
				routeId.includes('/transactions/[txId]')
				|| routeId.includes('/utxo/tx/[txId]')
			) ?
				BITCOIN_TX_ID
			:
				undefined
		)
		?? (
			paramKey === 'address'
			&& routeId.startsWith('/network/[networkSlug=networkSlug]/')
			&& (
				routeId.includes('/address/[address]')
				|| routeId.includes('/utxo/address/[address]')
			) ?
				BITCOIN_ADDRESS
			:
				undefined
		)
		?? (
			paramKey === 'height'
			&& routeId.startsWith('/network/[networkSlug=networkSlug]/') ?
				'0'
			:
				undefined
		)
		?? e2eRouteParamFixtures[paramKey]
	)
	if (fixture == null)
		throw new Error(`Missing generated E2E route fixture for ${routeId} param ${paramKey}`)

	return fixture
}

export const e2eRouteParamFixtureVariantsForMetadata = (
	routeId: string,
	routeFixtureMetadata: E2eRouteFixtureMetadata,
	paramKey: string,
	selectedParams: Readonly<Record<string, string>>
) => {
	if (routeFixtureVariantMode !== 'all')
		return [
			e2eRouteParamFixtureForMetadata(
				routeId,
				routeFixtureMetadata,
				paramKey
			),
		]

	const metadataVariants = [
		...new Set(routeFixtureMetadata.variants?.flatMap((variant) => (
			variant[paramKey] == null ? [] : [variant[paramKey]]
		)) ?? []),
	]
	if (metadataVariants.length > 0)
		return metadataVariants

	if (paramKey === 'specificationRealmSlug')
		return specificationRealms.map((realm) => realm.slug)

	if (paramKey === 'proposalKindSlug' && selectedParams.specificationRealmSlug)
		return [
			PROPOSAL_KIND_SLUG_BY_REALM_SLUG[selectedParams.specificationRealmSlug]
			?? e2eRouteParamFixtureForMetadata(
				routeId,
				routeFixtureMetadata,
				paramKey
			),
		]

	if (paramKey === 'proposalRef' && selectedParams.proposalKindSlug)
		return [
			PROPOSAL_REF_BY_KIND_SLUG[selectedParams.proposalKindSlug]
			?? e2eRouteParamFixtureForMetadata(
				routeId,
				routeFixtureMetadata,
				paramKey
			),
		]

	return [
		e2eRouteParamFixtureForMetadata(
			routeId,
			routeFixtureMetadata,
			paramKey
		),
	]
}
