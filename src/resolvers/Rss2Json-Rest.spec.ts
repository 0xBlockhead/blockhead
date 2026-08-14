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
const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const feedResolver = () => {
	const resolver = rss2Json.resolvers.find(({ entityType }) => entityType === EntityType.RssFeed)
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
	getFeed.mockRejectedValueOnce(new Error('Rss2Json_Rest: upstream unavailable'))
	await expect(feedResolver().resolve.FeedUrl.resolve({ feedUrl: 'https://example.com/feed.xml' }, resolverContext)).rejects.toThrow('Rss2Json_Rest: upstream unavailable')
})
