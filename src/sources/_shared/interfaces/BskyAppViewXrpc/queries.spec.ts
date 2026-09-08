import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

import {
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'
import publicBindings from '$/sources/AtprotoBsky/bindings.ts'
import socialBindings from '$/sources/AtprotoBskySocial/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const publicAppViewTransport = await import('$/sources/AtprotoBsky/Rest/queries.ts')
const socialAppViewTransport = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
const bindQueries = (
	transport: typeof publicAppViewTransport,
	binding: typeof publicBindings[Source.Atproto_Xrpc][number]
) => Object.fromEntries(Object.entries(transport).map(([name, operation]) => [
	name,
	(...parameters: never[]) => operation(binding, ...parameters),
])) as typeof publicAppViewTransport
const publicAppViewQueries = bindQueries(
	publicAppViewTransport,
	publicBindings[Source.Atproto_Xrpc][0]
)
const socialAppViewQueries = bindQueries(
	socialAppViewTransport,
	socialBindings[Source.Atproto_BskySocial_Xrpc][0]
)
const {
	getFollowers: getSocialFollowers,
	getFollows: getSocialFollows,
	getLikes: getSocialLikes,
	getRepostedBy: getSocialRepostedBy,
} = socialAppViewQueries
const {
	getAuthorFeed,
	getPostThread,
	getPosts,
	getProfile,
	resolveHandle,
	searchActors,
	searchActorsTypeahead,
	searchPosts,
} = publicAppViewQueries

beforeEach(() => {
	sourceGetJson.mockReset()
	sourceGetJson.mockResolvedValue({
		did: 'did:plc:fixture',
		handle: 'fixture.test',
		posts: [],
		feed: [],
		actors: [],
	})
})

it('uses each registered AppView proxy binding for the shared eight-operation interface', async () => {
	for (const {
		queries,
		source,
		targetKey,
	} of [
		{
			queries: publicAppViewQueries,
			source: 'Atproto_Xrpc',
			targetKey: 'bsky-public-appview',
		},
		{
			queries: socialAppViewQueries,
			source: 'Atproto_BskySocial_Xrpc',
			targetKey: 'bsky-social-appview',
		},
	]) {
		sourceGetJson.mockClear()
		sourceGetJson.mockResolvedValue({
			did: 'did:plc:fixture',
			handle: 'fixture.test',
			posts: [],
			feed: [],
			actors: [],
		})
		await queries.resolveHandle('alice.test')
		await queries.getProfile('did:plc:profile')
		await queries.getPosts([
			'at://did:plc:first/app.bsky.feed.post/3first',
			'at://did:plc:second/app.bsky.feed.post/3second',
		])
		await queries.getPostThread('at://did:plc:thread/app.bsky.feed.post/3thread')
		await queries.getAuthorFeed({
			actor: 'did:plc:feed',
			cursor: 'cursor/with?reserved&values',
		})
		await queries.searchActorsTypeahead({
			q: 'alice & bob',
		})
		await queries.searchActors({
			q: 'alice & bob',
		})
		await queries.searchPosts({
			q: 'at://did:plc:search/app.bsky.feed.post/3search & reserved',
		})

		expect(sourceGetJson).toHaveBeenCalledTimes(8)
		for (const [binding] of sourceGetJson.mock.calls) {
			expect(binding.source).toBe(source)
			expect(binding.target).toEqual({
				kind: SourceTargetKind.Global,
				key: targetKey,
			})
			expect(binding.operationGroups).toContain(SourceOperationGroup.GenericRead)
			expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
			expect(sourceBindingId(binding)).toBeTypeOf('string')
			expect(binding.endpoints).toHaveLength(1)
			expect(binding.endpoints[0].endpointKind).toBe(SourceEndpointKind.HttpUrl)
			expect(binding.endpoints[0].corsEnabled).toBe(false)
		}
	}
})

it('preserves repeated uri parameters and reserved values without direct fetch', async () => {
	const directFetch = vi.spyOn(globalThis, 'fetch')
	sourceGetJson
		.mockResolvedValueOnce({ did: 'did:plc:resolved' })
		.mockResolvedValueOnce({
			posts: [{
				uri: 'at://did:plc:first/app.bsky.feed.post/3first?x=1&y=2',
				cid: 'bafyfixture',
				indexedAt: '2025-01-01T00:00:00.000Z',
				author: { did: 'did:plc:first', handle: 'first.test' },
				record: { text: 'hi', createdAt: '2025-01-01T00:00:00.000Z' },
			}],
		})
		.mockResolvedValueOnce({
			posts: [],
		})
	await resolveHandle('alice+research@example.com')
	await getPosts([
		'at://did:plc:first/app.bsky.feed.post/3first?x=1&y=2',
		'at://did:plc:second/app.bsky.feed.post/3second#fragment',
	])
	await searchPosts({
		limit: 17,
		q: 'reserved at:// value / ? & = #',
	})

	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('handle')).toBe(
		'alice+research@example.com'
	)
	expect(sourceGetJson.mock.calls[0][1]).toContain(
		'handle=alice%2Bresearch%40example.com'
	)
	expect(new URL(sourceGetJson.mock.calls[1][1]).searchParams.getAll('uris')).toEqual([
		'at://did:plc:first/app.bsky.feed.post/3first?x=1&y=2',
		'at://did:plc:second/app.bsky.feed.post/3second#fragment',
	])
	expect(new URL(sourceGetJson.mock.calls[2][1]).searchParams.get('q')).toBe(
		'reserved at:// value / ? & = #'
	)
	expect(new URL(sourceGetJson.mock.calls[2][1]).searchParams.get('limit')).toBe('17')
	expect(directFetch).not.toHaveBeenCalled()
})

