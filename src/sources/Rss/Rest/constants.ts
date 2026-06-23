import { rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'

export const rssFeedOrigins = [
	...new Set(
		rssNetworkSeedFeeds.map((feed) => (
			new URL(feed.feedUrl).origin
		))
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
	title: string | undefined
) => (
	guid?.trim()
	|| link?.trim()
	|| title?.trim()
	|| 'unknown'
)

export const rssPublishedAtMs = (value: string | undefined) => {
	const trimmed = value?.trim()
	return (
		trimmed ?
			Number.isFinite(Date.parse(trimmed)) ?
				Date.parse(trimmed)
			:
				undefined
		:
			undefined
	)
}
