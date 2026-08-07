import { primalGet, primalPost } from '$/sources/Primal/Rest/client.ts'
import {
	primalEventByIdWire,
	primalProfileWire,
	primalSearchUsersWire,
	primalTimelineEventsWire,
	type PrimalEventById,
	type PrimalProfile,
	type PrimalSearchRequestByEndpoint,
	type PrimalSearchResponseByEndpoint,
	type PrimalTimelineEvents,
} from '$/sources/Primal/Rest/types.ts'

const clampPrimalLimit = (limit: number) => (
	Math.min(1000, Math.max(1, limit))
)

const normalizePubkey = (pubkey: string) => (
	pubkey.toLowerCase()
)

const normalizeEventId = (eventId: string) => (
	eventId.toLowerCase()
)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Primal_Rest: invalid ${label} response envelope`)
	}
}

const profileTimelinePost = async (
	path: string,
	pubkey: string,
	limit: number
) => (
	assertEnvelope(
		`timeline ${path}`,
		primalTimelineEventsWire,
		await primalPost<unknown>(path, {
			pubkey: normalizePubkey(pubkey),
			limit: clampPrimalLimit(limit),
		})
	)
)

/**
 * GET /v1/profile/{id}
 */
export const getProfile = async (
	pubkeyOrNpub: string
): Promise<PrimalProfile> => (
	assertEnvelope(
		'profile',
		primalProfileWire,
		await primalGet<unknown>(`/profile/${encodeURIComponent(pubkeyOrNpub)}`)
	)
)

/**
 * POST /v1/timeline/profile/notes
 */
export const getProfileNotes = (
	pubkey: string,
	limit: number
): Promise<PrimalTimelineEvents> => (
	profileTimelinePost('/timeline/profile/notes', pubkey, limit)
)

/**
 * POST /v1/timeline/profile/reposts
 */
export const getProfileReposts = (
	pubkey: string,
	limit: number
): Promise<PrimalTimelineEvents> => (
	profileTimelinePost('/timeline/profile/reposts', pubkey, limit)
)

/**
 * POST /v1/timeline/profile/articles
 */
export const getProfileArticles = (
	pubkey: string,
	limit: number
): Promise<PrimalTimelineEvents> => (
	profileTimelinePost('/timeline/profile/articles', pubkey, limit)
)

/**
 * POST /v1/timeline/thread
 */
export const getNoteThread = async (
	eventId: string,
	limit: number
): Promise<PrimalTimelineEvents> => (
	assertEnvelope(
		'timeline thread',
		primalTimelineEventsWire,
		await primalPost<unknown>('/timeline/thread', {
			event_id: normalizeEventId(eventId),
			limit: clampPrimalLimit(limit),
		})
	)
)

/** POST /v1/timeline/event/actions */
export const getNoteActions = async (
	eventId: string,
	kind: number,
	limit: number
): Promise<PrimalTimelineEvents> => (
	assertEnvelope(
		'timeline event actions',
		primalTimelineEventsWire,
		await primalPost<unknown>('/timeline/event/actions', {
			event_id: normalizeEventId(eventId),
			kind,
			limit: clampPrimalLimit(limit),
		})
	)
)

/** POST /v1/search/{endpoint} */
export function search(
	endpoint: 'events',
	request: PrimalSearchRequestByEndpoint['events']
): Promise<PrimalSearchResponseByEndpoint['events']>
export function search(
	endpoint: 'users',
	request: PrimalSearchRequestByEndpoint['users']
): Promise<PrimalSearchResponseByEndpoint['users']>
export async function search(
	endpoint: keyof PrimalSearchRequestByEndpoint,
	request: PrimalSearchRequestByEndpoint[keyof PrimalSearchRequestByEndpoint]
): Promise<PrimalSearchResponseByEndpoint[keyof PrimalSearchRequestByEndpoint]> {
	const eventIds = '#e' in request ? request['#e'] : undefined
	const kinds = 'kinds' in request ? request.kinds : undefined
	const response = await primalPost<unknown>(`/search/${endpoint}`, {
		...(request.query != null && { query: request.query.trim() }),
		...(eventIds != null && eventIds.length > 0 && {
			'#e': eventIds.map(normalizeEventId),
		}),
		...(kinds != null && kinds.length > 0 && { kinds: [...kinds] }),
		limit: clampPrimalLimit(request.limit),
	})
	if (endpoint === 'users')
		return assertEnvelope(
			'search users',
			primalSearchUsersWire,
			response
		)

	return assertEnvelope(
		'search events',
		primalTimelineEventsWire,
		response
	)
}

/**
 * GET /v1/events/{id}
 */
export const getEventById = async (
	eventId: string
): Promise<PrimalEventById> => (
	assertEnvelope(
		'event',
		primalEventByIdWire,
		await primalGet<unknown>(`/events/${encodeURIComponent(normalizeEventId(eventId))}`)
	)
)
