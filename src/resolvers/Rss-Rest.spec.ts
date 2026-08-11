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
})
