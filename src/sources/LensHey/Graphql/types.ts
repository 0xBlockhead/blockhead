/** Hey / Lens GraphQL JSON (subset). */

export type LensHeyGraphqlAccountWire = {
	address?: string
	username?: { localName?: string | null }
	metadata?: {
		name?: string | null
		bio?: string | null
		picture?: string | null
	} | null
}

export type LensHeyGraphqlPostWire = {
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

export type LensHeyGraphqlPostQueryData = {
	post?: LensHeyGraphqlPostWire | null
}

export type LensHeyGraphqlAccountQueryData = {
	account?: LensHeyGraphqlAccountWire | null
}

export type LensHeyGraphqlPostsQueryData = {
	posts?: {
		items?: {
			__typename?: string
			slug?: string
			author?: {
				address?: string
			}
		}[]
	} | null
}
