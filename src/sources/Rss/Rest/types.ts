export type ParsedRssFeedItemWire = {
	guid: string
	title?: string
	link?: string
	description?: string
	content?: string
	author?: string
	publishedAt?: number
}

export type ParsedRssFeedWire = {
	title?: string
	description?: string
	link?: string
	siteUrl?: string
	language?: string
	lastBuildDate?: number
	items: ParsedRssFeedItemWire[]
}