it('routes social graph and reaction operations through the social AppView binding', async () => {
	const actor = 'did:plc:alice'
	const uri = 'at://did:plc:alice/app.bsky.feed.post/3post?x=1&y=2'
	sourceGetJson
		.mockResolvedValueOnce({ subject: { did: actor, handle: 'alice.test' }, followers: [] })
		.mockResolvedValueOnce({ subject: { did: actor, handle: 'alice.test' }, follows: [] })
		.mockResolvedValueOnce({ uri, cid: 'bafypost', likes: [] })
		.mockResolvedValueOnce({ uri, cid: 'bafypost', repostedBy: [] })

	await getSocialFollowers({ actor, cursor: 'followers/+ cursor' })
	await getSocialFollows({ actor, cursor: 'follows/+ cursor' })
	await getSocialLikes({ uri, cid: 'bafypost', cursor: 'likes/+ cursor' })
	await getSocialRepostedBy({ uri, cid: 'bafypost', cursor: 'reposts/+ cursor' })

	for (const [binding] of sourceGetJson.mock.calls)
		expect(binding).toBe(socialBindings[Source.Atproto_BskySocial_Xrpc][0])
	expect(sourceGetJson.mock.calls.map(([, requestUrl]) => new URL(requestUrl).pathname)).toEqual([
		'/xrpc/app.bsky.graph.getFollowers',
		'/xrpc/app.bsky.graph.getFollows',
		'/xrpc/app.bsky.feed.getLikes',
		'/xrpc/app.bsky.feed.getRepostedBy',
	])
	expect(new URL(sourceGetJson.mock.calls[2][1]).searchParams.get('uri')).toBe(uri)
	expect(new URL(sourceGetJson.mock.calls[3][1]).searchParams.get('cursor')).toBe('reposts/+ cursor')
})

it('propagates HandleNotFound without substituting a profile request', async () => {
	const handleNotFound = new Error('HandleNotFound')
	sourceGetJson.mockRejectedValueOnce(handleNotFound)

	await expect(resolveHandle('missing.example')).rejects.toBe(handleNotFound)
	expect(sourceGetJson).toHaveBeenCalledTimes(1)
	expect(sourceGetJson.mock.calls[0][1]).toContain('/com.atproto.identity.resolveHandle?')
})

it('does not transport an empty getPosts request', async () => {
	await expect(getPosts([])).resolves.toEqual({
		posts: [],
	})
	expect(sourceGetJson).not.toHaveBeenCalled()
})

