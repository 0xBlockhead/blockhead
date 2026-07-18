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

const {
	queryAccount,
	queryLatestPosts,
	queryPost,
} = vi.hoisted(() => ({
	queryAccount: vi.fn(),
	queryLatestPosts: vi.fn(),
	queryPost: vi.fn(),
}))

vi.mock('$/sources/Lens/Graphql/queries.ts', () => ({
	queryAccount,
	queryLatestPosts,
	queryPost,
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
		queryLatestPosts.mockReset()
		queryPost.mockReset()
	})

	it('maps latest posts and reposts to stable detail selectors', async () => {
		queryLatestPosts.mockResolvedValue({
			posts: {
				items: [
					{
						__typename: 'Post',
						slug: 'post-one',
					},
					{
						__typename: 'Repost',
						slug: 'repost-two',
					},
					{
						__typename: 'Post',
						slug: '',
					},
				],
			},
		})

		await expect(lensGraphql.resolvers[0].resolve.Scope.resolve({
			scope: 'LensNetwork',
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: { id: 'post-one' },
			},
			{
				[EntityMetaKey.Selector]: { id: 'repost-two' },
			},
		])
	})

	it('normalizes account identity and materializes observation metrics as keyed fields', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
		queryAccount.mockResolvedValue({
			account: {
				address: 'ABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD',
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
})
