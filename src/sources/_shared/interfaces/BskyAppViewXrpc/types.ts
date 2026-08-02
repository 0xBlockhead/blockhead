/**
 * Bsky public appview JSON (subset; wire only).
 * @see https://docs.bsky.app/docs/api/app-bsky-actor-get-profile
 * @see https://docs.bsky.app/docs/api/app-bsky-feed-get-posts
 */
import type { JsonValue } from '$/typescript/JsonValue.ts'

export type BskyAppViewProfile = {
	did: string
	handle: string
	displayName?: string
	description?: string
	avatar?: string
	banner?: string
	followersCount?: number
	followsCount?: number
	postsCount?: number
	indexedAt?: string
}

export type AtprotoIdentityResolveHandleResponse = {
	did: string
}

export type BskyAppViewPostRecord = {
	$type?: string
	text: string
	createdAt: string
	langs?: string[]
	labels?: {
		values?: {
			val?: string
		}[]
	}
	reply?: {
		parent?: { uri?: string, cid?: string }
		root?: { uri?: string, cid?: string }
	}
}

export type BskyAppViewAspectRatio = {
	width: number
	height: number
}

export type BskyAppViewImagesEmbed = {
	$type: 'app.bsky.embed.images#view'
	images: {
		thumb: string
		fullsize: string
		alt: string
		aspectRatio?: BskyAppViewAspectRatio
	}[]
}

export type BskyAppViewVideoEmbed = {
	$type: 'app.bsky.embed.video#view'
	cid: string
	playlist: string
	thumbnail?: string
	alt?: string
	aspectRatio?: BskyAppViewAspectRatio
	presentation?: string
}

export type BskyAppViewExternalEmbed = {
	$type: 'app.bsky.embed.external#view'
	external: {
		uri: string
		title: string
		description: string
		thumb?: string
		createdAt?: string
		updatedAt?: string
		readingTime?: number
		labels?: JsonValue[]
		source?: {
			uri: string
			icon?: string
			title: string
			description?: string
			theme?: {
				backgroundRGB?: { r: number, g: number, b: number }
				foregroundRGB?: { r: number, g: number, b: number }
				accentRGB?: { r: number, g: number, b: number }
				accentForegroundRGB?: { r: number, g: number, b: number }
			}
		}
		associatedRefs?: {
			uri: string
			cid: string
		}[]
		associatedProfiles?: {
			did: string
			handle: string
			displayName?: string
			pronouns?: string
			avatar?: string
			associated?: JsonValue
			viewer?: JsonValue
			labels?: JsonValue[]
			createdAt?: string
			verification?: JsonValue
			status?: JsonValue
			debug?: JsonValue
		}[]
	}
}

export type BskyAppViewRecordFound = {
	$type: 'app.bsky.embed.record#viewRecord'
	uri: string
	cid: string
	author: {
		did: string
		handle: string
		displayName?: string
		pronouns?: string
		avatar?: string
		associated?: JsonValue
		viewer?: JsonValue
		labels?: JsonValue[]
		createdAt?: string
		verification?: JsonValue
		status?: JsonValue
		debug?: JsonValue
	}
	value: JsonValue
	labels?: JsonValue[]
	indexedAt: string
	replyCount?: number
	repostCount?: number
	likeCount?: number
	quoteCount?: number
	embeds?: BskyAppViewPostEmbed[]
}

export type BskyAppViewRecordNotFound = {
	$type: 'app.bsky.embed.record#viewNotFound'
	uri: string
	notFound: true
}

export type BskyAppViewRecordBlocked = {
	$type: 'app.bsky.embed.record#viewBlocked'
	uri: string
	blocked: true
	author: {
		did: string
	}
}

export type BskyAppViewRecordDetached = {
	$type: 'app.bsky.embed.record#viewDetached'
	uri: string
	detached: true
}

export type BskyAppViewRecordEmbed = {
	$type: 'app.bsky.embed.record#view'
	record:
		| BskyAppViewRecordFound
		| BskyAppViewRecordNotFound
		| BskyAppViewRecordBlocked
		| BskyAppViewRecordDetached
}

export type BskyAppViewRecordWithMediaEmbed = {
	$type: 'app.bsky.embed.recordWithMedia#view'
	record: BskyAppViewRecordEmbed
	media:
		| BskyAppViewImagesEmbed
		| BskyAppViewVideoEmbed
		| BskyAppViewExternalEmbed
}

export type BskyAppViewPostEmbed =
	| BskyAppViewImagesEmbed
	| BskyAppViewVideoEmbed
	| BskyAppViewExternalEmbed
	| BskyAppViewRecordEmbed
	| BskyAppViewRecordWithMediaEmbed

export type BskyAppViewPostView = {
	uri: string
	cid: string
	indexedAt: string
	likeCount?: number
	repostCount?: number
	replyCount?: number
	quoteCount?: number
	bookmarkCount?: number
	author: {
		did: string
		handle: string
	}
	record: BskyAppViewPostRecord
	embed?: BskyAppViewPostEmbed
}

export type BskyAppViewGetPostsResponse = {
	posts: BskyAppViewPostView[]
}

export type BskyAppViewGetAuthorFeedResponse = {
	feed: {
		post: BskyAppViewPostView
		reply?: JsonValue
		reason?: {
			$type?: string
		}
	}[]
	cursor?: string
}

export type BskyAppViewThreadViewPost = {
	$type?: string
	post: BskyAppViewPostView
	parent?: BskyAppViewThreadNode
	replies?: BskyAppViewThreadNode[]
}

export type BskyAppViewThreadNode = BskyAppViewThreadViewPost & {
	uri?: string
	notFound?: boolean
	blocked?: boolean
}

export type BskyAppViewGetPostThreadResponse = {
	thread?: BskyAppViewThreadNode
}

export type BskyAppViewSearchActorsTypeaheadResponse = {
	actors?: {
		did?: string
	}[]
}

export type BskyAppViewSearchPostsResponse = {
	posts?: BskyAppViewPostView[]
}
