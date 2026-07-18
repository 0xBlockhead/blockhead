import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { RedditCommentSelector } from '$/schema/RedditComment.ts'
import { RedditLinkSelector } from '$/schema/RedditLink.ts'
import { RedditSubredditSelector } from '$/schema/RedditSubreddit.ts'
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

		await expect(resolver.resolve[RedditSubredditSelector.Name].resolve({
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
			selectorName: RedditLinkSelector.Fullname,
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
			selectorName: RedditCommentSelector.Fullname,
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
					data: wireMetrics,
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
							replies: {
								kind: 'Listing',
								data: {
									children: [
										{ kind: 't1', data: { name: 't1_child' } },
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

		await expect(detailResolver.resolve[RedditCommentSelector.Fullname].resolve({
			fullname: 't1_child',
		}, resolverContext)).resolves.toMatchObject({
			$link: { [EntityMetaKey.Selector]: { fullname: 't3_root' } },
			$parentComment: { [EntityMetaKey.Selector]: { fullname: 't1_parent' } },
		})
		await expect(repliesResolver.resolve[RedditCommentSelector.Fullname].resolve({
			fullname: 't1_parent',
		}, resolverContext)).resolves.toEqual([{
			[EntityMetaKey.Selector]: { fullname: 't1_child' },
		}])
	})
})

describe('Reddit_PublicJson listing continuation', () => {
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

		await expect(resolver.resolve[RedditSubredditSelector.Name].resolve({
			name: 'ethereum',
		}, {
			...resolverContext,
			providerContinuationToken: 't3_previous',
		})).resolves.toEqual(page)
		expect(listSubredditHot).toHaveBeenCalledWith('ethereum', 64, 't3_previous')
		expect(resolver.projections.$$links.select(
			page,
			{ name: 'ethereum' },
			resolverContext
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				fullname: 't3_post',
			},
		}])
		expect(resolver.projections.$$links.continuation(
			page,
			{ name: 'ethereum' },
			resolverContext
		)).toEqual({
			operation: 'subreddit-links:hot',
			target: 'reddit-public-json',
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
			terminal: true,
		})
	})
})
