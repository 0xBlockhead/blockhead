import { createResolverContext } from '../../tests/resolverContext.ts'
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
	getInfo,
	listSubredditLinks,
} from '$/sources/Reddit/Rest/queries.ts'
import redditRest from '$/resolvers/Reddit-Rest.ts'

vi.mock('$/sources/Reddit/Rest/queries.ts', () => ({
	getInfo: vi.fn(),
	getLinkCommentsByArticleId: vi.fn(),
	getSubredditAbout: vi.fn(),
	listSubredditLinks: vi.fn(),
}))

const resolverContext = createResolverContext()

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
	it('preserves successive current observations without claiming history count', async () => {
		const now = vi.spyOn(Date, 'now')
		now.mockReturnValueOnce(1_750_000_000_000).mockReturnValueOnce(1_750_000_000_001)
		vi.mocked(listSubredditLinks).mockResolvedValueOnce({
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
		if (
			hubTimestamps == null
			|| !('Scope' in hubTimestamps.resolve)
		)
			throw new Error('Reddit_Rest spec missing hub timestamps resolver')

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
		expect(hubTimestamps.projections.$$timestamps).not.toHaveProperty('resolveCount')

		vi.mocked(listSubredditLinks).mockResolvedValueOnce({
			kind: 'Listing',
			data: {
				children: [{
					kind: 't3',
					data: { name: 't3_c', subreddit: 'bitcoin', title: 'C' },
				}],
			},
		})
		const second = await hubTimestamps.resolve.Scope.resolve({
			scope: '_GlobalRedditNetwork',
		}, resolverContext)
		expect(second.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$hub: { scope: '_GlobalRedditNetwork' },
				timestampMs: 1_750_000_000_001,
				source: Source.Reddit_Rest,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'observedLinkCount')]: 1,
			}),
		}])
		for (const entityType of [
			EntityType.RedditSubreddit_Timestamp,
			EntityType.RedditLink_Timestamp,
			EntityType.RedditComment_Timestamp,
			EntityType._GlobalRedditNetwork_Timestamp,
		])
			expect(redditRest.resolvers.some((candidate) => candidate.entityType === entityType)).toBe(false)
	})
})

describe('Reddit_Rest detail subject identity', () => {
	it('materializes a link from an exact info response and canonicalizes the permalink', async () => {
		vi.mocked(getInfo).mockResolvedValueOnce({
			kind: 'Listing',
			data: {
				children: [{
					kind: 't3',
					data: {
						name: 't3_abc',
						title: 'A title',
						selftext: '',
						url: 'https://example.com',
						subreddit: 'ethereum',
						permalink: '/r/ethereum/comments/abc/title/',
						score: 5,
						num_comments: 2,
						created_utc: 1_700_000,
					},
				}],
			},
		})

		const resolver = redditRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditLink
			&& 'Fullname' in candidate.resolve
		))
		if (resolver == null)
			throw new Error('Reddit_Rest spec missing link detail resolver')

		const link = await resolver.resolve.Fullname.resolve({
			fullname: 't3_abc',
		}, resolverContext)

		expect(resolver.projections.title(link)).toBe('A title')
		expect(resolver.projections.permalink(link)).toBe('https://www.reddit.com/r/ethereum/comments/abc/title/')
		expect(resolver.projections.$$comments.resolveCount(link)).toBe(2)
	})

	it('rejects empty or mismatched info children for link and comment fullnames', async () => {
		const linkResolver = redditRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditLink
			&& 'Fullname' in candidate.resolve
		))
		const commentResolver = redditRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.RedditComment
			&& !('$$replies' in candidate.projections)
		))
		if (linkResolver == null || commentResolver == null)
			throw new Error('Reddit_Rest spec missing link or comment detail resolvers')

		vi.mocked(getInfo).mockResolvedValueOnce({
			kind: 'Listing',
			data: { children: [] },
		})
		await expect(linkResolver.resolve.Fullname.resolve({
			fullname: 't3_abc',
		}, resolverContext)).rejects.toThrow('Reddit_Rest: link not found')

		vi.mocked(getInfo).mockResolvedValueOnce({
			kind: 'Listing',
			data: {
				children: [{
					kind: 't3',
					data: { name: 't3_other' },
				}],
			},
		})
		await expect(linkResolver.resolve.Fullname.resolve({
			fullname: 't3_abc',
		}, resolverContext)).rejects.toThrow('Reddit_Rest: link not found')

		vi.mocked(getInfo).mockResolvedValueOnce({
			kind: 'Listing',
			data: { children: [] },
		})
		await expect(commentResolver.resolve.Fullname.resolve({
			fullname: 't1_abc',
		}, resolverContext)).rejects.toThrow('Reddit_Rest: comment not found')

		vi.mocked(getInfo).mockResolvedValueOnce({
			kind: 'Listing',
			data: {
				children: [{
					kind: 't1',
					data: { name: 't1_other' },
				}],
			},
		})
		await expect(commentResolver.resolve.Fullname.resolve({
			fullname: 't1_abc',
		}, resolverContext)).rejects.toThrow('Reddit_Rest: comment not found')
	})
})
