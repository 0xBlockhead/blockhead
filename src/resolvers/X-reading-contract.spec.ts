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

const fxEmbedQueries = vi.hoisted(() => ({
	getStatus: vi.fn(),
	getUser: vi.fn(),
	getUserStatuses: vi.fn(),
	searchStatuses: vi.fn(),
}))
const xQueries = vi.hoisted(() => ({
	getTweet: vi.fn(),
	getUser: vi.fn(),
	listUserTweets: vi.fn(),
	searchRecentTweets: vi.fn(),
}))

vi.mock('$/sources/FxEmbed/Rest/queries.ts', () => fxEmbedQueries)
vi.mock('$/sources/X/Rest/queries.ts', () => xQueries)

const { default: fxEmbedResolvers } = await import('$/resolvers/X-FxEmbed-Rest.ts')
const { default: xResolvers } = await import('$/resolvers/X-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_X_API_BEARER: 'fixture',
	},
	limit: 10,
}

describe('X reading identity and observation contract', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		for (const query of [
			...Object.values(fxEmbedQueries),
			...Object.values(xQueries),
		])
			query.mockReset()
	})

	it('leaves post URLs to the selector-derived source', () => {
		expect([
			...fxEmbedResolvers.resolvers,
			...xResolvers.resolvers,
		].filter((resolver) => resolver.entityType === EntityType.XPost).every((resolver) => (
			!Object.hasOwn(resolver.projections, 'postUrl')
		))).toBe(true)
	})

	it('converges username lookup on the provider-owned id and current username', async () => {
		fxEmbedQueries.getUser.mockResolvedValue({
			user: {
				type: 'profile',
				id: '44196397',
				screen_name: 'current_reader',
			},
		})

		await expect(fxEmbedResolvers.resolvers[0].resolve['Username'].resolve(
			{ username: 'former_reader' },
			context
		)).resolves.toMatchObject({
			id: '44196397',
			username: 'current_reader',
		})
	})

	it('creates source-keyed observations while preserving real zero metrics', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_768_435_200_000)
		fxEmbedQueries.getUser.mockResolvedValue({
			user: {
				type: 'profile',
				id: '44196397',
				screen_name: 'fixture_reader',
				followers: 0,
				following: 0,
				statuses: 0,
			},
		})
		xQueries.getTweet.mockResolvedValue({
			data: {
				id: '1890000000000000000',
				public_metrics: {
					like_count: 0,
					retweet_count: 0,
					reply_count: 0,
					quote_count: 0,
				},
			},
		})

		const fxEmbedUser = await fxEmbedResolvers.resolvers[0].resolve['Username'].resolve(
			{ username: 'fixture_reader' },
			context
		)
		expect(fxEmbedResolvers.resolvers[0].projections.$$timestamps(fxEmbedUser)).toEqual([{
			[EntityMetaKey.Selector]: {
				$user: {
					id: '44196397',
				},
				timestampMs: 1_768_435_200_000,
				source: Source.X_FxEmbed_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followerCount')]: 0,
				[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followingCount')]: 0,
				[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'tweetCount')]: 0,
			},
		}])
		const xPost = await xResolvers.resolvers[1].resolve['Id'].resolve(
			{ id: '1890000000000000000' },
			context
		)
		expect(xResolvers.resolvers[1].projections.$$timestamps(xPost)).toEqual([{
			[EntityMetaKey.Selector]: {
				$post: {
					id: '1890000000000000000',
				},
				timestampMs: 1_768_435_200_000,
				source: Source.X_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'likeCount')]: 0,
				[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'retweetCount')]: 0,
				[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'replyCount')]: 0,
				[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'quoteCount')]: 0,
			},
		}])
		expect(fxEmbedQueries.getUser).toHaveBeenCalledOnce()
		expect(xQueries.getTweet).toHaveBeenCalledOnce()
	})

	it('keeps historical detail persisted-only and prefills official timeline cards', async () => {
		expect([
			...fxEmbedResolvers.resolvers,
			...xResolvers.resolvers,
		].some((resolver) => (
			resolver.entityType === EntityType.XUser_Timestamp
			|| resolver.entityType === EntityType.XPost_Timestamp
		))).toBe(false)

		xQueries.listUserTweets.mockResolvedValue({
			data: [
				{
					id: '1890000000000000000',
					text: 'Prefilled official timeline post',
					created_at: '2026-01-15T00:00:00.000Z',
					author_id: '44196397',
				},
				{
					id: '1880000000000000000',
					text: 'Foreign timeline post',
					author_id: 'other-user',
				},
				{
					id: '1870000000000000000',
					text: 'Unowned timeline post',
				},
			],
			includes: {
				users: [{
					id: '44196397',
					username: 'fixture_reader',
					name: 'Fixture Reader',
				}],
			},
			meta: {
				next_token: 'opaque/+ %=token',
			},
		})

		const page = await xResolvers.resolvers[2].resolve['Id'].resolve(
			{ id: '44196397' },
			context
		)
		const postsProjection = xResolvers.resolvers[2].projections.$$posts
		if (typeof postsProjection === 'function')
			throw new Error('X reading spec missing timeline continuation')
		expect(postsProjection.select?.(
			page,
			{ id: '44196397' },
			context
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				id: '1890000000000000000',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
					'Prefilled official timeline post',
				[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
					1_768_435_200_000,
				[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
					[EntityMetaKey.Selector]: {
						id: '44196397',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
							'fixture_reader',
						[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
							'Fixture Reader',
					},
				},
			},
		}])
		expect(postsProjection.continuation?.(
			page,
			{ id: '44196397' },
			context
		)).toEqual({
			operation: 'users/:id/tweets',
			target: '44196397',
			terminal: false,
			token: 'opaque/+ %=token',
		})
	})

	it('materializes canonical post identity with detail fields', async () => {
		fxEmbedQueries.getStatus.mockResolvedValue({
			status: {
				type: 'status',
				id: '1890000000000000000',
				text: 'Canonical detail',
				author: {
					id: '44196397',
					screen_name: 'fixture_reader',
					name: 'Fixture Reader',
				},
			},
		})

		await expect(fxEmbedResolvers.resolvers[1].resolve['Id'].resolve(
			{ id: '1890000000000000000' },
			context
		)).resolves.toMatchObject({
			id: '1890000000000000000',
			text: 'Canonical detail',
			$author: {
				[EntityMetaKey.Selector]: { id: '44196397' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
						'fixture_reader',
					[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
						'Fixture Reader',
				},
			},
		})
	})

	it('prefills official quote cards from included posts and authors', async () => {
		xQueries.getTweet.mockResolvedValueOnce({
			data: {
				id: '1890000000000000000',
				referenced_tweets: [{
					type: 'quoted',
					id: '1880000000000000000',
				}],
			},
			includes: {
				tweets: [{
					id: '1880000000000000000',
					text: 'Quoted reading context',
					author_id: '44196397',
				}],
				users: [{
					id: '44196397',
					username: 'fixture_reader',
				}],
			},
		})

		await expect(xResolvers.resolvers[1].resolve['Id'].resolve(
			{ id: '1890000000000000000' },
			context
		)).resolves.toMatchObject({
			$quotedPost: {
				[EntityMetaKey.Selector]: { id: '1880000000000000000' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
						'Quoted reading context',
					[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
						[EntityMetaKey.Selector]: { id: '44196397' },
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
								'fixture_reader',
						},
					},
				},
			},
		})
	})

	it('prefills FxEmbed quote cards and excludes quoted tombstones', async () => {
		fxEmbedQueries.getStatus.mockResolvedValueOnce({
			status: {
				type: 'status',
				id: '1890000000000000000',
				quote: {
					type: 'status',
					id: '1880000000000000000',
					text: 'FxEmbed quoted reading context',
					created_timestamp: 1_768_435_200,
					author: {
						id: '44196397',
						screen_name: 'fixture_reader',
					},
				},
			},
		})
		await expect(fxEmbedResolvers.resolvers[1].resolve['Id'].resolve(
			{ id: '1890000000000000000' },
			context
		)).resolves.toMatchObject({
			$quotedPost: {
				[EntityMetaKey.Selector]: { id: '1880000000000000000' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
						'FxEmbed quoted reading context',
					[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
						[EntityMetaKey.Selector]: { id: '44196397' },
					},
				},
			},
		})

		fxEmbedQueries.getStatus.mockResolvedValueOnce({
			status: {
				type: 'status',
				id: '1890000000000000000',
				quote: {
					type: 'tombstone',
					id: '1880000000000000000',
				},
			},
		})
		await expect(fxEmbedResolvers.resolvers[1].resolve['Id'].resolve(
			{ id: '1890000000000000000' },
			context
		)).resolves.not.toHaveProperty('$quotedPost')
	})

	it('rejects provider rows for a different requested subject', async () => {
		xQueries.getTweet.mockResolvedValueOnce({
			data: { id: '1880000000000000000' },
		})
		await expect(xResolvers.resolvers[1].resolve['Id'].resolve(
			{ id: '1890000000000000000' },
			context
		)).rejects.toThrow('post id mismatch')

		fxEmbedQueries.getStatus.mockResolvedValueOnce({
			status: {
				type: 'status',
				id: '1880000000000000000',
			},
		})
		await expect(fxEmbedResolvers.resolvers[1].resolve['Id'].resolve(
			{ id: '1890000000000000000' },
			context
		)).rejects.toThrow('post id mismatch')

		fxEmbedQueries.getUser.mockResolvedValueOnce({
			user: {
				id: 'other-user',
				screen_name: 'fixture_reader',
			},
		})
		await expect(fxEmbedResolvers.resolvers[0].resolve['Id'].resolve(
			{ id: '44196397' },
			context
		)).rejects.toThrow('user id mismatch')

		xQueries.getUser.mockResolvedValueOnce({
			data: {
				username: 'fixture_reader',
			},
		})
		await expect(xResolvers.resolvers[0].resolve['Id'].resolve(
			{ id: '44196397' },
			context
		)).rejects.toThrow('user id mismatch')
	})
})
