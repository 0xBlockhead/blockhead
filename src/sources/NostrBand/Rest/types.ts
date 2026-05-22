/**
 * NostrBand HTTP API v0 wire shapes.
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

export type NostrBandEventWire = {
	id?: string
	pubkey?: string
	created_at?: number
	kind?: number
	tags?: string[][]
	content?: string
	sig?: string
}

export type NostrBandProfileMetadataWire = {
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
export type NostrBandProfileSearchWire = {
	pubkey?: string
	profile?: NostrBandEventWire
	metadata?: NostrBandProfileMetadataWire
}

/** GET /v0/stats/profile/list */
export type NostrBandTopProfileWire = {
	pubkey?: string
	profile?: NostrBandEventWire
	followers?: number
	followers_count?: number
	notes?: number
	notes_count?: number
}

export type NostrBandTopProfilesListWire = {
	profiles?: NostrBandTopProfileWire[]
}

/** GET /v0/stats/relay/list */
export type NostrBandRelayStatsWire = {
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

export type NostrBandTopRelaysListWire = {
	relays?: NostrBandRelayStatsWire[]
}

/** GET /v0/events/e/{id} */
export type NostrBandEventByIdWire = {
	event?: NostrBandEventWire
	events?: NostrBandEventWire[]
}

/** GET /v0/events/recent | /v0/events/authors/{pubkey} | /v0/events/e/{id}/related | /v0/events/e/{id}/reply | /v0/events/search */
export type NostrBandEventsListWire = {
	events?: NostrBandEventWire[]
}

/** GET /v0/events/recent */
export type NostrBandRecentEventsWire = NostrBandEventsListWire
