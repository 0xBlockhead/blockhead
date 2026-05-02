/**
 * Bsky public appview JSON (subset; wire only).
 * @see https://docs.bsky.app/docs/api/app-bsky-actor-get-profile
 * @see https://docs.bsky.app/docs/api/app-bsky-feed-get-posts
 */

export type BskyAppViewProfileWire = {
	did?: string
	handle?: string
	displayName?: string
	description?: string
	avatar?: string
}

export type BskyAppViewPostViewWire = {
	uri?: string
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
		reply?: unknown
	}[]
	cursor?: string
}
