import { normalizeRssFeedUrl } from '$/sources/Rss/Rest/constants.ts'
import { rss2JsonGet } from '$/sources/Rss2Json/Rest/client.ts'

export const getFeed = async (
	feedUrl: string,
	limit: number
) => {
	const params = new URLSearchParams({
		rss_url: normalizeRssFeedUrl(feedUrl),
	})
	const response = await rss2JsonGet(`/v1/api.json?${params.toString()}`)
	if (response.status !== 'ok') {
		throw new Error(`Rss2Json_Rest: feed fetch failed for ${feedUrl}`)
	}
	return {
		...response,
		items: response.items?.slice(0, limit),
	}
}
