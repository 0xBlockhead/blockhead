import { nostrNetworkSeedRelays } from '$/constants/Social/Nostr.ts'
import { nostrBandGet } from '$/sources/NostrBand/Rest/client.ts'
import type {
	NostrBandEventById,
	NostrBandEventsList,
	NostrEvent,
	NostrBandProfileSearch,
	NostrBandRecentEvents,
	NostrBandTopProfilesList,
	NostrBandTopRelaysList,
} from '$/sources/NostrBand/Rest/types.ts'

const clampNostrBandLimit = (limit: number) => (
	Math.min(100, Math.max(1, limit))
)

const relayFallbackRelays = [
	...nostrNetworkSeedRelays.filter((relay) => relay.relayUrl === 'wss://relay.primal.net'),
	...nostrNetworkSeedRelays.filter((relay) => relay.relayUrl !== 'wss://relay.primal.net'),
]

const getEventByIdFromRelay = async (
	relayUrl: string,
	eventId: string
) => (
	await new Promise<NostrEvent>((resolve, reject) => {
		const websocket = new WebSocket(relayUrl)
		const timeout = setTimeout(() => {
			websocket.close()
			reject(new Error(`NostrBand_Rest: relay fallback timeout ${relayUrl}`))
		}, 10_000)

		websocket.addEventListener('open', () => {
			websocket.send(JSON.stringify([
				'REQ',
				'event-by-id',
				{
					ids: [
						eventId,
					],
					limit: 1,
				},
			]))
		})

		websocket.addEventListener('message', (message) => {
			const payload = JSON.parse(String(message.data)) as [
				string,
				string,
				NostrEvent?,
			]
			if (payload[0] !== 'EVENT' || payload[2]?.id !== eventId)
				return

			clearTimeout(timeout)
			websocket.close()
			resolve(payload[2])
		})

		websocket.addEventListener('error', () => {
			clearTimeout(timeout)
			reject(new Error(`NostrBand_Rest: relay fallback websocket error ${relayUrl}`))
		})
	})
)

const listEventsFromRelay = async (
	relayUrl: string,
	filter: {
		authors?: string[]
		kinds?: number[]
		limit: number
	}
) => (
	await new Promise<NostrEvent[]>((resolve, reject) => {
		const events: NostrEvent[] = []
		const websocket = new WebSocket(relayUrl)
		const timeout = setTimeout(() => {
			websocket.close()
			reject(new Error(`NostrBand_Rest: relay fallback timeout ${relayUrl}`))
		}, 10_000)

		websocket.addEventListener('open', () => {
			websocket.send(JSON.stringify([
				'REQ',
				'events-list',
				{
					...filter,
					limit: clampNostrBandLimit(filter.limit),
				},
			]))
		})

		websocket.addEventListener('message', (message) => {
			const payload = JSON.parse(String(message.data)) as [
				string,
				string,
				NostrEvent?,
			]
			if (payload[0] === 'EVENT' && payload[2] != null) {
				events.push(payload[2])
				if (events.length >= clampNostrBandLimit(filter.limit)) {
					clearTimeout(timeout)
					websocket.close()
					resolve(events)
				}
			}

			if (payload[0] === 'EOSE') {
				clearTimeout(timeout)
				websocket.close()
				resolve(events)
			}
		})

		websocket.addEventListener('error', () => {
			clearTimeout(timeout)
			websocket.close()
			reject(new Error(`NostrBand_Rest: relay fallback websocket error ${relayUrl}`))
		})
	})
)

const getEventByIdFromRelays = async (eventId: string) => {
	const errors = []
	for (const relay of relayFallbackRelays) {
		try {
			return await getEventByIdFromRelay(relay.relayUrl, eventId)
		} catch (error) {
			errors.push(error)
		}
	}

	throw new AggregateError(errors, 'NostrBand_Rest: relay fallback event not found')
}

const listEventsFromRelays = async (filter: {
	authors?: string[]
	kinds?: number[]
	limit: number
}) => {
	const errors = []
	for (const relay of relayFallbackRelays) {
		try {
			const events = await listEventsFromRelay(relay.relayUrl, filter)
			if (events.length > 0)
				return events
		} catch (error) {
			errors.push(error)
		}
	}

	throw new AggregateError(errors, 'NostrBand_Rest: relay fallback events not found')
}

/**
 * GET /v0/events/e/{id}
 */
export const getEventById = async (eventId: string) => (
	await getEventByIdFromRelays(eventId.trim().toLowerCase())
		.then((event) => ({ event }))
		.catch(async () => (
			await nostrBandGet<NostrBandEventById>(
				`/events/e/${encodeURIComponent(eventId.trim().toLowerCase())}`
			)
		))
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
	await listEventsFromRelays({
		limit,
		kinds: [
			30023,
		],
	}).then(
		(events) => ({ events }),
		async () => (
			await nostrBandGet<NostrBandEventsList>('/events/recent', {
				limit: clampNostrBandLimit(limit),
				kinds: '30023',
			})
		)
	)
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
	await listEventsFromRelays({
		authors: [
			pubkey.trim().toLowerCase(),
		],
		limit,
		kinds: [
			30023,
		],
	}).then(
		(events) => ({ events }),
		async () => (
			await nostrBandGet<NostrBandEventsList>(
				`/events/authors/${encodeURIComponent(pubkey.trim().toLowerCase())}`,
				{
					limit: clampNostrBandLimit(limit),
					kinds: '30023',
				}
			)
		)
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
