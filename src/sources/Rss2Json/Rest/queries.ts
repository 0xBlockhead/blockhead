import { normalizeRssFeedUrl } from '$/sources/_shared/interfaces/Rss/constants.ts'
import bindings from '$/sources/Rss2Json/bindings.ts'
import { rss2JsonGet } from '$/sources/Rss2Json/Rest/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Rss2Json_Rest][0]

export const getFeed = async (feedUrl: string) => {
	const params = new URLSearchParams({
		rss_url: normalizeRssFeedUrl(feedUrl),
	})
	const response = await rss2JsonGet(binding, `/v1/api.json?${params.toString()}`)
	if (response.status !== 'ok') {
		throw new Error(`Rss2Json_Rest: feed fetch failed for ${feedUrl}`)
	}
	return response
}
