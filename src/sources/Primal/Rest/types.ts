/**
	* Primal HTTP API v1 API shapes.
	* @see https://api.primal.net/v1/profile/{id}
	* @see https://api.primal.net/v1/timeline/profile/notes
	* @see https://api.primal.net/v1/timeline/profile/reposts
	* @see https://api.primal.net/v1/timeline/profile/articles
	* @see https://api.primal.net/v1/timeline/thread
	* @see https://api.primal.net/v1/timeline/event/actions
	* @see https://api.primal.net/v1/search/events
	* @see https://api.primal.net/v1/search/users
	* @see https://api.primal.net/v1/events/{id}
	*/

/** NIP-01 profile metadata JSON (`kind:0` content object). */
export type PrimalNostrProfileMetadata = {
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

export type PrimalNostrEvent = {
	id?: string
	pubkey?: string
	kind?: number
	content?: string
	created_at?: number
	tags?: string[][]
	sig?: string
}

export type PrimalPostBody =
	| {
		pubkey: string
		limit: number
	}
	| {
		event_id: string
		kind?: number
		limit: number
	}
	| {
		query?: string
		'#e'?: readonly string[]
		kinds?: readonly number[]
		limit: number
	}

/** GET /v1/profile/{id} */
export type PrimalProfile = {
	metadata?: PrimalNostrEvent
	profile?: PrimalNostrEvent
	user?: PrimalNostrEvent
	events?: PrimalNostrEvent[]
} & PrimalNostrEvent

/** POST /v1/timeline/profile/* and /v1/timeline/thread */
export type PrimalTimelineEvents =
	| PrimalNostrEvent[]
	| {
		notes?: PrimalNostrEvent[]
		posts?: PrimalNostrEvent[]
		events?: PrimalNostrEvent[]
		items?: PrimalNostrEvent[]
		reposts?: PrimalNostrEvent[]
		articles?: PrimalNostrEvent[]
		actions?: PrimalNostrEvent[]
	}

/** POST /v1/search/events */
export type PrimalSearchEvents = PrimalTimelineEvents

/** POST /v1/search/users */
export type PrimalSearchUsers =
	| PrimalNostrEvent[]
	| {
		users?: PrimalNostrEvent[]
		profiles?: PrimalNostrEvent[]
		events?: PrimalNostrEvent[]
	}

/** GET /v1/events/{id} */
export type PrimalEventById = {
	event?: PrimalNostrEvent
	events?: PrimalNostrEvent[]
	note?: PrimalNostrEvent
} & PrimalNostrEvent
