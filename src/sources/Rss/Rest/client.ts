import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { normalizeRssFeedUrl } from '$/sources/Rss/Rest/constants.ts'
import { parseRssFeedXml } from '$/sources/Rss/Rest/parseFeed.ts'
import type { ParsedRssFeed } from '$/sources/Rss/Rest/types.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import { fetchFailedMessage } from '$/lib/http.ts'

export const rssFetchFeed = async (feedUrl: string) => {
	const normalizedFeedUrl = normalizeRssFeedUrl(feedUrl)
	const binding = sourceProviderDefinitions
		.flatMap((provider) => provider.bindings)
		.find((candidate) => (
			candidate.source === Source.Rss_Rest
			&& candidate.target.key === new URL(normalizedFeedUrl).origin
		))
	if (binding == null)
		throw new Error(`Rss_Rest: source binding is missing for ${new URL(normalizedFeedUrl).origin}`)

	const response = await sourceFetch(binding, normalizedFeedUrl)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(normalizedFeedUrl, response))

	return parseRssFeedXml(await response.text()) satisfies ParsedRssFeed
}
