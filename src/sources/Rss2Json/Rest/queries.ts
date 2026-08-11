import { normalizeRssFeedUrl } from '$/sources/_shared/interfaces/Rss/constants.ts'
import bindings from '$/sources/Rss2Json/bindings.ts'
import { rss2JsonGet } from '$/sources/Rss2Json/Rest/client.ts'
import { Source } from '$/sources/Source.ts'
import { rss2JsonResponseWire } from '$/sources/Rss2Json/Rest/types.ts'

const binding = bindings[Source.Rss2Json_Rest][0]

export const getFeed = async (feedUrl: string) => {
	const params = new URLSearchParams({
		rss_url: normalizeRssFeedUrl(feedUrl),
	})
	let response
	try {
		response = rss2JsonResponseWire.assert(
			await rss2JsonGet(binding, `/v1/api.json?${params.toString()}`)
		)
	} catch {
		throw new Error('Rss2Json_Rest: invalid feed response envelope')
	}
	if (response.status !== 'ok') {
		throw new Error(`Rss2Json_Rest: feed fetch failed for ${feedUrl}`)
	}
	return response
}
