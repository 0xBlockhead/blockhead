import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

import { rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'

export const rssFeedOrigins: readonly SourceOrigin[] = [
	...new Set(
		rssNetworkSeedFeeds.map((feed) => (
			new URL(feed.feedUrl).origin
		)),
	),
].map((origin) => ({
	origin,
	corsEnabled: false,
}))

export const normalizeRssFeedUrl = (feedUrl: string) => (
	new URL(feedUrl.trim()).href
)

export const rssItemGuidFromParts = (
	guid: string | undefined,
	link: string | undefined,
	title: string | undefined,
) => (
	guid?.trim()
	|| link?.trim()
	|| title?.trim()
	|| 'unknown'
)

export const rssPublishedAtMs = (value: string | undefined) => (
	value?.trim() ?
		(
			Number.isFinite(Date.parse(value)) ?
				Date.parse(value)
			:
				undefined
		)
	:
		undefined
)
