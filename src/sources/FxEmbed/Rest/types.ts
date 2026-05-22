export type FxEmbedUserWire = {
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

export type FxEmbedUserResponseWire = {
	code?: number
	message?: string
	user?: FxEmbedUserWire
	reason?: 'suspended'
}

export type FxEmbedTwitterStatusWire = {
	type?: 'status' | 'tombstone' | 'thread'
	id?: string
	text?: string
	created_at?: string
	created_timestamp?: number
	likes?: number
	reposts?: number
	replies?: number
	quotes?: number
	author?: FxEmbedUserWire
	provider?: string
	replying_to?: {
		status?: string
	} | null
	quote?: {
		id?: string
	} | null
}

export type FxEmbedSocialThreadWire = {
	code?: number
	status?: FxEmbedTwitterStatusWire | null
	author?: FxEmbedUserWire | null
}

export type FxEmbedSearchResultsWire = {
	code?: number
	results?: FxEmbedTwitterStatusWire[]
}
