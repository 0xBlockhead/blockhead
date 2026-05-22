import { primalGet, primalPost } from '$/sources/Primal/Rest/client.ts'
import type {
	PrimalEventByIdWire,
	PrimalProfileWire,
	PrimalSearchEventsWire,
	PrimalSearchUsersWire,
	PrimalTimelineEventsWire,
} from '$/sources/Primal/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const clampPrimalLimit = (limit: number) => (
	Math.min(1000, Math.max(1, limit))
)

const encodeProfileId = (pubkeyOrNpub: string) => (
	encodeURIComponent(pubkeyOrNpub.trim())
)

const normalizePubkey = (pubkey: string) => (
	pubkey.trim().toLowerCase()
)

const normalizeEventId = (eventId: string) => (
	eventId.trim().toLowerCase()
)

const profileTimelinePost = (
	path: string,
	pubkey: string,
	limit: number,
) => (
	primalPost<PrimalTimelineEventsWire>(path, {
		pubkey: normalizePubkey(pubkey),
		limit: clampPrimalLimit(limit),
	})
)

/**
 * GET /v1/profile/{id}
 */
export const getProfile = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	pubkeyOrNpub: string,
) => (
	primalGet<PrimalProfileWire>(`/profile/${encodeProfileId(pubkeyOrNpub)}`)
)

/**
 * POST /v1/timeline/profile/notes
 */
export const getProfileNotes = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	pubkey: string,
	limit: number,
) => (
	profileTimelinePost('/timeline/profile/notes', pubkey, limit)
)

/**
 * POST /v1/timeline/profile/reposts
 */
export const getProfileReposts = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	pubkey: string,
	limit: number,
) => (
	profileTimelinePost('/timeline/profile/reposts', pubkey, limit)
)

/**
 * POST /v1/timeline/profile/articles
 */
export const getProfileArticles = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	pubkey: string,
	limit: number,
) => (
	profileTimelinePost('/timeline/profile/articles', pubkey, limit)
)

/**
 * POST /v1/timeline/thread
 */
export const getNoteThread = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	eventId: string,
	limit: number,
) => (
	primalPost<PrimalTimelineEventsWire>('/timeline/thread', {
		event_id: normalizeEventId(eventId),
		limit: clampPrimalLimit(limit),
	})
)

/** Alias for {@link getNoteThread} — thread reply notes (kind 1). */
export const getNoteReplies = getNoteThread

/**
 * POST /v1/timeline/event/actions — kind-7 reactions for a note.
 */
export const getNoteReactions = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	eventId: string,
	limit: number,
) => (
	primalPost<PrimalTimelineEventsWire>('/timeline/event/actions', {
		event_id: normalizeEventId(eventId),
		kind: 7,
		limit: clampPrimalLimit(limit),
	})
)

/**
 * POST /v1/search/events
 */
export const searchEvents = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	query: string,
	limit: number,
	kinds?: readonly number[],
) => (
	primalPost<PrimalSearchEventsWire>('/search/events', {
		query: query.trim(),
		...(kinds != null && kinds.length > 0 && { kinds: [...kinds] }),
		limit: clampPrimalLimit(limit),
	})
)

/**
 * POST /v1/search/events — kind-7 reactions referencing an event (NIP-50-style `#e`).
 */
export const searchEventReactions = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	eventId: string,
	limit: number,
) => (
	primalPost<PrimalSearchEventsWire>('/search/events', {
		'#e': [normalizeEventId(eventId)],
		kinds: [7],
		limit: clampPrimalLimit(limit),
	})
)

/**
 * POST /v1/search/users
 */
export const searchUsers = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	query: string,
	limit: number,
) => (
	primalPost<PrimalSearchUsersWire>('/search/users', {
		query: query.trim(),
		limit: clampPrimalLimit(limit),
	})
)

/**
 * GET /v1/events/{id}
 */
export const getEventById = async (
	_publicEnv: SourcePublicEnvFor<Source.Primal_Rest>,
	eventId: string,
) => (
	primalGet<PrimalEventByIdWire>(`/events/${encodeURIComponent(normalizeEventId(eventId))}`)
)
