import { primalGet, primalPost } from '$/sources/Primal/Rest/client.ts'
import type {
	PrimalEventById,
	PrimalProfile,
	PrimalSearchEvents,
	PrimalSearchUsers,
	PrimalTimelineEvents,
} from '$/sources/Primal/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

const clampPrimalLimit = (limit: number) => (
	Math.min(1000, Math.max(1, limit))
)

const encodeProfileId = (pubkeyOrNpub: string) => (
	encodeURIComponent(pubkeyOrNpub)
)

const normalizePubkey = (pubkey: string) => (
	pubkey.toLowerCase()
)

const normalizeEventId = (eventId: string) => (
	eventId.toLowerCase()
)

const profileTimelinePost = (
	path: string,
	pubkey: string,
	limit: number
) => (
	primalPost<PrimalTimelineEvents>(path, {
		pubkey: normalizePubkey(pubkey),
		limit: clampPrimalLimit(limit),
	})
)

/**
 * GET /v1/profile/{id}
 */
export const getProfile = async (
	_publicEnv: SourcePublicEnv,
	pubkeyOrNpub: string
) => (
	primalGet<PrimalProfile>(`/profile/${encodeProfileId(pubkeyOrNpub)}`)
)

/**
 * POST /v1/timeline/profile/notes
 */
export const getProfileNotes = async (
	_publicEnv: SourcePublicEnv,
	pubkey: string,
	limit: number
) => (
	profileTimelinePost('/timeline/profile/notes', pubkey, limit)
)

/**
 * POST /v1/timeline/profile/reposts
 */
export const getProfileReposts = async (
	_publicEnv: SourcePublicEnv,
	pubkey: string,
	limit: number
) => (
	profileTimelinePost('/timeline/profile/reposts', pubkey, limit)
)

/**
 * POST /v1/timeline/profile/articles
 */
export const getProfileArticles = async (
	_publicEnv: SourcePublicEnv,
	pubkey: string,
	limit: number
) => (
	profileTimelinePost('/timeline/profile/articles', pubkey, limit)
)

/**
 * POST /v1/timeline/thread
 */
export const getNoteThread = async (
	_publicEnv: SourcePublicEnv,
	eventId: string,
	limit: number
) => (
	primalPost<PrimalTimelineEvents>('/timeline/thread', {
		event_id: normalizeEventId(eventId),
		limit: clampPrimalLimit(limit),
	})
)

/** POST /v1/timeline/event/actions — kind-1 direct replies for a note. */
export const getNoteReplies = async (
	_publicEnv: SourcePublicEnv,
	eventId: string,
	limit: number
) => (
	primalPost<PrimalTimelineEvents>('/timeline/event/actions', {
		event_id: normalizeEventId(eventId),
		kind: 1,
		limit: clampPrimalLimit(limit),
	})
)

/**
 * POST /v1/timeline/event/actions — kind-7 reactions for a note.
 */
export const getNoteReactions = async (
	_publicEnv: SourcePublicEnv,
	eventId: string,
	limit: number
) => (
	primalPost<PrimalTimelineEvents>('/timeline/event/actions', {
		event_id: normalizeEventId(eventId),
		kind: 7,
		limit: clampPrimalLimit(limit),
	})
)

/**
 * POST /v1/search/events
 */
export const searchEvents = async (
	_publicEnv: SourcePublicEnv,
	query: string,
	limit: number,
	kinds?: readonly number[]
) => (
	primalPost<PrimalSearchEvents>('/search/events', {
		query: query.trim(),
		...(kinds != null && kinds.length > 0 && { kinds: [...kinds] }),
		limit: clampPrimalLimit(limit),
	})
)

/**
 * POST /v1/search/events — kind-7 reactions referencing an event (NIP-50-style `#e`).
 */
export const searchEventReactions = async (
	_publicEnv: SourcePublicEnv,
	eventId: string,
	limit: number
) => (
	primalPost<PrimalSearchEvents>('/search/events', {
		'#e': [normalizeEventId(eventId)],
		kinds: [7],
		limit: clampPrimalLimit(limit),
	})
)

/**
 * POST /v1/search/users
 */
export const searchUsers = async (
	_publicEnv: SourcePublicEnv,
	query: string,
	limit: number
) => (
	primalPost<PrimalSearchUsers>('/search/users', {
		query: query.trim(),
		limit: clampPrimalLimit(limit),
	})
)

/**
 * GET /v1/events/{id}
 */
export const getEventById = async (
	_publicEnv: SourcePublicEnv,
	eventId: string
) => (
	primalGet<PrimalEventById>(`/events/${encodeURIComponent(normalizeEventId(eventId))}`)
)
