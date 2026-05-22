export type Rss2JsonFeedWire = {
	title?: string
	link?: string
	description?: string
	url?: string
	author?: string
	image?: string
}

export type Rss2JsonItemWire = {
	title?: string
	pubDate?: string
	link?: string
	guid?: string
	description?: string
	content?: string
	author?: string
	thumbnail?: string
}

export type Rss2JsonResponseWire = {
	status: string
	feed?: Rss2JsonFeedWire
	items?: Rss2JsonItemWire[]
}
