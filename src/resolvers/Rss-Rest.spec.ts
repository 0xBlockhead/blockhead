import { expect, it, vi } from 'vitest'

import { EntityType } from '$/schema/EntityType.ts'

const { binding, getFeed } = vi.hoisted(() => ({
	binding: { requestOwner: 'hnrss-binding' },
	getFeed: vi.fn().mockResolvedValue({
		items: [],
	}),
}))

vi.mock('$/sources/Rss/Rest/queries.ts', () => ({
	getFeed,
	rssBindingByOrigin: new Map([
		['https://hnrss.org', binding],
	]),
}))

const { default: rss } = await import('$/resolvers/Rss-Rest.ts')

it('gives the selected feed binding ownership of the resolver request', async () => {
	const feedResolver = rss.resolvers.find(({ entityType }) => entityType === EntityType.RssFeed)
	if (feedResolver == null || !('FeedUrl' in feedResolver.resolve))
		throw new Error('Rss_Rest feed resolver is missing')

	await feedResolver.resolve.FeedUrl.resolve({
		feedUrl: 'https://hnrss.org/frontpage',
	}, {
		filters: [],
		sorts: [],
		pagination: {},
		selectorKeys: [],
		parentSelectorKeys: [],
		sources: [],
		publicEnv: {},
	})

	expect(getFeed).toHaveBeenCalledWith(binding, 'https://hnrss.org/frontpage')
})
