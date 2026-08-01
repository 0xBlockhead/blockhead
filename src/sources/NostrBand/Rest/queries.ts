import { nostrBandGet } from '$/sources/NostrBand/Rest/client.ts'
import type {
	NostrBandEventById,
	NostrBandEventsList,
	NostrBandProfileSearch,
	NostrBandTopProfilesList,
	NostrBandTopRelaysList,
} from '$/sources/NostrBand/Rest/types.ts'

const clampNostrBandLimit = (limit: number) => (
	Math.min(100, Math.max(1, limit))
)

export const normalizeNostrBandProfileSearchQuery = (query: string) => {
	if (/[\u0000-\u001f\u007f]/.test(query))
		throw new Error('NostrBand profile search query contains control characters')

	const normalizedQuery = query.trim().replace(/\s+/g, ' ')
	if (normalizedQuery === '')
		throw new Error('NostrBand profile search query must not be blank')
	if (normalizedQuery.length > 64)
		throw new Error('NostrBand profile search query exceeds 64 characters')

	return normalizedQuery
}

/** GET /v0/events/search — kind-0 profile metadata events. */
export const searchProfiles = (query: string, limit: number) => (
	nostrBandGet<NostrBandEventsList>('/events/search', {
		query: normalizeNostrBandProfileSearchQuery(query),
		kinds: '0',
		limit: clampNostrBandLimit(limit),
	})
)

/**
 * GET /v0/events/e/{id}
 */
export const getEventById = (eventId: string) => (
	nostrBandGet<NostrBandEventById>(
		`/events/e/${encodeURIComponent(eventId.toLowerCase())}`
	)
)

/**
 * GET /v0/users/profile/{pubkey}
 */
export const getProfileByPubkey = (pubkey: string) => (
	nostrBandGet<NostrBandProfileSearch>(
		`/users/profile/${encodeURIComponent(pubkey.toLowerCase())}`
	)
)

/**
 * GET /v0/stats/profile/list
 */
export const listTopProfiles = (limit: number) => (
	nostrBandGet<NostrBandTopProfilesList>('/stats/profile/list', {
		limit: clampNostrBandLimit(limit),
	})
)

/**
 * GET /v0/stats/relay/list
 */
export const listTopRelays = (limit: number) => (
	nostrBandGet<NostrBandTopRelaysList>('/stats/relay/list', {
		limit: clampNostrBandLimit(limit),
	})
)

/** GET /v0/events/recent */
export const listRecentEvents = (
	limit: number,
	kinds: readonly number[]
) => (
	nostrBandGet<NostrBandEventsList>('/events/recent', {
		limit: clampNostrBandLimit(limit),
		kinds: kinds.join(','),
	})
)

/** GET /v0/events/authors/{pubkey} */
export const listAuthorEvents = (
	pubkey: string,
	limit: number,
	kinds: readonly number[]
) => (
	nostrBandGet<NostrBandEventsList>(
		`/events/authors/${encodeURIComponent(pubkey.toLowerCase())}`,
		{
			limit: clampNostrBandLimit(limit),
			kinds: kinds.join(','),
		}
	)
)

/**
 * GET /v0/events/e/{id}/reply — direct replies to a note.
 */
export const listNoteReplies = (eventId: string, limit: number) => (
	nostrBandGet<NostrBandEventsList>(
		`/events/e/${encodeURIComponent(eventId.toLowerCase())}/reply`,
		{
			kinds: '1',
			limit: clampNostrBandLimit(limit),
		}
	)
)

/**
 * GET /v0/events/e/{id}/related — reactions (kind 7) referencing the note.
 */
export const listNoteReactions = (eventId: string, limit: number) => (
	nostrBandGet<NostrBandEventsList>(
		`/events/e/${encodeURIComponent(eventId.toLowerCase())}/related`,
		{
			limit: clampNostrBandLimit(limit),
			kinds: '7',
		}
	)
)
