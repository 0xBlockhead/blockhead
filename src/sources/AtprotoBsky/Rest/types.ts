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
