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
		vi.restoreAllMocks()
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

		vi.spyOn(Date, 'now').mockReturnValue(1_738_555_506_000)
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
				[entityFieldAddressKey(EntityType.AtprotoPost, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$post: { uri: postView.uri },
						timestampMs: 1_738_555_506_000,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'likeCount')]: 0,
						[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'repostCount')]: 2,
						[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'replyCount')]: 1,
						[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'quoteCount')]: 0,
						[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'bookmarkCount')]: 0,
					},
				}],
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

	it('projects Did handle from getProfile and hub tip $$timestamps from AppView search windows', async () => {
		getProfile.mockResolvedValue({
			did: 'did:plc:alice',
			handle: 'alice.test',
			displayName: 'Alice',
		})
		searchActors.mockResolvedValue({
			actors: [{
				did: 'did:plc:alice',
				handle: 'alice.test',
			}],
		})
		searchPosts.mockResolvedValue({
			posts: [postView],
		})
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)

		const actorDid = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AtprotoActor
			&& 'Did' in resolver.resolve
			&& 'handle' in resolver.projections
			&& !('$$timestamps' in resolver.projections)
			&& !('$$posts' in resolver.projections)
		))
		const hubTimestamps = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType._GlobalAtprotoNetwork
			&& '$$timestamps' in resolver.projections
		))
		const hubTimestampSingular = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType._GlobalAtprotoNetwork_Timestamp
		))
		if (
			actorDid == null
			|| hubTimestamps == null
			|| hubTimestampSingular == null
			|| !('Did' in actorDid.resolve)
			|| !('Scope' in hubTimestamps.resolve)
			|| !('HubTimestampMsSource' in hubTimestampSingular.resolve)
		)
			throw new Error('missing Did / hub timestamp resolvers')

		await expect(actorDid.resolve.Did.resolve({
			did: 'did:plc:alice',
		}, context)).resolves.toEqual({
			did: 'did:plc:alice',
			handle: 'alice.test',
		})

		const hub = await hubTimestamps.resolve.Scope.resolve({
			scope: '_GlobalAtprotoNetwork',
		}, context)
		expect(hub.$$timestamps).toHaveLength(1)
		expect(hub.$$timestamps[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'source')]: Source.Atproto_Xrpc,
			[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'observedActorCount')]: 1,
			[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'observedPostCount')]: 1,
			[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'relayHost')]: 'public.api.bsky.app',
			[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'reachable')]: true,
		})

		await expect(hubTimestampSingular.resolve.HubTimestampMsSource.resolve({
			$hub: { scope: '_GlobalAtprotoNetwork' },
			timestampMs: 1_700_000_000_000,
			source: Source.Atproto_Xrpc,
		}, context)).resolves.toEqual({
			$hub: { scope: '_GlobalAtprotoNetwork' },
			timestampMs: 1_700_000_000_000,
			source: Source.Atproto_Xrpc,
			observedActorCount: 1,
			observedPostCount: 1,
			relayHost: 'public.api.bsky.app',
			reachable: true,
		})
	})

	it('walks getPostThread ancestors/descendants and skips notFound/blocked nodes', async () => {
		getPostThread.mockResolvedValue({
			thread: {
				post: postView,
				parent: {
					uri: 'at://did:plc:missing/app.bsky.feed.post/3gone',
					notFound: true,
				},
				replies: [
					{
						post: {
							...postView,
							uri: 'at://did:plc:alice/app.bsky.feed.post/3reply',
							record: {
								...postView.record,
								text: 'reply',
							},
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
		const threadResolver = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AtprotoPost
			&& '$$thread' in resolver.projections
		))
		if (threadResolver == null || !('Uri' in threadResolver.resolve))
			throw new Error('missing $$thread resolver')

		const rows = await threadResolver.resolve.Uri.resolve({
			uri: postView.uri,
		}, context)
		expect(rows).toHaveLength(1)
		expect(rows[0][EntityMetaKey.Selector]).toEqual({
			uri: 'at://did:plc:alice/app.bsky.feed.post/3reply',
		})
		expect(rows[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.AtprotoPost, [], 'text')]).toBe('reply')
	})
})
