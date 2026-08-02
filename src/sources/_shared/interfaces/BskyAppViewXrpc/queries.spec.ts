import { beforeEach, expect, it, vi } from 'vitest'

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
	searchActorsTypeahead,
	searchPosts,
} = publicAppViewQueries

beforeEach(() => {
	sourceGetJson.mockReset()
	sourceGetJson.mockResolvedValue({})
})

it('uses each registered AppView proxy binding for the shared seven-operation interface', async () => {
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
		await queries.searchPosts({
			q: 'at://did:plc:search/app.bsky.feed.post/3search & reserved',
		})

		expect(sourceGetJson).toHaveBeenCalledTimes(7)
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
