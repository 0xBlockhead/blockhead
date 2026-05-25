export type FxEmbedUser = {
	type?: 'profile'
	id?: string
	name?: string
	screen_name?: string
	description?: string
	location?: string
	url?: string
	avatar_url?: string | null
	followers?: number
	following?: number
	statuses?: number
	joined?: string
	verification?: {
		verified?: boolean
	}
}

export type FxEmbedUserResponse = {
	code?: number
	message?: string
	user?: FxEmbedUser
	reason?: 'suspended'
}

export type FxEmbedTwitterStatus = {
	type?: 'status' | 'tombstone' | 'thread'
	id?: string
	text?: string
	created_at?: string
	created_timestamp?: number
	likes?: number
	reposts?: number
	replies?: number
	quotes?: number
	author?: FxEmbedUser
	provider?: string
	replying_to?: {
		status?: string
	} | null
	quote?: {
		id?: string
	} | null
}

export type FxEmbedSocialThread = {
	code?: number
	status?: FxEmbedTwitterStatus | null
	author?: FxEmbedUser | null
}

export type FxEmbedSearchResults = {
	code?: number
	results?: FxEmbedTwitterStatus[]
}
