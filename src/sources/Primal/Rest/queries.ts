import { primalGet, primalPost } from '$/sources/Primal/Rest/client.ts'
import type {
	PrimalEventById,
	PrimalProfile,
	PrimalSearchRequestByEndpoint,
	PrimalSearchResponseByEndpoint,
	PrimalTimelineEvents,
} from '$/sources/Primal/Rest/types.ts'

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
export const getProfile = (
	pubkeyOrNpub: string
) => (
	primalGet<PrimalProfile>(`/profile/${encodeProfileId(pubkeyOrNpub)}`)
)

/**
 * POST /v1/timeline/profile/notes
 */
export const getProfileNotes = (
	pubkey: string,
	limit: number
) => (
	profileTimelinePost('/timeline/profile/notes', pubkey, limit)
)

/**
 * POST /v1/timeline/profile/reposts
 */
export const getProfileReposts = (
	pubkey: string,
	limit: number
) => (
	profileTimelinePost('/timeline/profile/reposts', pubkey, limit)
)

/**
 * POST /v1/timeline/profile/articles
 */
export const getProfileArticles = (
	pubkey: string,
	limit: number
) => (
	profileTimelinePost('/timeline/profile/articles', pubkey, limit)
)

/**
 * POST /v1/timeline/thread
 */
export const getNoteThread = (
	eventId: string,
	limit: number
) => (
	primalPost<PrimalTimelineEvents>('/timeline/thread', {
		event_id: normalizeEventId(eventId),
		limit: clampPrimalLimit(limit),
	})
)

/** POST /v1/timeline/event/actions */
export const getNoteActions = (
	eventId: string,
	kind: number,
	limit: number
) => (
	primalPost<PrimalTimelineEvents>('/timeline/event/actions', {
		event_id: normalizeEventId(eventId),
		kind,
		limit: clampPrimalLimit(limit),
	})
)

/** POST /v1/search/{endpoint} */
export const search = <
	_Endpoint extends keyof PrimalSearchRequestByEndpoint
>(
	endpoint: _Endpoint,
	request: PrimalSearchRequestByEndpoint[_Endpoint]
) => {
	const eventIds = '#e' in request ? request['#e'] : undefined
	const kinds = 'kinds' in request ? request.kinds : undefined
	return primalPost<PrimalSearchResponseByEndpoint[_Endpoint]>(`/search/${endpoint}`, {
		...(request.query != null && { query: request.query.trim() }),
		...(eventIds != null && eventIds.length > 0 && {
			'#e': eventIds.map(normalizeEventId),
		}),
		...(kinds != null && kinds.length > 0 && { kinds: [...kinds] }),
		limit: clampPrimalLimit(request.limit),
	})
}

/**
 * GET /v1/events/{id}
 */
export const getEventById = (
	eventId: string
) => (
	primalGet<PrimalEventById>(`/events/${encodeURIComponent(normalizeEventId(eventId))}`)
)
