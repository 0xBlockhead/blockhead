export type Rss2JsonFeed = {
	title?: string
	link?: string
	description?: string
	url?: string
	author?: string
	image?: string
}

export type Rss2JsonItem = {
	title?: string
	pubDate?: string
	link?: string
	guid?: string
	description?: string
	content?: string
	author?: string
	thumbnail?: string
	categories?: string[]
	enclosure?: readonly {
		url?: string
		type?: string
		length?: string
	}[]
}

export type Rss2JsonResponse = {
	status: string
	feed?: Rss2JsonFeed
	items?: Rss2JsonItem[]
}
