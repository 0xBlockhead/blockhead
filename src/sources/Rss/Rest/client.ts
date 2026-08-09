import { fetchFailedMessage } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { normalizeRssFeedUrl } from '$/sources/_shared/interfaces/Rss/constants.ts'
import { parseRssFeedXml } from '$/sources/Rss/Rest/parseFeed.ts'
import type { ParsedRssFeed } from '$/sources/Rss/Rest/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const rssFetchFeed = async (binding: SourceBinding, feedUrl: string) => {
	const normalizedFeedUrl = normalizeRssFeedUrl(feedUrl)
	if (new URL(normalizedFeedUrl).origin !== binding.target.key)
		throw new Error('Rss_Rest: feed URL does not match binding')

	const response = await sourceFetch(binding, normalizedFeedUrl)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(normalizedFeedUrl, response))

	return parseRssFeedXml(await response.text()) satisfies ParsedRssFeed
}
