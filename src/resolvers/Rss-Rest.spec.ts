import { createResolverContext } from '../../tests/resolverContext.ts'
import { expect, it, vi } from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const { binding, getFeed } = vi.hoisted(() => ({
	binding: { requestOwner: 'hnrss-binding' },
	getFeed: vi.fn().mockResolvedValue({
		imageUrl: 'https://example.com/feed.png',
		items: [{
			guid: 'item-1',
			title: 'Item one',
		}],
	}),
}))

vi.mock('$/sources/Rss/Rest/queries.ts', () => ({
	getFeed,
	rssBindingByOrigin: new Map([
		['https://hnrss.org', binding],
	]),
}))

const { default: rss } = await import('$/resolvers/Rss-Rest.ts')

const resolverContext = createResolverContext()

it.each([
	{ label: 'empty feed', count: 0, items: [] },
	{ label: 'identity-less item', count: 0, items: [{ title: 'No identity' }] },
	{ label: 'limited addressable items', count: 3, items: [{ guid: '1' }, { guid: '2' }, { guid: '3' }, { title: 'No identity' }] },
])('counts the returned snapshot: $label', async ({ count, items }) => {
	getFeed.mockResolvedValueOnce({ items })
	const resolver = rss.resolvers.find((resolver) => resolver.entityType === EntityType.RssFeed)
	if (resolver == null || !('FeedUrl' in resolver.resolve))
		throw new Error('missing feed resolver')
	const snapshot = await resolver.resolve.FeedUrl.resolve({ feedUrl: 'https://hnrss.org/frontpage' }, {
		...resolverContext,
		pagination: { limit: 1 },
	})
	expect(resolver.projections.$$items.select(snapshot)).toHaveLength(Math.min(count, 1))
	expect(resolver.projections.$$items.resolveCount(snapshot)).toBe(count)
	expect(resolver.projections.$$timestamps(snapshot)[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'reachable')]: true,
		[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'observedItemCount')]: items.length,
	})
})

it('gives the selected feed binding ownership of the resolver request', async () => {
	const feedResolver = rss.resolvers.find((resolver) => resolver.entityType === EntityType.RssFeed)
	if (feedResolver == null || !('FeedUrl' in feedResolver.resolve))
		throw new Error('Rss_Rest feed resolver is missing')

	await feedResolver.resolve.FeedUrl.resolve({
		feedUrl: 'https://hnrss.org/frontpage',
	}, resolverContext)

	expect(getFeed).toHaveBeenCalledWith(binding, 'https://hnrss.org/frontpage')
})

it('materializes source-owned feed and item observations from successful reads', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
	const feedResolver = rss.resolvers.find((resolver) => resolver.entityType === EntityType.RssFeed)
	const itemResolver = rss.resolvers.find((resolver) => resolver.entityType === EntityType.RssItem)
	if (
		feedResolver == null
		|| !('FeedUrl' in feedResolver.resolve)
		|| itemResolver == null
		|| !('FeedIdentity' in itemResolver.resolve)
	) throw new Error('Rss_Rest parent resolvers are missing')

	const feedSnapshot = await feedResolver.resolve.FeedUrl.resolve({
		feedUrl: 'https://hnrss.org/frontpage',
	}, resolverContext)
	const itemSnapshot = await itemResolver.resolve.FeedIdentity.resolve({
		$feed: { feedUrl: 'https://hnrss.org/frontpage' },
		itemIdentityKind: 'Guid',
		itemIdentity: 'item-1',
	})

	expect(feedResolver.projections.$$timestamps(feedSnapshot)).toEqual([{
		[EntityMetaKey.Selector]: {
			$feed: { feedUrl: 'https://hnrss.org/frontpage' },
			timestampMs: 1_750_000_000_000,
			source: Source.Rss_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'reachable')]: true,
			[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'observedItemCount')]: 1,
		},
	}])
	expect(feedResolver.projections.$image(feedSnapshot)).toMatchObject({
		[EntityMetaKey.Selector]: {
			url: 'https://example.com/feed.png',
		},
	})
	expect(itemResolver.projections.$$timestamps(itemSnapshot)).toEqual([{
		[EntityMetaKey.Selector]: {
			$item: {
				$feed: { feedUrl: 'https://hnrss.org/frontpage' },
				itemIdentityKind: 'Guid',
				itemIdentity: 'item-1',
			},
			timestampMs: 1_750_000_000_000,
			source: Source.Rss_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'observed')]: true,
			[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'reachable')]: true,
		},
	}])
	expect(feedResolver.projections.$$items.resolveCount(feedSnapshot)).toBe(1)
	expect(feedResolver.projections.$$items.select(feedSnapshot)).toEqual([{
		[EntityMetaKey.Selector]: {
			$feed: { feedUrl: 'https://hnrss.org/frontpage' },
			itemIdentityKind: 'Guid',
			itemIdentity: 'item-1',
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.RssItem, [], 'title')]: 'Item one',
			[entityFieldAddressKey(EntityType.RssItem, [], '$feed')]: {
				[EntityMetaKey.Selector]: {
					feedUrl: 'https://hnrss.org/frontpage',
				},
			},
			[entityFieldAddressKey(EntityType.RssItem, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$item: {
						$feed: { feedUrl: 'https://hnrss.org/frontpage' },
						itemIdentityKind: 'Guid',
						itemIdentity: 'item-1',
					},
					timestampMs: 1_750_000_000_000,
					source: Source.Rss_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'observed')]: true,
					[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'reachable')]: true,
				},
			}],
		},
	}])
})

