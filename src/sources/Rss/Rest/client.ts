import { fetchFailedMessage } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { normalizeRssFeedUrl } from '$/sources/Rss/Rest/constants.ts'
import { parseRssFeedXml } from '$/sources/Rss/Rest/parseFeed.ts'
import type { ParsedRssFeed } from '$/sources/Rss/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Rss/bindings.ts'

const rssBindingByOrigin = new Map(
	bindings[Source.Rss_Rest].map((binding) => [
		binding.target.key,
		binding,
	] as const)
)

export const rssFetchFeed = async (feedUrl: string) => {
	const normalizedFeedUrl = normalizeRssFeedUrl(feedUrl)
	const binding = rssBindingByOrigin.get(new URL(normalizedFeedUrl).origin)
	if (binding == null)
		throw new Error(`Rss_Rest: source binding is missing for ${feedUrl}`)

	const response = await sourceFetch(binding, normalizedFeedUrl)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(normalizedFeedUrl, response))

	return parseRssFeedXml(await response.text()) satisfies ParsedRssFeed
}
