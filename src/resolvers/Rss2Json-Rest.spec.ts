import { createResolverContext } from '../../tests/resolverContext.ts'
import { expect, it, vi } from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const { getFeed } = vi.hoisted(() => ({
	getFeed: vi.fn(),
}))

vi.mock('$/sources/Rss2Json/Rest/queries.ts', () => ({ getFeed }))

const { default: rss2Json } = await import('$/resolvers/Rss2Json-Rest.ts')
const resolverContext = createResolverContext()

it.each([
	{ label: 'empty feed', count: 0, items: [] },
	{ label: 'identity-less item', count: 0, items: [{ title: 'No identity' }] },
	{ label: 'limited addressable items', count: 3, items: [{ guid: '1' }, { guid: '2' }, { guid: '3' }, { title: 'No identity' }] },
])('counts the returned snapshot: $label', async ({ count, items }) => {
	getFeed.mockResolvedValueOnce({ status: 'ok', feed: { url: 'https://hnrss.org/frontpage' }, items })
	const resolver = feedResolver()
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
const feedResolver = () => {
	const resolver = rss2Json.resolvers.find((resolver) => resolver.entityType === EntityType.RssFeed)
	if (resolver == null || !('FeedUrl' in resolver.resolve))
		throw new Error('Rss2Json_Rest feed resolver is missing')
	return resolver
}

it('materializes source-owned feed and item observations from a healthy envelope', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
	getFeed.mockResolvedValueOnce({
		status: 'ok',
		feed: {
			url: 'https://example.com/feed.xml',
			title: 'Example Feed',
			link: 'https://example.com',
			description: 'Example feed description',
			image: 'https://example.com/banner.png',
		},
		items: [{
			title: 'Item one',
			pubDate: 'Tue, 01 Jan 2026 00:00:00 GMT',
			link: 'https://example.com/item-1',
			guid: 'item-1',
			description: 'Item one summary',
			content: '<p>Item one full text</p>',
			author: 'Alice',
			categories: ['news', 'tech'],
			enclosure: [{ url: 'https://example.com/audio.mp3', type: 'audio/mpeg', length: '1234' }],
		}],
	})

	const resolver = feedResolver()
	const snapshot = await resolver.resolve.FeedUrl.resolve({ feedUrl: 'https://example.com/feed.xml' }, resolverContext)
	expect(resolver.projections.title(snapshot)).toBe('Example Feed')
	expect(resolver.projections.siteUrl(snapshot)).toBe('https://example.com/')
	expect(resolver.projections.$image(snapshot)).toMatchObject({
		[EntityMetaKey.Selector]: {
			url: 'https://example.com/banner.png',
		},
	})
	expect(resolver.projections.$$timestamps(snapshot)).toEqual([{
		[EntityMetaKey.Selector]: {
			$feed: { feedUrl: 'https://example.com/feed.xml' },
			timestampMs: 1_750_000_000_000,
			source: Source.Rss2Json_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'reachable')]: true,
			[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'observedItemCount')]: 1,
		},
	}])
	expect(resolver.projections.$$items.resolveCount(snapshot)).toBe(1)
	expect(resolver.projections.$$items.select(snapshot)[0]).toMatchObject({
		[EntityMetaKey.Selector]: {
			itemIdentityKind: 'Guid',
			itemIdentity: 'item-1',
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.RssItem, [], 'content')]: '<p>Item one full text</p>',
			[entityFieldAddressKey(EntityType.RssItem, [], 'categories')]: ['news', 'tech'],
		},
	})
})

it('keeps a valid empty feed distinguishable as an empty observation', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
	getFeed.mockResolvedValueOnce({ status: 'ok', feed: { url: 'https://example.com/feed.xml', title: 'Empty Feed' }, items: [] })
	const resolver = feedResolver()
	const snapshot = await resolver.resolve.FeedUrl.resolve({ feedUrl: 'https://example.com/feed.xml' }, resolverContext)
	expect(resolver.projections.$$items.resolveCount(snapshot)).toBe(0)
	expect(resolver.projections.$$items.select(snapshot)).toEqual([])
	expect(resolver.projections.$$timestamps(snapshot)[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'observedItemCount')]: 0,
	})
})

it('withholds unsafe visible URLs from mapped metadata', async () => {
	getFeed.mockResolvedValueOnce({
		status: 'ok',
		feed: { url: 'https://example.com/feed.xml', title: 'Credentialed Feed', link: 'https://user:pass@example.com', image: 'ftp://example.com/banner.png' },
		items: [{ title: 'Unsafe item', guid: 'unsafe-1', link: 'javascript:alert(1)', enclosure: [{ url: 'ftp://example.com/file.mp3' }] }],
	})
	const resolver = feedResolver()
	const snapshot = await resolver.resolve.FeedUrl.resolve({ feedUrl: 'https://example.com/feed.xml' }, resolverContext)
	expect(resolver.projections.siteUrl(snapshot)).toBeUndefined()
	expect(resolver.projections.imageUrl(snapshot)).toBeUndefined()
	expect(resolver.projections.$$items.select(snapshot)[0][EntityMetaKey.Fields]).not.toHaveProperty(entityFieldAddressKey(EntityType.RssItem, [], 'link'))
	expect(resolver.projections.$$items.select(snapshot)[0][EntityMetaKey.Fields]).not.toHaveProperty(entityFieldAddressKey(EntityType.RssItem, [], 'enclosureUrl'))
})

it('propagates provider failures instead of materializing a ready-empty feed', async () => {
	const failure = new Error('Rss2Json_Rest: upstream unavailable')
	getFeed.mockRejectedValueOnce(failure)
	const resolver = feedResolver()
	const snapshot = await resolver.resolve.FeedUrl.resolve({ feedUrl: 'https://example.com/feed.xml' }, resolverContext)
	for (const project of [resolver.projections.title, resolver.projections.$$items.select, resolver.projections.$$items.resolveCount]) {
		try {
			project(snapshot)
			throw new Error('projection did not fail')
		} catch (error) {
			expect(error).toBe(failure)
		}
	}
	expect(resolver.projections.$$timestamps(snapshot)[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'reachable')]: false,
		[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'error')]: failure.message,
	})
})

it('preserves the original item error alongside its failed observation', async () => {
	const failure = new Error('item read unavailable')
	getFeed.mockRejectedValueOnce(failure)
	const resolver = rss2Json.resolvers.find((resolver) => resolver.entityType === EntityType.RssItem)
	if (resolver == null || !('FeedIdentity' in resolver.resolve))
		throw new Error('missing item resolver')
	const snapshot = await resolver.resolve.FeedIdentity.resolve({
		$feed: { feedUrl: 'https://example.com/feed.xml' },
		itemIdentityKind: 'Guid',
		itemIdentity: 'item-1',
	})
	try {
		resolver.projections.title(snapshot)
		throw new Error('projection did not fail')
	} catch (error) {
		expect(error).toBe(failure)
	}
	expect(resolver.projections.$$timestamps(snapshot)[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'reachable')]: false,
		[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'error')]: failure.message,
	})
})
