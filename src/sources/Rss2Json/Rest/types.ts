import {
	type as arktype,
	type Type,
} from 'arktype'

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


const rss2JsonFeedWire = arktype({
	'title?': 'string',
	'link?': 'string',
	'description?': 'string',
	'url?': 'string',
	'author?': 'string',
	'image?': 'string',
}) satisfies Type<Rss2JsonFeed>

const rss2JsonItemWire = arktype({
	'title?': 'string',
	'pubDate?': 'string',
	'link?': 'string',
	'guid?': 'string',
	'description?': 'string',
	'content?': 'string',
	'author?': 'string',
	'thumbnail?': 'string',
	'categories?': 'string[]',
	'enclosure?': arktype({
		'url?': 'string',
		'type?': 'string',
		'length?': 'string',
	}).array(),
}) satisfies Type<Rss2JsonItem>

export const rss2JsonResponseWire = arktype({
	status: 'string',
	'feed?': rss2JsonFeedWire,
	'items?': rss2JsonItemWire.array(),
}) satisfies Type<Rss2JsonResponse>
