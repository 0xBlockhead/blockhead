/** Lens GraphQL JSON (subset). */

export type LensGraphqlAccountWire = {
	address?: string
	username?: { localName?: string | null }
}

export type LensGraphqlPostWire = {
	__typename?: string
	slug?: string
	timestamp?: string
	author?: { address?: string }
	metadata?: { content?: string }
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
