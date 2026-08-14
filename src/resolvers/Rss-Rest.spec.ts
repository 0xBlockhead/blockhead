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

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

it('gives the selected feed binding ownership of the resolver request', async () => {
	const feedResolver = rss.resolvers.find(({ entityType }) => entityType === EntityType.RssFeed)
	if (feedResolver == null || !('FeedUrl' in feedResolver.resolve))
		throw new Error('Rss_Rest feed resolver is missing')

	await feedResolver.resolve.FeedUrl.resolve({
		feedUrl: 'https://hnrss.org/frontpage',
	}, resolverContext)

	expect(getFeed).toHaveBeenCalledWith(binding, 'https://hnrss.org/frontpage')
})

it('materializes source-owned feed and item observations from successful reads', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
	const feedResolver = rss.resolvers.find(({ entityType }) => entityType === EntityType.RssFeed)
	const itemResolver = rss.resolvers.find(({ entityType }) => entityType === EntityType.RssItem)
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
	}, resolverContext)

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
	const feedResolver = rss.resolvers.find(({ entityType }) => entityType === EntityType.RssFeed)
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
	expect(rss.resolvers.some(({ entityType }) => (
		entityType === EntityType.RssFeed_Timestamp
		|| entityType === EntityType.RssItem_Timestamp
	))).toBe(false)
})
