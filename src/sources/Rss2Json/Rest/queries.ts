import { normalizeRssFeedUrl } from '$/sources/Rss/Rest/constants.ts'
import { rss2JsonGet } from '$/sources/Rss2Json/Rest/client.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const clampRss2JsonCount = (limit: number) => (
	Math.min(50, Math.max(1, limit))
)

export const rss2JsonGetFeed = async (
	feedUrl: string,
	limit: number,
	_publicEnv: SourcePublicEnvFor<Source.Rss2Json_Rest>,
) => {
	const params = new URLSearchParams({
		rss_url: normalizeRssFeedUrl(feedUrl),
		count: String(clampRss2JsonCount(limit)),
	})
	const response = await rss2JsonGet(`/v1/api.json?${params.toString()}`)
	if (response.status !== 'ok') {
		throw new Error(`Rss2Json_Rest: feed fetch failed for ${feedUrl}`)
	}
	return response
}
