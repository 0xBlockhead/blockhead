export type ParsedRssFeedItem = {
	guid?: string
	title?: string
	link?: string
	description?: string
	content?: string
	author?: string
	publishedAt?: number
	updatedAt?: number
	categories?: string[]
	enclosureUrl?: string
	commentsUrl?: string
}

export type ParsedRssFeed = {
	title?: string
	description?: string
	siteUrl?: string
	language?: string
	lastBuildDate?: number
	imageUrl?: string
	items: ParsedRssFeedItem[]
}
