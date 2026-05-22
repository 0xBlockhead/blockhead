/**
 * Primal HTTP API v1 wire shapes.
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

export type PrimalNostrEventWire = {
	id?: string
	pubkey?: string
	kind?: number
	content?: string
	created_at?: number
	tags?: readonly (readonly string[])[]
	sig?: string
}

/** GET /v1/profile/{id} */
export type PrimalProfileWire = {
	metadata?: PrimalNostrEventWire
	profile?: PrimalNostrEventWire
	user?: PrimalNostrEventWire
	events?: PrimalNostrEventWire[]
} & PrimalNostrEventWire

/** POST /v1/timeline/profile/* and /v1/timeline/thread */
export type PrimalTimelineEventsWire =
	| PrimalNostrEventWire[]
	| {
		notes?: PrimalNostrEventWire[]
		posts?: PrimalNostrEventWire[]
		events?: PrimalNostrEventWire[]
		items?: PrimalNostrEventWire[]
		reposts?: PrimalNostrEventWire[]
		articles?: PrimalNostrEventWire[]
		actions?: PrimalNostrEventWire[]
	}

/** POST /v1/search/events */
export type PrimalSearchEventsWire = PrimalTimelineEventsWire

/** POST /v1/search/users */
export type PrimalSearchUsersWire =
	| PrimalNostrEventWire[]
	| {
		users?: PrimalNostrEventWire[]
		profiles?: PrimalNostrEventWire[]
		events?: PrimalNostrEventWire[]
	}

/** GET /v1/events/{id} */
export type PrimalEventByIdWire = {
	event?: PrimalNostrEventWire
	events?: PrimalNostrEventWire[]
	note?: PrimalNostrEventWire
} & PrimalNostrEventWire
