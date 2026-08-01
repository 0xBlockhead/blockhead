import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	listSubredditLinks,
} from '$/sources/Reddit/Rest/queries.ts'
import redditRest from '$/resolvers/Reddit-Rest.ts'

vi.mock('$/sources/Reddit/Rest/queries.ts', () => ({
	getInfo: vi.fn(),
	getLinkCommentsByArticleId: vi.fn(),
	getSubredditAbout: vi.fn(),
	listSubredditLinks: vi.fn(),
}))

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_REDDIT_CLIENT_ID: 'client',
		PUBLIC_REDDIT_CLIENT_SECRET: 'secret',
	},
}

describe('Reddit_Rest listing continuation', () => {
	it('uses the canonical subreddit owner for popular discovery', async () => {
		vi.mocked(listSubredditLinks).mockResolvedValue({
			kind: 'Listing',
			data: {
				children: [],
			},
		})
		const resolver = redditRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType._GlobalRedditNetwork
			&& '$$observedLinks' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Reddit_Rest spec missing global discovery resolver')

		await resolver.resolve['Scope'].resolve({}, resolverContext)
		expect(listSubredditLinks).toHaveBeenCalledWith(
			resolverContext.publicEnv,
			'popular',
			64,
			undefined,
			'hot'
		)
	})

	it('keeps rows and opaque after metadata in the same source, parent, sort, and request partition', async () => {
		const page = {
			kind: 'Listing' as const,
			data: {
				after: 't3_next+/=',
				children: [{
					kind: 't3',
					data: {
						name: 't3_post',
					},
				}],
			},
		}
		vi.mocked(listSubredditLinks).mockResolvedValue(page)
		const resolver = redditRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditSubreddit
			&& '$$links' in candidate.projections
		))
		if (
			resolver == null
			|| typeof resolver.projections.$$links === 'function'
			|| resolver.projections.$$links.select == null
			|| resolver.projections.$$links.continuation == null
		)
			throw new Error('Reddit_Rest spec missing executable RedditSubreddit continuation')

		await expect(resolver.resolve['Name'].resolve({
			name: 'ethereum',
		}, {
			...resolverContext,
			providerContinuationToken: 't3_previous+/=',
		})).resolves.toEqual(page)
		expect(listSubredditLinks).toHaveBeenCalledWith(
			resolverContext.publicEnv,
			'ethereum',
			64,
			't3_previous+/=',
			'hot'
		)
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
			target: 'oauth-api',
			terminal: false,
			token: 't3_next+/=',
		})
	})

	it('marks the OAuth hot-listing request terminal without an after token', () => {
		const resolver = redditRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditSubreddit
			&& '$$links' in candidate.projections
		))
		if (
			resolver == null
			|| typeof resolver.projections.$$links === 'function'
			|| resolver.projections.$$links.continuation == null
		)
			throw new Error('Reddit_Rest spec missing executable RedditSubreddit continuation')

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
			target: 'oauth-api',
			terminal: true,
		})
	})
})
