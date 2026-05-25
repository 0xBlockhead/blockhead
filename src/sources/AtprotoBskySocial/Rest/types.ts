export type BskySocialSearchActorsTypeaheadResponse = {
	actors?: {
		did?: string
	}[]
}

export type BskySocialSearchPostsResponse = {
	posts?: {
		author?: {
			did?: string
		}
		uri?: string
	}[]
}
