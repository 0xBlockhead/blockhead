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
			[EntityMetaKey.Fields]: {},
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

describe('Reddit_Rest hub tip observations', () => {
	it('projects popular:hot window counts onto _GlobalRedditNetwork.$$timestamps', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
		vi.mocked(listSubredditLinks).mockResolvedValue({
			kind: 'Listing',
			data: {
				children: [
					{
						kind: 't3',
						data: {
							name: 't3_a',
							subreddit: 'ethereum',
							title: 'A',
						},
					},
					{
						kind: 't3',
						data: {
							name: 't3_b',
							subreddit: 'Ethereum',
							title: 'B',
						},
					},
				],
			},
		})
		const hubTimestamps = redditRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType._GlobalRedditNetwork
			&& '$$timestamps' in candidate.projections
		))
		const hubTimestampSingular = redditRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType._GlobalRedditNetwork_Timestamp
		))
		if (
			hubTimestamps == null
			|| hubTimestampSingular == null
			|| !('Scope' in hubTimestamps.resolve)
			|| !('HubTimestampMsSource' in hubTimestampSingular.resolve)
		)
			throw new Error('Reddit_Rest spec missing hub timestamp resolvers')

		const hub = await hubTimestamps.resolve.Scope.resolve({
			scope: '_GlobalRedditNetwork',
		}, resolverContext)
		expect(hub.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$hub: { scope: '_GlobalRedditNetwork' },
				timestampMs: 1_750_000_000_000,
				source: Source.Reddit_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'source')]: Source.Reddit_Rest,
				[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'observedSubredditCount')]: 1,
				[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'observedLinkCount')]: 2,
				[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'reachable')]: true,
				[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'listingWindowKind')]: 'popular:hot',
			},
		}])

		await expect(hubTimestampSingular.resolve.HubTimestampMsSource.resolve({
			$hub: { scope: '_GlobalRedditNetwork' },
			timestampMs: 1_750_000_000_000,
			source: Source.Reddit_Rest,
		}, resolverContext)).resolves.toEqual({
			$hub: { scope: '_GlobalRedditNetwork' },
			timestampMs: 1_750_000_000_000,
			source: Source.Reddit_Rest,
			observedSubredditCount: 1,
			observedLinkCount: 2,
			reachable: true,
			listingWindowKind: 'popular:hot',
		})
	})
})
