import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getAuthorFeed,
	getPostThread,
	getPosts,
	getProfile,
	resolveHandle,
	searchActors,
	searchActorsTypeahead,
	searchPosts,
} = vi.hoisted(() => ({
	getAuthorFeed: vi.fn(),
	getPostThread: vi.fn(),
	getPosts: vi.fn(),
	getProfile: vi.fn(),
	resolveHandle: vi.fn(),
	searchActors: vi.fn(),
	searchActorsTypeahead: vi.fn(),
	searchPosts: vi.fn(),
}))

vi.mock('$/sources/AtprotoBsky/Rest/queries.ts', () => ({
	getAuthorFeed,
	getPostThread,
	getPosts,
	getProfile,
	resolveHandle,
	searchActors,
	searchActorsTypeahead,
	searchPosts,
}))

const { default: atproto } = await import('$/resolvers/Atproto-Xrpc.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: { limit: 4 },
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const postView = {
	uri: 'at://did:plc:alice/app.bsky.feed.post/3post',
	cid: 'bafyfixture',
	indexedAt: '2025-02-03T04:05:06.000Z',
	likeCount: 0,
	repostCount: 2,
	replyCount: 1,
	quoteCount: 0,
	bookmarkCount: 0,
	author: {
		did: 'did:plc:alice',
		handle: 'alice.test',
	},
	record: {
		text: 'hello bsky',
		createdAt: '2025-02-03T04:05:06.000Z',
		langs: ['en'],
	},
}

describe('Atproto_Xrpc APP-free social deepenings', () => {
	beforeEach(() => {
		getAuthorFeed.mockReset()
		getPostThread.mockReset()
		getPosts.mockReset()
		getProfile.mockReset()
		resolveHandle.mockReset()
		searchActors.mockReset()
		searchActorsTypeahead.mockReset()
		searchPosts.mockReset()
	})

	it('projects $$observedActors via searchActors with handle + tip observation fields', async () => {
		searchActors.mockResolvedValue({
			actors: [{
				did: 'did:plc:alice',
				handle: 'alice.test',
				displayName: 'Alice',
				description: 'Reader',
				avatar: 'https://cdn.example/alice.png',
				indexedAt: '2025-02-03T04:05:06.000Z',
			}],
		})
		const observedActors = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType._GlobalAtprotoNetwork
			&& '$$observedActors' in resolver.projections
		))
		if (observedActors == null || !('Scope' in observedActors.resolve))
			throw new Error('missing $$observedActors resolver')

		const rows = await observedActors.resolve.Scope.resolve({
			scope: '_GlobalAtprotoNetwork',
		}, context)
		expect(searchActors).toHaveBeenCalledWith({
			limit: 4,
			q: 'bsky',
		})
		expect(rows).toHaveLength(1)
		expect(rows[0][EntityMetaKey.Selector]).toEqual({ did: 'did:plc:alice' })
		expect(rows[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.AtprotoActor, [], 'did')]: 'did:plc:alice',
			[entityFieldAddressKey(EntityType.AtprotoActor, [], 'handle')]: 'alice.test',
		})
		const timestamps = rows[0][EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.AtprotoActor, [], '$$timestamps')
		]
		expect(timestamps).toHaveLength(1)
		expect(timestamps[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'source')]: Source.Atproto_Xrpc,
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'handle')]: 'alice.test',
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'displayName')]: 'Alice',
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'description')]: 'Reader',
		})
	})

	it('projects $$observedPosts as post card references including zero engagement on tip rows', async () => {
		searchPosts.mockResolvedValue({
			posts: [postView],
		})
		getPosts.mockResolvedValue({
			posts: [postView],
		})
		const observedPosts = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType._GlobalAtprotoNetwork
			&& '$$observedPosts' in resolver.projections
		))
		const postTimestamp = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AtprotoPost_Timestamp
		))
		if (
			observedPosts == null
			|| postTimestamp == null
			|| !('Scope' in observedPosts.resolve)
			|| !('AtprotoPostTimestampMs' in postTimestamp.resolve)
		)
			throw new Error('missing observed posts / timestamp resolvers')

		await expect(observedPosts.resolve.Scope.resolve({
			scope: '_GlobalAtprotoNetwork',
		}, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: { uri: postView.uri },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'uri')]: postView.uri,
				[entityFieldAddressKey(EntityType.AtprotoPost, [], '$author')]: {
					[EntityMetaKey.Selector]: { did: 'did:plc:alice' },
				},
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'text')]: 'hello bsky',
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'createdAt')]: 1_738_555_506_000,
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'indexedAt')]: 1_738_555_506_000,
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'langs')]: ['en'],
			},
		}])

		await expect(postTimestamp.resolve.AtprotoPostTimestampMs.resolve({
			$post: { uri: postView.uri },
			timestampMs: 1,
		}, context)).resolves.toEqual({
			likeCount: 0,
			repostCount: 2,
			replyCount: 1,
			quoteCount: 0,
			bookmarkCount: 0,
		})
	})
})
