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
import { LensAccountSelector } from '$/schema/LensAccount.ts'
import { LensPostSelector } from '$/schema/LensPost.ts'
import { Source } from '$/sources/Source.ts'

const {
	queryAccount,
	queryAccounts,
	queryFeed,
	queryFeedPosts,
	queryLatestPosts,
	queryPost,
	queryPostComments,
	queryPostsByAuthor,
} = vi.hoisted(() => ({
	queryAccount: vi.fn(),
	queryAccounts: vi.fn(),
	queryFeed: vi.fn(),
	queryFeedPosts: vi.fn(),
	queryLatestPosts: vi.fn(),
	queryPost: vi.fn(),
	queryPostComments: vi.fn(),
	queryPostsByAuthor: vi.fn(),
}))

vi.mock('$/sources/Lens/Graphql/queries.ts', () => ({
	queryAccount,
	queryAccounts,
	queryFeed,
	queryFeedPosts,
	queryLatestPosts,
	queryPost,
	queryPostComments,
	queryPostsByAuthor,
}))

const { default: lensGraphql } = await import('$/resolvers/Lens-Graphql.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Lens_Graphql reading relationships', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		queryAccount.mockReset()
		queryAccounts.mockReset()
		queryFeed.mockReset()
		queryFeedPosts.mockReset()
		queryLatestPosts.mockReset()
		queryPost.mockReset()
		queryPostComments.mockReset()
		queryPostsByAuthor.mockReset()
	})

	it('materializes bounded latest, author, and direct-comment rows as useful cards', async () => {
		const post = {
			__typename: 'Post',
			slug: 'post-one',
			timestamp: '2025-02-03T04:05:06.000Z',
			author: {
				address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				createdAt: '2025-01-02T03:04:05.000Z',
				username: {
					localName: 'alice',
				},
				metadata: {
					name: 'Alice',
					picture: null,
				},
			},
			metadata: {
				__typename: 'TextOnlyMetadata',
				content: 'Readable Lens card',
			},
			commentOn: {
				slug: 'parent-post',
			},
		}
		const expectedReference = {
			[EntityMetaKey.Selector]: { id: 'post-one' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LensPost, [], 'text')]: 'Readable Lens card',
				[entityFieldAddressKey(EntityType.LensPost, [], 'timestamp')]: 1_738_555_506_000,
				[entityFieldAddressKey(EntityType.LensPost, [], '$author')]: {
					[EntityMetaKey.Selector]: {
						address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.LensAccount, [], 'localName')]: 'alice',
						[entityFieldAddressKey(EntityType.LensAccount, [], 'displayName')]: 'Alice',
						[entityFieldAddressKey(EntityType.LensAccount, [], 'createdAt')]: 1_735_787_045_000,
					},
				},
			},
		}
		queryLatestPosts.mockResolvedValue({
			posts: {
				items: [
					post,
					{
						__typename: 'Post',
						slug: '',
						author: post.author,
					},
					{
						...post,
						slug: 'deleted-post',
						isDeleted: true,
					},
					{
						...post,
						slug: 'authorless-post',
						author: null,
					},
				],
			},
		})
		queryPostsByAuthor.mockResolvedValue({
			posts: {
				items: [
					post,
					{
						...post,
						slug: 'foreign-author-post',
						author: {
							...post.author,
							address: '0x1111111111111111111111111111111111111111',
						},
					},
				],
			},
		})
		queryPostComments.mockResolvedValue({
			postReferences: {
				items: [
					post,
					{
						...post,
						slug: 'foreign-parent-post',
						commentOn: {
							slug: 'another-parent',
						},
					},
				],
			},
		})

		await expect(lensGraphql.resolvers[0].resolve.Scope.resolve({
			scope: 'LensNetwork',
		}, context)).resolves.toEqual([expectedReference])
		await expect(lensGraphql.resolvers[8].resolve[LensAccountSelector.Address].resolve({
			address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		}, context)).resolves.toEqual([expectedReference])
		await expect(lensGraphql.resolvers[6].resolve[LensPostSelector.Id].resolve({
			id: 'parent-post',
		}, context)).resolves.toEqual([expectedReference])
		expect(queryLatestPosts).toHaveBeenCalledWith({}, 64)
		expect(queryPostsByAuthor).toHaveBeenCalledWith(
			{},
			'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			64
		)
		expect(queryPostComments).toHaveBeenCalledWith({}, 'parent-post', 64)
		expect(queryPost).not.toHaveBeenCalled()
		expect(lensGraphql.source).toBe(Source.Lens_Graphql)
	})

	it('normalizes account identity and materializes observation metrics as keyed fields', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
		queryAccount.mockResolvedValue({
			account: {
				address: 'ABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD',
				owner: '0x1111111111111111111111111111111111111111',
				score: 73,
				createdAt: '2025-01-02T03:04:05.000Z',
				username: {
					localName: 'alice',
				},
				metadata: {
					name: 'Alice',
					bio: 'Lens reader',
					picture: null,
				},
			},
			accountStats: {
				graphFollowStats: {
					followers: 42,
					following: 7,
				},
			},
		})

		await expect(lensGraphql.resolvers[1].resolve[LensAccountSelector.Address].resolve({
			address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		}, context)).resolves.toMatchObject({
			address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			localName: 'alice',
			displayName: 'Alice',
			bio: 'Lens reader',
			owner: '0x1111111111111111111111111111111111111111',
			score: 73,
		})
		await expect(lensGraphql.resolvers[7].resolve[LensAccountSelector.Address].resolve({
			address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		}, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$account: {
					address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				},
				timestampMs: 1_750_000_000_000,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LensAccount_Timestamp, [], 'followerCount')]: 42,
				[entityFieldAddressKey(EntityType.LensAccount_Timestamp, [], 'followingCount')]: 7,
			},
		}])
	})

	it('preserves post author, thread references, text, and observation metrics', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_001)
		queryPost.mockResolvedValue({
			post: {
				__typename: 'Post',
				timestamp: '2025-02-03T04:05:06.000Z',
				isEdited: false,
				isDeleted: false,
				contentUri: 'lens://metadata/post-one',
				author: {
					address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				},
				commentOn: {
					slug: 'parent',
				},
				quoteOf: null,
				root: {
					slug: 'root',
				},
				metadata: {
					__typename: 'TextOnlyMetadata',
					content: 'Readable Lens post',
				},
				stats: {
					comments: 3,
					reposts: 2,
					quotes: 1,
					bookmarks: 4,
					collects: 5,
					reactions: 6,
				},
			},
		})

		await expect(lensGraphql.resolvers[2].resolve[LensPostSelector.Id].resolve({
			id: 'post-one',
		}, context)).resolves.toMatchObject({
			text: 'Readable Lens post',
			contentUri: 'lens://metadata/post-one',
			$author: {
				[EntityMetaKey.Selector]: {
					address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				},
			},
			$commentOn: {
				[EntityMetaKey.Selector]: { id: 'parent' },
			},
			$root: {
				[EntityMetaKey.Selector]: { id: 'root' },
			},
		})
		await expect(lensGraphql.resolvers[5].resolve[LensPostSelector.Id].resolve({
			id: 'post-one',
		}, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$post: {
					id: 'post-one',
				},
				timestampMs: 1_750_000_000_001,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'commentCount')]: 3,
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'repostCount')]: 2,
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'quoteCount')]: 1,
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'bookmarkCount')]: 4,
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'collectCount')]: 5,
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'reactionCount')]: 6,
			},
		}])
	})

	it('materializes the public account directory and direct feed fields without fabricating absent values', async () => {
		queryAccounts.mockResolvedValue({
			accounts: {
				items: [
					{
						address: 'ABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD',
						username: { localName: 'alice' },
						metadata: { name: 'Alice' },
					},
				],
			},
		})
		queryFeed.mockResolvedValue({
			feed: {
				address: '2222222222222222222222222222222222222222',
				owner: '0x1111111111111111111111111111111111111111',
				createdAt: '2025-03-04T05:06:07.000Z',
				metadata: {
					name: 'Research',
					description: '',
				},
			},
		})

		await expect(lensGraphql.resolvers[9].resolve.Scope.resolve({
			scope: 'LensNetwork',
		}, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LensAccount, [], 'localName')]: 'alice',
				[entityFieldAddressKey(EntityType.LensAccount, [], 'displayName')]: 'Alice',
			},
		}])
		expect(queryAccounts).toHaveBeenCalledWith({}, 64)
		await expect(lensGraphql.resolvers[10].resolve.Address.resolve({
			address: '0x2222222222222222222222222222222222222222',
		}, context)).resolves.toEqual({
			address: '0x2222222222222222222222222222222222222222',
			owner: '0x1111111111111111111111111111111111111111',
			name: 'Research',
			createdAt: 1_741_064_767_000,
		})
	})

	it('bounds relationship rows and rejects mismatched direct identities', async () => {
		const post = {
			__typename: 'Post',
			slug: 'post-one',
			author: {
				address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			},
		}
		queryLatestPosts.mockResolvedValue({
			posts: {
				items: [
					post,
					{
						...post,
						slug: 'post-two',
					},
				],
			},
		})

		await expect(lensGraphql.resolvers[0].resolve.Scope.resolve({
			scope: 'LensNetwork',
		}, {
			...context,
			pagination: { limit: 1 },
		})).resolves.toHaveLength(1)

		queryAccount.mockResolvedValueOnce({
			account: {
				address: '0x2222222222222222222222222222222222222222',
				createdAt: '2025-01-02T03:04:05.000Z',
			},
		})
		await expect(lensGraphql.resolvers[1].resolve[LensAccountSelector.Address].resolve({
			address: '0x1111111111111111111111111111111111111111',
		}, context)).rejects.toThrow('account response does not match request')

		queryFeed.mockResolvedValueOnce({
			feed: {
				address: '0x3333333333333333333333333333333333333333',
			},
		})
		await expect(lensGraphql.resolvers[10].resolve.Address.resolve({
			address: '0x2222222222222222222222222222222222222222',
		}, context)).rejects.toThrow('feed response does not match request')
	})

	it('materializes bounded feed posts through the declared public relationship', async () => {
		queryFeedPosts.mockResolvedValueOnce({
			posts: {
				items: [
					{
						__typename: 'Post',
						slug: 'feed-post',
						contentUri: 'lens://feed-post',
						feed: {
							address: '0x1111111111111111111111111111111111111111',
						},
						author: {
							address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
						},
					},
					{
						__typename: 'Post',
						slug: 'foreign-feed-post',
						feed: {
							address: '0x2222222222222222222222222222222222222222',
						},
						author: {
							address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
						},
					},
					{
						__typename: 'Repost',
						slug: 'feed-repost',
						repostOf: { slug: 'original-post' },
						author: {
							address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
						},
					},
				],
			},
		})

		await expect(lensGraphql.resolvers[11].resolve.Address.resolve({
			address: '0x1111111111111111111111111111111111111111',
		}, {
			...context,
			pagination: { limit: 7 },
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: { id: 'feed-post' },
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.LensPost, [], 'contentUri')]: 'lens://feed-post',
					[entityFieldAddressKey(EntityType.LensPost, [], '$author')]: {
						[EntityMetaKey.Selector]: {
							address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
						},
						[EntityMetaKey.Fields]: {},
					},
				}),
			},
		])
		expect(queryFeedPosts).toHaveBeenCalledWith(
			{},
			'0x1111111111111111111111111111111111111111',
			7
		)
	})
})
