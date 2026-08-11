import { fetchFailedMessage } from '$/lib/http.ts'
import { rssItemIdentityFromParts } from '$/sources/_shared/interfaces/Rss/constants.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { normalizeRssFeedUrl } from '$/sources/_shared/interfaces/Rss/constants.ts'
import { parseRssFeedXml } from '$/sources/Rss/Rest/parseFeed.ts'
import type { ParsedRssFeed } from '$/sources/Rss/Rest/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const rssFetchFeed = async (binding: SourceBinding, feedUrl: string) => {
	const normalizedFeedUrl = normalizeRssFeedUrl(feedUrl)
	const requestedFeedUrl = new URL(normalizedFeedUrl)
	if (requestedFeedUrl.username !== '' || requestedFeedUrl.password !== '')
		throw new Error('Rss_Rest: feed URL must not contain credentials')
	if (requestedFeedUrl.origin !== binding.target.key)
		throw new Error('Rss_Rest: feed URL does not match binding')

	const response = await sourceFetch(binding, normalizedFeedUrl)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(normalizedFeedUrl, response))

	const feed = parseRssFeedXml(await response.text()) satisfies ParsedRssFeed
	const itemIds = new Set<string>()
	for (const item of feed.items) {
		const identity = rssItemIdentityFromParts(item.guid, item.link)
		if (identity == null)
			continue
		const itemId = `${identity.itemIdentityKind}:${identity.itemIdentity}`
		if (itemIds.has(itemId))
			throw new Error('Rss_Rest: feed response contains a duplicate item identity')
		itemIds.add(itemId)
	}
	return feed
}