it('rejects substituted and duplicate getPosts subjects', async () => {
	sourceGetJson.mockResolvedValueOnce({
		posts: [{
			uri: 'at://did:plc:other/app.bsky.feed.post/other',
			cid: 'bafyother',
			indexedAt: '2025-01-01T00:00:00.000Z',
			author: { did: 'did:plc:other', handle: 'other.test' },
			record: { text: 'other', createdAt: '2025-01-01T00:00:00.000Z' },
		}],
	})
	await expect(getPosts([
		'at://did:plc:requested/app.bsky.feed.post/requested',
	])).rejects.toThrow('BskyAppView_Xrpc: posts response subject mismatch')

	const post = {
		uri: 'at://did:plc:requested/app.bsky.feed.post/requested',
		cid: 'bafyrequested',
		indexedAt: '2025-01-01T00:00:00.000Z',
		author: { did: 'did:plc:requested', handle: 'requested.test' },
		record: { text: 'requested', createdAt: '2025-01-01T00:00:00.000Z' },
	}
	sourceGetJson.mockResolvedValueOnce({ posts: [post, post] })
	await expect(getPosts([post.uri])).rejects.toThrow(
		'BskyAppView_Xrpc: duplicate post URI'
	)
})

it('fail-closes malformed profile / posts / search envelopes', async () => {
	sourceGetJson.mockResolvedValueOnce({ handle: 'missing-did.test' })
	await expect(getProfile('did:plc:bad')).rejects.toThrow(
		'BskyAppView_Xrpc: invalid profile response envelope'
	)

	sourceGetJson.mockResolvedValueOnce({ posts: [{ uri: 'at://incomplete' }] })
	await expect(getPosts(['at://did:plc:x/app.bsky.feed.post/1'])).rejects.toThrow(
		'BskyAppView_Xrpc: invalid posts response envelope'
	)

	sourceGetJson.mockResolvedValueOnce({ actors: [{ did: 12 }] })
	await expect(searchActorsTypeahead({ q: 'x' })).rejects.toThrow(
		'BskyAppView_Xrpc: invalid search-actors-typeahead response envelope'
	)

	sourceGetJson.mockResolvedValueOnce({ actors: [{ did: 'did:plc:x' }] })
	await expect(searchActors({ q: 'x' })).rejects.toThrow(
		'BskyAppView_Xrpc: invalid search-actors response envelope'
	)

	sourceGetJson.mockResolvedValueOnce({ feed: [{ post: { uri: 'bad' } }] })
	await expect(getAuthorFeed({ actor: 'did:plc:x' })).rejects.toThrow(
		'BskyAppView_Xrpc: invalid author-feed response envelope'
	)

	sourceGetJson.mockResolvedValueOnce({
		thread: {
			uri: 'at://did:plc:missing/app.bsky.feed.post/3gone',
			notFound: true,
		},
	})
	await expect(getPostThread('at://did:plc:missing/app.bsky.feed.post/3gone')).resolves.toEqual({
		thread: {
			uri: 'at://did:plc:missing/app.bsky.feed.post/3gone',
			notFound: true,
		},
	})

	sourceGetJson.mockResolvedValueOnce({
		thread: {
			post: { uri: 'at://incomplete' },
		},
	})
	await expect(getPostThread('at://incomplete')).rejects.toThrow(
		'BskyAppView_Xrpc: invalid post-thread response envelope'
	)
})

it('accepts recursive getPostThread viewPost / notFound / blocked nodes', async () => {
	sourceGetJson.mockResolvedValueOnce({
		thread: {
			post: {
				uri: 'at://did:plc:root/app.bsky.feed.post/3root',
				cid: 'bafyroot',
				indexedAt: '2025-01-01T00:00:00.000Z',
				author: { did: 'did:plc:root', handle: 'root.test' },
				record: { text: 'root', createdAt: '2025-01-01T00:00:00.000Z' },
			},
			parent: {
				uri: 'at://did:plc:missing/app.bsky.feed.post/3gone',
				notFound: true,
			},
			replies: [
				{
					post: {
						uri: 'at://did:plc:reply/app.bsky.feed.post/3reply',
						cid: 'bafyreply',
						indexedAt: '2025-01-01T00:00:00.000Z',
						author: { did: 'did:plc:reply', handle: 'reply.test' },
						record: { text: 'reply', createdAt: '2025-01-01T00:00:00.000Z' },
					},
					replies: [{
						uri: 'at://did:plc:blocked/app.bsky.feed.post/3blocked',
						blocked: true,
						author: { did: 'did:plc:blocked' },
					}],
				},
			],
		},
	})
	await expect(getPostThread('at://did:plc:root/app.bsky.feed.post/3root')).resolves.toMatchObject({
		thread: {
			post: {
				uri: 'at://did:plc:root/app.bsky.feed.post/3root',
			},
			parent: {
				uri: 'at://did:plc:missing/app.bsky.feed.post/3gone',
				notFound: true,
			},
			replies: [
				{
					post: {
						uri: 'at://did:plc:reply/app.bsky.feed.post/3reply',
					},
					replies: [{
						uri: 'at://did:plc:blocked/app.bsky.feed.post/3blocked',
						blocked: true,
						author: { did: 'did:plc:blocked' },
					}],
				},
			],
		},
	})
})

