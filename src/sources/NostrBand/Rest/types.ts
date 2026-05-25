/**
 * NostrBand HTTP API v0 API shapes.
 * @see https://api.nostr.band/v0/events/e/{id}
 * @see https://api.nostr.band/v0/events/e/{id}/related
 * @see https://api.nostr.band/v0/events/e/{id}/reply
 * @see https://api.nostr.band/v0/events/search
 * @see https://api.nostr.band/v0/events/authors/{pubkey}
 * @see https://api.nostr.band/v0/users/profile/{pubkey}
 * @see https://api.nostr.band/v0/stats/profile/list
 * @see https://api.nostr.band/v0/stats/relay/list
 * @see https://api.nostr.band/v0/events/recent
 */

export type NostrEvent = {
	id?: string
	pubkey?: string
	created_at?: number
	kind?: number
	tags?: string[][]
	content?: string
	sig?: string
}

export type NostrProfileMetadata = {
	name?: string
	display_name?: string
	about?: string
	picture?: string
	banner?: string
	website?: string
	nip05?: string
	lud16?: string
	lud06?: string
}

/** GET /v0/users/profile/{pubkey} */
export type NostrBandProfileSearch = {
	pubkey?: string
	profile?: NostrEvent
	metadata?: NostrProfileMetadata
}

/** GET /v0/stats/profile/list */
export type NostrBandTopProfile = {
	pubkey?: string
	profile?: NostrEvent
	followers?: number
	followers_count?: number
	notes?: number
	notes_count?: number
}

export type NostrBandTopProfilesList = {
	profiles?: NostrBandTopProfile[]
}

/** GET /v0/stats/relay/list */
export type NostrBandRelayStats = {
	url?: string
	relay?: string
	relay_url?: string
	domain?: string
	name?: string
	description?: string
	software?: string
	version?: string
	nips?: number[]
	is_paid?: boolean
	paid?: boolean
	limit?: number
	events?: number
	events_count?: number
	users?: number
	users_count?: number
	notes?: number
	notes_count?: number
}

export type NostrBandTopRelaysList = {
	relays?: NostrBandRelayStats[]
}

/** GET /v0/events/e/{id} */
export type NostrBandEventById = {
	event?: NostrEvent
	events?: NostrEvent[]
}

/** GET /v0/events/recent | /v0/events/authors/{pubkey} | /v0/events/e/{id}/related | /v0/events/e/{id}/reply | /v0/events/search */
export type NostrBandEventsList = {
	events?: NostrEvent[]
}

/** GET /v0/events/recent */
export type NostrBandRecentEvents = NostrBandEventsList
