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
import bindings from '$/sources/AtprotoBsky/bindings.ts'
import { Source } from '$/sources/Source.ts'

const {
	getAuthorFeed,
	getFollowers,
	getFollows,
	getLikes,
	getPostThread,
	getPosts,
	getProfile,
	getRepostedBy,
	resolveHandle,
	searchActors,
	searchActorsTypeahead,
	searchPosts,
} = vi.hoisted(() => ({
	getAuthorFeed: vi.fn(),
	getFollowers: vi.fn(),
	getFollows: vi.fn(),
	getLikes: vi.fn(),
	getPostThread: vi.fn(),
	getPosts: vi.fn(),
	getProfile: vi.fn(),
	getRepostedBy: vi.fn(),
	resolveHandle: vi.fn(),
	searchActors: vi.fn(),
	searchActorsTypeahead: vi.fn(),
	searchPosts: vi.fn(),
}))

vi.mock('$/sources/AtprotoBsky/Rest/queries.ts', () => ({
	getAuthorFeed,
	getFollowers,
	getFollows,
	getLikes,
	getPostThread,
	getPosts,
	getProfile,
	getRepostedBy,
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
	sourceBinding: bindings[Source.Atproto_Xrpc][0],
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
		getFollowers.mockReset()
		getFollows.mockReset()
		getLikes.mockReset()
		getPostThread.mockReset()
		getPosts.mockReset()
		getProfile.mockReset()
		getRepostedBy.mockReset()
		resolveHandle.mockReset()
		searchActors.mockReset()
		searchActorsTypeahead.mockReset()
		searchPosts.mockReset()
		vi.restoreAllMocks()
	})

	it('resolves paginated followers and follows as native actor references', async () => {
		getFollowers.mockResolvedValue({
			subject: { did: 'did:plc:alice', handle: 'alice.test' },
			actors: [{ did: 'did:plc:bob', handle: 'bob.test' }],
			cursor: 'followers-next',
		})
		getFollows.mockResolvedValue({
			subject: { did: 'did:plc:alice', handle: 'alice.test' },
			actors: [{ did: 'did:plc:carol', handle: 'carol.test' }],
		})
		const followers = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AtprotoActor
			&& '$$followers' in resolver.projections
		))
		const follows = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AtprotoActor
			&& '$$follows' in resolver.projections
		))
		if (
			followers == null
			|| follows == null
			|| !('Did' in followers.resolve)
			|| !('Did' in follows.resolve)
		)
			throw new Error('missing followers/follows resolvers')

		const followerRows = await followers.resolve.Did.resolve({ did: 'did:plc:alice' }, context)
		const followRows = await follows.resolve.Did.resolve({ did: 'did:plc:alice' }, context)
		expect(followerRows.rows[0][EntityMetaKey.Selector]).toEqual({ did: 'did:plc:bob' })
		expect(followerRows.rows[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.AtprotoActor, [], 'handle')]: 'bob.test',
		})
		expect(followerRows.rows[0][EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.AtprotoActor, [], '$$timestamps')
		][0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'source')]: Source.Atproto_Xrpc,
			[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'handle')]: 'bob.test',
		})
		expect(followRows.rows[0][EntityMetaKey.Selector]).toEqual({ did: 'did:plc:carol' })
		expect(followerRows.nextCursor).toBe('followers-next')
		expect(getFollowers).toHaveBeenCalledWith(context.sourceBinding, {
		actor: 'did:plc:alice',
		limit: 4,
		cursor: undefined,
	})
	})

	it('resolves post likers and reposters with independent provider cursors', async () => {
		getLikes.mockResolvedValue({
			uri: postView.uri,
			likes: [{
				indexedAt: '2025-02-03T04:05:06.000Z',
				createdAt: '2025-02-03T04:05:06.000Z',
				actor: { did: 'did:plc:bob', handle: 'bob.test' },
			}],
			cursor: 'likes-next',
		})
		getRepostedBy.mockResolvedValue({
			uri: postView.uri,
			repostedBy: [{ did: 'did:plc:carol', handle: 'carol.test' }],
		})
		const likers = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AtprotoPost
			&& '$$likers' in resolver.projections
		))
		const reposters = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AtprotoPost
			&& '$$reposters' in resolver.projections
		))
		if (
			likers == null
			|| reposters == null
			|| !('Uri' in likers.resolve)
			|| !('Uri' in reposters.resolve)
		)
			throw new Error('missing likers/reposters resolvers')

		const likerRows = await likers.resolve.Uri.resolve({ uri: postView.uri }, context)
		const reposterRows = await reposters.resolve.Uri.resolve({ uri: postView.uri }, context)
		expect(likerRows.rows[0][EntityMetaKey.Selector]).toEqual({ did: 'did:plc:bob' })
		expect(reposterRows.rows[0][EntityMetaKey.Selector]).toEqual({ did: 'did:plc:carol' })
		expect(likerRows.nextCursor).toBe('likes-next')
		expect(getLikes).toHaveBeenCalledWith(context.sourceBinding, {
		uri: postView.uri,
		limit: 4,
		cursor: undefined,
	})
	})

	it('fails closed when social list responses identify a different subject', async () => {
		getFollowers.mockResolvedValue({
			subject: { did: 'did:plc:other', handle: 'other.test' },
			actors: [],
		})
		getFollows.mockResolvedValue({
			subject: { did: 'did:plc:other', handle: 'other.test' },
			actors: [],
		})
		getLikes.mockResolvedValue({ uri: 'at://did:plc:other/app.bsky.feed.post/3post', likes: [] })
		getRepostedBy.mockResolvedValue({ uri: 'at://did:plc:other/app.bsky.feed.post/3post', repostedBy: [] })
		const actorResolvers = atproto.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.AtprotoActor
			&& ('$$followers' in resolver.projections || '$$follows' in resolver.projections)
		))
		const postResolvers = atproto.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.AtprotoPost
			&& ('$$likers' in resolver.projections || '$$reposters' in resolver.projections)
		))
		for (const resolver of actorResolvers) {
			if (!('Did' in resolver.resolve)) continue
			await expect(resolver.resolve.Did.resolve({ did: 'did:plc:alice' }, context)).rejects.toThrow('subject mismatch')
		}
		for (const resolver of postResolvers) {
			if (!('Uri' in resolver.resolve)) continue
			await expect(resolver.resolve.Uri.resolve({ uri: postView.uri }, context)).rejects.toThrow('subject mismatch')
		}
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
		expect(searchActors).toHaveBeenCalledWith(context.sourceBinding, {
			limit: 4,
			q: 'bsky',
			cursor: undefined,
		})
		expect(rows.rows).toHaveLength(1)
		expect(rows.rows[0][EntityMetaKey.Selector]).toEqual({ did: 'did:plc:alice' })
		expect(rows.rows[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.AtprotoActor, [], 'did')]: 'did:plc:alice',
			[entityFieldAddressKey(EntityType.AtprotoActor, [], 'handle')]: 'alice.test',
		})
		const timestamps = rows.rows[0][EntityMetaKey.Fields][
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
		if (
			observedPosts == null
			|| !('Scope' in observedPosts.resolve)
		)
			throw new Error('missing observed posts resolver')

		vi.spyOn(Date, 'now').mockReturnValue(1_738_555_506_000)
		await expect(observedPosts.resolve.Scope.resolve({
			scope: '_GlobalAtprotoNetwork',
		}, context)).resolves.toEqual({
			nextCursor: undefined,
			rows: [{
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
			}],
		})
		expect(atproto.resolvers.some((resolver) => (
			resolver.entityType === EntityType.AtprotoPost_Timestamp
		))).toBe(false)
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
		if (
			actorDid == null
			|| hubTimestamps == null
			|| !('Did' in actorDid.resolve)
			|| !('Scope' in hubTimestamps.resolve)
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
		expect(atproto.resolvers.some((resolver) => (
			resolver.entityType === EntityType._GlobalAtprotoNetwork_Timestamp
		))).toBe(false)
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

	it('carries provider cursors through actor discovery, post discovery, and author feeds', async () => {
		searchActors.mockResolvedValue({
			actors: [],
			cursor: 'actors-next',
		})
		searchPosts.mockResolvedValue({
			posts: [],
			cursor: 'posts-next',
		})
		getAuthorFeed.mockResolvedValue({
			feed: [],
			cursor: 'feed-next',
		})
		const observedActors = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType._GlobalAtprotoNetwork
			&& '$$observedActors' in resolver.projections
		))
		const observedPosts = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType._GlobalAtprotoNetwork
			&& '$$observedPosts' in resolver.projections
		))
		const authorPosts = atproto.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AtprotoActor
			&& '$$posts' in resolver.projections
		))
		if (
			observedActors == null
			|| observedPosts == null
			|| authorPosts == null
			|| !('Scope' in observedActors.resolve)
			|| !('Scope' in observedPosts.resolve)
			|| !('Did' in authorPosts.resolve)
		)
			throw new Error('missing paginated AT Protocol resolvers')

		const actors = await observedActors.resolve.Scope.resolve(
			{ scope: '_GlobalAtprotoNetwork' },
			{
				...context,
				providerContinuationToken: 'actors-current',
			}
		)
		const posts = await observedPosts.resolve.Scope.resolve(
			{ scope: '_GlobalAtprotoNetwork' },
			{
				...context,
				providerContinuationToken: 'posts-current',
			}
		)
		const feed = await authorPosts.resolve.Did.resolve(
			{ did: 'did:plc:alice' },
			{
				...context,
				providerContinuationToken: 'feed-current',
			}
		)

		expect(searchActors).toHaveBeenCalledWith(context.sourceBinding, {
			limit: 4,
			q: 'bsky',
			cursor: 'actors-current',
		})
		expect(searchPosts).toHaveBeenCalledWith(context.sourceBinding, {
			limit: 4,
			q: 'bsky',
			cursor: 'posts-current',
		})
		expect(getAuthorFeed).toHaveBeenCalledWith(context.sourceBinding, {
			actor: 'did:plc:alice',
			limit: 4,
			cursor: 'feed-current',
			includePins: true,
		})
		expect(actors.nextCursor).toBe('actors-next')
		expect(posts.nextCursor).toBe('posts-next')
		expect(feed.nextCursor).toBe('feed-next')
	})
})
