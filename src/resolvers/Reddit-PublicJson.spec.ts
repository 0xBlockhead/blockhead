import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	getCommentsByArticleId,
	getInfo,
	listSubredditHot,
	getSubredditAbout,
} from '$/sources/RedditPublic/Rest/queries.ts'
import redditPublicJson from '$/resolvers/Reddit-PublicJson.ts'

vi.mock('$/sources/RedditPublic/Rest/queries.ts', () => ({
	getCommentsByArticleId: vi.fn(),
	getInfo: vi.fn(),
	listSubredditHot: vi.fn(),
	getSubredditAbout: vi.fn(),
}))

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Reddit_PublicJson timestamp relationships', () => {
	it('materializes subreddit metrics as canonical timestamp fields', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
		vi.mocked(getSubredditAbout).mockResolvedValue({
			kind: 't5',
			data: {
				display_name: 'ethereum',
				title: 'Ethereum',
				public_description: 'Ethereum community',
				subscribers: 3_000_000,
				active_user_count: 1_234,
			},
		})
		const resolver = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditSubreddit
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Reddit_PublicJson spec missing RedditSubreddit.$$timestamps resolver')

		await expect(resolver.resolve['Name'].resolve({
			name: 'ethereum',
		}, resolverContext)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$subreddit: { name: 'ethereum' },
				timestampMs: 1_750_000_000_000,
				source: Source.Reddit_PublicJson,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.RedditSubreddit_Timestamp, [], 'subscriberCount')]: 3_000_000,
				[entityFieldAddressKey(EntityType.RedditSubreddit_Timestamp, [], 'activeUserCount')]: 1_234,
			},
		}])
	})

	it.each([
		{
			entityType: EntityType.RedditLink,
			selectorName: 'Fullname',
			fullname: 't3_link',
			kind: 't3',
			parentField: '$link',
			timestampEntityType: EntityType.RedditLink_Timestamp,
			metrics: {
				score: 42,
				commentCount: 7,
			},
			wireMetrics: {
				score: 42,
				num_comments: 7,
			},
		},
		{
			entityType: EntityType.RedditComment,
			selectorName: 'Fullname',
			fullname: 't1_comment',
			kind: 't1',
			parentField: '$comment',
			timestampEntityType: EntityType.RedditComment_Timestamp,
			metrics: {
				score: 13,
			},
			wireMetrics: {
				score: 13,
			},
		},
	])('materializes $entityType metrics as canonical timestamp fields', async ({
		entityType,
		selectorName,
		fullname,
		kind,
		parentField,
		timestampEntityType,
		metrics,
		wireMetrics,
	}) => {
		vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_001)
		vi.mocked(getInfo).mockResolvedValue({
			kind: 'Listing',
			data: {
				children: [{
					kind,
					data: {
						name: fullname,
						...wireMetrics,
					},
				}],
			},
		})
		const resolver = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === entityType
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error(`Reddit_PublicJson spec missing ${entityType}.$$timestamps resolver`)

		const rows = await resolver.resolve[selectorName].resolve({ fullname }, resolverContext)
		expect(rows).toEqual([{
			[EntityMetaKey.Selector]: {
				[parentField]: { fullname },
				timestampMs: 1_750_000_000_001,
				source: Source.Reddit_PublicJson,
			},
			[EntityMetaKey.Fields]: Object.fromEntries(Object.entries(metrics).map(([fieldName, value]) => [
				entityFieldAddressKey(timestampEntityType, [], fieldName),
				value,
			])),
		}])
	})
})

