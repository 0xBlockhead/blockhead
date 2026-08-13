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
	expect(feedResolver.projections.$$items(feedSnapshot)).toEqual([{
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

it('resolves direct feed observations from successful reads', async () => {
	const timestampResolver = rss.resolvers.find(
		({ entityType }) => entityType === EntityType.RssFeed_Timestamp
	)
	if (timestampResolver == null || !('FeedTimestampMsSource' in timestampResolver.resolve))
		throw new Error('Rss_Rest feed timestamp resolver is missing')

	const snapshot = await timestampResolver.resolve.FeedTimestampMsSource.resolve({
		$feed: { feedUrl: 'https://hnrss.org/frontpage' },
		timestampMs: 1_750_000_000_000,
		source: Source.Rss_Rest,
	}, resolverContext)

	expect(timestampResolver.projections.reachable(snapshot)).toBe(true)
	expect(timestampResolver.projections.observedItemCount(snapshot)).toBe(1)
})

it('propagates provider failures from direct feed observations instead of fabricating a zero', async () => {
	const timestampResolver = rss.resolvers.find(
		({ entityType }) => entityType === EntityType.RssFeed_Timestamp
	)
	if (timestampResolver == null || !('FeedTimestampMsSource' in timestampResolver.resolve))
		throw new Error('Rss_Rest feed timestamp resolver is missing')

	getFeed.mockRejectedValueOnce(new Error('Rss_Rest: upstream unavailable'))

	await expect(timestampResolver.resolve.FeedTimestampMsSource.resolve({
		$feed: { feedUrl: 'https://hnrss.org/frontpage' },
		timestampMs: 1_750_000_000_000,
		source: Source.Rss_Rest,
	}, resolverContext)).rejects.toThrow('Rss_Rest: upstream unavailable')
})

it('resolves direct item observations from successful reads', async () => {
	const timestampResolver = rss.resolvers.find(
		({ entityType }) => entityType === EntityType.RssItem_Timestamp
	)
	if (timestampResolver == null || !('ItemTimestampMsSource' in timestampResolver.resolve))
		throw new Error('Rss_Rest item timestamp resolver is missing')

	const snapshot = await timestampResolver.resolve.ItemTimestampMsSource.resolve({
		$item: {
			$feed: { feedUrl: 'https://hnrss.org/frontpage' },
			itemIdentityKind: 'Guid',
			itemIdentity: 'item-1',
		},
		timestampMs: 1_750_000_000_000,
		source: Source.Rss_Rest,
	}, resolverContext)

	expect(timestampResolver.projections.observed(snapshot)).toBe(true)
	expect(timestampResolver.projections.reachable(snapshot)).toBe(true)
})

it('keeps absent items as a truthful negative observation', async () => {
	const timestampResolver = rss.resolvers.find(
		({ entityType }) => entityType === EntityType.RssItem_Timestamp
	)
	if (timestampResolver == null || !('ItemTimestampMsSource' in timestampResolver.resolve))
		throw new Error('Rss_Rest item timestamp resolver is missing')

	getFeed.mockResolvedValueOnce({
		items: [],
	})

	const snapshot = await timestampResolver.resolve.ItemTimestampMsSource.resolve({
		$item: {
			$feed: { feedUrl: 'https://hnrss.org/frontpage' },
			itemIdentityKind: 'Guid',
			itemIdentity: 'item-1',
		},
		timestampMs: 1_750_000_000_000,
		source: Source.Rss_Rest,
	}, resolverContext)

	expect(timestampResolver.projections.observed(snapshot)).toBe(false)
	expect(timestampResolver.projections.reachable(snapshot)).toBe(true)
})

it('propagates provider failures from direct item observations instead of fabricating a negative', async () => {
	const timestampResolver = rss.resolvers.find(
		({ entityType }) => entityType === EntityType.RssItem_Timestamp
	)
	if (timestampResolver == null || !('ItemTimestampMsSource' in timestampResolver.resolve))
		throw new Error('Rss_Rest item timestamp resolver is missing')

	getFeed.mockRejectedValueOnce(new Error('Rss_Rest: upstream unavailable'))

	await expect(timestampResolver.resolve.ItemTimestampMsSource.resolve({
		$item: {
			$feed: { feedUrl: 'https://hnrss.org/frontpage' },
			itemIdentityKind: 'Guid',
			itemIdentity: 'item-1',
		},
		timestampMs: 1_750_000_000_000,
		source: Source.Rss_Rest,
	}, resolverContext)).rejects.toThrow('Rss_Rest: upstream unavailable')
})
