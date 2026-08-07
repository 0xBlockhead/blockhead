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

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const publicAppViewQueries = await import('$/sources/AtprotoBsky/Rest/queries.ts')
const socialAppViewQueries = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
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
				uri: 'at://did:plc:first/app.bsky.feed.post/3first',
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