it('rejects duplicate native item identities instead of materializing colliding rows', async () => {
	const feedResolver = rss.resolvers.find((resolver) => resolver.entityType === EntityType.RssFeed)
	if (feedResolver == null || !('FeedUrl' in feedResolver.resolve))
		throw new Error('Rss_Rest feed resolver is missing')

	getFeed.mockResolvedValueOnce({
		items: [{
			guid: 'item-1',
		}, {
			guid: 'item-1',
		}],
	})

	await expect(feedResolver.resolve.FeedUrl.resolve({
		feedUrl: 'https://hnrss.org/frontpage',
	}, resolverContext)).rejects.toThrow('duplicate feed item identity Guid:item-1')
})

it('does not replay the current feed read at an arbitrary observation timestamp', () => {
	for (const observationType of [EntityType.RssFeed_Timestamp, EntityType.RssItem_Timestamp])
		expect(rss.resolvers.map(({ entityType }) => entityType)).not.toContain(observationType)
})

it('preserves unreachable feed evidence when the source read fails', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_001)
	const failure = new Error('feed unavailable')
	getFeed.mockRejectedValueOnce(failure)
	const feedResolver = rss.resolvers.find((resolver) => resolver.entityType === EntityType.RssFeed)
	if (feedResolver == null || !('FeedUrl' in feedResolver.resolve))
		throw new Error('Rss_Rest feed resolver is missing')

	const snapshot = await feedResolver.resolve.FeedUrl.resolve({
		feedUrl: 'https://hnrss.org/frontpage',
	}, resolverContext)

	for (const project of [feedResolver.projections.title, feedResolver.projections.$$items.select, feedResolver.projections.$$items.resolveCount]) {
		try {
			project(snapshot)
			throw new Error('projection did not fail')
		} catch (error) {
			expect(error).toBe(failure)
		}
	}
	expect(feedResolver.projections.$$timestamps(snapshot)).toEqual([expect.objectContaining({
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'reachable')]: false,
			[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'error')]: 'feed unavailable',
		},
	})])
})

it('preserves unreachable item evidence when the source read fails', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_002)
	const failure = new Error('item read unavailable')
	getFeed.mockRejectedValueOnce(failure)
	const itemResolver = rss.resolvers.find((resolver) => resolver.entityType === EntityType.RssItem)
	if (itemResolver == null || !('FeedIdentity' in itemResolver.resolve))
		throw new Error('Rss_Rest item resolver is missing')

	const snapshot = await itemResolver.resolve.FeedIdentity.resolve({
		$feed: { feedUrl: 'https://hnrss.org/frontpage' },
		itemIdentityKind: 'Guid',
		itemIdentity: 'item-1',
	})

	try {
		itemResolver.projections.title(snapshot)
		throw new Error('projection did not fail')
	} catch (error) {
		expect(error).toBe(failure)
	}
	expect(itemResolver.projections.itemIdentityKind(snapshot)).toBe('Guid')
	expect(itemResolver.projections.itemIdentity(snapshot)).toBe('item-1')
	expect(itemResolver.projections.$feed(snapshot)).toEqual({
		[EntityMetaKey.Selector]: { feedUrl: 'https://hnrss.org/frontpage' },
	})
	expect(itemResolver.projections.$$timestamps(snapshot)).toEqual([expect.objectContaining({
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'reachable')]: false,
			[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'error')]: 'item read unavailable',
		},
	})])
})
