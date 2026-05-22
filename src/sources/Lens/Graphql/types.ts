/** Lens GraphQL JSON (subset). */

export type LensGraphqlAccountWire = {
	address?: string
	username?: { localName?: string | null }
	metadata?: {
		name?: string | null
		bio?: string | null
		picture?: string | null
	} | null
}

export type LensGraphqlPostWire = {
	__typename?: string
	slug?: string
	timestamp?: string
	author?: { address?: string }
	commentOn?: { slug?: string }
	metadata?: { content?: string }
	stats?: {
		comments?: number
		reposts?: number
		bookmarks?: number
	}
}

export type LensGraphqlPostQueryData = {
	post?: LensGraphqlPostWire | null
}

export type LensGraphqlAccountQueryData = {
	account?: LensGraphqlAccountWire | null
}

export type LensGraphqlPostsQueryData = {
	posts?: {
		items?: {
			__typename?: string
			slug?: string
		}[]
	} | null
}

export type LensGraphqlPostCommentsQueryData = {
	postReferences?: {
		items?: {
			__typename?: string
			slug?: string
		}[]
	} | null
}
