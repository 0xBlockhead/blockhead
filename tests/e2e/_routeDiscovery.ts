import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { stringify } from 'devalue'


const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

const routesDir = join(repoRoot, 'src', 'routes')

const USDC_MAINNET = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

const VITALIK = '0xd8dA6BF26964aF9D7eed9E403E826090792BeD6A'

const SAMPLE_TX = '0xdacd6abf5b2814b28c68c59981f269c615796e7f0cba2009f4bf5edfdd9595ab'

/** Catalog ETH / USD at Binance — same discriminant strings as `MarketAssetKind` / `MarketVenue`. */
const marketKeyEthUsdBinance = stringify({
	$base: { kind: 'Coin', $coin: { coinId: 'ETH' } },
	$quote: { kind: 'Currency', $currency: { iso4217: 'USD' } },
	$marketVenue: { marketVenueId: 'Binance' },
	marketKind: 'Spot',
})

/**
 * Stable public-ish example ids for route smoke URLs (not secrets).
 * Prefer mainnet / mastodon.social / Bluesky `did:plc:` / Farcaster `memes` / Reddit `ethereum`, etc.
 */
const PARAM_FIXTURES: Record<string, string> = {
	networkId: '1',
	contractId: `1:${USDC_MAINNET}`,
	coinId: 'ETH',
	iso4217: 'USD',
	ensName: 'vitalik.eth',
	agentId: 'bc550000-0000-4000-a001-000000000001',
	upgradeSlug: 'Homestead',
	blockNumber: '18000000',
	transactionId: SAMPLE_TX,
	address: USDC_MAINNET,
	caipId: '25',
	profileId: 'a0000000-0000-4000-8000-000000000001',
	sourceId: 'b0000000-0000-4000-8000-000000000002',
	dashboardId: 'c0000000-0000-4000-8000-000000000003',
	conversationId: 'd0000000-0000-4000-8000-000000000004',
	channelId: 'memes',
	userId: '3',
	accountId: '3',
	fid: '3',
	hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
	fname: 'vitalik',
	hex: '0xa9059cbb',
	recordId: 'com.twitter',
	proposalRealmSlug: 'ethereum',
	proposalKindSlug: 'eip',
	proposalRef: 'eip-1559',
	positionId: '354198',
	poolId: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
	vaultId: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
	contactId: 'e0000000-0000-4000-8000-000000000005',
	roomId: 'f0000000-0000-4000-8000-000000000006',
	chainId: '1',
	owner: VITALIK,
	coin: USDC_MAINNET,
	sourceTxHash: SAMPLE_TX,
	createdAt: '1700000000',
	namespace: 'ipfs',
	target: 'bafybeigdyrzt3sfp7vd2lvdwqcedebyb6utyghj6v7k5vcheck7l1vprfw',
	test: 'test',
	marketKey: marketKeyEthUsdBinance,
	instanceOrigin: 'https://mastodon.social',
	localAccountId: '1',
	localStatusId: '111801704737679096',
	did: 'did:plc:z72i7hdynmk6x22kvon7fdpk',
	uri: 'at://did:plc:z72i7hdynmk6x22kvon7fdpk/app.bsky.feed.post/3juzh037csq2b',
	postId: '1855943488122347520',
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
}

const REST_SEGMENT_FIXTURES: Record<string, string> = {
	contentPath: 'README.md',
}

const isRouteGroup = (segment: string) => (
	segment.startsWith('(')
	&& segment.endsWith(')')
)

const encodeUrlSegment = (segment: string) => (
	segment === '~' ?
		'~'
	:	encodeURIComponent(segment)
)

const bracketSegmentToParamKey = (segment: string) => (
	segment.startsWith('[...') ?
		`...${segment.slice(4, -1)}`
	:	segment.startsWith('[') && segment.endsWith(']') ?
		((inner) => (
			(() => {
				const eq = inner.indexOf('=')
				return eq === -1 ? inner : inner.slice(0, eq)
			})()
		))(segment.slice(1, -1))
	:	segment
)

const dynamicFixture = (paramKey: string) => (
	paramKey.startsWith('...') ?
		REST_SEGMENT_FIXTURES[paramKey.slice(3)] ?? 'e2e-rest'
	:	PARAM_FIXTURES[paramKey] ?? `e2e-${paramKey}`
)

const pageFileToPathname = (absPath: string) => {
	const rel = relative(routesDir, absPath).replaceAll('\\', '/')
	const dir = rel.replace(/(\/+)?\+page\.svelte$/, '')
	const segments = dir === '' ? [] : dir.split('/').filter(Boolean)
	const urlSegments: string[] = []

	for (const segment of segments) {
		if (isRouteGroup(segment)) continue

		if (segment.startsWith('[...')) {
			const raw = dynamicFixture(bracketSegmentToParamKey(segment))
			for (const piece of raw.split('/').filter(Boolean))
				urlSegments.push(encodeUrlSegment(piece))

			continue
		}

		if (segment.startsWith('[') && segment.endsWith(']'))
			urlSegments.push(encodeUrlSegment(dynamicFixture(bracketSegmentToParamKey(segment))))
		else
			urlSegments.push(encodeUrlSegment(segment))
	}

	return (
		urlSegments.length === 0 ?
			'/'
		:	`/${urlSegments.join('/')}`
	)
}

const walkFiles = async function* (dir: string): AsyncGenerator<string> {
	for (const ent of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, ent.name)
		if (ent.isDirectory())
			yield* walkFiles(p)
		else if (ent.name === '+page.svelte')
			yield p
	}
}

export const discoverPathnamesFromRoutes = async () => {
	const seen = new Set<string>()
	const out: string[] = []

	for await (const file of walkFiles(routesDir)) {
		const pathname = pageFileToPathname(file)
		if (seen.has(pathname)) continue
		seen.add(pathname)
		out.push(pathname)
	}

	return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
}
