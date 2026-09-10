export type RssOpmlSubscription = Readonly<{
	feedUrl: string
	title?: string
}>

export type RssOpmlSubscriptionSnapshot = readonly RssOpmlSubscription[]

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&apos;',
})[character] ?? character)

export const normalizeRssSubscriptionFeedUrl = (feedUrl: string) => {
	const trimmed = feedUrl.trim()
	let url: URL

	try {
		url = new URL(trimmed)
	} catch {
		throw new TypeError(`RSS subscription URL is invalid: ${feedUrl}`)
	}

	if ((url.protocol !== 'http:' && url.protocol !== 'https:') || url.username || url.password || url.hash) {
		throw new TypeError(`RSS subscription URL is not a public HTTP(S) URL: ${feedUrl}`)
	}

	return url.href
}

export const serializeRssOpml = (snapshot: RssOpmlSubscriptionSnapshot): string => {
	const subscriptions = snapshot
		.map(({ feedUrl, title }) => ({
			feedUrl: normalizeRssSubscriptionFeedUrl(feedUrl),
			title: title?.trim() || undefined,
		}))
		.sort((left, right) => (
			left.feedUrl < right.feedUrl ? -1 : left.feedUrl > right.feedUrl ? 1 : 0
		))
		.filter((subscription, index, all) => index === 0 || subscription.feedUrl !== all[index - 1]?.feedUrl)

	const outlines = subscriptions.map(({ feedUrl, title }) => (
		`    <outline type="rss" text="${escapeXml(title ?? feedUrl)}" title="${escapeXml(title ?? feedUrl)}" xmlUrl="${escapeXml(feedUrl)}" />`
	))

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<opml version="2.0">',
		'  <head>',
		'    <title>RSS subscriptions</title>',
		'  </head>',
		'  <body>',
		...outlines,
		'  </body>',
		'</opml>',
	].join('\n') + '\n'
}
