/**
 * Primal HTTP API v1 envelopes (fail-closed arktype).
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

import {
	type as arktype,
	type Type,
} from 'arktype'


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

const nonNegativeInteger = arktype('number.integer >= 0')

export const primalNostrEventWire = arktype({
	'id?': 'string',
	'pubkey?': 'string',
	'kind?': nonNegativeInteger,
	'content?': 'string',
	'created_at?': 'number.integer',
	'tags?': 'unknown',
	'sig?': 'string',
})

export type PrimalNostrEvent = typeof primalNostrEventWire.infer

export type PrimalSearchRequestByEndpoint = {
	events: {
		query?: string
		'#e'?: readonly string[]
		kinds?: readonly number[]
		limit: number
	}
	users: {
		query: string
		limit: number
	}
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
	| PrimalSearchRequestByEndpoint[keyof PrimalSearchRequestByEndpoint]

export const primalProfileWire = primalNostrEventWire.and(arktype({
	'metadata?': primalNostrEventWire,
	'profile?': primalNostrEventWire,
	'user?': primalNostrEventWire,
	'events?': primalNostrEventWire.array(),
}))

/** GET /v1/profile/{id} */
export type PrimalProfile = typeof primalProfileWire.infer

export const primalTimelineObjectWire = arktype({
	'notes?': primalNostrEventWire.array(),
	'posts?': primalNostrEventWire.array(),
	'events?': primalNostrEventWire.array(),
	'items?': primalNostrEventWire.array(),
	'reposts?': primalNostrEventWire.array(),
	'articles?': primalNostrEventWire.array(),
	'actions?': primalNostrEventWire.array(),
})

export const primalTimelineEventsWire = primalNostrEventWire.array().or(primalTimelineObjectWire) satisfies Type<
	| PrimalNostrEvent[]
	| typeof primalTimelineObjectWire.infer
>

/** POST /v1/timeline/profile/* and /v1/timeline/thread */
export type PrimalTimelineEvents = typeof primalTimelineEventsWire.infer

/** POST /v1/search/events */
export type PrimalSearchEvents = PrimalTimelineEvents

export const primalSearchUsersObjectWire = arktype({
	'users?': primalNostrEventWire.array(),
	'profiles?': primalNostrEventWire.array(),
	'events?': primalNostrEventWire.array(),
})

export const primalSearchUsersWire = primalNostrEventWire.array().or(primalSearchUsersObjectWire) satisfies Type<
	| PrimalNostrEvent[]
	| typeof primalSearchUsersObjectWire.infer
>

/** POST /v1/search/users */
export type PrimalSearchUsers = typeof primalSearchUsersWire.infer

export type PrimalSearchResponseByEndpoint = {
	events: PrimalSearchEvents
	users: PrimalSearchUsers
}

export const primalEventByIdWire = primalNostrEventWire.and(arktype({
	'event?': primalNostrEventWire,
	'events?': primalNostrEventWire.array(),
	'note?': primalNostrEventWire,
}))

/** GET /v1/events/{id} */
export type PrimalEventById = typeof primalEventByIdWire.infer