describe('Reddit_PublicJson comment hierarchy', () => {
	it('keeps direct parent/root identity and omits unmodeled more placeholders', async () => {
		vi.mocked(getInfo).mockResolvedValue({
			kind: 'Listing',
			data: {
				children: [{
					kind: 't1',
					data: {
						name: 't1_child',
						link_id: 't3_root',
						parent_id: 't1_parent',
					},
				}],
			},
		})
		vi.mocked(getCommentsByArticleId).mockResolvedValue([
			{ kind: 'Listing', data: { children: [] } },
			{
				kind: 'Listing',
				data: {
					children: [{
						kind: 't1',
						data: {
							name: 't1_parent',
							link_id: 't3_root',
							parent_id: 't3_root',
							replies: {
								kind: 'Listing',
								data: {
									children: [
										{
											kind: 't1',
											data: {
												name: 't1_child',
												link_id: 't3_root',
												parent_id: 't1_parent',
											},
										},
										{ kind: 'more', data: { children: ['unloaded'] } },
									],
								},
							},
						},
					}],
				},
			},
		])
		const detailResolver = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditComment
			&& '$link' in candidate.projections
		))
		const repliesResolver = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditComment
			&& '$$replies' in candidate.projections
		))
		if (detailResolver == null || repliesResolver == null)
			throw new Error('Reddit comment hierarchy resolvers missing')

		await expect(detailResolver.resolve['Fullname'].resolve({
			fullname: 't1_child',
		}, resolverContext)).resolves.toMatchObject({
			$link: { [EntityMetaKey.Selector]: { fullname: 't3_root' } },
			$parentComment: { [EntityMetaKey.Selector]: { fullname: 't1_parent' } },
		})
		vi.mocked(getInfo).mockResolvedValue({
			kind: 'Listing',
			data: {
				children: [{
					kind: 't1',
					data: { name: 't1_parent', link_id: 't3_root' },
				}],
			},
		})
		await expect(repliesResolver.resolve['Fullname'].resolve({
			fullname: 't1_parent',
		}, resolverContext)).resolves.toEqual([{
			[EntityMetaKey.Selector]: { fullname: 't1_child' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.RedditComment, [], '$link')]: {
					[EntityMetaKey.Selector]: { fullname: 't3_root' },
				},
				[entityFieldAddressKey(EntityType.RedditComment, [], '$parentComment')]: {
					[EntityMetaKey.Selector]: { fullname: 't1_parent' },
				},
			},
		}])
	})

	it('lists only forest roots while direct replies remain parent-owned', async () => {
		vi.mocked(getCommentsByArticleId).mockResolvedValue([
			{ kind: 'Listing', data: { children: [] } },
			{
				kind: 'Listing',
				data: {
					children: [{
						kind: 't1',
						data: {
							name: 't1_parent',
							link_id: 't3_root',
							parent_id: 't3_root',
							replies: {
								kind: 'Listing',
								data: {
									children: [{
										kind: 't1',
										data: {
											name: 't1_child',
											link_id: 't3_root',
											parent_id: 't1_parent',
										},
									}],
								},
							},
						},
					}],
				},
			},
		])
		const commentsResolver = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditLink
			&& '$$comments' in candidate.projections
			&& candidate.projections.$$comments.resolveCount == null
		))
		if (commentsResolver == null)
			throw new Error('Reddit_PublicJson spec missing RedditLink.$$comments resolver')

		await expect(commentsResolver.resolve['Fullname'].resolve({
			fullname: 't3_root',
		}, resolverContext)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: { fullname: 't1_parent' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.RedditComment, [], '$link')]: {
						[EntityMetaKey.Selector]: { fullname: 't3_root' },
					},
				},
			},
		])
	})
})

