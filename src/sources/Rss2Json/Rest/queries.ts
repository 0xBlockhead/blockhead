import { normalizeRssFeedUrl } from '$/sources/_shared/interfaces/Rss/constants.ts'
import { rss2JsonGet } from '$/sources/Rss2Json/Rest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const getFeed = async (binding: SourceBinding, feedUrl: string) => {
	const params = new URLSearchParams({
		rss_url: normalizeRssFeedUrl(feedUrl),
	})
	const response = await rss2JsonGet(binding, `/v1/api.json?${params.toString()}`)
	if (response.status !== 'ok') {
		throw new Error(`Rss2Json_Rest: feed fetch failed for ${feedUrl}`)
	}
	return response
}