it('parses gallery and nested record embeds through the recursive wire union', async () => {
	const gallery = {
		$type: 'app.bsky.embed.gallery#view',
		items: [{
			$type: 'app.bsky.embed.gallery#viewImage',
			thumbnail: 'https://cdn.example/thumb.jpg',
			fullsize: 'https://cdn.example/full.jpg',
			alt: 'gallery image',
			aspectRatio: {
				width: 4,
				height: 3,
			},
		}],
	}
	const nestedRecord = {
		$type: 'app.bsky.embed.record#view',
		record: {
			$type: 'app.bsky.embed.record#viewRecord',
			uri: 'at://did:plc:quoted/app.bsky.feed.post/3quoted',
			cid: 'bafyquoted',
			author: {
				did: 'did:plc:quoted',
				handle: 'quoted.test',
			},
			value: { text: 'quoted' },
			indexedAt: '2025-02-03T04:05:06.000Z',
			embeds: [gallery],
		},
	}
	sourceGetJson.mockResolvedValueOnce({
		posts: [{
			uri: 'at://did:plc:fixture/app.bsky.feed.post/3fixture',
			cid: 'bafyfixture',
			indexedAt: '2025-02-03T04:05:06.000Z',
			author: {
				did: 'did:plc:fixture',
				handle: 'fixture.test',
			},
			record: {
				text: 'fixture',
				createdAt: '2025-02-03T04:05:06.000Z',
			},
			embed: nestedRecord,
		}],
	})

	await expect(getPosts(['at://did:plc:fixture/app.bsky.feed.post/3fixture']))
		.resolves.toMatchObject({ posts: [{ embed: nestedRecord }] })
})

it('rejects an embed whose discriminant does not match its payload', async () => {
	sourceGetJson.mockResolvedValueOnce({
		posts: [{
			uri: 'at://did:plc:fixture/app.bsky.feed.post/3mismatch',
			cid: 'bafymismatch',
			indexedAt: '2025-02-03T04:05:06.000Z',
			author: {
				did: 'did:plc:fixture',
				handle: 'fixture.test',
			},
			record: {
				text: 'fixture',
				createdAt: '2025-02-03T04:05:06.000Z',
			},
			embed: {
				$type: 'app.bsky.embed.images#view',
				cid: 'bafymismatch',
				playlist: 'https://cdn.example/video.m3u8',
			},
		}],
	})

	await expect(getPosts(['at://did:plc:fixture/app.bsky.feed.post/3mismatch']))
		.rejects.toThrow('BskyAppView_Xrpc: invalid posts response envelope')
})

it('accepts zero engagement counts on posts and searchActors handles', async () => {
	sourceGetJson.mockResolvedValueOnce({
		posts: [{
			uri: 'at://did:plc:zero/app.bsky.feed.post/3zero',
			cid: 'bafyzero',
			indexedAt: '2025-01-01T00:00:00.000Z',
			likeCount: 0,
			repostCount: 0,
			replyCount: 0,
			quoteCount: 0,
			author: { did: 'did:plc:zero', handle: 'zero.test' },
			record: { text: '', createdAt: '2025-01-01T00:00:00.000Z' },
		}],
	})
	await expect(getPosts(['at://did:plc:zero/app.bsky.feed.post/3zero'])).resolves.toMatchObject({
		posts: [{
			likeCount: 0,
			repostCount: 0,
			replyCount: 0,
			quoteCount: 0,
		}],
	})

	sourceGetJson.mockResolvedValueOnce({
		actors: [{
			did: 'did:plc:alice',
			handle: 'alice.test',
			displayName: 'Alice',
		}],
	})
	await expect(searchActors({ q: 'alice' })).resolves.toEqual({
		actors: [{
			did: 'did:plc:alice',
			handle: 'alice.test',
			displayName: 'Alice',
		}],
	})
})