describe('Reddit_PublicJson listing continuation', () => {
	it('resolves canonical route fixtures from the public source instead of static seed data', async () => {
		vi.mocked(getSubredditAbout).mockResolvedValue({
			kind: 't5',
			data: {
				display_name: 'ethereum',
				title: 'Ethereum live',
				public_description: 'Live community metadata',
			},
		})
		vi.mocked(getInfo).mockImplementation(async (fullname) => ({
			kind: 'Listing',
			data: {
				children: fullname === 't3_1u8x2f8' ? [{
					kind: 't3',
					data: {
						name: fullname,
						title: 'Live submission title',
						author: 'live_author',
						subreddit: 'ethereum',
						permalink: '/r/ethereum/comments/1u8x2f8/live_submission/',
					},
				}] : [{
					kind: 't1',
					data: {
						name: fullname,
						body: 'Live comment body',
						author: 'live_commenter',
						link_id: 't3_1u8x2f8',
					},
				}],
			},
		}))
		const subreddit = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditSubreddit
			&& 'title' in candidate.projections
		))
		const link = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditLink
			&& 'title' in candidate.projections
		))
		const comment = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditComment
			&& 'body' in candidate.projections
		))
		if (subreddit == null || link == null || comment == null)
			throw new Error('Reddit_PublicJson spec missing live identity resolvers')

		await expect(subreddit.resolve['Name'].resolve({
			name: 'ethereum',
		}, resolverContext)).resolves.toMatchObject({
			title: 'Ethereum live',
		})
		await expect(link.resolve['Fullname'].resolve({
			fullname: 't3_1u8x2f8',
		}, resolverContext)).resolves.toMatchObject({
			title: 'Live submission title',
			author: 'live_author',
			permalink: 'https://www.reddit.com/r/ethereum/comments/1u8x2f8/live_submission/',
		})
		await expect(comment.resolve['Fullname'].resolve({
			fullname: 't1_osbo75d',
		}, resolverContext)).resolves.toMatchObject({
			body: 'Live comment body',
			author: 'live_commenter',
		})
		expect(getInfo).toHaveBeenCalledWith(
			't3_1u8x2f8'
		)
		expect(getInfo).toHaveBeenCalledWith(
			't1_osbo75d'
		)
	})

	it('materializes bounded submission cards and rejects mismatched detail subjects', async () => {
		const page = {
			kind: 'Listing' as const,
			data: {
				children: [
					{
						kind: 't3',
						data: {
							name: 't3_first',
							title: 'First title',
							author: 'alice',
							created_utc: 1_750_000_000,
							permalink: '/r/ethereum/comments/first/?utm_source=listing#comments',
							subreddit: ' Ethereum ',
						},
					},
					{ kind: 't3', data: { name: 't3_second', title: 'Second title' } },
				],
			},
		}
		const listing = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditSubreddit
			&& '$$links' in candidate.projections
		))
		const detail = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditLink
			&& 'title' in candidate.projections
		))
		if (listing == null || typeof listing.projections.$$links === 'function' || detail == null)
			throw new Error('Reddit card resolvers missing')

		expect(listing.projections.$$links.select(page, { name: 'ethereum' }, {
			...resolverContext,
			pagination: { limit: 1 },
		})).toEqual([{
			[EntityMetaKey.Selector]: { fullname: 't3_first' },
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.RedditLink, [], 'title')]: 'First title',
				[entityFieldAddressKey(EntityType.RedditLink, [], 'author')]: 'alice',
				[entityFieldAddressKey(EntityType.RedditLink, [], 'createdAt')]: 1_750_000_000_000,
				[entityFieldAddressKey(EntityType.RedditLink, [], 'permalink')]: 'https://www.reddit.com/r/ethereum/comments/first/',
				[entityFieldAddressKey(EntityType.RedditLink, [], '$subreddit')]: {
					[EntityMetaKey.Selector]: { name: 'ethereum' },
				},
			}),
		}])
		expect(listing.projections.$$links.select({
			kind: 'Listing',
			data: {
				children: [
					page.data.children[0],
					{ ...page.data.children[0], data: { ...page.data.children[0].data, title: 'Duplicate' } },
					{ kind: 't1', data: { name: 't3_wrong-kind' } },
					{ kind: 't3', data: { name: 't1_wrong-prefix' } },
					page.data.children[1],
				],
			},
		}, { name: 'ethereum' }, {
			...resolverContext,
			pagination: { limit: 2 },
		}).map((reference) => reference[EntityMetaKey.Selector].fullname)).toEqual([
			't3_first',
			't3_second',
		])
		expect(listing.projections.$$links.select(page, { name: 'ethereum' }, {
			...resolverContext,
			pagination: { limit: 0 },
		})).toEqual([])

		vi.mocked(getInfo).mockResolvedValue({
			kind: 'Listing',
			data: { children: [{ kind: 't3', data: { name: 't3_other' } }] },
		})
		await expect(detail.resolve['Fullname'].resolve({
			fullname: 't3_requested',
		}, resolverContext)).rejects.toThrow('link response does not match request')

		vi.mocked(getInfo).mockResolvedValue({
			kind: 'Listing',
			data: {
				children: [
					{ kind: 't1', data: { name: 't1_unrelated' } },
					{ kind: 't3', data: { name: 't3_requested', title: 'Requested title' } },
				],
			},
		})
		await expect(detail.resolve['Fullname'].resolve({
			fullname: 't3_requested',
		}, resolverContext)).resolves.toMatchObject({ title: 'Requested title' })

		vi.mocked(getInfo).mockResolvedValue({
			kind: 'Listing',
			data: { children: [{ kind: 't1', data: { name: 't3_requested' } }] },
		})
		await expect(detail.resolve['Fullname'].resolve({
			fullname: 't3_requested',
		}, resolverContext)).rejects.toThrow('link not found')

		vi.mocked(getInfo).mockResolvedValue({
			kind: 'Listing',
			data: {
				children: [{
					kind: 't3',
					data: {
						name: 't3_requested',
						permalink: 'https://evil.example/r/ethereum/comments/requested/',
					},
				}],
			},
		})
		await expect(detail.resolve['Fullname'].resolve({
			fullname: 't3_requested',
		}, resolverContext)).resolves.toMatchObject({
			permalink: undefined,
		})

		vi.mocked(getInfo).mockResolvedValue({
			kind: 'Listing',
			data: {
				children: [{
					kind: 't3',
					data: {
						name: 't3_requested',
						permalink: 'https://www.reddit.com/user/not-a-submission',
					},
				}],
			},
		})
		await expect(detail.resolve['Fullname'].resolve({
			fullname: 't3_requested',
		}, resolverContext)).resolves.toMatchObject({
			permalink: undefined,
		})
	})

	it('keeps the provider page and derives rows and the after token together', async () => {
		const page = {
			kind: 'Listing' as const,
			data: {
				after: 't3_next',
				children: [{
					kind: 't3',
					data: {
						name: 't3_post',
					},
				}],
			},
		}
		vi.mocked(listSubredditHot).mockResolvedValue(page)
		const resolver = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditSubreddit
			&& '$$links' in candidate.projections
		))
		if (
			resolver == null
			|| typeof resolver.projections.$$links === 'function'
			|| resolver.projections.$$links.select == null
			|| resolver.projections.$$links.continuation == null
		)
			throw new Error('Reddit_PublicJson spec missing executable RedditSubreddit continuation')

		await expect(resolver.resolve['Name'].resolve({
			name: 'ethereum',
		}, {
			...resolverContext,
			providerContinuationToken: 't3_previous',
		})).resolves.toEqual(page)
		expect(listSubredditHot).toHaveBeenCalledWith(
			'ethereum',
			64,
			't3_previous'
		)
		expect(resolver.projections.$$links.select(
			page,
			{ name: 'ethereum' },
			resolverContext
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				fullname: 't3_post',
			},
			[EntityMetaKey.Fields]: {},
		}])
		expect(resolver.projections.$$links.continuation(
			page,
			{ name: 'ethereum' },
			resolverContext
		)).toEqual({
			operation: 'subreddit-links:hot',
			target: 'reddit-public-json',
			viewerScope: 'subreddit:ethereum:hot',
			terminal: false,
			token: 't3_next',
		})
	})

	it('marks the same request partition terminal without an after token', () => {
		const resolver = redditPublicJson.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditSubreddit
			&& '$$links' in candidate.projections
		))
		if (
			resolver == null
			|| typeof resolver.projections.$$links === 'function'
			|| resolver.projections.$$links.continuation == null
		)
			throw new Error('Reddit_PublicJson spec missing executable RedditSubreddit continuation')

		expect(resolver.projections.$$links.continuation(
			{
				kind: 'Listing',
				data: {
					after: null,
					children: [],
				},
			},
			{ name: 'ethereum' },
			resolverContext
		)).toEqual({
			operation: 'subreddit-links:hot',
			target: 'reddit-public-json',
			viewerScope: 'subreddit:ethereum:hot',
			terminal: true,
		})
	})
})
