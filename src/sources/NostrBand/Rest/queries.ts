import { nostrBandGet } from '$/sources/NostrBand/Rest/client.ts'
import type {
	NostrBandEventById,
	NostrBandEventsList,
	NostrBandProfileSearch,
	NostrBandRecentEvents,
	NostrBandTopProfilesList,
	NostrBandTopRelaysList,
} from '$/sources/NostrBand/Rest/types.ts'

const clampNostrBandLimit = (limit: number) => (
	Math.min(100, Math.max(1, limit))
)

/**
 * GET /v0/events/e/{id}
 */
export const getEventById = async (eventId: string) => (
	nostrBandGet<NostrBandEventById>(
		`/events/e/${encodeURIComponent(eventId.trim().toLowerCase())}`
	)
)

/**
 * GET /v0/users/profile/{pubkey}
 */
export const getProfileByPubkey = async (pubkey: string) => (
	nostrBandGet<NostrBandProfileSearch>(
		`/users/profile/${encodeURIComponent(pubkey.trim().toLowerCase())}`
	)
)

/**
 * GET /v0/stats/profile/list
 */
export const listTopProfiles = async (limit: number) => (
	nostrBandGet<NostrBandTopProfilesList>('/stats/profile/list', {
		limit: clampNostrBandLimit(limit),
	})
)

/**
 * GET /v0/stats/relay/list
 */
export const listTopRelays = async (limit: number) => (
	nostrBandGet<NostrBandTopRelaysList>('/stats/relay/list', {
		limit: clampNostrBandLimit(limit),
	})
)

/**
 * GET /v0/events/recent — kind-1 text notes only.
 */
export const listRecentTextNotes = async (limit: number) => (
	nostrBandGet<NostrBandRecentEvents>('/events/recent', {
		limit: clampNostrBandLimit(limit),
		kinds: '1',
	})
)

/**
 * GET /v0/events/recent — kind-6 reposts only.
 */
export const listRecentReposts = async (limit: number) => (
	nostrBandGet<NostrBandEventsList>('/events/recent', {
		limit: clampNostrBandLimit(limit),
		kinds: '6',
	})
)

/**
 * GET /v0/events/recent — kind-30023 long-form articles only.
 */
export const listRecentArticles = async (limit: number) => (
	nostrBandGet<NostrBandEventsList>('/events/recent', {
		limit: clampNostrBandLimit(limit),
		kinds: '30023',
	})
)

/**
 * GET /v0/events/authors/{pubkey} — kind-1 text notes only.
 */
export const listAuthorTextNotes = async (pubkey: string, limit: number) => (
	nostrBandGet<NostrBandRecentEvents>(
		`/events/authors/${encodeURIComponent(pubkey.trim().toLowerCase())}`,
		{
			limit: clampNostrBandLimit(limit),
			kinds: '1',
		}
	)
)

/**
 * GET /v0/events/authors/{pubkey} — kind-6 reposts only.
 */
export const listAuthorReposts = async (pubkey: string, limit: number) => (
	nostrBandGet<NostrBandEventsList>(
		`/events/authors/${encodeURIComponent(pubkey.trim().toLowerCase())}`,
		{
			limit: clampNostrBandLimit(limit),
			kinds: '6',
		}
	)
)

/**
 * GET /v0/events/authors/{pubkey} — kind-30023 long-form articles only.
 */
export const listAuthorArticles = async (pubkey: string, limit: number) => (
	nostrBandGet<NostrBandEventsList>(
		`/events/authors/${encodeURIComponent(pubkey.trim().toLowerCase())}`,
		{
			limit: clampNostrBandLimit(limit),
			kinds: '30023',
		}
	)
)

/**
 * GET /v0/events/e/{id}/reply — direct replies to a note.
 */
export const listNoteReplies = async (eventId: string, limit: number) => (
	nostrBandGet<NostrBandEventsList>(
		`/events/e/${encodeURIComponent(eventId.trim().toLowerCase())}/reply`,
		{
			kinds: '1',
			limit: clampNostrBandLimit(limit),
		}
	)
)

/**
 * GET /v0/events/e/{id}/related — reactions (kind 7) referencing the note.
 */
export const listNoteReactions = async (eventId: string, limit: number) => (
	nostrBandGet<NostrBandEventsList>(
		`/events/e/${encodeURIComponent(eventId.trim().toLowerCase())}/related`,
		{
			limit: clampNostrBandLimit(limit),
			kinds: '7',
		}
	)
)
