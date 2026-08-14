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
import { MediaTransport } from '$/schema/MediaTransport.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'

const {
	queryAccount,
	queryAccountStats,
	queryAccounts,
	queryFeed,
	queryFeedPosts,
	queryFeeds,
	queryLatestPosts,
	queryNamespace,
	queryNamespaces,
	queryPost,
	queryPostComments,
	queryPostsByAuthor,
	queryUsername,
	queryUsernames,
} = vi.hoisted(() => ({
	queryAccount: vi.fn(),
	queryAccountStats: vi.fn(),
	queryAccounts: vi.fn(),
	queryFeed: vi.fn(),
	queryFeedPosts: vi.fn(),
	queryFeeds: vi.fn(),
	queryLatestPosts: vi.fn(),
	queryNamespace: vi.fn(),
	queryNamespaces: vi.fn(),
	queryPost: vi.fn(),
	queryPostComments: vi.fn(),
	queryPostsByAuthor: vi.fn(),
	queryUsername: vi.fn(),
	queryUsernames: vi.fn(),
}))

vi.mock('$/sources/Lens/Graphql/queries.ts', () => ({
	lensQueries: {
		queryAccount,
		queryAccountStats,
		queryAccounts,
		queryFeed,
		queryFeedPosts,
		queryFeeds,
		queryLatestPosts,
		queryNamespace,
		queryNamespaces,
		queryPost,
		queryPostComments,
		queryPostsByAuthor,
		queryUsername,
		queryUsernames,
	},
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
		queryAccountStats.mockReset()
		queryAccounts.mockReset()
		queryFeed.mockReset()
		queryFeedPosts.mockReset()
		queryFeeds.mockReset()
		queryLatestPosts.mockReset()
		queryNamespace.mockReset()
		queryNamespaces.mockReset()
		queryPost.mockReset()
		queryPostComments.mockReset()
		queryPostsByAuthor.mockReset()
		queryUsername.mockReset()
		queryUsernames.mockReset()
	})

	it('materializes bounded latest, author, and direct-comment rows as useful cards', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
		const post = {
			__typename: 'Post',
			slug: 'post-one',
			timestamp: '2025-02-03T04:05:06.000Z',
			isEdited: false,
			isDeleted: false,
			author: {
				address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				createdAt: '2025-01-02T03:04:05.000Z',
				username: {
					localName: 'alice',
				},
				metadata: {
					name: 'Alice',
					picture: 'https://images.example/alice.png',
				},
			},
			metadata: {
				__typename: 'TextOnlyMetadata',
				content: 'Readable Lens card',
			},
			stats: {
				comments: 0,
				reposts: 1,
				quotes: 0,
				bookmarks: 2,
				collects: 0,
				reactions: 3,
			},
			commentOn: {
				slug: 'parent-post',
			},
			quoteOf: {
				slug: 'quoted-post',
			},
			root: {
				slug: 'root-post',
			},
		}
		const expectedReference = {
			[EntityMetaKey.Selector]: { id: 'post-one' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LensPost, [], 'text')]: 'Readable Lens card',
				[entityFieldAddressKey(EntityType.LensPost, [], 'timestamp')]: 1_738_555_506_000,
				[entityFieldAddressKey(EntityType.LensPost, [], 'isEdited')]: false,
				[entityFieldAddressKey(EntityType.LensPost, [], 'isDeleted')]: false,
				[entityFieldAddressKey(EntityType.LensPost, [], '$commentOn')]: {
					[EntityMetaKey.Selector]: {
						id: 'parent-post',
					},
				},
				[entityFieldAddressKey(EntityType.LensPost, [], '$quoteOf')]: {
					[EntityMetaKey.Selector]: {
						id: 'quoted-post',
					},
				},
				[entityFieldAddressKey(EntityType.LensPost, [], '$root')]: {
					[EntityMetaKey.Selector]: {
						id: 'root-post',
					},
				},
				[entityFieldAddressKey(EntityType.LensPost, [], '$author')]: {
					[EntityMetaKey.Selector]: {
						address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.LensAccount, [], 'localName')]: 'alice',
						[entityFieldAddressKey(EntityType.LensAccount, [], 'displayName')]: 'Alice',
						[entityFieldAddressKey(EntityType.LensAccount, [], 'createdAt')]: 1_735_787_045_000,
						[entityFieldAddressKey(EntityType.LensAccount, [], '$icon')]: {
							[EntityMetaKey.Selector]: {
								url: 'https://images.example/alice.png',
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Image,
								[entityFieldAddressKey(EntityType.Media, [], 'transport')]: MediaTransport.Http,
							},
						},
					},
				},
				[entityFieldAddressKey(EntityType.LensPost, [], '$$timestamps')]: [
					{
						[EntityMetaKey.Selector]: {
							$post: { id: 'post-one' },
							timestampMs: 1_750_000_000_000,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'commentCount')]: 0,
							[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'repostCount')]: 1,
							[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'quoteCount')]: 0,
							[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'bookmarkCount')]: 2,
							[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'collectCount')]: 0,
							[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'reactionCount')]: 3,
						},
					},
				],
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
		await expect(lensGraphql.resolvers[4].resolve['Address'].resolve({
			address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		}, context)).resolves.toEqual([expectedReference])
		await expect(lensGraphql.resolvers[3].resolve['Id'].resolve({
			id: 'parent-post',
		}, context)).resolves.toEqual([expectedReference])
		expect(queryLatestPosts).toHaveBeenCalledWith(
			64
		)
		expect(queryPostsByAuthor).toHaveBeenCalledWith(
			'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			64
		)
		expect(queryPostComments).toHaveBeenCalledWith(
			'parent-post',
			64
		)
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
		})
		queryAccountStats.mockResolvedValue({
			accountStats: {
				graphFollowStats: {
					followers: 42,
					following: 7,
				},
			},
		})

		const resolvedAccount = await lensGraphql.resolvers[1].resolve['Address'].resolve({
			address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		}, context)
		expect(resolvedAccount).toMatchObject({
			address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			localName: 'alice',
			displayName: 'Alice',
			bio: 'Lens reader',
			owner: '0x1111111111111111111111111111111111111111',
			score: 73,
			$$timestamps: [
				{
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
				},
			],
		})
		expect(queryAccount).toHaveBeenCalledWith({
			address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		})
		expect(lensGraphql.resolvers.some(({ entityType }) => (
			entityType === EntityType.LensAccount_Timestamp
		))).toBe(false)
		expect(queryAccountStats).toHaveBeenCalledWith(
			'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
		)
	})

	it('maps entity selectors to one account operation and rejects foreign identities', async () => {
		queryAccountStats.mockResolvedValue({
			accountStats: {
				graphFollowStats: {
					followers: 0,
					following: 0,
				},
			},
		})
		queryAccount
			.mockResolvedValueOnce({
				account: {
					address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
					owner: '0x1111111111111111111111111111111111111111',
					score: 1,
					createdAt: '2025-01-02T03:04:05.000Z',
					username: { localName: 'alice' },
					metadata: null,
				},
			})
			.mockResolvedValueOnce({
				account: {
					address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
					owner: '0x1111111111111111111111111111111111111111',
					score: 1,
					createdAt: '2025-01-02T03:04:05.000Z',
					username: null,
					metadata: null,
				},
			})

		await lensGraphql.resolvers[1].resolve.LocalName.resolve({
			localName: 'alice',
		}, context)
		await lensGraphql.resolvers[1].resolve.LegacyProfileId.resolve({
			legacyProfileId: '0x01',
		}, context)

		expect(queryAccount.mock.calls).toEqual([
			[{ username: { localName: 'alice' } }],
			[{ legacyProfileId: '0x01' }],
		])

		queryAccount.mockResolvedValueOnce({
			account: {
				address: '0x2222222222222222222222222222222222222222',
			},
		})
		await expect(lensGraphql.resolvers[1].resolve.Address.resolve({
			address: '0x1111111111111111111111111111111111111111',
		}, context)).rejects.toThrow('account response does not match request')
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
					createdAt: '2025-01-02T03:04:05.000Z',
					username: {
						localName: 'alice',
					},
					metadata: {
						name: 'Alice',
						picture: 'https://images.example/alice.png',
					},
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

		const resolvedPost = await lensGraphql.resolvers[2].resolve['Id'].resolve({
			id: 'post-one',
		}, context)
		expect(resolvedPost).toMatchObject({
			text: 'Readable Lens post',
			contentUri: 'lens://metadata/post-one',
			$author: {
				[EntityMetaKey.Selector]: {
					address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LensAccount, [], 'localName')]: 'alice',
					[entityFieldAddressKey(EntityType.LensAccount, [], 'displayName')]: 'Alice',
					[entityFieldAddressKey(EntityType.LensAccount, [], 'createdAt')]: 1_735_787_045_000,
					[entityFieldAddressKey(EntityType.LensAccount, [], '$icon')]: {
						[EntityMetaKey.Selector]: {
							url: 'https://images.example/alice.png',
						},
					},
				},
			},
			$commentOn: {
				[EntityMetaKey.Selector]: { id: 'parent' },
			},
			$root: {
				[EntityMetaKey.Selector]: { id: 'root' },
			},
			$$timestamps: [
				{
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
				},
			],
		})
		expect(lensGraphql.resolvers.some(({ entityType }) => (
			entityType === EntityType.LensPost_Timestamp
		))).toBe(false)
	})

	it('materializes the public account directory and direct feed fields without fabricating absent values', async () => {
		queryAccounts.mockResolvedValue({
			accounts: {
				items: [
					{
						address: 'ABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD',
						createdAt: '2025-03-04T05:06:07.000Z',
						owner: '0x1111111111111111111111111111111111111111',
						score: 42,
						username: { localName: 'alice' },
						metadata: {
							bio: 'Lens reader',
							name: 'Alice',
							picture: null,
						},
					},
				],
			},
		})
		queryFeed.mockResolvedValue({
			feed: {
				address: '2222222222222222222222222222222222222222',
				owner: '0x1111111111111111111111111111111111111111',
				createdAt: '2025-03-04T05:06:07.000Z',
				rules: {
					required: [],
					anyOf: [],
				},
				metadata: {
					name: 'Research',
					description: '',
				},
			},
		})

		await expect(lensGraphql.resolvers[5].resolve.Scope.resolve({
			scope: 'LensNetwork',
		}, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LensAccount, [], '$icon')]: undefined,
				[entityFieldAddressKey(EntityType.LensAccount, [], 'bio')]: 'Lens reader',
				[entityFieldAddressKey(EntityType.LensAccount, [], 'createdAt')]: 1_741_064_767_000,
				[entityFieldAddressKey(EntityType.LensAccount, [], 'displayName')]: 'Alice',
				[entityFieldAddressKey(EntityType.LensAccount, [], 'legacyProfileId')]: undefined,
				[entityFieldAddressKey(EntityType.LensAccount, [], 'localName')]: 'alice',
			},
		}])
		expect(queryAccounts).toHaveBeenCalledWith(
			64
		)
		await expect(lensGraphql.resolvers[8].resolve.Address.resolve({
			address: '0x2222222222222222222222222222222222222222',
		}, context)).resolves.toEqual({
			address: '0x2222222222222222222222222222222222222222',
			owner: '0x1111111111111111111111111111111111111111',
			$owner: {
				[EntityMetaKey.Selector]: {
					address: '0x1111111111111111111111111111111111111111',
				},
			},
			name: 'Research',
			createdAt: 1_741_064_767_000,
			$$rules: [],
		})
	})

	it('bounds relationship rows and rejects mismatched direct feed identities', async () => {
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

		queryFeed.mockResolvedValueOnce({
			feed: {
				address: '0x3333333333333333333333333333333333333333',
			},
		})
		await expect(lensGraphql.resolvers[8].resolve.Address.resolve({
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

		await expect(lensGraphql.resolvers[10].resolve.Address.resolve({
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
			'0x1111111111111111111111111111111111111111',
			7
		)
	})

	it('resolves author posts through localName and legacyProfileId without forking identity', async () => {
		const post = {
			__typename: 'Post',
			slug: 'post-one',
			author: {
				address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			},
			metadata: {
				__typename: 'TextOnlyMetadata',
				content: 'Local name author post',
			},
		}
		queryAccount
			.mockResolvedValueOnce({
				account: {
					address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
					owner: '0x1111111111111111111111111111111111111111',
					score: 1,
					createdAt: '2025-01-02T03:04:05.000Z',
					username: { localName: 'alice' },
					metadata: null,
				},
			})
			.mockResolvedValueOnce({
				account: {
					address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
					owner: '0x1111111111111111111111111111111111111111',
					score: 1,
					createdAt: '2025-01-02T03:04:05.000Z',
					username: null,
					metadata: null,
				},
			})
		queryPostsByAuthor.mockResolvedValue({
			posts: {
				items: [post],
			},
		})

		await expect(lensGraphql.resolvers[4].resolve.LocalName.resolve({
			localName: 'alice',
		}, {
			...context,
			pagination: { limit: 3 },
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: { id: 'post-one' },
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.LensPost, [], 'text')]: 'Local name author post',
					[entityFieldAddressKey(EntityType.LensPost, [], '$author')]: {
						[EntityMetaKey.Selector]: {
							address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
						},
						[EntityMetaKey.Fields]: {},
					},
				}),
			},
		])
		await expect(lensGraphql.resolvers[4].resolve.LegacyProfileId.resolve({
			legacyProfileId: '0x01',
		}, {
			...context,
			pagination: { limit: 3 },
		})).resolves.toHaveLength(1)
		expect(queryAccount.mock.calls).toEqual([
			[{ username: { localName: 'alice' } }],
			[{ legacyProfileId: '0x01' }],
		])
		expect(queryPostsByAuthor).toHaveBeenCalledWith(
			'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			3
		)
	})

	it('materializes username and namespace reading fields plus namespace-scoped username cards', async () => {
		const namespaceAddress = '0x2222222222222222222222222222222222222222'
		const username = {
			id: 'username-1',
			value: 'lens/alice',
			namespace: namespaceAddress,
			localName: 'alice',
			linkedTo: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			ownedBy: '0x1111111111111111111111111111111111111111',
			timestamp: '2025-02-03T04:05:06.000Z',
		}
		queryUsername
			.mockResolvedValueOnce({ username })
			.mockResolvedValueOnce({ username })
		queryNamespace.mockResolvedValueOnce({
			namespace: {
				address: namespaceAddress,
				namespace: 'lens',
				owner: '0x1111111111111111111111111111111111111111',
				tokenName: 'Lens Username',
				tokenSymbol: 'LNS',
				createdAt: '2025-01-02T03:04:05.000Z',
				metadata: {
					description: 'Canonical Lens namespace',
				},
				stats: {
					totalUsernames: 9,
				},
			},
		})
		queryUsernames.mockResolvedValueOnce({
			usernames: {
				items: [
					username,
					{
						...username,
						id: 'foreign-username',
						namespace: '0x3333333333333333333333333333333333333333',
					},
				],
			},
		})

		await expect(lensGraphql.resolvers[11].resolve.Id.resolve({
			id: 'username-1',
		}, context)).resolves.toEqual({
			id: 'username-1',
			namespace: namespaceAddress,
			localName: 'alice',
			value: 'lens/alice',
			ownedBy: '0x1111111111111111111111111111111111111111',
			linkedTo: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			timestamp: 1_738_555_506_000,
			$namespace: {
				[EntityMetaKey.Selector]: {
					address: namespaceAddress,
				},
			},
			$account: {
				[EntityMetaKey.Selector]: {
					address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				},
			},
			$owner: {
				[EntityMetaKey.Selector]: {
					address: '0x1111111111111111111111111111111111111111',
				},
			},
		})
		await expect(lensGraphql.resolvers[11].resolve.NamespaceLocalName.resolve({
			namespace: namespaceAddress,
			localName: 'alice',
		}, context)).resolves.toMatchObject({
			id: 'username-1',
			localName: 'alice',
		})
		await expect(lensGraphql.resolvers[12].resolve.Address.resolve({
			address: namespaceAddress,
		}, context)).resolves.toEqual({
			address: namespaceAddress,
			namespace: 'lens',
			owner: '0x1111111111111111111111111111111111111111',
			$owner: {
				[EntityMetaKey.Selector]: {
					address: '0x1111111111111111111111111111111111111111',
				},
			},
			tokenName: 'Lens Username',
			tokenSymbol: 'LNS',
			createdAt: 1_735_787_045_000,
			description: 'Canonical Lens namespace',
			totalUsernames: 9,
			$$rules: [],
		})
		await expect(lensGraphql.resolvers[14].resolve.Address.resolve({
			address: namespaceAddress,
		}, {
			...context,
			pagination: { limit: 4 },
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: { id: 'username-1' },
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.LensUsername, [], 'localName')]: 'alice',
					[entityFieldAddressKey(EntityType.LensUsername, [], 'value')]: 'lens/alice',
					[entityFieldAddressKey(EntityType.LensUsername, [], '$account')]: {
						[EntityMetaKey.Selector]: {
							address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
						},
					},
				}),
			},
		])
		expect(queryUsernames).toHaveBeenCalledWith(
			4,
			{ namespace: namespaceAddress }
		)
	})

	it('rejects mismatched username and namespace identities before enrichment', async () => {
		queryUsername.mockResolvedValueOnce({
			username: {
				id: 'foreign-username',
				namespace: '0x2222222222222222222222222222222222222222',
				localName: 'alice',
				ownedBy: '0x1111111111111111111111111111111111111111',
			},
		})
		await expect(lensGraphql.resolvers[11].resolve.Id.resolve({
			id: 'username-1',
		}, context)).rejects.toThrow('username response does not match request')

		queryNamespace.mockResolvedValueOnce({
			namespace: {
				address: '0x3333333333333333333333333333333333333333',
				namespace: 'lens',
			},
		})
		await expect(lensGraphql.resolvers[12].resolve.Address.resolve({
			address: '0x2222222222222222222222222222222222222222',
		}, context)).rejects.toThrow('namespace response does not match request')
	})

	it('projects LensNetwork.$$feeds and $$usernameNamespaces with enrolled summary fields', async () => {
		queryFeeds.mockResolvedValue({
			feeds: {
				items: [
					{
						address: '2222222222222222222222222222222222222222',
						owner: '0x1111111111111111111111111111111111111111',
						createdAt: '2025-03-04T05:06:07.000Z',
						metadata: {
							name: 'Research',
							description: 'Bounded research feed',
						},
						rules: {
							required: [{
								id: 'feed-rule-1',
								type: 'SIMPLE_PAYMENT',
								address: '0x3333333333333333333333333333333333333333',
								executesOn: ['CREATE_POST'],
								config: [],
							}],
							anyOf: [],
						},
					},
				],
			},
		})
		queryNamespaces.mockResolvedValue({
			namespaces: {
				items: [
					{
						address: '0x2222222222222222222222222222222222222222',
						namespace: 'lens',
						owner: '0x1111111111111111111111111111111111111111',
						tokenName: 'Lens Handle',
						tokenSymbol: 'LH',
						createdAt: '2025-03-04T05:06:07.000Z',
						metadata: {
							description: 'Default Lens namespace',
						},
						stats: {
							totalUsernames: 0,
						},
						rules: {
							required: [],
							anyOf: [{
								id: 'namespace-rule-1',
								type: 'TOKEN_GATED',
								address: '0x4444444444444444444444444444444444444444',
								executesOn: ['CREATE_USERNAME'],
								config: [{
									__typename: 'AddressKeyValue',
								}],
							}],
						},
					},
				],
			},
		})

		const feedsResolver = lensGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LensNetwork
			&& '$$feeds' in resolver.projections
		))
		const namespacesResolver = lensGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LensNetwork
			&& '$$usernameNamespaces' in resolver.projections
		))
		if (feedsResolver == null || namespacesResolver == null || !('Scope' in feedsResolver.resolve) || !('Scope' in namespacesResolver.resolve))
			throw new Error('Lens spec missing LensNetwork feed/namespace list resolvers')

		await expect(feedsResolver.resolve.Scope.resolve({
			scope: 'LensNetwork',
		}, {
			...context,
			pagination: { limit: 3 },
		})).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				address: '0x2222222222222222222222222222222222222222',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LensFeed, [], 'address')]: '0x2222222222222222222222222222222222222222',
				[entityFieldAddressKey(EntityType.LensFeed, [], 'owner')]: '0x1111111111111111111111111111111111111111',
				[entityFieldAddressKey(EntityType.LensFeed, [], '$owner')]: {
					[EntityMetaKey.Selector]: {
						address: '0x1111111111111111111111111111111111111111',
					},
				},
				[entityFieldAddressKey(EntityType.LensFeed, [], 'name')]: 'Research',
				[entityFieldAddressKey(EntityType.LensFeed, [], 'description')]: 'Bounded research feed',
				[entityFieldAddressKey(EntityType.LensFeed, [], 'createdAt')]: 1_741_064_767_000,
				[entityFieldAddressKey(EntityType.LensFeed, [], '$$rules')]: [{
					[EntityMetaKey.Selector]: {
						$feed: { address: '0x2222222222222222222222222222222222222222' },
						ruleId: 'feed-rule-1',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.LensFeedRule, [], 'ruleType')]: 'SIMPLE_PAYMENT',
						[entityFieldAddressKey(EntityType.LensFeedRule, [], 'address')]: '0x3333333333333333333333333333333333333333',
						[entityFieldAddressKey(EntityType.LensFeedRule, [], 'requirement')]: 'Required',
						[entityFieldAddressKey(EntityType.LensFeedRule, [], 'executesOn')]: ['CREATE_POST'],
						[entityFieldAddressKey(EntityType.LensFeedRule, [], 'configurationKinds')]: [],
					},
				}],
			},
		}])
		expect(queryFeeds).toHaveBeenCalledWith(3)

		await expect(namespacesResolver.resolve.Scope.resolve({
			scope: 'LensNetwork',
		}, {
			...context,
			pagination: { limit: 2 },
		})).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				address: '0x2222222222222222222222222222222222222222',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'address')]: '0x2222222222222222222222222222222222222222',
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'namespace')]: 'lens',
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'owner')]: '0x1111111111111111111111111111111111111111',
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], '$owner')]: {
					[EntityMetaKey.Selector]: {
						address: '0x1111111111111111111111111111111111111111',
					},
				},
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'tokenName')]: 'Lens Handle',
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'tokenSymbol')]: 'LH',
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'createdAt')]: 1_741_064_767_000,
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'description')]: 'Default Lens namespace',
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'totalUsernames')]: 0,
				[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], '$$rules')]: [{
					[EntityMetaKey.Selector]: {
						$namespace: { address: '0x2222222222222222222222222222222222222222' },
						ruleId: 'namespace-rule-1',
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.LensUsernameNamespaceRule, [], 'ruleType')]: 'TOKEN_GATED',
						[entityFieldAddressKey(EntityType.LensUsernameNamespaceRule, [], 'address')]: '0x4444444444444444444444444444444444444444',
						[entityFieldAddressKey(EntityType.LensUsernameNamespaceRule, [], 'requirement')]: 'AnyOf',
						[entityFieldAddressKey(EntityType.LensUsernameNamespaceRule, [], 'executesOn')]: ['CREATE_USERNAME'],
						[entityFieldAddressKey(EntityType.LensUsernameNamespaceRule, [], 'configurationKinds')]: ['AddressKeyValue'],
					},
				}],
			},
		}])
		expect(queryNamespaces).toHaveBeenCalledWith(2)
	})

	it('propagates typed-rule producer failures before feed projection', async () => {
		queryFeeds.mockRejectedValueOnce(new Error('Lens_Graphql: invalid feed rules response'))

		const feedsResolver = lensGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LensNetwork
			&& '$$feeds' in resolver.projections
		))
		if (feedsResolver == null || !('Scope' in feedsResolver.resolve))
			throw new Error('Lens spec missing LensNetwork feed list resolver')

		await expect(feedsResolver.resolve.Scope.resolve({
			scope: 'LensNetwork',
		}, context)).rejects.toThrow('invalid feed rules response')
	})

	it('resolves protocol-native feed and namespace rules by their parent-scoped RuleId', async () => {
		queryFeed.mockResolvedValue({
			feed: {
				address: '0x2222222222222222222222222222222222222222',
				rules: {
					required: [{
						id: 'feed-rule-1',
						type: 'SIMPLE_PAYMENT',
						address: '0x3333333333333333333333333333333333333333',
						executesOn: ['CREATING_POST'],
						config: [{ __typename: 'BigDecimalKeyValue' }],
					}],
					anyOf: [],
				},
			},
		})
		queryNamespace.mockResolvedValue({
			namespace: {
				address: '0x4444444444444444444444444444444444444444',
				rules: {
					required: [],
					anyOf: [{
						id: 'namespace-rule-1',
						type: 'USERNAME_LENGTH',
						address: '0x5555555555555555555555555555555555555555',
						executesOn: ['CREATING'],
						config: [{ __typename: 'IntKeyValue' }],
					}],
				},
			},
		})

		const feedRuleResolver = lensGraphql.resolvers.find(({ entityType }) => entityType === EntityType.LensFeedRule)
		const namespaceRuleResolver = lensGraphql.resolvers.find(({ entityType }) => entityType === EntityType.LensUsernameNamespaceRule)
		if (feedRuleResolver == null || namespaceRuleResolver == null)
			throw new Error('Lens spec missing native rule resolvers')

		await expect(feedRuleResolver.resolve.FeedRuleId.resolve({
			$feed: { address: '0x2222222222222222222222222222222222222222' },
			ruleId: 'feed-rule-1',
		}, context)).resolves.toEqual({
			ruleType: 'SIMPLE_PAYMENT',
			address: '0x3333333333333333333333333333333333333333',
			requirement: 'Required',
			executesOn: ['CREATING_POST'],
			configurationKinds: ['BigDecimalKeyValue'],
		})
		await expect(namespaceRuleResolver.resolve.NamespaceRuleId.resolve({
			$namespace: { address: '0x4444444444444444444444444444444444444444' },
			ruleId: 'namespace-rule-1',
		}, context)).resolves.toEqual({
			ruleType: 'USERNAME_LENGTH',
			address: '0x5555555555555555555555555555555555555555',
			requirement: 'AnyOf',
			executesOn: ['CREATING'],
			configurationKinds: ['IntKeyValue'],
		})
	})

	it('propagates typed-rule producer failures before namespace projection', async () => {
		queryNamespaces.mockRejectedValueOnce(new Error('Lens_Graphql: invalid username namespace rules response'))

		const namespacesResolver = lensGraphql.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LensNetwork
			&& '$$usernameNamespaces' in resolver.projections
		))
		if (namespacesResolver == null || !('Scope' in namespacesResolver.resolve))
			throw new Error('Lens spec missing LensNetwork username namespace list resolver')

		await expect(namespacesResolver.resolve.Scope.resolve({
			scope: 'LensNetwork',
		}, context)).rejects.toThrow('invalid username namespace rules response')
	})
})
