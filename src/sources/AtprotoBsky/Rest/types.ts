/**
 * Bsky public appview JSON (subset; wire only).
 * @see https://docs.bsky.app/docs/api/app-bsky-actor-get-profile
 * @see https://docs.bsky.app/docs/api/app-bsky-feed-get-posts
 */
import type { JsonValue } from '$/typescript/JsonValue.ts'

export type BskyAppViewProfileWire = {
	did?: string
	handle?: string
	displayName?: string
	description?: string
	avatar?: string
	banner?: string
	followersCount?: number
	followsCount?: number
	postsCount?: number
	indexedAt?: string
}

export type BskyAppViewPostViewWire = {
	uri?: string
	indexedAt?: string
	likeCount?: number
	repostCount?: number
	replyCount?: number
	author?: {
		did?: string
		handle?: string
	}
	record?: {
		$type?: string
		text?: string
		createdAt?: string
		reply?: {
			parent?: { uri?: string, cid?: string }
			root?: { uri?: string, cid?: string }
		}
	}
}

export type BskyAppViewGetPostsResponseWire = {
	posts?: BskyAppViewPostViewWire[]
}

export type BskyAppViewGetAuthorFeedResponseWire = {
	feed?: {
		post: BskyAppViewPostViewWire
		reply?: JsonValue
	}[]
	cursor?: string
}

export type BskyAppViewThreadViewPostWire = {
	$type?: string
	post?: BskyAppViewPostViewWire
	parent?: BskyAppViewThreadNodeWire
	replies?: BskyAppViewThreadNodeWire[]
}

export type BskyAppViewThreadNodeWire = BskyAppViewThreadViewPostWire & {
	uri?: string
	notFound?: boolean
	blocked?: boolean
}

export type BskyAppViewGetPostThreadResponseWire = {
	thread?: BskyAppViewThreadNodeWire
}
